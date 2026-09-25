---
"@commercetools/nimbus": minor
---

`DataTable`: rows and columns are now keyed strictly by their `id`.

React Aria derives a collection key as `id ?? key ?? …`, so a `key` field on a
row or column definition used to win. Domain objects commonly have one —
customer groups, categories, product types, channels and stores all do — which
meant the business key leaked into the keying of the table.

### Fixed

- A row whose `key` equals a column id no longer crashes the table with "Cell
  count must match column count".
- `onSelectionChange` reports row ids. It previously reported the business key.
- `onSortChange` reports column ids. It previously reported a column's `key`
  field, so `sortDescriptor.column` never matched `column.id` and sorting
  silently stopped working.
- `disabledKeys` now actually disables the rows you name. Before, those rows
  were only styled as disabled — they stayed in the keyboard focus order and
  could still be selected.
- Two rows sharing a business key keep separate React identities instead of
  colliding on a duplicate key.

### Check this after upgrading

- **Selection.** `selectedKeys` and `defaultSelectedKeys` must hold row ids. If
  you persist selection to a URL, `localStorage` or a server, stored business
  keys no longer match — migrate or discard them.
- **Disabled rows.** `disabledKeys` must hold row ids. Rows named by business
  key are no longer disabled; rows named by id now genuinely are, so keyboard
  navigation skips them.
- **Sorting.** If you compare `sortDescriptor.column` yourself, it is now always
  the column `id`.
- **Row ids must be unique.** Rows sharing an `id` but differing in `key` used
  to work by accident and now collide.
