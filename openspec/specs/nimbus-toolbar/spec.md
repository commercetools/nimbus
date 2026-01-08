# Specification: Toolbar Component

## Overview

The Toolbar component provides a container for grouping action buttons and controls with consistent spacing, alignment, and keyboard navigation. It implements the ARIA toolbar pattern for accessible keyboard interaction and supports both horizontal and vertical layouts.

**Component:** `Toolbar` (single component)
**Package:** `@commercetools/nimbus`
**Type:** Single-slot recipe
**React Aria:** Uses `Toolbar` from react-aria-components

## Purpose

The Toolbar capability provides a container for grouping related action buttons and controls in a consistent, accessible layout. It offers horizontal (default) and vertical orientations, intelligent spacing, separator support, and robust keyboard navigation following ARIA toolbar patterns. The component is commonly used in rich text editors, application headers, sidebars, and forms where related actions need to be visually and functionally grouped.

## Requirements

### Requirement: Horizontal Layout (Default)
Toolbar SHALL arrange children horizontally by default.

#### Scenario: Default horizontal orientation
- **WHEN** Toolbar renders without orientation prop or with orientation="horizontal"
- **THEN** SHALL arrange all children in a horizontal row
- **AND** SHALL set aria-orientation="horizontal"
- **AND** SHALL use row flex direction
- **AND** SHALL apply gap spacing between items

#### Scenario: Horizontal keyboard navigation
- **WHEN** orientation="horizontal" and user presses ArrowRight
- **THEN** SHALL move focus to next focusable child
- **AND** SHALL wrap to first child if at end
- **WHEN** user presses ArrowLeft
- **THEN** SHALL move focus to previous focusable child
- **AND** SHALL wrap to last child if at beginning

### Requirement: Vertical Layout Support
Toolbar SHALL support vertical orientation for sidebar and vertical navigation patterns.

#### Scenario: Vertical orientation
- **WHEN** orientation="vertical" is set
- **THEN** SHALL arrange all children in a vertical column
- **AND** SHALL set aria-orientation="vertical"
- **AND** SHALL use column flex direction
- **AND** SHALL apply gap spacing between items

#### Scenario: Vertical keyboard navigation
- **WHEN** orientation="vertical" and user presses ArrowDown
- **THEN** SHALL move focus to next focusable child
- **AND** SHALL wrap to first child if at end
- **WHEN** user presses ArrowUp
- **THEN** SHALL move focus to previous focusable child
- **AND** SHALL wrap to last child if at beginning

#### Scenario: Horizontal arrows in vertical toolbar
- **WHEN** orientation="vertical" and user presses ArrowLeft or ArrowRight
- **THEN** SHALL NOT move focus between toolbar items
- **AND** SHALL allow default browser behavior or nested component handling
- **AND** focus SHALL remain on current item

### Requirement: Responsive Orientation
Toolbar SHALL support responsive orientation values.

#### Scenario: Responsive orientation prop
- **WHEN** orientation prop receives responsive value (array or object)
- **THEN** SHALL normalize orientation to concrete "horizontal" or "vertical" string
- **AND** SHALL use useBreakpointValue to resolve responsive value
- **AND** SHALL pass concrete string to React Aria Toolbar
- **AND** SHALL apply appropriate styles for resolved orientation

### Requirement: Keyboard Navigation with Tab
Toolbar SHALL support standard Tab navigation.

#### Scenario: Tab key navigation
- **WHEN** toolbar contains focusable items and user presses Tab
- **THEN** SHALL move focus to next focusable element outside toolbar
- **AND** SHALL follow normal document tab order
- **WHEN** user presses Shift+Tab
- **THEN** SHALL move focus to previous focusable element outside toolbar
- **AND** SHALL follow reverse document tab order

### Requirement: Focus Management with Roving Tabindex
Toolbar SHALL manage focus using roving tabindex pattern per nimbus-core standards.

#### Scenario: Initial focus entry
- **WHEN** toolbar receives focus via Tab
- **THEN** SHALL focus first focusable child
- **AND** only one child SHALL be in tab order (tabindex="0")
- **AND** other focusable children SHALL have tabindex="-1"

#### Scenario: Arrow key focus management
- **WHEN** user navigates with arrow keys within toolbar
- **THEN** SHALL move roving tabindex to newly focused child
- **AND** newly focused child SHALL receive tabindex="0"
- **AND** previously focused child SHALL receive tabindex="-1"
- **AND** SHALL skip disabled or non-focusable elements

### Requirement: Item Grouping Support
Toolbar SHALL support logical grouping of related items.

#### Scenario: Group containers
- **WHEN** toolbar contains Group components as children
- **THEN** SHALL maintain spacing between groups
- **AND** groups SHALL align items with toolbar orientation
- **AND** groups SHALL inherit toolbar spacing
- **AND** arrow navigation SHALL move through group items seamlessly

