# Specification: SplitButton Component

## Overview

The SplitButton component combines a primary action button with a dropdown menu button, providing quick access to a default action while maintaining visibility of related actions. The component automatically selects the first enabled menu item as the primary action and displays all actions in the dropdown menu.

**Component:** `SplitButton`
**Package:** `@commercetools/nimbus`
**Type:** Single component (multi-slot recipe)
**React Aria:** Uses `Menu`, `MenuTrigger`, `Button` from react-aria-components

## Purpose

The SplitButton capability provides a compact UI pattern for presenting a primary action alongside related alternative actions. It reduces visual clutter compared to multiple standalone buttons while ensuring the most common action remains immediately accessible. The component follows WCAG 2.1 AA accessibility standards and implements the ARIA menu button pattern for the dropdown portion.

## Requirements

### Requirement: Primary Action Button
The component SHALL provide a primary action button that executes the first enabled menu item action.

#### Scenario: Primary button content selection
- **WHEN** SplitButton renders with Menu.Item children
- **THEN** SHALL display first enabled Menu.Item text on primary button
- **AND** SHALL use first enabled Menu.Item id for action execution
- **AND** SHALL skip disabled Menu.Items when finding primary action
- **AND** SHALL traverse nested Menu.Section components to find items

#### Scenario: Primary button action execution
- **WHEN** user clicks primary button
- **THEN** SHALL call onAction handler with first enabled Menu.Item id
- **AND** SHALL NOT open dropdown menu
- **AND** SHALL execute action immediately
- **AND** SHALL not execute if primary Menu.Item is disabled

#### Scenario: Primary button with icon
- **WHEN** icon prop is provided
- **THEN** SHALL render icon before button text on primary button
- **AND** SHALL wrap icon with Icon component automatically
- **AND** SHALL apply appropriate spacing between icon and text
- **AND** SHALL inherit size from button size variant

### Requirement: Dropdown Trigger Button
The component SHALL provide a dropdown trigger button that opens the menu with all actions.

#### Scenario: Trigger button activation
- **WHEN** user clicks dropdown trigger button
- **THEN** SHALL open menu overlay
- **AND** SHALL focus first menu item
- **AND** SHALL set aria-expanded="true"
- **AND** SHALL position menu below trigger (bottom end placement)

#### Scenario: Trigger button keyboard
- **WHEN** trigger is focused and user presses Enter or Space
- **THEN** SHALL open menu
- **AND** SHALL focus first menu item
- **AND** SHALL follow React Aria MenuTrigger keyboard patterns

#### Scenario: Trigger button icon
- **WHEN** trigger button renders
- **THEN** SHALL display KeyboardArrowDown icon
- **AND** SHALL use IconButton component
- **AND** SHALL require aria-label prop for accessibility

### Requirement: Visual Unity
The component SHALL visually group the primary button and trigger button as a unified control.

#### Scenario: Button group appearance
- **WHEN** component renders
- **THEN** primary button SHALL have left border radius only
- **AND** primary button SHALL have no right border
- **AND** trigger button SHALL have right border radius only
- **AND** trigger button SHALL have left border radius of 0
- **AND** buttons SHALL appear connected without gap

#### Scenario: Visual separator
- **WHEN** variant="solid"
- **THEN** trigger button SHALL have left border with colorPalette.contrast color (white delimiter)
- **WHEN** variant="ghost"
- **THEN** trigger button SHALL have left border with colorPalette.7 color (theme-aware border)
- **AND** separator SHALL create clear visual distinction between buttons

#### Scenario: Focus ring visibility
- **WHEN** either button receives focus
- **THEN** focused button SHALL have z-index: 2 to ensure focus ring visibility
- **AND** focus ring SHALL not be obscured by adjacent button
- **AND** SHALL meet 3:1 contrast ratio for focus indicator

### Requirement: Menu Content
The component SHALL display all actions in dropdown menu regardless of primary button selection.

#### Scenario: Menu items rendering
- **WHEN** menu opens
- **THEN** SHALL render all provided Menu.Item children
- **AND** SHALL include first Menu.Item that is shown on primary button
- **AND** SHALL support Menu.Section for grouping
- **AND** SHALL support Separator for visual dividers
- **AND** SHALL preserve original Menu.Item order

