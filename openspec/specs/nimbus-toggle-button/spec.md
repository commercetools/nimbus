# Specification: ToggleButton Component

## Overview

The ToggleButton component provides an accessible, styled toggle button that displays text labels (with optional icons) and maintains pressed/unpressed state. It combines Button's text and icon display capabilities with toggle state management, following the nimbus-core standards. It extends React Aria's ToggleButton component with Chakra UI v3 recipe styling and supports both controlled and uncontrolled modes.

**Component:** `ToggleButton`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component
**React Aria:** Uses `ToggleButton` from react-aria-components

## Purpose

The ToggleButton capability provides a button component that users can press to switch between selected and unselected states. Unlike IconToggleButton which is icon-only, ToggleButton displays text labels and optionally includes icons. It is ideal for toolbar actions, filtering controls, and any interface where a binary toggle state needs clear textual indication.

## Requirements

### Requirement: Text Label Display
The component SHALL display text labels as primary content.

#### Scenario: Text content rendering
- **WHEN** ToggleButton receives children prop with text
- **THEN** SHALL render text as visible button content
- **AND** SHALL apply appropriate typography from recipe
- **AND** SHALL maintain text visibility across all states

#### Scenario: Text as accessible name
- **WHEN** ToggleButton renders with text children
- **THEN** SHALL derive accessible name from text content
- **AND** SHALL NOT require aria-label when text is present
- **AND** SHALL follow WCAG 2.1 AA accessible name requirements

### Requirement: Icon Support
The component SHALL support optional icon display alongside text.

#### Scenario: Leading icon
- **WHEN** children contains icon component before text
- **THEN** SHALL render icon before button text
- **AND** SHALL apply appropriate spacing (gap) between icon and text from recipe
- **AND** SHALL size icon according to button size variant

#### Scenario: Trailing icon
- **WHEN** children contains icon component after text
- **THEN** SHALL render icon after button text
- **AND** SHALL apply appropriate spacing (gap) between text and icon from recipe
- **AND** SHALL maintain alignment with text baseline

#### Scenario: Icon-only usage
- **WHEN** children contains only icon component without text
- **THEN** component SHALL still render but SHOULD use IconToggleButton instead
- **AND** SHALL require aria-label for accessibility
- **AND** IconToggleButton is the preferred component for icon-only toggle buttons

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
- **WHEN** user clicks ToggleButton
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

#### Scenario: Disabled interaction prevention
- **WHEN** ToggleButton is disabled
- **THEN** SHALL NOT respond to click events
- **AND** SHALL NOT respond to keyboard events
- **AND** SHALL NOT call onChange handler
- **AND** SHALL maintain current selected/unselected state

### Requirement: Selected State Visual Differentiation
The component SHALL provide clear visual differentiation between selected and unselected states.

#### Scenario: Unselected state rendering
- **WHEN** isSelected={false} or not selected
- **THEN** SHALL render with unselected visual styling
- **AND** SHALL set data-selected="false" on button element
- **AND** SHALL NOT set aria-pressed="true"
- **AND** SHALL use default variant styling (transparent background, border)

#### Scenario: Selected state rendering
- **WHEN** isSelected={true} is set
- **THEN** SHALL render with selected visual styling
- **AND** SHALL set data-selected="true" on button element
- **AND** SHALL set aria-pressed="true"
- **AND** SHALL apply enhanced background color from colorPalette
- **AND** SHALL maintain border visibility in outline variant

#### Scenario: State transition animation
- **WHEN** state changes from selected to unselected or vice versa
- **THEN** SHALL provide smooth visual transition
- **AND** SHALL use design token animation durations
- **AND** SHALL maintain button dimensions (no layout shift)

### Requirement: Size Variants
The component SHALL support three size options.

#### Scenario: 2xs size
- **WHEN** size="2xs" is set
- **THEN** SHALL render with height 600 (24px) and minWidth 600 (24px)
- **AND** SHALL use fontSize 300 and lineHeight 400
- **AND** SHALL apply px 200 (horizontal padding)
- **AND** icon SHALL be 400 (16px) width and height
- **AND** SHALL maintain minimum 44x44px touch target with padding/margin

#### Scenario: xs size
- **WHEN** size="xs" is set
- **THEN** SHALL render with height 800 (32px) and minWidth 800 (32px)
- **AND** SHALL use fontSize 350 and lineHeight 400
- **AND** SHALL apply px 300 (horizontal padding)
- **AND** icon SHALL be 500 (20px) width and height
- **AND** SHALL maintain adequate touch target for mobile

