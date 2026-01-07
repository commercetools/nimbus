# Specification: RadioInput Component

## Purpose

The RadioInput component provides an accessible radio button group for mutually exclusive selection, following ARIA radio group pattern. It enables users to select exactly one option from a set of related options using a compound component architecture (RadioInput.Root and RadioInput.Option) with full support for keyboard navigation, form integration, and theme-based styling.

**Component:** `RadioInput` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `RadioGroup` and `Radio` from react-aria-components

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** RadioInput is imported
- **THEN** SHALL provide RadioInput.Root as group wrapper
- **AND** SHALL provide RadioInput.Option for individual radios
- **AND** Root SHALL be first property in namespace

### Requirement: Single Selection from Group
The component SHALL enforce mutually exclusive selection.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided to Root
- **THEN** SHALL render with specified option selected
- **AND** SHALL call onChange when selection changes
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL initialize with default selection
- **AND** SHALL manage state internally
- **AND** optional onChange SHALL receive updates

#### Scenario: Mutual exclusion
- **WHEN** user selects radio option
- **THEN** SHALL deselect previously selected option
- **AND** only one option SHALL be selected at a time

### Requirement: Option Collection
The component SHALL manage collection of radio options.

#### Scenario: Option rendering
- **WHEN** RadioInput.Option components are children of Root
- **THEN** SHALL render each as radio button with label
- **AND** SHALL associate all options with same group
- **AND** SHALL use name prop to link options

#### Scenario: Option values
- **WHEN** each Option has value prop
- **THEN** SHALL use value for selection state
- **AND** SHALL pass value to onChange handler
- **AND** values SHALL be unique within group

### Requirement: Selection Interaction
The component SHALL respond to user interactions.

#### Scenario: Click selection
- **WHEN** user clicks radio or its label
- **THEN** SHALL select that option
- **AND** SHALL deselect other options
- **AND** SHALL call onChange with new value

#### Scenario: Keyboard selection
- **WHEN** option is focused and user presses Space
- **THEN** SHALL select that option
- **AND** SHALL call onChange handler

### Requirement: Radio Group Navigation
The component SHALL support keyboard navigation per nimbus-core standards.

#### Scenario: Arrow key navigation
- **WHEN** group has focus and user presses ArrowDown or ArrowRight
- **THEN** SHALL move focus to next option and select it
- **AND** SHALL wrap to first option if at end
- **WHEN** user presses ArrowUp or ArrowLeft
- **THEN** SHALL move focus to previous option and select it
- **AND** SHALL wrap to last option if at beginning

#### Scenario: Tab navigation
- **WHEN** user presses Tab
- **THEN** SHALL move focus to next focusable element outside group
- **WHEN** Shift+Tab is pressed
- **THEN** SHALL move focus to previous focusable element

#### Scenario: Focus management
- **WHEN** group receives focus
- **THEN** SHALL focus selected option (if exists)
- **OR** first option (if no selection)
- **AND** only one option SHALL be in tab order at a time

### Requirement: Layout Direction
The component SHALL support horizontal and vertical layouts.

#### Scenario: Vertical orientation
- **WHEN** orientation="vertical" (default)
- **THEN** SHALL stack options vertically
- **AND** SHALL use ArrowUp/Down for navigation

#### Scenario: Horizontal orientation
- **WHEN** orientation="horizontal" is set
- **THEN** SHALL arrange options horizontally
- **AND** SHALL use ArrowLeft/Right for navigation

### Requirement: Option State Management
The component SHALL support option state variations.

#### Scenario: Disabled options
- **WHEN** Option has disabled={true}
- **THEN** SHALL apply disabled styling
- **AND** SHALL skip during keyboard navigation
- **AND** SHALL not be selectable
- **AND** SHALL set aria-disabled="true"

#### Scenario: Disabled group
- **WHEN** Root has disabled={true}
- **THEN** SHALL disable all options
- **AND** SHALL prevent all interactions

### Requirement: Group Validation
The component SHALL validate selection state.

#### Scenario: Required validation
- **WHEN** required={true} is set on Root
- **THEN** SHALL require selection of an option
- **AND** SHALL show required indicator
- **AND** SHALL validate on change
- **AND** SHALL set aria-required="true" on group

#### Scenario: Invalid state
- **WHEN** validation fails or invalid={true} is set
- **THEN** SHALL apply error styling to group
- **AND** SHALL show error message
- **AND** SHALL set aria-invalid="true" on group
- **AND** SHALL associate error via aria-describedby

### Requirement: Group Labeling
The component SHALL provide accessible group labeling per nimbus-core standards.

#### Scenario: Group label
- **WHEN** label prop is provided to Root
- **THEN** SHALL render visible group label
- **AND** SHALL associate with group via fieldset/legend
- **AND** SHALL use aria-labelledby

#### Scenario: Description text
- **WHEN** description prop is provided
- **THEN** SHALL render helper text for group
- **AND** SHALL associate with group via aria-describedby

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set on Root
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust radio button size and label font size
- **AND** md SHALL be default size

### Requirement: ARIA Radio Group Pattern
The component SHALL implement ARIA radio group pattern per nimbus-core standards.

#### Scenario: Group roles
- **WHEN** group renders
- **THEN** Root SHALL use fieldset/legend or role="radiogroup"
- **AND** each Option SHALL have role="radio"
- **AND** selected option SHALL have aria-checked="true"
- **AND** unselected options SHALL have aria-checked="false"

#### Scenario: Roving tabindex
- **WHEN** navigating with keyboard
- **THEN** SHALL use roving tabindex pattern
- **AND** only selected or first option SHALL have tabindex="0"
- **AND** other options SHALL have tabindex="-1"

#### Scenario: State announcements
- **WHEN** selection changes
- **THEN** SHALL announce new selection to screen readers
- **AND** SHALL provide clear selection state

### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** group is in a form
- **THEN** SHALL include selected value in form data
- **AND** SHALL use name prop (from Root) as field name
- **AND** SHALL submit value of selected Option

#### Scenario: Form validation
- **WHEN** form validates
- **THEN** SHALL validate required state
- **AND** SHALL prevent submission if invalid

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** group renders
- **THEN** SHALL apply radioInput slot recipe from theme/slot-recipes/radio-input.ts
- **AND** SHALL style: root, groupLabel, option, control, indicator, label, description, helperText, errorText slots
- **AND** SHALL support size variants
- **AND** SHALL support selected, unselected, disabled, invalid states

### Requirement: Semantic Colors
The component SHALL support semantic color palettes per nimbus-core standards.

#### Scenario: Color variants
- **WHEN** colorPalette prop is set on Root
- **THEN** SHALL support semantic palettes: primary, neutral, info, positive, warning, critical
- **AND** SHALL apply palette color to selected state
- **AND** primary SHALL be default
