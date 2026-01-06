# Specification: InlineSvg Component

## Overview

The InlineSvg component renders arbitrary SVG markup as inline SVG content with comprehensive XSS protection and sanitization. It provides a secure way to display dynamic or user-provided SVG content while maintaining consistent styling through the design system's icon recipe.

**Component:** `InlineSvg`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1)
**React Aria:** Not used (non-interactive display component)

## Purpose

InlineSvg enables safe rendering of SVG content from string data while protecting against XSS attacks through DOMPurify sanitization. It parses SVG markup, extracts attributes, and renders sanitized content with consistent styling via the icon recipe. This allows developers to dynamically display SVG graphics from APIs, databases, or user input without security risks.

## Requirements

### Requirement: SVG Data Input
The component SHALL accept SVG markup as a string via the data prop.

#### Scenario: Valid SVG string
- **WHEN** data prop contains valid SVG markup string
- **THEN** SHALL parse and render the SVG content
- **AND** SHALL extract SVG root attributes (viewBox, width, height, etc.)
- **AND** SHALL render inner SVG content (paths, circles, groups, etc.)

#### Scenario: Required data prop
- **WHEN** component is instantiated
- **THEN** data prop SHALL be required
- **AND** SHALL be type string
- **AND** component SHALL not render without data

#### Scenario: Invalid SVG string
- **WHEN** data prop contains non-SVG content
- **THEN** SHALL fail sanitization or parsing
- **AND** SHALL return null (render nothing)
- **AND** SHALL log warning to console

### Requirement: XSS Protection and Sanitization
The component SHALL sanitize SVG content to prevent XSS attacks using DOMPurify.

#### Scenario: Script tag removal
- **WHEN** SVG data contains script tags
- **THEN** SHALL remove all script elements during sanitization
- **AND** SHALL not execute any JavaScript code
- **AND** SHALL render sanitized SVG without script tags

#### Scenario: Event handler removal
- **WHEN** SVG data contains event handler attributes (onclick, onload, onmouseover, etc.)
- **THEN** SHALL remove all event handler attributes
- **AND** SHALL not allow JavaScript execution via events
- **AND** SHALL strip all attributes starting with "on"

#### Scenario: Style tag removal
- **WHEN** SVG data contains style tags
- **THEN** SHALL remove style elements during sanitization
- **AND** SHALL prevent CSS injection attacks
- **AND** style tags SHALL be in DEFAULT_FORBIDDEN_TAGS list

#### Scenario: Dangerous element removal
- **WHEN** SVG data contains forbidden elements
- **THEN** SHALL remove iframe, embed, object, applet, link, base, meta elements
- **AND** forbidden elements SHALL be defined in DEFAULT_FORBIDDEN_TAGS constant
- **AND** SHALL prevent embedding of external resources

#### Scenario: Style attribute removal
- **WHEN** SVG data contains inline style attributes
- **THEN** SHALL remove style attributes by default (allowStyles: false)
- **AND** SHALL prevent inline CSS injection
- **AND** SHALL maintain visual attributes (fill, stroke, etc.)

#### Scenario: Safe attribute preservation
- **WHEN** SVG data contains safe SVG attributes
- **THEN** SHALL preserve visual attributes (fill, stroke, viewBox, d, cx, cy, r, etc.)
- **AND** SHALL preserve structural attributes (id, class)
- **AND** SHALL preserve accessibility attributes (title, desc)

#### Scenario: DOMPurify configuration
- **WHEN** sanitization is performed
- **THEN** SHALL use DOMPurify.sanitize with USE_PROFILES.svg and USE_PROFILES.svgFilters
- **AND** SHALL apply FORBID_TAGS from DEFAULT_FORBIDDEN_TAGS
- **AND** SHALL apply FORBID_ATTR for style and custom forbidden attributes
- **AND** SHALL return sanitized string or null

### Requirement: Server-Side Rendering Support
The component SHALL handle server-side rendering environments safely.

