# Specification: FieldErrors Component

## Overview

The FieldErrors component provides standardized error message rendering for form
validation scenarios. It translates error objects into user-facing error
messages with built-in internationalization support, custom message overrides,
and flexible rendering strategies.

**Component:** `FieldErrors` **Package:** `@commercetools/nimbus` **Type:**
Utility component (error message renderer) **React Aria:** None (presentational
component) **Pattern:** Error object to message rendering with i18n

## Purpose

Provide a reusable error message rendering component that handles common
validation errors with built-in localized messages while supporting custom error
messages and renderers. Ensures consistent error presentation across all form
inputs in the Nimbus design system while maintaining backwards compatibility
with UI-Kit patterns.

## Requirements

### Requirement: Error Object Structure

The component SHALL accept error objects that map error keys to boolean values.

#### Scenario: Error object validation

- **WHEN** errors prop is provided
- **THEN** SHALL accept Record<string, boolean> type
- **AND** SHALL filter errors to only show keys with truthy values
- **AND** SHALL ignore errors with falsy values
- **AND** SHALL render nothing if all error values are false

#### Scenario: Invalid error object handling

- **WHEN** errors prop is not an object or is null/undefined
- **THEN** SHALL not render any content
- **AND** SHALL not throw runtime errors
- **AND** SHALL gracefully handle non-object values

#### Scenario: Empty error object

- **WHEN** errors object has no entries
- **THEN** SHALL not render any content
- **AND** SHALL return null from component

### Requirement: Built-in Error Types

The component SHALL provide 15 standardized error types with localized messages
per nimbus-core standards.

#### Scenario: Basic validation errors

- **WHEN** error keys missing, invalid, or empty are truthy
- **THEN** missing SHALL render "This field is required. Provide a value."
- **AND** invalid SHALL render "The provided value is invalid."
- **AND** empty SHALL render "This field cannot be empty."
- **AND** messages SHALL be localized via plain TypeScript objects

#### Scenario: Length validation errors

- **WHEN** error keys min or max are truthy
- **THEN** min SHALL render "This value is too short."
- **AND** max SHALL render "This value is too long."
- **AND** messages SHALL be localized via plain TypeScript objects

#### Scenario: Format validation errors

- **WHEN** error keys format or duplicate are truthy
- **THEN** format SHALL render "Please enter a valid format."
- **AND** duplicate SHALL render "This value is already in use. It must be
  unique."
- **AND** messages SHALL be localized via plain TypeScript objects

#### Scenario: Numeric validation errors

- **WHEN** error keys negative, fractions, belowMin, aboveMax, or outOfRange are
  truthy
- **THEN** negative SHALL render "Negative number is not supported."
- **AND** fractions SHALL render "A whole number is required."
- **AND** belowMin SHALL render "Value must be greater than or equal to the
  minimum."
- **AND** aboveMax SHALL render "Value must be less than or equal to the
  maximum."
- **AND** outOfRange SHALL render "Value must be within the acceptable range."
- **AND** messages SHALL be localized via plain TypeScript objects

#### Scenario: Server validation errors

- **WHEN** error keys invalidFromServer, notFound, or blocked are truthy
- **THEN** invalidFromServer SHALL render "Server validation failed. Please
  check your input."
- **AND** notFound SHALL render "The requested resource was not found."
- **AND** blocked SHALL render "This value is not allowed."
- **AND** messages SHALL be localized via plain TypeScript objects

### Requirement: Error Type Constants

The component SHALL export error type constants for type-safe usage.

#### Scenario: FieldErrorTypes object

- **WHEN** component is imported
- **THEN** SHALL export FieldErrors.errorTypes object
- **AND** SHALL include all 15 error type constants
- **AND** constants SHALL map to string keys (MISSING → "missing", MIN_LENGTH →
  "min", etc.)
- **AND** SHALL provide TypeScript type safety for error keys

#### Scenario: Error type usage

