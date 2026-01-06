# Specification: SearchInputField Component

## Overview

The SearchInputField component is a pre-composed field pattern that combines SearchInput with FormField to provide a complete, accessible search input form field with an intuitive flat API. It encapsulates label, hint text, error messaging, validation feedback, search icon, and clear button functionality in a single component, reducing boilerplate code for common search field scenarios.

**Component:** `SearchInputField`
**Package:** `@commercetools/nimbus`
**Type:** Pattern component (pre-composed field wrapper)
**Pattern:** Combines FormField + SearchInput composition
**Location:** `packages/nimbus/src/patterns/fields/search-input-field/`

## Purpose

Provide a simplified, high-level API for creating complete search input form fields without manually composing FormField and SearchInput components. Offers an ergonomic interface for search use cases including page search, filter search, data table search, and content discovery while maintaining full accessibility and error handling capabilities.

## Requirements

### Requirement: Component Composition
The component SHALL compose FormField.Root, FormField.Label, FormField.Input, FormField.Description, FormField.Error, FormField.InfoBox, and SearchInput.

#### Scenario: Component structure
- **WHEN** SearchInputField renders
- **THEN** SHALL render FormField.Root as outer wrapper
- **AND** SHALL render FormField.Label containing label prop
- **AND** SHALL render FormField.Input wrapping SearchInput component
- **AND** SHALL pass all SearchInput-specific props to SearchInput element
- **AND** SHALL pass all FormField-specific props to FormField.Root

#### Scenario: Internal composition
- **WHEN** component renders
- **THEN** SearchInput SHALL be wrapped in FormField.Input
- **AND** FormField SHALL handle ARIA associations automatically
- **AND** FormField SHALL coordinate label, input, description, and error rendering
- **AND** SearchInput SHALL receive field state from FormField via props cloning

#### Scenario: Single-component interface
- **WHEN** developer uses SearchInputField
- **THEN** SHALL accept flat props API (no nested components required)
- **AND** SHALL eliminate need for manual FormField composition
- **AND** SHALL provide same functionality as FormField + SearchInput combination
- **AND** SHALL be drop-in replacement for common search field patterns

### Requirement: Label Prop and Rendering
The component SHALL require a label prop and render it via FormField.Label per nimbus-core standards.

#### Scenario: Label prop requirement
- **WHEN** SearchInputField is instantiated
- **THEN** label prop SHALL be required (TypeScript enforces)
- **AND** label SHALL accept ReactNode (string or JSX)
- **AND** component SHALL NOT render without label (accessibility requirement)

#### Scenario: Label rendering
- **WHEN** label prop is provided
- **THEN** SHALL render via FormField.Label component
- **AND** SHALL automatically associate with input via aria-labelledby
- **AND** label SHALL be clickable to focus input
- **AND** label element SHALL use semantic <label> tag

#### Scenario: Required indicator
- **WHEN** isRequired={true} is set
- **THEN** label SHALL display asterisk (*) indicator
- **AND** asterisk SHALL be styled per FormField recipe
- **AND** input SHALL have aria-required="true"
- **AND** FormField SHALL handle required indicator rendering

### Requirement: Description Prop Support
The component SHALL support optional description prop for helper text per nimbus-core standards.

#### Scenario: Description rendering
- **WHEN** description prop is provided
- **THEN** SHALL render via FormField.Description component
- **AND** SHALL display below input element
- **AND** SHALL associate with input via aria-describedby
- **AND** SHALL accept ReactNode (string or JSX)

#### Scenario: Description omission
- **WHEN** description prop is not provided
- **THEN** SHALL NOT render FormField.Description element
- **AND** SHALL not add description to aria-describedby
- **AND** component SHALL render without description text

#### Scenario: Description with errors
- **WHEN** both description and errors are present
- **THEN** SHALL render both description and error messages
- **AND** input aria-describedby SHALL reference both elements
- **AND** FormField SHALL coordinate both associations

