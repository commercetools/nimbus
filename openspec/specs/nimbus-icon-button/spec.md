# Specification: IconButton Component

## Overview

The IconButton component provides an accessible, icon-only button following the nimbus-core standards. It extends the Button component with icon-specific constraints and accessibility requirements, ensuring proper screen reader support through mandatory accessible labels.

**Component:** `IconButton`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component
**React Aria:** Uses `Button` from react-aria-components (via Button component)
**Base Component:** Extends Button component

## Purpose

The IconButton capability provides an icon-only button component that maintains all the functionality and accessibility of the standard Button component while enforcing proper accessible labeling for screen reader users. It simplifies the creation of icon-only buttons by automatically applying zero padding and requiring aria-label for accessibility compliance.

## Requirements

### Requirement: Mandatory Accessible Label
The component SHALL require an accessible label for screen reader users.

#### Scenario: aria-label requirement
- **WHEN** IconButton is rendered
- **THEN** SHALL require aria-label prop as mandatory string
- **AND** SHALL be enforced at TypeScript level (non-optional prop)
- **AND** aria-label SHALL describe the button's action (not the icon itself)

#### Scenario: Screen reader announcement
- **WHEN** screen reader user focuses IconButton
- **THEN** SHALL announce the aria-label text
- **AND** SHALL NOT rely on icon content for accessible name
- **AND** SHALL follow WCAG 2.1 AA accessible name requirements

### Requirement: Icon-Only Content
The component SHALL render only an icon as visible content.

#### Scenario: Icon as children
- **WHEN** IconButton receives children prop
- **THEN** SHALL render icon component from @commercetools/nimbus-icons
- **AND** SHALL apply zero padding (px={0}, py={0}) to Button
- **AND** SHALL maintain square aspect ratio through recipe sizing

#### Scenario: No text content
- **WHEN** IconButton renders
- **THEN** SHALL NOT display visible text labels
- **AND** visible label SHALL be provided via aria-label only
- **AND** SHALL maintain icon-only appearance across all variants

### Requirement: Icon Button Sizes
The component SHALL support size variants inherited from Button.

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

### Requirement: Button Variants Inheritance
The component SHALL support all visual variants from Button component.

#### Scenario: Solid variant
- **WHEN** variant="solid" is set
- **THEN** SHALL render with solid background color
- **AND** SHALL use primary brand color by default
- **AND** SHALL provide high contrast icon color

#### Scenario: Subtle variant
- **WHEN** variant="subtle" is set (default)
- **THEN** SHALL render with subtle background
- **AND** SHALL show enhanced background on hover
- **AND** SHALL maintain icon color visibility

#### Scenario: Outline variant
- **WHEN** variant="outline" is set
- **THEN** SHALL render with transparent background and border
- **AND** SHALL use semantic color for border and icon
- **AND** SHALL show filled background on hover

#### Scenario: Ghost variant
- **WHEN** variant="ghost" is set
- **THEN** SHALL render with transparent background and no border
- **AND** SHALL show subtle background on hover
- **AND** SHALL maintain icon color visibility

#### Scenario: Link variant
- **WHEN** variant="link" is set
- **THEN** SHALL render with no background or border
- **AND** SHALL behave like a button (not anchor)
- **AND** SHALL support all button interactions

### Requirement: Semantic Colors
The component SHALL support semantic color palettes inherited from Button.

#### Scenario: Color variants
- **WHEN** colorPalette prop is set
- **THEN** SHALL accept: primary, neutral, info, positive, warning, critical
- **AND** SHALL apply appropriate semantic colors to icon and background
- **AND** SHALL maintain WCAG AA contrast ratios
- **AND** SHALL support light and dark modes

### Requirement: Disabled State
The component SHALL support disabled state inherited from Button.

#### Scenario: Disabled rendering
- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styles (reduced opacity)
- **AND** SHALL prevent click/keyboard interactions
- **AND** SHALL set aria-disabled="true"
- **AND** SHALL show not-allowed cursor

### Requirement: Loading State
The component SHALL support loading state inherited from Button.

#### Scenario: Loading indication
- **WHEN** loading={true} is set
- **THEN** SHALL display LoadingSpinner component
- **AND** SHALL disable button interactions
- **AND** SHALL maintain button dimensions (no layout shift)
- **AND** SHALL replace icon with spinner while loading