#### Scenario: md size (default)
- **WHEN** size="md" is set or no size specified
- **THEN** SHALL render with height 1000 (40px) and minWidth 1000 (40px)
- **AND** SHALL use fontSize 400 and lineHeight 500
- **AND** SHALL apply px 400 (horizontal padding)
- **AND** icon SHALL be 600 (24px) width and height
- **AND** SHALL provide comfortable click and touch target

### Requirement: Visual Variants
The component SHALL support visual style variants for different UI contexts.

#### Scenario: Outline variant (default)
- **WHEN** variant="outline" is set or no variant specified
- **THEN** SHALL render with transparent background and border
- **AND** SHALL use border-width 25 (1px) from design tokens
- **AND** SHALL use border-color from colorPalette.7
- **AND** SHALL use text color from colorPalette.11
- **AND** WHEN unselected and hovered SHALL show background colorPalette.2
- **AND** WHEN selected SHALL show background colorPalette.3 and border colorPalette.8
- **AND** WHEN selected and hovered SHALL show background colorPalette.4

#### Scenario: Ghost variant
- **WHEN** variant="ghost" is set
- **THEN** SHALL render with transparent background and no border
- **AND** SHALL use text color neutral.11
- **AND** WHEN unselected and hovered SHALL show background colorPalette.2
- **AND** WHEN selected SHALL show background colorPalette.3 and text colorPalette.11
- **AND** WHEN selected and hovered SHALL show background colorPalette.4
- **AND** SHALL maintain text color visibility in all states

### Requirement: Semantic Color Palettes
The component SHALL support semantic color palettes.

#### Scenario: Color palette options
- **WHEN** colorPalette prop is set
- **THEN** SHALL accept: primary (default), neutral, info, positive, warning, critical
- **AND** SHALL apply appropriate semantic colors to text, border, and background
- **AND** SHALL maintain WCAG AA contrast ratios in all states
- **AND** SHALL support light and dark modes

#### Scenario: Selected state color application
- **WHEN** ToggleButton is in selected state
- **THEN** SHALL apply colorPalette background color
- **AND** SHALL enhance color intensity on hover
- **AND** SHALL use colorPalette text color
- **AND** SHALL maintain contrast requirements
- **AND** SHALL differentiate from unselected state clearly

### Requirement: Interactive States
The component SHALL provide visual feedback for all interaction states.

#### Scenario: Default state
- **WHEN** ToggleButton renders without interaction
- **THEN** SHALL display base styling from variant
- **AND** SHALL show current selected/unselected state
- **AND** SHALL be ready for interaction

#### Scenario: Hover state
- **WHEN** user hovers over ToggleButton
- **THEN** SHALL apply hover styling via data-hovered="true"
- **AND** SHALL enhance background color
- **AND** SHALL enhance border color in outline variant
- **AND** SHALL provide smooth transition from default state

#### Scenario: Focus state
- **WHEN** ToggleButton receives keyboard focus
- **THEN** SHALL display visible focus indicator
- **AND** SHALL meet 3:1 contrast ratio requirement
- **AND** SHALL apply focusVisibleRing style from recipe
- **AND** SHALL be distinguishable from default and hover states

#### Scenario: Active/pressed state
- **WHEN** user actively presses ToggleButton (mouse down or key pressed)
- **THEN** SHALL provide visual feedback
- **AND** SHALL apply active state styling
- **AND** SHALL be distinguishable from hover state

#### Scenario: Disabled state
- **WHEN** isDisabled={true} is set
- **THEN** SHALL apply disabled styles (reduced opacity)
- **AND** SHALL set data-disabled="true"
- **AND** SHALL prevent all interactions
- **AND** SHALL show not-allowed cursor
- **AND** SHALL set aria-disabled="true"
- **AND** SHALL maintain current selected/unselected state

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
- **AND** SHALL skip when disabled

#### Scenario: Tab navigation with Shift
- **WHEN** user presses Shift+Tab while ToggleButton is focused
- **THEN** SHALL move focus to previous focusable element
- **AND** SHALL follow document tab order

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI recipe per nimbus-core standards.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply toggleButton recipe from theme/recipes/toggle-button.ts
- **AND** recipe SHALL be registered in theme configuration
- **AND** SHALL support recipe props: variant, size, colorPalette
- **AND** SHALL inherit base styles from buttonRecipe

#### Scenario: Recipe variant splitting
- **WHEN** component receives props
- **THEN** SHALL use useRecipe hook to split variant props
- **AND** SHALL separate recipe props (variant, size, colorPalette) from functional props
- **AND** SHALL forward recipe props to ToggleButtonRoot slot component
- **AND** SHALL forward functional props to React Aria ToggleButton

