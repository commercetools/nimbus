---
"@commercetools/nimbus": minor
---

**DraggableList**: Add `dragNamespace` prop to isolate drag-and-drop between
lists. When set, only lists sharing the same namespace can exchange items.
Omitting preserves the default behavior where all lists interoperate.

**DraggableList**: Add `onExternalDrop`, `acceptExternalTypes`,
`externalDropOperation`, and `serializeDragItem` props for accepting external
drops (text, files, directories) and providing outgoing drag formats.

**New hook**: `useDragAndDrop` — shared drag-and-drop hook for any React Aria
collection component. Provides namespace isolation, external drop support,
outgoing format serialization, and auto-keying.

**New helpers**: `createListDataHandlers` and `createArrayHandlers` — factory
functions that return state mutation callbacks for `useListData` and `useState`
arrays respectively.

**New helpers**: `createItemsFromTextDrop`, `createItemsFromFileDrop`,
`createItemsFromDirectoryDrop`, `createItemsFromJsonDrop`,
`createItemsFromImageDrop`, `createItemsFromCsvDrop` — composable utilities for
converting external drop items inside `onExternalDrop`.

**DataTable**: Add optional `dragAndDropHooks` prop to both `DataTable` and
`DataTable.Table` for consumer-provided drag-and-drop support. When provided, a
drag handle column is automatically added and rows become reorderable.
