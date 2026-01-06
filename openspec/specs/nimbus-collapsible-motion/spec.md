# Specification: CollapsibleMotion Component

## Overview

The CollapsibleMotion component provides a utility wrapper for smooth expand/collapse animations with accessibility support. It implements the disclosure pattern using React Aria primitives and Chakra UI's Presence component for animation.

**Component:** `CollapsibleMotion` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** Uses `useDisclosure` and `useDisclosureState` from react-aria and react-stately

## Purpose

CollapsibleMotion is a low-level utility component that provides animated expand/collapse behavior for content. Unlike Accordion (which provides full UI patterns for collapsible sections), CollapsibleMotion focuses solely on animation primitives and state management, allowing developers to build custom collapsible interfaces with smooth transitions.

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** CollapsibleMotion is imported
- **THEN** SHALL provide CollapsibleMotion.Root as state container
- **AND** SHALL provide CollapsibleMotion.Trigger for toggle button
- **AND** SHALL provide CollapsibleMotion.Content for collapsible content
- **AND** Root SHALL be first property in namespace

#### Scenario: Context isolation
- **WHEN** multiple CollapsibleMotion instances are rendered
- **THEN** each SHALL maintain independent state
- **AND** SHALL not interfere with other instances
- **AND** context SHALL throw error if child used outside Root

### Requirement: Controlled and Uncontrolled Modes
The component SHALL support both controlled and uncontrolled state management per nimbus-core standards.

#### Scenario: Uncontrolled mode
- **WHEN** defaultExpanded prop is provided
- **THEN** SHALL initialize with specified expansion state
- **AND** SHALL manage state internally via React Stately
- **AND** SHALL toggle state on trigger interaction
- **AND** optional onExpandedChange SHALL receive updates

#### Scenario: Controlled mode
- **WHEN** isExpanded and onExpandedChange props are provided
- **THEN** SHALL render with specified expanded state
- **AND** SHALL call onExpandedChange when user triggers toggle
- **AND** SHALL not update internal state
- **AND** parent component controls expansion state

#### Scenario: Controlled without trigger
- **WHEN** isExpanded prop is provided without CollapsibleMotion.Trigger
- **THEN** SHALL respond to state changes from external controls
- **AND** SHALL animate expand/collapse based on prop changes
- **AND** SHALL support programmatic control of expansion

### Requirement: Default Expansion State
The component SHALL support initial expansion configuration.

#### Scenario: Default collapsed
- **WHEN** defaultExpanded={false} is set (or omitted)
- **THEN** SHALL initialize in collapsed state
- **AND** content SHALL be hidden initially
- **AND** trigger SHALL show aria-expanded="false"

#### Scenario: Default expanded
- **WHEN** defaultExpanded={true} is set
- **THEN** SHALL initialize in expanded state
- **AND** content SHALL be visible initially
- **AND** trigger SHALL show aria-expanded="true"

### Requirement: Expansion Toggle
The component SHALL toggle expansion state on trigger interaction.

#### Scenario: Expand action
- **WHEN** collapsed and trigger is activated
- **THEN** SHALL change to expanded state
- **AND** SHALL call onExpandedChange with true
- **AND** SHALL animate content expansion
- **AND** SHALL update aria-expanded to "true"

#### Scenario: Collapse action
- **WHEN** expanded and trigger is activated
- **THEN** SHALL change to collapsed state
- **AND** SHALL call onExpandedChange with false
- **AND** SHALL animate content collapse
- **AND** SHALL update aria-expanded to "false"

### Requirement: Trigger Button Rendering
The component SHALL provide button element for toggling expansion.

#### Scenario: Default button rendering
- **WHEN** asChild={false} (or omitted)
- **THEN** SHALL render as button element
- **AND** SHALL use React Aria Button for accessibility
- **AND** SHALL apply CollapsibleMotionTriggerSlot styling
- **AND** SHALL merge React Aria button props with component props

