---
"@commercetools/nimbus": patch
---

`DataTable`: Reduced bundle size for consumers who do not use
`DataTable.Manager`. The settings drawer and its dependencies (Drawer, Tabs,
DraggableList, etc.) are now loaded on demand, saving ~87 KB gzipped from the
initial DataTable import. No API changes required.
