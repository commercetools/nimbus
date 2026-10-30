# Proposal

## Why

The docs overview pages show every component as a text card with a generic
icon. Components are hard to tell apart at a glance. A drawn picture for every
component makes the overview easier to scan. Without a rule and a test,
pictures would be missing for new components and would drift apart in style.

## What Changes

- Add one 96×96 SVG illustration for every component, derivative and pattern
  that has a main doc page (106 in total).
- Add a small drawing kit (not published) so every illustration has the same
  look: Nimbus colors, Nimbus corner radii, light and dark mode, CSS variables
  only.
- Add a generator that writes the committed `.illustration.svg` from each
  `.illustration.ts` source, and a contact-sheet tool to review them.
- Add a unit test that fails when a component has no illustration, when an
  SVG is out of date, or when a source or SVG breaks the rules.
- Show the illustration on the docs overview cards (grid and list).
- Add a writing guideline, a skill, and updates to the existing agents,
  commands and docs, so new components get an illustration.

No consumer-facing API changes. Nothing is added to the npm package.

## Capabilities

### New Capabilities

- `nimbus-illustrations`: coverage, visual language, theme-aware colors,
  sanitizer-safe output and freshness rules for component illustrations.

### Modified Capabilities

- `nimbus-core`: "Consistent File Structure" lists the illustration source and
  generated SVG as required files.
- `docs-app`: overview cards show the component illustration.

## Impact

- `packages/nimbus/src/illustration-kit/` (new), `packages/nimbus/scripts/illustrations/` (new),
  `*.illustration.ts` and `*.illustration.svg` in every component, derivative and pattern folder.
- `packages/nimbus/vite.config.ts` (type-declaration exclude), `.gitignore`,
  `scripts/clean.mjs`, `.gitattributes`.
- `packages/nimbus-docs-build` and `apps/docs` (route field, new
  `ComponentIllustration`, `CategoryOverview`).
- `.claude/` skills, commands and agents, and `docs/` guidelines.
- No changeset: nothing ships to npm.
