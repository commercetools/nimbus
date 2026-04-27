---
"@commercetools/nimbus": minor
---

feat(info-dialog): add InfoDialog pattern (FEC-437)

Also fixes a pre-existing bug in `Dialog.Content` where `aria-label` passed to
`Dialog.Root` was stored in context but never forwarded to the underlying
`<dialog>` element. ARIA overrides on `Dialog.Root` now apply as expected.
