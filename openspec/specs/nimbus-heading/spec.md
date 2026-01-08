# Specification: Heading Component

## Overview

The Heading component is a foundational typography component in the Nimbus design system for rendering semantic HTML heading elements (h1-h6) with design system styling. It provides independent control of semantic level and visual appearance, comprehensive typography controls, and design token integration. Heading integrates with React Aria Components for slot-based composition while wrapping Chakra UI's Heading component for styling.

**Component:** `Heading`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 0 - Foundation primitive)
**React Aria:** HeadingContext integration for slot-based composition
**Chakra Integration:** Wraps `@chakra-ui/react/heading` with React Aria compatibility

## Purpose

Heading serves as the foundational typography component for rendering semantic heading elements in Nimbus applications. It provides proper document structure and hierarchy with visual size control decoupled from semantic meaning, enabling developers to create accessible content hierarchies while maintaining design consistency. As a foundational primitive, it prioritizes accessibility, semantic HTML, and flexible styling.

## Requirements

### Requirement: Heading Content Display
The component SHALL render heading text content with appropriate typography.

#### Scenario: Default heading rendering
- **WHEN** children prop contains text
- **THEN** SHALL render text inside heading element
- **AND** SHALL apply default typography styles from recipe
- **AND** SHALL apply fontWeight: 600 (semibold) from recipe base styles

#### Scenario: Multiple child nodes
- **WHEN** children contains multiple text nodes or elements
- **THEN** SHALL render all children in order
- **AND** SHALL maintain text flow and spacing
- **AND** SHALL support nested inline elements

#### Scenario: Empty content
- **WHEN** children is empty or not provided
- **THEN** SHALL render empty heading element
- **AND** SHALL maintain element in DOM
- **AND** SHALL preserve spacing if applied via style props

### Requirement: Default Semantic Rendering
The component SHALL render as h2 element by default per Chakra UI Heading defaults.

#### Scenario: Default h2 element
- **WHEN** no as prop is specified
- **THEN** SHALL render as h2 element
- **AND** SHALL provide level-2 heading semantics
- **AND** SHALL accept all standard h2 HTML attributes
- **AND** SHALL be announced as heading level 2 by screen readers

#### Scenario: Element characteristics
- **WHEN** Heading renders as default element
- **THEN** SHALL have block-level display characteristics
- **AND** SHALL serve as semantic section heading
- **AND** SHALL accept React children

### Requirement: Semantic Level Control
The component SHALL support rendering as different heading levels via as prop.

#### Scenario: H1 element rendering
- **WHEN** as="h1" is set
- **THEN** SHALL render as h1 element
- **AND** SHALL provide top-level document heading semantics
- **AND** SHALL be announced as heading level 1 by screen readers
- **AND** SHOULD be used once per page for main title

#### Scenario: H2 element rendering
- **WHEN** as="h2" is set
- **THEN** SHALL render as h2 element
- **AND** SHALL provide section heading semantics
- **AND** SHALL indicate major document sections

#### Scenario: H3 element rendering
- **WHEN** as="h3" is set
- **THEN** SHALL render as h3 element
- **AND** SHALL provide subsection heading semantics
- **AND** SHALL indicate content subdivisions

#### Scenario: H4 element rendering
- **WHEN** as="h4" is set
- **THEN** SHALL render as h4 element
- **AND** SHALL provide sub-subsection heading semantics
- **AND** SHALL support deeper content hierarchy

#### Scenario: H5 element rendering
- **WHEN** as="h5" is set
- **THEN** SHALL render as h5 element
- **AND** SHALL provide lower-level heading semantics
- **AND** SHALL support deep content structures

#### Scenario: H6 element rendering
- **WHEN** as="h6" is set
- **THEN** SHALL render as h6 element
- **AND** SHALL provide deepest heading level semantics
- **AND** SHALL be lowest semantic heading level in HTML

### Requirement: Visual Size Control
The component SHALL support visual size variants independent of semantic level.

#### Scenario: Extra-small size
- **WHEN** size="xs" is set
- **THEN** SHALL apply xs textStyle preset from recipe
- **AND** SHALL render with smallest visual heading size
- **AND** SHALL maintain semantic heading level from as prop

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** SHALL apply sm textStyle preset from recipe
- **AND** SHALL render with small visual heading size

