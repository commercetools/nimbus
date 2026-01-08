# Specification: Grid Component

## Overview

The Grid component is a layout primitive in the Nimbus design system that extends Box with display: grid by default. It provides a convenient API for creating two-dimensional grid layouts based on CSS Grid, enabling developers to build complex responsive layouts with rows, columns, and areas. Grid is a direct re-export from Chakra UI with Nimbus type definitions and includes a Grid.Item sub-component for grid item placement.

**Component:** `Grid`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component with Grid.Item sub-component (Tier 0 - Foundation primitive)
**React Aria:** Not used (non-interactive display component)
**Chakra Integration:** Direct re-export from `@chakra-ui/react/grid`

## Purpose

Grid serves as the foundational building block for two-dimensional layouts in Nimbus. It provides a semantic container with display: grid applied by default and comprehensive CSS Grid property support, enabling developers to rapidly prototype and build complex, responsive layouts without creating custom styled components. As a foundational primitive, it prioritizes flexibility and composability over opinionated styling while providing an intuitive API for common grid patterns including template columns/rows, areas, and responsive layouts.

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
- **WHEN** Grid renders
- **THEN** SHALL establish a grid formatting context
- **AND** SHALL serve as semantic container
- **AND** SHALL accept any React children
- **AND** SHALL enable grid properties on itself and children

### Requirement: Template Columns
The component SHALL support defining grid columns via gridTemplateColumns or templateColumns props.

#### Scenario: Fixed column widths
- **WHEN** templateColumns is set with fixed values
- **THEN** SHALL create columns with specified widths
- **AND** SHALL accept pixel values (e.g., "200px 400px")
- **AND** SHALL accept fractional units (e.g., "1fr 2fr")
- **AND** SHALL accept mixed units (e.g., "200px 1fr 2fr")

#### Scenario: Repeat pattern
- **WHEN** templateColumns uses repeat() function
- **THEN** SHALL accept repeat syntax (e.g., "repeat(3, 1fr)")
- **AND** SHALL support auto-fit (e.g., "repeat(auto-fit, minmax(200px, 1fr))")
- **AND** SHALL support auto-fill (e.g., "repeat(auto-fill, 150px)")
- **AND** SHALL enable responsive grid patterns

#### Scenario: Responsive columns
- **WHEN** templateColumns uses responsive values
- **THEN** SHALL support responsive arrays: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL support responsive objects: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL enable different column layouts at different breakpoints

### Requirement: Template Rows
The component SHALL support defining grid rows via gridTemplateRows or templateRows props.

#### Scenario: Fixed row heights
- **WHEN** templateRows is set with fixed values
- **THEN** SHALL create rows with specified heights
- **AND** SHALL accept pixel values (e.g., "100px 200px")
- **AND** SHALL accept fractional units (e.g., "1fr 2fr")
- **AND** SHALL accept auto keyword for content-based sizing

#### Scenario: Repeat pattern for rows
- **WHEN** templateRows uses repeat() function
- **THEN** SHALL accept repeat syntax (e.g., "repeat(3, 100px)")
- **AND** SHALL support minmax for flexible row heights (e.g., "repeat(2, minmax(100px, auto))")
- **AND** SHALL create consistent row patterns

#### Scenario: Responsive rows
- **WHEN** templateRows uses responsive values
- **THEN** SHALL support responsive arrays and objects
- **AND** SHALL enable different row layouts at different breakpoints

### Requirement: Gap Support
The component SHALL support gap spacing between grid items via gap prop.

#### Scenario: Uniform gap
- **WHEN** gap prop is provided with single value
- **THEN** SHALL apply equal spacing between items in both directions
- **AND** SHALL accept design token values (100, 200, 300, 400, 500, 600)
- **AND** SHALL accept string values with units (e.g., "16px", "2rem")
- **AND** SHALL use design tokens by default

