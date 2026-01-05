# Specification: Drawer Component

## Overview

The Drawer component provides an accessible slide-in overlay panel from the edge of the screen following ARIA dialog pattern with focus management and keyboard interaction.

**Component:** `Drawer` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `Dialog` and `Modal` from react-aria-components
**i18n:** 1 message (closeDrawer)

## Purpose

Provide an accessible slide-in overlay panel for displaying supplementary content, forms, or detailed information without navigating away from the current page. The drawer slides from screen edges (left, right, top, bottom) and follows WCAG 2.1 AA standards with proper focus management and keyboard interaction.

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** Drawer is imported
- **THEN** SHALL provide Drawer.Root as drawer wrapper
- **AND** SHALL provide Drawer.Trigger for open button
- **AND** SHALL provide Drawer.Content for drawer container
- **AND** SHALL provide Drawer.Header for title section
- **AND** SHALL provide Drawer.Body for main content
- **AND** SHALL provide Drawer.Footer for actions
- **AND** SHALL provide Drawer.Title for accessible heading
- **AND** SHALL provide Drawer.CloseTrigger for dismiss button
- **AND** Root SHALL be first property in namespace

## Drawer Opening

### Requirement: Trigger Control
The component SHALL provide trigger for opening drawer.

#### Scenario: Trigger interaction
- **WHEN** user clicks Drawer.Trigger
- **THEN** SHALL open drawer overlay
- **AND** SHALL trap focus within drawer
- **AND** SHALL prevent body scroll
- **AND** SHALL set aria-expanded="true" on trigger

#### Scenario: Programmatic open
- **WHEN** isOpen prop is set to true
- **THEN** SHALL open drawer
- **AND** SHALL call onOpenChange when opened
- **AND** SHALL support controlled mode

#### Scenario: Uncontrolled mode
- **WHEN** defaultOpen prop is true
- **THEN** SHALL open drawer on mount
- **AND** SHALL manage state internally
- **AND** SHALL not require isOpen or onOpenChange props

## Placement and Positioning

### Requirement: Edge Placement
The component SHALL support drawer placement from screen edges.

#### Scenario: Placement variants
- **WHEN** placement prop is set on Drawer.Root
- **THEN** SHALL support: left, right, top, bottom
- **AND** SHALL default to right placement
- **AND** SHALL position drawer at specified screen edge

#### Scenario: Left placement
- **WHEN** placement="left"
- **THEN** SHALL align drawer to left edge
- **AND** SHALL slide in from left
- **AND** SHALL slide out to left on close
- **AND** SHALL span full viewport height

#### Scenario: Right placement
- **WHEN** placement="right"
- **THEN** SHALL align drawer to right edge
- **AND** SHALL slide in from right
- **AND** SHALL slide out to right on close
- **AND** SHALL span full viewport height

#### Scenario: Top placement
- **WHEN** placement="top"
- **THEN** SHALL align drawer to top edge
- **AND** SHALL slide in from top
- **AND** SHALL slide out to top on close
- **AND** SHALL span full viewport width

#### Scenario: Bottom placement
- **WHEN** placement="bottom"
- **THEN** SHALL align drawer to bottom edge
- **AND** SHALL slide in from bottom
- **AND** SHALL slide out to bottom on close
- **AND** SHALL span full viewport width

## Focus Management

### Requirement: Focus Trap
The component SHALL manage focus appropriately per nimbus-core standards.

#### Scenario: Opening focus
- **WHEN** drawer opens
- **THEN** SHALL move focus into drawer
- **AND** SHALL focus first focusable element
- **OR** element specified by autoFocus prop
- **AND** SHALL trap Tab key within drawer

#### Scenario: Focus cycling
- **WHEN** user presses Tab at last focusable element
- **THEN** SHALL cycle focus to first element
- **WHEN** user presses Shift+Tab at first element
- **THEN** SHALL cycle focus to last element

#### Scenario: Closing focus
- **WHEN** drawer closes
- **THEN** SHALL return focus to trigger element
- **OR** element that had focus before opening
- **AND** focus SHALL be visible

## Drawer Closure

### Requirement: Close Behavior
The component SHALL provide multiple ways to close drawer.

#### Scenario: Close button
- **WHEN** Drawer.CloseTrigger is rendered
- **THEN** clicking SHALL close drawer
- **AND** SHALL call onOpenChange(false)
- **AND** SHALL use i18n aria-label "Close drawer"

#### Scenario: Escape key
- **WHEN** drawer is open and user presses Escape
- **THEN** SHALL close drawer by default
- **AND** isDismissable prop SHALL control this behavior
- **AND** isKeyboardDismissDisabled SHALL prevent Escape closing
- **AND** SHALL return focus to trigger

#### Scenario: Backdrop click
- **WHEN** user clicks outside drawer
- **THEN** SHALL close drawer if isDismissable={true}
- **OR** SHALL not close if isDismissable={false}

