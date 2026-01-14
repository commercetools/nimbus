# Specification: LocalizedField Component

## Overview

The LocalizedField component provides a fieldset container for managing multiple locale-specific or currency-specific input fields with expand/collapse functionality and integrated validation display. It enables users to enter translations for text content across multiple languages or enter monetary amounts in multiple currencies.

**Component:** `LocalizedField`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component with internal sub-component (fieldset wrapper + locale fields)
**React Aria:** Uses `useField` from react-aria for accessibility
**Pattern:** Fieldset-based compound component with dynamic locale/currency field rendering
**i18n Messages:** 6 messages (missingRequiredField, infoBoxTriggerAriaLabel, showLanguages, hideLanguages, showCurrencies, hideCurrencies)

## Purpose

Provide a flexible, accessible container for managing localized input data across multiple locales (for text content) or currencies (for monetary values). The component coordinates expansion/collapse of locale fields, field-level and group-level validation messages, and maintains WCAG 2.1 AA compliance through proper ARIA associations and keyboard navigation patterns.

## Requirements

### Requirement: Component Structure
The component SHALL render as a fieldset with legend, input fields, toggle button, and validation message slots.

#### Scenario: Root fieldset rendering
- **WHEN** LocalizedField renders
- **THEN** SHALL use fieldset element as root container
- **AND** SHALL include legend element for group label if label prop provided
- **AND** SHALL use CSS Grid layout with grid areas: label, fields, toggle, description, error
- **AND** SHALL forward style props to root fieldset element

#### Scenario: Component hierarchy
- **WHEN** LocalizedField renders
- **THEN** SHALL render in order: label (legend), hint button (optional), fields container, toggle button, description, error
- **AND** fields container SHALL render individual LocalizedFieldLocaleField components
- **AND** each LocalizedFieldLocaleField SHALL wrap input in FormField.Root

### Requirement: Input Type Support
The component SHALL support four input types with different rendering strategies.

#### Scenario: Text input type (default)
- **WHEN** type="text" or type prop omitted
- **THEN** SHALL render TextInput components for each locale
- **AND** SHALL display locale label (e.g., "EN", "DE") in row layout
- **AND** SHALL manage values as LocalizedString object (Record<string, string>)

#### Scenario: MultiLine input type
- **WHEN** type="multiLine" is set
- **THEN** SHALL render MultilineTextInput components for each locale
- **AND** SHALL display locale label in row layout
- **AND** SHALL manage values as LocalizedString object
- **AND** SHALL support multiline text editing

#### Scenario: RichText input type
- **WHEN** type="richText" is set
- **THEN** SHALL render RichTextInput components for each locale
- **AND** SHALL display locale label in row layout
- **AND** SHALL manage values as LocalizedString object
- **AND** SHALL support rich text formatting

#### Scenario: Money input type
- **WHEN** type="money" is set
- **THEN** SHALL render MoneyInput components for each currency
- **AND** SHALL NOT display currency label (MoneyInput shows currency internally)
- **AND** SHALL manage values as LocalizedCurrency object (Record<string, MoneyInputValue>)
- **AND** SHALL use currency codes instead of locale codes as keys

### Requirement: Locale/Currency Field Management
The component SHALL dynamically render locale or currency fields based on valuesByLocaleOrCurrency.

#### Scenario: Locale field keys
- **WHEN** type is "text", "multiLine", or "richText"
- **THEN** SHALL extract locale codes from Object.keys(valuesByLocaleOrCurrency)
- **AND** SHALL sort locales with default locale first, others by language similarity
- **AND** SHALL use locale codes for field identification (e.g., "en", "de-DE", "zh-Hans")

#### Scenario: Currency field keys
- **WHEN** type="money"
- **THEN** SHALL extract currency codes from Object.keys(valuesByLocaleOrCurrency)
- **AND** SHALL sort currencies with default currency first
- **AND** SHALL use currency codes for field identification (e.g., "USD", "EUR", "JPY")

#### Scenario: Default locale/currency field rendering
- **WHEN** expanded={false} (collapsed state)
- **THEN** SHALL render only field matching defaultLocaleOrCurrency
- **AND** SHALL hide all other locale/currency fields
- **AND** SHALL show toggle button if more than one locale/currency exists

#### Scenario: Expanded field rendering
- **WHEN** expanded={true}
- **THEN** SHALL render all locale/currency fields
- **AND** fields SHALL be sorted with default first
- **AND** SHALL apply slide-from-top animation to non-first fields

