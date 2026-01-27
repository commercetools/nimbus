# Specification: PasswordInput Component

## Overview

The PasswordInput component provides an accessible password input field with visibility toggle functionality for secure credential entry. It extends the TextInput component with password-specific features including character masking and show/hide controls.

**Component:** `PasswordInput`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component (extends TextInput)
**React Aria:** Uses `TextField` from react-aria-components (via TextInput)
**Base Component:** TextInput

## Purpose

Provide a secure, accessible password input field with character masking and visibility toggle functionality, extending TextInput with password-specific features for authentication and credential entry scenarios while maintaining WCAG 2.1 AA compliance.

## Requirements

### Requirement: Password Masking
The component SHALL mask password characters by default for security.

#### Scenario: Default masked state
- **WHEN** component renders
- **THEN** SHALL render input with type="password"
- **AND** SHALL hide entered characters with masking symbols (bullets/dots)
- **AND** SHALL mask all characters including spaces and special characters
- **AND** SHALL maintain masked state across focus changes

#### Scenario: Visibility toggle
- **WHEN** user clicks visibility toggle button
- **THEN** SHALL change input type from "password" to "text"
- **AND** SHALL reveal entered password characters
- **AND** SHALL update toggle button icon from Visibility to VisibilityOff
- **AND** SHALL update toggle button aria-label to "Hide password"

#### Scenario: Return to masked state
- **WHEN** user clicks toggle button while password is visible
- **THEN** SHALL change input type from "text" to "password"
- **AND** SHALL re-mask entered characters
- **AND** SHALL update toggle button icon from VisibilityOff to Visibility
- **AND** SHALL update toggle button aria-label to "Show password"

### Requirement: Visibility Toggle Button
The component SHALL provide an IconButton to toggle password visibility.

#### Scenario: Toggle button rendering
- **WHEN** component renders
- **THEN** SHALL render toggle button in trailingElement slot
- **AND** SHALL display Visibility icon when password is masked
- **AND** SHALL display VisibilityOff icon when password is visible
- **AND** SHALL use ghost variant with primary colorPalette
- **AND** SHALL size button appropriately (xs for md input, 2xs for sm input)

#### Scenario: Toggle button interaction
- **WHEN** user clicks toggle button
- **THEN** SHALL toggle password visibility state
- **AND** SHALL maintain focus on input field
- **AND** SHALL work with both mouse and keyboard (Enter/Space)
- **AND** SHALL provide haptic/visual feedback via button press state

#### Scenario: Toggle button with tooltip
- **WHEN** user hovers over toggle button
- **THEN** SHALL display tooltip with "Show password" or "Hide password"
- **AND** tooltip text SHALL match current aria-label
- **AND** SHALL support keyboard-triggered tooltip display

### Requirement: Disabled Password Field
The component SHALL properly handle disabled state for both input and controls.

#### Scenario: Disabled field
- **WHEN** isDisabled={true} is set
- **THEN** SHALL disable the password input field
- **AND** SHALL disable the visibility toggle button
- **AND** SHALL apply disabled styling to both elements
- **AND** SHALL prevent all interactions (typing, clicking toggle)
- **AND** SHALL set aria-disabled="true" on input

### Requirement: TextInput Base Functionality
The component SHALL inherit all TextInput capabilities per nimbus-text-input spec.

#### Scenario: TextInput props forwarding
- **WHEN** any TextInput-compatible prop is provided
- **THEN** SHALL forward to underlying TextInput component
- **AND** SHALL support: label, description, placeholder, isRequired, isInvalid, errorMessage, helperText
- **AND** SHALL support: leadingElement, size, variant
- **AND** SHALL support: controlled (value/onChange) and uncontrolled (defaultValue) modes
- **AND** SHALL support: validation, states, form integration

#### Scenario: Restricted props
- **WHEN** component is used
- **THEN** SHALL NOT expose type prop (always managed internally)
- **AND** SHALL NOT expose trailingElement prop (reserved for toggle button)
- **AND** type definition SHALL omit these props from TextInputProps

### Requirement: Size Options
The component SHALL support size variants that adjust both input and toggle button per nimbus-core standards.

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** SHALL render small input field
- **AND** SHALL render toggle button with size="2xs"
- **AND** SHALL maintain proportional spacing

#### Scenario: Medium size (default)
- **WHEN** size="md" is set or no size specified
- **THEN** SHALL render medium input field
- **AND** SHALL render toggle button with size="xs"
- **AND** SHALL use default spacing

### Requirement: Autocomplete Support
The component SHALL support password manager integration via autocomplete.

#### Scenario: Current password autocomplete
- **WHEN** autoComplete="current-password" is set
- **THEN** SHALL enable password manager autofill for login
- **AND** SHALL signal to browsers this is an existing password field
- **AND** SHALL integrate with browser/OS password storage

#### Scenario: New password autocomplete
- **WHEN** autoComplete="new-password" is set
- **THEN** SHALL enable password manager to offer saving new password
- **AND** SHALL signal to browsers this is a password creation field
- **AND** SHALL trigger password strength suggestions where supported

#### Scenario: Form submission
- **WHEN** component is in a form
- **THEN** SHALL include password value in form data
- **AND** SHALL use name prop as field name
- **AND** SHALL support form validation
- **AND** SHALL prevent submission if invalid and required

### Requirement: Password Validation
The component SHALL support password-specific validation per nimbus-text-input spec.

#### Scenario: Required validation
- **WHEN** isRequired={true} is set
- **THEN** SHALL mark field as required
- **AND** SHALL show required indicator
- **AND** SHALL validate on blur
- **AND** SHALL set aria-required="true"
- **AND** SHALL display error message if empty on validation

