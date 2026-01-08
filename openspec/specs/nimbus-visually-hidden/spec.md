# Specification: VisuallyHidden Component

## Overview

The VisuallyHidden component hides content visually while keeping it accessible to screen readers and other assistive technologies. It wraps React Aria's VisuallyHidden primitive to provide a standardized accessibility utility for the Nimbus design system.

**Component:** `VisuallyHidden`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1 utility)
**React Aria:** Yes (wraps React Aria VisuallyHidden)
**i18n:** No (wraps user-provided content)

## Purpose

VisuallyHidden provides screen reader users with additional context, labels, or navigation options without cluttering the visual interface. It enables developers to enhance accessibility by including descriptive text, skip navigation links, or supplementary information that aids screen reader comprehension while maintaining a clean visual design for sighted users.

## Requirements

### Requirement: Visual Hiding Implementation
The component SHALL hide content visually using CSS while maintaining accessibility tree presence.

#### Scenario: CSS-based visual hiding
- **WHEN** component renders
- **THEN** SHALL apply position: absolute
- **AND** SHALL apply width: 1px
- **AND** SHALL apply height: 1px
- **AND** SHALL apply clip: rect(0, 0, 0, 0)
- **AND** SHALL apply clipPath: inset(50%)
- **AND** SHALL apply overflow: hidden
- **AND** SHALL apply whiteSpace: nowrap
- **AND** SHALL apply margin: -1px
- **AND** SHALL apply padding: 0px

#### Scenario: Accessibility tree preservation
- **WHEN** content is visually hidden
- **THEN** SHALL remain in document accessibility tree
- **AND** SHALL be discoverable by screen readers
- **AND** SHALL be announced to assistive technologies
- **AND** SHALL preserve semantic meaning of child elements
- **AND** SHALL maintain DOM order for navigation

#### Scenario: Screen reader visibility
- **WHEN** screen reader navigates content
- **THEN** SHALL read hidden text content
- **AND** SHALL maintain sequential reading order
- **AND** SHALL preserve semantic HTML structure
- **AND** SHALL not apply aria-hidden or display: none
- **AND** SHALL allow screen reader focus on focusable children

### Requirement: Children Content Rendering
The component SHALL accept and render any React node as children.

#### Scenario: Text content
- **WHEN** children contains text string
- **THEN** SHALL render text inside hidden container
- **AND** SHALL preserve text formatting
- **AND** SHALL maintain text accessibility

#### Scenario: React element content
- **WHEN** children contains React elements
- **THEN** SHALL render elements inside hidden container
- **AND** SHALL preserve component structure and props
- **AND** SHALL maintain element accessibility features

#### Scenario: Multiple children
- **WHEN** children contains multiple elements
- **THEN** SHALL render all children inside hidden container
- **AND** SHALL preserve sibling order
- **AND** SHALL maintain layout structure

### Requirement: Polymorphic Element Rendering
The component SHALL support configurable element type via as prop.

#### Scenario: Default div element
- **WHEN** as prop is not provided
- **THEN** SHALL render as div element
- **AND** SHALL be suitable for block-level content
- **AND** SHALL maintain default HTML semantics

#### Scenario: Span element for inline content
- **WHEN** as="span" is set
- **THEN** SHALL render as span element
- **AND** SHALL be suitable for inline content
- **AND** SHALL maintain inline HTML semantics
- **AND** SHALL not break text flow in parent containers

#### Scenario: Element type validation
- **WHEN** as prop is provided
- **THEN** SHALL accept "span" or "div"
- **AND** SHALL type-check at compile time
- **AND** SHALL prevent invalid element types

### Requirement: Focus Visibility for Focusable Content
The component SHALL support making content visible when focusable children receive keyboard focus.

#### Scenario: Focus visibility enabled
- **WHEN** isFocusable prop is true
- **THEN** SHALL monitor focus state of children
- **AND** SHALL remove visual hiding styles when child receives focus
- **AND** SHALL restore visual hiding styles when focus leaves
- **AND** SHALL become visible on keyboard focus (Tab navigation)
- **AND** SHALL not become visible on mouse/pointer focus

#### Scenario: Focus visibility disabled
- **WHEN** isFocusable prop is false or not provided
- **THEN** SHALL maintain visual hiding regardless of focus
- **AND** SHALL not apply focus-within pseudo-class behavior
- **AND** focusable children SHALL remain visually hidden when focused

#### Scenario: Skip navigation use case
- **WHEN** isFocusable is true and contains link or button
- **THEN** SHALL become visible when user tabs to element
- **AND** SHALL allow keyboard users to activate skip link
- **AND** SHALL hide again when focus moves away
- **AND** SHALL provide keyboard-only navigation shortcut

### Requirement: React Aria Integration
The component SHALL wrap and configure React Aria's VisuallyHidden primitive.

#### Scenario: React Aria VisuallyHidden usage
- **WHEN** component renders
- **THEN** SHALL import VisuallyHidden from react-aria
- **AND** SHALL forward props to React Aria component
- **AND** SHALL leverage React Aria's accessibility implementation
- **AND** SHALL benefit from React Aria's cross-browser support

