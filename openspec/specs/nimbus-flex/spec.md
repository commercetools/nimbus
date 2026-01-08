# Specification: Flex Component

## Overview

The Flex component is a flexible layout primitive in the Nimbus design system that extends Box with display: flex by default. It provides a convenient API for creating flexible layouts based on CSS Flexbox, enabling developers to build responsive, dynamically-sized layouts with minimal code. Flex is a direct re-export from Chakra UI with Nimbus type definitions.

**Component:** `Flex`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 0 - Foundation primitive)
**React Aria:** Not used (non-interactive display component)
**Chakra Integration:** Direct re-export from `@chakra-ui/react/flex`

## Purpose

Flex serves as the foundational building block for flexbox-based layouts in Nimbus. It provides a semantic container with display: flex applied by default and comprehensive flexbox property support, enabling developers to rapidly prototype and build flexible, responsive UIs without creating custom styled components. As a foundational primitive, it prioritizes flexibility and composability over opinionated styling while providing an intuitive API for common flexbox patterns.

## Requirements

### Requirement: Flexbox Container Element
The component SHALL render as a flex container element by default.

#### Scenario: Default flex rendering
- **WHEN** no display type is specified
- **THEN** SHALL render as div with display: flex
- **AND** SHALL accept all standard div HTML attributes
- **AND** SHALL forward all props to underlying element
- **AND** SHALL apply flexbox layout to direct children

#### Scenario: Flex container characteristics
- **WHEN** Flex renders
- **THEN** SHALL establish a flex formatting context
- **AND** SHALL serve as semantic container
- **AND** SHALL accept any React children
- **AND** SHALL enable flexbox properties on itself and children

### Requirement: Direction Control
The component SHALL support controlling flex direction via direction prop.

#### Scenario: Row direction (horizontal)
- **WHEN** direction="row" is set
- **THEN** SHALL lay out children horizontally left-to-right
- **AND** SHALL use horizontal axis as main axis
- **AND** SHALL use vertical axis as cross axis
- **AND** SHALL be default direction when not specified

#### Scenario: Column direction (vertical)
- **WHEN** direction="column" is set
- **THEN** SHALL lay out children vertically top-to-bottom
- **AND** SHALL use vertical axis as main axis
- **AND** SHALL use horizontal axis as cross axis

#### Scenario: Reverse directions
- **WHEN** direction="row-reverse" or "column-reverse" is set
- **THEN** SHALL reverse the direction of flex items
- **AND** SHALL maintain flex properties but reverse visual order
- **AND** SHALL support row-reverse (right-to-left) and column-reverse (bottom-to-top)

### Requirement: Wrap Behavior Control
The component SHALL support controlling how flex items wrap via wrap prop.

#### Scenario: No wrapping
- **WHEN** wrap="nowrap" is set
- **THEN** SHALL keep all items on single line
- **AND** SHALL allow items to shrink below their base size
- **AND** SHALL be default behavior when not specified

#### Scenario: Wrap items
- **WHEN** wrap="wrap" is set
- **THEN** SHALL wrap items onto multiple lines when they exceed container width
- **AND** SHALL wrap in direction of cross axis
- **AND** SHALL preserve item sizing constraints

#### Scenario: Wrap reverse
- **WHEN** wrap="wrap-reverse" is set
- **THEN** SHALL wrap items onto multiple lines in reverse order
- **AND** SHALL reverse the cross-axis direction

### Requirement: Main Axis Alignment
The component SHALL support controlling alignment along the main axis via justifyContent prop.

#### Scenario: Start alignment
- **WHEN** justifyContent="start" or "flex-start" is set
- **THEN** SHALL align items to start of main axis
- **AND** SHALL pack items from start edge
- **AND** SHALL be default when not specified

#### Scenario: Center alignment
- **WHEN** justifyContent="center" is set
- **THEN** SHALL center items along main axis
- **AND** SHALL distribute equal space before and after items

#### Scenario: End alignment
- **WHEN** justifyContent="end" or "flex-end" is set
- **THEN** SHALL align items to end of main axis
- **AND** SHALL pack items toward end edge