#### Scenario: DisplayAllLocalesOrCurrencies mode
- **WHEN** displayAllLocalesOrCurrencies={true}
- **THEN** SHALL render all locale/currency fields on mount
- **AND** SHALL NOT render toggle button
- **AND** SHALL ignore expanded state
- **AND** SHALL always show all fields

### Requirement: Expand/Collapse Toggle
The component SHALL provide toggle button for expanding/collapsing locale/currency fields.

#### Scenario: Toggle button rendering
- **WHEN** locales/currencies count > 1 and displayAllLocalesOrCurrencies={false}
- **THEN** SHALL render Button with ghost variant, 2xs size, primary colorPalette
- **AND** SHALL display Language icon for text/multiLine/richText types
- **AND** SHALL display Payments icon for money type
- **AND** SHALL have aria-controls referencing fields container ID

#### Scenario: Toggle button label
- **WHEN** toggle button renders
- **THEN** collapsed state SHALL show "Show all languages" (text types) or "Show all currencies" (money type)
- **AND** expanded state SHALL show "Hide all languages" or "Hide all currencies"
- **AND** labels SHALL be localized via react-intl messages

#### Scenario: Toggle button interaction
- **WHEN** user clicks toggle button
- **THEN** SHALL toggle expanded state
- **AND** SHALL update aria-expanded attribute
- **AND** SHALL show/hide additional locale/currency fields
- **AND** SHALL trigger slide animation when expanding

#### Scenario: Toggle button disabled state
- **WHEN** isDisabled={true} on root component
- **THEN** toggle button SHALL be disabled
- **WHEN** field has validation errors and expanded={true}
- **THEN** toggle button SHALL be disabled to prevent hiding errors
- **AND** user SHALL NOT be able to collapse fields with visible errors

### Requirement: Individual Locale Field Structure
Each locale/currency field SHALL render as FormField.Root with coordinated layout.

#### Scenario: LocalizedFieldLocaleField rendering
- **WHEN** locale/currency field renders
- **THEN** SHALL wrap input in FormField.Root component
- **AND** SHALL use direction="row" for horizontal layout
- **AND** SHALL pass size prop to FormField and input
- **AND** SHALL pass isDisabled, isReadOnly, isInvalid, isRequired to FormField

#### Scenario: Locale field label
- **WHEN** locale field renders for text/multiLine/richText types
- **THEN** SHALL render FormField.Label with uppercase locale code (e.g., "EN", "DE-DE")
- **AND** label SHALL be styled with localeFieldLabel slot (left border radius, neutral background, box shadow)
- **AND** label SHALL use row grid layout with label in left column

#### Scenario: Currency field label
- **WHEN** locale field renders for money type
- **THEN** SHALL NOT render FormField.Label (display: none)
- **AND** MoneyInput SHALL handle currency display internally
- **AND** SHALL maintain row grid layout without label column

#### Scenario: Locale field input wrapping
- **WHEN** locale field renders input
- **THEN** SHALL wrap input in FormField.Input slot
- **AND** SHALL wrap FormField.Input in localeFieldInput slot for styling
- **AND** localeFieldInput slot SHALL apply borderLeftRadius: 0, clipPath for continuous border
- **AND** SHALL propagate value, onChange, onBlur, onFocus handlers

### Requirement: Field Identification and Attributes
The component SHALL generate unique IDs and names for each locale/currency field.

#### Scenario: Field ID generation
- **WHEN** id prop is provided on root component
- **THEN** each locale field SHALL have id formatted as `${id}.${localeOrCurrency}` (e.g., "product-name.en")
- **AND** useField hook SHALL generate unique IDs for root fieldset
- **AND** SHALL follow UI Kit compatibility pattern

#### Scenario: Field name generation
- **WHEN** name prop is provided on root component
- **THEN** each locale field SHALL have name formatted as `${name}.${localeOrCurrency}` (e.g., "name.de")
- **AND** SHALL support form submission with locale-suffixed names

#### Scenario: Data attributes propagation
- **WHEN** data-test, data-testid, or data-track-component props provided
- **THEN** each locale field SHALL have attribute formatted as `${attribute}.${localeOrCurrency}`
- **AND** SHALL support testing and analytics tracking per locale/currency

### Requirement: Value Management
The component SHALL manage localized values as structured objects.

#### Scenario: LocalizedString value structure
- **WHEN** type is "text", "multiLine", or "richText"
- **THEN** valuesByLocaleOrCurrency SHALL accept Record<string, string | undefined>
- **AND** each key SHALL be locale code (e.g., "en", "de-DE", "zh-Hans")
- **AND** each value SHALL be string content or undefined for empty field

