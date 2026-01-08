# Specification: Stack Component

## Overview

The Stack component is a layout primitive in the Nimbus design system that extends Flex with sensible defaults for stacking elements vertically or horizontally with consistent spacing. It provides a simplified API for common stacking patterns, making it easier to create vertical lists, horizontal groups, and consistently spaced layouts without managing flexbox details. Stack is a direct re-export from Chakra UI with Nimbus type definitions.

**Component:** `Stack`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 0 - Foundation primitive)
**React Aria:** Not used (non-interactive display component)
**Chakra Integration:** Direct re-export from `@chakra-ui/react/stack`

## Purpose

Stack serves as a convenient layout primitive for stacking elements with consistent gaps. While Flex provides comprehensive flexbox control, Stack offers a simpler API optimized for the common case of vertical or horizontal stacking with spacing. It is ideal for form fields, button groups, card lists, menu items, and any layout requiring evenly-spaced elements. Stack extends Flex and inherits all its capabilities, but provides defaults (flexDirection: column) and additional features (separator support) that make stacking patterns more intuitive.

## Requirements

### Requirement: Flex Container with Column Default
The component SHALL render as a flex container with column direction by default.

#### Scenario: Default vertical stacking
- **WHEN** no direction is specified
- **THEN** SHALL render as div with display: flex
- **AND** SHALL apply flexDirection: column by default
- **AND** SHALL lay out children vertically top-to-bottom
- **AND** SHALL accept all standard div HTML attributes

#### Scenario: Flex container characteristics
- **WHEN** Stack renders
- **THEN** SHALL establish a flex formatting context
- **AND** SHALL serve as semantic container for stacked elements
- **AND** SHALL accept any React children
- **AND** SHALL enable all flexbox properties inherited from Flex

### Requirement: Direction Control
The component SHALL support controlling stack direction via direction prop.

#### Scenario: Vertical stacking (default)
- **WHEN** direction="column" is set or not specified
- **THEN** SHALL lay out children vertically top-to-bottom
- **AND** SHALL use vertical axis as main axis
- **AND** SHALL use horizontal axis as cross axis
- **AND** SHALL be default behavior when direction is omitted

#### Scenario: Horizontal stacking
- **WHEN** direction="row" is set
- **THEN** SHALL lay out children horizontally left-to-right
- **AND** SHALL use horizontal axis as main axis
- **AND** SHALL use vertical axis as cross axis

#### Scenario: Reverse directions
- **WHEN** direction="row-reverse" or "column-reverse" is set
- **THEN** SHALL reverse the direction of stack items
- **AND** SHALL maintain flex properties but reverse visual order
- **AND** SHALL support row-reverse (right-to-left) and column-reverse (bottom-to-top)

#### Scenario: Responsive direction
- **WHEN** direction uses responsive values
- **THEN** SHALL support responsive arrays: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL support responsive objects: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL enable common pattern of column-to-row transition (e.g., direction={["column", , "row"]})

### Requirement: Gap Spacing Between Items
The component SHALL support consistent spacing between stack items via gap prop.

#### Scenario: Uniform gap with design tokens
- **WHEN** gap prop is provided with token value
- **THEN** SHALL apply equal spacing between items
- **AND** SHALL accept spacing token values (100, 200, 300, 400, 500, 600)
- **AND** SHALL resolve to CSS custom properties from design tokens
- **AND** SHALL provide consistent spacing across components

#### Scenario: Custom gap values
- **WHEN** gap prop is provided with string value
- **THEN** SHALL accept string values with units (e.g., "16px", "2rem", "1em")
- **AND** SHALL apply spacing between all stack items
- **AND** SHALL respect CSS gap property behavior

#### Scenario: Row and column gaps
- **WHEN** rowGap and columnGap props are provided
- **THEN** SHALL apply different spacing for rows and columns
- **AND** rowGap SHALL control vertical spacing between wrapped lines
- **AND** columnGap SHALL control horizontal spacing between items
- **AND** SHALL support mixing gap with rowGap/columnGap (gap as fallback)

#### Scenario: Responsive gap values
- **WHEN** gap uses responsive values
- **THEN** SHALL support responsive arrays for breakpoint-specific spacing
- **AND** SHALL support responsive objects for explicit breakpoint targeting
- **AND** SHALL enable tighter spacing on mobile, looser on desktop

