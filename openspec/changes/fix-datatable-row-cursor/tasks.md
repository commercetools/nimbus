## 1. Fix row cursor and text selection

- [x] 1.1 In `data-table.row.tsx`: add `data-clickable={!!onRowClick && !isDisabled}` to the `<RaRow>` element (activates existing recipe CSS rule)
- [x] 1.2 In `data-table.recipe.ts`: change `userSelect: "none"` to `userSelect: "text"` in the row slot (`"& td, div"` block, ~line 332)
- [x] 1.3 In `data-table.row.tsx`: remove explicit `cursor={isDisabled ? "not-allowed" : "text"}` from the cell content `<Box>` (~line 386) -- let browser natural cursor and row-level cursor apply instead

## 2. Clean up dead code

- [x] 2.1 In `data-table.types.ts`: remove `isRowClickable` from `DataTableContextValue` (~line 118)
- [x] 2.2 In `data-table.types.ts`: remove `isRowClickable` from `DataTableProps` (~line 172)

## 3. Verify

- [x] 3.1 Run `pnpm test:dev packages/nimbus/src/components/data-table/data-table.stories.tsx` -- 27/27 tests pass
- [x] 3.2 Run `pnpm typecheck` -- no type errors
- [ ] 3.3 Manually verify in Storybook: clickable rows show `cursor: pointer`, text is selectable, text selection does not trigger row click, double-click selects word
