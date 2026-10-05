---
"@commercetools/nimbus": patch
---

`DataTable`: fix extra space below the text in body cells. Rows were about 6px
taller than needed, and the text sat closer to the top of the cell than to the
bottom. Rows are now slightly shorter, and cell text is centered between the top
and bottom padding.
