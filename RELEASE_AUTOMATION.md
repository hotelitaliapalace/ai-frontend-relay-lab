# Claude release gate and GitHub Pages

The release workflow runs once after an accepted application or release-configuration change reaches `main`. It can also be started manually when a release must be repeated without a code change.

## Required secret

Create the repository Actions secret `ANTHROPIC_API_KEY`. Never paste its value into source files, issues, logs, or prompts.

## Automatic release

Merge a validated pull request that changes the application, package manifest, Vite configuration, or release workflow. Documentation-only changes do not call Claude or deploy the site.

## Manual repeat

1. Open **Actions**.
2. Select **Claude release gate and Pages deploy**.
3. Choose **Run workflow** on `main`.
4. Keep the default `claude-sonnet-5` model unless a stronger release review is explicitly required.

The workflow runs typecheck, tests, and a production build before sending a compact evidence bundle to Claude. A `FAIL` verdict blocks deployment. `PASS` and `PASS_WITH_NOTES` continue to GitHub Pages.

The JSON verdict is retained as a short-lived workflow artifact. Rollback is performed by reverting the release commit on `main` and running the workflow again.