#### Scenario: Controlled closure
- **WHEN** isOpen and onOpenChange props are provided
- **THEN** SHALL call onOpenChange(false) on close attempt
- **AND** SHALL not close until isOpen changes

#### Scenario: Slot-based close buttons
- **WHEN** button has slot="close" inside drawer
- **THEN** clicking SHALL close drawer
- **AND** SHALL work with any button in drawer content

## Overlay and Backdrop

### Requirement: Modal Backdrop
The component SHALL provide backdrop overlay.

#### Scenario: Backdrop rendering
- **WHEN** drawer opens and showBackdrop={true}
- **THEN** SHALL render backdrop behind drawer
- **AND** SHALL dim/blur background content
- **AND** SHALL prevent interaction with background
- **AND** SHALL use design token for backdrop color

#### Scenario: Backdrop animation
- **WHEN** drawer opens/closes
- **THEN** backdrop SHALL fade in/out
- **AND** SHALL use easing from design tokens

#### Scenario: No backdrop
- **WHEN** showBackdrop={false}
- **THEN** SHALL not render backdrop overlay
- **AND** background SHALL remain visible
- **AND** SHALL still prevent background interaction

## Drawer Animation

### Requirement: Slide Animations
The component SHALL provide smooth slide transitions.

#### Scenario: Opening animation
- **WHEN** drawer opens
- **THEN** SHALL slide in from placement edge
- **AND** SHALL use animation from design tokens
- **AND** backdrop SHALL fade in simultaneously
- **AND** SHALL use duration from design tokens

#### Scenario: Closing animation
- **WHEN** drawer closes
- **THEN** SHALL slide out to placement edge
- **AND** backdrop SHALL fade out simultaneously
- **AND** SHALL remove from DOM after animation
- **AND** SHALL use duration from design tokens

#### Scenario: Placement-specific animations
- **WHEN** placement is set
- **THEN** SHALL use appropriate slide animation
- **AND** left SHALL slide-from-left-full/slide-to-left-full
- **AND** right SHALL slide-from-right-full/slide-to-right-full
- **AND** top SHALL slide-from-top-full/slide-to-top-full
- **AND** bottom SHALL slide-from-bottom-full/slide-to-bottom-full

## Scrolling Behavior

### Requirement: Content Scrolling
The component SHALL handle overflow content.

#### Scenario: Long content
- **WHEN** content exceeds viewport height
- **THEN** SHALL enable scrolling within drawer body
- **AND** SHALL keep header and footer fixed
- **AND** SHALL show scroll indicators

#### Scenario: Body scroll lock
- **WHEN** drawer is open
- **THEN** SHALL prevent scrolling of background page
- **AND** SHALL restore scroll on close
- **AND** SHALL use overscrollBehaviorY: none

## Drawer Header

### Requirement: Title Section
The component SHALL provide accessible title.

#### Scenario: Drawer title
- **WHEN** Drawer.Title is used in header
- **THEN** SHALL render as drawer heading
- **AND** SHALL associate with drawer via aria-labelledby
- **AND** SHALL use h2 heading element

#### Scenario: Close button in header
- **WHEN** Drawer.CloseTrigger is in header
- **THEN** SHALL position in top-right corner
- **AND** SHALL be easily clickable/tappable
- **AND** SHALL layer above other header content

#### Scenario: Aria-label fallback
- **WHEN** Drawer.Title is not used
- **THEN** MAY provide aria-label on Drawer.Root
- **AND** SHALL ensure drawer has accessible name

## Drawer Body

### Requirement: Content Area
The component SHALL provide main content container.

#### Scenario: Body content
- **WHEN** Drawer.Body renders
- **THEN** SHALL contain main drawer content
- **AND** SHALL support any content type
- **AND** SHALL handle scrolling if needed
- **AND** SHALL be scrollable with overflow: auto

#### Scenario: Body focus
- **WHEN** body content is scrollable
- **THEN** SHALL be focusable for keyboard scrolling
- **AND** SHALL show focus ring per nimbus-core standards

## Drawer Footer

### Requirement: Actions Section
The component SHALL provide action button area.

#### Scenario: Footer actions
- **WHEN** Drawer.Footer contains buttons
- **THEN** SHALL render action buttons
- **AND** SHALL align buttons to right by default
- **AND** SHALL support primary and secondary actions
- **AND** SHALL space buttons with gap token

#### Scenario: Footer layout
- **WHEN** multiple buttons are present
- **THEN** SHALL space buttons appropriately
- **AND** SHALL use flexbox layout
- **AND** SHALL support slot="close" for dismissal

## Accessibility

### Requirement: ARIA Dialog Pattern
The component SHALL implement ARIA dialog pattern per nimbus-core standards.

#### Scenario: Dialog roles
- **WHEN** drawer renders
- **THEN** Drawer.Content SHALL have role="dialog"
- **AND** SHALL have aria-modal="true"
- **AND** SHALL be associated with title via aria-labelledby
- **OR** have aria-label if no title present

#### Scenario: Screen reader announcements
- **WHEN** drawer opens
- **THEN** SHALL announce drawer title
- **AND** SHALL indicate modal state
- **AND** SHALL provide context about content

