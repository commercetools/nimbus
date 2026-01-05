# Specification: Tooltip Component

## Overview

The Tooltip component provides accessible contextual help text that appears on hover or focus, following ARIA tooltip pattern.

**Component:** `Tooltip`
**Package:** `@commercetools/nimbus`
**Type:** Multi-slot component
**React Aria:** Uses `Tooltip` and `TooltipTrigger` from react-aria-components

## Trigger Behavior

### Requirement: Hover Interaction
The component SHALL display tooltip on hover.

#### Scenario: Mouse hover
- **WHEN** user hovers over trigger element
- **THEN** SHALL show tooltip after delay
- **AND** SHALL use delay from design tokens (default ~200ms)
- **WHEN** user moves mouse away
- **THEN** SHALL hide tooltip after delay

#### Scenario: Hover delay
- **WHEN** openDelay prop is set
- **THEN** SHALL wait specified milliseconds before showing
- **AND** SHALL prevent flashing for quick mouse movements
- **WHEN** closeDelay prop is set
- **THEN** SHALL wait specified milliseconds before hiding

## Focus Behavior

### Requirement: Focus Interaction
The component SHALL display tooltip on focus.

#### Scenario: Keyboard focus
- **WHEN** trigger element receives focus via keyboard
- **THEN** SHALL show tooltip immediately
- **AND** SHALL keep tooltip visible while focused
- **WHEN** trigger loses focus
- **THEN** SHALL hide tooltip

#### Scenario: Focus-visible optimization
- **WHEN** trigger receives focus via mouse click
- **THEN** SHALL not show tooltip (no focus-visible)
- **WHEN** trigger receives focus via keyboard
- **THEN** SHALL show tooltip (focus-visible)

## Tooltip Positioning

### Requirement: Intelligent Positioning
The component SHALL position tooltip relative to trigger.

#### Scenario: Placement options
- **WHEN** placement prop is set
- **THEN** SHALL support: top, bottom, left, right, top-start, top-end, bottom-start, bottom-end, left-start, left-end, right-start, right-end
- **AND** SHALL default to top placement
- **AND** SHALL use React Aria's overlay positioning

#### Scenario: Viewport collision
- **WHEN** tooltip would overflow viewport
- **THEN** SHALL automatically flip to opposite side
- **AND** SHALL adjust position to stay within bounds
- **AND** SHALL prioritize visibility over preferred placement

#### Scenario: Pointer arrow
- **WHEN** showArrow={true} is set
- **THEN** SHALL render arrow pointing to trigger
- **AND** SHALL position arrow at edge of tooltip
- **AND** arrow SHALL adjust with tooltip position

## Tooltip Content

### Requirement: Content Display
The component SHALL render various content types.

#### Scenario: Text content
- **WHEN** children is string
- **THEN** SHALL render as plain text
- **AND** SHALL apply appropriate text styling
- **AND** SHALL wrap long text

#### Scenario: Rich content
- **WHEN** children is JSX
- **THEN** SHALL render rich content
- **AND** MAY include icons, formatting, or multiple lines
- **AND** SHALL maintain accessibility

## Accessibility

### Requirement: ARIA Tooltip Pattern
The component SHALL implement ARIA tooltip pattern per nimbus-core standards.

#### Scenario: Tooltip role
- **WHEN** tooltip renders
- **THEN** SHALL use role="tooltip"
- **AND** SHALL generate unique ID
- **AND** trigger SHALL reference tooltip via aria-describedby

#### Scenario: Screen reader support
- **WHEN** tooltip appears
- **THEN** screen reader SHALL announce tooltip content
- **AND** SHALL be associated with trigger element
- **AND** SHALL not trap focus

#### Scenario: Interactive content restriction
- **WHEN** tooltip contains content
- **THEN** content SHALL NOT be focusable
- **AND** content SHALL NOT be interactive (no buttons, links)
- **AND** SHALL only provide descriptive text

## Disabled State

### Requirement: Conditional Display
The component SHALL respect disabled state.

