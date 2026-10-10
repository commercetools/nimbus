---
"@commercetools/nimbus": patch
---

`DataTable`: fix extra space below the text in body cells. Rows were about 6px
taller than needed, and the text sat closer to the top of the cell than to the
bottom. Rows are now slightly shorter, and cell text is centered between the top
and bottom padding. The expand arrow is also centered in its cell now (about 2px
lower). Both changes apply to every DataTable, with or without `size`.