#### Scenario: Row and column gaps
- **WHEN** rowGap and columnGap props are provided
- **THEN** SHALL apply different spacing for rows and columns
- **AND** rowGap SHALL control vertical spacing between rows
- **AND** columnGap SHALL control horizontal spacing between columns
- **AND** SHALL override gap prop when both are specified

#### Scenario: Gap with design tokens
- **WHEN** gap uses design token values
- **THEN** SHALL use spacing tokens (100-600)
- **AND** SHALL resolve to CSS custom properties
- **AND** SHALL provide consistent spacing across components

#### Scenario: Responsive gap
- **WHEN** gap uses responsive values
- **THEN** SHALL support responsive arrays and objects
- **AND** SHALL enable different spacing at different breakpoints

### Requirement: Grid Auto Flow
The component SHALL support controlling grid item placement via gridAutoFlow prop.

#### Scenario: Row flow (default)
- **WHEN** gridAutoFlow is "row" or not specified
- **THEN** SHALL place items row by row
- **AND** SHALL fill each row before moving to next row
- **AND** SHALL be default behavior

#### Scenario: Column flow
- **WHEN** gridAutoFlow is "column"
- **THEN** SHALL place items column by column
- **AND** SHALL fill each column before moving to next column

#### Scenario: Dense packing
- **WHEN** gridAutoFlow is "dense", "row dense", or "column dense"
- **THEN** SHALL use dense packing algorithm
- **AND** SHALL fill gaps with later items when possible
- **AND** SHALL optimize grid space utilization

### Requirement: Grid Alignment
The component SHALL support grid alignment via alignItems, justifyItems, alignContent, and justifyContent props.

#### Scenario: Align items vertically
- **WHEN** alignItems prop is provided
- **THEN** SHALL accept: start, center, end, stretch, baseline
- **AND** SHALL align all grid items along block (column) axis
- **AND** SHALL default to stretch when not specified
- **AND** SHALL apply to all items in grid

#### Scenario: Justify items horizontally
- **WHEN** justifyItems prop is provided
- **THEN** SHALL accept: start, center, end, stretch
- **AND** SHALL align all grid items along inline (row) axis
- **AND** SHALL default to stretch when not specified

#### Scenario: Align grid tracks
- **WHEN** alignContent prop is provided
- **THEN** SHALL accept: start, center, end, stretch, space-between, space-around, space-evenly
- **AND** SHALL align entire grid along block axis within container
- **AND** SHALL only affect grids smaller than container

#### Scenario: Justify grid tracks
- **WHEN** justifyContent prop is provided
- **THEN** SHALL accept: start, center, end, stretch, space-between, space-around, space-evenly
- **AND** SHALL align entire grid along inline axis within container
- **AND** SHALL distribute space between columns when grid is smaller than container

### Requirement: Grid Template Areas
The component SHALL support named grid areas via gridTemplateAreas or templateAreas props.

#### Scenario: Named area definition
- **WHEN** templateAreas is provided with area names
- **THEN** SHALL accept multi-line string with area names
- **AND** SHALL create named regions in grid
- **AND** SHALL enable semantic layout patterns (e.g., "header", "nav", "main", "footer")
- **AND** SHALL require matching row/column counts across lines

#### Scenario: Area assignment to items
- **WHEN** templateAreas defines named areas
- **THEN** Grid.Item SHALL accept gridArea prop with area name
- **AND** SHALL place item in specified named area
- **AND** SHALL span multiple rows/columns as defined by area
- **AND** SHALL override explicit row/column placement

#### Scenario: Common layout patterns
- **WHEN** templateAreas is used for page layouts
- **THEN** SHALL enable header/nav/main/footer patterns
- **AND** SHALL support sidebar layouts
- **AND** SHALL enable complex multi-region layouts

### Requirement: Auto Columns and Rows
The component SHALL support implicit grid track sizing via gridAutoColumns and gridAutoRows props.

#### Scenario: Auto columns sizing
- **WHEN** gridAutoColumns is provided
- **THEN** SHALL set size of implicit column tracks
- **AND** SHALL accept size values (px, fr, %, minmax())
- **AND** SHALL apply to columns created automatically

