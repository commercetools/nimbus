# Specification: MoneyInput Component

## Overview

The MoneyInput component provides a specialized input for entering monetary amounts with currency selection and multi-currency support. It extends NumberInput with currency-specific formatting, high precision handling, and locale-aware display.

**Component:** `MoneyInput`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component (extends NumberInput functionality)
**React Aria:** Uses `NumberField` from react-aria-components (via NumberInput)
**Base Component:** Extends NumberInput for numeric input functionality

## Purpose

Provide a specialized monetary input field with currency selection, multi-currency support, high precision handling (up to 20 decimal places), and locale-aware formatting. The component extends NumberInput functionality while supporting currency-specific fraction digits, automatic formatting on blur, and visual indicators for high precision values, maintaining WCAG 2.1 AA compliance throughout.

## Requirements

### Requirement: Money Value Handling
The component SHALL manage monetary values as compound objects with amount and currency code.

#### Scenario: Value structure
- **WHEN** value prop is provided
- **THEN** SHALL accept MoneyInputValue object with `amount` (string) and `currencyCode` (CurrencyCode | "")
- **AND** amount SHALL be stored as string to preserve precision
- **AND** amount SHALL use dot (.) as decimal separator internally

#### Scenario: Controlled mode
- **WHEN** value and onChange/onValueChange props are provided
- **THEN** SHALL render with provided value
- **AND** SHALL call change handlers with updated MoneyInputValue
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** only defaultValue is provided
- **THEN** SHALL initialize with defaultValue
- **AND** SHALL manage state internally
- **AND** SHALL call change handlers on updates

## Currency Management

### Requirement: Currency Selection
The component SHALL provide currency selection via dropdown or label display.

#### Scenario: Currency dropdown
- **WHEN** currencies array is provided with values
- **THEN** SHALL render Select component for currency selection
- **AND** SHALL use currency code as both key and display text
- **AND** SHALL call change handlers when currency changes
- **AND** SHALL support isCurrencyInputDisabled prop to disable dropdown

#### Scenario: Currency label
- **WHEN** currencies array is empty or not provided
- **THEN** SHALL render static label showing current currency code
- **AND** SHALL not allow currency changes
- **AND** label SHALL be semantically associated with amount input

#### Scenario: Currency code validation
- **WHEN** currency code is provided
- **THEN** SHALL validate against known currency codes from currencies data
- **AND** SHALL support all ISO 4217 standard currency codes
- **AND** SHALL access fractionDigits from currency data

### Requirement: Currency-Specific Formatting
The component SHALL format amounts according to currency specifications.

#### Scenario: Fraction digits by currency
- **WHEN** currency has standard fraction digits
- **THEN** USD/EUR/GBP SHALL use 2 fraction digits
- **AND** JPY/KRW SHALL use 0 fraction digits
- **AND** KWD/BHD/JOD SHALL use 3 fraction digits
- **AND** minimumFractionDigits SHALL match currency standard

#### Scenario: Formatting on blur
- **WHEN** user blurs amount input
- **THEN** SHALL format to currency's minimumFractionDigits
- **AND** "99.9" in USD SHALL format to "99.90"
- **AND** "99.5" in JPY SHALL format to "99"
- **AND** "42.1" in KWD SHALL format to "42.100"

#### Scenario: Currency switching
- **WHEN** user changes currency while amount exists
- **THEN** SHALL reformat amount to new currency's fraction digits
- **AND** SHALL preserve numeric value during switch
- **AND** SHALL trigger both onCurrencyChange and onValueChange handlers
- **AND** high precision SHALL be recalculated for new currency

## High Precision Support

### Requirement: High Precision Detection
The component SHALL detect and indicate when amounts exceed standard currency precision.

#### Scenario: High precision threshold
- **WHEN** amount has more decimal places than currency standard
- **THEN** SHALL consider value as high precision
- **AND** USD amount "99.123" (3 decimals > 2) SHALL be high precision
- **AND** EUR amount "42.12345" (5 decimals > 2) SHALL be high precision
- **AND** KWD amount "10.1234" (4 decimals > 3) SHALL be high precision
- **AND** JPY amount "1000" (0 decimals = 0) SHALL NOT be high precision

#### Scenario: High precision preservation
- **WHEN** high precision value is entered
- **THEN** SHALL preserve full precision (up to 20 decimal places)
- **AND** SHALL not truncate on blur
- **AND** maximumFractionDigits SHALL be 20
- **AND** formatOptions.style SHALL be "decimal" (not "currency")

### Requirement: High Precision Badge
The component SHALL display visual indicator for high precision values.

