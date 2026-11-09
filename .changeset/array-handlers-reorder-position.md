---
"@commercetools/nimbus": patch
---

`createArrayHandlers`: `onReorder` now places the moved items at the drop
position when the drop target is one of the moved items. Before, the items went
to the end of the list.
