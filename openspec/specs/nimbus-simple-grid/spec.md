# Specification: SimpleGrid Component

## Overview

The SimpleGrid component is a layout primitive in the Nimbus design system that extends Grid with a simplified API for creating equal-width column layouts. It provides convenient props for common grid patterns, making it easier to create responsive card grids, image galleries, and evenly-distributed layouts without managing complex CSS Grid template syntax. SimpleGrid is a direct re-export from Chakra UI with Nimbus type definitions and includes a SimpleGrid.Item sub-component for grid item placement.

**Component:** `SimpleGrid`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component with SimpleGrid.Item sub-component (Tier 0 - Foundation primitive)
**React Aria:** Not used (non-interactive display component)
**Chakra Integration:** Direct re-export from `@chakra-ui/react/simple-grid` with GridItem sub-component

## Purpose

SimpleGrid serves as a convenient layout primitive for creating equal-width column grids with consistent spacing. While Grid provides comprehensive CSS Grid control, SimpleGrid offers a simpler API optimized for the common case of equal-column layouts with automatic wrapping. It is ideal for card grids, image galleries, product listings, and any layout requiring evenly-distributed items. SimpleGrid extends Grid and inherits all its capabilities, but provides a more intuitive API (columns and minChildWidth props) that eliminates the need for templateColumns configuration in common scenarios.

## Requirements

### Requirement: Grid Container Element
The component SHALL render as a grid container element by default.

#### Scenario: Default grid rendering
- **WHEN** no display type is specified
- **THEN** SHALL render as div with display: grid
- **AND** SHALL accept all standard div HTML attributes
- **AND** SHALL forward all props to underlying element
- **AND** SHALL apply grid layout to direct children

#### Scenario: Grid container characteristics
- **WHEN** SimpleGrid renders
- **THEN** SHALL establish a grid formatting context
- **AND** SHALL serve as semantic container for grid items
- **AND** SHALL accept any React children
- **AND** SHALL enable grid properties on itself and children

### Requirement: Equal Column Layout via Columns Prop
The component SHALL support creating equal-width columns via columns prop.

#### Scenario: Fixed column count
- **WHEN** columns prop is set with numeric value
- **THEN** SHALL create N equal-width columns using repeat(N, minmax(0, 1fr))
- **AND** SHALL distribute available space evenly among columns
- **AND** SHALL accept positive integer values (e.g., columns={3})
- **AND** SHALL be primary API for specifying column count

#### Scenario: Responsive column count with arrays
- **WHEN** columns uses responsive array syntax
- **THEN** SHALL support responsive arrays: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL create different column counts at different breakpoints
- **AND** SHALL enable common pattern: columns={[1, 2, 3, 4]} (1 col mobile → 4 cols desktop)
- **AND** SHALL use mobile-first approach

#### Scenario: Responsive column count with objects
- **WHEN** columns uses responsive object syntax
- **THEN** SHALL support responsive objects: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL create different column counts at specific breakpoints
- **AND** SHALL enable explicit breakpoint targeting
- **AND** SHALL follow Chakra breakpoint conventions

#### Scenario: Columns with grid item spanning
- **WHEN** columns is set and children use colSpan
- **THEN** SHALL respect colSpan values on SimpleGrid.Item children
- **AND** SHALL allow items to span multiple columns
- **AND** SHALL maintain equal-width column sizing for non-spanning items

### Requirement: Automatic Responsive Columns via MinChildWidth
The component SHALL support automatic column creation based on minimum child width.

#### Scenario: Auto-fit pattern with minChildWidth
- **WHEN** minChildWidth prop is set with size value
- **THEN** SHALL use repeat(auto-fit, minmax(minChildWidth, 1fr)) pattern
- **AND** SHALL create as many columns as fit in container
- **AND** SHALL maintain minimum width for each column
- **AND** SHALL collapse empty columns automatically
- **AND** SHALL be responsive without explicit breakpoints

#### Scenario: MinChildWidth with design token values
- **WHEN** minChildWidth uses token values
- **THEN** SHALL accept spacing token values (100, 200, 300, 400, 500, 600)
- **AND** SHALL accept breakpoint token values (sm, md, lg, xl, 2xl)
- **AND** SHALL accept string values with units (e.g., "250px", "15rem")
- **AND** SHALL resolve tokens to CSS custom properties

