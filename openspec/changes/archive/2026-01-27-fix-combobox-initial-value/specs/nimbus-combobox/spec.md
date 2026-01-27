# Specification Delta: ComboBox Initial Value Synchronization

**Change Type:** MODIFIED

## MODIFIED Requirements

### Requirement: Single Selection with Input

The component SHALL combine text input with selection capability and synchronize
input value with selected key on initial render.

#### Scenario: Controlled mode

- **WHEN** selectedKey and onSelectionChange props are provided
- **THEN** SHALL render with selected option
- **AND** SHALL display selected option text in input
- **AND** SHALL call onSelectionChange when selection changes

#### Scenario: Uncontrolled mode

- **WHEN** defaultSelectedKey prop is provided
- **THEN** SHALL initialize with default selection
- **AND** SHALL manage state internally

#### Scenario: Input value

- **WHEN** inputValue and onInputChange props are provided
- **THEN** SHALL control input text independently from selection
- **AND** SHALL call onInputChange on every keystroke
- **AND** SHALL support free-form text entry

#### Scenario: Pre-selected value on mount

- **GIVEN** ComboBox is rendered with `selectedKeys={["apple"]}`
- **AND** no `inputValue` prop is provided (uncontrolled input)
- **AND** `selectionMode="single"` (default)
- **WHEN** component mounts and collection is populated
- **THEN** input field SHALL display the selected item's text value (e.g.,
  "Apple")
- **AND** clear button SHALL be visible
- **AND** SHALL NOT require explicit `inputValue` prop for synchronization

#### Scenario: Collection populates after initial render

- **GIVEN** ComboBox is rendered with `selectedKeys={["apple"]}`
- **AND** React Aria's CollectionBuilder is parsing children
- **WHEN** collection transitions from unpopulated to populated state
- **THEN** SHALL detect the transition
- **AND** SHALL resolve selected item's text value from collection
- **AND** SHALL update input value with resolved text
- **AND** SHALL NOT cause multiple re-renders or flickering

#### Scenario: Selection key present but node not in collection

- **GIVEN** ComboBox has `selectedKeys={["apple"]}`
- **AND** collection does not contain item with key "apple"
- **WHEN** component renders
- **THEN** input SHALL remain empty
- **AND** clear button SHALL NOT be visible
- **WHEN** collection later includes item with key "apple"
- **THEN** SHALL update input with item's text value

#### Scenario: Controlled input value unchanged

- **GIVEN** ComboBox has both `selectedKeys={["apple"]}` and
  `inputValue="Custom"`
- **WHEN** component renders
- **THEN** input SHALL display "Custom" (controlled value)
- **AND** SHALL NOT override with selected item's text
- **AND** SHALL maintain existing controlled behavior

#### Scenario: Multi-select mode unchanged

- **GIVEN** ComboBox has `selectionMode="multiple"`
- **AND** `selectedKeys={["apple", "banana"]}`
- **WHEN** component renders
- **THEN** input SHALL remain empty (existing behavior)
- **AND** selected items SHALL appear as tags
- **AND** SHALL NOT attempt to sync input value

#### Scenario: Read-only state with initial selection

- **GIVEN** ComboBox has `isReadOnly={true}`
- **AND** `selectedKeys={["apple"]}`
- **WHEN** component renders
- **THEN** input SHALL display selected item's text
- **AND** clear button SHALL be visible
- **AND** SHALL prevent user interaction with input
