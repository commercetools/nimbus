## ADDED Requirements

### Requirement: Standalone ListBox

The ListBox component SHALL provide a standalone, accessible selection list
wrapping React Aria's ListBox with Nimbus styling via a slot recipe.

#### Scenario: Basic rendering

- **WHEN** `ListBox.Root` is rendered with `ListBox.Item` children
- **THEN** SHALL render an accessible listbox with `role="listbox"`
- **AND** each item SHALL have `role="option"`
- **AND** SHALL apply the `nimbusListBox` slot recipe

#### Scenario: Dynamic items

- **WHEN** `items` prop is provided with a data array
- **THEN** SHALL render items from the data using a render function child
- **AND** SHALL support collection-based rendering via React Aria

### Requirement: Selection Modes

The ListBox SHALL support single and multiple selection.

#### Scenario: Single selection

- **WHEN** `selectionMode="single"` is set
- **THEN** SHALL allow selecting one item at a time
- **AND** SHALL call `onSelectionChange` with the selected key

#### Scenario: Multiple selection

- **WHEN** `selectionMode="multiple"` is set
- **THEN** SHALL allow selecting multiple items
- **AND** SHALL render checkboxes for each item
- **AND** SHALL call `onSelectionChange` with the set of selected keys

#### Scenario: Controlled selection

- **WHEN** `selectedKeys` and `onSelectionChange` props are provided
- **THEN** SHALL operate in controlled mode
- **AND** SHALL reflect the provided selection state

### Requirement: Sections

The ListBox SHALL support grouped items via sections.

#### Scenario: Section rendering

- **WHEN** `ListBox.Section` is used with a `title` prop
- **THEN** SHALL render a section header
- **AND** SHALL group items visually and semantically
- **AND** section header SHALL have `role="presentation"` or appropriate ARIA role

### Requirement: Keyboard Navigation

The ListBox SHALL support keyboard navigation per ARIA listbox pattern.

#### Scenario: Arrow key navigation

- **WHEN** the listbox is focused and user presses ArrowDown
- **THEN** SHALL move focus to the next item
- **WHEN** user presses ArrowUp
- **THEN** SHALL move focus to the previous item

#### Scenario: Home and End

- **WHEN** user presses Home
- **THEN** SHALL move focus to the first item
- **WHEN** user presses End
- **THEN** SHALL move focus to the last item

#### Scenario: Type-ahead

- **WHEN** user types characters while the listbox is focused
- **THEN** SHALL move focus to the first matching item by text value

### Requirement: Drag and Drop

The ListBox SHALL support opt-in drag-and-drop via `dragAndDropHooks`.

#### Scenario: Reorder items

- **WHEN** `dragAndDropHooks` prop is provided from `useDragAndDrop`
- **THEN** SHALL enable drag handles on items
- **AND** SHALL allow reordering items via drag
- **AND** SHALL show drop indicators during drag

#### Scenario: Cross-collection transfer

- **WHEN** two ListBox instances share compatible `dragAndDropHooks`
- **THEN** SHALL allow dragging items between them
- **AND** SHALL call the appropriate drop handlers on the target

#### Scenario: No drag-and-drop

- **WHEN** `dragAndDropHooks` prop is not provided
- **THEN** SHALL NOT render drag handles
- **AND** SHALL NOT enable any drag behavior

### Requirement: Size Variants

The ListBox SHALL support size variants.

#### Scenario: Size prop

- **WHEN** `size` prop is set to `sm`, `md`, or `lg`
- **THEN** SHALL adjust item height, padding, and font size
- **AND** `md` SHALL be the default size

### Requirement: Empty State

The ListBox SHALL support rendering an empty state.

#### Scenario: No items

- **WHEN** the items collection is empty
- **AND** `renderEmptyState` prop is provided
- **THEN** SHALL render the empty state content

### Requirement: Disabled Items

The ListBox SHALL support disabling individual items.

#### Scenario: Disabled keys

- **WHEN** `disabledKeys` prop is provided
- **THEN** SHALL apply disabled styling to matching items
- **AND** disabled items SHALL NOT be selectable
- **AND** disabled items SHALL be skipped during keyboard navigation