#### Scenario: Nested ToggleButtonGroup
- **WHEN** toolbar contains ToggleButtonGroup.Root
- **THEN** SHALL maintain spacing between toggle groups
- **AND** toggle groups SHALL align with toolbar orientation
- **AND** React Aria SHALL change toggle group role from "toolbar" to "group"
- **AND** arrow navigation SHALL work through toggle buttons

### Requirement: Separator Support
Toolbar SHALL support visual separators between groups of items.

#### Scenario: Separator rendering
- **WHEN** Separator component is placed between toolbar children
- **THEN** SHALL render horizontal line if toolbar orientation="vertical"
- **AND** SHALL render vertical line if toolbar orientation="horizontal"
- **AND** Separator SHALL NOT be focusable
- **AND** Separator SHALL skip during keyboard navigation
- **AND** Separator SHALL use semantic role="separator"

#### Scenario: Separator spacing
- **WHEN** Separator renders within toolbar
- **THEN** SHALL apply appropriate margin based on orientation
- **AND** horizontal toolbar SHALL apply mx (horizontal margin)
- **AND** vertical toolbar SHALL apply my (vertical margin)
- **AND** margin SHALL match toolbar spacing token

### Requirement: Size Variants
Toolbar SHALL provide size variants for consistent item sizing.

#### Scenario: xs size
- **WHEN** size="xs" is set
- **THEN** SHALL apply spacing token 100 (4px) for gap
- **AND** SHALL set separator size to 600 (24px)
- **AND** nested items SHOULD use xs size for visual consistency

#### Scenario: md size (default)
- **WHEN** size="md" is set or no size specified
- **THEN** SHALL apply spacing token 200 (8px) for gap
- **AND** SHALL set separator size to 800 (32px)
- **AND** nested items SHOULD use consistent sizing

### Requirement: Visual Style Variants
Toolbar SHALL support visual style variants.

#### Scenario: plain variant (default)
- **WHEN** variant="plain" or no variant specified
- **THEN** SHALL render with transparent background
- **AND** SHALL have no border or shadow
- **AND** items SHALL be visually grouped by spacing alone

#### Scenario: outline variant
- **WHEN** variant="outline" is set
- **THEN** SHALL render with subtle border outline
- **AND** SHALL use boxShadow for 1px border effect
- **AND** SHALL use neutral.6 color for border
- **AND** SHALL provide clear visual container

### Requirement: ARIA Toolbar Pattern
Toolbar SHALL implement ARIA toolbar pattern per nimbus-core standards.

#### Scenario: Toolbar role
- **WHEN** toolbar renders
- **THEN** SHALL have role="toolbar"
- **AND** SHALL set aria-orientation to match orientation prop
- **AND** SHALL manage focus with roving tabindex
- **AND** SHALL support all ARIA toolbar keyboard patterns

### Requirement: Accessible Toolbar Labeling
Toolbar SHALL provide accessible labeling.

#### Scenario: Toolbar label
- **WHEN** toolbar renders
- **THEN** SHOULD have aria-label or aria-labelledby
- **AND** label SHALL describe purpose of toolbar
- **AND** label SHALL be announced by screen readers
- **AND** label SHALL help distinguish multiple toolbars on same page

### Requirement: Disabled State
Toolbar SHALL support disabled state for all contained items.

#### Scenario: Disabled toolbar
- **WHEN** isDisabled={true} is set on toolbar
- **THEN** SHALL disable all focusable children
- **AND** toolbar SHALL not be in tab order
- **AND** arrow key navigation SHALL not function
- **AND** SHALL apply disabled styling
- **AND** SHALL set aria-disabled="true"

### Requirement: Item Types Support
Toolbar SHALL support various child component types.

#### Scenario: Button children
- **WHEN** toolbar contains Button or IconButton components
- **THEN** SHALL support focus navigation through buttons
- **AND** buttons SHALL respond to click and keyboard activation
- **AND** spacing SHALL be consistent

#### Scenario: Toggle children
- **WHEN** toolbar contains IconToggleButton or ToggleButtonGroup
- **THEN** SHALL support focus navigation through toggle controls
- **AND** toggles SHALL maintain selection state
- **AND** toggles SHALL respond to keyboard activation

#### Scenario: Menu children
- **WHEN** toolbar contains Menu.Trigger components
- **THEN** SHALL support focus navigation to menu triggers
- **AND** menu triggers SHALL open menus with Space/Enter
- **AND** arrow keys SHALL navigate toolbar, not open menus
- **AND** menus SHALL trap focus when open

#### Scenario: Mixed children
- **WHEN** toolbar contains mix of buttons, toggles, menus, and separators
- **THEN** SHALL navigate through all focusable items seamlessly
- **AND** SHALL skip separators during navigation
- **AND** SHALL maintain consistent spacing and alignment

