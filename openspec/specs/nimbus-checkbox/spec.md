# Specification: Checkbox Component

## Overview

The Checkbox component provides an accessible checkbox control for binary or indeterminate selection states following ARIA checkbox pattern.

**Component:** `Checkbox`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `Checkbox` from react-aria-components

## Selection States

### Requirement: Checkbox States
The component SHALL support three selection states.

#### Scenario: Checked state
- **WHEN** isSelected={true} is set
- **THEN** SHALL render with checkmark icon
- **AND** SHALL apply checked styling
- **AND** SHALL set aria-checked="true"

#### Scenario: Unchecked state
- **WHEN** isSelected={false} is set
- **THEN** SHALL render with empty checkbox
- **AND** SHALL apply unchecked styling
- **AND** SHALL set aria-checked="false"

#### Scenario: Indeterminate state
- **WHEN** isIndeterminate={true} is set
- **THEN** SHALL render with dash/minus icon
- **AND** SHALL apply indeterminate styling
- **AND** SHALL set aria-checked="mixed"
- **AND** SHALL be used for partial selection states (e.g., parent checkbox with some children selected)

## Value Management

### Requirement: Controlled and Uncontrolled Modes
The component SHALL support both state management modes per nimbus-core standards.

#### Scenario: Controlled mode
- **WHEN** isSelected and onChange props are provided
- **THEN** SHALL render with provided checked state
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
- **WHEN** user clicks checkbox or label
- **THEN** SHALL toggle between checked and unchecked
- **AND** SHALL call onChange handler
- **AND** SHALL provide visual feedback

#### Scenario: Keyboard toggle
- **WHEN** checkbox is focused and user presses Space
- **THEN** SHALL toggle state
- **AND** SHALL call onChange handler
- **WHEN** user presses Enter in form context
- **THEN** MAY trigger form submission

## Label Association

### Requirement: Accessible Labeling
The component SHALL provide accessible label association per nimbus-core standards.

#### Scenario: Text label
- **WHEN** children content is provided
- **THEN** SHALL render as clickable label
- **AND** SHALL associate with checkbox input
- **AND** clicking label SHALL toggle checkbox

#### Scenario: Aria-label fallback
- **WHEN** aria-label is provided without children
- **THEN** SHALL use aria-label for screen readers
- **AND** SHALL not render visible label

## Validation

### Requirement: Checkbox Validation
The component SHALL support validation states.

#### Scenario: Required validation
- **WHEN** required={true} is set
- **THEN** SHALL require checked state
- **AND** SHALL show required indicator
- **AND** SHALL validate on change
- **AND** SHALL set aria-required="true"

#### Scenario: Invalid state
- **WHEN** validation fails or invalid={true} is set
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
- **AND** SHALL adjust checkbox dimensions and label font size
- **AND** md SHALL be default size

## Accessibility

### Requirement: ARIA Checkbox Pattern
The component SHALL implement ARIA checkbox pattern per nimbus-core standards.

#### Scenario: Checkbox role
- **WHEN** checkbox renders
- **THEN** input SHALL have role="checkbox"
- **AND** SHALL be keyboard focusable
- **AND** SHALL have visible focus indicator

#### Scenario: State announcements
- **WHEN** state changes
- **THEN** SHALL announce new state to screen readers
- **AND** SHALL use proper aria-checked value

### Requirement: Focus Management
The component SHALL manage focus appropriately per nimbus-core standards.

#### Scenario: Focus indicator
- **WHEN** checkbox receives focus
- **THEN** SHALL show visible focus ring
- **AND** SHALL meet 3:1 contrast ratio
- **WHEN** user clicks checkbox
- **THEN** focus SHALL remain on checkbox

## Form Integration

### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form submission
- **WHEN** checkbox is in a form
- **THEN** SHALL include checked state in form data
- **AND** SHALL use name prop as field name
- **AND** value prop SHALL specify submitted value (defaults to "on")
- **AND** unchecked SHALL omit from form data or use falsy value

#### Scenario: Checkbox group
- **WHEN** multiple checkboxes share same name
- **THEN** SHALL submit array of selected values
- **AND** SHALL support independent selection

## Styling

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** checkbox renders
- **THEN** SHALL apply checkbox slot recipe from theme/slot-recipes/checkbox.ts
- **AND** SHALL style: root, control, icon, label, helperText, errorText slots
- **AND** SHALL support size variants
- **AND** SHALL support checked, unchecked, indeterminate, disabled, invalid states

## Color Palette

### Requirement: Semantic Colors
The component SHALL support semantic color palettes per nimbus-core standards.

#### Scenario: Color variants
- **WHEN** colorPalette prop is set
- **THEN** SHALL support semantic palettes: primary, neutral, info, positive, warning, critical
- **AND** SHALL apply palette color to checked state
- **AND** primary SHALL be default