### Requirement: Info Prop for Contextual Help
The component SHALL support optional info prop for info box popover per nimbus-core standards.

#### Scenario: Info box rendering
- **WHEN** info prop is provided
- **THEN** SHALL render via FormField.InfoBox component
- **AND** SHALL display help icon button next to label
- **AND** info content SHALL appear in popover on button click
- **AND** SHALL accept ReactNode for info content

#### Scenario: Info box omission
- **WHEN** info prop is not provided
- **THEN** SHALL NOT render FormField.InfoBox
- **AND** SHALL NOT render help icon button
- **AND** label SHALL render without info trigger

#### Scenario: Info box accessibility
- **WHEN** info box is present and opened
- **THEN** info content SHALL be associated with input via aria-describedby
- **AND** info button SHALL have appropriate aria-label
- **AND** popover SHALL be keyboard accessible (Enter/Space to open, Escape to close)

### Requirement: Error Handling with FieldErrors
The component SHALL support errors prop using FieldErrors format with touched state per nimbus-core standards.

#### Scenario: Errors prop format
- **WHEN** errors prop is provided
- **THEN** SHALL accept FieldErrorsData type (Record<string, boolean>)
- **AND** SHALL support UI-Kit error format for compatibility
- **AND** SHALL only render truthy error values
- **AND** SHALL support all FieldErrorTypes (missing, invalid, format, etc.)

#### Scenario: Touched state control
- **WHEN** errors and touched props are provided
- **THEN** errors SHALL only display when touched={true}
- **AND** touched={false} SHALL hide error messages
- **AND** default touched value SHALL be false
- **AND** allows developers to control when validation errors appear

#### Scenario: Error rendering
- **WHEN** touched={true} and errors contain truthy values
- **THEN** SHALL render FormField.Error wrapping FieldErrors component
- **AND** FieldErrors SHALL render localized error messages
- **AND** SHALL display error icon with each message
- **AND** errors SHALL be associated with input via aria-describedby

#### Scenario: Error omission
- **WHEN** touched={false} OR errors is undefined OR all errors are false
- **THEN** SHALL NOT render FormField.Error element
- **AND** SHALL NOT render FieldErrors component
- **AND** field SHALL not be in invalid state

#### Scenario: Custom error rendering
- **WHEN** renderError prop is provided
- **THEN** SHALL pass renderError to FieldErrors component
- **AND** renderError function SHALL receive error key
- **AND** renderError SHALL allow custom error message rendering
- **AND** SHALL override default localized messages when provided

### Requirement: Validation State Management
The component SHALL manage validation states and propagate to FormField per nimbus-core standards.

#### Scenario: Invalid state determination
- **WHEN** component renders
- **THEN** SHALL calculate invalid state as: (touched && hasErrors) || isInvalid
- **AND** hasErrors SHALL be true when errors object has truthy values
- **AND** isInvalid prop SHALL allow manual control of invalid state
- **AND** FormField.Root SHALL receive computed isInvalid value

#### Scenario: Required state
- **WHEN** isRequired prop is set
- **THEN** SHALL pass isRequired to FormField.Root
- **AND** FormField SHALL display required indicator in label
- **AND** SearchInput SHALL receive isRequired via props cloning
- **AND** input SHALL have aria-required="true"

#### Scenario: Disabled state
- **WHEN** isDisabled prop is set
- **THEN** SHALL pass isDisabled to FormField.Root
- **AND** SearchInput SHALL receive isDisabled and be non-interactive
- **AND** input SHALL have disabled attribute
- **AND** clear button SHALL be disabled
- **AND** FormField SHALL apply disabled styling

#### Scenario: Read-only state
- **WHEN** isReadOnly prop is set
- **THEN** SHALL pass isReadOnly to FormField.Root
- **AND** SearchInput SHALL receive isReadOnly
- **AND** input SHALL be focusable but non-editable
- **AND** input SHALL have readonly attribute
- **AND** clear button SHALL be disabled in read-only state

