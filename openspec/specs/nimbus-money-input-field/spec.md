# Specification: MoneyInputField Component

## Overview

The MoneyInputField component is a pre-composed field pattern that combines MoneyInput with FormField to provide a complete, accessible monetary input form field with an intuitive flat API. It encapsulates label, hint text, error messaging, validation feedback, currency selection, amount formatting, and currency-specific features (currency selector, decimal precision, high precision badge) in a single component, reducing boilerplate code for monetary entry scenarios.

**Component:** `MoneyInputField`
**Package:** `@commercetools/nimbus`
**Type:** Pattern component (pre-composed field wrapper)
**Pattern:** Combines FormField + MoneyInput composition
**Location:** `packages/nimbus/src/patterns/fields/money-input-field/`

## Purpose

Provide a simplified, high-level API for creating complete monetary input form fields without manually composing FormField and MoneyInput components. Maintains backwards compatibility with UI-Kit's MoneyField by supporting the same error format and localized error messages while offering an ergonomic interface for product pricing, invoice amounts, payment forms, and other monetary entry use cases.

## Requirements

### Requirement: Component Composition
The component SHALL compose FormField.Root, FormField.Label, FormField.Input, FormField.Description, FormField.Error, FormField.InfoBox, and MoneyInput.

#### Scenario: Component structure
- **WHEN** MoneyInputField renders
- **THEN** SHALL render FormField.Root as outer wrapper
- **AND** SHALL render FormField.Label containing label prop
- **AND** SHALL render FormField.Input wrapping MoneyInput component
- **AND** SHALL pass all MoneyInput-specific props to MoneyInput element
- **AND** SHALL pass all FormField-specific props to FormField.Root

#### Scenario: Internal composition
- **WHEN** component renders
- **THEN** MoneyInput SHALL be wrapped in FormField.Input
- **AND** FormField SHALL handle ARIA associations automatically
- **AND** FormField SHALL coordinate label, input, description, and error rendering
- **AND** MoneyInput SHALL receive field state from FormField via props cloning

#### Scenario: Single-component interface
- **WHEN** developer uses MoneyInputField
- **THEN** SHALL accept flat props API (no nested components required)
- **AND** SHALL eliminate need for manual FormField composition
- **AND** SHALL provide same functionality as FormField + MoneyInput combination
- **AND** SHALL be drop-in replacement for common monetary input field patterns

### Requirement: Label Prop and Rendering
The component SHALL require a label prop and render it via FormField.Label per nimbus-core standards.

#### Scenario: Label prop requirement
- **WHEN** MoneyInputField is instantiated
- **THEN** label prop SHALL be required (TypeScript enforces)
- **AND** label SHALL accept ReactNode (string or JSX)
- **AND** component SHALL NOT render without label (accessibility requirement)

#### Scenario: Label rendering
- **WHEN** label prop is provided
- **THEN** SHALL render via FormField.Label component
- **AND** SHALL automatically associate with currency selector and amount input via aria-labelledby
- **AND** label SHALL be clickable to focus currency selector (first focusable element)
- **AND** label element SHALL use semantic <label> tag

#### Scenario: Required indicator
- **WHEN** isRequired={true} is set
- **THEN** label SHALL display asterisk (*) indicator
- **AND** asterisk SHALL be styled per FormField recipe
- **AND** amount input SHALL have aria-required="true"
- **AND** FormField SHALL handle required indicator rendering

### Requirement: Description Prop Support
The component SHALL support optional description prop for helper text per nimbus-core standards.

#### Scenario: Description rendering
- **WHEN** description prop is provided
- **THEN** SHALL render via FormField.Description component
- **AND** SHALL display below MoneyInput element
- **AND** SHALL associate with both currency selector and amount input via aria-describedby
- **AND** SHALL accept ReactNode (string or JSX)

#### Scenario: Description omission
- **WHEN** description prop is not provided
- **THEN** SHALL NOT render FormField.Description element
- **AND** SHALL not add description to aria-describedby
- **AND** component SHALL render without description text