#### Scenario: LocalizedCurrency value structure
- **WHEN** type="money"
- **THEN** valuesByLocaleOrCurrency SHALL accept Record<string, MoneyInputValue | undefined>
- **AND** each key SHALL be currency code (e.g., "USD", "EUR", "JPY")
- **AND** each value SHALL be MoneyInputValue object with amount (string) and currencyCode
- **AND** empty currency SHALL have undefined value

#### Scenario: Value change events
- **WHEN** user changes input value
- **THEN** onChange SHALL be called with LocalizedFieldChangeEvent
- **AND** event.target SHALL include: id, name, locale (for text types), currency (for money type), value
- **AND** value SHALL be string for text types or MoneyInputValue for money type
- **AND** parent component SHALL update valuesByLocaleOrCurrency with new value

### Requirement: Placeholder and Description Support
The component SHALL support per-locale placeholders, descriptions, warnings, and errors.

#### Scenario: Locale-specific placeholders
- **WHEN** placeholdersByLocaleOrCurrency prop is provided
- **THEN** SHALL pass placeholder to each locale field's input
- **AND** placeholder keys SHALL match locale/currency codes
- **AND** SHALL render placeholder in input element

#### Scenario: Locale-specific descriptions
- **WHEN** descriptionsByLocaleOrCurrency prop is provided
- **THEN** SHALL render FormField.Description for each locale field
- **AND** description keys SHALL match locale/currency codes
- **AND** SHALL associate description with input via aria-describedby

#### Scenario: Locale-specific warnings
- **WHEN** warningsByLocaleOrCurrency prop is provided
- **THEN** SHALL render warning in FormField.Description slot with warning styling
- **AND** SHALL display WarningAmber icon before warning text
- **AND** SHALL use color: warning.11
- **AND** SHALL set role="status" for screen reader announcements

#### Scenario: Locale-specific errors
- **WHEN** errorsByLocaleOrCurrency prop is provided
- **THEN** SHALL render FormField.Error for each locale field with error
- **AND** error keys SHALL match locale/currency codes
- **AND** SHALL associate error with input via aria-describedby
- **AND** SHALL only show errors when touched={true}

### Requirement: Group-Level Validation Messages
The component SHALL support fieldset-level descriptions, warnings, and errors.

#### Scenario: Group description rendering
- **WHEN** description prop is provided
- **THEN** SHALL render in description slot below fields container
- **AND** SHALL use color: neutral.11
- **AND** SHALL associate with fieldset via aria-describedby from useField

#### Scenario: Group warning rendering
- **WHEN** warning prop or warnings object is provided and touched={true}
- **THEN** SHALL render in description slot with warning styling
- **AND** SHALL display WarningAmber icon
- **AND** SHALL use color: warning.11
- **AND** SHALL set role="status"
- **AND** SHALL render FieldErrors component if warnings object provided

#### Scenario: Group error rendering
- **WHEN** error prop or errors object is provided and touched={true}
- **THEN** SHALL render in error slot below description
- **AND** SHALL display ErrorOutline icon
- **AND** SHALL use color: critical.11
- **AND** SHALL set role="alert"
- **AND** SHALL render FieldErrors component if errors object provided

#### Scenario: UI Kit compatibility warnings
- **WHEN** warnings prop (Record<string, boolean>) is provided
- **THEN** SHALL render warnings via FieldErrors component with colorPalette="warning"
- **AND** SHALL call renderWarning function for custom warning keys
- **AND** SHALL maintain backwards compatibility with UI Kit pattern

#### Scenario: UI Kit compatibility errors
- **WHEN** errors prop (Record<string, boolean>) is provided
- **THEN** SHALL render errors via FieldErrors component
- **AND** SHALL call renderError function for custom error keys
- **AND** SHALL maintain backwards compatibility with UI Kit pattern

### Requirement: Field State Management
The component SHALL manage and propagate field state to all locale/currency inputs.

#### Scenario: Required state
- **WHEN** isRequired={true} is set
- **THEN** SHALL display asterisk (*) superscript in label with aria-hidden="true"
- **AND** SHALL pass isRequired to each locale field
- **AND** each locale field SHALL pass aria-required="true" to input via localeFieldInput slot

#### Scenario: Invalid state
- **WHEN** (error or hasError) and touched={true}
- **THEN** isInvalid SHALL be true
- **AND** SHALL pass isInvalid to each locale field
- **AND** each locale field SHALL display error styling
- **AND** SHALL render group-level error messages