#### Scenario: Disabled trigger
- **WHEN** trigger element has disabled={true}
- **THEN** tooltip MAY still show on hover of wrapper
- **AND** SHALL provide context for disabled state
- **WHEN** isDisabled prop is true
- **THEN** tooltip SHALL not show at all

## Tooltip Groups

### Requirement: Multiple Tooltips
The component SHALL handle multiple tooltips gracefully.

#### Scenario: Rapid hover
- **WHEN** user quickly hovers multiple trigger elements
- **THEN** SHALL hide previous tooltip before showing next
- **AND** SHALL not show multiple tooltips simultaneously
- **AND** SHALL cancel pending show/hide timers

## Size and Styling

### Requirement: Visual Variants
The component SHALL support styling options.

#### Scenario: Max width
- **WHEN** maxWidth prop is set
- **THEN** SHALL constrain tooltip width
- **AND** SHALL wrap text when exceeding width
- **AND** default max width SHALL be reasonable (~300px)

#### Scenario: Color variant
- **WHEN** colorPalette prop is set
- **THEN** SHALL support semantic palettes
- **AND** neutral/dark SHALL be default
- **AND** SHALL maintain contrast with background

## Animation

### Requirement: Smooth Transitions
The component SHALL animate appearance/dismissal.

#### Scenario: Fade in
- **WHEN** tooltip appears
- **THEN** SHALL fade in with opacity transition
- **AND** SHALL use duration from design tokens

#### Scenario: Fade out
- **WHEN** tooltip disappears
- **THEN** SHALL fade out before removing from DOM
- **AND** SHALL use same duration as fade in

## Touch Interaction

### Requirement: Mobile Support
The component SHALL adapt for touch devices.

#### Scenario: Touch behavior
- **WHEN** on touch device
- **THEN** long press MAY show tooltip
- **OR** tooltip MAY be disabled entirely
- **AND** SHALL not interfere with normal touch interactions

#### Scenario: Alternative on mobile
- **WHEN** tooltip is critical information
- **THEN** developer SHOULD use alternative UI for mobile
- **AND** tooltip SHALL be supplementary only

## Controlled Mode

### Requirement: Programmatic Control
The component SHALL support controlled visibility.

#### Scenario: Controlled state
- **WHEN** isOpen and onOpenChange props are provided
- **THEN** SHALL show/hide based on isOpen
- **AND** SHALL call onOpenChange on interaction
- **AND** SHALL not manage state internally

## Offset and Positioning

### Requirement: Position Customization
The component SHALL support position adjustment.

#### Scenario: Offset distance
- **WHEN** offset prop is set
- **THEN** SHALL adjust distance from trigger
- **AND** SHALL maintain alignment

#### Scenario: Cross axis offset
- **WHEN** crossOffset prop is set
- **THEN** SHALL adjust position along cross axis
- **AND** SHALL allow fine-tuned placement

## Styling

### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** tooltip renders
- **THEN** SHALL apply tooltip slot recipe from theme/slot-recipes/tooltip.ts
- **AND** SHALL style: content, arrow slots
- **AND** SHALL support color variants

## Performance

### Requirement: Optimized Rendering
The component SHALL optimize performance.

#### Scenario: Portal rendering
- **WHEN** tooltip appears
- **THEN** SHALL render in portal at document root
- **AND** SHALL avoid z-index issues
- **AND** SHALL clean up portal on unmount

#### Scenario: Lazy mounting
- **WHEN** tooltip is hidden
- **THEN** SHALL not mount tooltip content
- **AND** SHALL only mount when about to show

## Best Practices Guidance

### Requirement: Usage Guidelines
The component documentation SHALL provide usage guidance.

#### Scenario: Content guidelines
- Tooltips SHALL contain brief, supplementary information
- Tooltips SHALL NOT contain critical information
- Tooltips SHALL NOT duplicate visible labels
- For complex content, use Popover instead

#### Scenario: Accessibility guidelines
- Tooltips SHALL NOT contain interactive elements
- Tooltips SHALL NOT trap focus
- For required information, use inline text instead
- Ensure trigger is keyboard accessible
