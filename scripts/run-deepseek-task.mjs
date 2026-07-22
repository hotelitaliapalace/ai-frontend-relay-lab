import { execFileSync } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const [mode, requestedTaskPath] = process.argv.slice(2);
const taskPath = requestedTaskPath?.replaceAll("\\", "/");
const metadataPath = path.join(root, ".deepseek-run.json");

const contextPaths = [
  "PROJECT_BRIEF.md",
  "AI_WORKFLOW.md",
  "QUALITY_GATES.md",
  "AGENTS.md",
  "CLAUDE.md",
  "HANDOFF.json",
];

const exactAllowedPaths = new Set([
  "package.json",
  "index.html",
  "vite.config.ts",
  "vitest.config.ts",
  "tsconfig.json",
  "tsconfig.app.json",
  "tsconfig.node.json",
]);

const allowedDependencies = new Set(["react", "react-dom"]);
const allowedDevDependencies = new Set([
  "@testing-library/jest-dom",
  "@testing-library/react",
  "@testing-library/user-event",
  "@types/react",
  "@types/react-dom",
  "@vitejs/plugin-react",
  "jsdom",
  "typescript",
  "vite",
  "vitest",
]);

function fail(message) {
  throw new Error(message);
}

function assertTaskPath(value) {
  if (!/^TASKS\/TASK-[0-9]{3}\.md$/.test(value ?? "")) {
    fail("Task path must match TASKS/TASK-XXX.md");
  }
  if (value !== "TASKS/TASK-001.md") {
    fail("Only TASK-001 is enabled in this learning workflow");
  }
}

function assertGeneratedPath(value) {
  if (typeof value !== "string" || value.length === 0 || value.includes("\\")) {
    fail("Generated file path is invalid");
  }

  const normalized = path.posix.normalize(value);
  if (normalized !== value || normalized.startsWith("../") || path.posix.isAbsolute(value)) {
    fail(`Generated path escapes the repository: ${value}`);
  }

  const allowed =
    exactAllowedPaths.has(value) ||
    (value.startsWith("src/") && value.length > 4) ||
    (value.startsWith("public/") && value.length > 7);

  if (!allowed) {
    fail(`DeepSeek attempted to modify a protected path: ${value}`);
  }
}

function assertNoSecrets(value, label) {
  const secretPatterns = [
    /sk-[A-Za-z0-9_-]{16,}/,
    /DEEPSEEK_API_KEY\s*[=:]\s*[^$\s]/,
    /ANTHROPIC_API_KEY\s*[=:]\s*[^$\s]/,
  ];
  if (secretPatterns.some((pattern) => pattern.test(value))) {
    fail(`Possible credential detected in ${label}`);
  }
}

function assertStringArray(value, label, maximum) {
  if (!Array.isArray(value) || value.length > maximum) {
    fail(`${label} must be an array with at most ${maximum} items`);
  }
  for (const item of value) {
    if (typeof item !== "string" || item.length === 0 || item.length > 180) {
      fail(`${label} contains an invalid item`);
    }
  }
}

function validatePackageJson(content) {
  let packageJson;
  try {
    packageJson = JSON.parse(content);
  } catch {
    fail("Generated package.json is not valid JSON");
  }

  for (const script of ["build", "test", "typecheck"]) {
    if (typeof packageJson.scripts?.[script] !== "string") {
      fail(`package.json must define the ${script} script`);
    }
  }
  if (!/vitest\s+run/.test(packageJson.scripts.test)) {
    fail("The test script must run Vitest non-interactively");
  }

  for (const [section, allowed] of [
    ["dependencies", allowedDependencies],
    ["devDependencies", allowedDevDependencies],
  ]) {
    for (const dependency of Object.keys(packageJson[section] ?? {})) {
      if (!allowed.has(dependency)) {
        fail(`Dependency is outside the approved stack: ${dependency}`);
      }
    }
  }
}