### Requirement: SearchInput Props Passthrough
The component SHALL accept and forward all SearchInput props per nimbus-core standards.

#### Scenario: Value and onChange
- **WHEN** value and onChange props are provided
- **THEN** SHALL pass to SearchInput for controlled component pattern
- **AND** onChange SHALL receive string value (not event)
- **AND** SearchInput SHALL update value on user input
- **AND** controlled pattern SHALL work as expected

#### Scenario: Placeholder
- **WHEN** placeholder prop is provided
- **THEN** SHALL pass to SearchInput
- **AND** SearchInput SHALL display placeholder in empty input
- **AND** placeholder SHALL NOT replace label for accessibility
- **AND** typical placeholder values are "Search..." or "Type to search"

#### Scenario: Search icon rendering
- **WHEN** SearchInput is rendered
- **THEN** SHALL display search icon (magnifying glass) on left side
- **AND** icon SHALL be provided by SearchInput leadingElement slot
- **AND** icon SHALL be visible in all states (empty, filled, disabled)
- **AND** icon SHALL NOT be interactive or receive focus

#### Scenario: Clear button functionality
- **WHEN** search input has value
- **THEN** SHALL display clear button (X icon) on right side
- **AND** clear button SHALL be visible only when value is not empty
- **AND** clicking clear button SHALL clear input value
- **AND** clear button SHALL be provided by SearchInput functionality
- **AND** clear button SHALL have localized aria-label

#### Scenario: onClear callback
- **WHEN** onClear prop is provided and clear button is clicked
- **THEN** SHALL invoke onClear callback
- **AND** SHALL clear input value
- **AND** onClear SHALL fire in addition to onChange
- **AND** allows custom behavior on clear action

#### Scenario: onSubmit callback
- **WHEN** onSubmit prop is provided and user presses Enter
- **THEN** SHALL invoke onSubmit with current value
- **AND** SHALL support search submission behavior
- **AND** allows triggering search action on Enter key

#### Scenario: Size prop
- **WHEN** size prop is provided
- **THEN** SHALL pass to both FormField.Root and SearchInput
- **AND** SHALL accept "sm" | "md" values
- **AND** default size SHALL be "md"
- **AND** FormField typography and SearchInput styling SHALL match size

#### Scenario: Style props
- **WHEN** style props (width, maxWidth, margin, etc.) are provided
- **THEN** SHALL pass to SearchInput element
- **AND** style props SHALL affect input element, not FormField wrapper
- **AND** SHALL support responsive style prop syntax
- **AND** SHALL support Chakra style prop system

#### Scenario: Other SearchInput props
- **WHEN** additional SearchInput props are spread via rest
- **THEN** SHALL pass name, id, defaultValue, autoComplete, etc.
- **AND** SHALL support all valid SearchInput props
- **AND** SHALL maintain type safety via TypeScript

### Requirement: ID Prop for Custom Identification
The component SHALL support optional id prop for custom element identification per nimbus-core standards.

#### Scenario: Custom ID
- **WHEN** id prop is provided
- **THEN** SHALL pass to FormField.Root
- **AND** FormField SHALL apply id to input element
- **AND** label htmlFor SHALL reference input id
- **AND** custom id SHALL override auto-generated id

#### Scenario: Auto-generated ID
- **WHEN** id prop is not provided
- **THEN** FormField SHALL auto-generate unique id
- **AND** auto-generated id SHALL associate label and input
- **AND** SHALL maintain ARIA associations without manual id

### Requirement: Name Prop for Form Integration
The component SHALL support name prop for HTML form submission per nimbus-core standards.

#### Scenario: Name attribute
- **WHEN** name prop is provided
- **THEN** SHALL pass to SearchInput
- **AND** SearchInput SHALL set name attribute on input element
- **AND** input value SHALL be included in form submission with provided name
- **AND** SHALL support standard HTML form behavior