#### Scenario: Length validation
- **WHEN** minLength prop is provided
- **THEN** SHALL enforce minimum password length
- **AND** SHALL show error message if below minimum
- **AND** SHALL mark field as invalid

#### Scenario: Custom validation
- **WHEN** validate function prop is provided
- **THEN** SHALL call validation function with current password value
- **AND** SHALL display returned error message
- **AND** SHALL mark field as invalid if validation fails
- **AND** SHALL support password strength requirements

### Requirement: Keyboard Navigation
The component SHALL support comprehensive keyboard interactions per nimbus-core standards.

#### Scenario: Input field keyboard support
- **WHEN** input is focused
- **THEN** typing SHALL insert characters (displayed masked)
- **AND** Backspace/Delete SHALL remove characters
- **AND** Arrow keys SHALL move cursor within input
- **AND** Home/End SHALL move to start/end of password
- **AND** Ctrl/Cmd+A SHALL select all characters
- **AND** standard copy/paste shortcuts SHALL work

#### Scenario: Toggle button keyboard access
- **WHEN** Tab is pressed from input
- **THEN** SHALL move focus to toggle button
- **WHEN** toggle button is focused and Enter/Space is pressed
- **THEN** SHALL toggle password visibility
- **AND** SHALL maintain button focus
- **AND** SHALL not submit parent form

#### Scenario: Tab order
- **WHEN** Tab key is used for navigation
- **THEN** SHALL follow order: previous field → input → toggle button → next field
- **AND** SHALL maintain logical tab order in forms

### Requirement: WCAG 2.1 AA Compliance
The component SHALL meet accessibility standards per nimbus-core standards.

#### Scenario: Screen reader support
- **WHEN** screen reader user navigates to component
- **THEN** SHALL announce input as password field
- **AND** SHALL announce label and description
- **AND** SHALL announce required state if applicable
- **AND** SHALL announce error messages via aria-describedby
- **AND** toggle button SHALL have clear aria-label indicating current action

#### Scenario: Focus indicators
- **WHEN** input or toggle button receives focus
- **THEN** SHALL display visible focus indicator
- **AND** SHALL meet 3:1 contrast ratio requirement
- **AND** SHALL be clearly distinguishable from unfocused state

#### Scenario: Color contrast
- **WHEN** component renders
- **THEN** text SHALL meet 4.5:1 contrast ratio
- **AND** toggle button icon SHALL meet 3:1 contrast ratio
- **AND** error messages SHALL meet 4.5:1 contrast ratio
- **AND** SHALL support both light and dark modes

#### Scenario: Touch targets
- **WHEN** component renders on touch device
- **THEN** toggle button SHALL meet minimum 44x44px touch target
- **AND** SHALL provide adequate spacing from input field

### Requirement: Label Association
The component SHALL provide proper label association per nimbus-core standards.

#### Scenario: Visible label
- **WHEN** label prop is provided
- **THEN** SHALL render visible label element
- **AND** SHALL associate label with input via id
- **AND** SHALL set proper aria-labelledby on input

#### Scenario: Aria-label fallback
- **WHEN** aria-label is provided without visible label
- **THEN** SHALL use aria-label for screen readers
- **AND** SHALL not render visible label element
- **AND** SHALL still be accessible to assistive technology

### Requirement: Localized Toggle Button Labels
The component SHALL support internationalization for toggle button per nimbus-core standards.

#### Scenario: Show password label
- **WHEN** password is masked
- **THEN** toggle button aria-label SHALL use message "Nimbus.PasswordInput.show"
- **AND** SHALL translate to: "Show password" (en), "Passwort anzeigen" (de), etc.
- **AND** tooltip SHALL display same localized text

#### Scenario: Hide password label
- **WHEN** password is visible
- **THEN** toggle button aria-label SHALL use message "Nimbus.PasswordInput.hide"
- **AND** SHALL translate to: "Hide password" (en), "Passwort verbergen" (de), etc.
- **AND** tooltip SHALL display same localized text

#### Scenario: Message integration
- **WHEN** component renders
- **THEN** SHALL use messages from password-input.i18n.ts
- **AND** SHALL support all 5 Nimbus locales (en, de, es, fr-FR, pt-BR)
- **AND** SHALL format messages via plain TypeScript objects useIntl hook

### Requirement: TextInput Styling Inheritance
The component SHALL inherit TextInput styling per nimbus-text-input spec.

#### Scenario: Slot recipe usage
- **WHEN** component renders
- **THEN** SHALL use textInput slot recipe from theme/slot-recipes/text-input.ts
- **AND** SHALL style: root, label, input, trailingElement (toggle button), helperText, errorText slots
- **AND** SHALL support size variants (sm, md)
- **AND** SHALL support visual variants (solid, ghost)

#### Scenario: Toggle button styling
- **WHEN** toggle button renders
- **THEN** SHALL use IconButton component styling
- **AND** SHALL apply ghost variant for subtle appearance
- **AND** SHALL use primary colorPalette
- **AND** SHALL integrate seamlessly with input field design

### Requirement: Password Field Security
The component SHALL follow security best practices for password fields.

#### Scenario: Paste functionality
- **WHEN** user attempts to paste into field
- **THEN** SHALL allow paste operations by default
- **AND** SHALL support password manager workflows
- **AND** SHALL NOT restrict paste unless explicitly configured

#### Scenario: Browser autofill
- **WHEN** browser or password manager offers autofill
- **THEN** SHALL accept autofilled values
- **AND** SHALL trigger onChange event with autofilled value
- **AND** SHALL respect autoComplete prop configuration

#### Scenario: Network security
- **WHEN** component is used in production
- **THEN** documentation SHALL recommend HTTPS-only usage
- **AND** SHALL NOT implement client-side encryption (server responsibility)
- **AND** SHALL follow standard HTML form security practices