#### Scenario: Medium size
- **WHEN** size="md" is set
- **THEN** SHALL apply md textStyle preset from recipe
- **AND** SHALL render with medium visual heading size

#### Scenario: Large size
- **WHEN** size="lg" is set
- **THEN** SHALL apply lg textStyle preset from recipe
- **AND** SHALL render with large visual heading size

#### Scenario: Extra-large size
- **WHEN** size="xl" is set (default)
- **THEN** SHALL apply xl textStyle preset from recipe
- **AND** SHALL render with extra-large visual heading size
- **AND** SHALL be default size when size prop not provided

#### Scenario: 2X-large size
- **WHEN** size="2xl" is set
- **THEN** SHALL apply 2xl textStyle preset from recipe
- **AND** SHALL render with 2x-large visual heading size

#### Scenario: 3X-large size
- **WHEN** size="3xl" is set
- **THEN** SHALL apply 3xl textStyle preset from recipe
- **AND** SHALL render with 3x-large visual heading size

#### Scenario: 4X-large size
- **WHEN** size="4xl" is set
- **THEN** SHALL apply 4xl textStyle preset from recipe
- **AND** SHALL render with 4x-large visual heading size

#### Scenario: 5X-large size
- **WHEN** size="5xl" is set
- **THEN** SHALL apply 5xl textStyle preset from recipe
- **AND** SHALL render with 5x-large visual heading size

#### Scenario: 6X-large size
- **WHEN** size="6xl" is set
- **THEN** SHALL apply 6xl textStyle preset from recipe
- **AND** SHALL render with 6x-large visual heading size

#### Scenario: 7X-large size
- **WHEN** size="7xl" is set
- **THEN** SHALL apply 7xl textStyle preset from recipe
- **AND** SHALL render with largest visual heading size
- **AND** SHALL be suitable for hero sections and landing pages

### Requirement: Decoupled Semantic and Visual Hierarchy
The component SHALL support independent control of semantic level and visual size.

#### Scenario: Visual larger than semantic
- **WHEN** as="h3" and size="xl" are set
- **THEN** SHALL render as h3 element for semantics
- **AND** SHALL display with xl visual size
- **AND** SHALL maintain proper heading hierarchy in DOM

#### Scenario: Visual smaller than semantic
- **WHEN** as="h2" and size="sm" are set
- **THEN** SHALL render as h2 element for semantics
- **AND** SHALL display with sm visual size
- **AND** SHALL allow design flexibility while preserving accessibility

#### Scenario: Design system flexibility
- **WHEN** semantic and visual hierarchy are decoupled
- **THEN** SHALL enable visual design without compromising document structure
- **AND** SHALL support consistent visual scale across different semantic levels
- **AND** SHALL maintain screen reader heading hierarchy

### Requirement: Typography Style Preset Integration
The component SHALL integrate with Chakra textStyle system via recipe.

#### Scenario: TextStyle application via size
- **WHEN** size prop is set
- **THEN** SHALL apply corresponding textStyle from Nimbus theme
- **AND** SHALL set fontSize, lineHeight, letterSpacing from textStyle
- **AND** SHALL maintain consistent typography scale with Text component

#### Scenario: Recipe-based textStyle mapping
- **WHEN** recipe applies textStyle
- **THEN** SHALL use textStyle token matching size value (e.g., size="xl" → textStyle="xl")
- **AND** SHALL resolve from themeTokens.textStyle
- **AND** SHALL provide consistent typography across Nimbus components

### Requirement: Font Family
The component SHALL apply heading font family from design tokens.

#### Scenario: Heading font family
- **WHEN** Heading renders
- **THEN** SHALL apply fontFamily: "heading" from recipe base styles
- **AND** SHALL use heading font family token from theme
- **AND** SHALL differentiate from body text font family

### Requirement: Font Weight Control
The component SHALL support font weight variations.

#### Scenario: Default semibold weight
- **WHEN** fontWeight prop is not provided
- **THEN** SHALL apply fontWeight: 600 (semibold) from recipe base styles
- **AND** SHALL provide appropriate weight for headings

