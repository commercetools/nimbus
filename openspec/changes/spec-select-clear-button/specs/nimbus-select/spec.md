## ADDED Requirements

### Requirement: Clear Button

The component SHALL offer a button that removes the current selection, controlled
by an optional `isClearable` prop of type `boolean` defaulting to `true`.

#### Scenario: Clear button rendering
- **WHEN** `isClearable` is enabled and a selection exists
- **THEN** SHALL render a clear button between the selected value and the chevron
- **AND** SHALL render it with a close icon
- **AND** SHALL render it as a sibling of the trigger button rather than nested within it

#### Scenario: No selection
- **WHEN** no selection exists
- **THEN** SHALL NOT render the clear button
- **AND** the chevron SHALL remain visible

#### Scenario: Clearing disabled
- **WHEN** `isClearable={false}`
- **THEN** SHALL NOT render the clear button for any selection state
- **AND** SHALL NOT reserve horizontal space for it

#### Scenario: Accessible name
- **WHEN** the clear button renders
- **THEN** SHALL label it with the localized `Nimbus.Select.clearSelection` message, defaulting to "Clear selection"
- **AND** SHALL NOT let it inherit the trigger button's accessible name

#### Scenario: Clearing the selection
- **WHEN** user activates the clear button by pointer or keyboard
- **THEN** SHALL set the selection to none
- **AND** SHALL display the placeholder in the trigger
- **AND** SHALL NOT open the options listbox
- **AND** SHALL stop rendering the clear button, since no selection remains

#### Scenario: Keyboard operability
- **WHEN** user traverses the field with Tab
- **THEN** the clear button SHALL be reachable
- **AND** SHALL follow the trigger button in tab order
- **AND** SHALL be activatable with Enter or Space

#### Scenario: Disabled and loading states
- **WHEN** `isDisabled={true}` or `isLoading={true}` is set
- **THEN** SHALL still render the clear button where a selection exists
- **AND** SHALL mark it disabled
- **AND** SHALL NOT allow it to remove the selection by pointer or keyboard
