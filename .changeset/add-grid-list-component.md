---
"@commercetools/nimbus": minor
---

`GridList` (Experimental): new component for a keyboard-navigable collection of
items with your own content, in a list or a responsive grid. Use it for rich
items such as photo cards or files with details. Use `ListBox` to pick from
short text options.

- Build it with `GridList.Root` and `GridList.Item`. Set `layout="grid"` and
  give `columns` or `minChildWidth` (plain values or responsive objects such as
  `{ base: 1, md: 3 }`). All items in a grid have the same size.
- Choose `selectionMode` `single` or `multiple`.
- Reorder items with drag-and-drop by passing `dragAndDropHooks`.
- Turn on `showSelectionCheckbox` and `showDragHandle` on the Root or on a
  single item. Both are off by default.
- `size` (`sm`, `md`, `lg`) sets the item padding, the gap and the drag handle
  size.