#### Scenario: Space distribution
- **WHEN** justifyContent="space-between", "space-around", or "space-evenly" is set
- **THEN** SHALL distribute items with space between them
- **AND** space-between SHALL place first item at start, last at end, equal space between
- **AND** space-around SHALL place equal space around each item
- **AND** space-evenly SHALL place equal space between and around items

### Requirement: Cross Axis Alignment
The component SHALL support controlling alignment along the cross axis via alignItems prop.

#### Scenario: Stretch alignment
- **WHEN** alignItems="stretch" is set
- **THEN** SHALL stretch items to fill container along cross axis
- **AND** SHALL respect min/max height or width constraints
- **AND** SHALL be default when not specified

#### Scenario: Start alignment
- **WHEN** alignItems="start" or "flex-start" is set
- **THEN** SHALL align items to start of cross axis
- **AND** SHALL maintain item's intrinsic cross-axis size

#### Scenario: Center alignment
- **WHEN** alignItems="center" is set
- **THEN** SHALL center items along cross axis
- **AND** SHALL maintain item's intrinsic cross-axis size

#### Scenario: End alignment
- **WHEN** alignItems="end" or "flex-end" is set
- **THEN** SHALL align items to end of cross axis
- **AND** SHALL maintain item's intrinsic cross-axis size

#### Scenario: Baseline alignment
- **WHEN** alignItems="baseline" is set
- **THEN** SHALL align items along their text baseline
- **AND** SHALL be useful for aligning text across flex items

### Requirement: Multi-Line Alignment
The component SHALL support controlling alignment of multiple flex lines via alignContent prop.

#### Scenario: Content stretch
- **WHEN** alignContent="stretch" is set and items wrap
- **THEN** SHALL stretch lines to fill container
- **AND** SHALL distribute space equally among lines
- **AND** SHALL be default when not specified

#### Scenario: Content alignment options
- **WHEN** alignContent is set to "start", "center", "end", "space-between", "space-around", or "space-evenly"
- **THEN** SHALL align flex lines accordingly
- **AND** SHALL only affect containers with multiple lines (wrapped items)
- **AND** SHALL follow same patterns as justifyContent for line distribution

### Requirement: Gap Support
The component SHALL support gap spacing between flex items via gap prop.

#### Scenario: Uniform gap
- **WHEN** gap prop is provided with single value
- **THEN** SHALL apply equal spacing between items in both directions
- **AND** SHALL accept design token values (100, 200, 300, 400, 500, 600)
- **AND** SHALL accept string values with units (e.g., "16px", "2rem")

#### Scenario: Row and column gaps
- **WHEN** rowGap and columnGap props are provided
- **THEN** SHALL apply different spacing for rows and columns
- **AND** rowGap SHALL control vertical spacing between wrapped lines
- **AND** columnGap SHALL control horizontal spacing between items

#### Scenario: Gap with design tokens
- **WHEN** gap uses design token values
- **THEN** SHALL use spacing tokens (100-600)
- **AND** SHALL resolve to CSS custom properties
- **AND** SHALL provide consistent spacing across components

### Requirement: Flex Item Properties
The component SHALL support flex item properties that can be applied to children.

#### Scenario: Flex property
- **WHEN** children have flex prop
- **THEN** SHALL control how item grows and shrinks
- **AND** SHALL accept shorthand values (e.g., "1", "2", "auto", "none")
- **AND** SHALL accept CSS flex syntax (e.g., "1 1 auto")

#### Scenario: Flex grow
- **WHEN** children have flexGrow prop
- **THEN** SHALL control item's ability to grow
- **AND** SHALL accept numeric values (0, 1, 2, etc.)
- **AND** SHALL distribute available space proportionally

#### Scenario: Flex shrink
- **WHEN** children have flexShrink prop
- **THEN** SHALL control item's ability to shrink
- **AND** SHALL accept numeric values (0, 1, 2, etc.)
- **AND** SHALL prevent shrinking when set to 0

#### Scenario: Flex basis
- **WHEN** children have flexBasis prop
- **THEN** SHALL set initial size of item before space distribution
- **AND** SHALL accept size values (px, %, rem, etc.)
- **AND** SHALL accept "auto" to use item's content size

