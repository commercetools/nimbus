---
"@commercetools/nimbus": patch
---

Menu: fix Menu.Content not forwarding style props to the popover container

Style props (e.g. `width`, `minWidth`) passed to `Menu.Content` are now
correctly applied to the popover container element.
