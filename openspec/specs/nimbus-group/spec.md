# Specification: Group Component

## Overview

The Group component is a layout primitive in the Nimbus design system that provides semantic grouping of related elements with consistent spacing and optional attached styling. Built on React Aria Components' Group primitive, it wraps elements in a container with role="group" for accessibility, making it ideal for button groups, icon groups, tag collections, and any layout where related elements should be identified as a cohesive unit. Group extends the flex container pattern with horizontal direction by default and provides recipe-based styling for variants like "attached" borders.

**Component:** `Group`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1 - Simple wrapper with recipe)
**React Aria:** Uses React Aria Components' Group for semantic grouping
**Chakra Integration:** Wrapped with Chakra recipe context using createRecipeContext

## Purpose

Group serves as a semantic grouping container for related elements, providing both visual and accessibility benefits. Unlike Stack (vertical-first) or Flex (general-purpose), Group is optimized for horizontal collections of related items that should be identified as a unit by assistive technologies. The role="group" attribute ensures screen readers announce the collection as related elements. Group is ideal for button groups, icon sets, tag collections, and toolbars where elements share a common purpose or context. The component supports design token-based spacing, alignment control, and an "attached" variant for connected borders between items.

## Requirements

### Requirement: Semantic Group Container
The component SHALL render as a semantic group container with role="group" by default.

#### Scenario: Default group rendering
- **WHEN** no role is overridden
- **THEN** SHALL render as div with role="group"
- **AND** SHALL accept all standard div HTML attributes
- **AND** SHALL forward all props to underlying element
- **AND** SHALL establish a group context for assistive technologies

#### Scenario: Group semantics
- **WHEN** Group renders
- **THEN** SHALL provide role="group" for screen reader identification
- **AND** SHALL serve as semantic container for related elements
- **AND** SHALL accept any React children
- **AND** SHALL support ARIA labeling (aria-label, aria-labelledby) for group description

### Requirement: Flex Container with Row Default
The component SHALL render as a flex container with row direction by default.

#### Scenario: Default horizontal layout
- **WHEN** no direction or display style is specified
- **THEN** SHALL render with display: inline-flex
- **AND** SHALL lay out children horizontally left-to-right
- **AND** SHALL apply flexDirection: row by default (via inherited flex behavior)
- **AND** SHALL align items center by default (via recipe base styles)

#### Scenario: Flex container characteristics
- **WHEN** Group renders
- **THEN** SHALL establish a flex formatting context
- **AND** SHALL serve as container for grouped elements
- **AND** SHALL support all flexbox properties via style props
- **AND** SHALL enable alignment and spacing control

### Requirement: Gap Spacing Between Items
The component SHALL support consistent spacing between group items via gap prop.

#### Scenario: Uniform gap with design tokens
- **WHEN** gap prop is provided with token value
- **THEN** SHALL apply equal spacing between items
- **AND** SHALL accept spacing token values (100, 200, 300, 400, 500, 600)
- **AND** SHALL resolve to CSS custom properties from design tokens
- **AND** SHALL provide consistent spacing across components

#### Scenario: Custom gap values
- **WHEN** gap prop is provided with string value
- **THEN** SHALL accept string values with units (e.g., "16px", "2rem", "1em")
- **AND** SHALL apply spacing between all group items
- **AND** SHALL respect CSS gap property behavior

#### Scenario: Responsive gap values
- **WHEN** gap uses responsive values
- **THEN** SHALL support responsive arrays for breakpoint-specific spacing
- **AND** SHALL support responsive objects for explicit breakpoint targeting
- **AND** SHALL enable tighter spacing on mobile, looser on desktop

### Requirement: Alignment Control
The component SHALL support alignment via style props inherited from Chakra.

#### Scenario: Cross-axis alignment via alignItems
- **WHEN** alignItems prop is provided
- **THEN** SHALL accept values: start, center, end, stretch, baseline
- **AND** SHALL align items along cross axis (vertical in row direction)
- **AND** SHALL default to center when not specified (via recipe base)

#### Scenario: Main-axis alignment via justifyContent
- **WHEN** justifyContent prop is provided
- **THEN** SHALL accept values: start, center, end, space-between, space-around, space-evenly
- **AND** SHALL align items along main axis (horizontal in row direction)
- **AND** SHALL default to start when not specified

#### Scenario: Responsive alignment
- **WHEN** alignItems or justifyContent use responsive values
- **THEN** SHALL support responsive arrays and objects
- **AND** SHALL enable different alignments at different breakpoints
- **AND** SHALL follow mobile-first approach

### Requirement: Wrap Behavior Control
The component SHALL support wrapping of group items via flexWrap prop.

#### Scenario: No wrapping (default)
- **WHEN** flexWrap is not specified or set to "nowrap"
- **THEN** SHALL keep all items on single line
- **AND** SHALL allow items to shrink below their base size
- **AND** SHALL be default behavior

