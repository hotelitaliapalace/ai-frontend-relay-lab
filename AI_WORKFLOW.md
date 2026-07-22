# Shared AI Workflow

This file is the common operating contract for DeepSeek, ChatGPT/Codex, and Claude. Provider-specific files may narrow these rules but must not contradict them.

## Source of truth

Priority order:

1. Active `TASKS/TASK-XXX.md`.
2. `PROJECT_BRIEF.md`.
3. `QUALITY_GATES.md`.
4. This file.
5. Existing code and tests.

Chats are not project memory. Decisions must be written to the repository.

## Roles

### DeepSeek — implementation

- Implement only the active task.
- Read only shared guidance, the task, and relevant files.
- Add or update tests required by the task.
- Run specified checks.
- Finish with one commit and a valid handoff.

### ChatGPT/Codex — refinement

- Review the task, diff, screenshots, and test results.
- Fix correctness, architecture, UI/UX, accessibility, and missing tests.
- Avoid rewriting working code for personal preference.
- Re-run affected checks and update the same handoff.

### Claude — release gate

- Review the final diff against `QUALITY_GATES.md`.
- Fix only confirmed release blockers.
- Verify build and CI evidence.
- Prepare the PR for release; do not deploy production directly.

### Human owner

- Approves scope changes, secrets, external services, merge, and production.

## Git contract

- One task per branch: `ai/task-XXX-short-name`.
- One draft PR per task.
- Do not work directly on `main`.
- Commit prefixes: `impl`, `refine`, `release`, `test`, `docs`.
- Never force-push after review begins.

## Handoff contract

Every worker updates `HANDOFF.json` using `handoff.schema.json`.

The handoff contains only:

- task and status;
- changed files;
- checks and results;
- concrete risks or open points;
- next role.

Do not include reasoning transcripts, full logs, full source files, or chat summaries.

## Token budget rules

- Task file: target 500 words, maximum 800.
- Handoff: maximum 1 KB when serialized.
- Final model message: maximum 8 bullets.
- Pass diffs, not complete repositories, when the tool allows it.
- Read only files relevant to the active task.
- Do not ask three models to solve trivial changes.
- Maximum one return loop to a previous role; unresolved disagreement goes to the human owner.
- Use parallel agents only for independent read-only checks.

## Security

- Never place API keys in prompts, source, logs, screenshots, or handoffs.
- Provider keys belong in local environment variables or GitHub Actions secrets.
- `.env` files are never committed.
- Production deploy requires explicit human approval.

## Completion

A task is complete only when its acceptance criteria and relevant quality gates pass, the handoff is valid, and no unrecorded material decision remains in chat.

