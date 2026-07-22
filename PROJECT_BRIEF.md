# Project Brief

## Product

Lignano Guest Planner is a small responsive web application for planning a stay through a clear, friendly interface.

## Learning goal

Use one real project to learn task definition, Git branches, model handoffs, UI/UX review, automated checks, preview deployment, and controlled production release.

## Primary user

A guest who wants a quick visual suggestion without creating an account or completing a long form.

## Version 1 scope

- One responsive page.
- Stay duration selector.
- Travel profile selector.
- Interest and activity choices.
- A clear itinerary preview area.
- Keyboard-accessible controls and visible focus states.
- No authentication, database, external API, tracking, or payment.

## Technical direction

- React, TypeScript, and Vite.
- CSS variables and project-owned components.
- Vitest for unit/component checks.
- Playwright for critical browser flow.
- GitHub Actions for CI and preview deployment.
- Static output suitable for GitHub Pages.

## Product principles

- Mobile-first and understandable without instructions.
- One primary action per view.
- Calm hospitality tone, not a generic dashboard.
- Accessible before decorative.
- No invented hotel or destination claims in version 1.

## Not in scope

- AI-generated itineraries at runtime.
- User accounts or saved profiles.
- Production deployment during the learning setup.
- UI frameworks or component libraries unless a later task explicitly approves one.

## Success for the first release

- A new user can complete the preference flow without help.
- Layout works at 360 px, 768 px, and 1280 px.
- Keyboard navigation and basic accessibility checks pass.
- Build, tests, and preview deployment pass in CI.
- Production remains a human approval gate.

