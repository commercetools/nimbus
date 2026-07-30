---
"@commercetools/nimbus": minor
---

**DataTable:** Added `allowsPinning` and `allowsExpandColumn` props to control
visibility of the pin and expand internal columns. Both default to `true` (no
breaking change).

- Set `allowsPinning={false}` to hide the pin column entirely.
- Set `allowsExpandColumn={false}` to hide the expand chevron column. Rows with
  nested content can still be expanded by clicking the row.
