# Specification: Box Component

## Overview

The Box component is the foundational layout primitive in the Nimbus design system. It provides a styled container element with full access to Chakra UI style props, enabling rapid UI development through composition. Box is a direct re-export from Chakra UI with Nimbus type definitions.

**Component:** `Box`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 0 - Foundation primitive)
**React Aria:** Not used (non-interactive display component)
**Chakra Integration:** Direct re-export from `@chakra-ui/react/box`

## Purpose

Box serves as the fundamental building block for all layout composition in Nimbus. It provides a semantic container with comprehensive style prop support, enabling developers to rapidly prototype and build UIs without creating custom styled components. As a foundational primitive, it prioritizes flexibility and composability over opinionated styling.

## Requirements

### Requirement: Generic Container Element
The component SHALL render as a generic HTML container element.

#### Scenario: Default div rendering
- **WHEN** no element type is specified
- **THEN** SHALL render as div element
- **AND** SHALL accept all standard div HTML attributes
- **AND** SHALL forward all props to underlying element

#### Scenario: Element characteristics
- **WHEN** Box renders
- **THEN** SHALL have no default styling beyond browser defaults
- **AND** SHALL serve as semantic container
- **AND** SHALL accept any React children

### Requirement: Polymorphic Rendering
The component SHALL support rendering as different HTML elements via asChild pattern.

#### Scenario: AsChild composition
- **WHEN** asChild={true} is set
- **THEN** SHALL apply Box styles to direct child element
- **AND** SHALL preserve child element's functionality and semantics
- **AND** SHALL forward style props to child element
- **AND** SHALL support any valid React element as child

#### Scenario: AsChild without child
- **WHEN** asChild={true} is set but no child is provided
- **THEN** SHALL render as default div element
- **AND** SHALL apply styles to div

#### Scenario: AsChild with multiple children
- **WHEN** asChild={true} is set with multiple children
- **THEN** SHALL apply styles to first child only
- **AND** SHALL ignore subsequent children (Chakra behavior)

### Requirement: Chakra Style Props Support
The component SHALL accept all Chakra UI style props per nimbus-core standards.

#### Scenario: Spacing properties
- **WHEN** spacing props are provided (margin, padding, gap)
- **THEN** SHALL accept: m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py, gap, rowGap, columnGap
- **AND** SHALL use design token values (100, 200, 300, 400, 500, 600)
- **AND** SHALL support string values with units (e.g., "16px", "2rem")
- **AND** SHALL support responsive arrays: `[base, sm, md, lg, xl, 2xl]`
- **AND** SHALL support responsive objects: `{ base, sm, md, lg, xl, 2xl }`

#### Scenario: Color properties
- **WHEN** color props are provided
- **THEN** SHALL accept: bg, background, backgroundColor, color, borderColor
- **AND** SHALL use color palette tokens (primary.3, neutral.11, etc.)
- **AND** SHALL support semantic colors: primary, neutral, info, positive, warning, critical
- **AND** SHALL support system colors: red, blue, green, amber, etc. with scales 1-12
- **AND** SHALL support brand colors: ctviolet, ctteal, ctyellow with scales 1-12
- **AND** SHALL support light/dark mode via semantic tokens

#### Scenario: Layout properties
- **WHEN** layout props are provided
- **THEN** SHALL accept: display, width, w, height, h, minW, maxW, minH, maxH, overflow, overflowX, overflowY
- **AND** SHALL support CSS values: block, inline, flex, grid, inline-flex, inline-block, none
- **AND** SHALL support sizing units: px, %, rem, vh, vw, auto
- **AND** SHALL support responsive breakpoint values

#### Scenario: Flexbox properties
- **WHEN** flexbox props are provided
- **THEN** SHALL accept: flexDirection, flexWrap, justifyContent, alignItems, alignContent, alignSelf, flex, flexGrow, flexShrink, flexBasis, order
- **AND** SHALL support all CSS flexbox values
- **AND** SHALL enable flex layouts via display="flex"

#### Scenario: Grid properties
- **WHEN** grid props are provided
- **THEN** SHALL accept: gridTemplateColumns, gridTemplateRows, gridColumn, gridRow, gridArea, gridAutoFlow, gridAutoColumns, gridAutoRows, gap, rowGap, columnGap
- **AND** SHALL support all CSS grid values
- **AND** SHALL enable grid layouts via display="grid"