### Requirement: Alignment Control
The component SHALL support alignment via shorthand props inherited from Flex.

#### Scenario: Cross-axis alignment via align
- **WHEN** align prop is provided
- **THEN** SHALL be shorthand for alignItems style prop
- **AND** SHALL accept values: start, center, end, stretch, baseline
- **AND** SHALL align items along cross axis
- **AND** SHALL default to stretch when not specified

#### Scenario: Main-axis alignment via justify
- **WHEN** justify prop is provided
- **THEN** SHALL be shorthand for justifyContent style prop
- **AND** SHALL accept values: start, center, end, space-between, space-around, space-evenly
- **AND** SHALL align items along main axis
- **AND** SHALL default to start when not specified

#### Scenario: Responsive alignment
- **WHEN** align or justify use responsive values
- **THEN** SHALL support responsive arrays and objects
- **AND** SHALL enable different alignments at different breakpoints
- **AND** SHALL follow mobile-first approach

### Requirement: Separator Support
The component SHALL support visual separators between stack items via separator prop.

#### Scenario: Separator element rendering
- **WHEN** separator prop is provided with React element
- **THEN** SHALL render separator between each stack item
- **AND** SHALL not render separator before first item
- **AND** SHALL not render separator after last item
- **AND** SHALL maintain proper spacing around separators

#### Scenario: Custom separator elements
- **WHEN** separator is provided
- **THEN** SHALL accept any React element (hr, Divider, custom component)
- **AND** SHALL clone separator with appropriate props
- **AND** SHALL preserve separator styling and behavior

#### Scenario: Separator with direction
- **WHEN** separator is used with different directions
- **THEN** SHALL work with column direction (horizontal separators)
- **AND** SHALL work with row direction (vertical separators)
- **AND** SHALL adapt separator orientation based on stack direction

### Requirement: Wrap Behavior Control
The component SHALL support wrapping of stack items via wrap prop inherited from Flex.

#### Scenario: No wrapping (default)
- **WHEN** wrap is not specified or set to "nowrap"
- **THEN** SHALL keep all items on single line
- **AND** SHALL allow items to shrink below their base size
- **AND** SHALL be default behavior

#### Scenario: Wrap items
- **WHEN** wrap="wrap" is set
- **THEN** SHALL wrap items onto multiple lines when they exceed container size
- **AND** SHALL wrap in direction of cross axis
- **AND** SHALL preserve item sizing constraints
- **AND** SHALL respect gap for both main and cross axis spacing

#### Scenario: Wrap reverse
- **WHEN** wrap="wrap-reverse" is set
- **THEN** SHALL wrap items onto multiple lines in reverse order
- **AND** SHALL reverse the cross-axis direction

### Requirement: All Flex Capabilities Inherited
The component SHALL inherit all capabilities from Flex component per nimbus-flex specification.

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

#### Scenario: Flex item properties
- **WHEN** children have flex props
- **THEN** SHALL support flex, flexGrow, flexShrink, flexBasis on children
- **AND** SHALL support alignSelf for individual item alignment
- **AND** SHALL support order for visual reordering
- **AND** SHALL control how items grow and shrink

#### Scenario: Pseudo selectors
- **WHEN** pseudo selector props are provided
- **THEN** SHALL accept: _hover, _focus, _active, _disabled, _visited, _focusVisible, _before, _after
- **AND** SHALL apply styles on corresponding pseudo states
- **AND** SHALL support nested style objects

#### Scenario: Multi-line alignment
- **WHEN** items wrap and alignContent prop is provided
- **THEN** SHALL control alignment of multiple flex lines
- **AND** SHALL accept: start, center, end, stretch, space-between, space-around, space-evenly
- **AND** SHALL only affect containers with multiple lines

### Requirement: Polymorphic Rendering
The component SHALL support rendering as different HTML elements via asChild pattern.

#### Scenario: AsChild composition
- **WHEN** asChild={true} is set
- **THEN** SHALL apply Stack styles to direct child element
- **AND** SHALL preserve child element's functionality and semantics
- **AND** SHALL forward style props to child element
- **AND** SHALL support any valid React element as child

