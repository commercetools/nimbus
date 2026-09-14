---
"@commercetools/nimbus": patch
---

`FormField`: the info (help) icon rendered by `FormField.InfoBox` is now
vertically centered against the label text instead of being anchored to the text
baseline, so its position no longer shifts with the label's font metrics. The
label row keeps its previous height.

`LocalizedField`: the info (help) icon rendered for `hint` is now vertically
centered against the label text, which previously sat at the top of the row.
