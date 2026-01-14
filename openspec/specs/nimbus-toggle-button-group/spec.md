# Specification: ToggleButtonGroup Component

## Overview

The ToggleButtonGroup component provides an accessible group of toggle buttons that supports both single selection (like radio buttons) and multiple selection (like checkboxes). It uses compound component architecture with ToggleButtonGroup.Root and ToggleButtonGroup.Button.

**Component:** `ToggleButtonGroup` (namespace export)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `ToggleButtonGroup` and `ToggleButton` from react-aria-components

## Purpose

The ToggleButtonGroup capability provides a group of closely related toggle buttons for presenting mutually exclusive options (single selection) or complementary options (multiple selection). It offers a compact, visually unified alternative to radio buttons or checkboxes when actions need prominent display with immediate visual feedback. The component follows WCAG 2.1 AA accessibility standards and implements appropriate ARIA patterns for both single and multiple selection modes.

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** ToggleButtonGroup is imported
- **THEN** SHALL provide ToggleButtonGroup.Root as group wrapper
- **AND** SHALL provide ToggleButtonGroup.Button for individual toggle buttons
- **AND** Root SHALL be first property in namespace

### Requirement: Single Selection Mode
ToggleButtonGroup.Root SHALL support single selection mode where only one button can be selected.

#### Scenario: Single selection state
- **WHEN** selectionMode is not specified or set to "single"
- **THEN** SHALL allow only one button to be selected at a time
- **AND** SHALL deselect previously selected button when new button is selected
- **AND** SHALL allow deselecting by clicking selected button again
- **AND** SHALL implement ARIA radiogroup pattern with role="radiogroup"

#### Scenario: Single selection controlled mode
- **WHEN** selectedKeys prop contains single value (Set with one item)
- **THEN** SHALL render with specified button selected
- **AND** SHALL call onSelectionChange with new Set containing one value
- **AND** SHALL NOT update internal state

#### Scenario: Single selection uncontrolled mode
- **WHEN** defaultSelectedKeys prop is provided without selectedKeys
- **THEN** SHALL initialize with default selection
- **AND** SHALL manage state internally via React Aria
- **AND** optional onSelectionChange SHALL receive state updates

### Requirement: Multiple Selection Mode
ToggleButtonGroup.Root SHALL support multiple selection mode where multiple buttons can be selected.

#### Scenario: Multiple selection state
- **WHEN** selectionMode="multiple"
- **THEN** SHALL allow multiple buttons to be selected simultaneously
- **AND** SHALL toggle individual button selection independently
- **AND** clicking selected button SHALL deselect it without affecting others
- **AND** SHALL implement ARIA toolbar pattern with role="toolbar"

#### Scenario: Multiple selection controlled mode
- **WHEN** selectedKeys prop contains multiple values (Set with multiple items)
- **THEN** SHALL render with specified buttons selected
- **AND** SHALL call onSelectionChange with new Set containing all selected values
- **AND** SHALL NOT update internal state

#### Scenario: Multiple selection uncontrolled mode
- **WHEN** defaultSelectedKeys prop is provided with multiple values
- **THEN** SHALL initialize with multiple selections
- **AND** SHALL manage state internally via React Aria
- **AND** optional onSelectionChange SHALL receive state updates

### Requirement: Button Value Tracking
Each ToggleButtonGroup.Button SHALL have unique value for selection tracking.

#### Scenario: Button value assignment
- **WHEN** ToggleButtonGroup.Button has id prop
- **THEN** SHALL use id as unique value for selection
- **AND** id SHALL be used in selectedKeys Set
- **AND** id MUST be unique within the group

#### Scenario: Selection state communication
- **WHEN** button selection changes
- **THEN** SHALL call onSelectionChange with Set containing selected button ids
- **AND** SHALL pass complete Set of all currently selected ids
- **AND** SHALL work with both single and multiple selection modes

### Requirement: Button Selection Interaction
The component SHALL respond to user interactions to toggle button states.

#### Scenario: Click selection
- **WHEN** user clicks ToggleButtonGroup.Button
- **THEN** SHALL toggle button selected state
- **AND** SHALL update selection according to selectionMode
- **AND** SHALL call onSelectionChange with updated Set
- **AND** SHALL provide visual feedback via data-selected attribute

#### Scenario: Keyboard selection
- **WHEN** button is focused and user presses Space or Enter
- **THEN** SHALL toggle button selected state
- **AND** SHALL call onSelectionChange handler
- **AND** SHALL provide visual feedback
- **AND** SHALL follow React Aria ToggleButton keyboard patterns