#### Scenario: SSR environment detection
- **WHEN** component renders in server-side environment
- **THEN** SHALL detect absence of DOM via canUseDOM() utility
- **AND** SHALL check for window, document, and createElement existence
- **AND** SHALL not attempt browser-specific operations

#### Scenario: SSR sanitization bypass
- **WHEN** rendering on server (canUseDOM returns false)
- **THEN** sanitizeSvg SHALL return original SVG string without processing
- **AND** useInlineSvg hook SHALL return unsanitized data with isValid: true
- **AND** SHALL defer sanitization to client hydration

#### Scenario: SSR parsing bypass
- **WHEN** rendering on server
- **THEN** useInlineSvg SHALL not use DOMParser
- **AND** SHALL return raw data as innerSvgContent
- **AND** SHALL return empty svgAttributes object

### Requirement: SVG Attribute Extraction
The component SHALL extract and preserve SVG root element attributes.

#### Scenario: ViewBox preservation
- **WHEN** SVG markup includes viewBox attribute
- **THEN** SHALL extract viewBox value from sanitized SVG element
- **AND** SHALL apply viewBox to rendered svg element
- **AND** SHALL maintain original coordinate system

#### Scenario: Dimension attributes
- **WHEN** SVG markup includes width and height
- **THEN** SHALL extract width and height values
- **AND** SHALL apply to rendered svg element
- **AND** values SHALL be available for sizing control

#### Scenario: Stroke and fill attributes
- **WHEN** SVG root element has stroke or fill attributes
- **THEN** SHALL extract and preserve these attributes
- **AND** SHALL apply to rendered svg element
- **AND** SHALL support currentColor value

#### Scenario: Kebab-case to camelCase conversion
- **WHEN** extracting SVG attributes
- **THEN** SHALL convert kebab-case attribute names to camelCase for React
- **AND** stroke-width SHALL become strokeWidth
- **AND** stroke-linecap SHALL become strokeLinecap
- **AND** stroke-linejoin SHALL become strokeLinejoin
- **AND** conversion SHALL use regex: attr.name.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())

### Requirement: SVG Content Rendering
The component SHALL render sanitized SVG inner content safely.

#### Scenario: Inner HTML rendering
- **WHEN** SVG is sanitized and parsed
- **THEN** SHALL extract innerHTML from parsed SVG element
- **AND** SHALL render via dangerouslySetInnerHTML
- **AND** content SHALL be pre-sanitized by DOMPurify

#### Scenario: Path elements preservation
- **WHEN** SVG contains path elements
- **THEN** SHALL preserve all path elements in inner content
- **AND** SHALL maintain d attribute path data
- **AND** SHALL preserve fill and stroke attributes

#### Scenario: Group elements preservation
- **WHEN** SVG contains g (group) elements
- **THEN** SHALL preserve group structure
- **AND** SHALL maintain nested hierarchy
- **AND** SHALL preserve transform attributes

#### Scenario: Shape elements preservation
- **WHEN** SVG contains shape elements (circle, rect, polygon, polyline, line, ellipse)
- **THEN** SHALL preserve all shape elements
- **AND** SHALL maintain geometry attributes (cx, cy, r, x, y, width, height, points)
- **AND** SHALL preserve visual attributes

### Requirement: Sanitization Validation and Error Handling
The component SHALL validate sanitization results and handle errors gracefully.

#### Scenario: Sanitization failure
- **WHEN** sanitizeSvg returns null
- **THEN** useInlineSvg SHALL set isValid to false
- **AND** SHALL log warning: "InlineSvg: Failed to sanitize SVG data"
- **AND** SHALL return empty svgAttributes and innerSvgContent

#### Scenario: Missing SVG element
- **WHEN** parsed document contains no svg element
- **THEN** useInlineSvg SHALL set isValid to false
- **AND** SHALL log warning: "InlineSvg: No SVG element found in markup"
- **AND** SHALL return empty svgAttributes and innerSvgContent

