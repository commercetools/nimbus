# Specification: NumberInputField Component

## Overview

The NumberInputField component is a pre-composed field pattern that combines NumberInput with FormField to provide a complete, accessible numeric input form field with an intuitive flat API. It encapsulates label, hint text, error messaging, validation feedback, stepper buttons, and number-specific features (min/max constraints, step increments, locale-aware formatting) in a single component, reducing boilerplate code for numeric entry scenarios.

**Component:** `NumberInputField`
**Package:** `@commercetools/nimbus`
**Type:** Pattern component (pre-composed field wrapper)
**Pattern:** Combines FormField + NumberInput composition
**Location:** `packages/nimbus/src/patterns/fields/number-input-field/`

## Purpose

Provide a simplified, high-level API for creating complete numeric input form fields without manually composing FormField and NumberInput components. Maintains backwards compatibility with UI-Kit's NumberField by supporting the same error format and localized error messages while offering an ergonomic interface for quantity, age, price, percentage, and other numeric entry use cases.

## Requirements

### Requirement: Component Composition
The component SHALL compose FormField.Root, FormField.Label, FormField.Input, FormField.Description, FormField.Error, FormField.InfoBox, and NumberInput.

#### Scenario: Component structure
- **WHEN** NumberInputField renders
- **THEN** SHALL render FormField.Root as outer wrapper
- **AND** SHALL render FormField.Label containing label prop
- **AND** SHALL render FormField.Input wrapping NumberInput component
- **AND** SHALL pass all NumberInput-specific props to NumberInput element
- **AND** SHALL pass all FormField-specific props to FormField.Root

#### Scenario: Internal composition
- **WHEN** component renders
- **THEN** NumberInput SHALL be wrapped in FormField.Input
- **AND** FormField SHALL handle ARIA associations automatically
- **AND** FormField SHALL coordinate label, input, description, and error rendering
- **AND** NumberInput SHALL receive field state from FormField via props cloning

#### Scenario: Single-component interface
- **WHEN** developer uses NumberInputField
- **THEN** SHALL accept flat props API (no nested components required)
- **AND** SHALL eliminate need for manual FormField composition
- **AND** SHALL provide same functionality as FormField + NumberInput combination
- **AND** SHALL be drop-in replacement for common numeric input field patterns

### Requirement: Label Prop and Rendering
The component SHALL require a label prop and render it via FormField.Label per nimbus-core standards.

#### Scenario: Label prop requirement
- **WHEN** NumberInputField is instantiated
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
- **AND** NumberInput SHALL receive isRequired via props cloning
- **AND** input SHALL have aria-required="true"

#### Scenario: Disabled state
- **WHEN** isDisabled prop is set
- **THEN** SHALL pass isDisabled to FormField.Root
- **AND** NumberInput SHALL receive isDisabled and be non-interactive
- **AND** input SHALL have disabled attribute
- **AND** stepper buttons SHALL be disabled
- **AND** FormField SHALL apply disabled styling

#### Scenario: Read-only state
- **WHEN** isReadOnly prop is set
- **THEN** SHALL pass isReadOnly to FormField.Root
- **AND** NumberInput SHALL receive isReadOnly
- **AND** input SHALL be focusable but non-editable
- **AND** input SHALL have readonly attribute
- **AND** stepper buttons SHALL be disabled in read-only mode

### Requirement: NumberInput Props Passthrough
The component SHALL accept and forward all NumberInput props per nimbus-core standards.

#### Scenario: Value and onChange
- **WHEN** value and onChange props are provided
- **THEN** SHALL pass to NumberInput for controlled component pattern
- **AND** onChange SHALL receive number value (not event)
- **AND** NumberInput SHALL update value on user input
- **AND** controlled pattern SHALL work as expected

#### Scenario: Number constraints
- **WHEN** min and max props are provided
- **THEN** SHALL pass to NumberInput
- **AND** NumberInput SHALL enforce minimum value constraint
- **AND** NumberInput SHALL enforce maximum value constraint
- **AND** SHALL disable decrement button at minimum
- **AND** SHALL disable increment button at maximum

