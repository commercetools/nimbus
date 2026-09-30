Each story task follows red/green: write the story with its play function, run
it once against the previous code and see it fail, then fix. Paths are relative
to `packages/nimbus/src/components/data-table/`.

## 1. Render cost (ticket sections 1 and 3)

- [x] 1.1 Measure render counts per component before the change (proposal.md)
- [x] 1.2 Stories: `RowInteractionsRenderOnlyThatRow`,
      `InlineArraysKeepRowsMemoized`; both fail on the previous code
- [x] 1.3 `context.tsx`: `DataTableRowContext` and `useDataTableRowContext`;
      JSDoc on each hook
- [x] 1.4 Header, Manager, layout settings panel, Column and Body read
      `useStableDataTableContext`; Table reads the configuration and the
      interaction context separately; Column takes `sortDirection` from React
      Aria's render props
- [x] 1.5 `hooks/use-stable-array.ts` with unit tests; applied to `rows`,
      `columns`, `visibleColumns` and `pinnedRowIds` in `root.tsx`
- [x] 1.6 `body.tsx`: pinned positions from a `Map`; position flags `false`
      for rows that are not pinned
- [x] 1.7 `utils/rows.utils.ts`: keep `nestedKey` rows that did not change;
      `rows.utils.spec.ts`
- [x] 1.8 Measure again (proposal.md)
- [x] 1.9 Check in-place row mutation on the previous and the new code (D3)

## 2. Pinned row outline (ticket section 3, correctness edge)

- [x] 2.1 Reproduce in Chromium: rows 1 and 2 pinned, search hides row 1
- [x] 2.2 Story `PinnedRowOutlineFollowsSearch`; fails on the previous code
- [x] 2.3 `root.tsx`: `pinnedRowIds` from `sortedRows`

## 3. Recipe (ticket sections 4 and 5)

- [x] 3.1 Record computed styles and screenshots with the previous recipe
- [x] 3.2 One header definition; named `zIndex` scale
- [x] 3.3 Duplicate pinned-row rules removed; pinned-row level kept as one
      explicit rule (D6)
- [x] 3.4 `~` in the header offsets; tokens for durations and sizes;
      `--data-table-*` custom properties; dead slots removed; `density.default`
      empty; `defaultVariants`
- [x] 3.5 Compare computed styles and screenshots (D6)

## 4. JSDoc and file hygiene (ticket sections 6 and 7)

- [x] 4.1 `row.tsx`: component JSDoc on the `memo` export, checked with
      `react-docgen-typescript` (D7); click handling docs reattached
- [x] 4.2 `data-table.tsx`: `DataTable.Row` example renders `DataTable.Row`
- [x] 4.3 `constants.tsx` and `utils/rows.utils.tsx` renamed to `.ts`
- [x] 4.4 Header slot typed as `thead`
- [x] 4.5 `types.ts`: `density` JSDoc says it changes the vertical padding
- [x] 4.6 Stories split into topic files (D8); story names compared before and
      after
- [x] 4.7 Document the split in `docs/file-type-guidelines/stories.md` and the
      `writing-stories` skill

## 5. Docs and validation

- [x] 5.1 `data-table.dev.mdx`: "When rows render again"
- [x] 5.2 Changeset
- [x] 5.3 `typecheck:dev`, lint, `pnpm test:dev` for DataTable
- [x] 5.4 `pnpm test:storybook` against the built bundle
- [ ] 5.5 Chromatic: no unexplained visual diff