#### Scenario: Border properties
- **WHEN** border props are provided
- **THEN** SHALL accept: border, borderTop, borderRight, borderBottom, borderLeft, borderWidth, borderStyle, borderColor, borderRadius
- **AND** SHALL use border token values: solid-25, solid-50, solid-100
- **AND** SHALL use radius tokens: 50, 100, 200, 300, 400, 500, 600, full
- **AND** SHALL support individual border side styling

#### Scenario: Typography properties
- **WHEN** typography props are provided
- **THEN** SHALL accept: fontSize, fontWeight, lineHeight, letterSpacing, textAlign, textDecoration, textTransform, fontFamily
- **AND** SHALL use typography tokens: 300, 350, 400, 500, 600, 700, 800, 900, 1000
- **AND** SHALL support responsive typography values

#### Scenario: Position properties
- **WHEN** position props are provided
- **THEN** SHALL accept: position, top, right, bottom, left, zIndex
- **AND** SHALL support: static, relative, absolute, fixed, sticky
- **AND** SHALL accept numeric and string values

#### Scenario: Shadow properties
- **WHEN** shadow props are provided
- **THEN** SHALL accept: shadow, boxShadow, textShadow
- **AND** SHALL use shadow tokens: 1, 2, 3, 4, 5, 6
- **AND** SHALL support light/dark mode shadow variants

### Requirement: Responsive Design Support
The component SHALL support responsive styling patterns per nimbus-core standards.

#### Scenario: Responsive array syntax
- **WHEN** responsive array values are provided
- **THEN** SHALL apply values at breakpoints: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL use mobile-first approach (base applies to all, larger overrides)
- **AND** SHALL support partial arrays (e.g., [base, , md] skips sm)

#### Scenario: Responsive object syntax
- **WHEN** responsive object values are provided
- **THEN** SHALL accept: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL apply values at corresponding breakpoints
- **AND** SHALL allow partial objects with specific breakpoints

#### Scenario: Mixed responsive patterns
- **WHEN** multiple responsive props are used
- **THEN** SHALL support mixing arrays and objects
- **AND** SHALL apply breakpoints consistently across all props
- **AND** SHALL use design token breakpoint values

### Requirement: Design Token Integration
The component SHALL use design tokens from @commercetools/nimbus-tokens per nimbus-core standards.

#### Scenario: Token value acceptance
- **WHEN** style props reference tokens
- **THEN** SHALL accept semantic token names (primary.3, neutral.11)
- **AND** SHALL accept spacing tokens (100-600)
- **AND** SHALL accept typography tokens (300-1000)
- **AND** SHALL accept radius tokens (50-600, full)
- **AND** SHALL accept shadow tokens (1-6)

#### Scenario: Token resolution
- **WHEN** token values are applied
- **THEN** SHALL resolve to CSS custom properties
- **AND** SHALL support theme switching (light/dark mode)
- **AND** SHALL provide consistent values across components

### Requirement: CSS-in-JS Styling Support
The component SHALL support CSS-in-JS via Chakra style props.

#### Scenario: Style prop object
- **WHEN** style props are provided as objects
- **THEN** SHALL merge all style props into element styles
- **AND** SHALL support camelCase CSS properties
- **AND** SHALL convert to appropriate CSS

#### Scenario: Pseudo selectors
- **WHEN** pseudo selector props are provided
- **THEN** SHALL accept: _hover, _focus, _active, _disabled, _visited, _focusVisible, _before, _after
- **AND** SHALL apply styles on corresponding pseudo states
- **AND** SHALL support nested style objects

#### Scenario: CSS shorthand properties
- **WHEN** shorthand CSS props are used
- **THEN** SHALL support: m (margin), p (padding), bg (background), w (width), h (height)
- **AND** SHALL provide developer convenience
- **AND** SHALL be equivalent to full property names

### Requirement: Children Composition
The component SHALL accept and render any React node as children.

#### Scenario: Text content
- **WHEN** children is text string
- **THEN** SHALL render text directly
- **AND** SHALL apply typography styles if provided