#### Scenario: Wrap items
- **WHEN** flexWrap="wrap" is set
- **THEN** SHALL wrap items onto multiple lines when they exceed container size
- **AND** SHALL wrap in direction of cross axis
- **AND** SHALL preserve item sizing constraints
- **AND** SHALL respect gap for both main and cross axis spacing

#### Scenario: Wrap reverse
- **WHEN** flexWrap="wrap-reverse" is set
- **THEN** SHALL wrap items onto multiple lines in reverse order
- **AND** SHALL reverse the cross-axis direction

### Requirement: Attached Style Variant
The component SHALL support an "attached" variant for connected borders between items.

#### Scenario: Attached borders
- **WHEN** component uses attached variant (via recipe or style)
- **THEN** SHALL enable connected border styling for child elements
- **AND** SHALL support common pattern of connected button groups
- **AND** SHALL eliminate gaps between item borders
- **AND** SHALL be useful for segmented controls and button toolbars

#### Scenario: Normal spacing (non-attached)
- **WHEN** attached variant is not applied
- **THEN** SHALL render items with normal spacing via gap
- **AND** SHALL maintain separate visual boundaries for each item
- **AND** SHALL be default behavior

### Requirement: React Aria Group Integration
The component SHALL use React Aria Components' Group for accessibility primitives.

#### Scenario: React Aria Group wrapper
- **WHEN** Group renders
- **THEN** SHALL use React Aria's Group component as base element
- **AND** SHALL wrap with Chakra's withContext for styling integration
- **AND** SHALL inherit React Aria's group behavior (role="group")
- **AND** SHALL support React Aria's hover tracking props (onHoverChange, onHoverStart, onHoverEnd)

#### Scenario: React Aria state props
- **WHEN** React Aria state props are provided
- **THEN** SHALL accept isDisabled prop to disable group interactions
- **AND** SHALL accept isInvalid prop to mark group as invalid
- **AND** SHALL forward state to React Aria Group primitive
- **AND** SHALL enable consistent interaction patterns

### Requirement: Recipe Styling System
The component SHALL use Chakra recipe system for styling variants.

#### Scenario: Recipe definition
- **WHEN** Group component is styled
- **THEN** SHALL define recipe in group.recipe.ts file
- **AND** recipe SHALL be registered in theme/recipes/index.ts
- **AND** SHALL use className "nimbus-group"
- **AND** recipe base SHALL define default styles (display: inline-flex, alignItems: center)

#### Scenario: Recipe context integration
- **WHEN** Group renders with recipe
- **THEN** SHALL use createRecipeContext with key "group"
- **AND** SHALL wrap React Aria Group with withContext
- **AND** SHALL forward recipe props (variant, size, etc.) if defined
- **AND** SHALL integrate with Chakra styling engine

### Requirement: Common Grouping Patterns Support
The component SHALL enable common grouping layout patterns with minimal code.

#### Scenario: Button group pattern
- **WHEN** used for button groups
- **THEN** SHALL group buttons horizontally with consistent spacing
- **AND** SHALL provide gap for spacing between buttons
- **AND** SHALL support attached variant for connected button borders
- **AND** SHALL maintain role="group" for accessibility

#### Scenario: Icon group pattern
- **WHEN** used for icon collections
- **THEN** SHALL group icons horizontally with consistent spacing
- **AND** SHALL support tight spacing via small gap values
- **AND** SHALL align icons center by default
- **AND** SHALL enable easy icon toolbar layouts

#### Scenario: Tag group pattern
- **WHEN** used for tag collections
- **THEN** SHALL group tags horizontally with wrap support
- **AND** SHALL provide consistent spacing between tags
- **AND** SHALL support wrapping to multiple lines
- **AND** SHALL maintain semantic grouping for screen readers

#### Scenario: Toolbar pattern
- **WHEN** used for toolbars
- **THEN** SHALL group toolbar items horizontally
- **AND** SHALL support space-between for pushing items to edges
- **AND** SHALL provide consistent spacing and alignment
- **AND** SHALL support responsive wrap on small screens

### Requirement: Responsive Direction Control
The component SHALL support responsive direction changes via flexDirection prop.

#### Scenario: Horizontal grouping (default)
- **WHEN** flexDirection="row" is set or not specified
- **THEN** SHALL lay out children horizontally left-to-right
- **AND** SHALL use horizontal axis as main axis
- **AND** SHALL use vertical axis as cross axis
- **AND** SHALL be default behavior for Group

#### Scenario: Vertical grouping
- **WHEN** flexDirection="column" is set
- **THEN** SHALL lay out children vertically top-to-bottom
- **AND** SHALL use vertical axis as main axis
- **AND** SHALL use horizontal axis as cross axis