#### Scenario: Keyboard interaction
- **WHEN** drawer is open
- **THEN** Tab SHALL cycle focus within drawer
- **AND** Escape SHALL close drawer (if dismissable)
- **AND** focus SHALL be trapped in drawer
- **AND** SHALL follow React Aria keyboard patterns

### Requirement: Internationalized Labels
The component SHALL use i18n for screen reader text per nimbus-core standards.

#### Scenario: Close button label
- **WHEN** Drawer.CloseTrigger renders
- **THEN** SHALL use i18n aria-label from drawer.i18n.ts
- **AND** message "Close drawer" SHALL translate across locales
- **AND** SHALL support custom aria-label override

## Styling

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** drawer renders
- **THEN** SHALL apply drawer slot recipe from theme/slot-recipes/drawer.ts
- **AND** SHALL style: trigger, modalOverlay, modal, content, header, body, footer, title, closeTrigger slots
- **AND** SHALL support placement variants
- **AND** SHALL support showBackdrop variant

#### Scenario: Placement styling
- **WHEN** placement variant is applied
- **THEN** SHALL adjust content positioning
- **AND** SHALL adjust dimensions (full height for left/right, full width for top/bottom)
- **AND** SHALL remove border radius for edge-aligned drawers
- **AND** SHALL apply correct animation directions

#### Scenario: Backdrop styling
- **WHEN** showBackdrop={true}
- **THEN** SHALL apply blur and dim effects
- **AND** SHALL use semantic color tokens
- **AND** SHALL support light and dark modes
- **WHEN** showBackdrop={false}
- **THEN** SHALL render transparent backdrop

## State Management

### Requirement: Controlled Mode
The component SHALL support controlled state management.

#### Scenario: Controlled state
- **WHEN** isOpen and onOpenChange are provided
- **THEN** SHALL use isOpen to control open state
- **AND** SHALL call onOpenChange when state changes
- **AND** SHALL not manage internal state
- **AND** parent controls open/close behavior

### Requirement: Uncontrolled Mode
The component SHALL support uncontrolled state management.

#### Scenario: Uncontrolled state
- **WHEN** only defaultOpen is provided
- **THEN** SHALL manage state internally
- **AND** SHALL initialize with defaultOpen value
- **AND** SHALL not require external state management

#### Scenario: Trigger-based state
- **WHEN** Drawer.Trigger is used without isOpen
- **THEN** SHALL use React Aria DialogTrigger for state
- **AND** SHALL manage open/close automatically
- **AND** SHALL support defaultOpen prop

#### Scenario: Triggerless state
- **WHEN** no Drawer.Trigger is present
- **THEN** SHALL require isOpen and onOpenChange props
- **OR** SHALL use defaultOpen for initial state
- **AND** ModalOverlay SHALL manage its own state

## Advanced Features

### Requirement: Interaction Control
The component SHALL provide fine-grained dismissal control.

#### Scenario: Custom close behavior
- **WHEN** shouldCloseOnInteractOutside prop is provided
- **THEN** SHALL call function with interaction event
- **AND** SHALL close only if function returns true
- **AND** SHALL prevent close if function returns false
- **AND** SHALL allow conditional closing logic

#### Scenario: Keyboard dismiss control
- **WHEN** isKeyboardDismissDisabled={true}
- **THEN** Escape key SHALL not close drawer
- **AND** backdrop click SHALL still work if isDismissable={true}
- **AND** close button SHALL still work

### Requirement: Ref Forwarding
The component SHALL support ref forwarding per nimbus-core standards.

#### Scenario: Content ref
- **WHEN** ref is passed to Drawer.Content
- **THEN** SHALL forward to underlying dialog element
- **AND** ref SHALL reference HTMLDivElement
- **AND** SHALL support imperative access

#### Scenario: Trigger ref
- **WHEN** ref is passed to Drawer.Trigger
- **THEN** SHALL forward to button element
- **AND** ref SHALL reference HTMLButtonElement

## Portal Rendering

### Requirement: Portal Management
The component SHALL render in React portal.

#### Scenario: Portal rendering
- **WHEN** drawer opens
- **THEN** SHALL render content in portal
- **AND** SHALL render at document.body level
- **AND** SHALL maintain stacking context
- **AND** SHALL support nested drawers with z-index layering

## TypeScript Support

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Exported types
- **WHEN** drawer is imported
- **THEN** SHALL export DrawerRootProps
- **AND** SHALL export DrawerTriggerProps
- **AND** SHALL export DrawerContentProps
- **AND** SHALL export DrawerHeaderProps, DrawerBodyProps, DrawerFooterProps
- **AND** SHALL export DrawerTitleProps, DrawerCloseTriggerProps

#### Scenario: Recipe types
- **WHEN** recipe props are used
- **THEN** SHALL export DrawerRecipeProps
- **AND** SHALL provide autocomplete for placement variants
- **AND** SHALL provide autocomplete for showBackdrop boolean