#### Scenario: Style prop override
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra style props (padding, margin, width, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL forward style props to slot component

#### Scenario: Icon sizing from recipe
- **WHEN** component renders with icon
- **THEN** SHALL apply icon width/height from recipe's _icon selector
- **AND** icon dimensions SHALL scale proportionally with button size
- **AND** SHALL use gap property for icon-text spacing

### Requirement: ARIA Toggle Button Pattern
The component SHALL implement ARIA toggle button pattern per nimbus-core standards.

#### Scenario: Button role
- **WHEN** component renders
- **THEN** SHALL have implicit button role from HTML button element
- **AND** SHALL be keyboard accessible
- **AND** SHALL support Enter and Space activation

#### Scenario: Accessible name
- **WHEN** ToggleButton renders with text children
- **THEN** SHALL have accessible name from text content
- **AND** WHEN children is icon-only SHALL require aria-label prop
- **AND** accessible name SHALL describe action, not appearance

#### Scenario: Toggle state announcements
- **WHEN** toggle state changes
- **THEN** SHALL set aria-pressed attribute to reflect current state
- **AND** aria-pressed SHALL be "true" when selected (isSelected=true)
- **AND** aria-pressed SHALL be "false" when unselected (isSelected=false)
- **AND** screen readers SHALL announce pressed state changes
- **AND** SHALL follow React Aria ToggleButton implementation

#### Scenario: Disabled state announcements
- **WHEN** disabled
- **THEN** SHALL set aria-disabled="true"
- **AND** SHALL maintain aria-pressed value
- **AND** screen readers SHALL announce disabled state
- **AND** SHALL prevent interaction

### Requirement: Form Integration
The component SHALL support form-related attributes.

#### Scenario: Form field association
- **WHEN** name prop is provided
- **THEN** SHALL associate toggle state with form field name
- **AND** selected state SHALL be included in form submission
- **AND** SHALL work with standard form handling patterns

#### Scenario: Value representation
- **WHEN** value prop is provided
- **THEN** SHALL use specified value in form data when selected
- **AND** SHALL follow React Aria ToggleButton value semantics
- **AND** SHALL work with controlled form libraries

#### Scenario: Button type
- **WHEN** component renders
- **THEN** SHALL default to type="button"
- **AND** SHALL NOT submit forms when clicked (unless explicitly changed)
- **AND** SHALL only trigger toggle behavior

### Requirement: Ref Support
The component SHALL support ref forwarding to the button element.

#### Scenario: Ref forwarding
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to underlying button element
- **AND** SHALL support React.Ref<HTMLButtonElement> type
- **AND** SHALL allow direct DOM access for consumers

### Requirement: Polymorphic Rendering
The component SHALL support rendering as different HTML elements.

#### Scenario: Custom element
- **WHEN** as prop is provided via React Aria
- **THEN** SHALL render as specified element (e.g., as="a" for link)
- **AND** SHALL maintain toggle button styling and state
- **AND** SHALL forward appropriate HTML attributes
- **AND** SHALL preserve toggle button interactions and accessibility

### Requirement: Custom Styling
The component SHALL accept Chakra style props.

#### Scenario: Chakra style props
- **WHEN** Chakra style props are provided (margin, padding, width, etc.)
- **THEN** SHALL apply all Chakra system style props
- **AND** SHALL support responsive arrays: `[base, sm, md]`
- **AND** SHALL support responsive objects: `{ base, sm, md }`
- **AND** custom styles SHALL override recipe defaults

#### Scenario: Width control
- **WHEN** width prop is provided
- **THEN** SHALL render with specified width
- **AND** SHALL support token values (e.g., "1200", "full")
- **AND** SHALL support responsive width values
- **AND** SHALL maintain minWidth from size variant unless overridden

### Requirement: Touch Target Size
The component SHALL meet minimum touch target requirements per nimbus-core standards.

#### Scenario: Minimum touch target
- **WHEN** ToggleButton renders in any size
- **THEN** SHALL meet minimum 44x44px touch target through size or padding
- **AND** small sizes (2xs, xs) SHALL achieve target size through outer spacing
- **AND** SHALL provide adequate spacing between adjacent toggle buttons

### Requirement: TypeScript Props Type
The component SHALL provide comprehensive TypeScript type definitions.

#### Scenario: Props type definition
- **WHEN** ToggleButtonProps is defined
- **THEN** SHALL combine ToggleButtonRootSlotProps with React Aria ToggleButtonProps
- **AND** SHALL exclude internal props: css, colorScheme, recipe, as, asChild
- **AND** SHALL support ref as React.Ref<HTMLButtonElement>
- **AND** SHALL inherit all React Aria toggle button props (isSelected, defaultSelected, onChange, isDisabled)

#### Scenario: Recipe props type
- **WHEN** ToggleButtonRecipeProps is defined
- **THEN** SHALL include size: RecipeProps<"toggleButton">["size"]
- **AND** SHALL include variant: RecipeProps<"toggleButton">["variant"]
- **AND** SHALL provide autocomplete for variant and size values
- **AND** SHALL default size to "md" and variant to "outline"

#### Scenario: Slot props type
- **WHEN** ToggleButtonRootSlotProps is defined
- **THEN** SHALL extend HTMLChakraProps<"button", ToggleButtonRecipeProps>
- **AND** SHALL override colorPalette with SemanticPalettesOnly
- **AND** SHALL support all Chakra style props

#### Scenario: JSDoc documentation
- **WHEN** ToggleButtonProps is exported
- **THEN** SHALL include JSDoc comments for all props
- **AND** SHALL document size with @default "md"
- **AND** SHALL document variant with @default "outline"
- **AND** SHALL document colorPalette options
- **AND** SHALL document toggle state management (isSelected, defaultSelected, onChange)
- **AND** SHALL document ref as ref forwarding to button element

### Requirement: Slot Component Implementation
The component SHALL use Chakra's slot component pattern.

#### Scenario: ToggleButtonRoot slot
- **WHEN** component implementation requires styled slot
- **THEN** SHALL define ToggleButtonRoot using createRecipeContext
- **AND** SHALL specify recipe key as "toggleButton"
- **AND** SHALL set defaultProps with type="button"
- **AND** SHALL filter non-DOM props using shouldForwardProp
- **AND** SHALL prevent onPress properties from appearing as DOM attributes

#### Scenario: Slot component asChild pattern
- **WHEN** ToggleButton renders
- **THEN** SHALL use ToggleButtonRoot with asChild={true}
- **AND** SHALL render React Aria ToggleButton as child
- **AND** SHALL merge slot styling with React Aria functionality
- **AND** SHALL apply recipe styles to React Aria component

### Requirement: Loading State Support
The component SHALL support loading state inherited from Button recipe base styles.

#### Scenario: Loading indication capability
- **WHEN** future implementation adds loading prop
- **THEN** SHALL be supported via Button recipe base styles
- **AND** SHALL disable toggle interactions during loading
- **AND** SHALL maintain button dimensions (no layout shift)
- **AND** loading state SHALL work alongside selected/unselected states

### Requirement: Component Export
The component SHALL be properly exported for consumption.

#### Scenario: Named export
- **WHEN** component is imported
- **THEN** SHALL be exported as named export from index.ts
- **AND** SHALL have displayName set to "ToggleButton"
- **AND** SHALL be available from @commercetools/nimbus package

#### Scenario: Type exports
- **WHEN** types are imported
- **THEN** SHALL export ToggleButtonProps from toggle-button.types.ts
- **AND** types SHALL be re-exported from package index
- **AND** SHALL support TypeScript IntelliSense

### Requirement: Multi-Slot Recipe Structure
The component SHALL inherit styling structure from buttonRecipe with toggle-specific overrides.

#### Scenario: Recipe base styles
- **WHEN** toggleButtonRecipe is defined
- **THEN** SHALL spread all base styles from buttonRecipe.base
- **AND** SHALL override colorPalette default to "primary"
- **AND** SHALL maintain button base styles (borderRadius, display, transitions, etc.)

#### Scenario: Recipe size variants
- **WHEN** toggleButtonRecipe size variants are defined
- **THEN** SHALL spread all size variants from buttonRecipe.variants.size
- **AND** SHALL include 2xs, xs, and md sizes
- **AND** SHALL inherit height, minWidth, padding, fontSize, lineHeight, gap, and icon sizing

#### Scenario: Recipe variant overrides for toggle states
- **WHEN** toggleButtonRecipe defines outline variant
- **THEN** SHALL use CSS custom properties for theming (--button-bg, --button-text, --border-color)
- **AND** SHALL define data-selected="true" specific styles
- **AND** SHALL support hover enhancements when selected
- **AND** SHALL provide smooth state transitions

#### Scenario: Default variants
- **WHEN** component renders without explicit variant props
- **THEN** SHALL default to size="md"
- **AND** SHALL default to variant="outline"
- **AND** defaults SHALL be specified in recipe defaultVariants
