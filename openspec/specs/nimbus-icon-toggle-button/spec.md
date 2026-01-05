# Specification: IconToggleButton Component

## Overview

The IconToggleButton component provides an accessible, icon-only toggle button that maintains pressed/unpressed state. It combines IconButton's icon-only display with toggle functionality, following the nimbus-core standards. It extends the ToggleButton component with icon-specific constraints and accessibility requirements, ensuring proper screen reader support through mandatory accessible labels.

**Component:** `IconToggleButton`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component
**React Aria:** Uses `ToggleButton` from react-aria-components (via ToggleButton component)
**Base Component:** Extends ToggleButton component

## Purpose

The IconToggleButton capability provides an icon-only toggle button component that maintains all the functionality and accessibility of the standard ToggleButton component while enforcing proper accessible labeling for screen reader users. It simplifies the creation of icon-only toggle buttons by automatically applying zero padding and requiring aria-label for accessibility compliance.

## Requirements

### Requirement: Mandatory Accessible Label
The component SHALL require an accessible label for screen reader users.

#### Scenario: aria-label requirement
- **WHEN** IconToggleButton is rendered
- **THEN** SHALL require aria-label prop as mandatory string
- **AND** SHALL be enforced at TypeScript level (non-optional prop)
- **AND** aria-label SHALL describe the button's action (not the icon itself)

#### Scenario: Screen reader announcement
- **WHEN** screen reader user focuses IconToggleButton
- **THEN** SHALL announce the aria-label text
- **AND** SHALL NOT rely on icon content for accessible name
- **AND** SHALL follow WCAG 2.1 AA accessible name requirements

### Requirement: Icon-Only Content
The component SHALL render only an icon as visible content.

#### Scenario: Icon as children
- **WHEN** IconToggleButton receives children prop
- **THEN** SHALL render icon component from @commercetools/nimbus-icons
- **AND** SHALL apply zero padding (px={0}, py={0}) to ToggleButton
- **AND** SHALL maintain square aspect ratio through recipe sizing

#### Scenario: No text content
- **WHEN** IconToggleButton renders
- **THEN** SHALL NOT display visible text labels
- **AND** visible label SHALL be provided via aria-label only
- **AND** SHALL maintain icon-only appearance across all variants

### Requirement: Toggle State Management
The component SHALL support both controlled and uncontrolled state management modes.

#### Scenario: Controlled mode
- **WHEN** isSelected and onChange props are provided
- **THEN** SHALL render with provided toggle state
- **AND** SHALL call onChange with new boolean state on toggle
- **AND** SHALL NOT update internal state (parent controls state)

#### Scenario: Uncontrolled mode
- **WHEN** defaultSelected prop is provided without isSelected
- **THEN** SHALL initialize with default toggle state
- **AND** SHALL manage state internally via React Aria
- **AND** optional onChange SHALL receive state updates

#### Scenario: Initial uncontrolled state
- **WHEN** neither isSelected nor defaultSelected are provided
- **THEN** SHALL initialize in unselected state (false)
- **AND** SHALL allow user to toggle state
- **AND** SHALL manage state internally

### Requirement: Toggle Interaction
The component SHALL respond to user interactions to toggle state.

#### Scenario: Click toggle
- **WHEN** user clicks IconToggleButton
- **THEN** SHALL toggle between selected and unselected states
- **AND** SHALL call onChange handler with new boolean state
- **AND** SHALL provide visual feedback (state change)
- **AND** SHALL update aria-pressed attribute

#### Scenario: Keyboard toggle
- **WHEN** button is focused and user presses Space or Enter
- **THEN** SHALL toggle state
- **AND** SHALL call onChange handler with new boolean state
- **AND** SHALL provide visual feedback
- **AND** SHALL follow React Aria keyboard patterns

### Requirement: Selected State Visual Differentiation
The component SHALL provide clear visual differentiation between selected and unselected states.

#### Scenario: Unselected state rendering
- **WHEN** isSelected={false} or not selected
- **THEN** SHALL render with unselected visual styling
- **AND** SHALL set data-selected="false" on button element
- **AND** SHALL NOT set aria-pressed="true"

#### Scenario: Selected state rendering
- **WHEN** isSelected={true} is set
- **THEN** SHALL render with selected visual styling
- **AND** SHALL set data-selected="true" on button element
- **AND** SHALL set aria-pressed="true"
- **AND** SHALL apply enhanced background color from colorPalette