#### Scenario: Description with errors
- **WHEN** both description and errors are present
- **THEN** SHALL render both description and error messages
- **AND** inputs aria-describedby SHALL reference both elements
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
- **THEN** info content SHALL be associated with inputs via aria-describedby
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
- **AND** errors SHALL be associated with both inputs via aria-describedby

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
- **AND** MoneyInput SHALL receive isRequired via props cloning
- **AND** amount input SHALL have aria-required="true"

#### Scenario: Disabled state
- **WHEN** isDisabled prop is set
- **THEN** SHALL pass isDisabled to FormField.Root
- **AND** MoneyInput SHALL receive isDisabled
- **AND** both currency selector and amount input SHALL be non-interactive
- **AND** amount input SHALL have disabled attribute
- **AND** currency selector SHALL have data-disabled="true"
- **AND** FormField SHALL apply disabled styling

#### Scenario: Read-only state
- **WHEN** isReadOnly prop is set
- **THEN** SHALL pass isReadOnly to FormField.Root
- **AND** MoneyInput SHALL receive isReadOnly
- **AND** amount input SHALL be focusable but non-editable
- **AND** amount input SHALL have readonly attribute
- **AND** currency selector SHALL be disabled in read-only mode

### Requirement: MoneyInput Props Passthrough
The component SHALL accept and forward all MoneyInput props per nimbus-core standards.

#### Scenario: Value and onChange handlers
- **WHEN** value and onValueChange props are provided
- **THEN** SHALL pass to MoneyInput for controlled component pattern
- **AND** onValueChange SHALL receive MoneyInputValue object { amount: string, currencyCode: string }
- **AND** MoneyInput SHALL update value on user input
- **AND** controlled pattern SHALL work as expected

#### Scenario: Modern API event handlers
- **WHEN** onAmountChange or onCurrencyChange props are provided
- **THEN** SHALL pass to MoneyInput
- **AND** onAmountChange SHALL receive string amount value
- **AND** onCurrencyChange SHALL receive CurrencyCode value
- **AND** SHALL support granular control over amount and currency changes separately

#### Scenario: Legacy API compatibility
- **WHEN** onChange prop is provided (deprecated)
- **THEN** SHALL pass to MoneyInput for backwards compatibility
- **AND** onChange SHALL receive CustomEvent with target.name and target.value
- **AND** SHALL support UI-Kit migration path
- **AND** modern API handlers (onValueChange) SHALL be preferred

#### Scenario: Currencies prop
- **WHEN** currencies prop is provided
- **THEN** SHALL be required (TypeScript enforces)
- **AND** SHALL pass to MoneyInput
- **AND** MoneyInput SHALL render currency selector dropdown
- **AND** SHALL support array of currency codes (e.g., ["USD", "EUR", "GBP"])
- **AND** SHALL enable currency selection for user

#### Scenario: Placeholder
- **WHEN** placeholder prop is provided
- **THEN** SHALL pass to MoneyInput
- **AND** MoneyInput SHALL display placeholder in empty amount input
- **AND** placeholder SHALL NOT replace label for accessibility
- **AND** default placeholder SHALL be "0.00"

#### Scenario: High precision badge
- **WHEN** hasHighPrecisionBadge prop is provided
- **THEN** SHALL pass to MoneyInput
- **AND** MoneyInput SHALL show badge when amount exceeds currency standard precision
- **AND** badge SHALL display high precision icon with tooltip
- **AND** default hasHighPrecisionBadge SHALL be true

#### Scenario: Currency input disable
- **WHEN** isCurrencyInputDisabled prop is provided
- **THEN** SHALL pass to MoneyInput
- **AND** MoneyInput SHALL disable currency selector while keeping amount input enabled
- **AND** allows locking currency while permitting amount changes

#### Scenario: Size prop
- **WHEN** size prop is provided
- **THEN** SHALL pass to both FormField.Root and MoneyInput
- **AND** SHALL accept "sm" | "md" values
- **AND** default size SHALL be "md"
- **AND** FormField typography and MoneyInput styling SHALL match size