#### Scenario: AsChild rendering
- **WHEN** asChild={true} is set
- **THEN** SHALL apply button behavior to child element
- **AND** SHALL merge button props with child props
- **AND** SHALL preserve child element type (e.g., custom Button)
- **AND** SHALL forward all necessary ARIA attributes to child

#### Scenario: Non-button trigger elements
- **WHEN** asChild={true} with non-button child (e.g., Box)
- **THEN** SHALL render child element with button role
- **AND** SHALL apply proper ARIA attributes
- **AND** SHALL support click and keyboard interactions
- **AND** SHALL maintain accessibility for screen readers

### Requirement: Trigger Interaction
The component SHALL handle user interactions on trigger.

#### Scenario: Click interaction
- **WHEN** user clicks trigger button
- **THEN** SHALL toggle expansion state
- **AND** SHALL call onExpandedChange callback
- **AND** SHALL not fire if disabled

#### Scenario: Keyboard interaction
- **WHEN** trigger is focused and user presses Enter or Space
- **THEN** SHALL toggle expansion state
- **AND** SHALL follow React Aria keyboard patterns
- **AND** SHALL provide visual feedback

#### Scenario: Disabled trigger
- **WHEN** isDisabled={true} on Root
- **THEN** trigger SHALL have disabled attribute
- **AND** SHALL not respond to clicks or keyboard
- **AND** SHALL display disabled styling
- **AND** SHALL prevent expansion state changes

### Requirement: Content Rendering
The component SHALL render collapsible content with animation.

#### Scenario: Expanded content
- **WHEN** isExpanded={true}
- **THEN** SHALL render content with Presence component
- **AND** SHALL animate slide-from-top and fade-in
- **AND** SHALL set aria-hidden="false" on panel
- **AND** content SHALL be visible and accessible

#### Scenario: Collapsed content
- **WHEN** isExpanded={false}
- **THEN** SHALL animate slide-to-top and fade-out
- **AND** SHALL set aria-hidden="true" on panel
- **AND** content SHALL be hidden from screen readers
- **AND** SHALL eventually unmount content from DOM

#### Scenario: Custom animations
- **WHEN** animationName prop is provided on Content
- **THEN** SHALL override default slide/fade animations
- **AND** SHALL support _open and _closed animation states
- **AND** SHALL accept Chakra animation token values
- **AND** SHALL respect animationDuration prop

### Requirement: Animation Duration
The component SHALL support configurable animation timing.

#### Scenario: Default duration
- **WHEN** no animationDuration specified
- **THEN** SHALL use "fast" duration (from Chakra tokens)
- **AND** SHALL provide smooth, performant transition
- **AND** SHALL complete animation before DOM changes

#### Scenario: Custom duration
- **WHEN** animationDuration prop is provided
- **THEN** SHALL accept token values: "instant", "fast", "moderate", "slow", "slowest"
- **AND** SHALL apply to both expand and collapse
- **AND** SHALL maintain smooth motion throughout

### Requirement: Content Size Changes
The component SHALL handle dynamic content size changes.

#### Scenario: Content changes while expanded
- **WHEN** content size changes during expanded state
- **THEN** SHALL re-measure content height automatically
- **AND** SHALL adjust container height smoothly
- **AND** ResizeObserver SHALL detect size changes
- **AND** SHALL maintain smooth transitions

#### Scenario: Different content on toggle
- **WHEN** content changes between expand/collapse cycles
- **THEN** SHALL measure new content height correctly
- **AND** SHALL animate to appropriate target height
- **AND** SHALL not cause layout jumps or flickers

### Requirement: ARIA Attributes
The component SHALL provide proper ARIA attributes per nimbus-core standards.

#### Scenario: Trigger ARIA attributes
- **WHEN** trigger renders
- **THEN** SHALL set aria-expanded based on state
- **AND** SHALL set aria-controls with panel ID
- **AND** SHALL be keyboard focusable with proper tab order
- **AND** SHALL communicate state changes to screen readers