#### Scenario: MinChildWidth responsive values
- **WHEN** minChildWidth uses responsive values
- **THEN** SHALL support responsive arrays and objects
- **AND** SHALL enable different minimum widths at different breakpoints
- **AND** SHALL create auto-fit grid at each breakpoint
- **AND** SHALL combine auto-fit with responsive minimum widths

#### Scenario: MinChildWidth priority over columns
- **WHEN** both minChildWidth and columns props are provided
- **THEN** minChildWidth SHALL take precedence
- **AND** SHALL ignore columns prop
- **AND** SHALL use auto-fit pattern based on minChildWidth
- **AND** SHALL be documented behavior

### Requirement: Gap Spacing Between Items
The component SHALL support gap spacing between grid items via gap prop.

#### Scenario: Uniform gap with design tokens
- **WHEN** gap prop is provided with token value
- **THEN** SHALL apply equal spacing between items in both directions
- **AND** SHALL accept spacing token values (100, 200, 300, 400, 500, 600)
- **AND** SHALL resolve to CSS custom properties from design tokens
- **AND** SHALL provide consistent spacing across components
- **AND** SHALL use Chakra gap property implementation

#### Scenario: Custom gap values
- **WHEN** gap prop is provided with string value
- **THEN** SHALL accept string values with units (e.g., "16px", "2rem")
- **AND** SHALL apply spacing between all grid items
- **AND** SHALL respect CSS gap property behavior

#### Scenario: Row and column gaps
- **WHEN** rowGap and columnGap props are provided
- **THEN** SHALL apply different spacing for rows and columns
- **AND** rowGap SHALL control vertical spacing between rows
- **AND** columnGap SHALL control horizontal spacing between columns
- **AND** SHALL override gap prop when both are specified

#### Scenario: Responsive gap values
- **WHEN** gap uses responsive values
- **THEN** SHALL support responsive arrays: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL support responsive objects: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL enable tighter spacing on mobile, looser on desktop
- **AND** SHALL maintain consistent spacing at each breakpoint

### Requirement: All Grid Capabilities Inherited
The component SHALL inherit all capabilities from Grid component per nimbus-grid specification.

#### Scenario: Grid template properties
- **WHEN** explicit grid template props are provided
- **THEN** SHALL accept gridTemplateColumns, gridTemplateRows, templateColumns, templateRows
- **AND** SHALL allow overriding auto-generated columns from columns/minChildWidth props
- **AND** SHALL support all Grid template syntax (repeat, minmax, fr, etc.)
- **AND** SHALL provide full Grid flexibility when needed

#### Scenario: Grid flow and auto properties
- **WHEN** grid flow props are provided
- **THEN** SHALL accept gridAutoFlow, gridAutoColumns, gridAutoRows
- **AND** SHALL control automatic item placement
- **AND** SHALL size implicit tracks
- **AND** SHALL enable dense packing when appropriate

#### Scenario: Grid alignment properties
- **WHEN** alignment props are provided
- **THEN** SHALL accept alignItems, justifyItems, alignContent, justifyContent
- **AND** SHALL align grid items along block and inline axes
- **AND** SHALL align entire grid within container
- **AND** SHALL support all CSS Grid alignment values

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

### Requirement: Grid Item Sub-Component
The component SHALL provide SimpleGrid.Item sub-component for grid item placement.

#### Scenario: SimpleGrid.Item namespace
- **WHEN** SimpleGrid component is imported
- **THEN** SHALL expose SimpleGrid.Item as property
- **AND** SimpleGrid.Item SHALL be Chakra UI's GridItem component
- **AND** SHALL enable SimpleGrid.Item usage without separate import
- **AND** SHALL maintain consistency with Grid.Item

#### Scenario: Grid item placement props
- **WHEN** SimpleGrid.Item is used
- **THEN** SHALL accept gridColumn, gridRow, gridArea props
- **AND** SHALL accept colSpan, rowSpan shorthand props
- **AND** SHALL accept colStart, colEnd, rowStart, rowEnd props
- **AND** SHALL support all Box style props
- **AND** SHALL provide same API as Grid.Item