#### Scenario: Numeric font weight override
- **WHEN** fontWeight prop is set
- **THEN** SHALL accept numeric values: 100, 200, 300, 400, 500, 600, 700, 800, 900
- **AND** SHALL override recipe default weight

#### Scenario: Named font weight override
- **WHEN** fontWeight prop is set to named value
- **THEN** SHALL accept: normal, bold, lighter, bolder
- **AND** SHALL resolve to appropriate numeric weight
- **AND** SHALL override recipe default

### Requirement: Line Height Control
The component SHALL support line height adjustments.

#### Scenario: TextStyle line height
- **WHEN** size prop applies textStyle
- **THEN** SHALL inherit lineHeight from textStyle preset
- **AND** SHALL maintain vertical rhythm consistency

#### Scenario: Custom line height
- **WHEN** lineHeight prop is provided
- **THEN** SHALL accept unitless numbers (e.g., 1.2)
- **AND** SHALL accept values with units (e.g., "32px", "2rem")
- **AND** SHALL override textStyle lineHeight

### Requirement: Color Palette Support
The component SHALL support comprehensive color palette for heading text.

#### Scenario: Semantic colors
- **WHEN** color prop is set to semantic value
- **THEN** SHALL accept: fg (foreground), fg.subtle (secondary), fg.muted
- **AND** SHALL accept semantic palettes: primary.11, neutral.11, info.11, positive.11, warning.11, critical.11
- **AND** SHALL maintain WCAG AA contrast ratios (3:1 for large text)
- **AND** SHALL support light and dark modes via semantic tokens

#### Scenario: System colors
- **WHEN** color prop is set to system color
- **THEN** SHALL accept all Radix color scales (grass.11, tomato.11, blue.11, amber.11, etc.)
- **AND** SHALL use scale 11 for text color (high contrast)
- **AND** SHALL maintain consistent visual weight across colors

#### Scenario: Brand colors
- **WHEN** color prop is set to brand color
- **THEN** SHALL accept: ctviolet.11, ctteal.11, ctyellow.11
- **AND** SHALL apply brand color from color-tokens package
- **AND** SHALL maintain brand consistency

#### Scenario: Default heading color
- **WHEN** color prop is not provided
- **THEN** SHALL use default foreground color (fg)
- **AND** SHALL inherit color from parent if appropriate
- **AND** SHALL maintain readable contrast

### Requirement: Text Alignment
The component SHALL support text alignment options.

#### Scenario: Left alignment
- **WHEN** textAlign="left" is set
- **THEN** SHALL align heading text to left edge
- **AND** SHALL be default alignment for LTR languages

#### Scenario: Center alignment
- **WHEN** textAlign="center" is set
- **THEN** SHALL align heading text to center
- **AND** SHALL distribute whitespace evenly on sides
- **AND** SHALL be common for page titles and hero headings

#### Scenario: Right alignment
- **WHEN** textAlign="right" is set
- **THEN** SHALL align heading text to right edge
- **AND** SHALL be suitable for RTL languages

#### Scenario: Responsive alignment
- **WHEN** textAlign prop uses responsive values
- **THEN** SHALL support array or object syntax
- **AND** SHALL apply different alignments at breakpoints

### Requirement: Text Truncation
The component SHALL support single-line text truncation.

#### Scenario: Truncate with ellipsis
- **WHEN** truncate={true} is set
- **THEN** SHALL apply CSS for single-line truncation
- **AND** SHALL add ellipsis (...) at overflow point
- **AND** SHALL set overflow: hidden, textOverflow: ellipsis, whiteSpace: nowrap
- **AND** SHOULD provide tooltip or title for full text accessibility

#### Scenario: No truncation
- **WHEN** truncate prop is not set or false
- **THEN** SHALL allow heading text to wrap normally
- **AND** SHALL not apply truncation styles

### Requirement: Line Clamping
The component SHALL support multi-line heading truncation via line clamping.

#### Scenario: Line clamp number
- **WHEN** noOfLines prop is set to number (e.g., noOfLines={2})
- **THEN** SHALL limit heading to specified number of lines
- **AND** SHALL use -webkit-line-clamp CSS property
- **AND** SHALL add ellipsis after last visible line
- **AND** SHALL set display: -webkit-box, -webkit-box-orient: vertical

