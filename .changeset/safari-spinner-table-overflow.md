---
"@commercetools/nimbus": patch
---

- `LoadingSpinner`: spinners now render at their requested `size` in Safari
  instead of all appearing in the same very large size.
- `DataTable`: a table with `isResizable` and `allowsPinning={false}` no longer
  shows a horizontal scrollbar when no column is wider than the table. The
  resize handle of the last column is now as wide as the handles of the other
  columns.
