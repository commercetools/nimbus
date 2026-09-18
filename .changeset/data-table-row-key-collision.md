---
"@commercetools/nimbus": patch
---

`DataTable`: rows are now keyed strictly by their `id`. Previously a row that
also had a `key` field (customer groups, categories, product types and other
domain objects commonly do) was keyed by that field instead, so selection
callbacks reported the business key rather than the id, and a row whose `key`
matched a column id crashed the table with "Cell count must match column
count".