#### Scenario: Line clamp with overflow
- **WHEN** heading text exceeds noOfLines limit
- **THEN** SHALL truncate overflow content
- **AND** SHALL show ellipsis indicator
- **AND** SHOULD provide mechanism to view full heading (tooltip, expand)

#### Scenario: No line clamping
- **WHEN** noOfLines prop is not set
- **THEN** SHALL render all heading text without line limit
- **AND** SHALL not apply line-clamp styles

### Requirement: Text Transform
The component SHALL support text case transformations.

#### Scenario: Uppercase transform
- **WHEN** textTransform="uppercase" is set
- **THEN** SHALL render all heading text in uppercase letters
- **AND** SHALL preserve original content (no data mutation)

#### Scenario: Lowercase transform
- **WHEN** textTransform="lowercase" is set
- **THEN** SHALL render all heading text in lowercase letters

#### Scenario: Capitalize transform
- **WHEN** textTransform="capitalize" is set
- **THEN** SHALL capitalize first letter of each word
- **AND** SHALL follow CSS capitalization rules

#### Scenario: No transform
- **WHEN** textTransform="none" is set or not provided
- **THEN** SHALL render heading text in original case
- **AND** SHALL be default behavior

### Requirement: Letter Spacing
The component SHALL support letter spacing adjustments.

#### Scenario: TextStyle letter spacing
- **WHEN** size prop applies textStyle
- **THEN** SHALL inherit letterSpacing from textStyle preset if defined
- **AND** SHALL maintain consistent tracking

#### Scenario: Custom letter spacing
- **WHEN** letterSpacing prop is set
- **THEN** SHALL accept values with units (e.g., "1px", "0.05em")
- **AND** SHALL apply custom spacing between characters
- **AND** SHALL override textStyle letterSpacing

### Requirement: Chakra Style Props Support
The component SHALL accept all Chakra UI style props per nimbus-core standards.

#### Scenario: Spacing properties
- **WHEN** spacing props are provided
- **THEN** SHALL accept: m, mt, mr, mb, ml, mx, my, p, pt, pr, pb, pl, px, py
- **AND** SHALL use design token values (100-600)
- **AND** SHALL support responsive values

#### Scenario: Display properties
- **WHEN** display prop is provided
- **THEN** SHALL accept: block (default), inline, inline-block, flex, inline-flex, grid, none
- **AND** SHALL control element display mode

#### Scenario: Width and height
- **WHEN** sizing props are provided
- **THEN** SHALL accept: width, w, height, h, minW, maxW, minH, maxH
- **AND** SHALL control element dimensions

#### Scenario: Background color
- **WHEN** background props are provided
- **THEN** SHALL accept: bg, background, backgroundColor
- **AND** SHALL support color palette tokens
- **AND** SHALL be rare for Heading but supported for special cases

### Requirement: Responsive Typography Support
The component SHALL support responsive typography patterns per nimbus-core standards.

#### Scenario: Responsive array syntax
- **WHEN** typography props use array values
- **THEN** SHALL apply values at breakpoints: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL use mobile-first approach
- **AND** SHALL support partial arrays

#### Scenario: Responsive object syntax
- **WHEN** typography props use object values
- **THEN** SHALL accept: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL apply at corresponding breakpoints

#### Scenario: Responsive size scaling
- **WHEN** size prop uses responsive values
- **THEN** SHALL support size={["sm", "md", "xl"]} for mobile-to-desktop scaling
- **AND** SHALL apply appropriate textStyles at each breakpoint
- **AND** SHALL enable optimal typography for screen sizes

### Requirement: React Aria Context Integration
The component SHALL integrate with React Aria HeadingContext for slot-based composition.

#### Scenario: HeadingContext support
- **WHEN** Heading is used within React Aria component with HeadingContext
- **THEN** SHALL merge context props using useContextProps hook
- **AND** SHALL support slot prop for context identification
- **AND** SHALL forward ref through context

