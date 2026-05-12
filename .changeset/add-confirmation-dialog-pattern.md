---
"@commercetools/nimbus": minor
---

`ConfirmationDialog`: new pattern for confirm/cancel flows. Pass `title`,
`children`, `onConfirm`, and `onCancel` to render a dialog with localized
Confirm and Cancel buttons; cancel, Escape, overlay click, and the close button
all route through `onCancel`.

- `intent="destructive"` styles the confirm button for delete / discard /
  publish flows.
- `isConfirmLoading` shows a spinner on the confirm button and locks the dialog
  while the handler is in flight, so async confirm handlers can't race with
  cancel.
- Default button labels are localized via Nimbus i18n; override per-instance
  with `confirmLabel` / `cancelLabel`.

See the docs for the full API.
