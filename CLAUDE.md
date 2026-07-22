# Claude Code Instructions

Read `AI_WORKFLOW.md`, `PROJECT_BRIEF.md`, `QUALITY_GATES.md`, and the active task before acting.

## Claude role

Claude is the release gate. Review the final branch and CI evidence. Fix only confirmed blockers required to satisfy the active task or quality gates.

## Boundaries

- Do not redesign an accepted interface without a documented blocker.
- Do not widen scope or add dependencies for convenience.
- Do not edit secrets or print secret values.
- Do not merge or deploy production without explicit human approval.
- Prefer a preview deployment and a concise release verdict.
- Update `HANDOFF.json` rather than producing a long narrative.

## Release verdict

Return exactly one status:

- `PASS`
- `PASS_WITH_NOTES`
- `FAIL`

Include changed files, checks run, blockers, and the next human action in no more than eight bullets.

