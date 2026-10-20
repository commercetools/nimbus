---
"@commercetools/nimbus": patch
---

`SearchInput`: in an empty field, a `trailingElement` now sits at the field's
trailing edge, in line with the same element in other inputs. Before, the hidden
clear button kept its place after the `trailingElement` and left a gap. The
clear button now appears only when the field has a value, after the
`trailingElement`. The field keeps the same width with or without it. While the
field is empty, the placeholder can use the clear button's space.

`SearchInput`: in a field narrower than the width it has when you set none, the
text, the `trailingElement` and the clear button no longer extend past the
field's edge. The text area now gets smaller to fit.