#### Scenario: Null rendering
- **WHEN** isValid is false
- **THEN** component SHALL return null
- **AND** SHALL not render any DOM elements
- **AND** SHALL not throw error or break page layout

### Requirement: DOMParser Integration
The component SHALL use browser DOMParser to parse sanitized SVG strings.

#### Scenario: SVG parsing
- **WHEN** sanitized SVG string is processed
- **THEN** SHALL create DOMParser instance
- **AND** SHALL parse with parseFromString(sanitized, "image/svg+xml")
- **AND** SHALL extract svg element via querySelector("svg")

#### Scenario: Attribute iteration
- **WHEN** SVG element is parsed
- **THEN** SHALL iterate over all attributes via Array.from(svgEl.attributes)
- **AND** SHALL extract name and value from each attribute
- **AND** SHALL build svgAttributes object with converted names

### Requirement: Memoization and Performance
The component SHALL optimize re-renders through memoization.

#### Scenario: useMemo hook
- **WHEN** useInlineSvg hook processes data
- **THEN** SHALL use useMemo with data as dependency
- **AND** SHALL only re-sanitize when data prop changes
- **AND** SHALL return cached result for unchanged data

#### Scenario: Sanitization cost
- **WHEN** data prop remains constant
- **THEN** SHALL not re-run DOMPurify.sanitize
- **AND** SHALL not re-parse with DOMParser
- **AND** SHALL improve render performance for stable SVG content

### Requirement: Size Control via Icon Recipe
The component SHALL inherit size control from icon recipe.

#### Scenario: Size variants
- **WHEN** size prop is provided
- **THEN** SHALL accept: 2xs, xs, sm, md, lg, xl values
- **AND** SHALL apply icon recipe size variant
- **AND** SHALL set width and height from recipe

#### Scenario: Default size
- **WHEN** size prop is not provided
- **THEN** SHALL use icon recipe default size
- **AND** SHALL apply consistent sizing with Icon component

#### Scenario: Custom size override
- **WHEN** width or height style props are provided
- **THEN** SHALL override recipe size
- **AND** SHALL accept design token values or CSS values
- **AND** SHALL support boxSize for square dimensions

### Requirement: Color Control
The component SHALL support color styling via Chakra style props and icon recipe.

#### Scenario: Color prop
- **WHEN** color prop is provided
- **THEN** SHALL accept design token color values (primary.9, neutral.7, etc.)
- **AND** SHALL apply to svg element
- **AND** SHALL support currentColor in SVG fill/stroke

#### Scenario: CurrentColor support
- **WHEN** SVG markup uses fill="currentColor" or stroke="currentColor"
- **THEN** SHALL inherit color from color prop or parent
- **AND** SHALL enable single color control for icon-style SVGs

