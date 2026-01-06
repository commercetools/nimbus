# Specification: MultilineTextInputField Component

## Overview

The MultilineTextInputField component is a pre-composed field pattern that combines MultilineTextInput with FormField to provide a complete, accessible multiline text input form field with an intuitive flat API. It encapsulates label, hint text, error messaging, and validation feedback in a single component, reducing boilerplate code for common textarea scenarios.

**Component:** `MultilineTextInputField`
**Package:** `@commercetools/nimbus`
**Type:** Pattern component (pre-composed field wrapper)
**Pattern:** Combines FormField + MultilineTextInput composition
**Location:** `packages/nimbus/src/patterns/fields/multiline-text-input-field/`

## Purpose

Provide a simplified, high-level API for creating complete multiline text input form fields without manually composing FormField and MultilineTextInput components. Maintains backwards compatibility with UI-Kit's MultilineTextField by supporting the same error format and localized error messages while offering an ergonomic interface for the most common textarea field use cases.

## Requirements

### Requirement: Component Composition
The component SHALL compose FormField.Root, FormField.Label, FormField.Input, FormField.Description, FormField.Error, FormField.InfoBox, and MultilineTextInput.

#### Scenario: Component structure
- **WHEN** MultilineTextInputField renders
- **THEN** SHALL render FormField.Root as outer wrapper
- **AND** SHALL render FormField.Label containing label prop
- **AND** SHALL render FormField.Input wrapping MultilineTextInput component
- **AND** SHALL pass all MultilineTextInput-specific props to MultilineTextInput element
- **AND** SHALL pass all FormField-specific props to FormField.Root

#### Scenario: Internal composition
- **WHEN** component renders
- **THEN** MultilineTextInput SHALL be wrapped in FormField.Input
- **AND** FormField SHALL handle ARIA associations automatically
- **AND** FormField SHALL coordinate label, input, description, and error rendering
- **AND** MultilineTextInput SHALL receive field state from FormField via props cloning

#### Scenario: Single-component interface
- **WHEN** developer uses MultilineTextInputField
- **THEN** SHALL accept flat props API (no nested components required)
- **AND** SHALL eliminate need for manual FormField composition
- **AND** SHALL provide same functionality as FormField + MultilineTextInput combination
- **AND** SHALL be drop-in replacement for common textarea field patterns

### Requirement: Label Prop and Rendering
The component SHALL require a label prop and render it via FormField.Label per nimbus-core standards.

#### Scenario: Label prop requirement
- **WHEN** MultilineTextInputField is instantiated
- **THEN** label prop SHALL be required (TypeScript enforces)
- **AND** label SHALL accept ReactNode (string or JSX)
- **AND** component SHALL NOT render without label (accessibility requirement)

#### Scenario: Label rendering
- **WHEN** label prop is provided
- **THEN** SHALL render via FormField.Label component
- **AND** SHALL automatically associate with textarea via aria-labelledby
- **AND** label SHALL be clickable to focus textarea
- **AND** label element SHALL use semantic label tag

#### Scenario: Required indicator
- **WHEN** isRequired={true} is set
- **THEN** label SHALL display asterisk (*) indicator
- **AND** asterisk SHALL be styled per FormField recipe
- **AND** textarea SHALL have aria-required="true"
- **AND** FormField SHALL handle required indicator rendering

### Requirement: Description Prop Support
The component SHALL support optional description prop for helper text per nimbus-core standards.

#### Scenario: Description rendering
- **WHEN** description prop is provided
- **THEN** SHALL render via FormField.Description component
- **AND** SHALL display below textarea element
- **AND** SHALL associate with textarea via aria-describedby
- **AND** SHALL accept ReactNode (string or JSX)

#### Scenario: Description omission
- **WHEN** description prop is not provided
- **THEN** SHALL NOT render FormField.Description element
- **AND** SHALL not add description to aria-describedby
- **AND** component SHALL render without description text