#### Scenario: Menu item selection
- **WHEN** user selects item from menu
- **THEN** SHALL call onAction handler with selected Menu.Item id
- **AND** SHALL close menu after selection
- **AND** SHALL NOT change primary button content
- **AND** primary button SHALL continue showing first enabled action

#### Scenario: Menu keyboard navigation
- **WHEN** menu is open
- **THEN** SHALL support ArrowDown/ArrowUp to navigate items
- **AND** SHALL support Home to focus first item
- **AND** SHALL support End to focus last item
- **AND** SHALL support typeahead search
- **AND** SHALL skip disabled items during navigation

### Requirement: Menu Closure
The component SHALL close menu in appropriate situations.

#### Scenario: Escape key closure
- **WHEN** menu is open and user presses Escape
- **THEN** SHALL close menu
- **AND** SHALL return focus to trigger button
- **AND** SHALL set aria-expanded="false"

#### Scenario: Outside click closure
- **WHEN** menu is open and user clicks outside
- **THEN** SHALL close menu
- **AND** SHALL not prevent outside click action

#### Scenario: Item selection closure
- **WHEN** user selects menu item
- **THEN** SHALL close menu by default
- **AND** SHALL execute selected action

### Requirement: Size Variants
The component SHALL support size options that propagate to both buttons.

#### Scenario: 2xs size
- **WHEN** size="2xs" is set
- **THEN** SHALL apply 2xs size to primary button
- **AND** SHALL apply 2xs size to trigger button
- **AND** buttons SHALL maintain size consistency
- **AND** icon SHALL scale appropriately

#### Scenario: xs size
- **WHEN** size="xs" is set
- **THEN** SHALL apply xs size to primary button
- **AND** SHALL apply xs size to trigger button
- **AND** buttons SHALL maintain size consistency
- **AND** icon SHALL scale appropriately

#### Scenario: md size (default)
- **WHEN** size="md" is set or no size specified
- **THEN** SHALL apply md size to primary button
- **AND** SHALL apply md size to trigger button
- **AND** buttons SHALL maintain size consistency
- **AND** icon SHALL scale appropriately

### Requirement: Visual Variants
The component SHALL support visual style variants that apply to both buttons.

#### Scenario: Solid variant (default)
- **WHEN** variant="solid" is set or no variant specified
- **THEN** SHALL apply solid styling to both buttons
- **AND** SHALL use colorPalette for button backgrounds
- **AND** SHALL use white/contrast color for text
- **AND** SHALL use colorPalette.contrast for separator border

#### Scenario: Subtle variant
- **WHEN** variant="subtle" is set
- **THEN** SHALL apply subtle styling to both buttons
- **AND** SHALL use subtle background color
- **AND** SHALL use theme-appropriate text color
- **AND** buttons SHALL maintain visual unity

#### Scenario: Outline variant
- **WHEN** variant="outline" is set
- **THEN** SHALL apply outline styling to both buttons
- **AND** SHALL use transparent background with border
- **AND** SHALL use colorPalette for border and text
- **AND** buttons SHALL appear as unified outlined group

#### Scenario: Ghost variant
- **WHEN** variant="ghost" is set
- **THEN** SHALL apply ghost styling to both buttons
- **AND** SHALL use transparent background with no outer border
- **AND** SHALL show subtle background on hover
- **AND** SHALL use colorPalette.7 for separator border

### Requirement: Color Palette Support
The component SHALL support semantic color palettes that apply to both buttons.

#### Scenario: Color palette options
- **WHEN** colorPalette prop is set
- **THEN** SHALL support: primary, neutral, info, positive, warning, critical
- **AND** SHALL apply palette to both buttons consistently
- **AND** SHALL use palette for backgrounds, borders, and text
- **AND** SHALL maintain WCAG AA contrast ratios
- **AND** SHALL support light and dark modes

#### Scenario: Default color palette
- **WHEN** colorPalette is not specified
- **THEN** SHALL use primary palette by default
- **AND** SHALL inherit Button component default behavior

### Requirement: Disabled States
The component SHALL support disabling the entire component or specific parts.

