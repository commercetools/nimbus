---
"@commercetools/nimbus": patch
---

`SearchInput`: an empty field no longer reserves space for the clear button.
Before, the hidden clear button still took up space, so a `trailingElement` sat
to the left of the field's trailing edge and did not line up with the same
element in other inputs. The clear button now appears only when the field has a
value, after the `trailingElement`.
