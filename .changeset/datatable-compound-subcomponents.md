---
"@commercetools/nimbus": minor
---

`DataTable`: Expose `Row`, `Cell`, and `Column` as compound sub-components for
custom rendering. `DataTable.Body`, `DataTable.Header`, and `DataTable.Row`
accept optional render-function children that replace only the data
columns/cells — internal columns (selection, expand, pin) are always rendered
automatically.

- `DataTable.Body` children receive `(row, renderProps)` for custom row styling
- `DataTable.Row` children receive `({ columns, row, isDisabled })` for custom
  cell rendering
- `DataTable.Header` children receive `({ columns, allowsSorting })` for custom
  column headers
- New types `DataTableColumnRenderProps`, `DataTableRowRenderProps`, and
  `DataTableCellRenderProps` are exported for typing render functions

`DataTable`: Improved hover and re-render performance. Removed compositing-layer
churn from row hover styles and ref-stabilized consumer callback props so inline
callbacks no longer cascade re-renders to every row.