- **WHEN** consumers use FieldErrors.errorTypes
- **THEN** SHALL prevent typos via constant usage
- **AND** SHALL support autocomplete in IDEs
- **AND** values SHALL match error object keys exactly

### Requirement: Custom Message Overrides

The component SHALL support custom messages for built-in error types via
customMessages prop.

#### Scenario: Custom message for built-in error type

- **WHEN** customMessages prop includes key matching built-in error type
- **THEN** SHALL render custom message instead of built-in message
- **AND** SHALL support React nodes (strings, elements, formatted messages)
- **AND** SHALL use custom message even if renderError and renderDefaultError
  are not provided

#### Scenario: Multiple custom messages

- **WHEN** customMessages provides multiple overrides
- **THEN** SHALL apply each custom message to corresponding error key
- **AND** SHALL fall back to built-in messages for keys not in customMessages
- **AND** SHALL render each error in separate FieldErrorsMessage slot

#### Scenario: Custom message with variable content

- **WHEN** customMessages includes React nodes with dynamic content
- **THEN** SHALL render provided React node as-is
- **AND** SHALL support formatted messages with variable interpolation
- **AND** SHALL support any valid React children

### Requirement: Custom Error Renderer

The component SHALL support custom error rendering via renderError prop.

#### Scenario: Custom error renderer execution

- **WHEN** renderError prop is provided
- **THEN** SHALL call renderError for each active error
- **AND** SHALL pass error key and error value as arguments
- **AND** SHALL use returned content if not null
- **AND** SHALL skip to next renderer if null returned

#### Scenario: Custom renderer priority

- **WHEN** both renderError and customMessages/built-in messages exist
- **THEN** renderError SHALL take highest priority
- **AND** SHALL only use customMessages/built-in if renderError returns null
- **AND** SHALL wrap rendered content in FieldErrorsMessage slot

#### Scenario: Custom renderer for non-built-in errors

- **WHEN** error key does not match built-in error types
- **THEN** renderError SHALL be called for unknown keys
- **AND** SHALL render returned content if provided
- **AND** SHALL render nothing if renderError returns null and no other renderer
  handles key

### Requirement: Default Error Renderer

The component SHALL support fallback error rendering via renderDefaultError
prop.

#### Scenario: Default renderer execution order

- **WHEN** renderDefaultError prop is provided
- **THEN** SHALL call renderDefaultError after renderError returns null
- **AND** SHALL call before checking customMessages
- **AND** SHALL use returned content if not null
- **AND** SHALL skip to customMessages/built-in if null returned

#### Scenario: Renderer priority chain

- **WHEN** multiple rendering strategies are configured
- **THEN** rendering SHALL follow priority: renderError → renderDefaultError →
  customMessages → built-in messages
- **AND** SHALL use first non-null result in chain
- **AND** SHALL render nothing if all strategies return null for given key

#### Scenario: Default renderer for mixed error types

- **WHEN** renderDefaultError handles some keys but not others
- **THEN** SHALL use renderDefaultError for handled keys
- **AND** SHALL fall back to customMessages for unhandled keys
- **AND** SHALL fall back to built-in messages if no custom message exists

### Requirement: Error Visibility Control

The component SHALL support visibility control via isVisible prop per
nimbus-core standards.

#### Scenario: Visible errors

- **WHEN** isVisible={true} or isVisible is not provided
- **THEN** SHALL render all active errors
- **AND** SHALL display error container with role="alert"
- **AND** default value SHALL be true for backwards compatibility

#### Scenario: Hidden errors

- **WHEN** isVisible={false}
- **THEN** SHALL not render any content
- **AND** SHALL return null from component
- **AND** SHALL not render error container in DOM

#### Scenario: Visibility with form state

- **WHEN** isVisible is controlled by form touch state
- **THEN** SHALL support toggling visibility based on user interaction
- **AND** SHALL show errors only after field has been touched
- **AND** SHALL integrate with form validation patterns

