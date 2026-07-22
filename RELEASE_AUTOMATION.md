# Claude release gate and GitHub Pages

The release workflow is deliberately manual so Claude is called only once per intended release.

## Required secret

Create the repository Actions secret `ANTHROPIC_API_KEY`. Never paste its value into source files, issues, logs, or prompts.

## Release

1. Open **Actions**.
2. Select **Claude release gate and Pages deploy**.
3. Choose **Run workflow** on `main`.
4. Keep the default `claude-sonnet-5` model unless a stronger release review is explicitly required.

The workflow runs typecheck, tests, and a production build before sending a compact evidence bundle to Claude. A `FAIL` verdict blocks deployment. `PASS` and `PASS_WITH_NOTES` continue to GitHub Pages.

The JSON verdict is retained as a short-lived workflow artifact. Rollback is performed by reverting the release commit on `main` and running the workflow again.