#### Scenario: Responsive direction
- **WHEN** flexDirection uses responsive values
- **THEN** SHALL support responsive arrays: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL support responsive objects: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL enable common pattern of column-to-row transition (e.g., flexDirection={["column", , "row"]})

### Requirement: Ref Forwarding
The component SHALL forward refs to the underlying DOM element per nimbus-core standards.

#### Scenario: Ref access
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to root element
- **AND** SHALL provide access to underlying React Aria Group element
- **AND** SHALL support React.Ref type
- **AND** SHALL allow DOM manipulation and measurements

### Requirement: Children Composition
The component SHALL accept and render any React node as children.

#### Scenario: React elements
- **WHEN** children contains React elements
- **THEN** SHALL render all child elements as group items
- **AND** SHALL maintain element tree hierarchy
- **AND** SHALL apply spacing between all direct children
- **AND** SHALL support nested components

#### Scenario: Multiple children
- **WHEN** children contains multiple nodes
- **THEN** SHALL render all children as group items
- **AND** SHALL apply consistent gap between items
- **AND** SHALL respect flex properties on children
- **AND** SHALL maintain semantic grouping

#### Scenario: Single child
- **WHEN** children contains single element
- **THEN** SHALL render as group container with single item
- **AND** SHALL still apply flex properties (alignment)
- **AND** SHALL maintain role="group" for consistency

#### Scenario: No children
- **WHEN** children is not provided
- **THEN** SHALL render empty group container
- **AND** SHALL maintain element in DOM
- **AND** SHALL apply sizing and spacing styles

### Requirement: All Chakra Style Props Supported
The component SHALL inherit all Chakra UI style props per nimbus-core standards.

#### Scenario: Style props support
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra UI style props per nimbus-core standards
- **AND** SHALL support spacing properties (margin, padding)
- **AND** SHALL support color properties (background, color, borderColor)
- **AND** SHALL support layout properties (width, height, minWidth, maxWidth)
- **AND** SHALL support border properties (border, borderRadius)
- **AND** SHALL support position properties (position, top, right, bottom, left)
- **AND** SHALL support shadow properties (shadow, boxShadow)

#### Scenario: Pseudo selectors
- **WHEN** pseudo selector props are provided
- **THEN** SHALL accept: _hover, _focus, _active, _disabled, _focusVisible, _before, _after
- **AND** SHALL apply styles on corresponding pseudo states
- **AND** SHALL support nested style objects

#### Scenario: Responsive style props
- **WHEN** style props use responsive values
- **THEN** SHALL support responsive arrays: [base, sm, md, lg, xl, 2xl]
- **AND** SHALL support responsive objects: { base, sm, md, lg, xl, 2xl }
- **AND** SHALL apply breakpoint-specific values

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
- **WHEN** Group is imported in TypeScript
- **THEN** SHALL export GroupProps type
- **AND** SHALL extend GroupRootSlotProps (HTMLChakraProps<"div", GroupRecipeProps>)
- **AND** SHALL include isDisabled?: boolean (from React Aria)
- **AND** SHALL include isInvalid?: boolean (from React Aria)
- **AND** SHALL include onHoverChange?: (isHovering: boolean) => void (from React Aria)
- **AND** SHALL include onHoverStart?: (e: HoverEvent) => void (from React Aria)
- **AND** SHALL include onHoverEnd?: (e: HoverEvent) => void (from React Aria)
- **AND** SHALL include ref?: Ref<typeof RaGroup>
- **AND** SHALL include children?: React.ReactNode
- **AND** SHALL provide JSDoc documentation

#### Scenario: Recipe props type
- **WHEN** recipe variants are defined
- **THEN** SHALL export GroupRecipeProps type
- **AND** SHALL be generated from RecipeProps<"group"> & UnstyledProp
- **AND** SHALL provide autocomplete for variant values if defined
- **AND** SHALL type-check recipe props

#### Scenario: Slot props type
- **WHEN** slot component is used
- **THEN** SHALL export GroupRootSlotProps type
- **AND** SHALL extend HTMLChakraProps<"div", GroupRecipeProps>
- **AND** SHALL provide autocomplete for all Chakra style props
- **AND** SHALL type-check prop values

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
- **AND** SHALL describe the purpose or content of the group

#### Scenario: ARIA role override
- **WHEN** role attribute is provided
- **THEN** SHALL accept any valid ARIA role to override default "group"
- **AND** SHALL support roles like: radiogroup, listbox, toolbar, menu
- **AND** SHALL maintain accessibility contract

#### Scenario: ARIA states
- **WHEN** ARIA state attributes are provided
- **THEN** SHALL accept: aria-hidden, aria-expanded, aria-disabled, aria-invalid
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

