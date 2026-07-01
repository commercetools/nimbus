---
"@commercetools/nimbus": minor
---

`DropZone`: new component. A styled drag-and-drop target for accepting files or
other dragged data, built on React Aria's `DropZone`.

- Keyboard- and screen-reader-accessible by default (Enter to start
  drag-and-drop mode, Tab between drop targets, Enter to drop, Escape to
  cancel). Because keyboard/screen-reader drag only works within the browser
  window, compose the existing `FileTrigger` inside `DropZone` to add a
  click/keyboard path for uploading files from the OS.
- Ships a default upload icon and localized instruction label so `<DropZone />`
  alone is never an empty box. Passing any children — or an explicit
  `aria-label` / `aria-labelledby` — replaces that default content entirely;
  compose a `FileTrigger` (and any supporting copy) as children for a
  click-to-upload path.
- Forwards React Aria's `onDrop`, `getDropOperation`, `onDropEnter`,
  `onDropMove`, `onDropExit`, `onDropActivate`, and `isDisabled` directly, and
  re-exports the `DropEvent`, `DropOperation`, and `DragTypes` types so you can
  type handlers without depending on `react-aria-components` yourself.
- `aria-label` and `aria-labelledby` are forwarded straight to React Aria's
  `DropZone`; use a `<Text slot="label">` child for a visible label.
- Idle, hover, drag-over, focus, and disabled states meet WCAG 2.1 AA, including
  non-color-only drag-over feedback, forced-colors support, and
  `prefers-reduced-motion` handling.
