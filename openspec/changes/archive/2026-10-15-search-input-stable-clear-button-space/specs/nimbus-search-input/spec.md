## MODIFIED Requirements

### Requirement: Clear Button
The component SHALL provide a clear button to remove search text.

#### Scenario: Clear button rendering
- **WHEN** input has value
- **THEN** SHALL display clear button with Close icon
- **AND** SHALL render IconButton with size="2xs"
- **AND** SHALL use ghost variant with primary colorPalette
- **AND** SHALL position button at the trailing edge of the field, after the trailingElement
- **AND** SHALL set aria-label to localized "Clear search input" message

#### Scenario: Clear button on an empty field
- **WHEN** input is empty
- **THEN** SHALL NOT render the clear button in the DOM
- **AND** SHALL NOT expose a clear button in the accessibility tree
- **AND** a trailingElement SHALL sit at the trailing edge of the field

#### Scenario: Stable field width
- **WHEN** the clear button appears or is removed
- **THEN** the field's outer width SHALL NOT change
- **AND** this SHALL hold for the input's default width and for a width set by the consumer
- **AND** SHALL NOT replace the input's default width with a fixed width

#### Scenario: Empty field uses the clear button's space
- **WHEN** input is empty
- **THEN** the input element SHALL extend over the clear button's space
- **AND** a placeholder SHALL be able to use the space up to the trailingElement or the field's trailing edge

#### Scenario: Narrow field
- **WHEN** the field is narrower than the input's default width
- **THEN** the input SHALL shrink to fit
- **AND** the input, the trailingElement and the clear button SHALL stay inside the field's outline

#### Scenario: Clear button interaction
- **WHEN** user clicks clear button
- **THEN** SHALL set input value to empty string
- **AND** SHALL call onChange with empty string
- **AND** SHALL call onClear callback if provided
- **AND** SHALL maintain focus on input field
- **AND** SHALL remove the clear button after clearing

#### Scenario: Clear button with disabled input
- **WHEN** isDisabled={true} is set
- **THEN** SHALL disable clear button
- **AND** SHALL apply disabled styling to button
- **AND** SHALL prevent button interactions

#### Scenario: Clear button with readonly input
- **WHEN** isReadOnly={true} is set
- **THEN** SHALL disable clear button
- **AND** SHALL prevent button interactions
- **AND** SHALL keep button visible if value exists

#### Scenario: Clear button tab order
- **WHEN** user navigates with Tab key
- **THEN** clear button SHALL have tabindex="-1"
- **AND** SHALL NOT be focusable via keyboard navigation
- **AND** SHALL only be clickable with mouse/pointer

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply searchInput slot recipe from theme/slot-recipes/search-input.ts
- **AND** SHALL style slots: root, leadingElement, trailingElement, inputWrapper, input
- **AND** root slot SHALL be container with flex layout
- **AND** leadingElement slot SHALL contain the search icon or consumer-provided leading content
- **AND** trailingElement slot SHALL contain consumer-provided trailing content
- **AND** inputWrapper slot SHALL contain the input and SHALL hold the clear button's space while the input is empty
- **AND** input slot SHALL be the text input element

#### Scenario: Recipe registration
- **WHEN** package builds
- **THEN** searchInputSlotRecipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL be manual (no auto-discovery)
- **AND** recipe className SHALL be "nimbus-search-input"

#### Scenario: State-based styling
- **WHEN** component state changes
- **THEN** SHALL apply data attributes: data-disabled, data-invalid, data-empty
- **AND** recipe SHALL respond to these data attributes
- **AND** SHALL use CSS selectors: _focusWithin, _hover, _disabled
- **AND** SHALL support pseudo-selectors for interactive states
