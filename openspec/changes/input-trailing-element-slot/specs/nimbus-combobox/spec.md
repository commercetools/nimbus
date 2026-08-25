## ADDED Requirements

### Requirement: Trailing Element

The component SHALL accept an optional `trailingElement` of type `ReactNode` on
`ComboBox.Root`, rendered inside the trigger after the input content and before
the clear and toggle buttons.

#### Scenario: Trailing element rendering

- **WHEN** `trailingElement` is provided
- **THEN** SHALL render the element in the trailingElement slot
- **AND** SHALL position it after the input content and before the clear button
- **AND** SHALL scale contained icons according to size variant (md: 20px, sm:
  16px)
- **AND** SHALL apply neutral.11 color

#### Scenario: Trailing element omitted

- **WHEN** `trailingElement` is not provided
- **THEN** SHALL NOT render the trailingElement slot
- **AND** SHALL NOT reserve horizontal space for it

#### Scenario: Interactive trailing element

- **WHEN** `trailingElement` contains a button
- **THEN** the button SHALL be reachable by keyboard
- **AND** activating it SHALL invoke its own handler
- **AND** activating it SHALL NOT open the options popover
- **AND** activating it SHALL NOT clear the input value

#### Scenario: Trailing element with leading element

- **WHEN** both `leadingElement` and `trailingElement` are provided
- **THEN** SHALL render both without overlap
- **AND** SHALL keep the input content between them
- **AND** SHALL mirror both positions under right-to-left text direction

#### Scenario: Trailing element in disabled state

- **WHEN** `isDisabled={true}` is set
- **THEN** SHALL apply disabled styling to the trailing element
- **AND** any interactive content within it SHALL NOT be activatable

## MODIFIED Requirements

### Requirement: Multi-Slot Recipe

The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling

- **WHEN** component renders
- **THEN** SHALL apply combobox slot recipe from theme/slot-recipes/combobox.ts
- **AND** SHALL style: root, label, inputWrapper, input, toggleButton,
  clearButton, dropdown, option, section, noResults, loadingState, helperText,
  errorText slots
- **AND** SHALL style a trailingElement slot positioned between the input
  content and the clear button
- **AND** SHALL support size variants