#### Scenario: Element type mapping
- **WHEN** as prop is provided
- **THEN** SHALL map as prop to React Aria's elementType prop
- **AND** SHALL convert Nimbus prop naming to React Aria convention
- **AND** SHALL maintain consistent API with other Nimbus components

#### Scenario: Props forwarding
- **WHEN** additional props are provided
- **THEN** SHALL forward children prop to React Aria
- **AND** SHALL forward isFocusable prop to React Aria
- **AND** SHALL forward elementType derived from as prop
- **AND** SHALL allow React Aria to handle HTML attributes

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive TypeScript definitions.

#### Scenario: Props interface definition
- **WHEN** component is imported in TypeScript
- **THEN** SHALL export VisuallyHiddenProps type
- **AND** SHALL extend React Aria VisuallyHiddenProps
- **AND** SHALL omit elementType from React Aria props
- **AND** SHALL add as prop with "span" | "div" union type
- **AND** SHALL include JSDoc comments for all props

#### Scenario: Children type safety
- **WHEN** children prop is typed
- **THEN** SHALL accept ReactNode type
- **AND** SHALL allow string, number, JSX elements
- **AND** SHALL allow null, undefined, boolean
- **AND** SHALL allow arrays and fragments

#### Scenario: As prop type constraint
- **WHEN** as prop is typed
- **THEN** SHALL restrict to "span" | "div" literal types
- **AND** SHALL provide autocomplete in IDEs
- **AND** SHALL prevent invalid element types at compile time

### Requirement: Display Name Configuration
The component SHALL set a displayName for debugging and DevTools.

#### Scenario: Display name assignment
- **WHEN** component is defined
- **THEN** SHALL set displayName to "VisuallyHidden"
- **AND** SHALL appear in React DevTools
- **AND** SHALL appear in error messages and stack traces
- **AND** SHALL improve debugging experience

### Requirement: Ref Forwarding Support
The component SHALL support React ref forwarding to underlying element.

#### Scenario: Ref forwarding capability
- **WHEN** ref is passed to component
- **THEN** SHALL forward ref to underlying DOM element
- **AND** SHALL allow parent components to access element
- **AND** SHALL support useRef and callback refs
- **AND** SHALL maintain type safety with RefObject

### Requirement: WCAG Compliance
The component SHALL meet Web Content Accessibility Guidelines standards.

#### Scenario: WCAG 2.1 AA compliance
- **WHEN** component is evaluated for accessibility
- **THEN** SHALL meet Success Criterion 1.3.1 (Info and Relationships)
- **AND** SHALL meet Success Criterion 4.1.2 (Name, Role, Value)
- **AND** SHALL provide proper programmatic relationships
- **AND** SHALL maintain semantic structure

#### Scenario: Screen reader compatibility
- **WHEN** tested with major screen readers
- **THEN** SHALL work with NVDA on Windows
- **AND** SHALL work with JAWS on Windows
- **AND** SHALL work with VoiceOver on macOS/iOS
- **AND** SHALL work with TalkBack on Android
- **AND** SHALL announce content in correct reading order

### Requirement: Skip Navigation Use Case
The component SHALL support skip navigation patterns for keyboard users.

#### Scenario: Skip to main content link
- **WHEN** used with isFocusable and navigation link
- **THEN** SHALL provide keyboard-only skip link
- **AND** SHALL become visible when focused
- **AND** SHALL allow bypassing repeated navigation
- **AND** SHALL jump to main content on activation
- **AND** SHALL meet WCAG 2.4.1 Bypass Blocks

#### Scenario: Skip link positioning
- **WHEN** used as skip link at page top
- **THEN** SHALL position as first focusable element
- **AND** SHALL appear before main navigation
- **AND** SHALL be first tab stop for keyboard users

### Requirement: Screen Reader Context Use Case
The component SHALL support providing additional context for screen readers.

#### Scenario: Descriptive text for icons
- **WHEN** icon button lacks visible label
- **THEN** SHALL provide text description inside VisuallyHidden
- **AND** SHALL improve screen reader comprehension
- **AND** SHALL convey icon meaning without visual text

#### Scenario: Additional field instructions
- **WHEN** form field needs extra context
- **THEN** SHALL provide hidden instructions
- **AND** SHALL associate with field via aria-describedby
- **AND** SHALL announce instructions to screen readers only

#### Scenario: Status announcements
- **WHEN** status changes need announcement
- **THEN** SHALL contain status text for screen readers
- **AND** SHALL not disrupt visual layout
- **AND** SHALL maintain focus position

### Requirement: Form Label Use Case
The component SHALL support hidden labels for form inputs.

#### Scenario: Search input with icon button
- **WHEN** search input has only icon submit button
- **THEN** SHALL provide hidden label for input
- **AND** SHALL maintain form accessibility
- **AND** SHALL meet WCAG labeling requirements
- **AND** SHALL not duplicate visible placeholder

