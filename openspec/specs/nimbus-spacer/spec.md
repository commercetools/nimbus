# Specification: Spacer Component

## Overview

The Spacer component is a flexible space-filling primitive in the Nimbus design system that extends Box with flexGrow: 1 by default. It provides a convenient utility for creating dynamic spacing between elements in flex and grid layouts, automatically expanding to fill any remaining space. Spacer renders as a presentational element with no semantic meaning.

**Component:** `Spacer`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1 - Simple utility component)
**React Aria:** Not used (non-interactive presentational component)
**Chakra Integration:** Wraps Chakra UI Box with flexGrow: 1

## Purpose

Spacer serves as a utility component for creating flexible spacing in flex and grid layouts. It automatically fills available space between elements, enabling common layout patterns like navigation bars, toolbars, headers, and card footers without manual spacing calculations. As a presentational primitive, it prioritizes simplicity and composability while providing an intuitive API for dynamic space distribution.

## Requirements

### Requirement: Flexible Space Filling Element
The component SHALL render as a flexible space-filling element by default.

#### Scenario: Default spacer rendering
- **WHEN** no props are specified
- **THEN** SHALL render as div with flexGrow: 1
- **AND** SHALL accept all standard div HTML attributes
- **AND** SHALL forward all props to underlying Box element
- **AND** SHALL automatically fill available space in flex/grid containers

#### Scenario: Flex grow behavior
- **WHEN** Spacer renders in flex container
- **THEN** SHALL use flexGrow: 1 by default
- **AND** SHALL expand to fill all available space along main axis
- **AND** SHALL push siblings apart based on flex direction
- **AND** SHALL not affect cross-axis sizing

#### Scenario: Space filling characteristics
- **WHEN** Spacer renders
- **THEN** SHALL be presentational only (no semantic meaning)
- **AND** SHALL have no intrinsic size (0px without flex context)
- **AND** SHALL not affect document outline or structure
- **AND** SHALL be invisible by default (no background or borders)

### Requirement: Flex Layout Integration
The component SHALL integrate seamlessly with flex layout containers.

#### Scenario: Horizontal flex layouts (row)
- **WHEN** Spacer is used in horizontal flex container (Stack direction="row", Flex direction="row")
- **THEN** SHALL fill horizontal space between siblings
- **AND** SHALL push elements to opposite ends when single spacer
- **AND** SHALL distribute space evenly when multiple spacers
- **AND** SHALL respect flex container's justifyContent and alignItems

#### Scenario: Vertical flex layouts (column)
- **WHEN** Spacer is used in vertical flex container (Stack direction="column", Flex direction="column")
- **THEN** SHALL fill vertical space between siblings
- **AND** SHALL push elements to top and bottom when single spacer
- **AND** SHALL distribute space vertically when multiple spacers
- **AND** SHALL respect container height constraints

#### Scenario: Multiple spacers distribution
- **WHEN** multiple Spacers are used in same flex container
- **THEN** SHALL divide available space equally among all spacers
- **AND** each Spacer SHALL have flexGrow: 1
- **AND** SHALL create proportional spacing between element groups
- **AND** SHALL work in both row and column directions

### Requirement: Grid Layout Compatibility
The component SHALL work appropriately in grid layout containers.

#### Scenario: Grid cell filling
- **WHEN** Spacer is used in grid cell
- **THEN** SHALL fill the grid cell area
- **AND** SHALL respect grid-template-columns and grid-template-rows
- **AND** SHALL expand based on grid auto-placement rules
- **AND** SHALL work with explicit grid positioning

### Requirement: Common Layout Patterns Support
The component SHALL enable common layout patterns with minimal code.

#### Scenario: Push-to-end pattern
- **WHEN** Spacer is placed between start and end elements
- **THEN** SHALL push first element to start edge
- **AND** SHALL push last element to end edge
- **AND** SHALL fill all space between them
- **AND** SHALL be common pattern for headers and navigation bars

