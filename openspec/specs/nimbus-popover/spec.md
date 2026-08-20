# Specification: Popover Component

## Overview

The Popover component provides an accessible overlay positioned relative to a trigger element, containing interactive content. It follows the ARIA dialog pattern with intelligent positioning and focus management.

**Component:** `Popover` (compound namespace: `Root`, `Trigger`, `Content`)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `DialogTrigger`, `Popover` and `Dialog` from react-aria-components
**i18n:** None

## Purpose

Popover provides an overlay for displaying rich, interactive content relative to a trigger element. Unlike Tooltip (non-interactive info on hover), Popover supports forms, buttons, and complex UI while maintaining accessibility. Unlike Dialog, it stays anchored to its trigger rather than taking over the page, and it is dismissed by Escape or an outside press rather than requiring an explicit action. Use Popover for supplementary actions, filters, settings panels, or context-sensitive content that doesn't require full modal attention.

Focus is contained within the popover and outside interaction dismisses it, following React Aria's default for a dialog inside a popover. `isNonModal` relaxes that containment; React Aria's guidance is that most popovers should not use it.

## Requirements

### Requirement: Namespace Structure

The component SHALL be exported from `@commercetools/nimbus` as a compound
component namespace with exactly three parts.

#### Scenario: Component parts

- **WHEN** `Popover` is imported from `@commercetools/nimbus`
- **THEN** it SHALL provide `Popover.Root` as the configuration and state scope
- **AND** it SHALL provide `Popover.Trigger` as the activating element
- **AND** it SHALL provide `Popover.Content` as the overlay surface
- **AND** `Root` SHALL be the first property in the namespace
- **AND** it SHALL NOT expose any other parts

#### Scenario: Public availability

- **WHEN** a consumer installs the package
- **THEN** `Popover` SHALL be importable from the package root
- **AND** its part prop types SHALL be exported alongside it

#### Scenario: Compound component coordination

- **WHEN** `Popover.Root` wraps a trigger and content
- **THEN** it SHALL coordinate open state between trigger and content
- **AND** it SHALL provide styling context to both child parts
- **AND** the context SHALL reach content rendered in a portal

#### Scenario: Root introduces no layout box

- **WHEN** `Popover.Root` renders
- **THEN** it SHALL NOT mount a DOM element of its own
- **AND** the trigger's position in its parent's layout SHALL be unaffected

#### Scenario: Content supplies its own dialog

- **WHEN** `Popover.Content` renders children
- **THEN** it SHALL wrap them in a dialog element
- **AND** consumers SHALL NOT be required to supply one
- **AND** the dialog SHALL carry the overlay's accessible name

### Requirement: Trigger Activation

The component SHALL open the popover from a press interaction on the trigger.

#### Scenario: Click trigger

- **WHEN** the user clicks or taps `Popover.Trigger` while closed
- **THEN** it SHALL open the popover
- **AND** it SHALL position the popover relative to the trigger
- **WHEN** the user clicks or taps `Popover.Trigger` while open
- **THEN** it SHALL close the popover

#### Scenario: Programmatic control

- **WHEN** `isOpen`, `defaultOpen` or `onOpenChange` is set on `Popover.Root`
- **THEN** open state SHALL be controllable without a user interaction
- **AND** `onOpenChange` SHALL fire for every open and close transition

#### Scenario: Hover trigger mode

- **WHEN** the user hovers over `Popover.Trigger`
- **THEN** it SHALL NOT open the popover
- **AND** the component SHALL NOT offer a hover-activation mode
- **AND** hover-activated overlays SHALL remain the responsibility of Tooltip

#### Scenario: Custom trigger element

- **WHEN** `Popover.Trigger` is given a custom child element via `asChild`
- **THEN** it SHALL apply trigger behavior to that element
- **AND** it SHALL NOT introduce a nested interactive element

### Requirement: Intelligent Placement

The component SHALL position the popover relative to the trigger with collision
detection.

#### Scenario: Placement options

- **WHEN** the `placement` prop is set on `Popover.Content`
- **THEN** it SHALL accept a primary side — physical (`top`, `bottom`, `left`,
  `right`) or logical (`start`, `end`)
- **AND** a vertical side SHALL accept the alignments `left`, `right`, `start`
  or `end`, separated by a space
- **AND** a horizontal side SHALL accept the alignments `top` or `bottom`,
  separated by a space
- **AND** it SHALL default to `bottom`
- **AND** it SHALL use React Aria's overlay positioning

#### Scenario: Viewport collision detection

- **WHEN** the popover would overflow the viewport
- **THEN** it SHALL flip to the opposite side
- **AND** it SHALL adjust position to stay within viewport bounds
- **AND** it SHALL prioritize visibility over the preferred placement

#### Scenario: Offset positioning

