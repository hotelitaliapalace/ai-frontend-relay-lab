# TASK-001 — Scaffold the accessible planner shell

## Owner

`deepseek`

## Goal

Create the first runnable frontend shell for Lignano Guest Planner without implementing itinerary generation.

## Context

Read:

- `PROJECT_BRIEF.md`
- `AI_WORKFLOW.md`
- `QUALITY_GATES.md`

The repository currently contains governance files only.

## In scope

- Scaffold Vite with React and TypeScript in the repository root.
- Create one responsive page with:
  - header and short introduction;
  - compact preference form shell;
  - stay duration, travel profile, and interest controls;
  - disabled or placeholder primary action;
  - empty itinerary preview with helpful copy.
- Use semantic HTML and CSS variables.
- Add a minimal component test setup.
- Preserve all governance files.

## Out of scope

- Itinerary generation logic.
- Provider APIs or runtime AI.
- Authentication, database, analytics, maps, or production deploy.
- External UI component libraries.

## Constraints

- Mobile-first.
- Calm hospitality visual direction, not a dashboard.
- No invented hotel or destination claims.
- Keyboard-accessible controls and visible focus.
- Add no dependency unless required for the specified stack or tests.

## Acceptance criteria

- [ ] `npm install` succeeds.
- [ ] `npm run build` succeeds.
- [ ] TypeScript check succeeds.
- [ ] At least one component test passes.
- [ ] No horizontal overflow at 360 px.
- [ ] All form controls have accessible names.
- [ ] No API keys or `.env` files are committed.
- [ ] `HANDOFF.json` is updated and points to `codex`.

## Required checks

```text
npm run test
npm run build
```

## Handoff target

`codex`