#### Scenario: Description with errors
- **WHEN** both description and errors are present
- **THEN** SHALL render both description and error messages
- **AND** textarea aria-describedby SHALL reference both elements
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
- **THEN** info content SHALL be associated with textarea via aria-describedby
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
- **AND** errors SHALL be associated with textarea via aria-describedby

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
- **AND** MultilineTextInput SHALL receive isRequired via props cloning
- **AND** textarea SHALL have aria-required="true"

#### Scenario: Disabled state
- **WHEN** isDisabled prop is set
- **THEN** SHALL pass isDisabled to FormField.Root
- **AND** MultilineTextInput SHALL receive isDisabled and be non-interactive
- **AND** textarea SHALL have disabled attribute
- **AND** FormField SHALL apply disabled styling

#### Scenario: Read-only state
- **WHEN** isReadOnly prop is set
- **THEN** SHALL pass isReadOnly to FormField.Root
- **AND** MultilineTextInput SHALL receive isReadOnly
- **AND** textarea SHALL be focusable but non-editable
- **AND** textarea SHALL have readonly attribute

### Requirement: MultilineTextInput Props Passthrough
The component SHALL accept and forward all MultilineTextInput props per nimbus-core standards.

#### Scenario: Value and onChange
- **WHEN** value and onChange props are provided
- **THEN** SHALL pass to MultilineTextInput for controlled component pattern
- **AND** onChange SHALL receive string value (not event)
- **AND** MultilineTextInput SHALL update value on user input
- **AND** controlled pattern SHALL work as expected

#### Scenario: Placeholder
- **WHEN** placeholder prop is provided
- **THEN** SHALL pass to MultilineTextInput
- **AND** MultilineTextInput SHALL display placeholder in empty textarea
- **AND** placeholder SHALL NOT replace label for accessibility

#### Scenario: Rows prop
- **WHEN** rows prop is provided
- **THEN** SHALL pass to MultilineTextInput
- **AND** MultilineTextInput SHALL set initial visible rows
- **AND** default rows SHALL be 1
- **AND** SHALL determine initial textarea height

#### Scenario: Auto-grow functionality
- **WHEN** autoGrow prop is provided
- **THEN** SHALL pass to MultilineTextInput
- **AND** MultilineTextInput SHALL automatically adjust height based on content
- **AND** textarea SHALL expand as user types multiline content
- **AND** textarea SHALL shrink when content is deleted

#### Scenario: Leading element
- **WHEN** leadingElement prop is provided
- **THEN** SHALL pass to MultilineTextInput
- **AND** MultilineTextInput SHALL render decorative element at start
- **AND** element SHALL support icons, text, or custom components

#### Scenario: Size prop
- **WHEN** size prop is provided
- **THEN** SHALL pass to both FormField.Root and MultilineTextInput
- **AND** SHALL accept "sm" | "md" values
- **AND** default size SHALL be "md"
- **AND** FormField typography and MultilineTextInput styling SHALL match size

#### Scenario: Style props
- **WHEN** style props (width, maxWidth, margin, etc.) are provided
- **THEN** SHALL pass to MultilineTextInput element via rest spread
- **AND** style props SHALL affect textarea element, not FormField wrapper
- **AND** SHALL support responsive style prop syntax
- **AND** SHALL support Chakra style prop system

#### Scenario: Other MultilineTextInput props
- **WHEN** additional MultilineTextInput props are spread via rest
- **THEN** SHALL pass name, defaultValue, maxLength, minLength, etc.
- **AND** SHALL support all valid MultilineTextInput props
- **AND** SHALL maintain type safety via TypeScript

### Requirement: ID Prop for Custom Identification
The component SHALL support optional id prop for custom element identification per nimbus-core standards.

