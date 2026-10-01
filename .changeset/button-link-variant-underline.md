---
"@commercetools/nimbus": patch
---

`Button`: the `link` variant is now underlined at rest, not only on hover.
Before, it had the same text color and no background as `ghost`, so the two
variants looked the same until the pointer was over the button. On hover the
text now gets darker, like the other variants. The button's height, padding and
minimum width do not change.
