# Specification: Switch Component

## Overview

The Switch component provides an accessible toggle switch control for binary on/off states, following ARIA switch pattern.

**Component:** `Switch`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `Switch` from react-aria-components

## Toggle States

### Requirement: Switch States
The component SHALL support binary toggle states.

#### Scenario: On state
- **WHEN** isSelected={true} is set
- **THEN** SHALL render thumb in "on" position
- **AND** SHALL apply active styling
- **AND** SHALL set aria-checked="true"

#### Scenario: Off state
- **WHEN** isSelected={false} is set
- **THEN** SHALL render thumb in "off" position
- **AND** SHALL apply inactive styling
- **AND** SHALL set aria-checked="false"

## Value Management

### Requirement: Controlled and Uncontrolled Modes
The component SHALL support both state management modes per nimbus-core standards.

#### Scenario: Controlled mode
- **WHEN** isSelected and onChange props are provided
- **THEN** SHALL render with provided toggle state
- **AND** SHALL call onChange with new state on toggle
- **AND** SHALL not update internal state

#### Scenario: Uncontrolled mode
- **WHEN** defaultSelected prop is provided without isSelected
- **THEN** SHALL initialize with default state
- **AND** SHALL manage state internally
- **AND** optional onChange SHALL receive updates

## User Interaction

### Requirement: Toggle Interaction
The component SHALL respond to user interactions.

#### Scenario: Click toggle
- **WHEN** user clicks switch or label
- **THEN** SHALL toggle between on and off
- **AND** SHALL call onChange handler
- **AND** SHALL provide visual feedback (thumb animation)

#### Scenario: Keyboard toggle
- **WHEN** switch is focused and user presses Space or Enter
- **THEN** SHALL toggle state
- **AND** SHALL call onChange handler
- **AND** SHALL provide visual feedback

## Label Association

### Requirement: Accessible Labeling
The component SHALL provide accessible label association per nimbus-core standards.

#### Scenario: Text label
- **WHEN** children content is provided
- **THEN** SHALL render as clickable label
- **AND** SHALL associate with switch input
- **AND** clicking label SHALL toggle switch

#### Scenario: Aria-label fallback
- **WHEN** aria-label is provided without children
- **THEN** SHALL use aria-label for screen readers
- **AND** SHALL not render visible label

#### Scenario: Label position
- **WHEN** labelPosition prop is set
- **THEN** SHALL support: left, right
- **AND** right SHALL be default
- **AND** SHALL render label before or after switch control

## Validation

### Requirement: Switch Validation
The component SHALL support validation states.

#### Scenario: Required validation
- **WHEN** required={true} is set
- **THEN** SHALL require "on" state
- **AND** SHALL show required indicator
- **AND** SHALL set aria-required="true"

#### Scenario: Invalid state
- **WHEN** invalid={true} is set or validation fails
- **THEN** SHALL apply error styling
- **AND** SHALL set aria-invalid="true"
- **AND** SHALL associate error message via aria-describedby

## Input States

### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styling (reduced opacity)
- **AND** SHALL prevent all interactions
- **AND** SHALL set aria-disabled="true"
- **AND** SHALL show not-allowed cursor

#### Scenario: Read-only state
- **WHEN** readOnly={true} is set
- **THEN** SHALL display state without allowing changes
- **AND** SHALL set aria-readonly="true"
- **AND** SHALL allow focus but prevent toggle

## Size Variants

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust switch track and thumb dimensions
- **AND** md SHALL be default size

## Accessibility

### Requirement: ARIA Switch Pattern
The component SHALL implement ARIA switch pattern per nimbus-core standards.

#### Scenario: Switch role
- **WHEN** switch renders
- **THEN** input SHALL have role="switch"
- **AND** SHALL be keyboard focusable
- **AND** SHALL have visible focus indicator
- **AND** SHALL set aria-checked to reflect state

#### Scenario: State announcements
- **WHEN** state changes
- **THEN** SHALL announce new state to screen readers
- **AND** screen readers SHALL announce "on" or "off"

### Requirement: Focus Management
The component SHALL manage focus appropriately per nimbus-core standards.

#### Scenario: Focus indicator
- **WHEN** switch receives focus
- **THEN** SHALL show visible focus ring around track
- **AND** SHALL meet 3:1 contrast ratio
- **WHEN** user clicks switch
- **THEN** focus SHALL remain on switch

## Animation

### Requirement: Thumb Animation
The component SHALL provide smooth visual transitions.

#### Scenario: Toggle animation
- **WHEN** state changes
- **THEN** thumb SHALL smoothly slide between positions
- **AND** SHALL use easing curve for natural motion
- **AND** animation duration SHALL be from design tokens

## Form Integration

### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** switch is in a form
- **THEN** SHALL include toggle state in form data
- **AND** SHALL use name prop as field name
- **AND** value prop SHALL specify submitted value when "on"
- **AND** "off" state SHALL omit from form data or use falsy value

## Styling

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** switch renders
- **THEN** SHALL apply switch slot recipe from theme/slot-recipes/switch.ts
- **AND** SHALL style: root, track, thumb, label, helperText, errorText slots
- **AND** SHALL support size variants
- **AND** SHALL support on, off, disabled, invalid states

## Color Palette

### Requirement: Semantic Colors
The component SHALL support semantic color palettes per nimbus-core standards.

#### Scenario: Color variants
- **WHEN** colorPalette prop is set
- **THEN** SHALL support semantic palettes: primary, neutral, info, positive, warning, critical
- **AND** SHALL apply palette color to "on" state track
- **AND** primary SHALL be default