#### Scenario: Semantic stack containers
- **WHEN** used with asChild and semantic elements
- **THEN** SHALL support: section, article, aside, nav, main, header, footer, ul, ol
- **AND** SHALL apply display: flex with column direction to semantic elements
- **AND** SHALL maintain semantic meaning in document structure
- **AND** SHALL enable accessible list patterns with ul/ol

### Requirement: Common Stacking Patterns Support
The component SHALL enable common stacking layout patterns with minimal code.

#### Scenario: Form field stacking
- **WHEN** used for form layouts
- **THEN** SHALL stack form fields vertically with consistent spacing
- **AND** SHALL support gap for spacing between fields
- **AND** SHALL align labels and inputs consistently
- **AND** SHALL be default pattern for vertical forms

#### Scenario: Button group stacking
- **WHEN** used for button groups
- **THEN** SHALL stack buttons horizontally with direction="row"
- **AND** SHALL provide consistent spacing via gap
- **AND** SHALL support responsive direction (vertical on mobile, horizontal on desktop)
- **AND** SHALL enable easy alignment with justify prop

#### Scenario: Card list stacking
- **WHEN** used for card or item lists
- **THEN** SHALL stack cards vertically with consistent gap
- **AND** SHALL support separator between cards
- **AND** SHALL maintain equal spacing without margin collapse issues
- **AND** SHALL work with responsive card sizing

#### Scenario: Menu item stacking
- **WHEN** used for menu or navigation items
- **THEN** SHALL stack items vertically or horizontally
- **AND** SHALL provide consistent spacing between items
- **AND** SHALL support dividers via separator prop
- **AND** SHALL enable easy hover states via _hover pseudo prop

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
- **THEN** SHALL render all child elements as stack items
- **AND** SHALL maintain element tree hierarchy
- **AND** SHALL support nested Stack components
- **AND** SHALL apply spacing between all direct children

#### Scenario: Multiple children
- **WHEN** children contains multiple nodes
- **THEN** SHALL render all children as stack items
- **AND** SHALL apply consistent gap between items
- **AND** SHALL respect flex properties on children
- **AND** SHALL render separator between items if separator prop provided

#### Scenario: Single child
- **WHEN** children contains single element
- **THEN** SHALL render as flex container with single item
- **AND** SHALL still apply flex properties (alignment, justification)
- **AND** SHALL not render separator (no items to separate)

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
- **WHEN** Stack is imported in TypeScript
- **THEN** SHALL export StackProps type
- **AND** SHALL include direction?: ResponsiveValue<"row" | "column" | "row-reverse" | "column-reverse">
- **AND** SHALL include separator?: React.ReactElement
- **AND** SHALL include align?: SystemStyleObject["alignItems"] (shorthand)
- **AND** SHALL include justify?: SystemStyleObject["justifyContent"] (shorthand)
- **AND** SHALL include wrap?: SystemStyleObject["flexWrap"] (shorthand)
- **AND** SHALL include gap?, rowGap?, columnGap?: ResponsiveValue<SpacingToken>
- **AND** SHALL include children?: React.ReactNode
- **AND** SHALL include ref?: React.Ref<HTMLDivElement>
- **AND** SHALL extend HTMLChakraProps<"div"> for all Flex capabilities
- **AND** SHALL provide JSDoc documentation

#### Scenario: Direction type safety
- **WHEN** direction prop is used
- **THEN** SHALL provide autocomplete for values (row, column, row-reverse, column-reverse)
- **AND** SHALL type-check prop values
- **AND** SHALL support responsive value types (arrays and objects)
- **AND** SHALL use ConditionalValue type wrapper

#### Scenario: Shorthand prop types
- **WHEN** align, justify, or wrap props are used
- **THEN** SHALL map to corresponding SystemStyleObject types
- **AND** SHALL provide autocomplete for valid values
- **AND** SHALL support responsive values
- **AND** SHALL type-check against Chakra style system

#### Scenario: Separator type safety
- **WHEN** separator prop is used
- **THEN** SHALL accept React.ReactElement type
- **AND** SHALL type-check that valid React element is provided
- **AND** SHALL support JSX elements (e.g., <hr />, <Divider />)

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
- **AND** SHALL support list roles when appropriate (list with asChild on ul/ol)

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
- **WHEN** Stack is inspected in React DevTools
- **THEN** displayName SHALL be "Stack"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging and development

