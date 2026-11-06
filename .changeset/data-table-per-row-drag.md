---
"@commercetools/nimbus": minor
---

`DataTable`: new `draggableKeys` prop to choose which rows can be dragged. Rows
outside the set show a disabled drag button labelled "Row cannot be reordered",
but stay reachable with the arrow keys, keep `onRowAction`, and accept drops.
Custom row render functions receive a new `isDragDisabled` field. Without
`draggableKeys`, every row stays draggable.