#### Scenario: Column span in equal-column grid
- **WHEN** SimpleGrid.Item uses colSpan with columns prop
- **THEN** SHALL span specified number of columns
- **AND** SHALL accept numeric values (e.g., colSpan={2})
- **AND** SHALL work within auto-generated column template
- **AND** SHALL enable featured items spanning multiple columns

#### Scenario: Responsive column span
- **WHEN** SimpleGrid.Item uses colSpan with responsive values
- **THEN** SHALL support responsive arrays and objects for colSpan
- **AND** SHALL span different column counts at different breakpoints
- **AND** SHALL coordinate with responsive columns prop
- **AND** SHALL enable mobile-first spanning patterns

### Requirement: Common Grid Patterns Support
The component SHALL enable common grid layout patterns with minimal code.

#### Scenario: Card grid with fixed columns
- **WHEN** columns prop is used for card layout
- **THEN** SHALL create N equal-width card columns
- **AND** SHALL maintain consistent card sizing across rows
- **AND** SHALL be common pattern: columns={3} gap="400"
- **AND** SHALL work with responsive column counts

#### Scenario: Responsive image gallery
- **WHEN** minChildWidth is used for image gallery
- **THEN** SHALL create auto-fit grid maintaining minimum image size
- **AND** SHALL adapt column count based on container width
- **AND** SHALL be common pattern: minChildWidth="200px" gap="200"
- **AND** SHALL enable fluid responsive layouts without breakpoints

#### Scenario: Product listing grid
- **WHEN** used for e-commerce product grids
- **THEN** SHALL create equal-width product cards with columns prop
- **AND** SHALL support responsive column counts (e.g., columns={[2, 3, 4, 5]})
- **AND** SHALL provide consistent spacing with gap
- **AND** SHALL enable featured products with colSpan on SimpleGrid.Item

#### Scenario: Dashboard widget grid
- **WHEN** used for dashboard layouts
- **THEN** SHALL create equal-column base grid with columns prop
- **AND** SHALL allow widgets to span columns with SimpleGrid.Item colSpan
- **AND** SHALL support responsive column counts and spans
- **AND** SHALL enable complex widget sizing patterns

### Requirement: Polymorphic Rendering
The component SHALL support rendering as different HTML elements via asChild pattern.

#### Scenario: AsChild composition
- **WHEN** asChild={true} is set
- **THEN** SHALL apply SimpleGrid styles to direct child element
- **AND** SHALL preserve child element's functionality and semantics
- **AND** SHALL forward style props to child element
- **AND** SHALL support any valid React element as child

#### Scenario: Semantic grid containers
- **WHEN** used with asChild and semantic elements
- **THEN** SHALL support: section, article, aside, nav, main, ul, ol
- **AND** SHALL apply display: grid to semantic elements
- **AND** SHALL maintain semantic meaning in document structure
- **AND** SHALL enable accessible grid patterns with lists

### Requirement: Children Composition
The component SHALL accept and render any React node as children.

#### Scenario: React elements as grid items
- **WHEN** children contains React elements
- **THEN** SHALL render all child elements as grid items
- **AND** SHALL maintain element tree hierarchy
- **AND** SHALL support nested SimpleGrid components
- **AND** SHALL apply equal-column layout to all children

#### Scenario: SimpleGrid.Item children
- **WHEN** children contains SimpleGrid.Item components
- **THEN** SHALL render SimpleGrid.Item components as grid items
- **AND** SHALL respect SimpleGrid.Item placement props (colSpan, rowSpan)
- **AND** SHALL enable explicit item positioning and spanning
- **AND** SHALL mix SimpleGrid.Item with regular elements

#### Scenario: Mixed children types
- **WHEN** children contains both SimpleGrid.Item and regular elements
- **THEN** SHALL render all children as grid items
- **AND** SimpleGrid.Item SHALL have placement control via colSpan/rowSpan
- **AND** regular elements SHALL use auto-placement
- **AND** SHALL maintain visual order

#### Scenario: Multiple children with columns
- **WHEN** children contains multiple nodes with columns prop
- **THEN** SHALL distribute items across N columns
- **AND** SHALL wrap to new rows automatically
- **AND** SHALL apply equal width to each column
- **AND** SHALL maintain gap spacing