#### Scenario: Disabled state
- **WHEN** isDisabled={true} is set
- **THEN** SHALL pass isDisabled to each locale field
- **AND** each input SHALL be disabled
- **AND** locale field labels SHALL have opacity: 0.5 via data-disabled attribute
- **AND** toggle button SHALL be disabled

#### Scenario: Read-only state
- **WHEN** isReadOnly={true} is set
- **THEN** SHALL pass isReadOnly to each locale field
- **AND** each input SHALL be read-only (focusable but not editable)

#### Scenario: Auto-expand on validation errors
- **WHEN** errorsByLocaleOrCurrency contains errors for non-default locales and touched={true}
- **THEN** SHALL automatically set expanded={true}
- **AND** SHALL ensure all errored fields are visible
- **AND** SHALL disable toggle button to prevent hiding errors
- **AND** SHALL maintain expanded state until errors are resolved

### Requirement: Label and Info Box Support
The component SHALL provide fieldset legend with optional info box popover.

#### Scenario: Label rendering
- **WHEN** label prop is provided
- **THEN** SHALL render legend element with label text
- **AND** SHALL use fontWeight: 500, color: neutral.11
- **AND** SHALL apply size-based typography via CSS variables
- **AND** SHALL associate with fieldset semantically

#### Scenario: Required indicator
- **WHEN** label and isRequired={true} are provided
- **THEN** SHALL display asterisk (*) as superscript after label text
- **AND** asterisk SHALL have aria-hidden="true" (decorative)
- **AND** SHALL use inline-flex with top alignment

#### Scenario: Info box button rendering
- **WHEN** hint prop is provided
- **THEN** SHALL render IconButton with HelpOutline icon next to label
- **AND** button SHALL use size="2xs", variant="link", colorPalette="info"
- **AND** button SHALL have aria-label from infoBoxTriggerAriaLabel message ("more info")
- **AND** button SHALL have unique ID associated with fieldset via aria-details

#### Scenario: Info box popover display
- **WHEN** user clicks info button
- **THEN** SHALL open React Aria DialogTrigger with Popover
- **AND** popover SHALL render hint content inside Dialog
- **AND** popover SHALL use infoDialog slot styling (bg: neutral.1, maxWidth: xl, boxShadow: 6)
- **AND** popover SHALL have maxHeight: 40svh with overflow: auto
- **AND** popover SHALL have focusRing: outside

#### Scenario: Info box keyboard interaction
- **WHEN** user tabs to info button and presses Enter/Space
- **THEN** SHALL open popover and move focus to dialog
- **WHEN** user presses Escape in popover
- **THEN** SHALL close popover and return focus to info button

### Requirement: Layout and Sizing
The component SHALL support size variants that affect typography per nimbus-core standards.

#### Scenario: Medium size (default)
- **WHEN** size="md" or no size specified
- **THEN** SHALL set --localized-field-font-size: fontSizes.350 (14px)
- **AND** SHALL set --localized-field-line-height: lineHeights.500 (20px)
- **AND** label, description, and error SHALL use these CSS variables

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** SHALL set --localized-field-font-size: fontSizes.300 (13px)
- **AND** SHALL set --localized-field-line-height: lineHeights.450 (18px)
- **AND** SHALL pass size="sm" to all locale field inputs

#### Scenario: Size propagation
- **WHEN** size is set on root component
- **THEN** size SHALL affect typography of label, description, error
- **AND** SHALL pass size to FormField.Root and input components
- **AND** inputs SHALL render at appropriate size

### Requirement: Multi-Slot Recipe Styling
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot recipe registration
- **WHEN** component renders
- **THEN** SHALL use localizedField slot recipe from theme/slot-recipes/localized-field.ts
- **AND** recipe SHALL be manually registered in theme config
- **AND** SHALL style: root, label, infoDialog, fieldsContainer, description, error, toggleButtonContainer slots
- **AND** SHALL style: localeFieldRoot, localeFieldLabel, localeFieldInput slots

#### Scenario: Root slot styling
- **WHEN** root slot renders
- **THEN** SHALL apply display: grid, width: auto
- **AND** SHALL define grid-template-areas: "label", "fields", "toggle", "description", "error"
- **AND** SHALL apply gap: 100 (4px)

#### Scenario: FieldsContainer slot styling
- **WHEN** fieldsContainer slot renders
- **THEN** SHALL apply display: flex, flexDirection: column, gap: 200 (8px)
- **AND** SHALL apply slide-from-top animation to non-first children when expanded
- **AND** animation SHALL use animationDuration: slow, animationTimingFunction: ease-in-smooth

