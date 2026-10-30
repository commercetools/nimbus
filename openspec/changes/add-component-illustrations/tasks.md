# Tasks

## 1. Kit, scripts and tests

- [x] 1.1 Add `src/illustration-kit/` (tokens, roles, primitives, icons, render, discover) and verify `illustration-kit.spec.ts` passes (radii, shadow, fallbacks, determinism)
- [x] 1.2 Add `scripts/illustrations/generate.ts` and `contact-sheet.ts` with root proxies and verify `pnpm illustrations:generate` and `pnpm illustrations:sheet` run
- [x] 1.3 Add `illustrations.spec.ts` (coverage, freshness, purity, structure, sanitizer parity, geometry) and verify `pnpm --filter @commercetools/nimbus test:unit` passes
- [x] 1.4 Add config edits (vite dts exclude, `.gitignore`, `scripts/clean.mjs`, `.gitattributes`) and verify `pnpm build` output has no `*illustration*` file
- [x] 1.5 Draw the 6 prototype illustrations (button, switch, data-table, date-range-picker, tooltip, visually-hidden) and verify the contact sheet in light and dark mode

## 2. Docs and tooling updates

- [x] 2.1 Add `docs/file-type-guidelines/illustrations.md` with a validation checklist and verify it is linked from the guidelines index
- [x] 2.2 Add `.claude/skills/writing-illustrations/SKILL.md` and update agents, commands, skills and docs that list file types; verify with `rg` that each list names the illustration files

## 3. Batch 1 illustrations (22)

- [x] 3.1 Draw layout, utility and abstract components from the design table and verify the light and dark contact sheet by eye
- [x] 3.2 Verify the unit test passes for every batch-1 illustration

## 4. Docs cards

- [x] 4.1 Add the `illustration` route field in docs-build and both zod schemas and verify the field reaches the docs route data
- [x] 4.2 Add `ComponentIllustration` and update `CategoryOverview` (grid and list) and verify with screenshots in light and dark mode
- [x] 4.4 Resolve illustrations for category pages from their children in the route manifest, show them as a small group, and verify with the resolver unit test and screenshots of `/components`
- [x] 4.3 Add a docs test for the id rewrite (same illustration twice) and verify it passes

## 5. Remaining illustrations (after Checkpoint 1 approval)

- [x] 5.1 Draw the remaining batches by category (Buttons, Inputs, Forms, Feedback, Data Display, Navigation, other, Patterns) and verify the contact sheet after each batch
- [x] 5.2 Remove the temporary pending list and verify the unit test passes

## 6. Final verification

- [ ] 6.1 Run `pnpm lint`, `pnpm typecheck:strict`, `pnpm check:package-shape`, `pnpm build`, `pnpm illustrations:generate` (no git diff) and `pnpm openspec validate --all --strict`
