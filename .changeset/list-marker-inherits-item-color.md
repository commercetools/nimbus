---
"@commercetools/nimbus": patch
---

`List`: bullets and numbers of the default `marker` variant have the same color
as the text of their list item, also inside a colored container such as a
critical `Alert`. The new `fg.subtle` token does not change the marker color. To
give markers a different color, set the `_marker` style prop on `List.Item`.
