## ADDED Requirements

### Requirement: Row Activation

The component SHALL let users activate a row with a pointer or with the
keyboard, and SHALL report the activation through `onRowAction`.

#### Scenario: Activate by click

- **WHEN** `onRowAction` is provided and the user clicks an enabled row outside
  any interactive element
- **THEN** SHALL call `onRowAction` with the row

#### Scenario: Activate by Enter

- **WHEN** `onRowAction` is provided and focus is on an enabled row, or on a
  cell in it that is not an interactive element, and the user presses Enter
- **THEN** SHALL call `onRowAction` with the row
- **AND** SHALL NOT change the selection

#### Scenario: Activate while rows are selected

- **WHEN** at least one row is selected and the user clicks or presses Enter on
  an enabled row
- **THEN** SHALL call `onRowAction` with that row

#### Scenario: Space keeps selecting

- **WHEN** selection is enabled and the user presses Space on a focused row
- **THEN** SHALL toggle the row's selection
- **AND** SHALL NOT call `onRowAction`

#### Scenario: Interactive elements inside a row

- **WHEN** the user clicks, or presses Enter or Space on, a button, checkbox,
  link or input inside a row
- **THEN** only that element SHALL react
- **AND** SHALL NOT call `onRowAction`

#### Scenario: Disabled rows are not activated

- **WHEN** the user clicks or presses Enter on a disabled row
- **THEN** SHALL NOT call `onRowAction`

#### Scenario: Deprecated onRowClick

- **WHEN** `onRowClick` is provided and `onRowAction` is not
- **THEN** SHALL call `onRowClick` wherever `onRowAction` would be called,
  including on Enter
- **AND** when both are provided SHALL call only `onRowAction`

#### Scenario: Expand by activation

- **WHEN** `allowsExpandColumn={false}` and a row has nested content
- **THEN** clicking the row or pressing Enter on it SHALL toggle its expansion

#### Scenario: Enter activates without delay

- **WHEN** the user presses Enter on a clickable row
- **THEN** SHALL call `onRowAction` immediately

#### Scenario: Click waits for a possible double-click

- **WHEN** the user clicks a clickable row with a pointer
- **THEN** SHALL call `onRowAction` only after the double-click interval has
  passed
- **AND** a double-click SHALL cancel the pending call, so that double-clicking
  a word to select it never activates the row

### Requirement: Disabled Rows

The component SHALL disable rows for React Aria, not only visually, whichever
way they are disabled.

#### Scenario: All rows disabled

- **WHEN** `disabledKeys="all"`
- **THEN** every row SHALL be disabled
- **AND** no row SHALL be selectable by click, checkbox, Space or the header
  checkbox
- **AND** keyboard navigation SHALL treat every row as disabled

#### Scenario: Row disabled by its data

- **WHEN** a row has `isDisabled: true` and `disabledKeys` is not provided
- **THEN** the row SHALL be disabled and styled as disabled

### Requirement: Nested Content API

The component SHALL render per-row nested content through `renderNestedContent`.
The `nestedKey` prop SHALL be deprecated.

#### Scenario: nestedKey deprecated

- **WHEN** a consumer uses `nestedKey`
- **THEN** its type SHALL carry a `@deprecated` notice pointing to
  `renderNestedContent`
- **AND** its runtime behaviour SHALL NOT change

#### Scenario: Localized nested placeholder

- **WHEN** a row expanded through `nestedKey` holds an array
- **THEN** SHALL show the localized item count ("Nested items: {count}")

#### Scenario: Collapsed rows are not in the grid

- **WHEN** a row with nested content is collapsed
- **THEN** its nested row SHALL NOT be rendered
- **AND** ArrowDown / ArrowUp SHALL move directly between data rows

#### Scenario: Closing nested content returns focus

- **WHEN** focus is inside a row's nested content and the content calls
  `close`
- **THEN** focus SHALL move to the row's expand button, or to the row when
  there is no expand column


### Requirement: Localized Row and Panel Labels

Every user-facing string rendered by the component SHALL come from its message
catalog.

#### Scenario: Pin button name

- **WHEN** the pin column is shown
- **THEN** the pin button's accessible name and tooltip SHALL be the localized
  "Pin row" when the row is not pinned and "Unpin row" when it is

#### Scenario: Layout settings panel name

- **WHEN** the layout settings panel renders
- **THEN** it SHALL be a group with the localized name "Layout settings section"

#### Scenario: Hide column button

- **WHEN** the visible-columns list renders a remove button
- **THEN** its accessible name SHALL be the localized "Hide column"

#### Scenario: Layout option re-selected