### Requirement: Individual Item Alignment
The component SHALL support aligning individual flex items via alignSelf prop on children.

#### Scenario: Self alignment override
- **WHEN** child has alignSelf prop
- **THEN** SHALL override parent's alignItems for that specific item
- **AND** SHALL accept same values as alignItems (start, center, end, stretch, baseline)
- **AND** SHALL only affect the individual item, not siblings

### Requirement: Item Ordering
The component SHALL support visual reordering of flex items via order prop on children.

#### Scenario: Order property
- **WHEN** children have order prop
- **THEN** SHALL reorder items visually based on order value
- **AND** SHALL accept integer values (negative, zero, positive)
- **AND** SHALL sort items by ascending order value
- **AND** SHALL maintain DOM order for accessibility

#### Scenario: Default order
- **WHEN** order is not specified
- **THEN** SHALL default to 0
- **AND** SHALL maintain DOM order for items with same order value

### Requirement: Polymorphic Rendering
The component SHALL support rendering as different HTML elements via asChild pattern.

#### Scenario: AsChild composition
- **WHEN** asChild={true} is set
- **THEN** SHALL apply Flex styles to direct child element
- **AND** SHALL preserve child element's functionality and semantics
- **AND** SHALL forward style props to child element
- **AND** SHALL support any valid React element as child

#### Scenario: Semantic flex containers
- **WHEN** used with asChild and semantic elements
- **THEN** SHALL support: section, article, aside, nav, main, header, footer
- **AND** SHALL apply display: flex to semantic elements
- **AND** SHALL maintain semantic meaning in document structure

### Requirement: Responsive Direction and Alignment
The component SHALL support responsive values for direction and alignment props.

#### Scenario: Responsive array syntax
- **WHEN** responsive array values are provided for direction, alignItems, or justifyContent
- **THEN** SHALL apply values at breakpoints: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL use mobile-first approach (base applies to all, larger overrides)
- **AND** SHALL support partial arrays (e.g., ["column", , "row"] skips sm)

#### Scenario: Responsive object syntax
- **WHEN** responsive object values are provided
- **THEN** SHALL accept: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL apply values at corresponding breakpoints
- **AND** SHALL allow partial objects with specific breakpoints

#### Scenario: Common responsive patterns
- **WHEN** building responsive layouts
- **THEN** SHALL support column-to-row transitions (e.g., direction={["column", "row"]})
- **AND** SHALL support responsive alignment changes
- **AND** SHALL support responsive gap values

### Requirement: All Box Capabilities Inherited
The component SHALL inherit all capabilities from Box component.

#### Scenario: Style props support
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra UI style props per nimbus-core standards
- **AND** SHALL support spacing properties (margin, padding)
- **AND** SHALL support color properties (background, color, borderColor)
- **AND** SHALL support layout properties (width, height, overflow)
- **AND** SHALL support border properties (border, borderRadius)
- **AND** SHALL support typography properties (fontSize, fontWeight)
- **AND** SHALL support position properties (position, top, right, bottom, left)
- **AND** SHALL support shadow properties (shadow, boxShadow)

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

### Requirement: Common Layout Patterns Support
The component SHALL enable common flexbox layout patterns with minimal code.

#### Scenario: Centered content
- **WHEN** alignItems="center" and justifyContent="center" are set
- **THEN** SHALL center content both horizontally and vertically
- **AND** SHALL be common pattern for centering

#### Scenario: Space-between layout
- **WHEN** justifyContent="space-between" is set
- **THEN** SHALL push first item to start, last item to end
- **AND** SHALL distribute space evenly between items
- **AND** SHALL be common pattern for headers and toolbars

#### Scenario: Equal-width items
- **WHEN** children have flex="1"
- **THEN** SHALL grow all items equally to fill container
- **AND** SHALL distribute available space proportionally

#### Scenario: Fixed and flexible items
- **WHEN** mixing items with and without flex property
- **THEN** SHALL keep items without flex at intrinsic size
- **AND** SHALL grow/shrink items with flex property
- **AND** SHALL enable flexible layouts with fixed sidebars

### Requirement: Ref Forwarding
The component SHALL forward refs to the underlying DOM element per nimbus-core standards.

