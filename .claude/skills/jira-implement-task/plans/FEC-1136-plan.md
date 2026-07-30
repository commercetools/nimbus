# FEC-1136: DataTable configurable pin and expand column visibility

## Summary

Add `allowsPinning` (default `true`) and `allowsExpandColumn` (default `true`)
props to DataTable. When `false`, the respective internal columns are hidden.
For `allowsExpandColumn={false}`, rows with nested content can still expand via
row click.

## Tasks

### Task 1: Add types for new props

- Add `allowsPinning?: boolean` and `allowsExpandColumn?: boolean` to
  `DataTableProps`
- Add `hasExpandableContent: boolean` and `showPinColumn: boolean` to
  `DataTableContextValue`

### Task 2: Update Root to compute new context values

- Destructure `allowsPinning` and `allowsExpandColumn` from props
- Compute `hasExpandableContent = hasExpandableRows(filteredRows, nestedKey)`
- Compute
  `showExpandColumn = hasExpandableContent && allowsExpandColumn !== false`
- Compute `showPinColumn = allowsPinning !== false`
- Pass all to context

### Task 3: Update Header to conditionally render pin column

- Get `showPinColumn` from context
- Wrap pin column header in conditional

### Task 4: Update Row to conditionally render pin cell and handle expansion

- Get `showPinColumn` and `hasExpandableContent` from context
- Wrap pin cell in `showPinColumn` conditional
- Change nested row condition from `showExpandColumn` to `hasExpandableContent`
- Update colSpan to account for hidden columns
- Add expansion toggle on row click when expand column hidden but row has nested
  content

### Task 5: Write stories and play function tests

- Story for `allowsPinning={false}` — verify no pin column
- Story for `allowsExpandColumn={false}` — verify no expand column, row click
  still expands
- Play functions asserting column visibility

### Task 6: Changeset