#### Scenario: Step increment
- **WHEN** step prop is provided
- **THEN** SHALL pass to NumberInput
- **AND** NumberInput SHALL increment/decrement by step amount
- **AND** default step SHALL be 1
- **AND** SHALL support decimal steps (e.g., 0.1, 0.01)
- **AND** stepper buttons SHALL adjust value by step amount

#### Scenario: Format options
- **WHEN** formatOptions prop is provided
- **THEN** SHALL pass to NumberInput
- **AND** NumberInput SHALL format display value per options
- **AND** SHALL support style: "decimal" | "percent" | "currency"
- **AND** SHALL support minimumFractionDigits and maximumFractionDigits
- **AND** SHALL support currency code when style="currency"
- **AND** SHALL use Intl.NumberFormat for locale-aware formatting

#### Scenario: Placeholder
- **WHEN** placeholder prop is provided
- **THEN** SHALL pass to NumberInput
- **AND** NumberInput SHALL display placeholder in empty input
- **AND** placeholder SHALL NOT replace label for accessibility

#### Scenario: Leading and trailing elements
- **WHEN** leadingElement or trailingElement props are provided
- **THEN** SHALL pass to NumberInput
- **AND** NumberInput SHALL render decorative elements inside input container
- **AND** elements SHALL support icons, text, or custom components
- **AND** trailingElement SHALL render alongside stepper buttons

#### Scenario: Size prop
- **WHEN** size prop is provided
- **THEN** SHALL pass to both FormField.Root and NumberInput
- **AND** SHALL accept "sm" | "md" values
- **AND** default size SHALL be "md"
- **AND** FormField typography and NumberInput styling SHALL match size

#### Scenario: Style props
- **WHEN** style props (width, maxWidth, margin, etc.) are provided
- **THEN** SHALL pass to NumberInput element
- **AND** style props SHALL affect input element, not FormField wrapper
- **AND** SHALL support responsive style prop syntax
- **AND** SHALL support Chakra style prop system

#### Scenario: Other NumberInput props
- **WHEN** additional NumberInput props are spread via rest
- **THEN** SHALL pass name, id, defaultValue, autoComplete, isWheelDisabled, etc.
- **AND** SHALL support all valid NumberInput props
- **AND** SHALL maintain type safety via TypeScript

### Requirement: Stepper Button Functionality
The component SHALL provide increment and decrement controls via NumberInput per nimbus-core standards.

#### Scenario: Stepper button rendering
- **WHEN** NumberInputField renders
- **THEN** NumberInput SHALL render stepper buttons by default
- **AND** increment button SHALL display up arrow icon
- **AND** decrement button SHALL display down arrow icon
- **AND** buttons SHALL be positioned at right edge of input (left in RTL)

#### Scenario: Increment interaction
- **WHEN** user clicks increment button
- **THEN** NumberInput SHALL increase value by step amount
- **AND** SHALL respect max constraint
- **AND** SHALL trigger onChange with new value
- **AND** SHALL disable button when value equals max

#### Scenario: Decrement interaction
- **WHEN** user clicks decrement button
- **THEN** NumberInput SHALL decrease value by step amount
- **AND** SHALL respect min constraint
- **AND** SHALL trigger onChange with new value
- **AND** SHALL disable button when value equals min

### Requirement: Keyboard Navigation for Numeric Entry
The component SHALL support keyboard interactions for number adjustment per nimbus-core standards.

#### Scenario: Arrow key stepping
- **WHEN** input is focused and user presses ArrowUp
- **THEN** NumberInput SHALL increment value by step amount
- **WHEN** user presses ArrowDown
- **THEN** NumberInput SHALL decrement value by step amount
- **AND** SHALL respect min/max bounds

#### Scenario: Page key stepping
- **WHEN** input is focused and user presses PageUp
- **THEN** NumberInput SHALL increment by step * 10
- **WHEN** user presses PageDown
- **THEN** NumberInput SHALL decrement by step * 10
- **AND** SHALL respect min/max bounds

#### Scenario: Home and End keys
- **WHEN** user presses Home key
- **THEN** NumberInput SHALL set value to minimum (if min defined)
- **WHEN** user presses End key
- **THEN** NumberInput SHALL set value to maximum (if max defined)

### Requirement: Number Formatting and Localization
The component SHALL support locale-aware number formatting via NumberInput per nimbus-core standards.

