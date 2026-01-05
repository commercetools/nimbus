# Specification: NumberInput Component

## Overview

The NumberInput component provides an accessible numeric input field with increment/decrement controls, formatting, and comprehensive validation.

**Component:** `NumberInput`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `NumberField` from react-aria-components

## Value Management

### Requirement: Numeric Value Handling
The component SHALL manage numeric values with proper parsing and formatting.

#### Scenario: Value prop
- **WHEN** value prop is provided
- **THEN** SHALL accept number or undefined
- **AND** SHALL format for display per locale
- **AND** SHALL parse user input to number

#### Scenario: Controlled mode
- **WHEN** value and onChange props are provided
- **THEN** SHALL render with provided numeric value
- **AND** SHALL call onChange with parsed number
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultValue prop is provided without value
- **THEN** SHALL initialize with defaultValue
- **AND** SHALL manage state internally

## Numeric Constraints

### Requirement: Value Bounds
The component SHALL enforce minimum and maximum value constraints.

#### Scenario: Minimum value
- **WHEN** min prop is set
- **THEN** SHALL prevent values below minimum
- **AND** SHALL disable decrement button at minimum
- **AND** SHALL validate on blur
- **AND** SHALL show validation error if below minimum

#### Scenario: Maximum value
- **WHEN** max prop is set
- **THEN** SHALL prevent values above maximum
- **AND** SHALL disable increment button at maximum
- **AND** SHALL validate on blur
- **AND** SHALL show validation error if above maximum

#### Scenario: Step increment
- **WHEN** step prop is set
- **THEN** SHALL increment/decrement by step value
- **AND** SHALL default to step=1
- **AND** SHALL support decimal steps (e.g., 0.1, 0.01)
- **AND** SHALL validate value is multiple of step + min

## Stepper Controls

### Requirement: Increment and Decrement Buttons
The component SHALL provide stepper buttons for value adjustment.

#### Scenario: Increment button
- **WHEN** user clicks increment button
- **THEN** SHALL increase value by step amount
- **AND** SHALL not exceed maximum value
- **AND** SHALL trigger onChange with new value
- **AND** SHALL use i18n label "Increment" for screen readers

#### Scenario: Decrement button
- **WHEN** user clicks decrement button
- **THEN** SHALL decrease value by step amount
- **AND** SHALL not go below minimum value
- **AND** SHALL trigger onChange with new value
- **AND** SHALL use i18n label "Decrement" for screen readers

#### Scenario: Button disabled states
- **WHEN** value is at minimum
- **THEN** decrement button SHALL be disabled
- **WHEN** value is at maximum
- **THEN** increment button SHALL be disabled
- **WHEN** field is disabled or readOnly
- **THEN** both buttons SHALL be disabled

## Keyboard Interaction

### Requirement: Keyboard Stepping
The component SHALL support keyboard shortcuts for value adjustment per nimbus-core standards.

#### Scenario: Arrow key stepping
- **WHEN** input is focused and user presses ArrowUp
- **THEN** SHALL increment by step value
- **WHEN** user presses ArrowDown
- **THEN** SHALL decrement by step value
- **AND** SHALL respect min/max bounds

#### Scenario: Page key stepping
- **WHEN** user presses PageUp
- **THEN** SHALL increment by step * 10
- **WHEN** user presses PageDown
- **THEN** SHALL decrement by step * 10
- **AND** SHALL respect min/max bounds

#### Scenario: Home and End keys
- **WHEN** user presses Home
- **THEN** SHALL set value to minimum (if defined)
- **WHEN** user presses End
- **THEN** SHALL set value to maximum (if defined)

## Number Formatting

### Requirement: Locale-Aware Formatting
The component SHALL format numbers according to locale settings.

#### Scenario: Locale formatting
- **WHEN** locale prop is provided (via React Aria context)
- **THEN** SHALL use locale-specific number formatting
- **AND** SHALL format thousands separator
- **AND** SHALL format decimal separator
- **AND** SHALL support RTL locales