### Requirement: Multi-Slot Recipe Styling

The component SHALL use multi-slot recipe for styling per nimbus-core standards.

#### Scenario: Slot recipe registration

- **WHEN** component renders
- **THEN** SHALL use fieldErrors slot recipe from
  theme/slot-recipes/field-errors.ts
- **AND** recipe SHALL be manually registered in theme config
- **AND** SHALL style root and message slots

#### Scenario: Root slot styling

- **WHEN** root slot renders
- **THEN** SHALL apply display: block
- **AND** SHALL set colorPalette: "critical" by default
- **AND** SHALL support colorPalette override (e.g., "warning" for warnings)
- **AND** SHALL forward style props to root slot

#### Scenario: Message slot styling

- **WHEN** message slot renders
- **THEN** SHALL apply color: colorPalette.11 (critical.11 by default)
- **AND** each error SHALL render in separate message slot
- **AND** SHALL inherit styling from parent color palette

#### Scenario: Design token usage

- **WHEN** component renders
- **THEN** SHALL use design tokens from @commercetools/nimbus-tokens
- **AND** SHALL NOT use hardcoded colors or spacing
- **AND** SHALL support light and dark mode via semantic tokens

### Requirement: ARIA Accessibility

The component SHALL provide appropriate ARIA attributes per nimbus-core
standards.

#### Scenario: Alert role

- **WHEN** errors are visible
- **THEN** root element SHALL have role="alert"
- **AND** SHALL announce errors to screen readers when first displayed
- **AND** SHALL support live region announcements

#### Scenario: Alternative ARIA roles

- **WHEN** role prop is provided (e.g., role="status")
- **THEN** SHALL use provided role instead of "alert"
- **AND** SHALL support "status" for less urgent messages (warnings)
- **AND** SHALL maintain appropriate semantics for screen readers

#### Scenario: Error announcement timing

- **WHEN** errors change from none to present
- **THEN** screen readers SHALL announce new errors via live region
- **AND** SHALL not announce when component initially renders with errors
- **AND** SHALL follow ARIA live region best practices

### Requirement: FormField Integration

The component SHALL integrate seamlessly with FormField component.

#### Scenario: FormField.Error usage

- **WHEN** FieldErrors is placed inside FormField.Error
- **THEN** SHALL render only when FormField.Root isInvalid={true}
- **AND** SHALL be associated with input via aria-describedby
- **AND** SHALL coordinate with FormField error styling

#### Scenario: Multiple error display

- **WHEN** multiple errors are active
- **THEN** SHALL render all active errors in DOM
- **AND** each error SHALL be wrapped in separate message slot
- **AND** SHALL maintain vertical stacking layout

#### Scenario: FormField touch state integration

- **WHEN** used with FormField controlled by touch state
- **THEN** isVisible prop SHALL control when errors appear
- **AND** SHALL show errors only after field touched
- **AND** SHALL support validation-on-blur patterns

### Requirement: Internationalization Support

The component SHALL provide full i18n support via plain TypeScript objects per
nimbus-core standards.

#### Scenario: Message definitions

- **WHEN** component is authored
- **THEN** SHALL define messages in field-errors.i18n.ts
- **AND** SHALL define messages as plain TypeScript objects
- **AND** message IDs SHALL follow format: Nimbus.FieldErrors.{messageKey}
- **AND** SHALL include description for each message

#### Scenario: Message compilation

- **WHEN** messages are defined
- **THEN** messages SHALL be extracted to @commercetools/nimbus-i18n
- **AND** SHALL be compiled to AST format for runtime
- **AND** SHALL support 5 locales (en, de, es, fr-FR, pt-BR)
- **AND** extraction SHALL run via `pnpm extract-intl`

#### Scenario: Message formatting

- **WHEN** built-in messages render
- **THEN** SHALL use useLocalizedStringFormatter hook
- **AND** SHALL call msg.format() to format messages according to current locale
- **AND** SHALL support message interpolation if needed in future

