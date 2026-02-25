---
"@commercetools/nimbus": minor
---

Add `shouldDelayOnClose` to Drawer component. When `true`, backdrop dismissal is
disabled while Escape and close buttons still fire `onOpenChange(false)`,
allowing close attempts to be intercepted for unsaved changes confirmation.