#### Scenario: LocaleFieldRoot slot styling
- **WHEN** localeFieldRoot slot renders
- **THEN** SHALL apply gap: 0, gridTemplateAreas: "label input", "description description", "error error"
- **AND** SHALL use :has() selector to apply focus ring to localeFieldLabel when input is focused
- **AND** focus ring SHALL use CSS variables from theme

#### Scenario: LocaleFieldLabel slot styling
- **WHEN** localeFieldLabel slot renders
- **THEN** SHALL apply borderLeftRadius: 200, backgroundColor: neutral.1
- **AND** SHALL apply boxShadow: inset box-shadow for border effect
- **AND** SHALL use clipPath: inset(-4px -1px -4px -4px) to hide right outline
- **AND** SHALL use marginInlineEnd: -25 for continuous border with input

#### Scenario: LocaleFieldInput slot styling
- **WHEN** localeFieldInput slot renders
- **THEN** SHALL apply borderLeftRadius: 0
- **AND** SHALL use clipPath: inset(-4px -4px -4px -1px) to hide left outline
- **AND** SHALL create continuous border appearance with label

#### Scenario: Design token usage
- **WHEN** any slot renders
- **THEN** SHALL use design tokens from @commercetools/nimbus-tokens
- **AND** SHALL NOT use hardcoded colors, spacing, or typography values
- **AND** SHALL support light and dark mode via semantic tokens

### Requirement: ARIA Associations and Accessibility
The component SHALL provide comprehensive ARIA attributes per nimbus-core standards.

#### Scenario: Fieldset labeling
- **WHEN** label is provided
- **THEN** useField SHALL associate legend with fieldset semantically
- **AND** legend element SHALL serve as accessible name for fieldset

#### Scenario: Fieldset description association
- **WHEN** description is provided
- **THEN** useField SHALL generate unique description ID
- **AND** fieldset SHALL receive aria-describedby referencing description ID

#### Scenario: Fieldset error association
- **WHEN** error is provided and isInvalid={true}
- **THEN** useField SHALL generate unique error ID
- **AND** fieldset SHALL receive aria-describedby referencing error ID
- **AND** error element SHALL have role="alert"

#### Scenario: Info box association
- **WHEN** hint is provided
- **THEN** fieldset SHALL have aria-details referencing info button ID
- **AND** info button SHALL have unique ID via useId
- **AND** clicking button SHALL open dialog with hint content

#### Scenario: Toggle button ARIA
- **WHEN** toggle button renders
- **THEN** SHALL have aria-controls referencing fieldsContainer ID
- **AND** SHALL have aria-describedby referencing label ID
- **AND** SHALL have aria-expanded matching expanded state (true/false)

#### Scenario: Locale field ARIA
- **WHEN** locale field renders
- **THEN** FormField SHALL provide aria-labelledby, aria-describedby, aria-errormessage to input
- **AND** localeFieldInput slot SHALL set aria-required on input element
- **AND** ARIA associations SHALL work correctly with FormField's useField hook

### Requirement: Keyboard Navigation
The component SHALL support comprehensive keyboard interactions per nimbus-core standards.

#### Scenario: Tab navigation
- **WHEN** user presses Tab key
- **THEN** SHALL follow order: previous element → info button (if present) → first locale input → additional locale inputs (if expanded) → toggle button → next element
- **AND** SHALL maintain logical tab order in forms

#### Scenario: Legend click behavior
- **WHEN** user clicks legend/label element
- **THEN** SHALL NOT focus any input (fieldset legends are not focusable)
- **AND** SHALL not interfere with info button interaction

#### Scenario: Toggle keyboard interaction
- **WHEN** toggle button is focused and Enter/Space pressed
- **THEN** SHALL expand or collapse fields
- **AND** SHALL update aria-expanded attribute
- **AND** SHALL maintain focus on toggle button
- **AND** newly revealed fields SHALL be in tab order on next Tab press

#### Scenario: Input field navigation
- **WHEN** user tabs through locale fields
- **THEN** SHALL move focus to next locale field input
- **AND** SHALL skip non-rendered collapsed fields
- **AND** SHALL support Shift+Tab for reverse navigation

### Requirement: Locale Sorting and Display
The component SHALL sort and display locale/currency fields intelligently.