#### Scenario: Component disabled
- **WHEN** isDisabled={true} is set
- **THEN** SHALL disable primary button
- **AND** SHALL disable trigger button
- **AND** SHALL prevent all interactions
- **AND** SHALL apply disabled styling (reduced opacity)
- **AND** SHALL set aria-disabled="true" on both buttons
- **AND** trigger SHALL not open menu

#### Scenario: Primary action disabled with available alternatives
- **WHEN** first Menu.Item is disabled but others are enabled
- **THEN** SHALL select first enabled Menu.Item as primary action
- **AND** primary button SHALL be enabled
- **AND** trigger button SHALL be enabled
- **AND** disabled items SHALL be skipped in selection logic

#### Scenario: All menu items disabled
- **WHEN** all Menu.Items have isDisabled={true}
- **THEN** primary button SHALL show first Menu.Item text but be disabled
- **AND** trigger button SHALL be disabled
- **AND** SHALL not open menu when trigger is clicked
- **AND** SHALL display fallback content if no items available

#### Scenario: No actionable menu items
- **WHEN** no Menu.Items exist or none have valid id props
- **THEN** primary button SHALL show "No actions available" fallback text
- **AND** primary button SHALL be disabled
- **AND** trigger button SHALL be disabled
- **AND** SHALL provide clear indication of unavailable state

### Requirement: Menu Positioning
The component SHALL position menu overlay relative to button group.

#### Scenario: Default placement
- **WHEN** menu opens
- **THEN** SHALL position menu below button group
- **AND** SHALL align menu to right edge (bottom end placement)
- **AND** SHALL use React Aria overlay positioning
- **AND** SHALL auto-adjust if insufficient viewport space

#### Scenario: Scroll handling
- **WHEN** menu items exceed viewport height
- **THEN** SHALL enable scrolling within menu
- **AND** SHALL maintain focus visibility during scroll
- **AND** SHALL support keyboard navigation through scrolled items

### Requirement: Controlled Menu State
The component SHALL support controlled menu open/close state.

#### Scenario: Controlled open state
- **WHEN** isOpen prop is provided
- **THEN** SHALL control menu open state externally
- **AND** SHALL call onOpenChange when state should change
- **AND** SHALL NOT manage open state internally

#### Scenario: Uncontrolled open state
- **WHEN** defaultOpen prop is provided without isOpen
- **THEN** SHALL initialize with specified open state
- **AND** SHALL manage state internally via React Aria
- **AND** optional onOpenChange SHALL receive state updates

#### Scenario: Open change callback
- **WHEN** menu opens or closes
- **THEN** onOpenChange SHALL be called with new boolean state
- **AND** SHALL be called for user interactions (clicks, keyboard, outside clicks)
- **AND** SHALL support both controlled and uncontrolled modes

### Requirement: Menu Item Requirements
The component SHALL validate and process Menu.Item children appropriately.

#### Scenario: Menu.Item id requirement
- **WHEN** Menu.Item is provided as child
- **THEN** SHALL require id prop for action tracking
- **AND** id SHALL be passed to onAction handler
- **AND** Menu.Items without id SHALL be skipped in primary selection
- **AND** SHALL support Menu.Items in direct children or nested in Menu.Section

#### Scenario: Menu.Item traversal
- **WHEN** finding primary action
- **THEN** SHALL recursively traverse all children
- **AND** SHALL find Menu.Items inside Menu.Section components
- **AND** SHALL collect all Menu.Items regardless of nesting depth
- **AND** SHALL maintain order for primary selection logic

#### Scenario: Empty children handling
- **WHEN** no children are provided
- **THEN** SHALL show "No actions available" on primary button
- **AND** primary button SHALL be disabled
- **AND** trigger button SHALL be disabled
- **AND** SHALL not crash or error

### Requirement: Focus Management
The component SHALL manage focus appropriately per nimbus-core standards.

#### Scenario: Tab navigation between buttons
- **WHEN** user presses Tab on primary button
- **THEN** SHALL move focus to trigger button
- **WHEN** user presses Tab on trigger button
- **THEN** SHALL move focus to next focusable element outside component

#### Scenario: Menu opening focus
- **WHEN** menu opens
- **THEN** SHALL move focus to first menu item
- **AND** SHALL trap Tab key within menu
- **AND** focus SHALL be visible and announced

#### Scenario: Menu closing focus
- **WHEN** menu closes
- **THEN** SHALL return focus to trigger button
- **AND** focus SHALL be visible
- **AND** user SHALL be able to continue keyboard navigation

