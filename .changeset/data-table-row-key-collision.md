---
"@commercetools/nimbus": minor
---

`DataTable` now identifies rows and columns only by their `id`. A `key` field,
which customer groups, categories, channels and stores usually have, is treated
as ordinary data.

### `DataTable`

- **Fixed:** a row whose `key` equals a column id no longer crashes the table
  with "Cell count must match column count".
- **Fixed:** `onSelectionChange` reports row ids and `onSortChange` reports
  column ids, so sorting works for columns that have a `key` field.
- **Fixed:** rows in `disabledKeys` are really disabled: they cannot be
  selected, and keyboard navigation skips them.
- `selectedKeys`, `defaultSelectedKeys` and `disabledKeys` must hold row ids.
  Stored selections that use business keys no longer match.
- Row ids must be unique. In development, a duplicate or empty id logs a warning
  that names it.
- To identify rows by another property, set `id` in the row data. A different
  `id` on `DataTable.Row` in a custom `DataTable.Body` logs a development
  warning.

### `createArrayHandlers`

- When a drag operation matches no item, a development warning explains why. For
  `DataTable` rows, pass `createArrayHandlers(setRows, (row) => row.id)`.