#### Scenario: Disabled button interaction prevention
- **WHEN** ToggleButtonGroup.Button is disabled
- **THEN** SHALL NOT respond to click events
- **AND** SHALL NOT respond to keyboard events
- **AND** SHALL NOT call onSelectionChange handler
- **AND** SHALL maintain current selected state

### Requirement: Arrow Key Navigation
The component SHALL support keyboard navigation between buttons per nimbus-core standards.

#### Scenario: Horizontal navigation
- **WHEN** orientation="horizontal" (default) and user presses ArrowRight
- **THEN** SHALL move focus to next button
- **AND** SHALL wrap to first button if at end
- **WHEN** user presses ArrowLeft
- **THEN** SHALL move focus to previous button
- **AND** SHALL wrap to last button if at beginning

#### Scenario: Vertical navigation
- **WHEN** orientation="vertical" is set and user presses ArrowDown
- **THEN** SHALL move focus to next button
- **AND** SHALL wrap to first button if at end
- **WHEN** user presses ArrowUp
- **THEN** SHALL move focus to previous button
- **AND** SHALL wrap to last button if at beginning

#### Scenario: Tab navigation
- **WHEN** user presses Tab
- **THEN** SHALL move focus to next focusable element outside group
- **WHEN** Shift+Tab is pressed
- **THEN** SHALL move focus to previous focusable element outside group

#### Scenario: Focus management with roving tabindex
- **WHEN** group receives focus
- **THEN** SHALL focus first button in group
- **AND** only one button SHALL be in tab order at a time (tabindex="0")
- **AND** other buttons SHALL have tabindex="-1"
- **AND** SHALL use roving tabindex pattern for arrow key navigation

### Requirement: Orientation Support
The component SHALL support horizontal and vertical layout orientations.

#### Scenario: Horizontal orientation
- **WHEN** orientation="horizontal" (default)
- **THEN** SHALL arrange buttons horizontally in a row
- **AND** SHALL use ArrowLeft/Right for navigation
- **AND** SHALL set aria-orientation="horizontal" on group

#### Scenario: Vertical orientation
- **WHEN** orientation="vertical" is set
- **THEN** SHALL arrange buttons vertically in a column
- **AND** SHALL use ArrowUp/Down for navigation
- **AND** SHALL set aria-orientation="vertical" on group


### Requirement: Size Options
The component SHALL support size variants that propagate to all buttons.

#### Scenario: xs size
- **WHEN** size="xs" is set on Root
- **THEN** SHALL apply xs size to all buttons in group
- **AND** buttons SHALL render with height 800 (32px)
- **AND** SHALL use fontSize 350 and lineHeight 400
- **AND** SHALL apply px 300 (horizontal padding)
- **AND** icon SHALL be 500 (20px) width and height

#### Scenario: md size (default)
- **WHEN** size="md" is set or no size specified on Root
- **THEN** SHALL apply md size to all buttons in group
- **AND** buttons SHALL render with height 1000 (40px)
- **AND** SHALL use fontSize 400 and lineHeight 500
- **AND** SHALL apply px 400 (horizontal padding)
- **AND** icon SHALL be 600 (24px) width and height


### Requirement: Button Group Visual Treatment
The component SHALL apply cohesive visual styling to create unified button group.

#### Scenario: Grouped button appearance
- **WHEN** buttons are children of Root
- **THEN** SHALL remove inner borders between buttons (borderRightWidth: 0)
- **AND** SHALL apply border radius only to first and last buttons
- **AND** first button SHALL have left border radius (200)
- **AND** last button SHALL have right border radius (200) and right border
- **AND** middle buttons SHALL have no border radius

#### Scenario: Unselected button styling
- **WHEN** button is not selected (data-selected="false")
- **THEN** SHALL render with outline variant styling
- **AND** SHALL use transparent background
- **AND** SHALL use border from colorPalette
- **AND** SHALL use text color from colorPalette.11

#### Scenario: Selected button styling
- **WHEN** button is selected (data-selected="true")
- **THEN** SHALL render with solid variant styling
- **AND** SHALL use background from colorPalette
- **AND** SHALL use enhanced border color
- **AND** SHALL provide clear visual distinction from unselected state


### Requirement: Semantic Color Palettes
The component SHALL support semantic color palettes that propagate to all buttons.

#### Scenario: Color palette options
- **WHEN** colorPalette prop is set on Root
- **THEN** SHALL support: primary (default), neutral, critical
- **AND** SHALL apply appropriate semantic colors to all buttons
- **AND** SHALL maintain WCAG AA contrast ratios in all states
- **AND** SHALL support light and dark modes

