## 0. Base

- [ ] 0.1 After PR #2007 is on `main` and #2039 is rebased onto it, rebase this branch onto #2039 and run `pnpm nimbus:clean` + `pnpm extract-intl`
- [ ] 0.2 Re-add the spike's size stories (local commit `255c51589` on `tmp/fec-1145-on-2007`) and find the cause of the virtualized header height difference

## 1. Spike cleanup

- [ ] 1.1 Delete `data-table.virtualizer-spike.stories.tsx` and the temporary `DataTableSpikeVirtualizerContext` in `data-table.table.tsx`

## 2. Virtualizer: sticky table columns and type export

- [ ] 2.1 Write a failing story: in the `TableLayout` Virtualizer story, a column named in `stickyColumns` stays in the DOM and at the left edge after scrolling sideways
- [ ] 2.2 Add the table layout subclass that overrides `isStickyColumn` (columns by key, cells by their column), and the internal `stickyColumns` prop for `layout="table"`
- [ ] 2.3 Export the type `VirtualizerTableLayoutOptions`; update `virtualizer.exports.spec.tsx` (type resolves, `Virtualizer` and layouts still not exported)

## 3. DataTable props and wiring

- [ ] 3.1 Add `isVirtualized` and `virtualizerOptions` to the DataTable and Root prop types, with experimental JSDoc
- [ ] 3.2 Write a failing story: `isVirtualized` with 1,000 rows renders fewer than 60 rows, `aria-rowcount="1001"`, `data-virtualized` on the root
- [ ] 3.3 Root: read the props (not forwarded), put them in the stable context, set `data-virtualized`, call `useVirtualizerOptionsWarning`
- [ ] 3.4 Give the expand column a fixed id; Table: render `<Virtualizer layout="table" stickyColumns={…} layoutOptions={merged}>` around the slot when virtualized
- [ ] 3.5 Add `constants/virtualization.constants.ts` with estimated row and heading heights per `size` (and `xl` with the deprecated `density="condensed"`) from `themeTokens`; write the estimates-match story for every size first

## 4. Recipe

- [ ] 4.1 Write failing assertions at every size: row height equals cell height, header height equals column header height and the non-virtualized header, selected row background behind every cell, row separators present
- [ ] 4.2 Add `&[data-virtualized]` rules: rows fill wrappers, cells and column headers `height: 100%` with centered content, borders on cells, wrappers inherit the row background, body wrapper `overflow: visible`
- [ ] 4.3 Replace tag-based selectors (`& tr th:last-of-type`, `& th:has(...)`, row `_last`) with class or attribute selectors that work in both modes; existing stories stay green
- [ ] 4.4 Write a failing story, then confirm: frozen drag, selection and expand columns stay at the left edge after scrolling sideways

## 5. Row activation and resizing

- [ ] 5.1 Write failing stories: click and Enter call `onRowAction` once in a virtualized table
- [ ] 5.2 Change the three checks in `data-table.row.tsx` to stop at the cell element; existing row interaction stories stay green
- [ ] 5.3 Write a failing story for column resizing in a virtualized table, then make `keepResizedEdgeInView` query by role and class instead of `table` and `th`

## 6. Stories and tests

- [ ] 6.1 `data-table.virtualized.stories.tsx`: 1,000 and 10,000 rows, compound composition with 1,000+ rows, sorting, selection surviving scroll, keyboard navigation, nested content, pinned rows, drag and drop, empty state, footer, options warning, every size, a size change at runtime, frozen columns at `sm` and `xl`, one small `vrt` story; keep the non-virtualized side of comparison stories small (four plain tables of 1,000 rows crash the test runner)
- [ ] 6.2 `data-table.timing.stories.tsx` (`!test`, `!a11y-test`, no snapshot): mount time and first paint for 1,000 and 10,000 rows, with and without `isVirtualized`; record the results in `design.md`
- [ ] 6.3 `data-table.docs.spec.tsx`: virtualized section with about 100 rows (JSDOM renders every row)

## 7. Documentation

- [ ] 7.1 `data-table.dev.mdx`: "Large datasets (virtualization)" section — experimental, bounded height, options, styling, limitations
- [ ] 7.2 `data-table.a11y.mdx` and `data-table.guidelines.mdx`: notes on virtualized tables
- [ ] 7.3 Changeset for `@commercetools/nimbus` (minor)
- [ ] 7.4 Follow-up ticket for a frozen pin column when virtualized (ask before creating it in Jira)

## 8. Verification

- [ ] 8.1 `pnpm test:dev packages/nimbus/src/components/data-table/` and `.../virtualizer/` pass
- [ ] 8.2 `pnpm --filter @commercetools/nimbus typecheck:dev` and `pnpm lint` pass
- [ ] 8.3 Build, then `pnpm test` on the new story files against the built bundle
- [ ] 8.4 `pnpm check:bundle-size` and `pnpm check:package-shape`; record the bundle change in `design.md`
- [ ] 8.5 Visual check in Storybook: sticky header, frozen columns while scrolling sideways, nested row, focus ring at the scroll edge
