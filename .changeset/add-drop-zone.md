---
"@commercetools/nimbus": minor
---

`DropZone`: new component — an accessible drag-and-drop target for uploading
files or other dragged data.

- Fully keyboard- and screen-reader-operable, and highlights when a valid item
  is dragged over it.
- Renders a default upload icon and instruction out of the box; pass children
  (for example a `FileTrigger` button) for a click-to-upload path or a custom
  layout.
- Exposes React Aria's drop handlers and re-exports the `DropEvent`,
  `DropOperation`, and `DragTypes` types, so you can type handlers without
  adding a `react-aria-components` dependency.