#### Scenario: Locale formatting
- **WHEN** NumberInputField renders
- **THEN** NumberInput SHALL use locale from React Aria I18nProvider context
- **AND** SHALL format numbers according to locale conventions
- **AND** SHALL use appropriate thousands separator for locale
- **AND** SHALL use appropriate decimal separator for locale
- **AND** SHALL support RTL locales

#### Scenario: Decimal precision
- **WHEN** formatOptions with fraction digits is provided
- **THEN** NumberInput SHALL display specified decimal places
- **AND** minimumFractionDigits SHALL ensure minimum decimals shown
- **AND** maximumFractionDigits SHALL limit maximum decimals shown

#### Scenario: Percentage formatting
- **WHEN** formatOptions.style="percent" is set
- **THEN** NumberInput SHALL format value as percentage
- **AND** SHALL display percent symbol per locale
- **AND** SHALL handle decimal-to-percent conversion (0.5 -> 50%)

#### Scenario: Currency formatting
- **WHEN** formatOptions.style="currency" with currency code is set
- **THEN** NumberInput SHALL format value as currency
- **AND** SHALL display currency symbol per locale
- **AND** SHALL position symbol correctly for locale
- **AND** SHALL use appropriate decimal places for currency

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
- **THEN** SHALL pass to NumberInput
- **AND** NumberInput SHALL set name attribute on input element
- **AND** input value SHALL be included in form submission with provided name
- **AND** SHALL support standard HTML form behavior

#### Scenario: Form submission
- **WHEN** NumberInputField is inside <form> element
- **THEN** input SHALL participate in form submission
- **AND** SHALL use name attribute as key in form data
- **AND** SHALL submit numeric value as string in form data

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive type definitions per nimbus-core standards.

#### Scenario: Props type definition
- **WHEN** NumberInputFieldProps is defined
- **THEN** SHALL extend NumberInputProps
- **AND** SHALL pick specific FormFieldProps: isRequired, isInvalid, isDisabled, isReadOnly, id
- **AND** SHALL add field-specific props: label, description, info, errors, touched, renderError
- **AND** SHALL export NumberInputFieldProps interface

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

#### Scenario: Numeric props types
- **WHEN** numeric props are typed
- **THEN** value SHALL be number | undefined
- **AND** defaultValue SHALL be number | undefined
- **AND** onChange SHALL be (value: number | undefined) => void
- **AND** min, max, step SHALL be number | undefined
- **AND** formatOptions SHALL be Intl.NumberFormatOptions | undefined

#### Scenario: Size prop type
- **WHEN** size prop is typed
- **THEN** SHALL be "sm" | "md" with autocomplete
- **AND** default SHALL be "md"
- **AND** SHALL match FormField and NumberInput size values

### Requirement: Display Name
The component SHALL set displayName per nimbus-core standards.

#### Scenario: Display name assignment
- **WHEN** component is defined
- **THEN** SHALL set displayName = "NumberInputField"
- **AND** displayName SHALL aid debugging in React DevTools
- **AND** SHALL be set as static property on component function

### Requirement: Controlled Component Pattern
The component SHALL support controlled input pattern per nimbus-core standards.

#### Scenario: Controlled value
- **WHEN** value and onChange props are provided
- **THEN** component SHALL be fully controlled by parent
- **AND** value changes SHALL only occur via onChange callback
- **AND** onChange SHALL receive number | undefined parameter (not event)
- **AND** parent SHALL manage input state

#### Scenario: Uncontrolled with defaultValue
- **WHEN** defaultValue is provided without value
- **THEN** NumberInput SHALL be uncontrolled
- **AND** defaultValue SHALL set initial numeric value
- **AND** NumberInput SHALL manage own state internally
- **AND** onChange SHALL still fire on changes

#### Scenario: Fully uncontrolled
- **WHEN** neither value nor defaultValue provided
- **THEN** NumberInput SHALL be uncontrolled with empty initial value
- **AND** SHALL allow user input without parent state management
- **AND** onChange SHALL fire but not required for functionality

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

#### Scenario: Spinbutton role and value attributes
- **WHEN** NumberInput renders
- **THEN** input SHALL have role="spinbutton" (via React Aria)
- **AND** SHALL have aria-valuemin when min is defined
- **AND** SHALL have aria-valuemax when max is defined
- **AND** SHALL have aria-valuenow with current numeric value
- **AND** SHALL have aria-valuetext with formatted display value