#### Scenario: Center-with-sides pattern
- **WHEN** Spacer is used on both sides of center element
- **THEN** SHALL center the middle element
- **AND** SHALL distribute equal space on both sides
- **AND** SHALL maintain center alignment regardless of container size
- **AND** SHALL be common pattern for symmetric layouts

#### Scenario: Multi-group spacing pattern
- **WHEN** Spacers separate multiple element groups
- **THEN** SHALL create distinct visual groups
- **AND** SHALL distribute space proportionally between groups
- **AND** SHALL enable complex toolbar and navigation layouts
- **AND** SHALL work with any number of groups and spacers

### Requirement: All Box Capabilities Inherited
The component SHALL inherit all capabilities from Box component.

#### Scenario: Style props support
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra UI style props per nimbus-core standards
- **AND** SHALL support spacing properties (margin, padding)
- **AND** SHALL support color properties (background, color, borderColor)
- **AND** SHALL support layout properties (width, height, minWidth, minHeight, maxWidth, maxHeight)
- **AND** SHALL support border properties (border, borderRadius)
- **AND** SHALL support position properties (position, top, right, bottom, left)
- **AND** SHALL support shadow properties (shadow, boxShadow)
- **AND** SHALL allow override of default flexGrow if needed

#### Scenario: Pseudo selectors
- **WHEN** pseudo selector props are provided
- **THEN** SHALL accept: _hover, _focus, _active, _disabled, _visited, _focusVisible, _before, _after
- **AND** SHALL apply styles on corresponding pseudo states
- **AND** SHALL support nested style objects

#### Scenario: Responsive style props
- **WHEN** style props use responsive values
- **THEN** SHALL support responsive arrays: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL support responsive objects: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL apply breakpoint-specific values
- **AND** SHALL enable responsive layout patterns

### Requirement: Custom Styling Support
The component SHALL support custom styling while maintaining space-filling behavior.

#### Scenario: Background styling
- **WHEN** background color or image is provided
- **THEN** SHALL render visible spacer with background
- **AND** SHALL maintain flexGrow: 1 behavior
- **AND** SHALL be useful for visualizing space distribution
- **AND** SHALL accept design token color values

#### Scenario: Border and radius styling
- **WHEN** border or borderRadius props are provided
- **THEN** SHALL apply border styles to spacer element
- **AND** SHALL maintain space-filling behavior
- **AND** SHALL accept design token values for radius (50, 100, 200, 300, 400, 500, 600, full)

#### Scenario: Size constraints
- **WHEN** width, height, minWidth, minHeight, maxWidth, or maxHeight are provided
- **THEN** SHALL apply size constraints while maintaining flexGrow: 1
- **AND** SHALL respect min/max bounds during space filling
- **AND** SHALL enable controlled spacer dimensions
- **AND** SHALL accept design token or absolute values

#### Scenario: FlexGrow override
- **WHEN** custom flexGrow value is provided
- **THEN** SHALL override default flexGrow: 1
- **AND** SHALL accept numeric values (0, 1, 2, 3, etc.)
- **AND** SHALL enable proportional space distribution with multiple spacers
- **AND** style props SHALL take precedence over default behavior

### Requirement: Children Composition
The component SHALL accept and render React nodes as children when provided.

#### Scenario: No children (typical usage)
- **WHEN** children is not provided
- **THEN** SHALL render empty self-closing spacer
- **AND** SHALL be invisible element filling space
- **AND** SHALL have aria-hidden="true" for accessibility
- **AND** SHALL be most common usage pattern

#### Scenario: With children (edge case)
- **WHEN** children is provided
- **THEN** SHALL render children inside spacer element
- **AND** SHALL maintain flexGrow: 1 behavior
- **AND** children SHALL be positioned within spacer space
- **AND** SHALL support any React node as children

### Requirement: Ref Forwarding
The component SHALL forward refs to the underlying DOM element per nimbus-core standards.

#### Scenario: Ref access
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to root div element
- **AND** SHALL provide access to HTMLDivElement
- **AND** SHALL support React.Ref<HTMLDivElement> type
- **AND** SHALL allow DOM manipulation and measurements

