---
"@commercetools/nimbus": minor
---

`DataTable`: new `draggableKeys` prop to choose which rows can be dragged.
Without it, every row stays draggable.

- Rows outside the set have no visible drag handle. Screen readers still find a
  disabled drag button labelled "Row cannot be reordered".
- Rows outside the set stay reachable with the arrow keys, keep `onRowAction`,
  and accept drops.
- Custom row render functions receive a new `isDragDisabled` field.
- In development, a warning is logged when `draggableKeys` is used with
  `selectionMode`, with expandable rows, or without `dragAndDropHooks`. The
  first two combinations are not supported.
- The drag column is padded like the selection column. It is wider than before
  and follows the table `size`.
- The grab cursor shows on the drag handle only, not on the whole row.
- In Firefox, header cells follow the height of their content, also when a
  header text wraps onto two lines.
