## 1. Fix row cursor and text selection

- [x] 1.1 In `data-table.row.tsx`: add `data-clickable={!!onRowClick && !isDisabled}` to the `<RaRow>` element (activates existing recipe CSS rule)
- [x] 1.2 In `data-table.recipe.ts`: change `userSelect: "none"` to `userSelect: "text"` in the row slot (`"& td, div"` block, ~line 332)
- [x] 1.3 In `data-table.row.tsx`: remove explicit `cursor={isDisabled ? "not-allowed" : "text"}` from the cell content `<Box>` (~line 386) -- let browser natural cursor and row-level cursor apply instead

## 2. Clean up dead code

- [x] 2.1 In `data-table.types.ts`: remove `isRowClickable` from `DataTableContextValue` (~line 118)
- [x] 2.2 In `data-table.types.ts`: remove `isRowClickable` from `DataTableProps` (~line 172)

## 3. Pin button toggle semantics

- [x] 3.1 In `data-table.row.tsx`: change pin button from `IconButton` to `IconToggleButton` with `isSelected={isPinned}` and `onChange` handler

## 4. Keyboard-only focus rings

- [x] 4.1 In `data-table.recipe.ts`: change `focusRing: "outside"` to `focusVisibleRing: "inside"` on cells, rows, and column headers

## 5. Column resizer keyboard discoverability

- [x] 5.1 In `data-table.recipe.ts`: show column divider when resizer is keyboard-focused via `th:has([data-focused='true'])` selector

## 6. Verify

- [x] 6.1 Run `pnpm test:dev packages/nimbus/src/components/data-table/data-table.stories.tsx` -- 27/27 tests pass
- [x] 6.2 Run `pnpm typecheck` -- no type errors
- [x] 6.3 Manually verify in Storybook: clickable rows show `cursor: pointer`, text is selectable, text selection does not trigger row click, double-click selects word
- [x] 6.4 Manually verify: pin button announces pressed/unpressed state to screen readers
- [x] 6.5 Manually verify: focus rings only appear on keyboard navigation, not mouse clicks
- [x] 6.6 Manually verify: column divider visible when resizer receives keyboard focus