#### Scenario: Form submission
- **WHEN** SearchInputField is inside <form> element
- **THEN** input SHALL participate in form submission
- **AND** SHALL use name attribute as key in form data
- **AND** SHALL support native form validation if applicable

### Requirement: Search Field Type Attribute
The component SHALL render input with type="search" per nimbus-core standards.

#### Scenario: Input type
- **WHEN** SearchInput is rendered
- **THEN** SHALL use type="search" attribute
- **AND** SHALL trigger search-specific browser UI (mobile keyboards, etc.)
- **AND** SHALL provide semantic meaning for search functionality
- **AND** SHALL support Escape key to clear on some browsers

#### Scenario: AutoComplete attribute
- **WHEN** autoComplete prop is not explicitly set
- **THEN** SHALL default to autocomplete="off" for search fields
- **AND** prevents browser from showing autocomplete dropdown
- **AND** developer can override with explicit autoComplete prop
- **AND** search-specific autocomplete behavior is typically custom

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive type definitions per nimbus-core standards.

#### Scenario: Props type definition
- **WHEN** SearchInputFieldProps is defined
- **THEN** SHALL extend Omit<SearchInputProps, conflicting keys>
- **AND** SHALL pick specific FormFieldProps: isRequired, isInvalid, isDisabled, isReadOnly, id
- **AND** SHALL define own field-specific props: label, description, info, errors, touched, renderError
- **AND** SHALL export SearchInputFieldProps interface

#### Scenario: Label prop type
- **WHEN** label prop is typed
- **THEN** SHALL be ReactNode (required)
- **AND** SHALL support string or JSX elements
- **AND** TypeScript SHALL enforce label presence

#### Scenario: Optional props types
- **WHEN** optional props are defined
- **THEN** description, info SHALL be ReactNode | undefined
- **AND** touched, isRequired, isDisabled, isReadOnly, isInvalid SHALL be boolean with defaults
- **AND** errors SHALL be FieldErrorsData | undefined
- **AND** renderError SHALL be (errorKey: string) => ReactNode

#### Scenario: Size prop type
- **WHEN** size prop is typed
- **THEN** SHALL be "sm" | "md" with autocomplete
- **AND** default SHALL be "md"
- **AND** SHALL match FormField and SearchInput size values

### Requirement: Display Name
The component SHALL set displayName per nimbus-core standards.

#### Scenario: Display name assignment
- **WHEN** component is defined
- **THEN** SHALL set displayName = "SearchInputField"
- **AND** displayName SHALL aid debugging in React DevTools
- **AND** SHALL be set as static property on component function

### Requirement: Controlled Component Pattern
The component SHALL support controlled input pattern per nimbus-core standards.

#### Scenario: Controlled value
- **WHEN** value and onChange props are provided
- **THEN** component SHALL be fully controlled by parent
- **AND** value changes SHALL only occur via onChange callback
- **AND** onChange SHALL receive string parameter (not event)
- **AND** parent SHALL manage input state

#### Scenario: Uncontrolled with defaultValue
- **WHEN** defaultValue is provided without value
- **THEN** SearchInput SHALL be uncontrolled
- **AND** defaultValue SHALL set initial value
- **AND** SearchInput SHALL manage own state internally
- **AND** onChange SHALL still fire on changes

#### Scenario: Fully uncontrolled
- **WHEN** neither value nor defaultValue provided
- **THEN** SearchInput SHALL be uncontrolled with empty initial value
- **AND** SHALL allow user input without parent state management
- **AND** onChange SHALL fire but not required for functionality

### Requirement: Keyboard Navigation
The component SHALL support keyboard interactions per nimbus-core standards.

