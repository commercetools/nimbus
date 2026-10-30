# Tasks

## 1. Kit, scripts and tests

- [ ] 1.1 Add `src/illustration-kit/` (tokens, roles, primitives, icons, render, discover) and verify `illustration-kit.spec.ts` passes (radii, shadow, fallbacks, determinism)
- [ ] 1.2 Add `scripts/illustrations/generate.ts` and `contact-sheet.ts` with root proxies and verify `pnpm illustrations:generate` and `pnpm illustrations:sheet` run
- [ ] 1.3 Add `illustrations.spec.ts` with the `PENDING` set and verify `pnpm --filter @commercetools/nimbus test:unit` passes
- [ ] 1.4 Add config edits (vite dts exclude, `.gitignore`, `scripts/clean.mjs`, `.gitattributes`) and verify `pnpm build` output has no `*illustration*` file
- [ ] 1.5 Draw the 6 prototype illustrations (button, switch, data-table, date-range-picker, tooltip, visually-hidden) and verify the contact sheet in light and dark mode

## 2. Docs and tooling updates

- [ ] 2.1 Add `docs/file-type-guidelines/illustrations.md` with a validation checklist and verify it is linked from the guidelines index
- [ ] 2.2 Add `.claude/skills/writing-illustrations/SKILL.md` and update agents, commands, skills and docs that list file types; verify with `rg` that each list names the illustration files

## 3. Batch 1 illustrations (22)

- [ ] 3.1 Draw layout, utility and abstract components from the design table and verify the light and dark contact sheet by eye
- [ ] 3.2 Remove the drawn names from `PENDING` and verify the unit test passes

## 4. Docs cards

- [ ] 4.1 Add the `illustration` route field in docs-build and both zod schemas and verify the field reaches the docs route data
- [ ] 4.2 Add `ComponentIllustration` and update `CategoryOverview` (grid and list) and verify with screenshots in light and dark mode
- [ ] 4.3 Add a docs test for the id rewrite (same illustration twice) and verify it passes

## 5. Remaining illustrations (after Checkpoint 1 approval)

- [ ] 5.1 Draw the remaining batches by category (Buttons, Inputs, Forms, Feedback, Data Display, Navigation, other, Patterns) and verify the contact sheet after each batch
- [ ] 5.2 Delete `PENDING` and verify the unit test passes

## 6. Final verification

- [ ] 6.1 Run `pnpm lint`, `pnpm typecheck:strict`, `pnpm check:package-shape`, `pnpm build`, `pnpm illustrations:generate` (no git diff) and `pnpm openspec validate --all --strict`