### Requirement: Press Handling
The component SHALL handle press interactions via Button component.

#### Scenario: Click event
- **WHEN** user clicks IconButton
- **THEN** SHALL call onPress handler if provided
- **AND** SHALL prevent multiple rapid clicks during loading
- **AND** SHALL work with form submission when type="submit"

### Requirement: Keyboard Interaction
The component SHALL support keyboard interactions per nimbus-core standards.

#### Scenario: Enter and Space keys
- **WHEN** button is focused and user presses Enter or Space
- **THEN** SHALL trigger onPress handler
- **AND** SHALL provide visual feedback (active state)
- **AND** SHALL follow React Aria keyboard patterns

#### Scenario: Focus management
- **WHEN** user navigates with Tab key
- **THEN** SHALL be focusable in logical tab order
- **AND** SHALL show visible focus indicator meeting 3:1 contrast ratio
- **AND** SHALL apply focusVisibleRing style from recipe

### Requirement: Form Button Types
The component SHALL support form-related button types inherited from Button.

#### Scenario: Submit button
- **WHEN** type="submit" is set
- **THEN** SHALL submit parent form on press
- **AND** SHALL trigger form validation

#### Scenario: Reset button
- **WHEN** type="reset" is set
- **THEN** SHALL reset parent form on press

#### Scenario: Button type (default)
- **WHEN** type="button" is set or no type specified
- **THEN** SHALL NOT submit form
- **AND** SHALL only trigger onPress handler

### Requirement: Recipe-Based Styling
The component SHALL use Button recipe with zero padding override.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply button recipe from theme/recipes/button.ts
- **AND** SHALL override padding with px={0} and py={0}
- **AND** SHALL support recipe props: variant, size, colorPalette
- **AND** recipe SHALL be registered in theme configuration

#### Scenario: Icon sizing
- **WHEN** component renders with specific size
- **THEN** SHALL apply icon width/height from recipe's _icon selector
- **AND** icon dimensions SHALL scale proportionally with button size
- **AND** SHALL maintain square aspect ratio

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
The component SHALL support rendering as different HTML elements inherited from Button.

#### Scenario: Custom element
- **WHEN** as prop is provided
- **THEN** SHALL render as specified element (e.g., as="a" for link)
- **AND** SHALL maintain button styling
- **AND** SHALL forward appropriate HTML attributes
- **AND** SHALL preserve button interactions and accessibility

### Requirement: ARIA Button Pattern
The component SHALL implement ARIA button pattern per nimbus-core standards.

#### Scenario: Button role
- **WHEN** component renders
- **THEN** SHALL have implicit button role from HTML element
- **AND** SHALL be keyboard accessible
- **AND** SHALL support Enter and Space activation

#### Scenario: Accessible name requirement
- **WHEN** IconButton renders
- **THEN** SHALL have accessible name from required aria-label prop
- **AND** SHALL NOT accept empty aria-label string
- **AND** accessible name SHALL describe action, not appearance

#### Scenario: State announcements
- **WHEN** loading state changes
- **THEN** SHALL announce to screen readers via aria-busy
- **WHEN** disabled
- **THEN** SHALL set aria-disabled="true"

### Requirement: Touch Target Size
The component SHALL meet minimum touch target requirements per nimbus-core standards.

#### Scenario: Minimum touch target
- **WHEN** IconButton renders in any size
- **THEN** SHALL meet minimum 44x44px touch target through size or padding
- **AND** small sizes (2xs, xs) SHALL achieve target size through outer spacing
- **AND** SHALL provide adequate spacing between adjacent icon buttons

### Requirement: TypeScript Props Type
The component SHALL extend ButtonProps with icon-specific constraints.

#### Scenario: Props type definition
- **WHEN** IconButtonProps is defined
- **THEN** SHALL extend ButtonProps from button.types.ts
- **AND** SHALL require aria-label as mandatory string (non-optional)
- **AND** SHALL support ref as React.Ref<HTMLButtonElement>
- **AND** SHALL inherit all Button props (variant, size, colorPalette, disabled, loading, onPress, type)

#### Scenario: JSDoc documentation
- **WHEN** IconButtonProps is exported
- **THEN** SHALL include JSDoc comments for all props
- **AND** SHALL document aria-label as required accessible label explaining intended action
- **AND** SHALL document ref as ref forwarding to button element