### Requirement: TypeScript Type Safety

The component SHALL provide comprehensive type definitions per nimbus-core
standards.

#### Scenario: Props types

- **WHEN** component is authored
- **THEN** SHALL export FieldErrorsProps interface
- **AND** SHALL export FieldErrorsRootSlotProps, FieldErrorsMessageSlotProps
- **AND** all props SHALL include JSDoc comments
- **AND** SHALL support style props via HTMLChakraProps

#### Scenario: Error data types

- **WHEN** errors prop is typed
- **THEN** SHALL define FieldErrorsData as Record<string, boolean>
- **AND** SHALL provide TErrorRenderer type for render functions
- **AND** SHALL export TFieldErrorTypes for error type constants

#### Scenario: Recipe props types

- **WHEN** component accepts style variants
- **THEN** types SHALL derive from SlotRecipeProps<"fieldErrors">
- **AND** SHALL support colorPalette prop with autocomplete
- **AND** SHALL support responsive style prop syntax

### Requirement: Component API

The component SHALL provide consistent API patterns per nimbus-core standards.

#### Scenario: Props interface

- **WHEN** FieldErrors is used
- **THEN** SHALL accept errors prop: Record<string, boolean> | undefined
- **AND** SHALL accept isVisible prop: boolean (default: true)
- **AND** SHALL accept renderError prop: TErrorRenderer | undefined
- **AND** SHALL accept renderDefaultError prop: TErrorRenderer | undefined
- **AND** SHALL accept customMessages prop: object with 15 optional keys
- **AND** SHALL accept id prop: string | undefined
- **AND** SHALL accept colorPalette prop: string (default: "critical")
- **AND** SHALL accept role prop: string (default: "alert")
- **AND** SHALL accept style props via HTMLChakraProps spreading

#### Scenario: Static properties

- **WHEN** FieldErrors component is imported
- **THEN** SHALL expose FieldErrors.errorTypes object
- **AND** SHALL expose FieldErrors.getBuiltInMessage function (for testing)
- **AND** SHALL expose FieldErrors.getCustomMessage function (for testing)
- **AND** SHALL set displayName: "FieldErrors"

#### Scenario: Ref forwarding

- **WHEN** ref is needed
- **THEN** SHALL NOT require ref forwarding (presentational component)
- **AND** root slot SHALL render as div element
- **AND** consumers MAY wrap in forwardRef wrapper if needed

### Requirement: Error Message Rendering Strategy

The component SHALL follow a defined priority order for error message
resolution.

#### Scenario: Rendering priority chain

- **WHEN** multiple rendering strategies are available for same error
- **THEN** SHALL check renderError first and use result if not null
- **AND** SHALL check renderDefaultError second if renderError returned null
- **AND** SHALL check customMessages third if renderDefaultError returned null
- **AND** SHALL use built-in message fourth if no custom message exists
- **AND** SHALL render nothing if all strategies return null

#### Scenario: Partial error handling

- **WHEN** errors object contains mix of handled and unhandled keys
- **THEN** SHALL render messages for all handled keys
- **AND** SHALL skip rendering for keys with no handler
- **AND** SHALL not throw errors for unhandled keys

#### Scenario: Error iteration

- **WHEN** errors object contains multiple truthy errors
- **THEN** SHALL iterate through Object.entries(errors)
- **AND** SHALL filter to only truthy values
- **AND** SHALL render each error in order
- **AND** SHALL use error key as React key for message elements

### Requirement: Display Name

The component SHALL set display name per nimbus-core standards.

#### Scenario: Component display name

- **WHEN** component is defined
- **THEN** SHALL set displayName: "FieldErrors"
- **AND** SHALL aid debugging in React DevTools
- **AND** SHALL appear in error stack traces

### Requirement: JSDoc Documentation

The component SHALL provide comprehensive JSDoc per nimbus-core standards.

#### Scenario: Component documentation

