---
"@commercetools/nimbus": patch
---

`Accordion`: Other icons, badges and spinners inside `Accordion.Header` now keep
their own size and no longer rotate when the item opens. Only the chevron is
sized and rotated.

If you added a `& svg` override inside the header to undo the chevron size, you
can remove it.
