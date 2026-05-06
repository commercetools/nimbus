---
"@commercetools/nimbus": minor
---

feat(form-dialog): add FormDialog pattern (FEC-436)

A pre-composed save/cancel dialog for hosting an editable form in a modal. Flat
API (`title`, `children`, `onSave`, `onCancel`, plus optional `isOpen` /
`defaultOpen` / `onOpenChange`, `saveLabel` / `cancelLabel`, `isSaveDisabled` /
`isSaveLoading`, `aria-label`) with localized default "Save" and "Cancel"
labels, single unified `onCancel` across the cancel button and ambient dismiss
affordances (Escape, overlay, X), Promise-aware `onSave` (the dialog stays open
while the returned promise is pending and closes on fulfillment; rejected
promises leave it open so the consumer can surface validation errors), and an
`isSaveLoading` lockout that disables both buttons and suppresses Escape /
overlay / X for the duration to prevent in-flight data loss. Replaces Merchant
Center Application Kit's `FormDialog`.
