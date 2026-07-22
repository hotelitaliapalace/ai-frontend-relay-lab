# AI Frontend Relay Lab

Learning repository for a token-efficient, multi-model frontend workflow.

## Project

**Lignano Guest Planner** — a responsive web interface that will help a guest shape a simple stay itinerary from trip duration, interests, travel profile, and preferred activities.

## Current phase

Phase 1 only: project governance, quality gates, task format, and model handoff contract. Application code and provider automations have not been created yet.

## Shared workflow

1. DeepSeek implements a narrowly scoped task.
2. ChatGPT/Codex reviews and refines the diff, UI/UX, accessibility, and tests.
3. Claude performs the release review and fixes only release blockers.
4. CI runs checks and creates a preview.
5. A human approves production.

Read `PROJECT_BRIEF.md`, `AI_WORKFLOW.md`, and the active file in `TASKS/` before making changes.

