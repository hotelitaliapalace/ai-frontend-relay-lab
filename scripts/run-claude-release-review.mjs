import { readFile, writeFile } from 'node:fs/promises';

const apiKey = process.env.ANTHROPIC_API_KEY;
const model = process.env.CLAUDE_MODEL || 'claude-sonnet-5';

if (!apiKey) {
  throw new Error('Missing ANTHROPIC_API_KEY GitHub Actions secret.');
}

const reviewFiles = [
  'PROJECT_BRIEF.md',
  'QUALITY_GATES.md',
  'TASKS/TASK-001.md',
  'HANDOFF.json',
  'package.json',
  'vite.config.ts',
  'src/App.tsx',
  'src/App.test.tsx',
  'src/components/Header.tsx',
  'src/components/PreferenceForm.tsx',
  'src/components/ItineraryPreview.tsx',
  'src/styles.css',
];

const sections = [];
for (const path of reviewFiles) {
  sections.push(`\n--- ${path} ---\n${await readFile(path, 'utf8')}`);
}

const prompt = `You are the release gate for a small frontend task.
Review only the supplied repository evidence against the brief, active task, and applicable quality gates.
CI has already run typecheck, component tests, and the production build; do not invent runtime evidence.
Be concise and conservative. Do not propose redesigns or new scope.

Return JSON only, with exactly this shape:
{
  "status": "PASS" | "PASS_WITH_NOTES" | "FAIL",
  "summary": "one sentence",
  "blockers": ["confirmed release blocker"],
  "notes": ["non-blocking observation"],
  "checks_reviewed": ["short check name"]
}

Use FAIL only for a confirmed blocker visible in the supplied evidence.
${sections.join('')}`;

const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
  },
  body: JSON.stringify({
    model,
    max_tokens: 2000,
    thinking: { type: 'disabled' },
    output_config: { effort: 'low' },
    system: 'Act as a concise software release reviewer. Output valid JSON only.',
    messages: [{ role: 'user', content: prompt }],
  }),
});

if (!response.ok) {
  const detail = await response.text();
  throw new Error(`Claude API request failed (${response.status}): ${detail.slice(0, 500)}`);
}

const payload = await response.json();
const text = payload.content?.filter((block) => block.type === 'text').map((block) => block.text).join('\n').trim();
if (!text) throw new Error('Claude returned no text verdict.');

let verdict;
try {
  verdict = JSON.parse(text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, ''));
} catch {
  throw new Error('Claude verdict was not valid JSON.');
}

if (!['PASS', 'PASS_WITH_NOTES', 'FAIL'].includes(verdict.status)) {
  throw new Error('Claude verdict contains an invalid status.');
}

await writeFile('claude-release-verdict.json', `${JSON.stringify({ ...verdict, model, usage: payload.usage }, null, 2)}\n`);

const summary = process.env.GITHUB_STEP_SUMMARY;
if (summary) {
  await writeFile(summary, `## Claude release gate\n\n**${verdict.status}** — ${verdict.summary}\n\nModel: \`${model}\`\n`, { flag: 'a' });
}

console.log(`Claude release verdict: ${verdict.status}`);
if (verdict.status === 'FAIL') process.exitCode = 1;
