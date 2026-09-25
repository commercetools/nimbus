## ADDED Requirements

### Requirement: Row and Column Identity

The component SHALL identify every row by its `id` and every column by its `id`. No other field — in particular a business `key` field — SHALL affect identity. Every key the component reports or accepts SHALL be one of these ids, and every feature that tracks a row (selection, disabling, expansion, pinning, sorting) SHALL use the same one.

#### Scenario: Row carrying a business key field

- **WHEN** a row carries both an `id` and a `key` field
- **THEN** the row SHALL be identified by its `id`
- **AND** the rendered row SHALL expose its `id` as the collection key (`data-key`)

#### Scenario: Row key equal to a column id

- **WHEN** a row's `key` field equals the `id` of a column
- **THEN** the table SHALL render every cell of every row without error

#### Scenario: Rows sharing a business key

- **WHEN** two rows have different `id` values and the same `key` value
- **THEN** they SHALL remain two distinct rows, including after sorting

#### Scenario: Column carrying a business key field

- **WHEN** a column definition carries both an `id` and a `key` field
- **THEN** the column SHALL be identified by its `id`

#### Scenario: Choosing a different identity

- **WHEN** a consumer wants rows identified by another property
- **THEN** setting `id` in the row data to that property SHALL make selection, expansion and pinning all use it

#### Scenario: Different id on a rendered row

- **WHEN** a custom `DataTable.Body` renders `DataTable.Row` with an `id` that differs from the row's `id`
- **THEN** expansion and pinning SHALL keep working on the row's `id`
- **AND** the component SHALL log a development warning naming both ids and pointing to the row data

#### Scenario: Duplicate or empty row ids

- **WHEN** two rows share an `id`, or a row's `id` is empty or missing
- **THEN** the component SHALL log a development warning naming the duplicated id or the index of the row without one
- **AND** SHALL NOT log it in production builds

## MODIFIED Requirements

### Requirement: Column Sorting
The component SHALL support single and multi-column sorting.

#### Scenario: Sort activation
- **WHEN** user clicks sortable column header
- **THEN** SHALL toggle sort direction (none → asc → desc → none)
- **AND** SHALL apply sort icon indicator
- **AND** SHALL call onSortChange callback with sort state
- **AND** the sort state's `column` SHALL be the column's `id`

#### Scenario: Multi-column sort
- **WHEN** user Shift+clicks additional column headers
- **THEN** SHALL add column to sort chain
- **AND** SHALL show sort order numbers on headers
- **AND** SHALL sort by primary, then secondary, then tertiary columns

#### Scenario: Keyboard sorting
- **WHEN** column header is focused and user presses Enter or Space
- **THEN** SHALL toggle sort direction
- **AND** SHALL announce sort change to screen readers

### Requirement: Row Selection
The component SHALL support single and multi-row selection.

#### Scenario: Single selection
- **WHEN** selectionMode="single"
- **THEN** SHALL allow selecting one row at a time
- **AND** clicking row SHALL select it and deselect others
- **AND** Space key SHALL toggle selection

#### Scenario: Multiple selection
- **WHEN** selectionMode="multiple"
- **THEN** SHALL show checkbox column
- **AND** header checkbox SHALL select/deselect all
- **AND** row checkboxes SHALL toggle individual rows
- **AND** Shift+click SHALL select range
- **AND** Ctrl/Cmd+click SHALL toggle individual rows

#### Scenario: Selection state
- **WHEN** selection changes
- **THEN** SHALL call onSelectionChange callback with selected keys
- **AND** SHALL support controlled selection (selectedKeys prop)
- **AND** SHALL support uncontrolled selection (defaultSelectedKeys)
- **AND** every selected key SHALL be a row `id`, and `selectedKeys` / `defaultSelectedKeys` SHALL be matched against row ids

#### Scenario: Disabled rows
- **WHEN** a row's `id` is named in `disabledKeys`
- **THEN** the row SHALL NOT be selectable
- **AND** keyboard navigation SHALL skip it
- **AND** it SHALL be styled as disabled