#### Scenario: Tab navigation
- **WHEN** user presses Tab key
- **THEN** SHALL focus input element in logical tab order
- **AND** SHALL support Tab to navigate to next element
- **AND** info button (if present) SHALL be in tab order after input
- **AND** clear button SHALL have tabindex="-1" (not in tab order)

#### Scenario: Label click focus
- **WHEN** user clicks label element
- **THEN** SHALL focus associated input
- **AND** SHALL work via FormField's label/input association
- **AND** SHALL move cursor to input for typing

#### Scenario: Search submission
- **WHEN** input is focused and user presses Enter
- **THEN** SHALL trigger onSubmit callback if provided
- **AND** SHALL submit containing form if no onSubmit callback
- **AND** SHALL maintain standard form submission behavior

#### Scenario: Clear with Escape
- **WHEN** input has value and user presses Escape
- **THEN** SearchInput SHALL clear the input value
- **AND** SHALL trigger onChange with empty string
- **AND** SHALL trigger onClear if provided
- **AND** browser-native search field behavior

### Requirement: Accessibility Compliance
The component SHALL meet WCAG 2.1 AA standards per nimbus-core standards.

#### Scenario: Label association
- **WHEN** component renders
- **THEN** label SHALL be associated with input via aria-labelledby
- **AND** clicking label SHALL focus input
- **AND** screen readers SHALL announce label when input is focused
- **AND** FormField SHALL handle association automatically

#### Scenario: Description association
- **WHEN** description is provided
- **THEN** description SHALL be associated with input via aria-describedby
- **AND** screen readers SHALL announce description when input is focused
- **AND** FormField SHALL handle association automatically

#### Scenario: Error message association
- **WHEN** errors are displayed
- **THEN** error messages SHALL be associated with input via aria-describedby
- **AND** screen readers SHALL announce errors when input is focused
- **AND** error SHALL have role="alert" for immediate announcement
- **AND** FormField and FieldErrors SHALL handle associations automatically

#### Scenario: Required field announcement
- **WHEN** isRequired={true}
- **THEN** input SHALL have aria-required="true"
- **AND** screen readers SHALL announce required state
- **AND** visual required indicator (*) SHALL be present in label

#### Scenario: Invalid state announcement
- **WHEN** field is invalid
- **THEN** input SHALL have aria-invalid="true"
- **AND** screen readers SHALL announce invalid state
- **AND** error messages SHALL be announced via aria-describedby

#### Scenario: Search field semantics
- **WHEN** component renders
- **THEN** input SHALL have role="searchbox" implicitly from type="search"
- **AND** screen readers SHALL identify input as search field
- **AND** SHALL communicate search-specific functionality to assistive technology

#### Scenario: Clear button accessibility
- **WHEN** clear button is visible
- **THEN** clear button SHALL have localized aria-label
- **AND** aria-label SHALL describe clear action (e.g., "Clear search input")
- **AND** button SHALL be keyboard accessible
- **AND** screen readers SHALL announce button purpose

#### Scenario: Focus indicators
- **WHEN** input receives focus
- **THEN** SHALL display visible focus ring meeting 3:1 contrast
- **AND** focus indicator SHALL be provided by SearchInput component
- **AND** SHALL be clearly distinguishable from unfocused state

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission participation
- **WHEN** SearchInputField is inside <form>
- **THEN** input SHALL be included in form submission
- **AND** SHALL use name attribute as form data key
- **AND** SHALL submit current value in form data

#### Scenario: Form validation support
- **WHEN** form validation is triggered
- **THEN** isRequired state SHALL prevent submission if empty
- **AND** isInvalid state SHALL visually indicate validation failure
- **AND** error messages SHALL guide user to fix validation issues

#### Scenario: Form reset
- **WHEN** form is reset
- **THEN** SearchInput SHALL clear to defaultValue or empty
- **AND** SHALL support HTML form reset behavior
- **AND** controlled components SHALL be managed by parent state

### Requirement: Responsive Design
The component SHALL support responsive design patterns per nimbus-core standards.