#### Scenario: State transition animation
- **WHEN** state changes from selected to unselected or vice versa
- **THEN** SHALL provide smooth visual transition
- **AND** SHALL use design token animation durations
- **AND** SHALL maintain button dimensions (no layout shift)

### Requirement: Icon Toggle Button Sizes
The component SHALL support size variants inherited from ToggleButton.

#### Scenario: 2xs size
- **WHEN** size="2xs" is set
- **THEN** SHALL render with height 600 (24px) and minWidth 600 (24px)
- **AND** icon SHALL be 400 (16px) width and height
- **AND** SHALL maintain minimum 44x44px touch target with padding/margin

#### Scenario: xs size
- **WHEN** size="xs" is set
- **THEN** SHALL render with height 800 (32px) and minWidth 800 (32px)
- **AND** icon SHALL be 500 (20px) width and height
- **AND** SHALL maintain adequate touch target for mobile

#### Scenario: md size
- **WHEN** size="md" is set (default)
- **THEN** SHALL render with height 1000 (40px) and minWidth 1000 (40px)
- **AND** icon SHALL be 600 (24px) width and height
- **AND** SHALL provide comfortable click and touch target

### Requirement: Toggle Button Variants Inheritance
The component SHALL support visual variants from ToggleButton component that support toggle states.

#### Scenario: Outline variant (default)
- **WHEN** variant="outline" is set
- **THEN** SHALL render with transparent background and border
- **AND** SHALL use semantic color for border and icon
- **AND** WHEN selected SHALL show filled background from colorPalette
- **AND** SHALL provide enhanced background on hover

#### Scenario: Ghost variant
- **WHEN** variant="ghost" is set
- **THEN** SHALL render with transparent background and no border
- **AND** SHALL show subtle background on hover
- **AND** WHEN selected SHALL apply colorPalette background
- **AND** SHALL maintain icon color visibility

### Requirement: Semantic Colors
The component SHALL support semantic color palettes inherited from ToggleButton.

#### Scenario: Color variants
- **WHEN** colorPalette prop is set
- **THEN** SHALL accept: primary, neutral, info, positive, warning, critical
- **AND** SHALL apply appropriate semantic colors to icon and background
- **AND** SHALL maintain WCAG AA contrast ratios in all states
- **AND** SHALL support light and dark modes

#### Scenario: Selected state color application
- **WHEN** IconToggleButton is in selected state
- **THEN** SHALL apply colorPalette background color
- **AND** SHALL enhance color intensity on hover
- **AND** SHALL use colorPalette icon color
- **AND** SHALL maintain contrast requirements

### Requirement: Disabled State
The component SHALL support disabled state inherited from ToggleButton.

#### Scenario: Disabled rendering
- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styles (reduced opacity)
- **AND** SHALL prevent click/keyboard interactions
- **AND** SHALL set aria-disabled="true"
- **AND** SHALL show not-allowed cursor
- **AND** SHALL maintain current selected/unselected state

#### Scenario: Disabled with selected state
- **WHEN** disabled={true} and isSelected={true}
- **THEN** SHALL render in selected state with disabled styling
- **AND** SHALL NOT allow state changes
- **AND** SHALL set both aria-disabled="true" and aria-pressed="true"

### Requirement: Keyboard Interaction
The component SHALL support keyboard interactions per nimbus-core standards.

#### Scenario: Enter and Space keys
- **WHEN** button is focused and user presses Enter or Space
- **THEN** SHALL trigger toggle state change
- **AND** SHALL call onChange handler with new state
- **AND** SHALL provide visual feedback (active state)
- **AND** SHALL follow React Aria keyboard patterns

#### Scenario: Focus management
- **WHEN** user navigates with Tab key
- **THEN** SHALL be focusable in logical tab order
- **AND** SHALL show visible focus indicator meeting 3:1 contrast ratio
- **AND** SHALL apply focusVisibleRing style from recipe

### Requirement: Recipe-Based Styling
The component SHALL use ToggleButton recipe with zero padding override.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply toggleButton recipe from theme/recipes/toggle-button.ts
- **AND** SHALL override padding with px={0} and py={0}
- **AND** SHALL support recipe props: variant, size, colorPalette
- **AND** recipe SHALL be registered in theme configuration

#### Scenario: Icon sizing
- **WHEN** component renders with specific size
- **THEN** SHALL apply icon width/height from recipe's _icon selector
- **AND** icon dimensions SHALL scale proportionally with button size
- **AND** SHALL maintain square aspect ratio

#### Scenario: Selected state styling
- **WHEN** component is in selected state
- **THEN** recipe SHALL apply data-selected="true" specific styles
- **AND** SHALL use CSS custom properties for color theming
- **AND** SHALL support hover state enhancements when selected