#### Scenario: Custom ID
- **WHEN** id prop is provided
- **THEN** SHALL pass to FormField.Root
- **AND** FormField SHALL apply id to textarea element
- **AND** label htmlFor SHALL reference textarea id
- **AND** custom id SHALL override auto-generated id

#### Scenario: Auto-generated ID
- **WHEN** id prop is not provided
- **THEN** FormField SHALL auto-generate unique id
- **AND** auto-generated id SHALL associate label and textarea
- **AND** SHALL maintain ARIA associations without manual id

### Requirement: Name Prop for Form Integration
The component SHALL support name prop for HTML form submission per nimbus-core standards.

#### Scenario: Name attribute
- **WHEN** name prop is provided
- **THEN** SHALL pass to MultilineTextInput
- **AND** MultilineTextInput SHALL set name attribute on textarea element
- **AND** textarea value SHALL be included in form submission with provided name
- **AND** SHALL support standard HTML form behavior

#### Scenario: Form submission
- **WHEN** MultilineTextInputField is inside form element
- **THEN** textarea SHALL participate in form submission
- **AND** SHALL use name attribute as key in form data
- **AND** Enter key SHALL insert newline (NOT submit form)
- **AND** SHALL support native form validation if applicable

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive type definitions per nimbus-core standards.

#### Scenario: Props type definition
- **WHEN** MultilineTextInputFieldProps is defined
- **THEN** SHALL extend Omit<MultilineTextInputProps, "type">
- **AND** SHALL pick specific FormFieldProps: isRequired, isInvalid, isDisabled, isReadOnly, id
- **AND** SHALL define additional field-specific props
- **AND** SHALL export MultilineTextInputFieldProps interface

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
- **AND** SHALL match FormField and MultilineTextInput size values

### Requirement: Display Name
The component SHALL set displayName per nimbus-core standards.

#### Scenario: Display name assignment
- **WHEN** component is defined
- **THEN** SHALL set displayName = "MultilineTextInputField"
- **AND** displayName SHALL aid debugging in React DevTools
- **AND** SHALL be set as static property on component function

### Requirement: Controlled Component Pattern
The component SHALL support controlled component pattern per nimbus-core standards.

#### Scenario: Controlled value
- **WHEN** value and onChange props are provided
- **THEN** component SHALL be fully controlled by parent
- **AND** value changes SHALL only occur via onChange callback
- **AND** onChange SHALL receive string parameter (not event)
- **AND** parent SHALL manage textarea state

#### Scenario: Uncontrolled with defaultValue
- **WHEN** defaultValue is provided without value
- **THEN** MultilineTextInput SHALL be uncontrolled
- **AND** defaultValue SHALL set initial value
- **AND** MultilineTextInput SHALL manage own state internally
- **AND** onChange SHALL still fire on changes

#### Scenario: Fully uncontrolled
- **WHEN** neither value nor defaultValue provided
- **THEN** MultilineTextInput SHALL be uncontrolled with empty initial value
- **AND** SHALL allow user input without parent state management
- **AND** onChange SHALL fire but not required for functionality

### Requirement: Keyboard Navigation
The component SHALL support keyboard interactions per nimbus-core standards.

#### Scenario: Tab navigation
- **WHEN** user presses Tab key
- **THEN** SHALL focus textarea element in logical tab order
- **AND** SHALL support Tab to navigate to next element
- **AND** info button (if present) SHALL be in tab order after textarea

#### Scenario: Label click focus
- **WHEN** user clicks label element
- **THEN** SHALL focus associated textarea
- **AND** SHALL work via FormField's label/textarea association
- **AND** SHALL move cursor to textarea for typing

#### Scenario: Multiline text entry
- **WHEN** textarea is focused
- **THEN** Enter key SHALL insert newline (not submit form)
- **AND** Shift+Enter SHALL also insert newline
- **AND** SHALL support arrow keys for cursor movement
- **AND** SHALL support Home/End keys for cursor position
- **AND** SHALL support text selection with Shift+Arrow keys
- **AND** SHALL support standard text editing keyboard shortcuts

