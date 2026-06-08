---
"@commercetools/nimbus": patch
---

fix(checkbox): remove reserved trailing space when a Checkbox has no label

A label-less `Checkbox` no longer reserves horizontal space for an absent label
— it now sizes tightly to its indicator instead of left-aligning the indicator
within a fixed 24px box. Checkboxes with a label are unchanged, and the 24px
interaction target is preserved. This makes label-less checkboxes align cleanly
when placed alongside other controls (e.g. selection checkboxes in `Tree`).