#### Scenario: Locale sorting by language similarity
- **WHEN** type is "text", "multiLine", or "richText"
- **THEN** SHALL sort locales with defaultLocaleOrCurrency first
- **AND** SHALL group locales by language similarity to default locale's language
- **AND** "en-US" default with locales ["de", "en-GB", "fr", "en-CA"] SHALL sort as: ["en-US", "en-GB", "en-CA", "de", "fr"]

#### Scenario: Currency sorting
- **WHEN** type="money"
- **THEN** SHALL sort currencies with defaultLocaleOrCurrency first
- **AND** SHALL maintain remaining currencies in stable order
- **AND** currency sorting SHALL use sortCurrencies utility

#### Scenario: Dynamic locale field collection
- **WHEN** component renders
- **THEN** SHALL use React Aria Collection for locale field iteration
- **AND** SHALL pass allDataForFields array to Collection items prop
- **AND** Collection SHALL render LocalizedFieldLocaleField for each item

### Requirement: Event Handlers
The component SHALL provide change, blur, and focus handlers per locale/currency.

#### Scenario: Change event handling
- **WHEN** user changes input value in locale field
- **THEN** onChange handler SHALL be called with LocalizedFieldChangeEvent
- **AND** event.target.locale SHALL be set for text types (e.g., "en", "de-DE")
- **AND** event.target.currency SHALL be set for money type (e.g., "USD", "EUR")
- **AND** event.target.value SHALL be string (text types) or MoneyInputValue (money type)
- **AND** event.target.id and event.target.name SHALL include locale/currency suffix

#### Scenario: Blur event handling
- **WHEN** user blurs input in locale field
- **THEN** onBlur handler SHALL be called with (event, localeOrCurrency)
- **AND** event SHALL be FocusEvent or CustomEvent (for MoneyInput)
- **AND** localeOrCurrency SHALL be string locale/currency code

#### Scenario: Focus event handling
- **WHEN** user focuses input in locale field
- **THEN** onFocus handler SHALL be called with (event, localeOrCurrency)
- **AND** event SHALL be FocusEvent or CustomEvent
- **AND** localeOrCurrency SHALL be string locale/currency code

#### Scenario: AutoFocus support
- **WHEN** autoFocus={true} is set
- **THEN** SHALL pass autoFocus to default locale/currency field only
- **AND** default locale/currency input SHALL receive focus on mount

### Requirement: Form Integration
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** LocalizedField is inside a form element
- **THEN** each locale field input SHALL participate in form submission
- **AND** SHALL include locale field values in form data using locale-suffixed names
- **AND** form data SHALL contain entries like "name.en", "name.de", etc.

#### Scenario: Form validation trigger
- **WHEN** form validation runs
- **THEN** LocalizedField SHALL respond to isInvalid and touched state changes
- **AND** SHALL display error messages if validation fails
- **AND** SHALL visually indicate invalid state via input styling
- **AND** SHALL auto-expand to show all errored fields

### Requirement: Utility Methods
The component SHALL provide static utility methods for backwards compatibility with UI Kit.

#### Scenario: getId and getName methods
- **WHEN** LocalizedField.getId(id, locale) or LocalizedField.getName(name, locale) is called
- **THEN** SHALL return formatted string: `${id}.${locale}` or `${name}.${locale}`
- **AND** SHALL maintain UI Kit compatibility pattern

#### Scenario: isEmpty method
- **WHEN** LocalizedField.isEmpty(values) is called
- **THEN** SHALL return true if all locale/currency values are empty or undefined
- **AND** SHALL return false if any locale has non-empty value

#### Scenario: isTouched method
- **WHEN** LocalizedField.isTouched(touched) is called
- **THEN** SHALL return true if touched parameter is truthy
- **AND** SHALL maintain UI Kit compatibility pattern

#### Scenario: createLocalizedString method
- **WHEN** LocalizedField.createLocalizedString(locales) is called
- **THEN** SHALL return LocalizedString object with empty strings for each locale
- **AND** SHALL initialize structure for valuesByLocaleOrCurrency

#### Scenario: omitEmptyTranslations method
- **WHEN** LocalizedField.omitEmptyTranslations(values) is called
- **THEN** SHALL return new object with empty/undefined values removed
- **AND** SHALL preserve non-empty values

#### Scenario: Money utility methods
- **WHEN** LocalizedField.convertToMoneyValues, parseMoneyValues, getHighPrecisionCurrencies, or getEmptyCurrencies is called
- **THEN** SHALL provide money value conversion utilities
- **AND** SHALL maintain UI Kit compatibility for money input handling