#### Scenario: Style props
- **WHEN** style props (width, maxWidth, margin, etc.) are provided
- **THEN** SHALL pass to MoneyInput root element
- **AND** style props SHALL affect MoneyInput container, not FormField wrapper
- **AND** SHALL support responsive style prop syntax
- **AND** SHALL support Chakra style prop system

#### Scenario: Other MoneyInput props
- **WHEN** additional MoneyInput props are spread via rest
- **THEN** SHALL pass name, id, autoFocus, onFocus, onBlur, etc.
- **AND** SHALL support all valid MoneyInput props
- **AND** SHALL maintain type safety via TypeScript

### Requirement: Currency-Specific Value Structure
The component SHALL use MoneyInputValue structure for monetary data per nimbus-core standards.

#### Scenario: Value structure format
- **WHEN** value prop is provided
- **THEN** SHALL be object with { amount: string, currencyCode: string | "" }
- **AND** amount SHALL be string representation of numeric value
- **AND** amount SHALL use dot (.) as decimal separator internally
- **AND** currencyCode SHALL be ISO 4217 currency code or empty string

#### Scenario: Amount string representation
- **WHEN** amount value is set
- **THEN** SHALL accept decimal values as strings (e.g., "99.99")
- **AND** SHALL support high precision values (e.g., "99.12345")
- **AND** SHALL support whole numbers (e.g., "100")
- **AND** SHALL support empty string for no value

#### Scenario: Currency code validation
- **WHEN** currencyCode is set
- **THEN** SHALL accept valid ISO 4217 codes (USD, EUR, GBP, JPY, etc.)
- **AND** SHALL support empty string for unselected currency
- **AND** SHALL determine decimal precision based on currency
- **AND** SHALL format display according to currency conventions

### Requirement: Currency Selector Functionality
The component SHALL provide currency selection via MoneyInput per nimbus-core standards.

#### Scenario: Currency selector rendering
- **WHEN** currencies array is provided with values
- **THEN** MoneyInput SHALL render Select dropdown for currency
- **AND** dropdown SHALL display available currency codes
- **AND** dropdown trigger SHALL show selected currency code
- **AND** dropdown SHALL be positioned before amount input (right in RTL)

#### Scenario: Currency selection interaction
- **WHEN** user clicks currency selector
- **THEN** MoneyInput SHALL open dropdown with currency options
- **AND** user SHALL be able to select currency from list
- **AND** selection SHALL trigger onCurrencyChange and onValueChange
- **AND** selected currency SHALL be displayed in selector

#### Scenario: Currency selector keyboard navigation
- **WHEN** currency selector is focused
- **THEN** SHALL support Enter/Space to open dropdown
- **AND** SHALL support Arrow keys to navigate options
- **AND** SHALL support Escape to close dropdown
- **AND** SHALL support typing to filter/select currencies

#### Scenario: No currencies provided
- **WHEN** currencies array is empty or not provided
- **THEN** MoneyInput SHALL render currency as read-only label instead of dropdown
- **AND** label SHALL display current currencyCode value
- **AND** user SHALL NOT be able to change currency
- **AND** only amount input SHALL be interactive

### Requirement: Amount Input with Currency Formatting
The component SHALL format amount input according to currency rules per nimbus-core standards.

#### Scenario: Locale-aware number formatting
- **WHEN** amount input displays value
- **THEN** MoneyInput SHALL format numbers per locale conventions
- **AND** SHALL use appropriate thousands separator for locale (e.g., comma or period)
- **AND** SHALL use appropriate decimal separator for locale (e.g., period or comma)
- **AND** SHALL support RTL locales

#### Scenario: Currency-specific decimal precision
- **WHEN** currency is selected
- **THEN** MoneyInput SHALL enforce decimal precision per currency
- **AND** USD/EUR/GBP SHALL show 2 decimal places (e.g., 99.99)
- **AND** JPY SHALL show 0 decimal places (whole numbers only)
- **AND** KWD SHALL show 3 decimal places (e.g., 99.999)
- **AND** SHALL format display on blur per currency rules

