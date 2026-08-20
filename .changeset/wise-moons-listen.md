---
"@commercetools/nimbus": patch
---

`LocalizedField`: the info popover opened by the hint button now has an
accessible name, so screen readers announce it instead of an unnamed dialog. It
also matches the appearance of other popovers — one shadow rather than two
stacked, no border or background tint of its own — and fades in and out like
them. It no longer draws an outline around itself when opened, matching `Dialog`
and `Drawer`.