#### Scenario: RequiredValueErrorMessage method
- **WHEN** LocalizedField.RequiredValueErrorMessage is called
- **THEN** SHALL return standard error message component for required field validation
- **AND** SHALL use missingRequiredField i18n message

#### Scenario: toFieldErrors method
- **WHEN** LocalizedField.toFieldErrors(errors) is called
- **THEN** SHALL convert error data to field error format
- **AND** SHALL maintain UI Kit compatibility pattern

### Requirement: Internationalization
The component SHALL provide localized messages per nimbus-core standards.

#### Scenario: i18n message definition
- **WHEN** component uses messages
- **THEN** messages SHALL be defined in localized-field.i18n.ts
- **AND** SHALL use react-intl's defineMessages API
- **AND** SHALL follow naming: Nimbus.LocalizedField.{messageKey}

#### Scenario: Toggle button messages
- **WHEN** toggle button renders
- **THEN** SHALL use showLanguages/hideLanguages messages for text types
- **AND** SHALL use showCurrencies/hideCurrencies messages for money type
- **AND** messages SHALL be formatted via useIntl().formatMessage()

#### Scenario: Info box aria-label message
- **WHEN** info button renders
- **THEN** SHALL use infoBoxTriggerAriaLabel message for aria-label
- **AND** message SHALL be localized in 5 supported locales (en, de, es, fr-FR, pt-BR)

#### Scenario: Required field error message
- **WHEN** RequiredValueErrorMessage utility is used
- **THEN** SHALL use missingRequiredField message
- **AND** message SHALL default to "This field is required. Provide at least one value."

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive type definitions per nimbus-core standards.

#### Scenario: Props types
- **WHEN** component is authored
- **THEN** SHALL export LocalizedFieldProps interface
- **AND** SHALL export slot props interfaces for all 10 slots
- **AND** SHALL export LocalizedFieldLocaleFieldProps interface
- **AND** all slot props SHALL extend HTMLChakraProps with appropriate element type

#### Scenario: Recipe props
- **WHEN** LocalizedField is used
- **THEN** SHALL accept size prop: "sm" | "md" with autocomplete
- **AND** SHALL accept type prop: "text" | "multiLine" | "richText" | "money" with autocomplete
- **AND** types SHALL derive from SlotRecipeProps<"localizedField">

#### Scenario: Value structure types
- **WHEN** LocalizedField is used
- **THEN** SHALL export LocalizedString type: Record<string, string | undefined>
- **AND** SHALL export LocalizedCurrency type: Record<string, MoneyInputValue | undefined>
- **AND** SHALL export LocaleFieldData type: Record<string, ReactNode>
- **AND** valuesByLocaleOrCurrency SHALL accept LocalizedString | LocalizedCurrency union

#### Scenario: Event types
- **WHEN** onChange handler is used
- **THEN** SHALL export LocalizedFieldChangeEvent interface
- **AND** event.target SHALL include: id?, name?, locale?, currency?, value
- **AND** value SHALL be string | MoneyInputValue based on type

#### Scenario: Internal types
- **WHEN** component manages internal data
- **THEN** SHALL define MergedLocaleFieldData type for coordinating locale field data
- **AND** type SHALL include: localeOrCurrency, inputValue, placeholder, description, warning, error, autoFocus

### Requirement: Accessibility Compliance
The component SHALL meet WCAG 2.1 AA standards per nimbus-core standards.

#### Scenario: Screen reader support
- **WHEN** screen reader user navigates to fieldset
- **THEN** SHALL announce legend text as group label
- **AND** SHALL announce "group" role from fieldset element
- **AND** SHALL announce each locale field label and input
- **AND** SHALL announce field-level and group-level descriptions/errors

#### Scenario: Fieldset semantics
- **WHEN** component renders
- **THEN** SHALL use fieldset element for semantic grouping
- **AND** SHALL use legend element for group label
- **AND** screen readers SHALL announce related fields as grouped

#### Scenario: Focus indicators
- **WHEN** input or button receives focus
- **THEN** SHALL display visible focus indicator
- **AND** locale field labels SHALL show focus ring when input is focused (via :has() selector)
- **AND** focus ring SHALL meet 3:1 contrast ratio requirement
- **AND** focus ring SHALL use CSS variables: --focus-ring-width, --focus-ring-color, --focus-ring-style, --focus-ring-offset