#### Scenario: High precision value display
- **WHEN** amount exceeds currency standard precision
- **THEN** MoneyInput SHALL preserve high precision value
- **AND** SHALL display all decimal places without truncation
- **AND** SHALL show high precision badge if hasHighPrecisionBadge={true}
- **AND** SHALL format with maximum 20 decimal places

#### Scenario: Amount input user typing
- **WHEN** user types in amount input
- **THEN** MoneyInput SHALL accept numeric input
- **AND** SHALL accept decimal point/separator
- **AND** SHALL prevent non-numeric characters
- **AND** SHALL format value on blur

### Requirement: Dual Input Tab Navigation
The component SHALL support keyboard navigation between currency selector and amount input per nimbus-core standards.

#### Scenario: Tab order
- **WHEN** user presses Tab key on label or before field
- **THEN** SHALL focus currency selector first (if enabled)
- **WHEN** user presses Tab key on currency selector
- **THEN** SHALL focus amount input next
- **WHEN** user presses Tab key on amount input
- **THEN** SHALL move focus to next element outside field

#### Scenario: Shift+Tab reverse navigation
- **WHEN** user presses Shift+Tab on amount input
- **THEN** SHALL focus currency selector (if enabled)
- **WHEN** user presses Shift+Tab on currency selector
- **THEN** SHALL move focus to previous element (typically label)

#### Scenario: Tab navigation with disabled currency
- **WHEN** isCurrencyInputDisabled={true} or currencies is empty
- **THEN** Tab SHALL skip currency selector and focus amount input directly
- **AND** only amount input SHALL be in tab order

### Requirement: Name Attribute Generation
The component SHALL generate name attributes for form submission per nimbus-core standards.

#### Scenario: Name prop structure
- **WHEN** name prop is provided
- **THEN** SHALL pass to MoneyInput
- **AND** MoneyInput SHALL create ${name}.amount for amount input
- **AND** MoneyInput SHALL create ${name}.currencyCode for currency selector
- **AND** SHALL support nested form data structure

#### Scenario: Form submission format
- **WHEN** MoneyInputField is inside <form> element
- **THEN** amount input SHALL participate in form submission with name="${name}.amount"
- **AND** currency selector SHALL participate with name="${name}.currencyCode"
- **AND** SHALL submit amount as string value
- **AND** SHALL submit currencyCode as string value

### Requirement: ID Prop for Custom Identification
The component SHALL support optional id prop for custom element identification per nimbus-core standards.

#### Scenario: Custom ID
- **WHEN** id prop is provided
- **THEN** SHALL pass to FormField.Root
- **AND** FormField SHALL coordinate ID generation for sub-elements
- **AND** MoneyInput SHALL generate ${id}.amount for amount input
- **AND** MoneyInput SHALL generate ${id}.currencyCode for currency selector
- **AND** custom id SHALL override auto-generated id

#### Scenario: Auto-generated ID
- **WHEN** id prop is not provided
- **THEN** FormField and MoneyInput SHALL auto-generate unique ids
- **AND** auto-generated ids SHALL associate label with inputs
- **AND** SHALL maintain ARIA associations without manual id

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive type definitions per nimbus-core standards.

#### Scenario: Props type definition
- **WHEN** MoneyInputFieldProps is defined
- **THEN** SHALL extend MoneyInputProps with omissions for conflicting props
- **AND** SHALL pick specific FormFieldProps: isRequired, isInvalid, isDisabled, isReadOnly, id
- **AND** SHALL add field-specific props: label, description, info, errors, touched, renderError
- **AND** SHALL require currencies prop (array of strings)
- **AND** SHALL export MoneyInputFieldProps interface

#### Scenario: Label prop type
- **WHEN** label prop is typed
- **THEN** SHALL be string | ReactNode (required)
- **AND** SHALL support string or JSX elements
- **AND** TypeScript SHALL enforce label presence