### Requirement: Accessibility Attributes
The component SHALL provide appropriate ARIA attributes per nimbus-core standards.

#### Scenario: Primary button accessibility
- **WHEN** primary button renders
- **THEN** SHALL have accessible name from Menu.Item text
- **AND** SHALL have role="button"
- **AND** SHALL announce action when activated
- **AND** SHALL set aria-disabled when disabled

#### Scenario: Trigger button accessibility
- **WHEN** trigger button renders
- **THEN** SHALL have aria-label from required aria-label prop
- **AND** SHALL have aria-haspopup="menu"
- **AND** SHALL have aria-expanded reflecting menu state
- **AND** SHALL set aria-controls to reference menu content ID
- **AND** SHALL have role="button"

#### Scenario: Menu accessibility
- **WHEN** menu renders
- **THEN** SHALL implement ARIA menu pattern
- **AND** Menu.Content SHALL have role="menu"
- **AND** Menu.Item SHALL have role="menuitem"
- **AND** disabled items SHALL have aria-disabled="true"
- **AND** SHALL announce menu items to screen readers

#### Scenario: Screen reader announcements
- **WHEN** component state changes
- **THEN** SHALL announce primary action to screen readers
- **AND** SHALL announce menu open/close state
- **AND** SHALL announce selected menu item
- **AND** SHALL announce when actions are disabled or unavailable

### Requirement: Action Handler
The component SHALL provide unified action handling for both button types.

#### Scenario: Primary button action
- **WHEN** primary button is clicked
- **THEN** SHALL call onAction with first enabled Menu.Item id
- **AND** SHALL pass id as string parameter
- **AND** SHALL NOT open menu

#### Scenario: Menu item action
- **WHEN** menu item is selected
- **THEN** SHALL call onAction with selected Menu.Item id
- **AND** SHALL pass id as string parameter
- **AND** SHALL close menu after calling handler

#### Scenario: Required action handler
- **WHEN** component is instantiated
- **THEN** onAction prop SHALL be required
- **AND** SHALL be called for all action executions
- **AND** SHALL provide single unified callback for all actions

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** component renders
- **THEN** SHALL apply splitButton slot recipe from split-button.recipe.ts
- **AND** SHALL style: root, buttonGroup, primaryButton, dropdownTrigger slots
- **AND** SHALL support design tokens for spacing, colors, borders, shadows
- **AND** recipe SHALL be registered in theme configuration

#### Scenario: Recipe variants
- **WHEN** variant prop is provided
- **THEN** SHALL apply variant-specific styles to both buttons
- **AND** SHALL use variant to determine separator border color
- **AND** solid variant SHALL use colorPalette.contrast for separator
- **AND** ghost variant SHALL use colorPalette.7 for separator

#### Scenario: Recipe integration with Button components
- **WHEN** buttons render
- **THEN** primary button SHALL use Button component with recipe slot wrapper
- **AND** trigger SHALL use IconButton component with recipe slot wrapper
- **AND** SHALL apply slot styles via asChild pattern
- **AND** SHALL merge recipe styles with Button component styles

### Requirement: Slot Components
The component SHALL use slot components for consistent styling architecture.

#### Scenario: Root slot
- **WHEN** SplitButtonRootSlot renders
- **THEN** SHALL create slot recipe context using withProvider
- **AND** SHALL render as div element
- **AND** SHALL apply root slot styles
- **AND** SHALL have data-mode="split" attribute for styling hooks

#### Scenario: Button group slot
- **WHEN** SplitButtonButtonGroupSlot renders
- **THEN** SHALL consume recipe context using withContext
- **AND** SHALL render as div element
- **AND** SHALL apply inline-flex layout
- **AND** SHALL apply border radius to group

#### Scenario: Primary button slot
- **WHEN** SplitButtonPrimaryButtonSlot renders
- **THEN** SHALL consume recipe context using withContext
- **AND** SHALL use asChild to merge with Button component
- **AND** SHALL apply left border radius only
- **AND** SHALL remove right border
- **AND** SHALL apply z-index on focus for focus ring visibility

