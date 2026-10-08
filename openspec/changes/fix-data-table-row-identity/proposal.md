## Why

`DataTable` named the same row in two different ways. React Aria derives a
collection key as `rendered.props.id ?? item.key ?? item.id`
(`useCachedChildren`, `react-aria@3.52.1`). Nimbus set no `id` on the rendered
row or column, so any item with a `key` field was keyed by that field, while
Nimbus's own code used `row.id` everywhere.

commercetools domain objects normally carry both: `id` is the database
identity, `key` is a business identifier the merchant chooses. Customer groups,
categories, product types, channels and stores all have both. Wherever the two
halves of the table had to agree on a row, they disagreed:

| Surface       | What consumers saw                                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Selection     | `onSelectionChange` reported the business key, not the row id                                                                           |
| Sorting       | `onSortChange` reported a column's `key` field, so `sortDescriptor.column === column.id` never matched and sorting silently did nothing |
| Disabled rows | `disabledKeys` rows looked disabled but stayed selectable and in the keyboard focus order                                               |
| Crash         | A row whose `key` equalled a column id threw `Cell count must match column count`                                                       |

The crash is how this was found: the customer groups page in Merchant Center
rendered an error boundary (commercetools/merchant-center-frontend#21268). The
data was ordinary and matched the documented contract.

The test suite could not see the bug. Every row in `mcMockData` carries both
fields (`{ id: "1", key: "65dc16dc18d" }`), and the flagship `Base` story only
asserted that checkboxes looked checked, so it passed whichever field React
Aria chose.

A consumer survey (13 mirrored repositories) found two live instances of the
crash shape — `mcp-servers-table.tsx` and `commerce-agents` `channel-list.tsx`
— that break as soon as a merchant creates a record whose `key` equals one of
the table's column ids. No consumer used selection, `disabledKeys` or drag and
drop on `DataTable`.

## What Changes

- Rows and columns are keyed strictly by their `id`. A `key` field is ordinary
  row data and never affects identity.
- `onSelectionChange`, `selectedKeys`, `defaultSelectedKeys` and `disabledKeys`
  speak in row ids; `onSortChange` speaks in column ids.
- Rows named in `disabledKeys` are genuinely disabled: not selectable and
  skipped by keyboard navigation.
- A row's identity comes from its data. To identify rows by another property,
  consumers set `id` in the row data. A different `id` set on `DataTable.Row`
  from a custom `DataTable.Body` is unsupported and warns in development.
- Duplicate or empty row ids warn in development, naming the offending id,
  instead of failing later as React Aria's opaque "Cell count must match column
  count".
- `createArrayHandlers` keeps its `item.key ?? item.id` default, but a key
  mismatch now logs a development warning that names the cause and the fix.
- Released as **minor**: `docs/changeset-conventions.md:78` excludes "new
  behavior" from patch, and the `disabledKeys` focus-order change is new
  behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-data-table`: adds a "Row and Column Identity" requirement; states in
  "Column Sorting" and "Row Selection" which key each callback and prop uses,
  and adds a "Disabled rows" scenario to "Row Selection".

## Impact

- **Code**: `data-table.body.tsx`, `data-table.header.tsx`,
  `data-table.row.tsx`, `data-table.root.tsx`, `data-table.types.ts`,
  `utils/rows.utils.tsx`, new `utils/row-keys.utils.ts`;
  `hooks/use-drag-and-drop/state-handlers.ts`.
- **Tests**: business-key and identity stories in `data-table.stories.tsx`;
  `row-keys.utils.spec.ts`; new cases in `use-drag-and-drop.spec.ts`.
- **Docs**: `data-table.dev.mdx`, `use-drag-and-drop.mdx`, minor changeset.
- **Consumers**: see the changeset's "Check this after upgrading" list. Stored
  selection built from business keys stops matching; `disabledKeys` must hold
  row ids.
- **Not in scope**: `getKey` on `ComboBox` and `DraggableList`, which ignore
  it in common cases. Tracked in FEC-1357.
