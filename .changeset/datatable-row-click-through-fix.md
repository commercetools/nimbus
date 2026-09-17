---
"@commercetools/nimbus": patch
---

`DataTable`: rows no longer fire `onRowClick` or toggle row selection for a
click that never actually landed on the row. This could happen when the row sat
underneath other floating UI (e.g. a `ComboBox` or `Select` popover positioned
above the table) that closed the moment an option was picked — the browser would
deliver the tail end of that click to the row instead, causing an unrelated row
to appear to get clicked or selected.