### Requirement: Accessibility Compliance
The component SHALL meet WCAG 2.1 AA standards per nimbus-core standards.

#### Scenario: Label association
- **WHEN** component renders
- **THEN** label SHALL be associated with textarea via aria-labelledby
- **AND** clicking label SHALL focus textarea
- **AND** screen readers SHALL announce label when textarea is focused
- **AND** FormField SHALL handle association automatically

#### Scenario: Description association
- **WHEN** description is provided
- **THEN** description SHALL be associated with textarea via aria-describedby
- **AND** screen readers SHALL announce description when textarea is focused
- **AND** FormField SHALL handle association automatically

#### Scenario: Error message association
- **WHEN** errors are displayed
- **THEN** error messages SHALL be associated with textarea via aria-describedby
- **AND** screen readers SHALL announce errors when textarea is focused
- **AND** error SHALL have role="alert" for immediate announcement
- **AND** FormField and FieldErrors SHALL handle associations automatically

#### Scenario: Required field announcement
- **WHEN** isRequired={true}
- **THEN** textarea SHALL have aria-required="true"
- **AND** screen readers SHALL announce required state
- **AND** visual required indicator (*) SHALL be present in label

#### Scenario: Invalid state announcement
- **WHEN** field is invalid
- **THEN** textarea SHALL have aria-invalid="true"
- **AND** screen readers SHALL announce invalid state
- **AND** error messages SHALL be announced via aria-describedby

#### Scenario: Focus indicators
- **WHEN** textarea receives focus
- **THEN** SHALL display visible focus ring meeting 3:1 contrast
- **AND** focus indicator SHALL be provided by MultilineTextInput component
- **AND** SHALL be clearly distinguishable from unfocused state

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission participation
- **WHEN** MultilineTextInputField is inside form
- **THEN** textarea SHALL be included in form submission
- **AND** SHALL use name attribute as form data key
- **AND** SHALL submit current value in form data
- **AND** Enter key SHALL NOT submit form (inserts newline instead)

#### Scenario: Form validation support
- **WHEN** form validation is triggered
- **THEN** isRequired state SHALL prevent submission if empty
- **AND** isInvalid state SHALL visually indicate validation failure
- **AND** error messages SHALL guide user to fix validation issues

#### Scenario: Form reset
- **WHEN** form is reset
- **THEN** MultilineTextInput SHALL clear to defaultValue or empty
- **AND** SHALL support HTML form reset behavior
- **AND** controlled components SHALL be managed by parent state

### Requirement: Responsive Design
The component SHALL support responsive design patterns per nimbus-core standards.

#### Scenario: Responsive size
- **WHEN** size prop uses responsive syntax
- **THEN** SHALL support: size={{ base: "sm", md: "md" }}
- **AND** FormField and MultilineTextInput SHALL apply appropriate sizes at breakpoints
- **AND** typography and textarea styling SHALL adjust responsively

#### Scenario: Responsive style props
- **WHEN** style props use responsive syntax
- **THEN** SHALL support: width={{ base: "100%", md: "50%" }}
- **AND** MultilineTextInput SHALL apply responsive styles at breakpoints
- **AND** SHALL use Chakra breakpoint system

### Requirement: UI-Kit Compatibility
The component SHALL maintain backwards compatibility with UI-Kit MultilineTextField per nimbus-core standards.

#### Scenario: Error format compatibility
- **WHEN** errors prop is provided
- **THEN** SHALL accept same error format as UI-Kit MultilineTextField
- **AND** errors SHALL be Record<string, boolean> mapping error types to presence
- **AND** FieldErrors SHALL render localized messages for error types

#### Scenario: Localized error messages
- **WHEN** errors are displayed
- **THEN** FieldErrors SHALL use react-intl for localized messages
- **AND** SHALL support standard error types: missing, invalid, format, etc.
- **AND** SHALL match UI-Kit error message text for compatibility