#### Scenario: Stepper button accessibility
- **WHEN** stepper buttons render
- **THEN** increment button SHALL have aria-label from i18n ("Increment")
- **AND** decrement button SHALL have aria-label from i18n ("Decrement")
- **AND** buttons SHALL be keyboard accessible (Enter/Space)
- **AND** disabled buttons SHALL have aria-disabled="true"

#### Scenario: Focus indicators
- **WHEN** input receives focus
- **THEN** SHALL display visible focus ring meeting 3:1 contrast
- **AND** focus indicator SHALL be provided by NumberInput component
- **AND** SHALL be clearly distinguishable from unfocused state

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission participation
- **WHEN** NumberInputField is inside <form>
- **THEN** input SHALL be included in form submission
- **AND** SHALL use name attribute as form data key
- **AND** SHALL submit current numeric value as string

#### Scenario: Form validation support
- **WHEN** form validation is triggered
- **THEN** isRequired state SHALL prevent submission if empty
- **AND** isInvalid state SHALL visually indicate validation failure
- **AND** error messages SHALL guide user to fix validation issues
- **AND** min/max constraints SHALL be enforced

#### Scenario: Form reset
- **WHEN** form is reset
- **THEN** NumberInput SHALL clear to defaultValue or empty
- **AND** SHALL support HTML form reset behavior
- **AND** controlled components SHALL be managed by parent state

### Requirement: Responsive Design
The component SHALL support responsive design patterns per nimbus-core standards.

#### Scenario: Responsive size
- **WHEN** size prop uses responsive syntax
- **THEN** SHALL support: size={{ base: "sm", md: "md" }}
- **AND** FormField and NumberInput SHALL apply appropriate sizes at breakpoints
- **AND** typography and input styling SHALL adjust responsively

#### Scenario: Responsive style props
- **WHEN** style props use responsive syntax
- **THEN** SHALL support: width={{ base: "100%", md: "50%" }}
- **AND** NumberInput SHALL apply responsive styles at breakpoints
- **AND** SHALL use Chakra breakpoint system

### Requirement: UI-Kit Compatibility
The component SHALL maintain backwards compatibility with UI-Kit NumberField per nimbus-core standards.

#### Scenario: Error format compatibility
- **WHEN** errors prop is provided
- **THEN** SHALL accept same error format as UI-Kit NumberField
- **AND** errors SHALL be Record<string, boolean> mapping error types to presence
- **AND** FieldErrors SHALL render localized messages for error types

#### Scenario: Localized error messages
- **WHEN** errors are displayed
- **THEN** FieldErrors SHALL use plain TypeScript objects for localized messages
- **AND** SHALL support standard error types: missing, invalid, format, etc.
- **AND** SHALL match UI-Kit error message text for compatibility

#### Scenario: API parity
- **WHEN** migrating from UI-Kit NumberField
- **THEN** NumberInputField SHALL support equivalent props
- **AND** SHALL provide similar functionality and behavior
- **AND** SHALL reduce migration friction for existing codebases

### Requirement: Distinction from Manual Composition
The component SHALL provide simpler API than manual FormField + NumberInput composition per nimbus-core standards.

#### Scenario: Simplified API
- **WHEN** developer uses NumberInputField
- **THEN** SHALL accept flat props instead of nested component structure
- **AND** SHALL reduce boilerplate code for common use cases
- **AND** SHALL eliminate need to understand FormField composition

#### Scenario: When to use NumberInputField
- **WHEN** use case is standard numeric input with label/description/errors
- **THEN** NumberInputField SHALL be preferred over manual composition
- **AND** SHALL provide ergonomic API for quantity, age, price, percentage fields
- **AND** SHALL reduce code verbosity

#### Scenario: When to use manual composition
- **WHEN** use case requires custom layout or advanced FormField features
- **THEN** developers SHALL use FormField + NumberInput directly
- **AND** manual composition SHALL provide full flexibility
- **AND** NumberInputField SHALL not constrain advanced use cases

### Requirement: Distinction from TextInputField with type="number"
The component SHALL be the preferred solution for numeric entry over TextInputField per nimbus-core standards.