- **WHEN** component is authored
- **THEN** SHALL include JSDoc block with description
- **AND** SHALL document error object structure
- **AND** SHALL explain rendering priority chain
- **AND** SHALL include @see tag linking to online docs
- **AND** SHALL include @supportsStyleProps annotation

#### Scenario: Props documentation

- **WHEN** types are defined in field-errors.types.ts
- **THEN** all props SHALL have JSDoc comments
- **AND** SHALL include @default tags for default values
- **AND** SHALL describe prop purpose and behavior
- **AND** customMessages object properties SHALL each have JSDoc

### Requirement: Backwards Compatibility

The component SHALL maintain backwards compatibility with UI-Kit FieldErrors.

#### Scenario: UI-Kit API compatibility

- **WHEN** migrating from UI-Kit
- **THEN** SHALL support same error object structure
- **AND** SHALL support same error type constants
- **AND** SHALL support renderError and renderDefaultError props
- **AND** isVisible prop SHALL default to true

#### Scenario: Error type constant export

- **WHEN** consuming code uses FieldErrors.errorTypes
- **THEN** SHALL provide FieldErrorTypes object at FieldErrors.errorTypes
- **AND** SHALL maintain same constant names as UI-Kit
- **AND** SHALL use consistent error key values

#### Scenario: Migration path

- **WHEN** consumers migrate from UI-Kit FieldErrors
- **THEN** SHALL work as drop-in replacement with same props
- **AND** custom renderers SHALL function identically
- **AND** error objects SHALL have same structure
- **AND** built-in error messages MAY differ (improved wording)

### Requirement: Component Composition

The component SHALL compose with form input components.

#### Scenario: TextInput integration

- **WHEN** FieldErrors is used with TextInput in FormField
- **THEN** SHALL display below TextInput
- **AND** SHALL coordinate with TextInput invalid state
- **AND** SHALL be announced when TextInput receives focus

#### Scenario: Select integration

- **WHEN** FieldErrors is used with Select in FormField
- **THEN** SHALL display below Select trigger
- **AND** SHALL coordinate with Select invalid state
- **AND** SHALL announce errors when Select opens

#### Scenario: Custom input integration

- **WHEN** FieldErrors is used with custom input component
- **THEN** SHALL render errors independently of input implementation
- **AND** SHALL rely on FormField for ARIA associations
- **AND** SHALL not require input-specific logic

### Requirement: Style Props Support

The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Root style props

- **WHEN** style props are passed to FieldErrors
- **THEN** SHALL forward to root slot element
- **AND** SHALL support spacing props (margin, padding)
- **AND** SHALL support layout props (width, maxWidth)
- **AND** SHALL support color props (colorPalette override)

#### Scenario: Style prop merging

- **WHEN** style props conflict with recipe styles
- **THEN** SHALL merge props with recipe styles
- **AND** passed props SHALL take precedence
- **AND** SHALL allow style overrides when needed

#### Scenario: Responsive style props

- **WHEN** responsive style props are used
- **THEN** SHALL support responsive arrays: [base, sm, md, lg]
- **AND** SHALL support responsive objects: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL apply at appropriate breakpoints

### Requirement: Performance Optimization

The component SHALL render efficiently with multiple errors.

#### Scenario: Efficient error filtering

- **WHEN** errors object contains many falsy values
- **THEN** SHALL filter to active errors before rendering
- **AND** SHALL not create DOM elements for inactive errors
- **AND** SHALL avoid unnecessary render cycles

#### Scenario: Render optimization

- **WHEN** errors prop changes
- **THEN** SHALL only re-render if active errors change
- **AND** SHALL use React keys for stable error message elements
- **AND** SHALL minimize DOM updates

#### Scenario: Early return optimization

- **WHEN** component has no active errors or isVisible is false
- **THEN** SHALL return null immediately
- **AND** SHALL not execute renderer functions
- **AND** SHALL not create slot components

### Requirement: Testing Support