#### Scenario: Decimal precision
- **WHEN** formatOptions.minimumFractionDigits is set
- **THEN** SHALL display specified number of decimal places
- **WHEN** formatOptions.maximumFractionDigits is set
- **THEN** SHALL limit decimal places to maximum

#### Scenario: Percentage and currency
- **WHEN** formatOptions.style="percent" is set
- **THEN** SHALL format as percentage (e.g., "50%")
- **WHEN** formatOptions.style="currency" is set
- **THEN** SHALL format with currency symbol
- **AND** formatOptions.currency SHALL specify currency code

## Validation

### Requirement: Numeric Validation
The component SHALL validate numeric input.

#### Scenario: Required validation
- **WHEN** required={true} is set
- **THEN** SHALL require non-empty value
- **AND** SHALL show required indicator
- **AND** SHALL validate on blur
- **AND** SHALL set aria-required="true"

#### Scenario: Invalid input
- **WHEN** user enters non-numeric characters
- **THEN** SHALL ignore invalid characters
- **OR** SHALL show validation error
- **AND** SHALL preserve last valid value

#### Scenario: Range validation
- **WHEN** user enters value outside min/max range
- **THEN** SHALL show validation error
- **AND** SHALL mark field as invalid
- **AND** SHALL set aria-invalid="true"

## Input States

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styling
- **AND** SHALL disable input and stepper buttons
- **AND** SHALL prevent all interactions
- **AND** SHALL set aria-disabled="true"

#### Scenario: Read-only state
- **WHEN** readOnly={true} is set
- **THEN** SHALL display value without edit controls
- **AND** SHALL hide stepper buttons
- **AND** SHALL prevent value changes
- **AND** SHALL set aria-readonly="true"

## Wheel Scroll Support

### Requirement: Mouse Wheel Interaction
The component SHALL optionally support mouse wheel scrolling.

#### Scenario: Wheel scrolling
- **WHEN** isWheelDisabled={false} (default)
- **THEN** scrolling mouse wheel while focused SHALL change value
- **AND** SHALL increment on wheel up
- **AND** SHALL decrement on wheel down
- **AND** SHALL respect step value

## Size Variants

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust height, padding, font size, and button sizes
- **AND** md SHALL be default size

## Accessibility

### Requirement: ARIA Attributes
The component SHALL provide comprehensive ARIA attributes per nimbus-core standards.

#### Scenario: Number field role
- **WHEN** input renders
- **THEN** SHALL use role="spinbutton" via React Aria
- **AND** SHALL set aria-valuemin when min is defined
- **AND** SHALL set aria-valuemax when max is defined
- **AND** SHALL set aria-valuenow with current value
- **AND** SHALL set aria-valuetext with formatted value

#### Scenario: Label association
- **WHEN** label prop is provided
- **THEN** SHALL associate label with input
- **AND** SHALL use aria-labelledby

#### Scenario: Error messages
- **WHEN** field is invalid
- **THEN** SHALL associate error message with aria-describedby
- **AND** SHALL announce error to screen readers

### Requirement: Stepper Button Labels
The component SHALL provide accessible stepper button labels.

#### Scenario: Internationalized labels
- **WHEN** stepper buttons render
- **THEN** increment button SHALL have i18n aria-label "Increment"
- **AND** decrement button SHALL have i18n aria-label "Decrement"
- **AND** SHALL translate across supported locales

## Styling

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply numberInput slot recipe from theme/slot-recipes/number-input.ts
- **AND** SHALL style: root, label, inputWrapper, input, stepperGroup, incrementButton, decrementButton, helperText, errorText slots
- **AND** SHALL support size variants

## Form Integration

### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** component is in a form
- **THEN** SHALL include numeric value in form data
- **AND** SHALL use name prop as field name
- **AND** SHALL validate before submission