#### Scenario: Ref access
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to root element
- **AND** SHALL provide access to HTMLDivElement (default)
- **AND** SHALL support React.Ref<HTMLDivElement> type
- **AND** SHALL allow DOM manipulation and measurements

#### Scenario: Ref with asChild
- **WHEN** ref is provided with asChild={true}
- **THEN** SHALL forward ref to child element
- **AND** ref type SHALL match child element type
- **AND** SHALL maintain ref functionality

### Requirement: Children Composition
The component SHALL accept and render any React node as children.

#### Scenario: React elements
- **WHEN** children contains React elements
- **THEN** SHALL render all child elements as flex items
- **AND** SHALL maintain element tree hierarchy
- **AND** SHALL support nested Flex and Box components

#### Scenario: Multiple children
- **WHEN** children contains multiple nodes
- **THEN** SHALL render all children as flex items
- **AND** SHALL apply flex layout to arrange items
- **AND** SHALL respect flex properties on children

#### Scenario: Single child
- **WHEN** children contains single element
- **THEN** SHALL render as flex container with single item
- **AND** SHALL still apply flex properties (alignment, justification)

#### Scenario: No children
- **WHEN** children is not provided
- **THEN** SHALL render empty flex container
- **AND** SHALL maintain element in DOM
- **AND** SHALL apply sizing and spacing styles

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
- **WHEN** Flex is imported in TypeScript
- **THEN** SHALL export FlexProps type
- **AND** SHALL extend HTMLChakraProps<"div">
- **AND** SHALL include direction?: ResponsiveValue<FlexDirection>
- **AND** SHALL include wrap?: ResponsiveValue<FlexWrap>
- **AND** SHALL include alignItems?: ResponsiveValue<AlignItems>
- **AND** SHALL include justifyContent?: ResponsiveValue<JustifyContent>
- **AND** SHALL include alignContent?: ResponsiveValue<AlignContent>
- **AND** SHALL include gap?, rowGap?, columnGap?: ResponsiveValue<SpacingToken>
- **AND** SHALL include children?: React.ReactNode
- **AND** SHALL include ref?: React.Ref<HTMLDivElement>
- **AND** SHALL provide JSDoc documentation

#### Scenario: Flexbox prop types
- **WHEN** flexbox props are used
- **THEN** SHALL provide autocomplete for direction values (row, column, row-reverse, column-reverse)
- **AND** SHALL provide autocomplete for wrap values (wrap, nowrap, wrap-reverse)
- **AND** SHALL provide autocomplete for alignment values
- **AND** SHALL type-check prop values
- **AND** SHALL support responsive value types

#### Scenario: Style prop types
- **WHEN** style props are used
- **THEN** SHALL provide autocomplete for all Chakra style props
- **AND** SHALL type-check prop values
- **AND** SHALL support responsive value types
- **AND** SHALL validate token references

#### Scenario: AsChild typing
- **WHEN** asChild is used
- **THEN** SHALL accept boolean type
- **AND** SHALL support polymorphic child elements
- **AND** SHALL maintain type safety with child props

### Requirement: ARIA Attributes Support
The component SHALL accept ARIA attributes for accessibility.

#### Scenario: ARIA labels
- **WHEN** ARIA label attributes are provided
- **THEN** SHALL accept: aria-label, aria-labelledby, aria-describedby
- **AND** SHALL forward to root element
- **AND** SHALL be announced by screen readers

#### Scenario: ARIA roles
- **WHEN** role attribute is provided
- **THEN** SHALL accept any valid ARIA role
- **AND** SHALL override default div semantics
- **AND** SHALL support landmark roles (region, navigation, main, etc.)

#### Scenario: ARIA states
- **WHEN** ARIA state attributes are provided
- **THEN** SHALL accept: aria-hidden, aria-expanded, aria-checked, aria-selected, etc.
- **AND** SHALL forward to root element
- **AND** SHALL support accessibility requirements

### Requirement: Event Handler Support
The component SHALL support all standard DOM event handlers.

#### Scenario: Mouse events
- **WHEN** mouse event handlers are provided
- **THEN** SHALL accept: onClick, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onMouseMove
- **AND** SHALL call handlers on corresponding events
- **AND** SHALL provide event object to handlers