#### Scenario: Color palette propagation
- **WHEN** colorPalette is set on Root
- **THEN** SHALL apply colorPalette to all buttons in group
- **AND** SHALL use palette for unselected button borders and text
- **AND** SHALL use palette for selected button backgrounds
- **AND** SHALL maintain consistent color usage across all buttons


### Requirement: Individual Button States
ToggleButtonGroup.Button SHALL support disabled state for individual buttons.

#### Scenario: Disabled individual button
- **WHEN** ToggleButtonGroup.Button has isDisabled={true}
- **THEN** SHALL apply disabled styling (reduced opacity)
- **AND** SHALL skip during keyboard navigation
- **AND** SHALL not be selectable via click or keyboard
- **AND** SHALL set aria-disabled="true"
- **AND** SHALL maintain current selected/unselected state

### Requirement: Group Disabled State
ToggleButtonGroup.Root SHALL support disabling entire group.

#### Scenario: Disabled group
- **WHEN** Root has isDisabled={true}
- **THEN** SHALL disable all buttons in group
- **AND** SHALL apply disabled styling to all buttons
- **AND** SHALL prevent all interactions
- **AND** group SHALL not be in tab order
- **AND** SHALL maintain current selection state visually


### Requirement: ARIA Patterns
The component SHALL implement appropriate ARIA patterns per nimbus-core standards.

#### Scenario: Single selection ARIA roles
- **WHEN** selectionMode="single" or not specified
- **THEN** Root SHALL have role="radiogroup"
- **AND** each Button SHALL have role="radio"
- **AND** selected button SHALL have aria-checked="true"
- **AND** unselected buttons SHALL have aria-checked="false"

#### Scenario: Multiple selection ARIA roles
- **WHEN** selectionMode="multiple"
- **THEN** Root SHALL have role="toolbar"
- **AND** each Button SHALL have role="button"
- **AND** selected buttons SHALL have aria-pressed="true"
- **AND** unselected buttons SHALL have aria-pressed="false"

#### Scenario: Group labeling
- **WHEN** group renders
- **THEN** SHALL have accessible label via aria-label or aria-labelledby
- **AND** label SHALL describe purpose of button group
- **AND** SHALL be announced by screen readers

#### Scenario: State announcements
- **WHEN** button selection changes
- **THEN** SHALL announce new selection state to screen readers
- **AND** SHALL provide clear indication of selected/unselected
- **AND** SHALL announce which button is selected


### Requirement: Form Compatibility
The component SHALL integrate with HTML forms per nimbus-core standards.

#### Scenario: Form field association
- **WHEN** name prop is provided to Root
- **THEN** SHALL associate selection state with form field name
- **AND** selected button ids SHALL be included in form submission
- **AND** SHALL work with standard form handling patterns

#### Scenario: Single selection form submission
- **WHEN** selectionMode="single" and form is submitted
- **THEN** SHALL submit single selected button id as field value
- **AND** SHALL use name prop as field name
- **AND** SHALL submit empty/null if no selection

#### Scenario: Multiple selection form submission
- **WHEN** selectionMode="multiple" and form is submitted
- **THEN** SHALL submit array of selected button ids
- **AND** SHALL use name prop as field name
- **AND** SHALL submit empty array if no selections


### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** group renders
- **THEN** SHALL apply buttonGroupRecipe slot recipe from toggle-button-group.recipe.ts
- **AND** SHALL style: root, button slots
- **AND** SHALL support design tokens for spacing, colors, borders, shadows
- **AND** recipe SHALL be registered in theme configuration

#### Scenario: Button slot inheritance
- **WHEN** button slot is styled
- **THEN** SHALL inherit base styles from buttonRecipe.base
- **AND** SHALL inherit outline variant styles from buttonRecipe
- **AND** SHALL apply toggle-specific overrides for grouping
- **AND** selected state SHALL use solid variant styles from buttonRecipe


### Requirement: Recipe Context Propagation
The component SHALL use Chakra's slot recipe context to propagate styling.

#### Scenario: Context provider
- **WHEN** Root renders
- **THEN** SHALL create slot recipe context using createSlotRecipeContext
- **AND** SHALL use withProvider to wrap React Aria ToggleButtonGroup
- **AND** SHALL pass recipe configuration to provider
- **AND** SHALL make context available to child buttons