#### Scenario: Optional props types
- **WHEN** optional props are defined
- **THEN** description, info SHALL be string | ReactNode | undefined
- **AND** touched, isRequired, isDisabled, isReadOnly, isInvalid SHALL be boolean with defaults
- **AND** errors SHALL be FieldErrorsData | undefined
- **AND** renderError SHALL be (errorKey: string) => ReactNode

#### Scenario: Value prop type
- **WHEN** value prop is typed
- **THEN** SHALL be MoneyInputValue: { amount: string, currencyCode: string | "" }
- **AND** SHALL require value prop for controlled component
- **AND** onValueChange SHALL be (value: MoneyInputValue) => void
- **AND** onAmountChange SHALL be (amount: string) => void
- **AND** onCurrencyChange SHALL be (currencyCode: CurrencyCode) => void

#### Scenario: Size prop type
- **WHEN** size prop is typed
- **THEN** SHALL be "sm" | "md" with autocomplete
- **AND** default SHALL be "md"
- **AND** SHALL match FormField and MoneyInput size values

### Requirement: Display Name
The component SHALL set displayName per nimbus-core standards.

#### Scenario: Display name assignment
- **WHEN** component is defined
- **THEN** SHALL set displayName = "MoneyInputField"
- **AND** displayName SHALL aid debugging in React DevTools
- **AND** SHALL be set as static property on component function

### Requirement: Controlled Component Pattern
The component SHALL support controlled input pattern per nimbus-core standards.

#### Scenario: Controlled value
- **WHEN** value and onValueChange props are provided
- **THEN** component SHALL be fully controlled by parent
- **AND** value changes SHALL only occur via onValueChange callback
- **AND** onValueChange SHALL receive MoneyInputValue object (not event)
- **AND** parent SHALL manage input state

#### Scenario: Partial value updates
- **WHEN** only amount changes
- **THEN** onValueChange SHALL receive updated MoneyInputValue with new amount
- **AND** currencyCode SHALL remain unchanged
- **WHEN** only currency changes
- **THEN** onValueChange SHALL receive updated MoneyInputValue with new currencyCode
- **AND** amount SHALL remain unchanged

#### Scenario: State synchronization
- **WHEN** parent updates value prop
- **THEN** MoneyInput SHALL re-render with new value
- **AND** currency selector SHALL display new currencyCode
- **AND** amount input SHALL display new amount
- **AND** formatting SHALL update per new currency if changed

### Requirement: Accessibility Compliance
The component SHALL meet WCAG 2.1 AA standards per nimbus-core standards.

#### Scenario: Label association
- **WHEN** component renders
- **THEN** label SHALL be associated with inputs via aria-labelledby
- **AND** clicking label SHALL focus currency selector (first input)
- **AND** screen readers SHALL announce label when inputs are focused
- **AND** FormField SHALL handle association automatically

#### Scenario: Description association
- **WHEN** description is provided
- **THEN** description SHALL be associated with both inputs via aria-describedby
- **AND** screen readers SHALL announce description when inputs are focused
- **AND** FormField SHALL handle association automatically

#### Scenario: Error message association
- **WHEN** errors are displayed
- **THEN** error messages SHALL be associated with both inputs via aria-describedby
- **AND** screen readers SHALL announce errors when inputs are focused
- **AND** error SHALL have role="alert" for immediate announcement
- **AND** FormField and FieldErrors SHALL handle associations automatically

#### Scenario: Required field announcement
- **WHEN** isRequired={true}
- **THEN** amount input SHALL have aria-required="true"
- **AND** screen readers SHALL announce required state
- **AND** visual required indicator (*) SHALL be present in label

#### Scenario: Invalid state announcement
- **WHEN** field is invalid
- **THEN** amount input SHALL have aria-invalid="true"
- **AND** screen readers SHALL announce invalid state
- **AND** error messages SHALL be announced via aria-describedby

#### Scenario: Currency selector accessibility
- **WHEN** currency selector renders
- **THEN** SHALL have aria-label from i18n ("Currency")
- **AND** SHALL be operable via keyboard
- **AND** SHALL announce selected currency to screen readers
- **AND** SHALL support Select component accessibility features