#### Scenario: Slot prop handling
- **WHEN** slot prop is provided
- **THEN** SHALL pass slot identifier to Chakra Heading
- **AND** SHALL enable React Aria slot-based composition
- **AND** SHALL support string or undefined slot values

#### Scenario: Context prop merging
- **WHEN** props are provided both via context and directly
- **THEN** SHALL merge props using useContextProps
- **AND** direct props SHALL take precedence over context props
- **AND** SHALL maintain prop priority rules

#### Scenario: As prop priority
- **WHEN** as prop is provided both directly and via context
- **THEN** SHALL prioritize direct as prop over context as prop
- **AND** SHALL evaluate: props.as || contextProps.as
- **AND** SHALL ensure explicit prop takes precedence

### Requirement: Ref Forwarding
The component SHALL forward refs to the underlying heading element per nimbus-core standards.

#### Scenario: Ref access
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to root heading element
- **AND** SHALL provide access to HTMLHeadingElement
- **AND** SHALL support React.Ref<HTMLHeadingElement> type
- **AND** SHALL allow DOM manipulation and measurements

#### Scenario: Ref with context
- **WHEN** ref is provided with HeadingContext
- **THEN** SHALL merge ref using useContextProps
- **AND** SHALL forward merged ref to element
- **AND** SHALL support both context and direct refs

### Requirement: Data Attributes Support
The component SHALL accept data attributes for testing and metadata.

#### Scenario: Test identifiers
- **WHEN** data-testid is provided
- **THEN** SHALL forward to root heading element
- **AND** SHALL be queryable in tests

#### Scenario: Custom metadata
- **WHEN** custom data-* attributes are provided
- **THEN** SHALL forward all data attributes to root element
- **AND** SHALL preserve attribute values

### Requirement: TypeScript Type Safety
The component SHALL provide comprehensive type definitions per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** Heading is imported in TypeScript
- **THEN** SHALL export HeadingProps type
- **AND** SHALL extend HeadingRecipeVariantProps & Omit<ChakraHeadingProps, "slot">
- **AND** SHALL include ref?: React.Ref<HTMLHeadingElement>
- **AND** SHALL include slot?: string | null | undefined
- **AND** SHALL include size prop with explicit union type
- **AND** SHALL provide JSDoc documentation

#### Scenario: Recipe variant props
- **WHEN** HeadingRecipeVariantProps is defined
- **THEN** SHALL include size prop with default "xl"
- **AND** SHALL type size as union: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl"
- **AND** SHALL provide autocomplete for size values

#### Scenario: Chakra props inheritance
- **WHEN** HeadingProps is used
- **THEN** SHALL inherit all Chakra Heading props
- **AND** SHALL provide autocomplete for typography props
- **AND** SHALL type-check prop values

#### Scenario: Slot type override
- **WHEN** slot prop is typed
- **THEN** SHALL accept string, null, or undefined
- **AND** SHALL override Chakra's stricter slot type
- **AND** SHALL support React Aria slot patterns

#### Scenario: As prop typing
- **WHEN** as prop is typed
- **THEN** SHALL accept: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
- **AND** SHALL provide heading level autocomplete
- **AND** SHALL inherit from ChakraHeadingProps

### Requirement: ARIA Attributes Support
The component SHALL accept ARIA attributes for accessibility.

#### Scenario: ARIA labels
- **WHEN** ARIA label attributes are provided
- **THEN** SHALL accept: aria-label, aria-labelledby, aria-describedby
- **AND** SHALL forward to root heading element
- **AND** SHALL be announced by screen readers

#### Scenario: ARIA level override
- **WHEN** aria-level attribute is provided
- **THEN** SHALL accept numeric aria-level
- **AND** MAY override visual heading level for screen readers
- **AND** SHALL be rare but supported for special accessibility needs

#### Scenario: ARIA roles
- **WHEN** role attribute is provided
- **THEN** SHALL accept any valid ARIA role
- **AND** SHALL override default heading semantics if specified
- **AND** SHOULD typically not be needed (use semantic headings)

### Requirement: Event Handler Support
The component SHALL support all standard DOM event handlers.

#### Scenario: Mouse events
- **WHEN** mouse event handlers are provided
- **THEN** SHALL accept: onClick, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp
- **AND** SHALL call handlers on corresponding events