#### Scenario: Keyboard events
- **WHEN** keyboard event handlers are provided
- **THEN** SHALL accept: onKeyDown, onKeyUp, onKeyPress
- **AND** SHALL call handlers on corresponding events
- **AND** SHALL support keyboard interactions

#### Scenario: Focus events
- **WHEN** focus event handlers are provided
- **THEN** SHALL accept: onFocus, onBlur
- **AND** SHALL call handlers on focus changes
- **AND** SHALL support focus management patterns

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
- **WHEN** Flex is inspected in React DevTools
- **THEN** displayName SHALL be "Flex"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging and development

### Requirement: No Recipe Styling
The component SHALL not use Chakra recipe system.

#### Scenario: Direct Chakra re-export
- **WHEN** Flex component is implemented
- **THEN** SHALL re-export Chakra UI Flex directly
- **AND** SHALL not define custom recipe file
- **AND** SHALL not register recipe in theme
- **AND** SHALL rely entirely on Chakra's built-in Flex implementation

#### Scenario: Style prop only styling
- **WHEN** Flex receives styling
- **THEN** SHALL apply via style props only
- **AND** SHALL not have variant or size props
- **AND** SHALL not have recipe-based theming
- **AND** display: flex SHALL be applied by default

### Requirement: Foundation Primitive Role
The component SHALL serve as foundational building block for flexbox layouts.

#### Scenario: Layout composition base
- **WHEN** building layouts in Nimbus
- **THEN** Flex SHALL be primary choice for flexible layouts
- **AND** SHALL provide consistent flexbox foundation
- **AND** SHALL enable rapid prototyping

#### Scenario: Component building
- **WHEN** other Nimbus components need flex layouts
- **THEN** Flex MAY be used as layout container
- **AND** SHALL provide flexbox capabilities out of box
- **AND** SHALL eliminate need for custom flex components

#### Scenario: Relationship with Stack
- **WHEN** choosing between Flex and Stack
- **THEN** Flex SHALL be used for complex alignment and flexible sizing
- **AND** Stack SHALL be used for simple vertical/horizontal stacking with consistent spacing
- **AND** Flex SHALL provide more fine-grained control than Stack

### Requirement: Performance Characteristics
The component SHALL maintain minimal performance overhead.

#### Scenario: Lightweight wrapper
- **WHEN** Flex renders
- **THEN** SHALL have minimal JavaScript overhead
- **AND** SHALL be direct Chakra UI re-export
- **AND** SHALL not add custom logic or state

#### Scenario: Style prop compilation
- **WHEN** style props are applied
- **THEN** SHALL use Chakra's optimized styling engine
- **AND** SHALL generate minimal CSS
- **AND** SHALL support tree-shaking of unused props

### Requirement: Theme Integration
The component SHALL integrate with Chakra theme configuration.

#### Scenario: Theme token access
- **WHEN** Flex uses style props with token values
- **THEN** SHALL resolve tokens from Nimbus theme
- **AND** SHALL use configured breakpoints
- **AND** SHALL use configured color palettes
- **AND** SHALL use configured spacing scale

#### Scenario: CSS variable support
- **WHEN** Flex uses design tokens
- **THEN** SHALL resolve to CSS custom properties
- **AND** SHALL support runtime theme switching
- **AND** SHALL work with light/dark mode

### Requirement: Documentation Support
The component SHALL include JSDoc comments per nimbus-core standards.

#### Scenario: Component JSDoc
- **WHEN** Flex implementation is authored
- **THEN** SHALL include JSDoc block describing purpose
- **AND** SHALL include @supportsStyleProps tag
- **AND** SHALL link to documentation with @see tag
- **AND** SHALL provide usage examples where helpful

#### Scenario: Props JSDoc
- **WHEN** FlexProps interface is defined
- **THEN** SHALL document direction prop
- **AND** SHALL document wrap prop
- **AND** SHALL document alignment props (alignItems, justifyContent, alignContent)
- **AND** SHALL document gap props (gap, rowGap, columnGap)
- **AND** SHALL document children prop
- **AND** SHALL document ref prop
- **AND** SHALL reference Chakra HTMLChakraProps for style props documentation
