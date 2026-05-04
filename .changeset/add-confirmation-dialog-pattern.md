---
"@commercetools/nimbus": minor
---

`ConfirmationDialog`: new pre-composed confirm/cancel dialog pattern under
`patterns/dialogs/`. Wraps `Dialog` and `Button` in a flat API (`title`,
`children`, `onConfirm`, `onCancel`, plus optional `isOpen` / `defaultOpen` /
`onOpenChange`, `confirmLabel`, `cancelLabel`, `intent`, `isConfirmDisabled`,
`isConfirmLoading`, `aria-label`).

`intent="destructive"` styles the confirm button with the critical color palette
for delete / discard / publish flows. `isConfirmLoading` shows a spinner inside
the confirm button and locks the dialog (cancel and the ambient dismiss paths —
Escape, overlay click, X — are suppressed for the duration), preventing races
between confirm and cancel for async handlers.

The cancel button, Escape, overlay click, and the close-button X all route
through a single `onCancel` callback. Clicking the confirm button invokes
`onConfirm` and does not invoke `onCancel`. Default Confirm and Cancel labels
are localized via the Nimbus i18n system; pass `confirmLabel` / `cancelLabel`
(any `ReactNode`) to override.

`Dialog.Content`: `aria-label` passed to `Dialog.Root` is now forwarded to the
underlying `<dialog>` element. ARIA overrides on composed dialogs now apply as
expected.