#### Scenario: Context consumer
- **WHEN** Button renders
- **THEN** SHALL consume recipe context using withContext
- **AND** SHALL apply button slot styles from recipe
- **AND** SHALL merge recipe styles with React Aria functionality
- **AND** SHALL support style overrides via props


### Requirement: Namespace Export
The component SHALL be properly exported as compound component.

#### Scenario: Compound export
- **WHEN** component is imported
- **THEN** SHALL export ToggleButtonGroup namespace object
- **AND** SHALL have Root as first property
- **AND** SHALL have Button as second property
- **AND** SHALL be available from @commercetools/nimbus package

#### Scenario: Display names
- **WHEN** components render in dev tools
- **THEN** Root SHALL have displayName "ToggleButtonGroup.Root"
- **AND** Button SHALL have displayName "ToggleButtonGroup.Button"
- **AND** SHALL support debugging and error messages


### Requirement: Comprehensive Type Definitions
The component SHALL provide complete TypeScript type definitions.

#### Scenario: Root props type
- **WHEN** ToggleButtonGroupProps is defined
- **THEN** SHALL combine recipe variant props with React Aria ToggleButtonGroupProps
- **AND** SHALL include size: "xs" | "md"
- **AND** SHALL include colorPalette: SemanticPalettesOnly
- **AND** SHALL include selectionMode, selectedKeys, defaultSelectedKeys, onSelectionChange
- **AND** SHALL include orientation: "horizontal" | "vertical"
- **AND** SHALL include isDisabled prop
- **AND** SHALL support ref as React.Ref<typeof RacToggleButtonGroup>

#### Scenario: Button props type
- **WHEN** ToggleButtonGroupButtonProps is defined
- **THEN** SHALL combine slot props with React Aria ToggleButtonProps
- **AND** SHALL include id prop (required for value tracking)
- **AND** SHALL include isDisabled prop for individual button
- **AND** SHALL support ref as React.Ref<typeof RacToggleButton>
- **AND** SHALL inherit all Chakra style props

#### Scenario: JSDoc documentation
- **WHEN** types are exported
- **THEN** SHALL include JSDoc comments for all props
- **AND** SHALL document size with @default "md"
- **AND** SHALL document colorPalette options
- **AND** SHALL document selection modes and state management
- **AND** SHALL document ref forwarding


### Requirement: React Aria ToggleButtonGroup Usage
The component SHALL use React Aria Components for accessibility and behavior.

#### Scenario: Group component usage
- **WHEN** Root renders
- **THEN** SHALL use ToggleButtonGroup from react-aria-components
- **AND** SHALL wrap with Chakra slot recipe provider
- **AND** SHALL forward all React Aria props
- **AND** SHALL merge Chakra styling with React Aria functionality

#### Scenario: Button component usage
- **WHEN** Button renders
- **THEN** SHALL use ToggleButton from react-aria-components
- **AND** SHALL wrap with Chakra slot recipe consumer
- **AND** SHALL forward all React Aria props
- **AND** SHALL merge Chakra styling with React Aria functionality


### Requirement: Visual Feedback for Interaction States
The component SHALL provide visual feedback for all interaction states.

#### Scenario: Default state
- **WHEN** button renders without interaction
- **THEN** SHALL display base styling from variant
- **AND** SHALL show current selected/unselected state
- **AND** SHALL be ready for interaction

#### Scenario: Hover state
- **WHEN** user hovers over button
- **THEN** SHALL apply hover styling via data-hovered="true"
- **AND** SHALL enhance background color
- **AND** SHALL provide smooth transition from default state

#### Scenario: Focus state
- **WHEN** button receives keyboard focus
- **THEN** SHALL display visible focus indicator
- **AND** SHALL meet 3:1 contrast ratio requirement
- **AND** SHALL apply focusVisibleRing style from recipe
- **AND** SHALL be distinguishable from default and hover states

#### Scenario: Active/pressed state
- **WHEN** user actively presses button (mouse down or key pressed)
- **THEN** SHALL provide visual feedback
- **AND** SHALL apply active state styling
- **AND** SHALL be distinguishable from hover state


### Requirement: Minimum Touch Target Size
The component SHALL meet minimum touch target requirements per nimbus-core standards.

#### Scenario: Touch target compliance
- **WHEN** buttons render in any size
- **THEN** SHALL meet minimum 44x44px touch target through size or padding
- **AND** xs size SHALL achieve target size through button height and padding
- **AND** SHALL provide adequate spacing between buttons
- **AND** grouped buttons SHALL maintain usable touch targets without overlap
