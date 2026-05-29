---
"@commercetools/nimbus": patch
---

Fix `Toolbar` outline variant so its border-style `box-shadow` no longer renders
outside the toolbar's bounding box where it can be overlapped by sibling
elements. The shadow is now drawn with `inset`, matching the pattern used by
other Nimbus components (e.g. `TextInput`, `DateInput`, `Combobox`).
