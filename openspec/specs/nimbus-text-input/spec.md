# Specification: TextInput Component

## Purpose

The TextInput component provides an accessible single-line text input field with comprehensive validation, formatting, and state management capabilities. It enables users to enter and edit text data with support for multiple input types, validation modes, and accessible labeling.

**Component:** `TextInput`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `TextField` from react-aria-components

## Requirements

### Requirement: Input Type Support
The component SHALL support multiple HTML input types.

#### Scenario: Type variants
- **WHEN** type prop is set
- **THEN** SHALL support: text, email, url, tel, search, password
- **AND** SHALL apply appropriate browser validation
- **AND** SHALL show relevant mobile keyboards
- **AND** SHALL provide type-specific autocomplete suggestions

### Requirement: Controlled and Uncontrolled Modes
The component SHALL support both controlled and uncontrolled state management per nimbus-core standards.

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** SHALL render with provided value
- **AND** SHALL call onChange on every keystroke
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL initialize with defaultValue
- **AND** SHALL manage state internally
- **AND** optional onChange SHALL receive updates

### Requirement: Built-in Validation
The component SHALL provide validation capabilities.

#### Scenario: Required validation
- **WHEN** required={true} is set
- **THEN** SHALL mark field as required
- **AND** SHALL show required indicator
- **AND** SHALL validate on blur
- **AND** SHALL set aria-required="true"

#### Scenario: Pattern validation
- **WHEN** pattern prop is provided
- **THEN** SHALL validate input against regex pattern
- **AND** SHALL show validation error if invalid
- **AND** SHALL provide custom error message via errorMessage prop

#### Scenario: Length validation
- **WHEN** minLength or maxLength props are set
- **THEN** SHALL enforce character length constraints
- **AND** SHALL show character counter if requested
- **AND** SHALL prevent input beyond maxLength

#### Scenario: Custom validation
- **WHEN** validate function prop is provided
- **THEN** SHALL call function on value change
- **AND** SHALL display returned error message
- **AND** SHALL mark field as invalid if validation fails

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styling
- **AND** SHALL prevent all interactions
- **AND** SHALL set aria-disabled="true"

#### Scenario: Read-only state
- **WHEN** readOnly={true} is set
- **THEN** SHALL display value without edit controls
- **AND** SHALL prevent value changes
- **AND** SHALL allow focus and selection
- **AND** SHALL set aria-readonly="true"

#### Scenario: Invalid state
- **WHEN** validation fails
- **THEN** SHALL apply error styling
- **AND** SHALL show error message
- **AND** SHALL set aria-invalid="true"
- **AND** SHALL associate error with aria-describedby

### Requirement: Input Formatting
The component SHALL support value formatting.

#### Scenario: Input transformation
- **WHEN** onChange handler transforms value
- **THEN** SHALL display formatted value
- **AND** SHALL maintain cursor position
- **AND** SHALL preserve user intent

#### Scenario: Placeholder
- **WHEN** placeholder prop is provided
- **THEN** SHALL show placeholder when empty
- **AND** SHALL hide placeholder on focus or input
- **AND** SHALL use aria-placeholder

### Requirement: Clear Button
The component SHALL optionally provide clear functionality.

#### Scenario: Clear button
- **WHEN** isClearable={true} is set
- **THEN** SHALL show clear button when input has value
- **AND** clicking button SHALL clear input value
- **AND** SHALL focus input after clearing
- **AND** SHALL call onChange with empty string

### Requirement: Input Addons
The component SHALL support prefix and suffix elements.

#### Scenario: Left addon
- **WHEN** leftElement prop is provided
- **THEN** SHALL render element before input
- **AND** SHALL apply appropriate spacing
- **AND** SHALL support icons or text

#### Scenario: Right addon
- **WHEN** rightElement prop is provided
- **THEN** SHALL render element after input
- **AND** SHALL apply appropriate spacing
- **AND** SHALL not overlap with clear button

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust height, padding, and font size
- **AND** md SHALL be default size

### Requirement: ARIA Label
The component SHALL provide accessible labeling per nimbus-core standards.

#### Scenario: Label association
- **WHEN** label prop is provided
- **THEN** SHALL render visible label
- **AND** SHALL associate label with input via id
- **AND** SHALL set proper aria-labelledby

#### Scenario: Aria-label fallback
- **WHEN** aria-label is provided without label
- **THEN** SHALL use aria-label for screen readers
- **AND** SHALL not render visible label

### Requirement: Helper Text
The component SHALL support descriptive help text.

#### Scenario: Description text
- **WHEN** description prop is provided
- **THEN** SHALL render helper text below input
- **AND** SHALL associate with input via aria-describedby
- **AND** SHALL maintain association with error messages

### Requirement: Error Messages
The component SHALL display validation errors accessibly.

#### Scenario: Error display
- **WHEN** field is invalid
- **THEN** SHALL show error message
- **AND** SHALL use aria-describedby for association
- **AND** SHALL announce error to screen readers
- **AND** SHALL apply error styling

### Requirement: Keyboard Support
The component SHALL support keyboard interactions per nimbus-core standards.

#### Scenario: Standard keys
- **WHEN** input is focused
- **THEN** typing SHALL insert characters
- **AND** Backspace/Delete SHALL remove characters
- **AND** Arrow keys SHALL move cursor
- **AND** Home/End SHALL move to start/end
- **AND** Ctrl+A SHALL select all (platform-specific)

#### Scenario: Clear shortcut
- **WHEN** Escape is pressed and field has value
- **THEN** SHALL clear input
- **AND** SHALL maintain focus

### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** component is in a form
- **THEN** SHALL include value in form data
- **AND** SHALL use name prop as field name
- **AND** SHALL support form validation
- **AND** SHALL prevent submission if invalid

#### Scenario: Autocomplete
- **WHEN** autoComplete prop is provided
- **THEN** SHALL enable browser autocomplete
- **AND** SHALL support standard autocomplete values
- **AND** SHALL integrate with password managers

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** input renders
- **THEN** SHALL apply textInput slot recipe from theme/slot-recipes/text-input.ts
- **AND** SHALL style: root, label, input, leftElement, rightElement, clearButton, helperText, errorText slots
- **AND** SHALL support size variants

### Requirement: Localized Aria Labels
The component SHALL support i18n for screen reader text per nimbus-core standards.

#### Scenario: Clear button label
- **WHEN** clear button is rendered
- **THEN** SHALL use localized aria-label from text-input.i18n.ts
- **AND** SHALL translate across supported locales
