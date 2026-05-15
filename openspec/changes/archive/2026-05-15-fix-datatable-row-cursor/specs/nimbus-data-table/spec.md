## ADDED Requirements

### Requirement: Row Click Cursor Feedback

The component SHALL provide visual cursor feedback when rows are clickable.

#### Scenario: Pointer cursor on clickable rows

- **WHEN** `onRowClick` prop is provided
- **THEN** rows SHALL display `cursor: pointer` on hover
- **AND** the cursor SHALL indicate the row is interactive

#### Scenario: Default cursor on non-clickable rows

- **WHEN** `onRowClick` prop is not provided
- **THEN** rows SHALL display the default cursor
- **AND** no interactive cursor feedback SHALL be shown

#### Scenario: Disabled row cursor

- **WHEN** a row is disabled via `disabledKeys`
- **THEN** the row SHALL display `cursor: not-allowed`
- **AND** the disabled cursor SHALL take precedence over the clickable cursor

### Requirement: Text Selection in Clickable Rows

The component SHALL allow users to select and copy text within table cells,
including in clickable rows.

#### Scenario: Text selection without triggering row click

- **WHEN** user selects text within a clickable row
- **THEN** text selection SHALL work normally
- **AND** the row's `onRowClick` handler SHALL NOT be triggered

#### Scenario: Row click when no text is selected

- **WHEN** user clicks a clickable row without selecting text
- **THEN** the row's `onRowClick` handler SHALL be triggered normally

#### Scenario: Double-click text selection

- **WHEN** user double-clicks text within a clickable row
- **THEN** the browser's native word selection behavior SHALL apply
- **AND** the row's `onRowClick` handler SHALL NOT be triggered

### Requirement: Pin Button Toggle Semantics

The pin button SHALL use toggle button semantics to communicate its state to
assistive technology.

#### Scenario: Pin button communicates pressed state

- **WHEN** a row is pinned
- **THEN** the pin button SHALL have `aria-pressed="true"`
- **AND** the button SHALL be rendered as an `IconToggleButton` with
  `isSelected={true}`

#### Scenario: Pin button communicates unpressed state

- **WHEN** a row is not pinned
- **THEN** the pin button SHALL have `aria-pressed="false"`
- **AND** the button SHALL be rendered as an `IconToggleButton` with
  `isSelected={false}`

### Requirement: Keyboard-Only Focus Rings

Interactive elements within the table SHALL only display focus rings during
keyboard navigation, not on mouse or pointer interaction.

#### Scenario: Focus ring on keyboard navigation

- **WHEN** a user navigates to a row, cell, column header, or resizer via
  keyboard
- **THEN** a visible focus ring SHALL be displayed

#### Scenario: No focus ring on mouse click

- **WHEN** a user clicks a row, cell, column header, or resizer with a mouse
- **THEN** no focus ring SHALL be displayed

### Requirement: Column Resizer Keyboard Discoverability

The column resizer SHALL be visually discoverable when navigated to via keyboard.

#### Scenario: Column divider visible on keyboard focus

- **WHEN** a column resizer receives keyboard focus
- **THEN** the column divider SHALL become visible
- **AND** the user SHALL be able to see which column boundary they are
  interacting with