#### Scenario: Amount input accessibility
- **WHEN** amount input renders
- **THEN** SHALL have aria-label from i18n ("Amount")
- **AND** SHALL support NumberInput accessibility features
- **AND** SHALL announce formatted value to screen readers
- **AND** SHALL have aria-describedby linking to high precision badge if shown

#### Scenario: Focus indicators
- **WHEN** inputs receive focus
- **THEN** SHALL display visible focus rings meeting 3:1 contrast
- **AND** focus indicators SHALL be provided by Select and NumberInput components
- **AND** SHALL be clearly distinguishable from unfocused state

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission participation
- **WHEN** MoneyInputField is inside <form>
- **THEN** both inputs SHALL be included in form submission
- **AND** SHALL use ${name}.amount and ${name}.currencyCode as form data keys
- **AND** SHALL submit current values in form data

#### Scenario: Form validation support
- **WHEN** form validation is triggered
- **THEN** isRequired state SHALL prevent submission if empty
- **AND** isInvalid state SHALL visually indicate validation failure
- **AND** error messages SHALL guide user to fix validation issues

#### Scenario: Form reset
- **WHEN** form is reset
- **THEN** MoneyInput SHALL clear to initial values
- **AND** SHALL support HTML form reset behavior
- **AND** controlled components SHALL be managed by parent state

### Requirement: Responsive Design
The component SHALL support responsive design patterns per nimbus-core standards.

#### Scenario: Responsive size
- **WHEN** size prop uses responsive syntax
- **THEN** SHALL support: size={{ base: "sm", md: "md" }}
- **AND** FormField and MoneyInput SHALL apply appropriate sizes at breakpoints
- **AND** typography and input styling SHALL adjust responsively

#### Scenario: Responsive style props
- **WHEN** style props use responsive syntax
- **THEN** SHALL support: width={{ base: "100%", md: "50%" }}
- **AND** MoneyInput SHALL apply responsive styles at breakpoints
- **AND** SHALL use Chakra breakpoint system

### Requirement: UI-Kit Compatibility
The component SHALL maintain backwards compatibility with UI-Kit MoneyField per nimbus-core standards.

#### Scenario: Error format compatibility
- **WHEN** errors prop is provided
- **THEN** SHALL accept same error format as UI-Kit MoneyField
- **AND** errors SHALL be Record<string, boolean> mapping error types to presence
- **AND** FieldErrors SHALL render localized messages for error types

#### Scenario: Localized error messages
- **WHEN** errors are displayed
- **THEN** FieldErrors SHALL use react-intl for localized messages
- **AND** SHALL support standard error types: missing, invalid, format, etc.
- **AND** SHALL match UI-Kit error message text for compatibility

#### Scenario: API parity
- **WHEN** migrating from UI-Kit MoneyField
- **THEN** MoneyInputField SHALL support equivalent props
- **AND** SHALL provide similar functionality and behavior
- **AND** SHALL reduce migration friction for existing codebases

### Requirement: Distinction from Manual Composition
The component SHALL provide simpler API than manual FormField + MoneyInput composition per nimbus-core standards.

#### Scenario: Simplified API
- **WHEN** developer uses MoneyInputField
- **THEN** SHALL accept flat props instead of nested component structure
- **AND** SHALL reduce boilerplate code for common use cases
- **AND** SHALL eliminate need to understand FormField composition

#### Scenario: When to use MoneyInputField
- **WHEN** use case is standard monetary input with label/description/errors
- **THEN** MoneyInputField SHALL be preferred over manual composition
- **AND** SHALL provide ergonomic API for pricing, payments, invoices
- **AND** SHALL reduce code verbosity

#### Scenario: When to use manual composition
- **WHEN** use case requires custom layout or advanced FormField features
- **THEN** developers SHALL use FormField + MoneyInput directly
- **AND** manual composition SHALL provide full flexibility
- **AND** MoneyInputField SHALL not constrain advanced use cases

### Requirement: Distinction from NumberInputField
The component SHALL be the preferred solution for monetary amounts over NumberInputField per nimbus-core standards.

