# Quality Gates

Apply only gates relevant to the active task. Release requires all applicable items.

## Product and UX

- The primary user goal is obvious.
- The primary action is visually and verbally clear.
- Empty, error, loading, and success states are intentional when applicable.
- No unnecessary navigation, fields, or dashboard patterns.
- Copy is concise and does not invent destination or hotel facts.

## Responsive UI

- No horizontal overflow at 360 px.
- Layout remains usable at 768 px and 1280 px.
- Touch targets are practical on mobile.
- Typography, spacing, and hierarchy remain consistent.
- Screenshots are captured for material visual changes.

## Accessibility

- Semantic landmarks and headings are logical.
- Every control has an accessible name.
- Keyboard order is usable and focus is visible.
- Color is not the only carrier of meaning.
- Contrast and reduced-motion behavior are checked.

## Engineering

- TypeScript has no unexplained errors.
- Components have clear responsibilities.
- No unnecessary dependency or duplicated state.
- No secrets, debug output, dead code, or unrelated files.
- Error handling is proportional to the feature.

## Verification

- Required unit/component tests pass.
- Critical Playwright flow passes when present.
- Production build passes.
- Diff is reviewed against the task.
- `HANDOFF.json` validates against `handoff.schema.json`.

## Release

- CI is green.
- Preview is reviewed before production.
- Rollback path is known.
- Production requires explicit human approval.

