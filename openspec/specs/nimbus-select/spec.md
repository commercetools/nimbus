# Specification: Select Component

## Purpose

The Select component provides an accessible dropdown selection control following ARIA listbox pattern with keyboard navigation, search, and validation. It enables users to choose a single value from a list of options with comprehensive keyboard support, field validation, and visual state indicators.

**Component:** `Select`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `Select` from react-aria-components

## Requirements

### Requirement: Single Selection
The component SHALL support single-value selection.

#### Scenario: Controlled mode
- **WHEN** selectedKey and onSelectionChange props are provided
- **THEN** SHALL render with selected option highlighted
- **AND** SHALL call onSelectionChange when selection changes
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultSelectedKey prop is provided without selectedKey
- **THEN** SHALL initialize with default selection
- **AND** SHALL manage state internally
- **AND** optional onSelectionChange SHALL receive updates

### Requirement: Option Collection
The component SHALL manage collection of selectable options.

#### Scenario: Static options
- **WHEN** children contain Select.Option components
- **THEN** SHALL render options in dropdown
- **AND** SHALL support option labels and values
- **AND** SHALL render in order provided

#### Scenario: Dynamic options
- **WHEN** items prop is provided with data array
- **THEN** SHALL render options from data
- **AND** SHALL use render props pattern for option content
- **AND** SHALL support collection-based rendering

#### Scenario: Option groups
- **WHEN** Select.Section components are used
- **THEN** SHALL render grouped options with headers
- **AND** SHALL maintain semantic grouping
- **AND** SHALL support section titles

### Requirement: Option State Management
The component SHALL support option state variations.

#### Scenario: Disabled options
- **WHEN** Option has disabled={true}
- **THEN** SHALL apply disabled styling
- **AND** SHALL skip during keyboard navigation
- **AND** SHALL not be selectable
- **AND** SHALL set aria-disabled="true"

#### Scenario: Selected indication
- **WHEN** option is selected
- **THEN** SHALL show checkmark indicator
- **AND** SHALL apply selected styling
- **AND** SHALL set aria-selected="true"

### Requirement: Trigger Control
The component SHALL provide button to open dropdown.

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

### Requirement: Overlay Positioning
The component SHALL intelligently position dropdown relative to trigger.

#### Scenario: Placement options
- **WHEN** placement prop is set
- **THEN** SHALL support: bottom, bottom-start, bottom-end, top, top-start, top-end
- **AND** SHALL auto-adjust to avoid viewport overflow
- **AND** SHALL use React Aria's overlay positioning

#### Scenario: Scroll handling
- **WHEN** options exceed viewport height
- **THEN** SHALL enable scrolling within dropdown
- **AND** SHALL maintain focus visibility
- **AND** SHALL support keyboard navigation through scrolled options

### Requirement: Keyboard Interaction
The component SHALL support comprehensive keyboard navigation per nimbus-core standards.

#### Scenario: Option navigation
- **WHEN** dropdown is open and user presses ArrowDown
- **THEN** SHALL focus next option (wrap to first if at end)
- **WHEN** user presses ArrowUp
- **THEN** SHALL focus previous option (wrap to last if at beginning)
- **WHEN** user presses Home
- **THEN** SHALL focus first option
- **WHEN** user presses End
- **THEN** SHALL focus last option

#### Scenario: Selection
- **WHEN** option is focused and user presses Enter or Space
- **THEN** SHALL select option
- **AND** SHALL close dropdown
- **AND** SHALL return focus to trigger

#### Scenario: Typeahead search
- **WHEN** dropdown is open and user types characters
- **THEN** SHALL focus first option matching typed text
- **AND** SHALL support rapid typing for multi-character search
- **AND** SHALL reset search after timeout

#### Scenario: Close actions
- **WHEN** dropdown is open and user presses Escape
- **THEN** SHALL close dropdown without selection
- **AND** SHALL return focus to trigger
- **WHEN** user presses Tab
- **THEN** SHALL close dropdown
- **AND** SHALL move focus to next tabbable element

### Requirement: Close Behavior
The component SHALL close dropdown in appropriate situations.

#### Scenario: Selection close
- **WHEN** user selects option
- **THEN** SHALL close dropdown by default
- **AND** closeOnSelect prop SHALL control this behavior

#### Scenario: Outside click
- **WHEN** user clicks outside dropdown
- **THEN** SHALL close dropdown
- **AND** SHALL maintain current selection

### Requirement: Selection Validation
The component SHALL validate selection state.

#### Scenario: Required validation
- **WHEN** required={true} is set
- **THEN** SHALL require selection
- **AND** SHALL show required indicator
- **AND** SHALL validate on blur
- **AND** SHALL set aria-required="true"

#### Scenario: Invalid state
- **WHEN** validation fails
- **THEN** SHALL apply error styling to trigger
- **AND** SHALL show error message
- **AND** SHALL set aria-invalid="true"
- **AND** SHALL associate error with aria-describedby

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styling to trigger
- **AND** SHALL prevent opening dropdown
- **AND** SHALL set aria-disabled="true"

#### Scenario: Read-only state
- **WHEN** readOnly={true} is set
- **THEN** SHALL display selected value
- **AND** SHALL prevent opening dropdown
- **AND** SHALL set aria-readonly="true"

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust trigger height, padding, and font size
- **AND** md SHALL be default size

### Requirement: ARIA Listbox Pattern
The component SHALL implement ARIA listbox pattern per nimbus-core standards.

#### Scenario: Listbox roles
- **WHEN** dropdown renders
- **THEN** trigger SHALL have role="button"
- **AND** SHALL set aria-haspopup="listbox"
- **AND** dropdown SHALL have role="listbox"
- **AND** options SHALL have role="option"

#### Scenario: Label association
- **WHEN** label prop is provided
- **THEN** SHALL render visible label
- **AND** SHALL associate with trigger via aria-labelledby

#### Scenario: State announcements
- **WHEN** selection changes
- **THEN** SHALL announce selected option to screen readers
- **AND** SHALL use aria-live regions

### Requirement: Internationalized Labels
The component SHALL use i18n for screen reader text per nimbus-core standards.

#### Scenario: Default placeholder
- **WHEN** no selection is made
- **THEN** placeholder SHALL use i18n message
- **AND** SHALL translate across supported locales

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply select slot recipe from theme/slot-recipes/select.ts
- **AND** SHALL style: root, label, trigger, valueText, icon, dropdown, option, section, helperText, errorText slots
- **AND** SHALL support size variants

### Requirement: Async Loading
The component SHALL support loading states for async options.

#### Scenario: Loading indication
- **WHEN** loading={true} is set
- **THEN** SHALL show loading spinner in dropdown
- **AND** SHALL disable option selection
- **AND** SHALL maintain dropdown open state

### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** component is in a form
- **THEN** SHALL include selected value in form data
- **AND** SHALL use name prop as field name
- **AND** SHALL validate before submission