#### Scenario: Multi-color preservation
- **WHEN** SVG markup contains explicit color values (#e11d48, rgb(), etc.)
- **THEN** SHALL preserve inline colors from SVG data
- **AND** SHALL not override with currentColor
- **AND** SHALL support multi-color illustrations

### Requirement: Accessibility via Presentation Role
The component SHALL render with appropriate ARIA role for decorative SVG.

#### Scenario: Presentation role
- **WHEN** SVG is rendered
- **THEN** SHALL set role="presentation" on svg element
- **AND** SHALL signal decorative purpose to assistive technology
- **AND** SHALL not announce to screen readers

#### Scenario: Title and description preservation
- **WHEN** SVG markup contains title or desc elements
- **THEN** SHALL preserve these elements in sanitized content
- **AND** SHALL not strip accessibility elements
- **AND** MAY be used to make SVG accessible (role would need override)

#### Scenario: Decorative by default
- **WHEN** component design is evaluated
- **THEN** component SHALL be intended for decorative SVG graphics
- **AND** SHALL not be primary accessibility pattern for semantic images
- **AND** consumers SHALL use Image component for semantic images with alt text

### Requirement: Icon Recipe Integration
The component SHALL use icon recipe for consistent styling.

#### Scenario: Recipe context
- **WHEN** component renders
- **THEN** SHALL use InlineSvgRootSlot created with createRecipeContext
- **AND** SHALL apply iconRecipe from icon component
- **AND** SHALL share styling system with Icon component

#### Scenario: Recipe props support
- **WHEN** recipe-related props are provided
- **THEN** SHALL support size prop from icon recipe
- **AND** SHALL support unstyled prop to disable recipe styles
- **AND** SHALL forward all recipe props to InlineSvgRootSlot

#### Scenario: Base styles from recipe
- **WHEN** icon recipe applies
- **THEN** SHALL apply display, width, height, color styles
- **AND** SHALL use design token values
- **AND** SHALL maintain consistency with Icon component appearance

### Requirement: Style Props Support
The component SHALL accept all Chakra style props for custom styling.

#### Scenario: Dimension style props
- **WHEN** dimension style props are provided
- **THEN** SHALL support width, height, boxSize, minWidth, maxWidth, etc.
- **AND** SHALL override recipe size values
- **AND** SHALL accept design token references or CSS values

#### Scenario: Color style props
- **WHEN** color style props are provided
- **THEN** SHALL support color, fill, stroke style props
- **AND** SHALL override recipe color values
- **AND** SHALL support responsive values (arrays/objects)

#### Scenario: Layout style props
- **WHEN** layout style props are provided
- **THEN** SHALL support margin (m, mt, mr, mb, ml, mx, my)
- **AND** SHALL support padding (p, pt, pr, pb, pl, px, py)
- **AND** SHALL support display, position, flexbox properties

#### Scenario: Style prop forwarding
- **WHEN** component receives props
- **THEN** SHALL forward all Chakra style props to InlineSvgRootSlot
- **AND** InlineSvgRootSlot SHALL extend HTMLChakraProps<"svg">
- **AND** SHALL merge with recipe styles correctly

### Requirement: Ref Forwarding
The component SHALL forward refs to the SVG element per nimbus-core standards.

#### Scenario: Ref forwarding
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to underlying svg element
- **AND** SHALL support React.Ref<SVGSVGElement> type
- **AND** SHALL allow parent components to access DOM node

#### Scenario: Ref usage
- **WHEN** parent component uses ref
- **THEN** SHALL provide access to root svg element
- **AND** SHALL support imperative operations (measurement, animation control)
- **AND** SHALL maintain ref stability across re-renders

### Requirement: No AsChild or As Prop Support
The component SHALL always render as SVG element without polymorphic support.

#### Scenario: Fixed SVG element
- **WHEN** component renders
- **THEN** SHALL always render as svg element
- **AND** SHALL not support as prop for element type change
- **AND** SHALL not support asChild prop for composition slot pattern

#### Scenario: Type safety for restricted props
- **WHEN** InlineSvgProps type is defined
- **THEN** SHALL omit children, as, and asChild from IconProps
- **AND** SHALL use: Omit<IconProps, "children" | "as" | "asChild">
- **AND** TypeScript SHALL prevent passing these props

#### Scenario: Behavior with invalid props
- **WHEN** as or asChild props are passed (type error)
- **THEN** component SHALL ignore these props
- **AND** SHALL still render as svg element
- **AND** SHALL not throw runtime error

### Requirement: Slot Component Architecture
The component SHALL use Chakra slot component for styling integration.

#### Scenario: InlineSvgRootSlot definition
- **WHEN** slot component is created
- **THEN** SHALL be defined in inline-svg.slots.tsx
- **AND** SHALL use createRecipeContext({ recipe: iconRecipe })
- **AND** SHALL create slot with withContext<SVGSVGElement, InlineSvgRootSlotProps>("svg")

#### Scenario: Slot props type
- **WHEN** InlineSvgRootSlotProps is defined
- **THEN** SHALL be HTMLChakraProps<"svg", InlineSvgRecipeProps>
- **AND** InlineSvgRecipeProps SHALL be RecipeProps<"svg"> & UnstyledProp
- **AND** SHALL provide type safety for all props

#### Scenario: Slot usage in component
- **WHEN** InlineSvg component renders
- **THEN** SHALL wrap svg element with InlineSvgRootSlot
- **AND** SHALL pass asChild prop to slot (enables slot composition)
- **AND** SHALL spread remaining props (...rest) to slot

### Requirement: Hook Encapsulation
The component SHALL encapsulate SVG processing logic in custom hook.

#### Scenario: useInlineSvg hook
- **WHEN** component needs to process SVG data
- **THEN** SHALL use useInlineSvg hook from hooks/use-inline-svg.ts
- **AND** hook SHALL accept data string parameter
- **AND** hook SHALL return { isValid, svgAttributes, innerSvgContent }

#### Scenario: Hook responsibilities
- **WHEN** useInlineSvg executes
- **THEN** SHALL handle SSR detection via canUseDOM()
- **AND** SHALL perform sanitization via sanitizeSvg()
- **AND** SHALL parse SVG via DOMParser
- **AND** SHALL extract and convert attributes
- **AND** SHALL return processing results

#### Scenario: Hook return values
- **WHEN** hook processing completes
- **THEN** isValid SHALL be boolean indicating sanitization success
- **AND** svgAttributes SHALL be Record<string, string> with React-compatible attribute names
- **AND** innerSvgContent SHALL be string with sanitized SVG inner HTML

### Requirement: Utility Function Organization
The component SHALL organize utility functions in dedicated files.

#### Scenario: sanitizeSvg utility
- **WHEN** SVG sanitization is needed
- **THEN** SHALL be defined in utils/sanitize-svg.ts
- **AND** SHALL accept svgString and options parameters
- **AND** SHALL return string | null

#### Scenario: canUseDOM utility
- **WHEN** environment detection is needed
- **THEN** SHALL be defined in utils/sanitize-svg.ts
- **AND** SHALL check for window, document, and createElement
- **AND** SHALL return boolean

#### Scenario: Constants organization
- **WHEN** sanitization constants are defined
- **THEN** DEFAULT_FORBIDDEN_TAGS SHALL be in constants/sanitization.constants.ts
- **AND** ALLOWED_PROTOCOLS SHALL be in constants/sanitization.constants.ts
- **AND** SHALL be exported and importable

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** component is imported
- **THEN** SHALL export InlineSvgProps interface from inline-svg.types.ts
- **AND** SHALL include JSDoc comments for data and ref props
- **AND** SHALL extend Omit<IconProps, "children" | "as" | "asChild">

#### Scenario: Recipe props
- **WHEN** component uses recipe
- **THEN** SHALL define InlineSvgRecipeProps type in inline-svg.slots.tsx
- **AND** SHALL include RecipeProps<"svg"> & UnstyledProp
- **AND** SHALL inherit from icon recipe types

#### Scenario: Required vs optional props
- **WHEN** defining component props
- **THEN** data SHALL be required string
- **AND** ref SHALL be optional Ref<SVGSVGElement>
- **AND** size SHALL be optional (inherited from IconProps)
- **AND** color SHALL be optional (inherited from IconProps)

#### Scenario: Utility function types
- **WHEN** utility functions are defined
- **THEN** sanitizeSvg SHALL accept (svgString: string, options: SanitizationOptions) => string | null
- **AND** SanitizationOptions SHALL define allowStyles, forbiddenAttributes, forbiddenTags
- **AND** canUseDOM SHALL return boolean

### Requirement: Component Export
The component SHALL be exported from package per nimbus-core standards.

#### Scenario: Component export
- **WHEN** component is added
- **THEN** SHALL be exported from component index.ts: export { InlineSvg }
- **AND** SHALL be re-exported from package root index.ts
- **AND** SHALL be importable via import { InlineSvg } from "@commercetools/nimbus"

#### Scenario: Type exports
- **WHEN** component types are defined
- **THEN** SHALL export InlineSvgProps from inline-svg.types.ts
- **AND** SHALL re-export from component index.ts: export type { InlineSvgProps }
- **AND** SHALL be available for consumer TypeScript usage

### Requirement: Display Name
The component SHALL define a display name per nimbus-core standards.

#### Scenario: Component display name
- **WHEN** component is defined
- **THEN** SHALL set InlineSvg.displayName = "InlineSvg"
- **AND** SHALL aid debugging and React DevTools inspection
- **AND** SHALL be set immediately after component definition

### Requirement: Testing Support
The component SHALL support testing via data attributes and semantic queries.

#### Scenario: Data attributes
- **WHEN** data-* attributes are provided
- **THEN** SHALL forward all data attributes to root svg element
- **AND** SHALL support testing attributes (data-testid)
- **AND** SHALL support custom metadata attributes

#### Scenario: Test queries
- **WHEN** component is tested
- **THEN** SHOULD be queried by role="presentation"
- **AND** MAY be queried by data-testid if provided
- **AND** SHALL support querySelector("svg") for direct SVG access

### Requirement: Security Best Practices
The component SHALL follow security best practices for dynamic content rendering.

#### Scenario: Sanitization as default
- **WHEN** component processes SVG data
- **THEN** sanitization SHALL be mandatory (not optional)
- **AND** SHALL not provide opt-out for sanitization in browser
- **AND** SHALL protect against all known XSS vectors

#### Scenario: Safe defaults
- **WHEN** sanitization options are not provided
- **THEN** allowStyles SHALL default to false
- **AND** forbiddenAttributes SHALL default to empty array
- **AND** forbiddenTags SHALL default to empty array (DEFAULT_FORBIDDEN_TAGS always applied)

#### Scenario: Documentation warnings
- **WHEN** component is documented
- **THEN** SHALL include security considerations section
- **AND** SHALL explain XSS protection mechanisms
- **AND** SHALL warn against using with untrusted SVG sources without validation

### Requirement: Icon Recipe Consistency
The component SHALL maintain visual consistency with Icon component.

#### Scenario: Shared recipe
- **WHEN** both Icon and InlineSvg render
- **THEN** SHALL use same iconRecipe for styling
- **AND** SHALL support same size variants
- **AND** SHALL have identical dimensions at each size

#### Scenario: Color behavior parity
- **WHEN** color prop is applied
- **THEN** SHALL behave identically to Icon component
- **AND** SHALL support currentColor pattern
- **AND** SHALL integrate with design token color system

### Requirement: No Recipe Registration Required
The component SHALL not require separate recipe registration.

#### Scenario: Recipe reuse
- **WHEN** InlineSvg uses iconRecipe
- **THEN** SHALL reuse existing icon recipe registration
- **AND** SHALL not add "inlineSvg" key to theme/recipes/index.ts
- **AND** iconRecipe SHALL already be registered by Icon component

#### Scenario: Theme dependency
- **WHEN** InlineSvg is used
- **THEN** SHALL depend on iconRecipe being registered
- **AND** SHALL fail gracefully if icon recipe is missing
- **AND** Icon component SHALL be co-located in same package

### Requirement: Console Warnings for Developer Experience
The component SHALL provide helpful console warnings for common issues.

#### Scenario: Sanitization failure warning
- **WHEN** sanitizeSvg returns null
- **THEN** SHALL log: "InlineSvg: Failed to sanitize SVG data"
- **AND** SHALL use console.warn (not console.error)
- **AND** SHALL help developer identify invalid SVG data

#### Scenario: Missing SVG element warning
- **WHEN** no SVG element found in parsed markup
- **THEN** SHALL log: "InlineSvg: No SVG element found in markup"
- **AND** SHALL use console.warn
- **AND** SHALL help developer identify structural issues

#### Scenario: Production warning suppression
- **WHEN** warnings are logged
- **THEN** warnings SHALL appear in development mode
- **AND** MAY be stripped in production builds
- **AND** SHALL not impact production performance