### Requirement: Form Integration
Toolbar SHALL work within form contexts.

#### Scenario: Toolbar in forms
- **WHEN** toolbar is placed within form element
- **THEN** SHALL allow form submission when buttons have type="submit"
- **AND** toggle selections SHALL NOT trigger form submission
- **AND** Tab navigation SHALL move to next form element after toolbar

### Requirement: Single-Slot Recipe
Toolbar SHALL use single-slot recipe per nimbus-core standards.

#### Scenario: Recipe styling
- **WHEN** toolbar renders
- **THEN** SHALL apply toolbarRecipe from toolbar.recipe.ts
- **AND** recipe SHALL be registered in theme/recipes/
- **AND** SHALL support size and orientation variants
- **AND** SHALL use design tokens for spacing, colors, borders

#### Scenario: CSS variable system
- **WHEN** toolbar renders
- **THEN** SHALL use --toolbar-spacing CSS variable for gap and margins
- **AND** SHALL use --toolbar-direction CSS variable for flexDirection
- **AND** SHALL use --separator-size CSS variable for separator dimensions
- **AND** variants SHALL set CSS variables for different sizes/orientations

### Requirement: Responsive Behavior
Toolbar SHALL support responsive design per nimbus-core standards.

#### Scenario: Responsive orientation
- **WHEN** orientation prop receives responsive array or object
- **THEN** SHALL switch between horizontal and vertical at breakpoints
- **AND** SHALL update aria-orientation accordingly
- **AND** keyboard navigation SHALL adapt to current orientation
- **AND** separator orientation SHALL adjust automatically

### Requirement: Comprehensive Type Definitions
Toolbar SHALL provide complete TypeScript type definitions.

#### Scenario: Props type
- **WHEN** ToolbarProps is defined
- **THEN** SHALL combine recipe variant props with React Aria ToolbarProps
- **AND** SHALL include size: "xs" | "md"
- **AND** SHALL include orientation: "horizontal" | "vertical" with responsive support
- **AND** SHALL include variant: "plain" | "outline"
- **AND** SHALL include isDisabled prop
- **AND** SHALL support ref as React.Ref<HTMLDivElement>

#### Scenario: Recipe props type
- **WHEN** ToolbarRecipeProps is defined
- **THEN** SHALL include size, orientation, variant from recipe
- **AND** SHALL be auto-generated via Chakra CLI
- **AND** SHALL provide autocomplete for variant values

#### Scenario: JSDoc documentation
- **WHEN** types are exported
- **THEN** SHALL include JSDoc comments for all props
- **AND** SHALL document size with @default "md"
- **AND** SHALL document orientation with @default "horizontal"
- **AND** SHALL document variant with @default "plain"
- **AND** SHALL document ref forwarding

### Requirement: React Aria Toolbar Usage
Toolbar SHALL use React Aria Components for accessibility and behavior.

#### Scenario: Toolbar component usage
- **WHEN** Toolbar renders
- **THEN** SHALL use Toolbar from react-aria-components
- **AND** SHALL wrap with Chakra ToolbarRoot slot for styling
- **AND** SHALL forward all React Aria props
- **AND** SHALL merge Chakra styling with React Aria functionality
- **AND** SHALL use asChild pattern to avoid wrapper divs

#### Scenario: Orientation normalization
- **WHEN** Toolbar receives responsive orientation prop
- **THEN** SHALL use system.normalizeValue to prepare responsive value
- **AND** SHALL use useBreakpointValue to resolve to concrete string
- **AND** SHALL pass only "horizontal" or "vertical" to React Aria Toolbar
- **AND** React Aria SHALL not receive responsive arrays/objects

### Requirement: Visual Feedback for Interaction States
Toolbar SHALL provide visual feedback for all interaction states per nimbus-core standards.

#### Scenario: Default state
- **WHEN** toolbar renders without interaction
- **THEN** SHALL display base styling from variant
- **AND** SHALL show clear visual grouping of items
- **AND** SHALL be ready for interaction

#### Scenario: Focus state on children
- **WHEN** toolbar child receives keyboard focus
- **THEN** child SHALL display visible focus indicator
- **AND** focus indicator SHALL meet 3:1 contrast ratio requirement
- **AND** focus SHALL be distinguishable from hover state
- **AND** roving tabindex SHALL manage focus

### Requirement: Minimum Touch Target Size
Toolbar items SHALL meet minimum touch target requirements per nimbus-core standards.

#### Scenario: Touch target compliance
- **WHEN** toolbar children render
- **THEN** interactive children SHALL meet minimum 44x44px touch target
- **AND** xs size items SHALL achieve target through size and padding
- **AND** md size items SHALL achieve target through size and padding
- **AND** spacing SHALL prevent overlapping touch targets
