## ADDED Requirements

### Requirement: Trailing Element
The component SHALL accept an optional `trailingElement` of type `ReactNode` on `Select.Root`, rendered after the selected value and before the clear button and chevron.

#### Scenario: Trailing element rendering
- **WHEN** `trailingElement` is provided
- **THEN** SHALL render the element in the trailingElement slot
- **AND** SHALL position it after the value and before the clear button
- **AND** SHALL scale contained icons according to size variant (md: 20px, sm: 16px)
- **AND** SHALL apply neutral.11 color

#### Scenario: Trailing element omitted
- **WHEN** `trailingElement` is not provided
- **THEN** SHALL NOT render the trailingElement slot
- **AND** SHALL NOT reserve horizontal space for it

#### Scenario: Interactive trailing element
- **WHEN** `trailingElement` contains a button
- **THEN** the button SHALL NOT be nested within the trigger button
- **AND** the button SHALL be reachable by keyboard
- **AND** activating it SHALL invoke its own handler
- **AND** activating it SHALL NOT open the options listbox
- **AND** activating it SHALL NOT change the selected value
- **AND** the button SHALL NOT inherit the trigger's accessible name

#### Scenario: Trailing element with leading element
- **WHEN** both `leadingElement` and `trailingElement` are provided
- **THEN** SHALL render both without overlap
- **AND** SHALL keep the selected value between them
- **AND** SHALL truncate the value rather than overlap the trailing element when space is constrained

#### Scenario: Trailing element in disabled state
- **WHEN** `isDisabled={true}` or `isLoading={true}` is set
- **THEN** SHALL apply disabled styling to the trailing element
- **AND** any interactive content within it SHALL NOT be activatable

## MODIFIED Requirements

### Requirement: Trigger Control
The component SHALL provide a button to open the dropdown, contained within a non-interactive field container that owns the field's visual chrome.

#### Scenario: Trigger display
- **WHEN** dropdown is closed
- **THEN** SHALL show selected option label in button
- **OR** placeholder text if no selection
- **AND** SHALL show chevron icon
- **AND** SHALL indicate dropdown state with aria-expanded

#### Scenario: Trigger interaction
- **WHEN** user clicks trigger
- **THEN** SHALL toggle dropdown open/closed
- **WHEN** user presses Enter, Space, or ArrowDown
- **THEN** SHALL open dropdown
- **AND** SHALL focus first option or selected option

#### Scenario: Field container structure
- **WHEN** component renders
- **THEN** the field container SHALL carry the border, background, height, padding and border radius
- **AND** the container SHALL NOT be an interactive element
- **AND** the trigger button SHALL contain the selected value so it remains the button's accessible name
- **AND** the trigger button SHALL fill the horizontal space not occupied by the trailing element, clear button and chevron
- **AND** the clear button, chevron and any trailing element SHALL be siblings of the trigger button rather than nested within it

#### Scenario: Focus indication
- **WHEN** focus moves to the trigger button or to any control within the field container
- **THEN** SHALL render the focus ring around the whole field container
- **AND** SHALL NOT render a separate focus ring around the trigger button

#### Scenario: Click target
- **WHEN** user clicks anywhere in the field container other than the trailing element, clear button or chevron
- **THEN** SHALL toggle the dropdown

#### Scenario: Overlay width
- **WHEN** the dropdown opens
- **THEN** the overlay SHALL be at least as wide as the field container
- **AND** SHALL align to the container's leading edge

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply select slot recipe from theme/slot-recipes/select.ts
- **AND** SHALL style: root, label, trigger, triggerButton, valueText, icon, trailingElement, dropdown, option, section, helperText, errorText slots
- **AND** the trigger slot SHALL be the non-interactive field container
- **AND** the triggerButton slot SHALL be the interactive element that opens the dropdown
- **AND** SHALL support size variants
