## ADDED Requirements

### Requirement: Per-Row Drag Control
The component SHALL let consumers choose which rows are draggable through the
`draggableKeys` prop on `DataTable` and `DataTable.Root`, while every row stays
a keyboard-reachable item and drops next to it stay valid.

#### Scenario: Default keeps all rows draggable
- **WHEN** `dragAndDropHooks` is provided and `draggableKeys` is `undefined`
- **THEN** SHALL render a drag button in every non-disabled row
- **AND** SHALL behave exactly as before this requirement existed

#### Scenario: Only listed rows are draggable
- **WHEN** `draggableKeys` is a `Set<string>`
- **THEN** only rows whose key is in the set SHALL start a drag
- **AND** `onReorder` SHALL NOT receive a key that is not in `draggableKeys`

#### Scenario: Empty set
- **WHEN** `draggableKeys` is an empty `Set`
- **THEN** no row SHALL be draggable
- **AND** every row SHALL render a disabled drag button

#### Scenario: Row that is not draggable renders a disabled drag button
- **WHEN** a row is not in `draggableKeys`
- **THEN** SHALL render a disabled drag button labelled with the localized
  message `dragRowDisabled` (English: "Row cannot be reordered")
- **AND** the button SHALL be visually hidden but stay in the accessibility tree
- **AND** the drag column SHALL stay aligned with the header and other rows
- **AND** no drag SHALL start from pointer or keyboard on that row

#### Scenario: Row that is not draggable stays reachable
- **WHEN** a row is not in `draggableKeys` and is not disabled
- **THEN** ArrowUp and ArrowDown SHALL move focus onto that row
- **AND** click or Enter SHALL call `onRowAction` once

#### Scenario: Drop position does not depend on row state
- **WHEN** a draggable row is dropped before or after another row
- **THEN** SHALL show a drop indicator at that position
- **AND** SHALL accept the drop with pointer and with keyboard
- **AND** this SHALL hold whether the adjacent rows are disabled (`disabledKeys`
  or `isDisabled`) or not in `draggableKeys`

#### Scenario: Disabled rows are never draggable
- **WHEN** a row is in `disabledKeys` or has `isDisabled`
- **THEN** SHALL NOT be draggable, even if its key is in `draggableKeys`
- **AND** `disabledBehavior="all"` SHALL stay unchanged

#### Scenario: Render prop exposes drag state
- **WHEN** a custom row render function is used
- **THEN** `DataTableRowRenderProps.isDragDisabled` SHALL be `true` for a row
  that is not draggable and `false` otherwise

#### Scenario: Targeted re-render
- **WHEN** `draggableKeys` changes
- **THEN** only rows whose `isDragDisabled` value changed SHALL re-render

#### Scenario: Documented limits
- **WHEN** a consumer reads the DataTable documentation
- **THEN** it SHALL state that selection together with `draggableKeys` is not
  supported
- **AND** that expandable rows together with `draggableKeys` are not supported
- **AND** that `onReorder` reports positions in the displayed order, which
  matters when column sorting is on
- **AND** that consumers can reject drop positions with `getDropOperation` from
  `useDragAndDrop`