#### Scenario: Auto rows sizing
- **WHEN** gridAutoRows is provided
- **THEN** SHALL set size of implicit row tracks
- **AND** SHALL accept size values (px, fr, %, auto, minmax())
- **AND** SHALL apply to rows created automatically

#### Scenario: Implicit grid creation
- **WHEN** more items exist than defined tracks
- **THEN** SHALL create implicit tracks automatically
- **AND** SHALL use gridAutoRows or gridAutoColumns for sizing
- **AND** SHALL follow gridAutoFlow for placement

### Requirement: Grid Item Sub-Component
The component SHALL provide Grid.Item sub-component for grid item placement.

#### Scenario: Grid.Item namespace
- **WHEN** Grid component is imported
- **THEN** SHALL expose Grid.Item as property
- **AND** Grid.Item SHALL be Chakra UI's GridItem component
- **AND** SHALL enable Grid.Item usage without separate import

#### Scenario: Grid item placement props
- **WHEN** Grid.Item is used
- **THEN** SHALL accept gridColumn, gridRow, gridArea props
- **AND** SHALL accept colSpan, rowSpan shorthand props
- **AND** SHALL accept colStart, colEnd, rowStart, rowEnd props
- **AND** SHALL support all Box style props

#### Scenario: Span shorthand
- **WHEN** Grid.Item uses colSpan or rowSpan
- **THEN** SHALL span specified number of columns or rows
- **AND** SHALL accept numeric values (e.g., colSpan={2})
- **AND** SHALL simplify multi-track spanning

#### Scenario: Explicit placement
- **WHEN** Grid.Item uses gridColumn or gridRow
- **THEN** SHALL accept line-based values (e.g., "1 / 3")
- **AND** SHALL accept span syntax (e.g., "span 2")
- **AND** SHALL enable precise item positioning

### Requirement: All Box Capabilities Inherited
The component SHALL inherit all capabilities from Box component per nimbus-box specification.

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

### Requirement: Common Grid Patterns Support
The component SHALL enable common grid layout patterns with minimal code.

#### Scenario: Equal column grid
- **WHEN** templateColumns="repeat(N, 1fr)" is used
- **THEN** SHALL create N equal-width columns
- **AND** SHALL distribute available space evenly
- **AND** SHALL be common pattern for card grids

#### Scenario: Responsive auto-fit grid
- **WHEN** templateColumns="repeat(auto-fit, minmax(Xpx, 1fr))" is used
- **THEN** SHALL create as many columns as fit in container
- **AND** SHALL collapse empty columns
- **AND** SHALL maintain minimum item width
- **AND** SHALL be common pattern for responsive card layouts

#### Scenario: Holy grail layout
- **WHEN** templateAreas defines header/nav/main/aside/footer
- **THEN** SHALL enable classic page layout pattern
- **AND** SHALL support fixed header/footer with scrollable main
- **AND** SHALL enable responsive sidebar collapse

#### Scenario: Dashboard layout
- **WHEN** using templateColumns and templateRows with spanning items
- **THEN** SHALL create multi-size widget layouts
- **AND** SHALL support items spanning multiple tracks
- **AND** SHALL enable complex dashboard patterns

### Requirement: Ref Forwarding
The component SHALL forward refs to the underlying DOM element per nimbus-core standards.

#### Scenario: Ref access
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to root element
- **AND** SHALL provide access to HTMLDivElement (default)
- **AND** SHALL support React.Ref<HTMLDivElement> type
- **AND** SHALL allow DOM manipulation and measurements

#### Scenario: Grid.Item ref forwarding
- **WHEN** ref is provided to Grid.Item
- **THEN** SHALL forward ref to Grid.Item root element
- **AND** SHALL provide access to HTMLDivElement
- **AND** SHALL support item measurements and manipulation