#### Scenario: Badge display
- **WHEN** hasHighPrecisionBadge={true} (default) and value is high precision
- **THEN** SHALL display HighPrecision icon from @commercetools/nimbus-icons
- **AND** icon SHALL be positioned at end of input
- **AND** icon color SHALL be neutral.11 (enabled) or neutral.8 (disabled)
- **AND** SHALL use transform to position without layout shift

#### Scenario: Badge tooltip
- **WHEN** high precision badge is displayed
- **THEN** SHALL wrap badge in Tooltip component
- **AND** tooltip content SHALL show i18n message "High precision price"
- **AND** tooltip placement SHALL be "top"
- **AND** tooltip SHALL have delay={0} and closeDelay={0}

#### Scenario: Badge accessibility
- **WHEN** high precision badge renders
- **THEN** badge SHALL have aria-label from i18n "High precision price"
- **AND** badge SHALL be focusable via MakeElementFocusable wrapper
- **AND** badge id SHALL be associated with input via aria-describedby

#### Scenario: Badge disabled
- **WHEN** hasHighPrecisionBadge={false} is set
- **THEN** SHALL not display badge even if value is high precision
- **AND** SHALL still preserve high precision internally

## Locale-Aware Formatting

### Requirement: Locale-Based Number Formatting
The component SHALL format numbers according to user's locale.

#### Scenario: Locale context
- **WHEN** component renders
- **THEN** SHALL use locale from React Aria's useLocale hook
- **AND** locale SHALL be provided by NimbusI18nProvider
- **AND** SHALL default to en-US if not specified

#### Scenario: Decimal separator by locale
- **WHEN** formatting numbers for display
- **THEN** en-US locale SHALL use period for decimals: "1,234.56"
- **AND** de-DE locale SHALL use comma for decimals: "1.234,56"
- **AND** formatOptions SHALL use locale-specific separators via NumberInput

#### Scenario: Thousands separator
- **WHEN** amount has thousands
- **THEN** SHALL use locale-specific grouping separator
- **AND** useGrouping SHALL be true in formatOptions
- **AND** "1234.56" SHALL format as "1,234.56" (en-US) or "1.234,56" (de-DE)

#### Scenario: RTL locale support
- **WHEN** locale is RTL (ar, he, etc.)
- **THEN** SHALL support right-to-left text direction
- **AND** formatting SHALL adapt via React Aria NumberField

## Event Handling

### Requirement: Modern Event API
The component SHALL provide modern type-safe event handlers.

#### Scenario: onValueChange handler
- **WHEN** onValueChange prop is provided
- **THEN** SHALL call with complete MoneyInputValue object
- **AND** SHALL include updated amount and currencyCode
- **AND** SHALL be called on both amount and currency changes

#### Scenario: onAmountChange handler
- **WHEN** onAmountChange prop is provided
- **THEN** SHALL call with string amount value
- **AND** SHALL be called only when amount changes
- **AND** SHALL preserve full precision in string

#### Scenario: onCurrencyChange handler
- **WHEN** onCurrencyChange prop is provided
- **THEN** SHALL call with CurrencyCode value
- **AND** SHALL be called only when currency changes
- **AND** SHALL be called immediately on selection

### Requirement: Legacy Event API (Deprecated)
The component SHALL support backward-compatible event handling.

#### Scenario: Legacy onChange handler
- **WHEN** onChange prop is provided
- **THEN** SHALL call with CustomEvent object
- **AND** event.target.id SHALL be composed field id (groupId.amount or groupId.currencyCode)
- **AND** event.target.name SHALL be composed field name (name.amount or name.currencyCode)
- **AND** event.target.value SHALL be string value
- **AND** @deprecated tag SHALL warn to use modern API

#### Scenario: Legacy event structure
- **WHEN** legacy onChange fires
- **THEN** amount changes SHALL use name ending with ".amount"
- **AND** currency changes SHALL use name ending with ".currencyCode"
- **AND** consumer SHALL parse event.target.name to determine field type

### Requirement: Focus and Blur Events
The component SHALL support focus and blur handling.

#### Scenario: Focus events
- **WHEN** onFocus prop is provided
- **THEN** SHALL call when amount input receives focus
- **AND** SHALL call when currency select receives focus
- **AND** event SHALL include appropriate field id and name

#### Scenario: Blur events
- **WHEN** onBlur prop is provided
- **THEN** SHALL call when amount input loses focus
- **AND** SHALL call when currency select loses focus
- **AND** SHALL format amount on blur before calling handler

## Input States

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** isDisabled={true} is set
- **THEN** SHALL disable amount input
- **AND** SHALL disable currency select (if present)
- **AND** SHALL apply disabled styling to both fields
- **AND** high precision badge SHALL use disabled color (neutral.8)

#### Scenario: Read-only state
- **WHEN** isReadOnly={true} is set
- **THEN** amount input SHALL be read-only
- **AND** currency select SHALL be disabled
- **AND** SHALL prevent all value changes
- **AND** SHALL display values without edit controls