#### Scenario: Keyboard events
- **WHEN** keyboard event handlers are provided
- **THEN** SHALL accept: onKeyDown, onKeyUp, onKeyPress
- **AND** SHALL support keyboard interactions when element is interactive

#### Scenario: Focus events
- **WHEN** focus event handlers are provided
- **THEN** SHALL accept: onFocus, onBlur
- **AND** SHALL call handlers on focus changes

### Requirement: Semantic HTML Usage
The component SHALL use appropriate semantic heading elements per nimbus-core standards.

#### Scenario: Heading semantics
- **WHEN** rendered as h1-h6 element
- **THEN** SHALL provide proper heading semantics for document structure
- **AND** SHALL be announced as heading with level by screen readers
- **AND** SHALL support browser heading navigation features

#### Scenario: Document outline
- **WHEN** multiple Heading components are used
- **THEN** SHALL contribute to document outline and hierarchy
- **AND** SHALL enable assistive technology heading navigation
- **AND** SHALL support heading level skimming by screen readers

### Requirement: Accessibility Considerations
The component SHALL meet WCAG AA requirements per nimbus-core standards.

#### Scenario: Heading hierarchy
- **WHEN** Heading components establish document structure
- **THEN** SHOULD follow sequential heading levels (h1 → h2 → h3, not h1 → h3)
- **AND** SHOULD NOT skip heading levels for accessibility
- **AND** SHALL provide logical content structure for assistive technology
- **AND** visual size MAY differ from semantic level via size prop

#### Scenario: Contrast requirements
- **WHEN** Heading renders with color palette
- **THEN** SHALL maintain 3:1 contrast ratio for large text (headings typically 18px+)
- **AND** SHALL meet contrast requirements in both light and dark modes
- **AND** SHALL ensure readability for users with low vision

#### Scenario: Truncation accessibility
- **WHEN** heading text is truncated via truncate or noOfLines
- **THEN** SHOULD provide full text via title attribute or tooltip
- **AND** SHALL ensure screen readers can access complete heading
- **AND** SHALL not hide critical information via truncation

#### Scenario: Screen reader support
- **WHEN** assistive technology encounters Heading
- **THEN** SHALL announce as heading with level (e.g., "heading level 2")
- **AND** SHALL respect semantic level from as prop
- **AND** SHALL enable heading navigation commands in screen readers

#### Scenario: Focus management
- **WHEN** heading is focused programmatically
- **THEN** SHALL support tabIndex for keyboard navigation to heading
- **AND** MAY be used as skip link target for page navigation
- **AND** SHALL not have default focus styling (non-interactive element)

### Requirement: Design Token Integration
The component SHALL use design tokens from @commercetools/nimbus-tokens per nimbus-core standards.

#### Scenario: Typography token resolution
- **WHEN** size prop applies textStyle
- **THEN** SHALL resolve from Nimbus typography tokens (themeTokens.textStyle)
- **AND** SHALL use configured font sizes, line heights, letter spacing
- **AND** SHALL maintain consistent typography scale

#### Scenario: Font family token resolution
- **WHEN** recipe applies fontFamily
- **THEN** SHALL resolve from Nimbus font tokens (fontFamily: "heading")
- **AND** SHALL use theme-configured heading font family

#### Scenario: Color token resolution
- **WHEN** color prop uses token values
- **THEN** SHALL resolve from Nimbus color tokens
- **AND** SHALL support semantic and system color palettes
- **AND** SHALL work with light/dark mode

#### Scenario: Spacing token resolution
- **WHEN** spacing props use token values
- **THEN** SHALL resolve from Nimbus spacing tokens
- **AND** SHALL use consistent spacing scale (100-600)

### Requirement: Recipe-Based Styling
The component SHALL use Chakra recipe system per nimbus-core standards.

#### Scenario: Recipe definition
- **WHEN** Heading component is styled
- **THEN** SHALL define headingRecipe in heading.recipe.ts
- **AND** recipe SHALL set className: "nimbus-heading"
- **AND** recipe SHALL define base styles: fontFamily, fontWeight

