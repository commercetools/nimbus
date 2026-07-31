---
"@commercetools/nimbus": minor
---

Add `renderNestedContent` prop to DataTable for rendering a uniform component
template below each row when expanded. Clicking a row toggles the nested content
open/closed. The render callback receives the row and a
`DataTableNestedContentOptions` object with a `close` function for collapsing
the content from within. Uses the same expansion system as `nestedKey` — state
is managed via `expandedRows` / `onExpandRowsChange`. The `onExpandRowsChange`
callback now receives `toggledRowId` and `columnId` arguments identifying which
row and column triggered the expansion. Works alongside existing selection and
pinning features.