#### Scenario: Invalid state
- **WHEN** isInvalid={true} is set
- **THEN** SHALL apply error styling to container
- **AND** SHALL set aria-invalid on amount input
- **AND** SHALL be compatible with FormField error display

#### Scenario: Required state
- **WHEN** isRequired={true} is set
- **THEN** SHALL set aria-required on amount input
- **AND** SHALL be compatible with FormField required indicator

## Field Identification

### Requirement: Compound Field IDs
The component SHALL generate unique IDs for amount and currency fields.

#### Scenario: Auto-generated IDs
- **WHEN** id prop is not provided
- **THEN** SHALL auto-generate unique group ID via useId
- **AND** amount input id SHALL be "{groupId}.amount"
- **AND** currency select id SHALL be "{groupId}.currencyCode"

#### Scenario: Custom IDs
- **WHEN** id prop is provided
- **THEN** SHALL use provided id as group id
- **AND** amount input id SHALL be "{id}.amount"
- **AND** currency select id SHALL be "{id}.currencyCode"

#### Scenario: Field names
- **WHEN** name prop is provided
- **THEN** amount input name SHALL be "{name}.amount"
- **AND** currency select name SHALL be "{name}.currencyCode"
- **AND** names SHALL be suitable for form submission

## Static Methods

### Requirement: Utility Methods
The component SHALL provide static helper methods for currency operations.

#### Scenario: getAmountInputId method
- **WHEN** MoneyInput.getAmountInputId(id) is called
- **THEN** SHALL return "{id}.amount"
- **AND** SHALL return undefined if id is undefined

#### Scenario: getCurrencyDropdownId method
- **WHEN** MoneyInput.getCurrencyDropdownId(id) is called
- **THEN** SHALL return "{id}.currencyCode"
- **AND** SHALL return undefined if id is undefined

#### Scenario: convertToMoneyValue method
- **WHEN** MoneyInput.convertToMoneyValue(value, locale) is called
- **THEN** SHALL parse MoneyInputValue to MoneyValue object
- **AND** SHALL include type: "highPrecision" or "centPrecision"
- **AND** SHALL calculate centAmount and fractionDigits
- **AND** SHALL set preciseAmount for high precision values

#### Scenario: parseMoneyValue method
- **WHEN** MoneyInput.parseMoneyValue(moneyValue, locale) is called
- **THEN** SHALL format MoneyValue to MoneyInputValue
- **AND** SHALL use locale-specific formatting
- **AND** SHALL preserve high precision decimal places

#### Scenario: isEmpty method
- **WHEN** MoneyInput.isEmpty(value) is called
- **THEN** SHALL return true if amount is empty string
- **AND** SHALL return true if currencyCode is empty string
- **AND** SHALL return true if value is null/undefined

#### Scenario: isHighPrecision method
- **WHEN** MoneyInput.isHighPrecision(value, locale) is called
- **THEN** SHALL return true if amount exceeds currency fraction digits
- **AND** SHALL return false if value is empty
- **AND** SHALL use locale for parsing

## NumberInput Integration

### Requirement: NumberInput Base Features
The component SHALL inherit NumberInput functionality.

#### Scenario: Numeric input features
- **WHEN** component renders amount field
- **THEN** SHALL use NumberInput component
- **AND** SHALL support all NumberInput props (except step)
- **AND** SHALL format numbers with formatOptions
- **AND** SHALL handle keyboard arrow key stepping

#### Scenario: Step behavior exclusion
- **WHEN** NumberInput receives step prop
- **THEN** step SHALL be undefined to prevent precision truncation
- **AND** React Aria SHALL not snap values to step boundaries on blur
- **AND** high precision SHALL be preserved

#### Scenario: Format options
- **WHEN** creating formatOptions for NumberInput
- **THEN** style SHALL be "decimal" (not "currency" to avoid symbol conflicts)
- **AND** minimumFractionDigits SHALL match currency.fractionDigits
- **AND** maximumFractionDigits SHALL be 20 for high precision support
- **AND** useGrouping SHALL be true for thousands separators

## Size Variants

### Requirement: Size Support
The component SHALL support size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set
- **THEN** SHALL support: sm, md
- **AND** SHALL apply size to both amount input and currency select
- **AND** md SHALL be default size
- **AND** SHALL adjust height, padding, and font size

## Accessibility

### Requirement: ARIA Attributes
The component SHALL provide comprehensive ARIA attributes per nimbus-core standards.

#### Scenario: Amount input labels
- **WHEN** amount input renders
- **THEN** SHALL have base aria-label "Amount" from i18n
- **AND** SHALL support aria-labelledby for currency label association
- **AND** SHALL support aria-describedby for high precision badge