#### Scenario: Trigger slot
- **WHEN** SplitButtonTriggerSlot renders
- **THEN** SHALL consume recipe context using withContext
- **AND** SHALL use asChild to merge with IconButton component
- **AND** SHALL apply right border radius only
- **AND** SHALL apply left border for separator
- **AND** SHALL apply z-index on focus for focus ring visibility

### Requirement: React Aria Integration
The component SHALL use React Aria Components for accessibility and behavior.

#### Scenario: Menu.Root usage
- **WHEN** component renders dropdown functionality
- **THEN** SHALL use Menu.Root from Nimbus Menu component
- **AND** SHALL set trigger="press" for click activation
- **AND** SHALL set placement="bottom end" for positioning
- **AND** SHALL set selectionMode="none" for action-only menu
- **AND** SHALL forward isOpen, defaultOpen, onOpenChange props
- **AND** SHALL forward onAction to Menu.Root

#### Scenario: Menu.Trigger usage
- **WHEN** trigger button renders
- **THEN** SHALL wrap IconButton with Menu.Trigger
- **AND** SHALL use asChild pattern for component merging
- **AND** SHALL forward trigger interactions to Menu.Root
- **AND** SHALL follow React Aria MenuTrigger patterns

#### Scenario: Menu.Content usage
- **WHEN** menu opens
- **THEN** SHALL render children inside Menu.Content
- **AND** SHALL receive all Menu.Item, Menu.Section, Separator children
- **AND** SHALL follow React Aria Menu content patterns

### Requirement: Comprehensive Type Definitions
The component SHALL provide complete TypeScript type definitions.

#### Scenario: SplitButtonProps type
- **WHEN** SplitButtonProps is defined
- **THEN** SHALL include size: ButtonProps size type (2xs, xs, md)
- **AND** SHALL include variant: ButtonProps variant type (solid, subtle, outline, ghost)
- **AND** SHALL include colorPalette: ButtonProps colorPalette type
- **AND** SHALL include isDisabled: boolean
- **AND** SHALL include aria-label: string (required)
- **AND** SHALL include icon: ReactNode (optional)
- **AND** SHALL include children: ReactNode (Menu.Item components)
- **AND** SHALL include onAction: (id: string) => void (required)
- **AND** SHALL include isOpen, defaultOpen, onOpenChange from RaMenuTriggerProps

#### Scenario: Slot props types
- **WHEN** slot prop types are defined
- **THEN** SHALL define SplitButtonRootSlotProps extending HTMLChakraProps<"div">
- **AND** SHALL define SplitButtonButtonGroupSlotProps extending HTMLChakraProps<"div">
- **AND** SHALL define SplitButtonPrimaryButtonSlotProps extending HTMLChakraProps<"button">
- **AND** SHALL define SplitButtonTriggerSlotProps extending HTMLChakraProps<"button">
- **AND** SHALL support SlotRecipeProps<"splitButton">

#### Scenario: JSDoc documentation
- **WHEN** types are exported
- **THEN** SHALL include JSDoc comments for all props
- **AND** SHALL document size with @default "md"
- **AND** SHALL document variant with @default "solid"
- **AND** SHALL document children expectation (Menu components)
- **AND** SHALL document automatic primary action selection behavior

### Requirement: Internationalization Support
The component SHALL support internationalization for fallback messages.

#### Scenario: Fallback message definition
- **WHEN** component needs fallback text
- **THEN** SHALL define messages in split-button.i18n.ts file
- **AND** SHALL use react-intl's defineMessages API
- **AND** SHALL follow naming: `Nimbus.SplitButton.noActionsAvailable`

#### Scenario: Fallback message usage
- **WHEN** no valid Menu.Items are available
- **THEN** SHALL use useIntl hook to get localized message
- **AND** SHALL call intl.formatMessage(messages.noActionsAvailable)
- **AND** SHALL display localized "No actions available" text

### Requirement: Minimum Touch Target Size
The component SHALL meet minimum touch target requirements per nimbus-core standards.

#### Scenario: Touch target compliance
- **WHEN** buttons render in any size
- **THEN** SHALL meet minimum 44x44px touch target through size or padding
- **AND** 2xs and xs sizes SHALL achieve target size through button height and padding
- **AND** buttons SHALL be easily tappable on mobile devices
- **AND** grouped buttons SHALL maintain usable touch targets without overlap