#### Scenario: Recipe registration
- **WHEN** headingRecipe is created
- **THEN** SHALL be registered in theme/recipes/index.ts
- **AND** registration SHALL be manual (not auto-discovered)
- **AND** SHALL be available as: heading: headingRecipe

#### Scenario: Recipe variants
- **WHEN** recipe defines variants
- **THEN** SHALL define size variant with textStyle mappings
- **AND** SHALL support all size values: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl
- **AND** SHALL set defaultVariants: { size: "xl" }

#### Scenario: Style prop override
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra style props
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL support responsive style values

### Requirement: CSS-in-JS Styling Support
The component SHALL support CSS-in-JS via Chakra style props.

#### Scenario: Style prop object
- **WHEN** style props are provided
- **THEN** SHALL merge all style props into element styles
- **AND** SHALL support camelCase CSS properties

#### Scenario: Pseudo selectors
- **WHEN** pseudo selector props are provided
- **THEN** SHALL accept: _hover, _focus, _active, _before, _after, _firstLetter
- **AND** SHALL apply styles on corresponding pseudo states

#### Scenario: CSS shorthand properties
- **WHEN** shorthand CSS props are used
- **THEN** SHALL support: m (margin), p (padding), bg (background), w (width), h (height)
- **AND** SHALL be equivalent to full property names

### Requirement: Display Name
The component SHALL provide display name for debugging per nimbus-core standards.

#### Scenario: React DevTools identification
- **WHEN** Heading is inspected in React DevTools
- **THEN** displayName SHALL be "Heading"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging and development

### Requirement: Foundation Primitive Role
The component SHALL serve as foundational building block for heading typography.

#### Scenario: Heading foundation
- **WHEN** application developers need to render headings
- **THEN** Heading SHALL be primary component for heading content
- **AND** SHALL provide semantic HTML heading elements
- **AND** SHALL integrate with design token system

#### Scenario: Document structure
- **WHEN** developers build content hierarchy
- **THEN** Heading SHALL enable proper document outline
- **AND** SHALL support accessibility requirements for heading structure
- **AND** SHALL provide visual flexibility via size prop

#### Scenario: Component composition base
- **WHEN** other Nimbus components need heading rendering
- **THEN** Heading MAY be used for heading content
- **AND** SHALL provide consistent typography foundation
- **AND** SHALL support slot-based composition patterns

### Requirement: Performance Characteristics
The component SHALL maintain minimal performance overhead.

#### Scenario: Lightweight wrapper
- **WHEN** Heading renders
- **THEN** SHALL have minimal JavaScript overhead
- **AND** SHALL be thin wrapper around Chakra UI Heading
- **AND** SHALL only add React Aria context integration

#### Scenario: Recipe compilation
- **WHEN** recipe styles are applied
- **THEN** SHALL use Chakra's optimized styling engine
- **AND** SHALL generate minimal CSS
- **AND** SHALL benefit from recipe style caching

### Requirement: Theme Integration
The component SHALL integrate with Chakra theme configuration.

#### Scenario: Theme token access
- **WHEN** Heading uses recipe and style props
- **THEN** SHALL resolve tokens from Nimbus theme
- **AND** SHALL use configured breakpoints
- **AND** SHALL use configured color palettes

#### Scenario: CSS variable support
- **WHEN** Heading uses design tokens
- **THEN** SHALL resolve to CSS custom properties
- **AND** SHALL support runtime theme switching
- **AND** SHALL work with light/dark mode

### Requirement: Documentation Support
The component SHALL include JSDoc comments per nimbus-core standards.

#### Scenario: Component JSDoc
- **WHEN** Heading implementation is authored
- **THEN** SHALL include JSDoc block describing purpose
- **AND** SHALL include @see tag linking to documentation
- **AND** SHALL describe component as "renders a heading"

#### Scenario: Props JSDoc
- **WHEN** HeadingProps interface is defined
- **THEN** SHALL document all custom props (ref, slot, size)
- **AND** SHALL include @default annotations for default values
- **AND** SHALL reference ChakraHeadingProps for inherited props documentation

#### Scenario: Recipe props JSDoc
- **WHEN** HeadingRecipeVariantProps is defined
- **THEN** SHALL document size prop with @default "xl"
- **AND** SHALL describe size variants available
