# Specification: Popover Component

## Overview

The Popover component provides an accessible non-modal overlay positioned relative to a trigger element, containing interactive content. It follows ARIA popover/dialog patterns with intelligent positioning and focus management.

**Component:** `Popover` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `Popover` from react-aria-components
**i18n:** 1 message (closePopover)

## Purpose

Popover provides a non-modal overlay for displaying rich, interactive content relative to a trigger element. Unlike Tooltip (non-interactive info on hover), Popover supports forms, buttons, and complex UI while maintaining accessibility. Unlike Dialog (modal with focus trap), Popover allows background interaction and non-trapped focus. Use Popover for supplementary actions, filters, settings panels, or context-sensitive content that doesn't require full modal attention.

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** Popover is imported
- **THEN** SHALL provide Popover.Root as configuration wrapper
- **AND** SHALL provide Popover.Trigger for trigger element
- **AND** SHALL provide Popover.Content for popover container
- **AND** SHALL provide Popover.Header for title section
- **AND** SHALL provide Popover.Body for main content
- **AND** SHALL provide Popover.Footer for actions section
- **AND** SHALL provide Popover.CloseButton for dismiss button
- **AND** SHALL provide Popover.Arrow for pointer element
- **AND** Root SHALL be first property in namespace

#### Scenario: Compound component coordination
- **WHEN** Popover.Root wraps trigger and content
- **THEN** SHALL coordinate state between trigger and content
- **AND** SHALL manage open/close state internally or via props
- **AND** SHALL provide context to child components


### Requirement: Trigger Activation
The component SHALL provide trigger for opening popover.

#### Scenario: Click trigger
- **WHEN** user clicks Popover.Trigger
- **THEN** SHALL open popover overlay
- **AND** SHALL position content relative to trigger
- **AND** SHALL set aria-expanded="true" on trigger
- **AND** SHALL focus first focusable element in content if autoFocus enabled

#### Scenario: Programmatic control
- **WHEN** isOpen prop is set to true
- **THEN** SHALL open popover
- **AND** SHALL call onOpenChange(true) callback
- **AND** SHALL support controlled mode

#### Scenario: Hover trigger mode
- **WHEN** trigger="hover" prop is set
- **THEN** SHALL open on mouse enter
- **AND** SHALL respect openDelay for hover activation
- **AND** SHALL behave like Tooltip for hover interactions
- **AND** SHALL support fallback click on touch devices


### Requirement: Intelligent Placement
The component SHALL position popover relative to trigger with collision detection.

#### Scenario: Placement options
- **WHEN** placement prop is set
- **THEN** SHALL support: top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
- **AND** SHALL default to bottom placement
- **AND** SHALL use React Aria's overlay positioning

#### Scenario: Viewport collision detection
- **WHEN** popover would overflow viewport
- **THEN** SHALL automatically flip to opposite side
- **AND** SHALL adjust position to stay within viewport bounds
- **AND** SHALL prioritize visibility over preferred placement
- **AND** SHALL prevent content clipping

#### Scenario: Offset positioning
- **WHEN** offset prop is set
- **THEN** SHALL adjust distance from trigger element
- **AND** SHALL maintain proper spacing
- **AND** SHALL apply offset in pixels

#### Scenario: Cross-axis offset
- **WHEN** crossOffset prop is set
- **THEN** SHALL adjust position along perpendicular axis
- **AND** SHALL allow fine-tuned alignment
- **AND** SHALL combine with primary placement


### Requirement: Visual Connection
The component SHALL support optional arrow pointer to trigger.

#### Scenario: Arrow rendering
- **WHEN** Popover.Arrow is included
- **THEN** SHALL render arrow pointing toward trigger
- **AND** SHALL position arrow at edge of popover
- **AND** arrow SHALL adjust with popover position
- **AND** SHALL apply proper styling from recipe

#### Scenario: Arrow positioning
- **WHEN** popover placement changes due to collision
- **THEN** arrow SHALL reposition to maintain connection to trigger
- **AND** SHALL align with trigger element center
- **AND** SHALL stay within popover bounds