function validateRelativeImports(files) {
  const generatedPaths = new Set(files.map((file) => file.path));
  const extensions = ["", ".ts", ".tsx", ".js", ".jsx", ".css", ".json"];
  const indexFiles = ["index.ts", "index.tsx", "index.js", "index.jsx"];
  const unresolved = [];

  for (const file of files) {
    if (!/\.(?:ts|tsx|js|jsx|css)$/.test(file.path)) continue;

    const specifiers = new Set();
    const patterns = [
      /(?:from\s*|import\s*)["'](\.[^"']+)["']/g,
      /import\s*\(\s*["'](\.[^"']+)["']\s*\)/g,
    ];
    for (const pattern of patterns) {
      for (const match of file.content.matchAll(pattern)) specifiers.add(match[1]);
    }

    for (const specifier of specifiers) {
      const base = path.posix.normalize(path.posix.join(path.posix.dirname(file.path), specifier));
      const candidates = [
        ...extensions.map((extension) => `${base}${extension}`),
        ...indexFiles.map((indexFile) => `${base}/${indexFile}`),
      ];
      if (!candidates.some((candidate) => generatedPaths.has(candidate))) {
        unresolved.push(`${file.path} -> ${specifier}`);
      }
    }
  }

  if (unresolved.length > 0) {
    fail(`Generated relative imports do not resolve: ${unresolved.join(", ")}`);
  }
}

async function readText(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function buildPrompt() {
  const sections = [];
  for (const relativePath of [taskPath, ...contextPaths]) {
    sections.push(`\n--- ${relativePath} ---\n${await readText(relativePath)}`);
  }

  return `Implement the task using only the repository context below.

Return one JSON object and no prose. It must have exactly this shape:
{
  "summary": "short implementation summary",
  "open_points": ["optional concise point"],
  "files": [
    {"path": "package.json", "content": "complete UTF-8 file content"}
  ]
}

Rules:
- Produce complete files, never patches or Markdown fences.
- Include package.json, index.html, TypeScript configuration, Vite configuration, and all required src files.
- Use React, React DOM, Vite, TypeScript, Vitest, jsdom, and Testing Library only.
- Define npm scripts named typecheck, test, and build. The test script must use "vitest run".
- Use semantic HTML, CSS variables, mobile-first CSS, visible focus states, and accessible names.
- Keep the primary action disabled or explicitly marked as a non-functional placeholder.
- Do not create API calls, secrets, environment files, tracking, authentication, maps, databases, deployment, or runtime AI.
- Do not modify governance files, TASKS, .github, scripts, README, CLAUDE.md, AGENTS.md, or HANDOFF.json.
- Keep the implementation compact and project-owned; no UI component library.
- The files array may contain only package.json, index.html, vite.config.ts, vitest.config.ts, tsconfig*.json, src/**, or public/**.
- Every relative import must resolve to another file included in the JSON files array. Include every imported CSS file.
- Output valid JSON.

Repository context:
${sections.join("\n")}`;
}

async function requestImplementation(prompt) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) fail("DEEPSEEK_API_KEY is not configured");

  const requestBody = {
    model: process.env.DEEPSEEK_MODEL || "deepseek-v4-pro",
    messages: [
      {
        role: "system",
        content:
          "You are the implementation role in a controlled coding relay. Follow the task and return only the requested JSON object.",
      },
      { role: "user", content: prompt },
    ],
    thinking: { type: "enabled" },
    reasoning_effort: "high",
    response_format: { type: "json_object" },
    max_tokens: 32000,
    stream: false,
  };

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(300_000),
    });

    if (!response.ok) {
      fail(`DeepSeek API request failed with HTTP ${response.status}`);
    }

    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content === "string" && content.trim()) {
      const usage = payload.usage ?? {};
      console.log(
        `DeepSeek usage: input=${usage.prompt_tokens ?? "unknown"}, output=${usage.completion_tokens ?? "unknown"}`,
      );
      return content;
    }

    console.log(`DeepSeek returned empty content on attempt ${attempt}; retrying`);
  }

  fail("DeepSeek returned empty content twice");
}

