---
"@commercetools/nimbus": patch
---

fix(LocalizedField): set default CSS variables for font-size/line-height and fix
width="full" support

- `--localized-field-font-size` and `--localized-field-line-height` are now
  defined in the base recipe so description, label, and error text always
  renders with correct font sizing
- `width="full"` style prop now correctly causes inputs to stretch to fill
  available space for all input types (text, multiLine, richText, money)