### Requirement: Close Mechanisms
The component SHALL provide multiple ways to close popover.

#### Scenario: Close button
- **WHEN** Popover.CloseButton is rendered
- **THEN** clicking SHALL close popover
- **AND** SHALL call onOpenChange(false)
- **AND** SHALL use i18n aria-label "Close popover"
- **AND** SHALL return focus to trigger

#### Scenario: Escape key
- **WHEN** popover is open and user presses Escape
- **THEN** SHALL close popover
- **AND** SHALL return focus to trigger
- **AND** isDismissable prop SHALL control this behavior

#### Scenario: Outside click
- **WHEN** user clicks outside popover
- **THEN** SHALL close popover if isDismissable={true}
- **OR** SHALL not close if isDismissable={false}
- **AND** SHALL not prevent outside click action

#### Scenario: Controlled closure
- **WHEN** isOpen and onOpenChange props are provided
- **THEN** SHALL call onOpenChange(false) on close attempt
- **AND** SHALL not close until isOpen changes to false
- **AND** SHALL support fully controlled state management


### Requirement: Non-Modal Focus Behavior
The component SHALL manage focus appropriately as non-modal overlay per nimbus-core standards.

#### Scenario: Opening focus
- **WHEN** popover opens with autoFocus={true}
- **THEN** SHALL move focus to first focusable element
- **OR** to element specified by autoFocus selector
- **AND** SHALL announce content to screen readers
- **WHEN** popover opens with autoFocus={false}
- **THEN** SHALL leave focus on trigger element

#### Scenario: Non-modal interaction
- **WHEN** popover is open
- **THEN** SHALL allow Tab to move focus outside popover
- **AND** SHALL not trap focus within popover
- **AND** SHALL allow interaction with background content
- **AND** tabbing away SHALL close popover by default

#### Scenario: Closing focus
- **WHEN** popover closes
- **THEN** SHALL return focus to trigger element
- **OR** to element that had focus before opening
- **AND** focus SHALL be visible

#### Scenario: Focus containment option
- **WHEN** shouldCloseOnBlur={true} (default)
- **THEN** SHALL close when focus leaves popover
- **WHEN** shouldCloseOnBlur={false}
- **THEN** SHALL remain open when focus leaves
- **AND** SHALL support persistent popovers


### Requirement: Complex Content
The component SHALL support interactive elements within popover.

#### Scenario: Form elements
- **WHEN** Popover.Body contains form inputs
- **THEN** SHALL allow typing and interaction
- **AND** SHALL support form submission
- **AND** SHALL maintain focus within interactive elements
- **AND** Enter key SHALL not close popover when editing

#### Scenario: Buttons and links
- **WHEN** Popover.Body contains clickable elements
- **THEN** SHALL support clicking buttons without closing
- **AND** SHALL support link navigation
- **AND** SHALL support custom onSelect handlers

#### Scenario: Nested interactive content
- **WHEN** popover contains complex UI (tabs, selects, etc.)
- **THEN** SHALL support full interaction patterns
- **AND** SHALL manage focus correctly for nested components
- **AND** SHALL not conflict with nested overlay triggers


### Requirement: Keyboard Support
The component SHALL support comprehensive keyboard interaction.

#### Scenario: Trigger keyboard
- **WHEN** Popover.Trigger is focused and user presses Enter or Space
- **THEN** SHALL toggle popover open/closed
- **AND** SHALL set appropriate aria-expanded state

#### Scenario: Tab navigation
- **WHEN** popover is open and user presses Tab
- **THEN** SHALL move focus to next focusable element
- **AND** SHALL allow tabbing outside popover (non-modal behavior)
- **AND** tabbing outside SHALL close popover if shouldCloseOnBlur={true}

#### Scenario: Escape key
- **WHEN** popover is open and user presses Escape
- **THEN** SHALL close popover
- **AND** SHALL return focus to trigger
- **AND** SHALL not propagate Escape to parent overlays


### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set on Popover.Content
- **THEN** SHALL support: sm, md, lg
- **AND** SHALL adjust popover width accordingly
- **AND** md SHALL be default size

#### Scenario: Custom dimensions
- **WHEN** explicit width/maxWidth props provided
- **THEN** SHALL override size variant
- **AND** SHALL support responsive values
- **AND** SHALL respect minWidth and maxWidth constraints


### Requirement: Title Section
The component SHALL provide accessible title section.

#### Scenario: Header content
- **WHEN** Popover.Header is rendered
- **THEN** SHALL display title/heading content
- **AND** SHALL associate with popover via aria-labelledby
- **AND** SHALL apply header slot styling

#### Scenario: Header with close button
- **WHEN** Popover.CloseButton is in header
- **THEN** SHALL position in top-right corner
- **AND** SHALL be easily clickable/tappable (44x44px)
- **AND** SHALL align with header content


### Requirement: Content Area
The component SHALL provide main content container.

#### Scenario: Body content
- **WHEN** Popover.Body is rendered
- **THEN** SHALL contain main popover content
- **AND** SHALL support any content type (text, forms, lists, etc.)
- **AND** SHALL apply body slot styling
- **AND** SHALL handle scrolling if content exceeds maxHeight

#### Scenario: Scrolling content
- **WHEN** content exceeds available space
- **THEN** SHALL enable scrolling within body
- **AND** SHALL maintain header and footer visibility
- **AND** SHALL show scroll indicators


### Requirement: Actions Section
The component SHALL provide optional actions container.

#### Scenario: Footer actions
- **WHEN** Popover.Footer contains buttons
- **THEN** SHALL render action buttons
- **AND** SHALL align buttons appropriately (right-aligned by default)
- **AND** SHALL support primary and secondary actions

#### Scenario: Footer layout
- **WHEN** multiple buttons are present
- **THEN** SHALL space buttons with appropriate gaps
- **AND** SHALL support responsive stacking on small screens


### Requirement: Controlled and Uncontrolled Modes
The component SHALL support both state management patterns.

#### Scenario: Uncontrolled mode
- **WHEN** only defaultOpen prop is provided
- **THEN** SHALL manage state internally
- **AND** SHALL call onOpenChange when state changes
- **AND** SHALL support initial open state via defaultOpen

#### Scenario: Controlled mode
- **WHEN** isOpen and onOpenChange props are provided
- **THEN** SHALL show/hide based on isOpen prop
- **AND** SHALL call onOpenChange on interaction
- **AND** SHALL not manage state internally


### Requirement: ARIA Popover Pattern
The component SHALL implement ARIA popover/dialog pattern per nimbus-core standards.

#### Scenario: Popover roles
- **WHEN** popover renders
- **THEN** Popover.Content SHALL use role="dialog" or role="group"
- **AND** SHALL have aria-modal="false" (non-modal)
- **AND** SHALL associate with trigger via aria-describedby or aria-labelledby
- **AND** trigger SHALL have aria-expanded reflecting state
- **AND** trigger SHALL have aria-haspopup="dialog"

#### Scenario: Screen reader announcements
- **WHEN** popover opens
- **THEN** SHALL announce popover content
- **AND** SHALL provide context about interactive elements
- **AND** SHALL support aria-label or aria-labelledby for accessible name

#### Scenario: Focus indicators
- **WHEN** elements within popover receive focus
- **THEN** SHALL show visible focus indicators
- **AND** SHALL meet 3:1 contrast ratio requirement

### Requirement: Internationalized Labels
The component SHALL use i18n for screen reader text per nimbus-core standards.

#### Scenario: Close button label
- **WHEN** Popover.CloseButton renders
- **THEN** SHALL use i18n aria-label from popover.i18n.ts
- **AND** message "Close popover" SHALL translate across locales


### Requirement: Smooth Transitions
The component SHALL provide smooth appearance and dismissal animations.