### Requirement: Children Composition
The component SHALL accept and render any React node as children.

#### Scenario: React elements
- **WHEN** children contains React elements
- **THEN** SHALL render all child elements as grid items
- **AND** SHALL maintain element tree hierarchy
- **AND** SHALL support nested Grid components

#### Scenario: Grid.Item children
- **WHEN** children contains Grid.Item components
- **THEN** SHALL render Grid.Item components as grid items
- **AND** SHALL respect Grid.Item placement props
- **AND** SHALL enable explicit item positioning

#### Scenario: Mixed children
- **WHEN** children contains both Grid.Item and regular elements
- **THEN** SHALL render all children as grid items
- **AND** Grid.Item SHALL have placement control
- **AND** regular elements SHALL use auto-placement

#### Scenario: Multiple children
- **WHEN** children contains multiple nodes
- **THEN** SHALL render all children as grid items
- **AND** SHALL apply grid layout to arrange items
- **AND** SHALL follow gridAutoFlow for placement

#### Scenario: Single child
- **WHEN** children contains single element
- **THEN** SHALL render as grid container with single item
- **AND** SHALL still apply grid properties

#### Scenario: No children
- **WHEN** children is not provided
- **THEN** SHALL render empty grid container
- **AND** SHALL maintain element in DOM
- **AND** SHALL apply sizing and spacing styles

### Requirement: Polymorphic Rendering
The component SHALL support rendering as different HTML elements via asChild pattern.

#### Scenario: AsChild composition
- **WHEN** asChild={true} is set
- **THEN** SHALL apply Grid styles to direct child element
- **AND** SHALL preserve child element's functionality and semantics
- **AND** SHALL forward style props to child element
- **AND** SHALL support any valid React element as child

#### Scenario: Semantic grid containers
- **WHEN** used with asChild and semantic elements
- **THEN** SHALL support: section, article, aside, nav, main, header, footer
- **AND** SHALL apply display: grid to semantic elements
- **AND** SHALL maintain semantic meaning in document structure

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
- **WHEN** Grid is imported in TypeScript
- **THEN** SHALL export GridProps type
- **AND** SHALL extend HTMLChakraProps<"div">
- **AND** SHALL include gridTemplateColumns?, gridTemplateRows?: ResponsiveValue<string>
- **AND** SHALL include templateColumns?, templateRows?: ResponsiveValue<string> (aliases)
- **AND** SHALL include gridTemplateAreas?, templateAreas?: ResponsiveValue<string>
- **AND** SHALL include gridAutoFlow?: ResponsiveValue<GridAutoFlow>
- **AND** SHALL include gridAutoColumns?, gridAutoRows?: ResponsiveValue<string>
- **AND** SHALL include gap?, rowGap?, columnGap?: ResponsiveValue<SpacingToken>
- **AND** SHALL include alignItems?, justifyItems?, alignContent?, justifyContent?: ResponsiveValue<string>
- **AND** SHALL include children?: React.ReactNode
- **AND** SHALL include ref?: React.Ref<HTMLDivElement>
- **AND** SHALL provide JSDoc documentation

#### Scenario: Grid property types
- **WHEN** grid props are used
- **THEN** SHALL provide type checking for grid values
- **AND** SHALL accept string values for template definitions
- **AND** SHALL support responsive value types
- **AND** SHALL validate alignment values

#### Scenario: Grid.Item types
- **WHEN** Grid.Item is used
- **THEN** SHALL provide GridItemProps type
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
- **WHEN** Grid is inspected in React DevTools
- **THEN** displayName SHALL be "Grid"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging and development

#### Scenario: Grid.Item display name
- **WHEN** Grid.Item is inspected in React DevTools
- **THEN** displayName SHALL be "GridItem"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging

### Requirement: No Recipe Styling
The component SHALL not use Chakra recipe system.