#### Scenario: Label element rendering
- **WHEN** used as form label with as prop
- **THEN** SHALL allow rendering as label element via React Aria
- **AND** SHALL associate with input via htmlFor
- **AND** SHALL maintain proper form semantics

### Requirement: Style Props Restriction
The component SHALL prevent style overrides that break hiding behavior.

#### Scenario: No style prop forwarding
- **WHEN** consumer attempts to pass style props
- **THEN** SHALL not expose Chakra style props
- **AND** SHALL not accept className prop modifications
- **AND** SHALL prevent overriding position, clip, or visibility
- **AND** SHALL maintain consistent hiding behavior

#### Scenario: Props interface limitation
- **WHEN** component props are defined
- **THEN** SHALL omit HTMLChakraProps
- **AND** SHALL not extend style prop interfaces
- **AND** SHALL only accept functional props (children, as, isFocusable)

### Requirement: Performance Characteristics
The component SHALL minimize rendering overhead.

#### Scenario: Lightweight implementation
- **WHEN** component renders
- **THEN** SHALL render as single DOM element
- **AND** SHALL not create additional wrapper elements
- **AND** SHALL not use JavaScript for hiding logic
- **AND** SHALL use pure CSS for visual hiding

#### Scenario: No re-render triggers
- **WHEN** parent component updates
- **THEN** SHALL not cause unnecessary re-renders
- **AND** SHALL be optimized by React reconciliation
- **AND** SHALL not maintain internal state

### Requirement: Cross-Browser Compatibility
The component SHALL work consistently across modern browsers.

#### Scenario: CSS hiding technique compatibility
- **WHEN** rendered in different browsers
- **THEN** SHALL work in Chrome, Firefox, Safari, Edge
- **AND** SHALL apply consistent CSS hiding
- **AND** SHALL maintain accessibility tree in all browsers
- **AND** SHALL handle browser-specific quirks via React Aria

#### Scenario: Focus-within support
- **WHEN** isFocusable is used
- **THEN** SHALL leverage CSS :focus-within pseudo-class
- **AND** SHALL provide fallback if needed via React Aria
- **AND** SHALL work in all supported browsers

### Requirement: Single Purpose Design
The component SHALL maintain focused functionality without variants.

#### Scenario: No visual styling variants
- **WHEN** component is used
- **THEN** SHALL not provide size variants
- **AND** SHALL not provide color variants
- **AND** SHALL not provide shape variants
- **AND** SHALL maintain single hiding implementation

#### Scenario: No recipe usage
- **WHEN** component is implemented
- **THEN** SHALL not use Chakra UI recipe system
- **AND** SHALL not register in theme recipes
- **AND** SHALL rely on React Aria's inline styles
- **AND** SHALL not require theme configuration

### Requirement: Documentation and Examples
The component SHALL provide clear usage guidance.

#### Scenario: MDX documentation
- **WHEN** developers reference documentation
- **THEN** SHALL provide basic usage example
- **AND** SHALL demonstrate isFocusable with skip link
- **AND** SHALL show inline content with as="span"
- **AND** SHALL explain accessibility benefits
- **AND** SHALL document all props in PropsTable

#### Scenario: Storybook stories
- **WHEN** developers explore Storybook
- **THEN** SHALL provide Base story with hidden content
- **AND** SHALL provide SpanAsContainer story
- **AND** SHALL provide VisibleWhenFocused story with skip link
- **AND** SHALL include play functions testing behavior
- **AND** SHALL verify CSS properties and focus behavior

### Requirement: HTML Attribute Forwarding
The component SHALL forward standard HTML attributes to underlying element.

#### Scenario: Data attributes
- **WHEN** data-testid or other data attributes provided
- **THEN** SHALL forward to underlying element
- **AND** SHALL support testing utilities
- **AND** SHALL allow custom data attributes

#### Scenario: ARIA attributes
- **WHEN** ARIA attributes are provided
- **THEN** SHALL forward aria-label, aria-describedby, etc.
- **AND** SHALL allow additional accessibility customization
- **AND** SHALL not conflict with React Aria implementation

#### Scenario: Event handlers
- **WHEN** event handler props are provided
- **THEN** SHALL forward onClick, onFocus, etc.
- **AND** SHALL allow custom behavior
- **AND** SHALL maintain React synthetic event system

### Requirement: No Theme Dependency
The component SHALL function without Chakra theme configuration.

#### Scenario: Independent operation
- **WHEN** component is used
- **THEN** SHALL not require NimbusProvider
- **AND** SHALL not depend on Chakra theme context
- **AND** SHALL work in any React application
- **AND** SHALL rely on React Aria's built-in styles

#### Scenario: No recipe registration
- **WHEN** component is built
- **THEN** SHALL not register recipe in theme/recipes/index.ts
- **AND** SHALL not create recipe file
- **AND** SHALL not use slot recipe system
- **AND** SHALL be purely functional utility component