#### Scenario: Enter animation
- **WHEN** popover opens
- **THEN** SHALL fade in with opacity transition
- **AND** SHALL scale from trigger position
- **AND** SHALL use duration from design tokens
- **AND** animation SHALL be performant (GPU-accelerated)

#### Scenario: Exit animation
- **WHEN** popover closes
- **THEN** SHALL fade out before removing from DOM
- **AND** SHALL scale toward trigger position
- **AND** SHALL use same duration as enter
- **AND** SHALL complete before focus return


### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** popover renders
- **THEN** SHALL apply popover slot recipe from theme/slot-recipes/popover.ts
- **AND** SHALL style slots: content, arrow, header, body, footer, closeButton
- **AND** SHALL support size variants (sm, md, lg)
- **AND** SHALL use design tokens for colors, spacing, shadows

#### Scenario: Visual styling
- **WHEN** popover displays
- **THEN** SHALL have elevated appearance with shadow
- **AND** SHALL have border radius from tokens
- **AND** SHALL have appropriate background color
- **AND** SHALL ensure content contrast meets WCAG AA


### Requirement: DOM Positioning
The component SHALL render in portal for correct stacking.

#### Scenario: Portal mounting
- **WHEN** popover opens
- **THEN** SHALL render in portal at document root
- **AND** SHALL avoid z-index conflicts
- **AND** SHALL position above other content
- **AND** SHALL clean up portal on unmount

#### Scenario: Container option
- **WHEN** portalContainer prop is provided
- **THEN** SHALL render portal in specified container
- **AND** SHALL support custom portal targets


### Requirement: Mobile Interaction
The component SHALL adapt for touch devices.

#### Scenario: Touch interaction
- **WHEN** on touch device
- **THEN** trigger SHALL respond to tap
- **AND** SHALL not interfere with scrolling
- **AND** SHALL provide adequate touch targets (44x44px minimum)

#### Scenario: Hover mode on touch
- **WHEN** trigger="hover" on touch device
- **THEN** SHALL fallback to click/tap interaction
- **OR** SHALL use long press for hover activation


### Requirement: Optimized Rendering
The component SHALL optimize for performance.

#### Scenario: Lazy mounting
- **WHEN** popover is closed
- **THEN** SHALL not mount content in DOM
- **AND** SHALL only mount when opening
- **AND** SHALL unmount when fully closed after animation

#### Scenario: Scroll optimization
- **WHEN** page scrolls with popover open
- **THEN** SHALL update position efficiently
- **AND** SHALL use requestAnimationFrame for positioning updates
- **AND** MAY close popover on scroll if configured


### Requirement: Optional Overlay
The component SHALL support optional backdrop for emphasis.

#### Scenario: Backdrop rendering
- **WHEN** hasBackdrop={true} prop is set
- **THEN** SHALL render semi-transparent backdrop
- **AND** SHALL dim background content
- **AND** backdrop click SHALL close popover
- **AND** SHALL behave more modal-like with backdrop

#### Scenario: No backdrop (default)
- **WHEN** hasBackdrop is false or not set
- **THEN** SHALL not render backdrop
- **AND** SHALL allow full interaction with background
- **AND** SHALL maintain non-modal behavior


### Requirement: Usage Guidelines
The component documentation SHALL provide usage guidance.

#### Scenario: Content guidelines
- Popovers SHALL contain rich interactive content
- For simple text hints, use Tooltip instead
- For critical flows requiring focus trap, use Dialog instead
- For large content, consider Drawer or full-page navigation
- Keep content focused and scannable

#### Scenario: Accessibility guidelines
- Popovers SHALL support keyboard navigation
- Interactive elements SHALL be focusable and operable
- Provide clear close mechanisms
- Ensure contrast meets WCAG AA standards
- Test with screen readers

#### Scenario: Performance guidelines
- Avoid complex content that causes layout thrashing
- Lazy load heavy content in popover body
- Consider using controlled mode for complex state
- Test on mobile devices for touch interactions
