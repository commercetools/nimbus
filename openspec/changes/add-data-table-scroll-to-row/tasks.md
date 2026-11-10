## 1. Types and Offset Calculation

- [x] 1.1 Add `DataTableScrollToRowOptions` and `DataTableApi` with JSDoc on
      every member, and `apiRef?: Ref<DataTableApi>` on the `DataTable` and
      `DataTable.Root` props in `data-table.types.ts`; verify with
      `pnpm --filter @commercetools/nimbus typecheck:dev`
- [x] 1.2 Write `utils/scroll-to-row.utils.spec.ts` first: every `align` value,
      `"nearest"` returns `null` for a fully visible row and takes the shorter
      direction otherwise, clamping at the first and last row, non-zero
      `topInset` and `bottomInset`; verify it fails
- [x] 1.3 Implement `computeTargetScrollTop` in `utils/scroll-to-row.utils.ts`
      as the only place that knows about insets; verify
      `pnpm test packages/nimbus/src/components/data-table/utils/scroll-to-row.utils.spec.ts`
      passes

## 2. Handle Hook

- [x] 2.1 Add the internal registry (`rowElements`, `tableState`,
      `headerElement`) to the context type; verify typecheck
- [x] 2.2 Write `hooks/use-data-table-api.spec.ts` first (JSDOM, fake registry):
      `false` for an unknown key, a key hidden by search and a nested child key;
      a second call rejects the first with `AbortError`; unmount rejects a
      pending call; the focused key is set, and a disabled row changes no focus
      and warns with `focus: true`; `"auto"` calls `scrollTo` with `"instant"`;
      `"smooth"` becomes `"instant"` with reduced motion; a smooth call whose
      target equals `scrollTop` resolves at once; a smooth call resolves on
      `scrollend` when it exists and through the two-frame fallback when
      `scrollend` is not supported; nothing throws without `scrollTo`; `false`
      with a development warning when no Table has registered; verify it fails
- [x] 2.3 Implement `hooks/use-data-table-api.ts` and export it from
      `hooks/index.ts`; verify the hook spec passes

## 3. Wiring and Stories

- [x] 3.1 Create the registry once in `data-table.root.tsx`, put it in the
      context, and call the hook with `apiRef`; verify typecheck
- [x] 3.2 Register the row element from the row's ref callback (merged with the
      existing ref) in `data-table.row.tsx`, the header element in
      `data-table.header.tsx`, and the table state through a small internal
      component in column content that writes on every context change and clears
      only its own value; verify typecheck and that the existing DataTable
      stories still pass
- [ ] 3.3 Write `data-table.scroll-to-row.stories.tsx` with play functions: each
      `align` value ends at the expected position below the header; `"nearest"`
      does not move a visible row; first and last rows clamp; a key hidden by
      search resolves `false` without scrolling; a nested child key resolves
      `false`; a disabled row scrolls and keeps focus unchanged; `focus: true`
      moves DOM focus and keeps the alignment; the focused key is set without
      `focus: true`; reduced motion (`emulateMedia`) scrolls instantly;
      `"smooth"` resolves after scrolling stops; `getScrollContainer()` returns
      the root element; a call from an effect right after a sort change resolves
      `true`; a second call rejects the first with `AbortError`; unmounting
      rejects a pending call; verify with
      `pnpm test:dev packages/nimbus/src/components/data-table/data-table.scroll-to-row.stories.tsx`
- [ ] 3.4 If the story for the call after a sort change fails, stop and report
      the result to the user before changing design decision 9; verify the story
      passes

## 4. Documentation

- [ ] 4.1 Add a hand-written section "Scroll to a row (`apiRef`)" to
      `data-table.dev.mdx`: both methods and options, "call after the rows have
      rendered", an example whose `catch` ignores `AbortError`, the focus rule,
      which keys resolve `false`; verify the docs app renders the section
- [ ] 4.2 Add examples to `data-table.docs.spec.tsx`: `scrollToRow` for an
      unknown key expects `false`, and the recommended `catch` that ignores
      `AbortError`; verify
      `pnpm test packages/nimbus/src/components/data-table/data-table.docs.spec.tsx`
      passes
- [ ] 4.3 Check `.claude/skills/`, `.claude/commands/` and `docs/` for DataTable
      references that need the same update; verify with `rg`

## 5. Release and Integration Checks

- [ ] 5.1 Add a minor changeset for `@commercetools/nimbus` written from the
      consumer's view (`docs/changeset-conventions.md`); verify with
      `pnpm changeset:status`
- [ ] 5.2 Run `pnpm --filter @commercetools/nimbus typecheck:dev`, `pnpm lint`,
      and the DataTable story and unit tests; verify all pass
- [ ] 5.3 Run
      `pnpm exec openspec validate add-data-table-scroll-to-row --strict`;
      verify it passes

## Workflow follow-up

- Archive the change when its PR merges.
- FEC-1484 adds the sticky stacks to the `topInset` and `bottomInset` inputs of
  the offset function.