async function generate() {
  assertTaskPath(taskPath);
  const prompt = await buildPrompt();
  let result;
  let validationFeedback = "";
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    const raw = await requestImplementation(`${prompt}${validationFeedback}`);
    try {
      assertNoSecrets(raw, "DeepSeek response");
      result = JSON.parse(raw);

      if (typeof result.summary !== "string" || result.summary.length > 240) {
        fail("DeepSeek summary is missing or too long");
      }
      assertStringArray(result.open_points ?? [], "open_points", 8);
      if (!Array.isArray(result.files) || result.files.length === 0 || result.files.length > 30) {
        fail("DeepSeek files must contain between 1 and 30 entries");
      }

      const seen = new Set();
      let totalBytes = 0;
      for (const file of result.files) {
        assertGeneratedPath(file?.path);
        if (seen.has(file.path)) fail(`Duplicate generated path: ${file.path}`);
        seen.add(file.path);
        if (typeof file.content !== "string" || file.content.includes("\0")) {
          fail(`Generated content is invalid: ${file.path}`);
        }
        assertNoSecrets(file.content, file.path);
        totalBytes += Buffer.byteLength(file.content, "utf8");
      }

      if (totalBytes > 500_000) fail("Generated project exceeds the 500 KB safety limit");
      if (!seen.has("package.json")) fail("DeepSeek did not generate package.json");

      const packageFile = result.files.find((file) => file.path === "package.json");
      validatePackageJson(packageFile.content);
      validateRelativeImports(result.files);
      break;
    } catch (error) {
      if (attempt === 2) throw error;
      console.log(`Generated candidate failed validation: ${error.message}`);
      validationFeedback = `\n\nYour previous JSON failed validation: ${error.message}. Return a complete corrected JSON candidate.`;
      result = undefined;
    }
  }

  if (!result) fail("DeepSeek did not produce a valid candidate");

  for (const file of result.files) {
    const destination = path.join(root, ...file.path.split("/"));
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, file.content, "utf8");
  }

  await writeFile(
    metadataPath,
    JSON.stringify(
      { summary: result.summary, open_points: result.open_points ?? [] },
      null,
      2,
    ),
    "utf8",
  );
  console.log(`Validated and wrote ${result.files.length} generated files`);
}

async function finalize() {
  assertTaskPath(taskPath);
  const metadata = JSON.parse(await readFile(metadataPath, "utf8"));
  assertStringArray(metadata.open_points ?? [], "open_points", 8);

  const output = execFileSync(
    "git",
    ["ls-files", "--modified", "--others", "--exclude-standard"],
    { cwd: root, encoding: "utf8" },
  );
  const changedFiles = output
    .split("\n")
    .map((value) => value.trim())
    .filter((value) => value && value !== ".deepseek-run.json")
    .sort();

  if (changedFiles.length === 0 || changedFiles.length > 30) {
    fail("Unexpected number of changed files while finalizing the handoff");
  }

  const handoff = {
    task: "TASK-001",
    status: "implemented",
    actor: "deepseek",
    changed_files: [...changedFiles, "HANDOFF.json"].sort(),
    checks: [
      { name: "npm run typecheck", result: "pass" },
      { name: "npm run test", result: "pass" },
      { name: "npm run build", result: "pass" },
    ],
    open_points: metadata.open_points ?? [],
    next_role: "codex",
  };

  await writeFile(
    path.join(root, "HANDOFF.json"),
    `${JSON.stringify(handoff, null, 2)}\n`,
    "utf8",
  );
  await rm(metadataPath, { force: true });
  console.log("HANDOFF.json finalized for Codex review");
}

try {
  if (mode === "generate") await generate();
  else if (mode === "finalize") await finalize();
  else fail("Usage: run-deepseek-task.mjs <generate|finalize> TASKS/TASK-XXX.md");
} catch (error) {
  console.error(`DeepSeek task runner failed: ${error.message}`);
  process.exitCode = 1;
}