### Requirement: Custom Styling
The component SHALL accept Chakra style props.

#### Scenario: Style prop override
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra style props (margin, width, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL NOT override internal padding (maintains icon-only design)

### Requirement: Ref Support
The component SHALL support ref forwarding to the button element.

#### Scenario: Ref forwarding
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to underlying button element
- **AND** SHALL support React.Ref<HTMLButtonElement> type
- **AND** SHALL merge with internal ref using mergeRefs utility

### Requirement: Polymorphic Rendering
The component SHALL support rendering as different HTML elements inherited from ToggleButton.

#### Scenario: Custom element
- **WHEN** as prop is provided
- **THEN** SHALL render as specified element (e.g., as="a" for link)
- **AND** SHALL maintain toggle button styling and state
- **AND** SHALL forward appropriate HTML attributes
- **AND** SHALL preserve toggle button interactions and accessibility

### Requirement: ARIA Toggle Button Pattern
The component SHALL implement ARIA toggle button pattern per nimbus-core standards.

#### Scenario: Button role
- **WHEN** component renders
- **THEN** SHALL have implicit button role from HTML element
- **AND** SHALL be keyboard accessible
- **AND** SHALL support Enter and Space activation

#### Scenario: Accessible name requirement
- **WHEN** IconToggleButton renders
- **THEN** SHALL have accessible name from required aria-label prop
- **AND** SHALL NOT accept empty aria-label string
- **AND** accessible name SHALL describe action, not appearance

#### Scenario: Toggle state announcements
- **WHEN** toggle state changes
- **THEN** SHALL set aria-pressed attribute to reflect current state
- **AND** aria-pressed SHALL be "true" when selected
- **AND** aria-pressed SHALL be "false" or absent when unselected
- **AND** screen readers SHALL announce pressed state changes

#### Scenario: Disabled state announcements
- **WHEN** disabled
- **THEN** SHALL set aria-disabled="true"
- **AND** SHALL maintain aria-pressed value
- **AND** screen readers SHALL announce disabled state

### Requirement: Touch Target Size
The component SHALL meet minimum touch target requirements per nimbus-core standards.

#### Scenario: Minimum touch target
- **WHEN** IconToggleButton renders in any size
- **THEN** SHALL meet minimum 44x44px touch target through size or padding
- **AND** small sizes (2xs, xs) SHALL achieve target size through outer spacing
- **AND** SHALL provide adequate spacing between adjacent icon toggle buttons

### Requirement: Icon Variant Support
The component SHALL support displaying different icons based on toggle state.

#### Scenario: Single icon for all states
- **WHEN** children prop contains single icon component
- **THEN** SHALL display same icon in both selected and unselected states
- **AND** SHALL rely on background and border styling to indicate state

#### Scenario: Conditional icon rendering
- **WHEN** parent component conditionally renders different icons based on isSelected
- **THEN** SHALL support icon changes between states
- **AND** SHALL maintain button dimensions during icon transitions
- **AND** SHALL not cause layout shift when icon changes

### Requirement: Form Integration
The component SHALL support form-related attributes inherited from ToggleButton.

#### Scenario: Form field association
- **WHEN** name prop is provided
- **THEN** SHALL associate toggle state with form field name
- **AND** selected state SHALL be included in form submission
- **AND** SHALL work with standard form handling patterns

#### Scenario: Value representation
- **WHEN** value prop is provided
- **THEN** SHALL use specified value in form data when selected
- **AND** SHALL follow ToggleButton value semantics
- **AND** SHALL work with controlled form libraries

### Requirement: TypeScript Props Type
The component SHALL extend ToggleButtonProps with icon-specific constraints.

#### Scenario: Props type definition
- **WHEN** IconToggleButtonProps is defined
- **THEN** SHALL extend ToggleButtonProps from toggle-button.types.ts
- **AND** SHALL require aria-label as mandatory string (non-optional)
- **AND** SHALL support ref as React.Ref<HTMLButtonElement>
- **AND** SHALL inherit all ToggleButton props (variant, size, colorPalette, disabled, isSelected, defaultSelected, onChange)

#### Scenario: JSDoc documentation
- **WHEN** IconToggleButtonProps is exported
- **THEN** SHALL include JSDoc comments for all props
- **AND** SHALL document aria-label as required accessible label explaining intended action
- **AND** SHALL document ref as ref forwarding to button element
- **AND** SHALL document toggle state management (isSelected, defaultSelected, onChange)