#### Scenario: React Aria hover events
- **WHEN** React Aria hover handlers are provided
- **THEN** SHALL accept: onHoverChange, onHoverStart, onHoverEnd
- **AND** SHALL call handlers on hover state changes
- **AND** SHALL provide isHovering state to onHoverChange
- **AND** SHALL provide HoverEvent object to start/end handlers

### Requirement: CSS Class Support
The component SHALL accept className and class attributes.

#### Scenario: Custom classes
- **WHEN** className prop is provided
- **THEN** SHALL apply custom CSS classes to root element
- **AND** SHALL merge with Chakra-generated classes
- **AND** SHALL include "nimbus-group" recipe className
- **AND** SHALL support multiple class names

#### Scenario: Class priority
- **WHEN** both className and style props are provided
- **THEN** style props SHALL take precedence
- **AND** className styles SHALL be base layer
- **AND** SHALL follow CSS specificity rules

### Requirement: Display Name
The component SHALL provide display name for debugging per nimbus-core standards.

#### Scenario: React DevTools identification
- **WHEN** Group is inspected in React DevTools
- **THEN** displayName SHALL be "Group" (or inferred from function name)
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging and development

### Requirement: Foundation Primitive Role
The component SHALL serve as foundational building block for semantic grouping layouts.

#### Scenario: Semantic grouping primitive
- **WHEN** building layouts requiring semantic grouping
- **THEN** Group SHALL be preferred for related element collections
- **AND** SHALL provide role="group" for accessibility
- **AND** SHALL enable rapid prototyping with gap and alignment
- **AND** SHALL default to horizontal layout (unlike Stack's vertical default)

#### Scenario: Relationship with Stack and Flex
- **WHEN** choosing between Group, Stack, and Flex
- **THEN** Group SHALL be used for horizontal groups needing semantic grouping (role="group")
- **AND** Stack SHALL be used for simple vertical/horizontal stacking without semantic grouping
- **AND** Flex SHALL be used for complex alignment and flexible sizing without semantic grouping
- **AND** Group SHALL provide semantic benefits beyond Stack's layout focus

#### Scenario: Button group pattern
- **WHEN** grouping related buttons
- **THEN** Group SHALL be preferred over Stack or Flex
- **AND** SHALL provide semantic context to assistive technologies
- **AND** SHALL support attached variant for connected buttons
- **AND** SHALL communicate that buttons are related actions

### Requirement: Performance Characteristics
The component SHALL maintain minimal performance overhead.

#### Scenario: Lightweight wrapper
- **WHEN** Group renders
- **THEN** SHALL have minimal JavaScript overhead
- **AND** SHALL be simple wrapper around React Aria Group with Chakra styling
- **AND** SHALL not add complex logic or state beyond styling

#### Scenario: Style prop compilation
- **WHEN** style props are applied
- **THEN** SHALL use Chakra's optimized styling engine
- **AND** SHALL generate minimal CSS
- **AND** SHALL support tree-shaking of unused props

#### Scenario: Recipe compilation
- **WHEN** recipe is applied
- **THEN** SHALL use Chakra's recipe system for efficient styling
- **AND** SHALL generate optimized CSS classes
- **AND** SHALL cache compiled styles

### Requirement: Theme Integration
The component SHALL integrate with Chakra theme configuration.

#### Scenario: Theme token access
- **WHEN** Group uses style props with token values
- **THEN** SHALL resolve tokens from Nimbus theme
- **AND** SHALL use configured breakpoints
- **AND** SHALL use configured color palettes
- **AND** SHALL use configured spacing scale (100-600)

#### Scenario: CSS variable support
- **WHEN** Group uses design tokens
- **THEN** SHALL resolve to CSS custom properties
- **AND** SHALL support runtime theme switching
- **AND** SHALL work with light/dark mode

#### Scenario: Recipe registration
- **WHEN** Group component is used
- **THEN** recipe SHALL be registered in theme/recipes/index.ts
- **AND** registration SHALL be manual (CRITICAL: no auto-discovery)
- **AND** SHALL fail to style if recipe not registered

### Requirement: Documentation Support
The component SHALL include JSDoc comments per nimbus-core standards.

#### Scenario: Component JSDoc
- **WHEN** Group implementation is authored
- **THEN** SHALL include JSDoc block describing purpose
- **AND** SHALL document semantic grouping role
- **AND** SHALL include @supportsStyleProps tag
- **AND** SHALL link to documentation with @see tag
- **AND** SHALL provide usage examples where helpful

#### Scenario: Props JSDoc
- **WHEN** GroupProps interface is defined
- **THEN** SHALL document isDisabled prop
- **AND** SHALL document isInvalid prop
- **AND** SHALL document onHoverChange, onHoverStart, onHoverEnd props
- **AND** SHALL document ref prop
- **AND** SHALL document children prop
- **AND** SHALL reference GroupRootSlotProps for inherited style props documentation
