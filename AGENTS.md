# Codex Instructions

Read `AI_WORKFLOW.md`, `PROJECT_BRIEF.md`, `QUALITY_GATES.md`, and the active task before editing.

## Repository rules

- Work only on the active task and current branch.
- Preserve the project-owned design system and avoid unnecessary dependencies.
- Prefer semantic HTML, typed interfaces, small components, and testable behavior.
- Treat accessibility and responsive behavior as acceptance requirements.
- Run only relevant checks during iteration; run the full required gate before handoff.
- Update `HANDOFF.json`; do not paste long implementation narratives into chat.
- Do not add provider APIs, secrets, analytics, authentication, or production deploy unless the task explicitly authorizes them.

## Codex role

Codex is the refinement and verification stage unless the active task assigns another role. Review the existing diff first. Change only what improves correctness, UI/UX, accessibility, maintainability, or verification.

## Done when

- Task acceptance criteria pass.
- Relevant quality gates pass.
- Diff contains no unrelated changes.
- `HANDOFF.json` names the next role.

