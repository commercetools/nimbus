## ADDED Requirements

### Requirement: Trailing Element
The component SHALL accept an optional `trailingElement` of type `ReactNode`, rendered after the input and before the clear button.

#### Scenario: Trailing element rendering
- **WHEN** `trailingElement` is provided
- **THEN** SHALL render the element in the trailingElement slot
- **AND** SHALL position it after the input and before the clear button
- **AND** SHALL scale contained icons according to size variant (md: 20px, sm: 16px)
- **AND** SHALL apply neutral.11 color

#### Scenario: Trailing element omitted
- **WHEN** `trailingElement` is not provided
- **THEN** SHALL NOT render the trailingElement slot
- **AND** SHALL NOT reserve horizontal space for it

#### Scenario: Interactive trailing element
- **WHEN** `trailingElement` contains a button
- **THEN** the button SHALL be reachable by keyboard
- **AND** activating it SHALL invoke its own handler
- **AND** activating it SHALL NOT clear the input value
- **AND** clicking it SHALL NOT move focus to the input

#### Scenario: Trailing element in disabled state
- **WHEN** `isDisabled={true}` is set
- **THEN** SHALL apply disabled styling to the trailing element
- **AND** any interactive content within it SHALL NOT be activatable

## MODIFIED Requirements

### Requirement: Search Icon
The component SHALL display a search icon as a visual indicator by default, and SHALL allow that leading content to be replaced or removed via an optional `leadingElement` prop of type `ReactNode`.

#### Scenario: Icon rendering
- **WHEN** component renders
- **THEN** SHALL display Search icon in leadingElement slot
- **AND** SHALL position icon at the left side of input
- **AND** SHALL scale icon according to size variant (md: 20px, sm: 16px)
- **AND** SHALL apply neutral.11 color to icon

#### Scenario: Icon with disabled state
- **WHEN** isDisabled={true} is set
- **THEN** SHALL maintain search icon visibility
- **AND** SHALL apply disabled styling to icon
- **AND** SHALL keep icon in disabled color palette

#### Scenario: Default leading content
- **WHEN** `leadingElement` is not provided
- **THEN** SHALL render the Search icon, preserving existing rendering

#### Scenario: Replaced leading content
- **WHEN** `leadingElement` is provided
- **THEN** SHALL render the provided element in the leadingElement slot instead of the Search icon

#### Scenario: Removed leading content
- **WHEN** `leadingElement` is explicitly `null`
- **THEN** SHALL NOT render the leadingElement slot
- **AND** SHALL NOT reserve horizontal space for it

#### Scenario: Interactive leading element
- **WHEN** `leadingElement` contains a button
- **THEN** the button SHALL receive pointer events
- **AND** the button SHALL be reachable by keyboard
- **AND** activating it SHALL invoke its own handler
- **AND** clicking it SHALL NOT move focus to the input

#### Scenario: Click-to-focus on field chrome
- **WHEN** user clicks non-interactive field chrome, including default leading icon content
- **THEN** SHALL move focus to the input

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply searchInput slot recipe from theme/slot-recipes/search-input.ts
- **AND** SHALL style slots: root, leadingElement, trailingElement, input
- **AND** root slot SHALL be container with flex layout
- **AND** leadingElement slot SHALL contain the search icon or consumer-provided leading content
- **AND** trailingElement slot SHALL contain consumer-provided trailing content
- **AND** input slot SHALL be the text input element

#### Scenario: Recipe registration
- **WHEN** package builds
- **THEN** searchInputSlotRecipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL be manual (no auto-discovery)
- **AND** recipe className SHALL be "nimbus-search-input"

#### Scenario: State-based styling
- **WHEN** component state changes
- **THEN** SHALL apply data attributes: data-disabled, data-invalid
- **AND** recipe SHALL respond to these data attributes
- **AND** SHALL use CSS selectors: _focusWithin, _hover, _disabled
- **AND** SHALL support pseudo-selectors for interactive states