#### Scenario: Content ARIA attributes
- **WHEN** content panel renders
- **THEN** SHALL set aria-hidden based on expanded state
- **AND** SHALL set aria-labelledby referencing trigger
- **AND** SHALL have stable ID for aria-controls relationship
- **AND** panelProps from React Aria SHALL be applied

#### Scenario: Screen reader announcements
- **WHEN** expansion state changes
- **THEN** screen readers SHALL announce new state
- **AND** SHALL communicate whether content is expanded or collapsed
- **AND** SHALL respect aria-hidden during collapsed state
- **AND** content SHALL not be reachable via Tab when collapsed

### Requirement: Keyboard Navigation
The component SHALL support keyboard interaction per nimbus-core standards.

#### Scenario: Focus management
- **WHEN** trigger receives focus
- **THEN** SHALL show visible focus indicator
- **AND** SHALL support Tab key navigation
- **AND** SHALL maintain logical tab order
- **AND** SHALL not trap focus

#### Scenario: Expanded content focus
- **WHEN** content is expanded and contains focusable elements
- **THEN** SHALL allow Tab navigation into content
- **AND** SHALL maintain natural DOM focus order
- **AND** SHALL not auto-focus content on expansion

### Requirement: Disabled Interaction Prevention
The component SHALL support disabled state that prevents all interactions.

#### Scenario: Disabled component
- **WHEN** isDisabled={true} is set
- **THEN** trigger SHALL have disabled attribute
- **AND** SHALL not respond to clicks or keyboard
- **AND** SHALL show disabled cursor (not-allowed)
- **AND** SHALL prevent expansion state changes

#### Scenario: Disabled styling
- **WHEN** component is disabled
- **THEN** trigger SHALL show reduced opacity or disabled styling
- **AND** SHALL indicate non-interactive state visually
- **AND** SHALL maintain WCAG contrast requirements where applicable

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI slot recipe per nimbus-core standards.

#### Scenario: Recipe structure
- **WHEN** component renders
- **THEN** SHALL apply collapsibleMotion slot recipe
- **AND** recipe SHALL define root, trigger, content slots
- **AND** recipe SHALL be registered in theme/slot-recipes
- **AND** SHALL use minimal base styles (utility wrapper)

#### Scenario: Recipe slots
- **WHEN** recipe is applied
- **THEN** root slot SHALL provide container styles
- **AND** trigger slot SHALL provide cursor pointer
- **AND** content slot SHALL provide animation styles
- **AND** SHALL support recipe variants if needed

### Requirement: Style Props Support
The component SHALL accept Chakra style props per nimbus-core standards.

#### Scenario: Root style props
- **WHEN** style props are provided to Root
- **THEN** SHALL accept all Chakra style props
- **AND** SHALL apply to root container element
- **AND** SHALL override recipe defaults when provided

#### Scenario: Trigger style props
- **WHEN** style props are provided to Trigger
- **THEN** SHALL accept all Chakra style props
- **AND** SHALL merge with trigger slot styles
- **AND** SHALL support responsive style values

#### Scenario: Content style props
- **WHEN** style props are provided to Content
- **THEN** SHALL accept all Chakra style props
- **AND** SHALL apply to content container
- **AND** SHALL respect animation and Presence behavior

### Requirement: Ref Support
The component SHALL support React ref forwarding per nimbus-core standards.

#### Scenario: Root ref forwarding
- **WHEN** ref is passed to CollapsibleMotion.Root
- **THEN** SHALL forward ref to root div element
- **AND** SHALL provide access to DOM node
- **AND** SHALL support both callback and object refs

#### Scenario: Trigger ref forwarding
- **WHEN** ref is passed to CollapsibleMotion.Trigger
- **THEN** SHALL forward ref to button element
- **AND** SHALL support focus management
- **AND** SHALL work with asChild rendering

#### Scenario: Content ref forwarding
- **WHEN** ref is passed to CollapsibleMotion.Content
- **THEN** SHALL forward ref to content div element
- **AND** SHALL merge with internal panel ref
- **AND** SHALL provide access to content container