#### Scenario: Single child
- **WHEN** children contains single element
- **THEN** SHALL render as grid container with single item
- **AND** SHALL still apply grid properties and sizing
- **AND** item SHALL occupy single column in grid

#### Scenario: No children
- **WHEN** children is not provided
- **THEN** SHALL render empty grid container
- **AND** SHALL maintain element in DOM
- **AND** SHALL apply sizing and spacing styles

### Requirement: Ref Forwarding
The component SHALL forward refs to the underlying DOM element per nimbus-core standards.

#### Scenario: Ref access
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to root element
- **AND** SHALL provide access to HTMLDivElement (default)
- **AND** SHALL support React.Ref<HTMLDivElement> type
- **AND** SHALL allow DOM manipulation and measurements

#### Scenario: SimpleGrid.Item ref forwarding
- **WHEN** ref is provided to SimpleGrid.Item
- **THEN** SHALL forward ref to SimpleGrid.Item root element
- **AND** SHALL provide access to HTMLDivElement
- **AND** SHALL support item measurements and manipulation

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
- **WHEN** SimpleGrid is imported in TypeScript
- **THEN** SHALL export SimpleGridProps type
- **AND** SHALL extend HTMLChakraProps<"div">
- **AND** SHALL include columns?: ResponsiveValue<number>
- **AND** SHALL include minChildWidth?: ResponsiveValue<string | number>
- **AND** SHALL include gap?, rowGap?, columnGap?: ResponsiveValue<SpacingToken>
- **AND** SHALL include children?: React.ReactNode
- **AND** SHALL include ref?: React.Ref<HTMLDivElement>
- **AND** SHALL inherit all Grid props (gridTemplateColumns, gridTemplateRows, etc.)
- **AND** SHALL provide JSDoc documentation

#### Scenario: Columns prop type safety
- **WHEN** columns prop is used
- **THEN** SHALL accept numeric type (number of columns)
- **AND** SHALL support responsive arrays: number[]
- **AND** SHALL support responsive objects: Record<string, number>
- **AND** SHALL provide type checking for valid numeric values
- **AND** SHALL use ConditionalValue wrapper type

#### Scenario: MinChildWidth prop type safety
- **WHEN** minChildWidth prop is used
- **THEN** SHALL accept string type (size with unit)
- **AND** SHALL accept number type (interpreted as pixels)
- **AND** SHALL support responsive arrays and objects
- **AND** SHALL provide type checking for valid size values
- **AND** SHALL use ConditionalValue wrapper type

#### Scenario: SimpleGrid.Item types
- **WHEN** SimpleGrid.Item is used
- **THEN** SHALL provide GridItemProps type (same as Grid.Item)
- **AND** SHALL include gridColumn?, gridRow?, gridArea?: ResponsiveValue<string>
- **AND** SHALL include colSpan?, rowSpan?, colStart?, colEnd?, rowStart?, rowEnd?: ResponsiveValue<number | string>
- **AND** SHALL extend all Box props
- **AND** SHALL provide autocomplete for placement props

#### Scenario: Style prop types
- **WHEN** style props are used
- **THEN** SHALL provide autocomplete for all Chakra style props
- **AND** SHALL type-check prop values
- **AND** SHALL support responsive value types
- **AND** SHALL validate token references

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
- **AND** SHALL support landmark roles (region, list, grid, etc.)
- **AND** SHALL support role="list" with asChild for ul/ol

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
- **WHEN** SimpleGrid is inspected in React DevTools
- **THEN** displayName SHALL be "SimpleGrid"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging and development

#### Scenario: SimpleGrid.Item display name
- **WHEN** SimpleGrid.Item is inspected in React DevTools
- **THEN** displayName SHALL be "GridItem"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging

### Requirement: No Recipe Styling
The component SHALL not use Chakra recipe system.

#### Scenario: Direct Chakra re-export
- **WHEN** SimpleGrid component is implemented
- **THEN** SHALL re-export Chakra UI SimpleGrid directly
- **AND** SimpleGrid.Item SHALL be Chakra UI GridItem
- **AND** SHALL not define custom recipe file
- **AND** SHALL not register recipe in theme
- **AND** SHALL rely entirely on Chakra's built-in SimpleGrid implementation