The component SHALL support comprehensive testing per nimbus-core standards.

#### Scenario: Storybook stories

- **WHEN** component is tested
- **THEN** SHALL have field-errors.stories.tsx with play functions
- **AND** stories SHALL cover all 15 built-in error types
- **AND** stories SHALL test custom renderers and messages
- **AND** stories SHALL test FormField integration

#### Scenario: Testable static methods

- **WHEN** testing error message resolution
- **THEN** FieldErrors.getBuiltInMessage SHALL be callable for testing
- **AND** FieldErrors.getCustomMessage SHALL be callable for testing
- **AND** static methods SHALL return same values as internal logic

#### Scenario: Accessible testing queries

- **WHEN** writing tests
- **THEN** SHALL query by role="alert"
- **AND** SHALL query by error text content
- **AND** SHALL NOT require data-testid attributes
- **AND** tests SHALL validate ARIA attributes

### Requirement: Error Icon Display

The component SHALL NOT display error icons (handled by FormField).

#### Scenario: Icon responsibility

- **WHEN** FieldErrors renders error messages
- **THEN** SHALL NOT include error icons in component
- **AND** FormField.Error SHALL handle icon display
- **AND** FieldErrors SHALL focus solely on message content
- **AND** SHALL maintain separation of concerns

#### Scenario: Integration with FormField icon

- **WHEN** used inside FormField.Error
- **THEN** FormField SHALL render ErrorOutline icon
- **AND** icon SHALL appear before FieldErrors content
- **AND** FieldErrors SHALL render as inline content after icon

### Requirement: Role Attribute Customization

The component SHALL support custom ARIA roles via role prop.

#### Scenario: Default alert role

- **WHEN** role prop is not provided
- **THEN** root element SHALL have role="alert"
- **AND** SHALL use assertive live region semantics
- **AND** SHALL announce immediately to screen readers

#### Scenario: Status role for warnings

- **WHEN** role="status" is provided
- **THEN** root element SHALL have role="status"
- **AND** SHALL use polite live region semantics
- **AND** SHALL be appropriate for warning messages

#### Scenario: Custom role values

- **WHEN** role prop has custom value
- **THEN** SHALL apply provided role to root element
- **AND** SHALL allow flexibility for different message contexts
- **AND** SHALL maintain semantic HTML with appropriate role

### Requirement: Color Palette Variants

The component SHALL support color palette variants for different message types.

#### Scenario: Critical palette (default)

- **WHEN** colorPalette is not specified
- **THEN** SHALL use colorPalette: "critical"
- **AND** message text SHALL use critical.11 color
- **AND** SHALL indicate error severity visually

#### Scenario: Warning palette

- **WHEN** colorPalette="warning" is provided
- **THEN** SHALL use warning color tokens
- **AND** message text SHALL use warning.11 color
- **AND** SHALL be appropriate for warning messages

#### Scenario: Custom palette

- **WHEN** colorPalette prop has custom value
- **THEN** SHALL apply custom color palette
- **AND** SHALL use colorPalette.11 for text color
- **AND** SHALL support all Chakra color palettes

### Requirement: Message List Structure

The component SHALL render errors as a flat list of messages.

#### Scenario: Single error rendering

- **WHEN** errors object has one truthy error
- **THEN** SHALL render single FieldErrorsMessage
- **AND** message SHALL be wrapped in FieldErrorsRoot
- **AND** SHALL display as single block of text

#### Scenario: Multiple error rendering

- **WHEN** errors object has multiple truthy errors
- **THEN** SHALL render multiple FieldErrorsMessage elements
- **AND** each message SHALL be direct child of FieldErrorsRoot
- **AND** messages SHALL stack vertically
- **AND** each SHALL use error key as React key

#### Scenario: Error order

- **WHEN** multiple errors render
- **THEN** SHALL render in Object.entries iteration order
- **AND** order SHALL be consistent across renders
- **AND** order SHALL match order of error keys in object