#### Scenario: Responsive size
- **WHEN** size prop uses responsive syntax
- **THEN** SHALL support: size={{ base: "sm", md: "md" }}
- **AND** FormField and SearchInput SHALL apply appropriate sizes at breakpoints
- **AND** typography and input styling SHALL adjust responsively

#### Scenario: Responsive style props
- **WHEN** style props use responsive syntax
- **THEN** SHALL support: width={{ base: "100%", md: "50%" }}
- **AND** SearchInput SHALL apply responsive styles at breakpoints
- **AND** SHALL use Chakra breakpoint system

### Requirement: Distinction from TextInputField
The component SHALL provide search-specific functionality distinct from TextInputField per nimbus-core standards.

#### Scenario: Search-specific features
- **WHEN** compared to TextInputField
- **THEN** SearchInputField SHALL include search icon (magnifying glass)
- **AND** SHALL include clear button functionality
- **AND** SHALL use type="search" instead of type="text"
- **AND** SHALL support onSubmit callback for search action
- **AND** SHALL default to autocomplete="off"

#### Scenario: Visual distinction
- **WHEN** SearchInputField renders
- **THEN** SHALL visually indicate search functionality via search icon
- **AND** SHALL provide clear affordance for search behavior
- **AND** SHALL be recognizable as search field to users

#### Scenario: When to use SearchInputField
- **WHEN** use case involves searching, filtering, or content discovery
- **THEN** SearchInputField SHALL be preferred over TextInputField
- **AND** SHALL provide appropriate UI affordances for search
- **AND** SHALL communicate search intent to users and browsers

### Requirement: Common Use Cases
The component SHALL support common search field scenarios per nimbus-core standards.

#### Scenario: Page search
- **WHEN** used for page-level search
- **THEN** SHALL provide search field with label, placeholder, and clear button
- **AND** SHALL support onSubmit for executing search
- **AND** SHALL integrate with page search functionality

#### Scenario: Filter search
- **WHEN** used for filtering lists or tables
- **THEN** SHALL support real-time filtering via onChange
- **AND** SHALL provide clear button to reset filter
- **AND** SHALL allow incremental search behavior

#### Scenario: Data table search
- **WHEN** used in data table toolbar
- **THEN** SHALL integrate with FormField for consistency
- **AND** SHALL support table filtering and search
- **AND** SHALL provide clear visual indication of search state

### Requirement: No Custom Styling
The component SHALL not define custom styles beyond composition per nimbus-core standards.

#### Scenario: Style inheritance
- **WHEN** SearchInputField renders
- **THEN** SHALL inherit all styling from FormField recipe
- **AND** SHALL inherit all styling from SearchInput recipe
- **AND** SHALL NOT define own recipe or custom styles

#### Scenario: Style props passthrough
- **WHEN** style props are provided
- **THEN** SHALL pass to SearchInput element
- **AND** SearchInput SHALL apply its styling system
- **AND** FormField SHALL apply its styling system
- **AND** no additional styling layer SHALL be introduced

### Requirement: JSDoc Documentation
The component SHALL provide comprehensive JSDoc per nimbus-core standards.

#### Scenario: Component documentation
- **WHEN** component is defined
- **THEN** SHALL include JSDoc block with description
- **AND** SHALL describe purpose: pre-composed search field combining SearchInput with FormField
- **AND** SHALL include @example tag with usage code
- **AND** SHALL explain simplified API benefit for search scenarios

#### Scenario: Props documentation
- **WHEN** SearchInputFieldProps is defined
- **THEN** all props SHALL have JSDoc comments
- **AND** SHALL explain label is required for accessibility
- **AND** SHALL document touched state behavior for error display
- **AND** SHALL explain errors format compatibility with UI-Kit
- **AND** SHALL document style props apply to input element
- **AND** SHALL explain search-specific features (icon, clear, onSubmit)