- **WHEN** the user presses the layout option that is already active
- **THEN** SHALL NOT call `onSettingsChange`

## MODIFIED Requirements

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
- **AND** every selected key SHALL be a row `id`, and `selectedKeys` /
  `defaultSelectedKeys` SHALL be matched against row ids

#### Scenario: Disabled rows

- **WHEN** a row's `id` is named in `disabledKeys`
- **THEN** the row SHALL NOT be selectable
- **AND** keyboard navigation SHALL skip it
- **AND** it SHALL be styled as disabled

#### Scenario: No selection behavior prop

- **WHEN** a consumer configures selection
- **THEN** the component SHALL NOT accept a `selectionBehavior` prop
- **AND** selection SHALL always use React Aria's `"toggle"` behavior

#### Scenario: One rule for the selection column

- **WHEN** the table decides whether the selection column exists
- **THEN** it SHALL exist only when `selectionMode` is not `"none"`
- **AND** the header, the row cells and the nested row `colSpan` SHALL all use
  this rule

### Requirement: No Data Display

The component SHALL handle empty data gracefully.

#### Scenario: Empty data

- **WHEN** data array is empty
- **THEN** SHALL show the `renderEmptyState` content if provided
- **OR** the localized default "No Data" message
- **AND** SHALL still show column headers
- **AND** SHALL maintain table structure

#### Scenario: renderEmptyState not forwarded to the DOM

- **WHEN** `renderEmptyState` is provided
- **THEN** SHALL NOT set it as an attribute on the root element

### Requirement: Row Click Cursor Feedback

The component SHALL provide visual cursor feedback when rows are clickable.

#### Scenario: Pointer cursor on clickable rows

- **WHEN** `onRowAction` (or the deprecated `onRowClick`) prop is provided
- **THEN** rows SHALL display `cursor: pointer` on hover
- **AND** the cursor SHALL indicate the row is interactive

#### Scenario: Default cursor on non-clickable rows

- **WHEN** neither `onRowAction` nor `onRowClick` is provided
- **THEN** rows SHALL display the default cursor
- **AND** no interactive cursor feedback SHALL be shown

#### Scenario: Disabled row cursor

- **WHEN** a row is disabled via `disabledKeys` or `row.isDisabled`
- **THEN** the row SHALL display `cursor: not-allowed`
- **AND** the disabled cursor SHALL take precedence over the clickable cursor

#### Scenario: Disabled row style

- **WHEN** a row is disabled
- **THEN** it SHALL use the shared `disabled` layer style, like disabled rows
  in Tree, ListBox and DraggableList
- **AND** hovering it SHALL NOT change its background

### Requirement: Text Selection in Clickable Rows

The component SHALL allow users to select and copy text within table cells,
including in clickable rows.

#### Scenario: Text selection without triggering row click

- **WHEN** user selects text within a clickable row
- **THEN** text selection SHALL work normally
- **AND** the row's `onRowAction` handler SHALL NOT be triggered

#### Scenario: Row click when no text is selected

- **WHEN** user clicks a clickable row without selecting text
- **THEN** the row's `onRowAction` handler SHALL be triggered normally

#### Scenario: Double-click text selection

- **WHEN** user double-clicks text within a clickable row
- **THEN** the browser's native word selection behavior SHALL apply
- **AND** the row's `onRowAction` handler SHALL NOT be triggered

### Requirement: Row Expansion

The component SHALL support expandable row details with controlled and
uncontrolled state management.

#### Scenario: Expand control

- **WHEN** row has expandable content
- **THEN** SHALL show expand/collapse icon
- **AND** clicking icon SHALL toggle expansion
- **AND** SHALL render expanded content in spanning row

#### Scenario: Expand column header

- **WHEN** the expand column is shown
- **THEN** its header SHALL NOT show an icon, because the header has nothing to
  expand; only the rows below it can be expanded
- **AND** its header SHALL keep the localized accessible name "Expand rows"

#### Scenario: Uncontrolled expansion (default)

- **WHEN** no `expanded` prop is provided
- **THEN** expansion state SHALL be managed internally
- **AND** `defaultExpanded` SHALL set initial expansion state if provided
- **AND** user interactions SHALL update internal state directly

#### Scenario: Controlled expansion

- **WHEN** `expanded` prop is provided
- **THEN** component SHALL reflect the provided expansion state
- **AND** SHALL NOT manage expansion state internally
- **AND** parent component SHALL be responsible for state updates

#### Scenario: Expansion change notification

- **WHEN** expansion state changes via user interaction
- **THEN** SHALL call `onExpandChange` with the new expansion state
- **AND** callback SHALL receive full `Record<string, boolean>` state
