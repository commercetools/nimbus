---
"@commercetools/nimbus": patch
---

`Tabs`: fixed a spurious React console error — _"An empty string (`""`) was
passed to the `href` attribute"_ — that appeared in development for every
ordinary (non-link) tab. Plain tabs no longer emit the warning. Tabs that opt
into link behavior with an `href` are unaffected and still render as anchors.
