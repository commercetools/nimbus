## 1. Types and Offset Calculation

- [ ] 1.1 Add `DataTableScrollToRowOptions` and `DataTableApi` with JSDoc on every member, and `apiRef?: Ref<DataTableApi>` on the `DataTable` and `DataTable.Root` props in `data-table.types.ts`; verify with `pnpm --filter @commercetools/nimbus typecheck:dev`
- [ ] 1.2 Write `utils/scroll-to-row.utils.spec.ts` first: every `align` value, `"nearest"` returns `null` for a fully visible row and takes the shorter direction otherwise, clamping at the first and last row, non-zero `topInset` and `bottomInset`; verify it fails
- [ ] 1.3 Implement `computeTargetScrollTop` in `utils/scroll-to-row.utils.ts` as the only place that knows about insets; verify `pnpm test packages/nimbus/src/components/data-table/utils/scroll-to-row.utils.spec.ts` passes

## 2. Handle Hook

- [ ] 2.1 Add the internal `registry` field (`rowElements`, `tableState`, `headerElement`) to `DataTableContextValue`; verify typecheck
- [ ] 2.2 Write `hooks/use-data-table-api.spec.ts` first (JSDOM, fake registry): `false` for an unknown key, a key hidden by search and a nested child key; a second call rejects the first with `AbortError`; unmount rejects a pending call; focused key is set except for a disabled row, which warns with `focus: true`; `"smooth"` becomes `"auto"` with reduced motion; the `"smooth"` Promise resolves through the two-frame fallback when `scrollend` never fires; nothing throws without `scrollTo`; `false` plus a development warning when the Table has not registered; verify it fails
- [ ] 2.3 Implement `hooks/use-data-table-api.ts` and export it from `hooks/index.ts`; verify the hook spec passes

## 3. Wiring and Stories

- [ ] 3.1 Create the registry once in `data-table.root.tsx`, put it in the context, and call `useDataTableApi` with `apiRef`; verify typecheck
- [ ] 3.2 Register the row element in `data-table.row.tsx` (ref callback merged with the existing ref), the header element in `data-table.header.tsx`, and the table state through a small internal component in `data-table.cell.tsx` that writes on every context change and clears only its own value; verify typecheck and the existing DataTable stories still pass
- [ ] 3.3 Write `data-table.scroll-to-row.stories.tsx` with play functions: each `align` value within 1px below the header; `"nearest"` does not move a visible row; first and last rows clamp; a key hidden by search resolves `false` without scrolling; a disabled row scrolls and keeps focus unchanged; `focus: true` moves DOM focus; reduced motion (`emulateMedia`) scrolls instantly; `getScrollContainer()` returns the root element; a call from an effect right after a sort change resolves `true`; a second call rejects the first with `AbortError`; verify with `pnpm test:dev packages/nimbus/src/components/data-table/data-table.scroll-to-row.stories.tsx`
- [ ] 3.4 If the story for the call after a sort change fails, change the wait in design decision 3 and report it to the user; verify the story passes

## 4. Documentation

- [ ] 4.1 Add a hand-written section "Scroll to a row (`apiRef`)" to `data-table.dev.mdx`: both methods and options, "call after the rows have rendered", an example whose `catch` ignores `AbortError`, the focus rule, which keys resolve `false`; verify the docs build renders the section
- [ ] 4.2 Add examples to `data-table.docs.spec.tsx`: `scrollToRow` for an unknown key expects `false`, and the recommended `catch` that ignores `AbortError`; verify `pnpm test packages/nimbus/src/components/data-table/data-table.docs.spec.tsx` passes
- [ ] 4.3 Check `.claude/skills/`, `.claude/commands/` and `docs/` for DataTable references that need the same update; verify with `rg`

## 5. Release and Integration Checks

- [ ] 5.1 Add a minor changeset for `@commercetools/nimbus` written from the consumer's view (see `docs/changeset-conventions.md`); verify with `pnpm changeset:status`
- [ ] 5.2 Run `pnpm --filter @commercetools/nimbus typecheck:dev`, `pnpm lint`, and the DataTable story and unit tests; verify all pass
- [ ] 5.3 Run `pnpm exec openspec validate add-data-table-scroll-to-row --strict`; verify it passes

## Workflow follow-up

- Archive the change when its PR merges.
- FEC-1484 adds the sticky stacks to the `topInset` and `bottomInset` inputs of the offset function.
