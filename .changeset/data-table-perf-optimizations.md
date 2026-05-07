---
"@commercetools/nimbus": patch
---

Improve DataTable render performance for large datasets. Selection changes no
longer cause all rows to re-render, and repeated computations that scaled with
row count have been moved to the table root. Pin button tooltips now use native
browser title attributes instead of portal-based tooltip components, reducing
initial mount cost.