- **WHEN** the `offset` prop is set
- **THEN** it SHALL adjust the distance from the trigger in pixels

#### Scenario: Cross-axis offset

- **WHEN** the `crossOffset` prop is set
- **THEN** it SHALL adjust position along the perpendicular axis
- **AND** it SHALL combine with the primary placement

### Requirement: Close Mechanisms

The component SHALL provide multiple ways to dismiss the popover.

#### Scenario: Close button

- **WHEN** content inside the popover needs to dismiss it
- **THEN** `Popover.Content` SHALL accept a function child receiving a `close`
  callback
- **AND** calling `close` SHALL dismiss the popover and return focus to the
  trigger
- **AND** the component SHALL NOT render a built-in close button of its own

#### Scenario: Escape key

- **WHEN** the popover is open and the user presses Escape
- **THEN** it SHALL close the popover
- **AND** it SHALL return focus to the trigger
- **AND** it SHALL NOT propagate Escape to parent overlays

#### Scenario: Outside click

- **WHEN** the user clicks or taps outside the popover
- **THEN** it SHALL close the popover

#### Scenario: Controlled closure

- **WHEN** `isOpen` and `onOpenChange` are provided
- **THEN** it SHALL call `onOpenChange(false)` on a close attempt
- **AND** it SHALL NOT close until `isOpen` becomes false

### Requirement: Complex Content

The component SHALL support interactive elements within the popover.

#### Scenario: Form elements

- **WHEN** the popover contains form inputs
- **THEN** the user SHALL be able to focus and type in them
- **AND** typing SHALL NOT dismiss the popover

#### Scenario: Buttons and links

- **WHEN** the popover contains buttons or links
- **THEN** they SHALL be reachable by keyboard and operable by press
- **AND** activating them SHALL NOT dismiss the popover unless the handler does
  so

#### Scenario: Nested interactive content

- **WHEN** the popover contains complex UI such as tabs or selects
- **THEN** it SHALL support their full interaction patterns
- **AND** it SHALL NOT conflict with nested overlay triggers

### Requirement: Keyboard Support

The component SHALL support comprehensive keyboard interaction.

#### Scenario: Trigger keyboard

- **WHEN** `Popover.Trigger` is focused and the user presses Enter or Space
- **THEN** it SHALL toggle the popover open or closed
- **AND** the trigger SHALL expose its expanded state

#### Scenario: Tab navigation

- **WHEN** the popover is open and the user presses Tab
- **THEN** focus SHALL move between focusable elements inside the popover
- **AND** the tab order SHALL follow document order within the dialog

#### Scenario: Escape key

- **WHEN** the popover is open and the user presses Escape
- **THEN** it SHALL close the popover and return focus to the trigger

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

The component SHALL implement the ARIA dialog-in-popover pattern.

#### Scenario: Popover roles

- **WHEN** the popover renders
- **THEN** `Popover.Content` SHALL contain an element with `role="dialog"`
- **AND** the trigger SHALL expose `aria-expanded` reflecting open state
- **AND** the trigger SHALL expose `aria-controls` referencing the overlay while
  open
- **AND** the trigger SHALL NOT expose `aria-haspopup`, matching React Aria's
  deliberate omission for dialog-type overlays

#### Scenario: Accessible name

- **WHEN** the popover has no visible heading
- **THEN** it SHALL accept `aria-label` or `aria-labelledby` for its name
- **AND** the name SHALL be announced when the popover opens

#### Scenario: Screen reader announcements

- **WHEN** the popover opens
- **THEN** the dialog and its content SHALL be announced

#### Scenario: Focus indicators

- **WHEN** a focusable element inside the popover receives keyboard focus
- **THEN** a visible focus indicator SHALL be rendered
- **AND** the indicator SHALL meet WCAG AA contrast against its background

### Requirement: Smooth Transitions

The component SHALL animate appearance and dismissal.

#### Scenario: Enter animation

- **WHEN** the popover opens
- **THEN** it SHALL fade and scale in
- **AND** it SHALL use duration design tokens

#### Scenario: Exit animation

- **WHEN** the popover closes
- **THEN** it SHALL fade and scale out before leaving the DOM
- **AND** it SHALL use the same duration as the enter animation

### Requirement: Multi-Slot Recipe

The component SHALL use a multi-slot recipe registered as a slot recipe.

#### Scenario: Slot styling

- **WHEN** the popover renders
- **THEN** it SHALL apply a slot recipe keyed `nimbusPopover`
- **AND** the recipe SHALL define the slots `root`, `trigger`, `content`, and
  `dialog`
- **AND** the recipe SHALL be registered among the theme's slot recipes

#### Scenario: Token-based styling

- **WHEN** the popover surface renders
- **THEN** every color, spacing, radius and shadow value SHALL come from a
  design token
- **AND** no raw CSS color values SHALL be used