#### Scenario: Built-in stepper controls
- **WHEN** developer needs numeric input with steppers
- **THEN** SHALL use NumberInputField (includes steppers automatically)
- **AND** SHALL NOT use TextInputField with type="number" (browser steppers inconsistent)
- **AND** NumberInputField SHALL provide better UX for numeric entry

#### Scenario: Number-specific features
- **WHEN** developer needs numeric formatting or constraints
- **THEN** NumberInputField SHALL provide locale-aware formatting
- **AND** SHALL provide min/max/step constraints
- **AND** SHALL provide formatOptions for percent/currency
- **AND** SHALL be semantically correct for numeric use cases
- **AND** TextInputField SHALL be reserved for text inputs

#### Scenario: Keyboard navigation
- **WHEN** handling numeric values
- **THEN** NumberInputField SHALL support arrow keys for stepping
- **AND** SHALL support PageUp/PageDown for large steps
- **AND** SHALL support Home/End for min/max values
- **AND** SHALL provide better accessibility for numeric entry

### Requirement: No Custom Styling
The component SHALL not define custom styles beyond composition per nimbus-core standards.

#### Scenario: Style inheritance
- **WHEN** NumberInputField renders
- **THEN** SHALL inherit all styling from FormField recipe
- **AND** SHALL inherit all styling from NumberInput recipe
- **AND** SHALL NOT define own recipe or custom styles

#### Scenario: Style props passthrough
- **WHEN** style props are provided
- **THEN** SHALL pass to NumberInput element
- **AND** NumberInput SHALL apply its styling system
- **AND** FormField SHALL apply its styling system
- **AND** no additional styling layer SHALL be introduced

### Requirement: JSDoc Documentation
The component SHALL provide comprehensive JSDoc per nimbus-core standards.

#### Scenario: Component documentation
- **WHEN** component is defined
- **THEN** SHALL include JSDoc block with description
- **AND** SHALL describe purpose: pre-composed field combining NumberInput with FormField
- **AND** SHALL include @example tag with usage code
- **AND** SHALL explain simplified API benefit

#### Scenario: Props documentation
- **WHEN** NumberInputFieldProps is defined
- **THEN** all props SHALL have JSDoc comments
- **AND** SHALL explain label is required for accessibility
- **AND** SHALL document touched state behavior for error display
- **AND** SHALL explain errors format compatibility with UI-Kit
- **AND** SHALL document style props apply to input element
- **AND** SHALL document min/max/step numeric constraints
- **AND** SHALL document formatOptions for locale-aware formatting

### Requirement: Common Use Cases Support
The component SHALL support typical numeric entry scenarios per nimbus-core standards.

#### Scenario: Quantity input
- **WHEN** used for product quantity
- **THEN** SHALL support min=1, step=1 for positive integers
- **AND** SHALL support max value for inventory limits
- **AND** SHALL provide stepper buttons for easy adjustment
- **AND** SHALL integrate with form validation

#### Scenario: Age input
- **WHEN** used for age entry
- **THEN** SHALL support min=0, max=120 for realistic age range
- **AND** SHALL support step=1 for integer years
- **AND** SHALL support isRequired for mandatory age fields
- **AND** SHALL display validation errors via FieldErrors

#### Scenario: Price input
- **WHEN** used for monetary amounts
- **THEN** SHALL support formatOptions with style="currency" and currency code
- **AND** SHALL support min=0 for non-negative prices
- **AND** SHALL support step=0.01 for cent precision
- **AND** SHALL format display per locale currency conventions

#### Scenario: Percentage input
- **WHEN** used for percentage values
- **THEN** SHALL support formatOptions with style="percent"
- **AND** SHALL support min=0, max=1 for 0-100% range (or min=0, max=100)
- **AND** SHALL support step=0.01 for precision
- **AND** SHALL display formatted percentage with symbol

#### Scenario: Decimal measurement input
- **WHEN** used for weight, height, or measurements
- **THEN** SHALL support decimal values via step=0.1 or smaller
- **AND** SHALL support formatOptions for fraction digits
- **AND** SHALL support unit display via trailingElement (e.g., "kg", "cm")
- **AND** SHALL validate against min/max bounds
