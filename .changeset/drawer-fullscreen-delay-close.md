---
"@commercetools/nimbus": minor
---

Add `variant="fullscreen"` and `shouldDelayOnClose` to Drawer component. The
fullscreen variant renders the drawer as a near-full-viewport overlay, matching
the ModalPage layout pattern. The `shouldDelayOnClose` prop disables backdrop
dismissal while keeping Escape and close buttons active, allowing close attempts
to be intercepted for unsaved changes confirmation.
