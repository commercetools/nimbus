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

## REMOVED Requirements

### Requirement: isRowClickable Prop

**Reason**: The `isRowClickable` prop is defined in types but not consumed by
any component. The `onRowClick` prop already serves as the indicator of row
clickability -- if provided, rows are clickable; if not, they aren't. Keeping
both creates confusion about which one controls behavior.

**Migration**: Remove any usage of `isRowClickable` prop. Use `onRowClick` to
control row click behavior.