### Requirement: Presence-Based Animation
The component SHALL use Chakra UI Presence for mount/unmount animations.

#### Scenario: Presence integration
- **WHEN** content expands
- **THEN** SHALL use Presence with present={isExpanded}
- **AND** SHALL animate entry with slide-from-top, fade-in
- **AND** SHALL apply _open animation state
- **AND** SHALL complete animation before making content interactive

#### Scenario: Exit animation
- **WHEN** content collapses
- **THEN** SHALL animate exit with slide-to-top, fade-out
- **AND** SHALL apply _closed animation state
- **AND** SHALL complete animation before DOM unmount
- **AND** SHALL maintain proper aria-hidden during animation

### Requirement: Reduced Motion Support
The component SHALL respect prefers-reduced-motion user preference per nimbus-core standards.

#### Scenario: Reduced motion preference
- **WHEN** user has prefers-reduced-motion: reduce
- **THEN** Chakra Presence SHALL disable animations
- **AND** content SHALL appear/disappear instantly
- **AND** SHALL maintain functional behavior without motion
- **AND** accessibility SHALL not be compromised

### Requirement: Type Definitions
The component SHALL export comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Component props types
- **WHEN** component is used in TypeScript
- **THEN** SHALL export CollapsibleMotionRootProps
- **AND** SHALL export CollapsibleMotionTriggerProps
- **AND** SHALL export CollapsibleMotionContentProps
- **AND** SHALL include JSDoc comments for all props

#### Scenario: Recipe types
- **WHEN** styling props are used
- **THEN** SHALL export CollapsibleMotionRecipeProps
- **AND** types SHALL be derived from SlotRecipeProps
- **AND** SHALL provide autocomplete for recipe variants

#### Scenario: Context types
- **WHEN** context is consumed internally
- **THEN** SHALL define CollapsibleMotionContextValue interface
- **AND** SHALL include all shared state properties
- **AND** SHALL be properly typed with React Aria types

### Requirement: Component Identification
The component SHALL set displayName for debugging per nimbus-core standards.

#### Scenario: Display names
- **WHEN** components are created
- **THEN** Root SHALL set displayName="CollapsibleMotion.Root"
- **AND** Trigger SHALL set displayName="CollapsibleMotion.Trigger"
- **AND** Content SHALL set displayName="CollapsibleMotion.Content"
- **AND** SHALL appear correctly in React DevTools

### Requirement: Custom Data Attributes
The component SHALL support data attributes for testing and metadata.

#### Scenario: Data attribute support
- **WHEN** data-* props are provided
- **THEN** SHALL accept any data-* attributes on Root
- **AND** SHALL forward to rendered element
- **AND** SHALL be accessible via DOM queries
- **AND** SHALL support testing and analytics use cases

### Requirement: React Aria Disclosure Pattern
The component SHALL implement accessibility using React Aria disclosure primitives.

#### Scenario: State management integration
- **WHEN** Root component initializes
- **THEN** SHALL use useDisclosureState for state management
- **AND** SHALL pass defaultExpanded, isExpanded, onExpandedChange
- **AND** SHALL support both controlled and uncontrolled modes
- **AND** state SHALL follow React Aria patterns

#### Scenario: ARIA props generation
- **WHEN** useDisclosure hook is called
- **THEN** SHALL generate buttonProps for trigger
- **AND** SHALL generate panelProps for content
- **AND** SHALL establish aria-controls/aria-labelledby relationship
- **AND** SHALL provide proper aria-expanded values

### Requirement: Context Usage Validation
The component SHALL validate proper context usage.

#### Scenario: Child outside Root
- **WHEN** Trigger or Content is used without Root
- **THEN** SHALL throw descriptive error
- **AND** error message SHALL mention CollapsibleMotion.Root requirement
- **AND** SHALL fail fast during development
- **AND** SHALL provide clear guidance for fix
