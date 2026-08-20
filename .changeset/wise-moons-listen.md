---
"@commercetools/nimbus": patch
---

`LocalizedField`: the info popover opened by the hint button now has an
accessible name, so screen readers announce it instead of an unnamed dialog. It
also fades in and out to match other overlays, and its focus outline now appears
only for keyboard users rather than on every open.
