---
"@commercetools/nimbus": minor
---

`DataTable`: new `draggableKeys` prop to choose which rows can be dragged. Rows
outside the set have no visible drag handle. They keep a visually hidden,
disabled drag button labelled "Row cannot be reordered" for screen readers, stay
reachable with the arrow keys, keep `onRowAction`, and accept drops. Custom row
render functions receive a new `isDragDisabled` field. Without `draggableKeys`,
every row stays draggable. In development, a warning is logged when
`draggableKeys` is combined with `selectionMode` or expandable rows (both are
not supported), or set without `dragAndDropHooks`.

Other changes for tables with drag and drop:

- The drag column is padded like the selection column, so it is wider than
  before and follows the table `size`.
- The drag handle works on the first drag in Chromium and WebKit, also in
  clickable rows, and shows a grab cursor.

Side fix: header cells follow the height of their content in Firefox, also when
a header text wraps onto two lines.
