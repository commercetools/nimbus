---
"@commercetools/nimbus": patch
---

`DataTable`: in Safari on macOS, a table with `maxHeight` now scrolls while a
row is dragged near its top or bottom edge, as it does in Chrome and Firefox, so
a row can be dropped at a place that was out of view. Before, the table scrolled
down to the end and did not scroll back up.