#### Scenario: Style prop only styling
- **WHEN** SimpleGrid receives styling
- **THEN** SHALL apply via style props only
- **AND** SHALL not have variant or size props
- **AND** SHALL not have recipe-based theming
- **AND** display: grid SHALL be applied by default

### Requirement: Foundation Primitive Role
The component SHALL serve as foundational building block for equal-column grid layouts.

#### Scenario: Simplified grid API
- **WHEN** building grid layouts in Nimbus
- **THEN** SimpleGrid SHALL be preferred for equal-width column grids
- **AND** SHALL provide simpler API than Grid for common grid patterns
- **AND** SHALL eliminate need for templateColumns configuration in common cases
- **AND** SHALL enable rapid prototyping with columns and gap props

#### Scenario: Relationship with Grid
- **WHEN** choosing between SimpleGrid and Grid
- **THEN** SimpleGrid SHALL be used for equal-width column layouts
- **AND** Grid SHALL be used for complex layouts requiring explicit placement
- **AND** SimpleGrid SHALL extend Grid and inherit all its capabilities
- **AND** SimpleGrid SHALL provide columns and minChildWidth convenience props

#### Scenario: Component composition
- **WHEN** other Nimbus components need equal-column grids
- **THEN** SimpleGrid MAY be used as layout container
- **AND** SHALL provide equal-column grid capabilities out of box
- **AND** SHALL eliminate need for custom grid configuration

### Requirement: Performance Characteristics
The component SHALL maintain minimal performance overhead.

#### Scenario: Lightweight wrapper
- **WHEN** SimpleGrid renders
- **THEN** SHALL have minimal JavaScript overhead
- **AND** SHALL be direct Chakra UI re-export
- **AND** SHALL not add custom logic or state

#### Scenario: Style prop compilation
- **WHEN** style props are applied
- **THEN** SHALL use Chakra's optimized styling engine
- **AND** SHALL generate minimal CSS
- **AND** SHALL support tree-shaking of unused props

#### Scenario: Column template generation
- **WHEN** columns or minChildWidth props are used
- **THEN** SHALL efficiently generate CSS Grid template
- **AND** SHALL use repeat() function for optimization
- **AND** SHALL minimize CSS output

### Requirement: Theme Integration
The component SHALL integrate with Chakra theme configuration.

#### Scenario: Theme token access
- **WHEN** SimpleGrid uses style props with token values
- **THEN** SHALL resolve tokens from Nimbus theme
- **AND** SHALL use configured breakpoints for responsive values
- **AND** SHALL use configured color palettes
- **AND** SHALL use configured spacing scale (100-600)

#### Scenario: CSS variable support
- **WHEN** SimpleGrid uses design tokens
- **THEN** SHALL resolve to CSS custom properties
- **AND** SHALL support runtime theme switching
- **AND** SHALL work with light/dark mode

### Requirement: Documentation Support
The component SHALL include JSDoc comments per nimbus-core standards.

#### Scenario: Component JSDoc
- **WHEN** SimpleGrid implementation is authored
- **THEN** SHALL include JSDoc block describing purpose
- **AND** SHALL include @supportsStyleProps tag
- **AND** SHALL link to documentation with @see tag
- **AND** SHALL provide usage examples where helpful

#### Scenario: Props JSDoc
- **WHEN** SimpleGridProps interface is defined
- **THEN** SHALL document columns prop with examples
- **AND** SHALL document minChildWidth prop with auto-fit pattern explanation
- **AND** SHALL document gap props (gap, rowGap, columnGap)
- **AND** SHALL document children prop
- **AND** SHALL document ref prop
- **AND** SHALL reference Chakra HTMLChakraProps for inherited Grid props documentation
- **AND** SHALL note minChildWidth priority over columns

#### Scenario: SimpleGrid.Item JSDoc
- **WHEN** SimpleGrid.Item is documented
- **THEN** SHALL document colSpan, rowSpan props for spanning columns/rows
- **AND** SHALL document placement props (gridColumn, gridRow, gridArea)
- **AND** SHALL document responsive spanning patterns
- **AND** SHALL provide usage examples with columns prop