#### Scenario: Visual styling

- **WHEN** the popover displays
- **THEN** it SHALL have an elevated appearance via a shadow token
- **AND** it SHALL use a radius token for its corners
- **AND** content contrast SHALL meet WCAG AA

#### Scenario: Style prop overrides

- **WHEN** a consumer passes style props to `Popover.Content`
- **THEN** those props SHALL override the corresponding recipe values

### Requirement: DOM Positioning

The component SHALL render in a portal for correct stacking.

#### Scenario: Portal mounting

- **WHEN** the popover opens
- **THEN** it SHALL render in a portal at the document root
- **AND** it SHALL position above other content
- **AND** it SHALL clean up the portal on unmount

#### Scenario: Slot recipe context crosses the portal

- **WHEN** `Popover.Content` renders inside the portal
- **THEN** it SHALL still receive the slot-recipe context installed by
  `Popover.Root`
- **AND** the surface SHALL be styled rather than falling back to unstyled

#### Scenario: Container option

- **WHEN** a consumer needs the overlay to portal into a specific container
- **THEN** `Popover.Content` SHALL NOT expose a portal-container prop of its own
- **AND** the portal target SHALL be controlled by React Aria's
  `UNSAFE_PortalProvider` placed higher in the tree

### Requirement: Mobile Interaction

The component SHALL be operable on touch devices.

#### Scenario: Touch interaction

- **WHEN** used on a touch device
- **THEN** the trigger SHALL respond to tap
- **AND** the popover SHALL NOT interfere with page scrolling while closed

#### Scenario: Touch target sizing

- **WHEN** the default `Popover.Trigger` renders
- **THEN** it SHALL NOT impose a minimum target size of its own
- **AND** meeting the minimum target size SHALL be the responsibility of the
  element supplied via `asChild`, or of the consumer styling the trigger

#### Scenario: Hover mode on touch

- **WHEN** a consumer wants an overlay activated by hover
- **THEN** `Popover` SHALL NOT provide a hover trigger mode
- **AND** `Tooltip` SHALL be used for hover-activated content instead

### Requirement: Optimized Rendering

The component SHALL keep overlay content out of the DOM while closed, and SHALL
stay anchored to its trigger while the page moves.

#### Scenario: Lazy mounting

- **WHEN** the popover is closed
- **THEN** the overlay content SHALL NOT be mounted in the DOM
- **AND** it SHALL mount when the popover opens
- **AND** it SHALL unmount once the exit animation has finished

#### Scenario: Scroll optimization

- **WHEN** the page scrolls or the viewport resizes while the popover is open
- **THEN** the popover SHALL remain anchored to its trigger
- **AND** it SHALL stay within the viewport, flipping or shifting as needed
- **AND** no scroll-dismissal option SHALL be exposed

### Requirement: Usage Guidelines

The component documentation SHALL provide usage guidance.

#### Scenario: Content guidelines

- **WHEN** choosing between overlay components
- **THEN** Popover SHALL be recommended for rich interactive content
- **AND** Tooltip SHALL be recommended for simple non-interactive hints
- **AND** Dialog SHALL be recommended for flows requiring a page-blocking modal
- **AND** Drawer or full-page navigation SHALL be recommended for large content

#### Scenario: Accessibility guidelines

- **WHEN** authoring popover content
- **THEN** an accessible name SHALL be provided when no heading is present
- **AND** all interactive elements SHALL be keyboard operable
- **AND** contrast SHALL meet WCAG AA

#### Scenario: Composition guidelines

- **WHEN** documenting the component
- **THEN** examples SHALL show the three-part composition
- **AND** examples SHALL show controlled and uncontrolled open state

#### Scenario: Performance guidelines

- **WHEN** authoring popover content
- **THEN** heavy content SHALL be lazy-loaded inside the popover
- **AND** content SHALL avoid layout thrashing while the popover is positioned

### Requirement: Focus Management

The component SHALL manage focus using React Aria's default popover focus
behavior, and SHALL allow that behavior to be relaxed.

#### Scenario: Opening focus

- **WHEN** the popover opens
- **THEN** it SHALL move focus into the popover's dialog
- **AND** screen readers SHALL announce the dialog

#### Scenario: Focus containment by default

- **WHEN** the popover is open and no override is set
- **THEN** keyboard focus SHALL be contained within the popover
- **AND** pointer interaction outside the popover SHALL dismiss it rather than
  reach the element beneath

#### Scenario: Relaxed containment

- **WHEN** `isNonModal` is set on `Popover.Content`
- **THEN** assistive technologies SHALL be able to reach content outside the
  popover
- **AND** focus SHALL NOT be contained within the popover

#### Scenario: Closing focus

- **WHEN** the popover closes
- **THEN** it SHALL return focus to the trigger element
- **AND** the focus indicator SHALL be visible
