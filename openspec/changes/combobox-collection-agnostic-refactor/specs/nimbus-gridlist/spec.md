## ADDED Requirements

### Requirement: Standalone GridList

The GridList component SHALL provide a standalone, accessible grid-based list
wrapping React Aria's GridList with Nimbus styling via a slot recipe.

#### Scenario: Basic rendering

- **WHEN** `GridList.Root` is rendered with `GridList.Item` children
- **THEN** SHALL render an accessible grid list with `role="grid"`
- **AND** each item SHALL have `role="row"`
- **AND** SHALL apply the `nimbusGridList` slot recipe

#### Scenario: Grid layout mode

- **WHEN** `layout="grid"` is set
- **THEN** SHALL arrange items in a responsive grid
- **AND** keyboard navigation SHALL use 2D arrow keys (up/down/left/right)

### Requirement: Selection

The GridList SHALL support single and multiple selection matching ListBox
patterns.

#### Scenario: Multiple selection

- **WHEN** `selectionMode="multiple"` is set
- **THEN** SHALL allow selecting multiple items
- **AND** SHALL call `onSelectionChange` with the set of selected keys

### Requirement: Drag and Drop

The GridList SHALL support opt-in drag-and-drop via `dragAndDropHooks`,
replacing DraggableList as the standard D&D pattern.

#### Scenario: Reorder items

- **WHEN** `dragAndDropHooks` prop is provided
- **THEN** SHALL enable drag on items
- **AND** SHALL allow reordering via drag
- **AND** SHALL show drop indicators

#### Scenario: DraggableList replacement

- **WHEN** consumer migrates from `DraggableList.Root` to `GridList.Root`
- **AND** passes `dragAndDropHooks` from `useDragAndDrop`
- **THEN** SHALL provide equivalent reorder functionality
- **AND** SHALL support the same item rendering patterns

### Requirement: Keyboard Navigation

The GridList SHALL support keyboard navigation per ARIA grid pattern.

#### Scenario: List mode navigation

- **WHEN** `layout` is not set (default list mode)
- **THEN** ArrowDown/ArrowUp SHALL move focus between items

#### Scenario: Grid mode navigation

- **WHEN** `layout="grid"` is set
- **THEN** ArrowLeft/ArrowRight SHALL move focus between columns
- **AND** ArrowUp/ArrowDown SHALL move focus between rows

### Requirement: Empty State

The GridList SHALL support rendering an empty state.

#### Scenario: No items with empty state renderer

- **WHEN** the items collection is empty
- **AND** `renderEmptyState` prop is provided
- **THEN** SHALL render the empty state content
