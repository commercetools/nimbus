# Specification: Menu Component

## Overview

The Menu component provides an accessible dropdown menu following ARIA menu pattern. It uses compound component architecture with Menu.Root, Menu.Trigger, Menu.Content, and Menu.Item.

**Component:** `Menu` (namespace export)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `Menu` components from react-aria-components

## Compound Component Architecture

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** Menu is imported
- **THEN** SHALL provide Menu.Root as configuration wrapper
- **AND** SHALL provide Menu.Trigger for button that opens menu
- **AND** SHALL provide Menu.Content for menu overlay
- **AND** SHALL provide Menu.Item for individual menu items
- **AND** SHALL provide Menu.Separator for visual dividers
- **AND** Root SHALL be first property in namespace

## Menu Trigger

### Requirement: Trigger Button
Menu.Trigger SHALL activate menu display.

#### Scenario: Trigger interaction
- **WHEN** user clicks Menu.Trigger
- **THEN** SHALL open Menu.Content overlay
- **AND** SHALL focus first menu item
- **AND** SHALL set aria-expanded="true"
- **AND** SHALL set aria-controls to reference menu content ID

#### Scenario: Trigger keyboard
- **WHEN** Menu.Trigger is focused and user presses Space, Enter, or ArrowDown
- **THEN** SHALL open menu
- **AND** ArrowDown SHALL focus first item
- **AND** ArrowUp SHALL focus last item

## Menu Content

### Requirement: Overlay Positioning
Menu.Content SHALL intelligently position relative to trigger.

#### Scenario: Placement options
- **WHEN** placement prop is set
- **THEN** SHALL support: bottom, bottom-start, bottom-end, top, top-start, top-end, left, right
- **AND** SHALL auto-adjust to avoid viewport overflow
- **AND** SHALL use React Aria's overlay positioning

#### Scenario: Scroll handling
- **WHEN** menu items exceed viewport height
- **THEN** SHALL enable scrolling within menu
- **AND** SHALL maintain focus visibility
- **AND** SHALL support keyboard navigation through scrolled items

## Menu Items

### Requirement: Selectable Items
Menu.Item SHALL support selection and actions.

#### Scenario: Click selection
- **WHEN** user clicks Menu.Item
- **THEN** SHALL call onSelect handler if provided
- **AND** SHALL close menu by default
- **AND** closeOnSelect={false} SHALL keep menu open

#### Scenario: Keyboard navigation
- **WHEN** menu is open and user presses ArrowDown
- **THEN** SHALL focus next item (wrap to first if at end)
- **WHEN** user presses ArrowUp
- **THEN** SHALL focus previous item (wrap to last if at beginning)
- **WHEN** user presses Home
- **THEN** SHALL focus first item
- **WHEN** user presses End
- **THEN** SHALL focus last item

#### Scenario: Typeahead search
- **WHEN** menu is open and user types characters
- **THEN** SHALL focus first item matching typed text
- **AND** SHALL support rapid typing for multi-character search
- **AND** SHALL reset search after timeout

### Requirement: Item States
Menu.Item SHALL support disabled and selected states.

#### Scenario: Disabled items
- **WHEN** Menu.Item has disabled={true}
- **THEN** SHALL apply disabled styling
- **AND** SHALL skip during keyboard navigation
- **AND** SHALL not respond to click
- **AND** SHALL set aria-disabled="true"

#### Scenario: Selected indication
- **WHEN** Menu.Item is selected (for selection menus)
- **THEN** SHALL show checkmark or selected indicator
- **AND** SHALL set aria-checked="true"
- **AND** SHALL provide visual distinction

## Menu Closure

### Requirement: Close Behavior
Menu SHALL close in appropriate situations.

#### Scenario: Escape key
- **WHEN** menu is open and user presses Escape
- **THEN** SHALL close menu
- **AND** SHALL return focus to trigger

#### Scenario: Outside click
- **WHEN** menu is open and user clicks outside
- **THEN** SHALL close menu
- **AND** SHALL not prevent outside click action

#### Scenario: Item selection
- **WHEN** user selects menu item
- **THEN** SHALL close menu by default
- **AND** closeOnSelect prop SHALL control this behavior

## Focus Management

### Requirement: Focus Trap
Menu SHALL manage focus appropriately per nimbus-core standards.

#### Scenario: Opening focus
- **WHEN** menu opens
- **THEN** SHALL move focus to first menu item
- **OR** to specified default focus element
- **AND** SHALL trap Tab key within menu

#### Scenario: Closing focus
- **WHEN** menu closes
- **THEN** SHALL return focus to trigger element
- **AND** focus SHALL be visible and announced

## Submenus

### Requirement: Nested Menus
Menu SHALL support nested submenu structures.

#### Scenario: Submenu trigger
- **WHEN** Menu.Item contains nested Menu
- **THEN** SHALL show arrow indicator
- **AND** SHALL open submenu on hover (desktop) or click (mobile/keyboard)
- **AND** ArrowRight SHALL open submenu and focus first item
- **AND** ArrowLeft SHALL close submenu and return to parent

#### Scenario: Submenu positioning
- **WHEN** submenu opens
- **THEN** SHALL position to right of parent menu by default
- **AND** SHALL flip to left if insufficient space
- **AND** SHALL maintain consistent styling

## Separators

### Requirement: Visual Grouping
Menu.Separator SHALL provide visual grouping of items.

#### Scenario: Separator rendering
- **WHEN** Menu.Separator is rendered
- **THEN** SHALL display horizontal line between items
- **AND** SHALL not be focusable
- **AND** SHALL use semantic hr element or aria-separator role

## Accessibility

### Requirement: ARIA Menu Pattern
The component SHALL implement ARIA menu pattern per nimbus-core standards.

#### Scenario: Menu roles
- **WHEN** menu renders
- **THEN** Menu.Content SHALL have role="menu"
- **AND** Menu.Item SHALL have role="menuitem"
- **AND** Menu.Separator SHALL have role="separator"
- **AND** trigger SHALL have aria-haspopup="menu"

#### Scenario: Keyboard support
- **WHEN** menu is open
- **THEN** SHALL support all ARIA menu keyboard shortcuts
- **AND** SHALL manage focus with roving tabindex
- **AND** SHALL announce state changes to screen readers

## Styling

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** menu renders
- **THEN** SHALL apply menu slot recipe from theme/slot-recipes/menu.ts
- **AND** SHALL style: trigger, content, item, separator slots
- **AND** SHALL support design tokens for spacing, colors, shadows

## Icon and Shortcuts

### Requirement: Item Decoration
Menu.Item SHALL support icons and keyboard shortcuts.

#### Scenario: Leading icon
- **WHEN** leftIcon prop is provided to Menu.Item
- **THEN** SHALL render icon before item text
- **AND** SHALL apply appropriate spacing

#### Scenario: Keyboard shortcut display
- **WHEN** shortcut prop is provided to Menu.Item
- **THEN** SHALL display shortcut text at right edge
- **AND** SHALL be informational only (actual shortcut handling is separate)
- **AND** SHALL use muted color to distinguish from item text