#### Scenario: Currency-specific features
- **WHEN** developer needs monetary input with currency selection
- **THEN** SHALL use MoneyInputField (includes currency selector)
- **AND** SHALL NOT use NumberInputField with currency formatOptions
- **AND** MoneyInputField SHALL provide better UX for monetary data

#### Scenario: Value structure difference
- **WHEN** handling monetary values
- **THEN** MoneyInputField SHALL use { amount: string, currencyCode: string } structure
- **AND** NumberInputField SHALL use simple number value
- **AND** MoneyInputField SHALL maintain currency context with amount
- **AND** SHALL be semantically correct for monetary use cases

#### Scenario: Formatting and precision
- **WHEN** displaying monetary amounts
- **THEN** MoneyInputField SHALL automatically format per selected currency
- **AND** SHALL enforce currency-specific decimal precision
- **AND** SHALL support high precision values for extended pricing
- **AND** NumberInputField SHALL require manual formatOptions configuration

### Requirement: No Custom Styling
The component SHALL not define custom styles beyond composition per nimbus-core standards.

#### Scenario: Style inheritance
- **WHEN** MoneyInputField renders
- **THEN** SHALL inherit all styling from FormField recipe
- **AND** SHALL inherit all styling from MoneyInput recipe
- **AND** SHALL NOT define own recipe or custom styles

#### Scenario: Style props passthrough
- **WHEN** style props are provided
- **THEN** SHALL pass to MoneyInput element
- **AND** MoneyInput SHALL apply its styling system
- **AND** FormField SHALL apply its styling system
- **AND** no additional styling layer SHALL be introduced

### Requirement: JSDoc Documentation
The component SHALL provide comprehensive JSDoc per nimbus-core standards.

#### Scenario: Component documentation
- **WHEN** component is defined
- **THEN** SHALL include JSDoc block with description
- **AND** SHALL describe purpose: pre-composed field combining MoneyInput with FormField
- **AND** SHALL include @example tag with usage code
- **AND** SHALL explain simplified API benefit
- **AND** SHALL note two focusable inputs: currency selector and amount input

#### Scenario: Props documentation
- **WHEN** MoneyInputFieldProps is defined
- **THEN** all props SHALL have JSDoc comments
- **AND** SHALL explain label is required for accessibility
- **AND** SHALL document touched state behavior for error display
- **AND** SHALL explain errors format compatibility with UI-Kit
- **AND** SHALL document style props apply to MoneyInput container
- **AND** SHALL document currencies prop is required
- **AND** SHALL document value structure with amount and currencyCode

### Requirement: Common Use Cases Support
The component SHALL support typical monetary entry scenarios per nimbus-core standards.

#### Scenario: Product pricing
- **WHEN** used for product prices
- **THEN** SHALL support multiple currencies for international pricing
- **AND** SHALL display currency-appropriate decimal places
- **AND** SHALL integrate with form validation
- **AND** SHALL support required validation for mandatory pricing

#### Scenario: Invoice amounts
- **WHEN** used for invoice line items
- **THEN** SHALL support high precision for unit pricing
- **AND** SHALL show high precision badge when needed
- **AND** SHALL format display per invoice currency
- **AND** SHALL support read-only for locked invoice items

#### Scenario: Payment forms
- **WHEN** used for payment entry
- **THEN** SHALL support currency selection for multi-currency payments
- **AND** SHALL validate amount is required and positive
- **AND** SHALL display validation errors clearly
- **AND** SHALL prevent form submission when invalid

#### Scenario: Budget and financial planning
- **WHEN** used for budget entry
- **THEN** SHALL support large amounts with thousands separators
- **AND** SHALL format per user locale conventions
- **AND** SHALL support multiple currencies for international budgets
- **AND** SHALL allow controlled state management for calculations

#### Scenario: E-commerce checkout
- **WHEN** used for cart totals and pricing
- **THEN** SHALL display read-only amounts with currency
- **AND** SHALL format consistently across all monetary fields
- **AND** SHALL support disabled state for non-editable amounts
- **AND** SHALL provide clear visual hierarchy with labels