#### Scenario: Currency select label
- **WHEN** currency select renders
- **THEN** SHALL have aria-label "Currency" from i18n
- **AND** SHALL be accessible via keyboard navigation

#### Scenario: Screen reader announcements
- **WHEN** user interacts with component
- **THEN** currency changes SHALL be announced
- **AND** high precision state SHALL be announced via aria-describedby
- **AND** validation errors SHALL be announced

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard
- **THEN** Tab SHALL move between currency select and amount input
- **AND** amount input SHALL support NumberInput keyboard patterns
- **AND** currency select SHALL support Select keyboard patterns

## Internationalization

### Requirement: Translatable UI Text
The component SHALL support i18n for all user-facing text.

#### Scenario: i18n messages
- **WHEN** component renders
- **THEN** SHALL define messages in money-input.i18n.ts
- **AND** SHALL use Nimbus.MoneyInput.currencySelectLabel for currency aria-label
- **AND** SHALL use Nimbus.MoneyInput.amountInputLabel for amount aria-label
- **AND** SHALL use Nimbus.MoneyInput.highPrecisionPrice for badge tooltip

#### Scenario: Message formatting
- **WHEN** displaying i18n text
- **THEN** SHALL use useLocalizedStringFormatter hook
- **AND** SHALL call msg.format("key")
- **AND** SHALL support all 5 Nimbus locales (en, de, es, fr-FR, pt-BR)

## Styling

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply moneyInput slot recipe from theme/slot-recipes/money-input.ts
- **AND** SHALL style slots: root, container, currencySelect, currencyLabel, amountInput, badge
- **AND** SHALL support size variants

#### Scenario: Recipe application
- **WHEN** applying styles
- **THEN** SHALL use useSlotRecipe hook
- **AND** SHALL split variant props with recipe.splitVariantProps
- **AND** SHALL extract style props with extractStyleProps
- **AND** SHALL forward both to slot components

#### Scenario: Badge positioning
- **WHEN** high precision badge displays
- **THEN** SHALL use transform for positioning without layout shift
- **AND** transform SHALL translateX by negative spacing.1200 token value
- **AND** SHALL not use NumberInput's trailingElement to avoid layout shift

## Form Integration

### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** component is in a form
- **THEN** SHALL include both amount and currency in form data
- **AND** field names SHALL use compound pattern: name.amount, name.currencyCode
- **AND** SHALL validate before submission

#### Scenario: FormField integration
- **WHEN** wrapped in FormField component
- **THEN** SHALL inherit isInvalid state from FormField
- **AND** SHALL inherit isDisabled state from FormField
- **AND** SHALL inherit isReadOnly state from FormField
- **AND** SHALL inherit isRequired state from FormField
- **AND** SHALL work with FormField.Label, FormField.Description, FormField.Error

## Type Safety

### Requirement: TypeScript Definitions
The component SHALL provide comprehensive type definitions.

#### Scenario: Value types
- **WHEN** using MoneyInput types
- **THEN** SHALL export MoneyInputValue type (amount: string, currencyCode: CurrencyCode | "")
- **AND** SHALL export CurrencyCode union type (all ISO 4217 codes)
- **AND** SHALL export MoneyValue type (for static method compatibility)

#### Scenario: Props types
- **WHEN** using component props
- **THEN** SHALL export MoneyInputProps interface
- **AND** SHALL include JSDoc comments for all props
- **AND** SHALL inherit HTMLChakraProps with style prop support

#### Scenario: Recipe types
- **WHEN** using styling props
- **THEN** SHALL export slot props types for each slot
- **AND** types SHALL be auto-generated via Chakra CLI
- **AND** SHALL provide autocomplete for size variant

## Implementation Notes

### Requirement: Currency Data Management
The component SHALL use centralized currency data.

#### Scenario: Currency data source
- **WHEN** accessing currency information
- **THEN** SHALL import from utils/currencies.ts
- **AND** currencies data SHALL include fractionDigits for each code
- **AND** data SHALL cover all ISO 4217 standard currencies

### Requirement: Precision Architecture
The component SHALL use dual formatting systems.

#### Scenario: Live formatting system
- **WHEN** user types in amount field
- **THEN** SHALL use NumberInput with formatOptions for live interaction
- **AND** React Aria NumberField SHALL handle display formatting
- **AND** maximumFractionDigits=20 SHALL preserve high precision

#### Scenario: Static method system
- **WHEN** static methods are called
- **THEN** SHALL use parseStringToMoneyValue for parsing
- **AND** SHALL create MoneyValue objects with centAmount/preciseAmount
- **AND** SHALL be independent of NumberInput formatting
- **AND** SHALL maintain UI-Kit API compatibility