#### Scenario: Direct Chakra re-export
- **WHEN** Grid component is implemented
- **THEN** SHALL re-export Chakra UI Grid directly
- **AND** Grid.Item SHALL be Chakra UI GridItem
- **AND** SHALL not define custom recipe file
- **AND** SHALL not register recipe in theme
- **AND** SHALL rely entirely on Chakra's built-in Grid implementation

#### Scenario: Style prop only styling
- **WHEN** Grid receives styling
- **THEN** SHALL apply via style props only
- **AND** SHALL not have variant or size props
- **AND** SHALL not have recipe-based theming
- **AND** display: grid SHALL be applied by default

### Requirement: Foundation Primitive Role
The component SHALL serve as foundational building block for two-dimensional layouts.

#### Scenario: Layout composition base
- **WHEN** building layouts in Nimbus
- **THEN** Grid SHALL be primary choice for two-dimensional layouts
- **AND** SHALL provide consistent grid foundation
- **AND** SHALL enable rapid prototyping of complex layouts

#### Scenario: Component building
- **WHEN** other Nimbus components need grid layouts
- **THEN** Grid MAY be used as layout container
- **AND** SHALL provide grid capabilities out of box
- **AND** SHALL eliminate need for custom grid components

#### Scenario: Relationship with Flex
- **WHEN** choosing between Grid and Flex
- **THEN** Grid SHALL be used for two-dimensional layouts with rows and columns
- **AND** Flex SHALL be used for one-dimensional layouts (row or column)
- **AND** Grid SHALL provide more powerful layout control than Flex
- **AND** Grid SHALL support named areas and explicit placement

#### Scenario: Relationship with SimpleGrid
- **WHEN** choosing between Grid and SimpleGrid
- **THEN** Grid SHALL be used for complex layouts requiring explicit placement
- **AND** SimpleGrid SHALL be used for simple equal-column grids
- **AND** Grid SHALL provide full CSS Grid capabilities
- **AND** SimpleGrid SHALL provide simpler API for common cases

### Requirement: Performance Characteristics
The component SHALL maintain minimal performance overhead.

#### Scenario: Lightweight wrapper
- **WHEN** Grid renders
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
- **WHEN** Grid uses style props with token values
- **THEN** SHALL resolve tokens from Nimbus theme
- **AND** SHALL use configured breakpoints
- **AND** SHALL use configured color palettes
- **AND** SHALL use configured spacing scale

#### Scenario: CSS variable support
- **WHEN** Grid uses design tokens
- **THEN** SHALL resolve to CSS custom properties
- **AND** SHALL support runtime theme switching
- **AND** SHALL work with light/dark mode

### Requirement: Documentation Support
The component SHALL include JSDoc comments per nimbus-core standards.

#### Scenario: Component JSDoc
- **WHEN** Grid implementation is authored
- **THEN** SHALL include JSDoc block describing purpose
- **AND** SHALL include @supportsStyleProps tag
- **AND** SHALL link to documentation with @see tag
- **AND** SHALL provide usage examples where helpful

#### Scenario: Props JSDoc
- **WHEN** GridProps interface is defined
- **THEN** SHALL document templateColumns prop (or gridTemplateColumns)
- **AND** SHALL document templateRows prop (or gridTemplateRows)
- **AND** SHALL document templateAreas prop (or gridTemplateAreas)
- **AND** SHALL document gridAutoFlow prop
- **AND** SHALL document gap props (gap, rowGap, columnGap)
- **AND** SHALL document alignment props (alignItems, justifyItems, alignContent, justifyContent)
- **AND** SHALL document children prop
- **AND** SHALL document ref prop
- **AND** SHALL reference Chakra HTMLChakraProps for style props documentation

#### Scenario: Grid.Item JSDoc
- **WHEN** Grid.Item is documented
- **THEN** SHALL document placement props (gridColumn, gridRow, gridArea)
- **AND** SHALL document span props (colSpan, rowSpan)
- **AND** SHALL document explicit position props (colStart, colEnd, rowStart, rowEnd)
- **AND** SHALL provide usage examples
