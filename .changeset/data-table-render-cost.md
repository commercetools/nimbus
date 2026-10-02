---
"@commercetools/nimbus": patch
---

`DataTable` renders less, and outlines pinned rows correctly during a search.

- **Fixed:** expanding, pinning or sorting rows no longer renders the column
  headers and `DataTable.Manager` again. Pinning a row no longer renders every
  other row again.
- **Fixed:** new `rows`, `columns` or `visibleColumns` arrays that hold the same
  items, such as `rows={data.filter(isActive)}`, no longer render every row
  again. See "When rows render again" in the DataTable docs.
- **Fixed:** when the search hides the first pinned row, the next pinned row now
  draws the top edge of the pinned-row outline.
- **Fixed:** in a custom `DataTable.Body`, `isFirstPinned`, `isLastPinned` and
  `isSinglePinned` are `false` for rows that are not pinned. `isLastPinned` was
  `true` for every row while no row was pinned.
- **Fixed:** the `DataTableHeaderSlotProps` type describes the `<thead>` that
  `DataTable.Header` renders. It described a `<tr>` before.
- If you override the undocumented CSS custom properties `--dt-row-bg` or
  `--pinned-shadow-*`, rename them to `--data-table-row-bg` and
  `--data-table-pinned-shadow-*`.
