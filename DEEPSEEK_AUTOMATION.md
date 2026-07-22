# DeepSeek automation

This repository uses a manually triggered GitHub Actions workflow to implement one approved task on an isolated branch.

## Security model

- The API key exists only as the GitHub Actions secret `DEEPSEEK_API_KEY`.
- The workflow never prints the key or sends it to any service other than the official DeepSeek API endpoint.
- Only `TASKS/TASK-001.md` can be selected.
- Generated paths are limited to the frontend scaffold and `src/` or `public/`.
- Governance files, workflows, scripts, secrets, and `main` are protected from model writes.
- Dependencies are restricted to the approved React, Vite, TypeScript, Vitest, and Testing Library stack.
- A failed typecheck, test, or build stops publication.
- Successful output is pushed to `ai/task-001-planner-shell` and opened as a draft pull request for Codex review.

## Manual run

1. Open the repository's **Actions** tab.
2. Select **DeepSeek task runner**.
3. Choose **Run workflow** from `main`.
4. Keep `TASKS/TASK-001.md` and issue `2` selected.
5. Start the workflow once and inspect its logs.

Do not rerun while the task branch exists. A rerun intentionally stops instead of overwriting prior work.