#### Scenario: React elements
- **WHEN** children contains React elements
- **THEN** SHALL render all child elements
- **AND** SHALL maintain element tree hierarchy
- **AND** SHALL support nested Box components

#### Scenario: Multiple children
- **WHEN** children contains multiple nodes
- **THEN** SHALL render all children in order
- **AND** SHALL apply container layout styles (flex, grid, etc.)

#### Scenario: No children
- **WHEN** children is not provided
- **THEN** SHALL render empty container
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

#### Scenario: Ref with asChild
- **WHEN** ref is provided with asChild={true}
- **THEN** SHALL forward ref to child element
- **AND** ref type SHALL match child element type
- **AND** SHALL maintain ref functionality

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
- **WHEN** Box is imported in TypeScript
- **THEN** SHALL export BoxProps type
- **AND** SHALL extend HTMLChakraProps<"div">
- **AND** SHALL include children?: React.ReactNode
- **AND** SHALL include ref?: React.Ref<HTMLDivElement>
- **AND** SHALL provide JSDoc documentation

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

#### Scenario: Form events
- **WHEN** form event handlers are provided
- **THEN** SHALL accept: onChange, onInput, onSubmit
- **AND** SHALL work with form elements inside Box
- **AND** SHALL support form composition patterns

### Requirement: Semantic HTML Support
The component SHALL support semantic HTML patterns via asChild.

#### Scenario: Semantic container elements
- **WHEN** used with asChild and semantic elements
- **THEN** SHALL support: section, article, aside, nav, main, header, footer
- **AND** SHALL apply Box styles to semantic elements
- **AND** SHALL maintain semantic meaning in document structure

#### Scenario: Interactive elements
- **WHEN** used with asChild and interactive elements
- **THEN** SHALL support: button, a, label
- **AND** SHALL preserve element interactivity
- **AND** SHALL maintain accessibility semantics

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
- **WHEN** Box is inspected in React DevTools
- **THEN** displayName SHALL be "Box"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging and development

### Requirement: No Recipe Styling
The component SHALL not use Chakra recipe system.

#### Scenario: Direct Chakra re-export
- **WHEN** Box component is implemented
- **THEN** SHALL re-export Chakra UI Box directly
- **AND** SHALL not define custom recipe file
- **AND** SHALL not register recipe in theme
- **AND** SHALL rely entirely on Chakra's built-in Box implementation

#### Scenario: Style prop only styling
- **WHEN** Box receives styling
- **THEN** SHALL apply via style props only
- **AND** SHALL not have variant or size props
- **AND** SHALL not have recipe-based theming

### Requirement: Foundation Primitive Role
The component SHALL serve as foundational building block for other components.

#### Scenario: Component composition base
- **WHEN** other Nimbus components are built
- **THEN** Box MAY be used as layout container
- **AND** SHALL provide consistent styling foundation
- **AND** SHALL enable rapid prototyping

#### Scenario: Custom component building
- **WHEN** application developers build custom components
- **THEN** Box SHALL serve as styled container primitive
- **AND** SHALL eliminate need for custom styled components
- **AND** SHALL provide design token integration out of box

### Requirement: Performance Characteristics
The component SHALL maintain minimal performance overhead.

#### Scenario: Lightweight wrapper
- **WHEN** Box renders
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
- **WHEN** Box uses style props with token values
- **THEN** SHALL resolve tokens from Nimbus theme
- **AND** SHALL use configured breakpoints
- **AND** SHALL use configured color palettes

#### Scenario: CSS variable support
- **WHEN** Box uses design tokens
- **THEN** SHALL resolve to CSS custom properties
- **AND** SHALL support runtime theme switching
- **AND** SHALL work with light/dark mode

### Requirement: Documentation Support
The component SHALL include JSDoc comments per nimbus-core standards.

#### Scenario: Component JSDoc
- **WHEN** Box implementation is authored
- **THEN** SHALL include JSDoc block describing purpose
- **AND** SHALL include @supportsStyleProps tag
- **AND** SHALL link to documentation with @see tag
- **AND** SHALL provide usage examples where helpful

#### Scenario: Props JSDoc
- **WHEN** BoxProps interface is defined
- **THEN** SHALL document children prop
- **AND** SHALL document ref prop
- **AND** SHALL reference Chakra HTMLChakraProps for style props documentation