#### Scenario: Ref measurements
- **WHEN** ref is used to measure spacer
- **THEN** SHALL provide accurate dimensions after layout
- **AND** SHALL reflect actual space filled by spacer
- **AND** SHALL update on container resize

### Requirement: Data Attributes Support
The component SHALL accept data attributes for testing and metadata.

#### Scenario: Test identifiers
- **WHEN** data-testid is provided
- **THEN** SHALL forward to root element
- **AND** SHALL be queryable in tests
- **AND** SHALL support any data-* attribute

#### Scenario: Custom metadata
- **WHEN** custom data-* attributes are provided
- **THEN** SHALL forward all data attributes to root element
- **AND** SHALL preserve attribute values
- **AND** SHALL support string values

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive type definitions per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** Spacer is imported in TypeScript
- **THEN** SHALL export SpacerProps type
- **AND** SHALL extend BoxProps with flexGrow omitted from external control
- **AND** SHALL include children?: React.ReactNode
- **AND** SHALL include ref?: React.Ref<HTMLDivElement>
- **AND** SHALL provide JSDoc documentation
- **AND** SHALL include all Box inherited props

#### Scenario: Style prop types
- **WHEN** style props are used
- **THEN** SHALL provide autocomplete for all Chakra style props
- **AND** SHALL type-check prop values
- **AND** SHALL support responsive value types
- **AND** SHALL validate token references
- **AND** SHALL allow flexGrow override via style props

### Requirement: Accessibility and Semantics
The component SHALL be accessible and semantically appropriate.

#### Scenario: Presentational role
- **WHEN** Spacer renders without children
- **THEN** SHALL have aria-hidden="true" by default
- **AND** SHALL not be exposed to assistive technologies
- **AND** SHALL not affect screen reader navigation
- **AND** SHALL be purely visual spacing element

#### Scenario: ARIA attributes override
- **WHEN** ARIA attributes are explicitly provided
- **THEN** SHALL accept: aria-label, aria-labelledby, aria-describedby, aria-hidden
- **AND** SHALL forward to root element
- **AND** SHALL allow override of default aria-hidden when needed
- **AND** SHALL respect developer intent for accessibility

#### Scenario: No semantic HTML role
- **WHEN** Spacer is used in layouts
- **THEN** SHALL not convey semantic meaning via HTML elements
- **AND** SHALL not use landmark roles
- **AND** SHALL remain presentational div element
- **AND** spacing SHALL not convey important information

### Requirement: Event Handler Support
The component SHALL support all standard DOM event handlers.

#### Scenario: Mouse events
- **WHEN** mouse event handlers are provided
- **THEN** SHALL accept: onClick, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onMouseMove
- **AND** SHALL call handlers on corresponding events
- **AND** SHALL provide event object to handlers
- **AND** SHALL be useful for debug visualizations

#### Scenario: Keyboard events
- **WHEN** keyboard event handlers are provided
- **THEN** SHALL accept: onKeyDown, onKeyUp, onKeyPress
- **AND** SHALL call handlers on corresponding events
- **AND** SHALL not be focusable by default

#### Scenario: Focus events
- **WHEN** focus event handlers are provided
- **THEN** SHALL accept: onFocus, onBlur
- **AND** SHALL call handlers on focus changes
- **AND** SHALL support focus patterns if made focusable

### Requirement: CSS Class Support
The component SHALL accept className and class attributes.

#### Scenario: Custom classes
- **WHEN** className prop is provided
- **THEN** SHALL apply custom CSS classes to root element
- **AND** SHALL merge with Chakra-generated classes
- **AND** SHALL support multiple class names

#### Scenario: Class priority
- **WHEN** both className and style props are provided
- **THEN** style props SHALL take precedence
- **AND** className styles SHALL be base layer
- **AND** SHALL follow CSS specificity rules

### Requirement: Display Name
The component SHALL provide display name for debugging per nimbus-core standards.