#### Scenario: Color contrast
- **WHEN** component renders
- **THEN** label SHALL meet 4.5:1 contrast ratio (neutral.11 on background)
- **AND** description SHALL meet 4.5:1 contrast ratio
- **AND** error SHALL meet 4.5:1 contrast ratio (critical.11 on background)
- **AND** warning SHALL meet 4.5:1 contrast ratio (warning.11 on background)
- **AND** info button icon SHALL meet 3:1 contrast ratio

#### Scenario: Touch targets
- **WHEN** component renders on touch device
- **THEN** info button SHALL meet minimum 44x44px touch target (via IconButton size="2xs")
- **AND** toggle button SHALL meet touch target requirements (via Button size="2xs")
- **AND** input elements SHALL meet touch target requirements (via input component sizing)

### Requirement: Responsive Design
The component SHALL support responsive design patterns per nimbus-core standards.

#### Scenario: Responsive size
- **WHEN** size prop uses responsive syntax
- **THEN** SHALL support: size={{ base: "sm", md: "md" }}
- **AND** SHALL apply appropriate typography at each breakpoint
- **AND** SHALL update CSS variables at each breakpoint
- **AND** SHALL pass responsive size to input components

#### Scenario: Mobile layout considerations
- **WHEN** component renders on mobile viewport
- **THEN** SHALL maintain usable touch targets
- **AND** SHALL stack locale fields vertically in fieldsContainer
- **AND** grid layout SHALL be flexible for small screens

### Requirement: Style Props Support
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Root style props
- **WHEN** style props are passed to LocalizedField
- **THEN** SHALL forward to root fieldset element
- **AND** SHALL support spacing props (margin, padding)
- **AND** SHALL support layout props (width, maxWidth)
- **AND** SHALL support color props (bg, color)

#### Scenario: Style props merging
- **WHEN** style props conflict with recipe styles
- **THEN** style props SHALL take precedence
- **AND** SHALL merge with recipe styles appropriately

### Requirement: JSDoc Documentation
The component SHALL provide comprehensive JSDoc per nimbus-core standards.

#### Scenario: Component documentation
- **WHEN** component is authored
- **THEN** LocalizedField SHALL have JSDoc block with description
- **AND** SHALL include @example tag with usage code
- **AND** SHALL document utility methods and their purposes
- **AND** SHALL reference UI Kit compatibility

#### Scenario: Props documentation
- **WHEN** types are defined in localized-field.types.ts
- **THEN** all props SHALL have JSDoc comments
- **AND** SHALL describe prop purpose and behavior
- **AND** SHALL document type-specific differences (text vs money)
- **AND** SHALL note UI Kit compatibility props

### Requirement: React Aria Integration
The component SHALL use React Aria for accessibility per nimbus-core standards.

#### Scenario: useField hook usage
- **WHEN** LocalizedField root initializes
- **THEN** SHALL call useField hook with id, label, description, errorMessage, isInvalid
- **AND** SHALL receive labelProps, fieldProps, descriptionProps, errorMessageProps
- **AND** SHALL apply returned props to appropriate slot elements

#### Scenario: Collection usage
- **WHEN** rendering locale fields
- **THEN** SHALL use React Aria Collection component
- **AND** SHALL pass allDataForFields array to items prop
- **AND** Collection SHALL optimize rendering for dynamic lists

#### Scenario: DialogTrigger usage
- **WHEN** info box renders
- **THEN** SHALL use React Aria DialogTrigger component
- **AND** SHALL coordinate trigger button and popover dialog
- **AND** SHALL manage focus and keyboard interaction automatically

### Requirement: Display Names
The component SHALL set display names per nimbus-core standards.

#### Scenario: Component display names
- **WHEN** components are defined
- **THEN** LocalizedField SHALL have displayName: "LocalizedField"
- **AND** LocalizedFieldLocaleField SHALL have displayName: "LocalizedFieldLocaleField"
- **AND** display names SHALL aid debugging and React DevTools inspection

### Requirement: Animation Support
The component SHALL provide smooth animations for expand/collapse interactions.

#### Scenario: Expansion animation
- **WHEN** fields expand from collapsed state
- **THEN** newly visible locale fields SHALL animate with slide-from-top animation
- **AND** animation SHALL use animationDuration: slow token
- **AND** animation SHALL use animationTimingFunction: ease-in-smooth
- **AND** first field (default locale) SHALL NOT animate (already visible)

#### Scenario: Animation state tracking
- **WHEN** fieldsContainer renders
- **THEN** SHALL set data-expanded="true" attribute when expanded
- **AND** CSS selector `&[data-expanded="true"]` SHALL trigger animation on children
- **AND** animation SHALL only apply to non-first children (& > *:not(:first-of-type))