#### Scenario: API parity
- **WHEN** migrating from UI-Kit MultilineTextField
- **THEN** MultilineTextInputField SHALL support equivalent props
- **AND** SHALL provide similar functionality and behavior
- **AND** SHALL reduce migration friction for existing codebases

### Requirement: Distinction from Manual Composition
The component SHALL provide simpler API than manual FormField + MultilineTextInput composition per nimbus-core standards.

#### Scenario: Simplified API
- **WHEN** developer uses MultilineTextInputField
- **THEN** SHALL accept flat props instead of nested component structure
- **AND** SHALL reduce boilerplate code for common use cases
- **AND** SHALL eliminate need to understand FormField composition

#### Scenario: When to use MultilineTextInputField
- **WHEN** use case is standard textarea with label/description/errors
- **THEN** MultilineTextInputField SHALL be preferred over manual composition
- **AND** SHALL provide ergonomic API for common patterns
- **AND** SHALL reduce code verbosity

#### Scenario: When to use manual composition
- **WHEN** use case requires custom layout or advanced FormField features
- **THEN** developers SHALL use FormField + MultilineTextInput directly
- **AND** manual composition SHALL provide full flexibility
- **AND** MultilineTextInputField SHALL not constrain advanced use cases

### Requirement: No Custom Styling
The component SHALL not define custom styles beyond composition per nimbus-core standards.

#### Scenario: Style inheritance
- **WHEN** MultilineTextInputField renders
- **THEN** SHALL inherit all styling from FormField recipe
- **AND** SHALL inherit all styling from MultilineTextInput recipe
- **AND** SHALL NOT define own recipe or custom styles

#### Scenario: Style props passthrough
- **WHEN** style props are provided
- **THEN** SHALL pass to MultilineTextInput element
- **AND** MultilineTextInput SHALL apply its styling system
- **AND** FormField SHALL apply its styling system
- **AND** no additional styling layer SHALL be introduced

### Requirement: JSDoc Documentation
The component SHALL provide comprehensive JSDoc per nimbus-core standards.

#### Scenario: Component documentation
- **WHEN** component is defined
- **THEN** SHALL include JSDoc block with description
- **AND** SHALL describe purpose: pre-composed field combining MultilineTextInput with FormField
- **AND** SHALL include @example tag with usage code
- **AND** SHALL explain simplified API benefit

#### Scenario: Props documentation
- **WHEN** MultilineTextInputFieldProps is defined
- **THEN** all props SHALL have JSDoc comments
- **AND** SHALL explain label is required for accessibility
- **AND** SHALL document touched state behavior for error display
- **AND** SHALL explain errors format compatibility with UI-Kit
- **AND** SHALL document style props apply to textarea element

### Requirement: Common Use Cases
The component SHALL be optimized for multiline text entry use cases per nimbus-core standards.

#### Scenario: Long-form text entry
- **WHEN** user needs to enter paragraphs or descriptions
- **THEN** MultilineTextInputField SHALL provide comfortable editing experience
- **AND** SHALL support configurable visible rows for initial height
- **AND** SHALL support auto-grow for content-based height
- **AND** SHALL provide adequate space for reading and editing

#### Scenario: Comments and feedback
- **WHEN** user submits comments, reviews, or feedback
- **THEN** MultilineTextInputField SHALL accommodate varying content lengths
- **AND** SHALL provide clear validation feedback
- **AND** SHALL support character counting via maxLength
- **AND** SHALL handle error states appropriately

#### Scenario: Form descriptions
- **WHEN** user fills out form requiring detailed descriptions
- **THEN** MultilineTextInputField SHALL integrate seamlessly with other form fields
- **AND** SHALL support required field indication
- **AND** SHALL provide helpful hint text via description prop
- **AND** SHALL display validation errors clearly