#### Scenario: React DevTools identification
- **WHEN** Spacer is inspected in React DevTools
- **THEN** displayName SHALL be "Spacer"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging and development

### Requirement: No Recipe Styling
The component SHALL not use Chakra recipe system.

#### Scenario: Box wrapper with flexGrow
- **WHEN** Spacer component is implemented
- **THEN** SHALL wrap Chakra UI Box component
- **AND** SHALL apply flexGrow: 1 by default
- **AND** SHALL not define custom recipe file
- **AND** SHALL not register recipe in theme

#### Scenario: Style prop only styling
- **WHEN** Spacer receives styling
- **THEN** SHALL apply via style props only
- **AND** SHALL not have variant or size props
- **AND** SHALL not have recipe-based theming
- **AND** flexGrow: 1 SHALL be hardcoded default

### Requirement: Utility Component Role
The component SHALL serve as utility primitive for flexible spacing.

#### Scenario: Layout composition utility
- **WHEN** building layouts in Nimbus
- **THEN** Spacer SHALL be primary choice for flexible spacing
- **AND** SHALL provide simple API for space distribution
- **AND** SHALL enable rapid layout prototyping
- **AND** SHALL work with Stack, Flex, and Grid components

#### Scenario: Alternative to manual spacing
- **WHEN** choosing between Spacer and manual spacing
- **THEN** Spacer SHALL be used for dynamic space filling
- **AND** manual margin/padding SHALL be used for fixed spacing
- **AND** Stack gap SHALL be used for uniform consistent spacing
- **AND** Spacer SHALL provide most flexibility for complex layouts

#### Scenario: Common use cases
- **WHEN** implementing layouts
- **THEN** SHALL be ideal for navigation bars (logo left, menu right)
- **AND** SHALL be ideal for toolbars (groups with flexible spacing)
- **AND** SHALL be ideal for card footers (actions at opposite ends)
- **AND** SHALL be ideal for headers (title left, utilities right)
- **AND** SHALL be ideal for forms (labels left, fields right)

### Requirement: Performance Characteristics
The component SHALL maintain minimal performance overhead.

#### Scenario: Lightweight wrapper
- **WHEN** Spacer renders
- **THEN** SHALL have minimal JavaScript overhead
- **AND** SHALL be thin wrapper around Box with single prop
- **AND** SHALL not add custom logic or state
- **AND** SHALL not trigger unnecessary re-renders

#### Scenario: CSS efficiency
- **WHEN** Spacer is styled
- **THEN** SHALL use Box's optimized styling engine
- **AND** SHALL generate minimal CSS (flexGrow: 1 plus any custom props)
- **AND** SHALL support tree-shaking when unused
- **AND** SHALL leverage Chakra's CSS-in-JS optimization

### Requirement: Theme Integration
The component SHALL integrate with Chakra theme configuration.

#### Scenario: Theme token access
- **WHEN** Spacer uses style props with token values
- **THEN** SHALL resolve tokens from Nimbus theme
- **AND** SHALL use configured breakpoints
- **AND** SHALL use configured color palettes
- **AND** SHALL use configured spacing scale

#### Scenario: CSS variable support
- **WHEN** Spacer uses design tokens
- **THEN** SHALL resolve to CSS custom properties
- **AND** SHALL support runtime theme switching
- **AND** SHALL work with light/dark mode

### Requirement: Documentation Support
The component SHALL include JSDoc comments per nimbus-core standards.

#### Scenario: Component JSDoc
- **WHEN** Spacer implementation is authored
- **THEN** SHALL include JSDoc block describing purpose
- **AND** SHALL document flexGrow: 1 default behavior
- **AND** SHALL link to documentation with @see tag
- **AND** SHALL provide usage examples for common patterns

#### Scenario: Props JSDoc
- **WHEN** SpacerProps interface is defined
- **THEN** SHALL document ref prop
- **AND** SHALL document children prop (optional usage)
- **AND** SHALL reference BoxProps for style props documentation
- **AND** SHALL note flexGrow is set to 1 by default but can be overridden