### Requirement: No Recipe Styling
The component SHALL not use Chakra recipe system.

#### Scenario: Direct Chakra re-export
- **WHEN** Stack component is implemented
- **THEN** SHALL re-export Chakra UI Stack directly
- **AND** SHALL not define custom recipe file
- **AND** SHALL not register recipe in theme
- **AND** SHALL rely entirely on Chakra's built-in Stack implementation

#### Scenario: Style prop only styling
- **WHEN** Stack receives styling
- **THEN** SHALL apply via style props only
- **AND** SHALL not have variant or size props
- **AND** SHALL not have recipe-based theming
- **AND** display: flex with flexDirection: column SHALL be applied by default

### Requirement: Foundation Primitive Role
The component SHALL serve as foundational building block for stacking layouts.

#### Scenario: Simplified stacking API
- **WHEN** building stacked layouts in Nimbus
- **THEN** Stack SHALL be preferred for simple vertical/horizontal stacking
- **AND** SHALL provide simpler API than Flex for common stacking patterns
- **AND** SHALL default to column direction (most common case)
- **AND** SHALL enable rapid prototyping with gap and separator

#### Scenario: Relationship with Flex
- **WHEN** choosing between Stack and Flex
- **THEN** Stack SHALL be used for simple stacking with consistent spacing
- **AND** Flex SHALL be used for complex alignment and flexible sizing
- **AND** Stack SHALL extend Flex and inherit all its capabilities
- **AND** Stack SHALL provide additional separator feature

#### Scenario: Component building
- **WHEN** other Nimbus components need stacking layouts
- **THEN** Stack MAY be used as layout container
- **AND** SHALL provide stacking capabilities out of box
- **AND** SHALL eliminate need for custom flexbox configuration

### Requirement: Performance Characteristics
The component SHALL maintain minimal performance overhead.

#### Scenario: Lightweight wrapper
- **WHEN** Stack renders
- **THEN** SHALL have minimal JavaScript overhead
- **AND** SHALL be direct Chakra UI re-export
- **AND** SHALL not add custom logic or state beyond separator handling

#### Scenario: Style prop compilation
- **WHEN** style props are applied
- **THEN** SHALL use Chakra's optimized styling engine
- **AND** SHALL generate minimal CSS
- **AND** SHALL support tree-shaking of unused props

#### Scenario: Separator rendering
- **WHEN** separator prop is used
- **THEN** SHALL efficiently clone separator elements
- **AND** SHALL minimize re-renders
- **AND** SHALL not create unnecessary wrapper elements

### Requirement: Theme Integration
The component SHALL integrate with Chakra theme configuration.

#### Scenario: Theme token access
- **WHEN** Stack uses style props with token values
- **THEN** SHALL resolve tokens from Nimbus theme
- **AND** SHALL use configured breakpoints
- **AND** SHALL use configured color palettes
- **AND** SHALL use configured spacing scale (100-600)

#### Scenario: CSS variable support
- **WHEN** Stack uses design tokens
- **THEN** SHALL resolve to CSS custom properties
- **AND** SHALL support runtime theme switching
- **AND** SHALL work with light/dark mode

### Requirement: Documentation Support
The component SHALL include JSDoc comments per nimbus-core standards.

#### Scenario: Component JSDoc
- **WHEN** Stack implementation is authored
- **THEN** SHALL include JSDoc block describing purpose
- **AND** SHALL include @supportsStyleProps tag
- **AND** SHALL link to documentation with @see tag
- **AND** SHALL provide usage examples where helpful

#### Scenario: Props JSDoc
- **WHEN** StackProps interface is defined
- **THEN** SHALL document direction prop (with default value)
- **AND** SHALL document separator prop
- **AND** SHALL document shorthand props (align, justify, wrap)
- **AND** SHALL document gap props (gap, rowGap, columnGap)
- **AND** SHALL document children prop
- **AND** SHALL document ref prop
- **AND** SHALL reference HTMLChakraProps for inherited style props documentation
