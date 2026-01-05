# Specification: Card Component

## Overview

The Card component provides a versatile container for grouping related content and actions in a visually distinct way. It follows a compound component architecture for flexible composition and supports multiple visual variants for different use cases.

**Component:** `Card` (compound namespace)
**Package:** `@commercetools/nimbus`
**Type:** Compound component (multi-slot recipe)
**React Aria:** None (presentational component)
**i18n:** None

## Purpose

Cards serve as self-contained containers that group related information and actions, making content easier to scan and interact with. They provide visual hierarchy and organization for complex layouts through consistent styling, padding, borders, and elevation options.

## Requirements

### Requirement: Namespace Structure
The component SHALL export as compound component namespace.

#### Scenario: Component parts
- **WHEN** Card is imported
- **THEN** SHALL provide Card.Root as card container
- **AND** SHALL provide Card.Header for title section
- **AND** SHALL provide Card.Content for main content area
- **AND** Root SHALL be first property in namespace

#### Scenario: Flexible composition
- **WHEN** consumer uses Card components
- **THEN** SHALL allow Card.Root without compound parts (free-form content)
- **AND** SHALL allow Card.Root with only Card.Header
- **AND** SHALL allow Card.Root with only Card.Content
- **AND** SHALL allow any combination of Header and Content
- **AND** SHALL maintain layout consistency via context


### Requirement: Container Component
The component SHALL provide root container with styling configuration.

#### Scenario: Root rendering
- **WHEN** Card.Root renders
- **THEN** SHALL render as div element
- **AND** SHALL accept all Chakra style props
- **AND** SHALL provide context for child components
- **AND** SHALL apply recipe variants

#### Scenario: Layout coordination
- **WHEN** Card.Header and Card.Content are used
- **THEN** SHALL enforce consistent vertical layout
- **AND** SHALL render Header above Content regardless of DOM order
- **AND** SHALL apply appropriate spacing between sections

#### Scenario: Style prop forwarding
- **WHEN** style props are provided on Root
- **THEN** SHALL extract and apply style props to root element
- **AND** SHALL separate recipe props from style props
- **AND** SHALL apply recipe variants first, then style overrides


### Requirement: Title Section
The component SHALL provide header section for titles and metadata.

#### Scenario: Header rendering
- **WHEN** Card.Header renders
- **THEN** SHALL render as div element within header slot
- **AND** SHALL register with parent context for layout coordination
- **AND** SHALL accept all Chakra style props
- **AND** SHALL render content as provided

#### Scenario: Header positioning
- **WHEN** Card.Header is included
- **THEN** SHALL appear at top of card
- **AND** SHALL maintain position even if Content is declared first in JSX
- **AND** SHALL apply slot-specific styling

#### Scenario: Header unmounting
- **WHEN** Card.Header unmounts
- **THEN** SHALL unregister from parent context
- **AND** SHALL remove header from layout


### Requirement: Main Content Area
The component SHALL provide primary content container.

#### Scenario: Content rendering
- **WHEN** Card.Content renders
- **THEN** SHALL render as div element within content slot
- **AND** SHALL register with parent context for layout coordination
- **AND** SHALL accept all Chakra style props
- **AND** SHALL support any content type

#### Scenario: Content positioning
- **WHEN** Card.Content is included
- **THEN** SHALL appear below Header if Header exists
- **AND** SHALL be first if Header is not present
- **AND** SHALL apply slot-specific styling

#### Scenario: Content unmounting
- **WHEN** Card.Content unmounts
- **THEN** SHALL unregister from parent context
- **AND** SHALL remove content from layout


### Requirement: Card Padding Options
The component SHALL support multiple padding size variants per nimbus-core standards.

#### Scenario: Small padding
- **WHEN** cardPadding="sm" is set on Root
- **THEN** SHALL apply small padding (200 token)
- **AND** SHALL create compact card appearance
- **AND** SHALL apply padding to root container

#### Scenario: Medium padding
- **WHEN** cardPadding="md" is set or no value provided (default)
- **THEN** SHALL apply medium padding (400 token)
- **AND** SHALL provide balanced spacing
- **AND** SHALL be suitable for most use cases

#### Scenario: Large padding
- **WHEN** cardPadding="lg" is set on Root
- **THEN** SHALL apply large padding (600 token)
- **AND** SHALL create spacious card appearance
- **AND** SHALL be suitable for prominent content


### Requirement: Border Styling Options
The component SHALL support border style variants.

#### Scenario: Outlined border
- **WHEN** borderStyle="outlined" is set or no value provided (default)
- **THEN** SHALL render with visible border
- **AND** SHALL use solid-25 border width
- **AND** SHALL use colorPalette.3 border color
- **AND** SHALL provide clear visual boundary

#### Scenario: No border
- **WHEN** borderStyle="none" is set
- **THEN** SHALL render without border
- **AND** SHALL rely on other visual cues (shadow, background)
- **AND** SHALL reduce visual weight


### Requirement: Shadow Options
The component SHALL support elevation shadow variants.

#### Scenario: No elevation
- **WHEN** elevation="none" is set or no value provided (default)
- **THEN** SHALL render without shadow
- **AND** SHALL appear flat on surface
- **AND** SHALL rely on border or background for distinction

#### Scenario: Elevated shadow
- **WHEN** elevation="elevated" is set
- **THEN** SHALL apply shadow token level 1
- **AND** SHALL create raised appearance
- **AND** SHALL suggest interactive or important content


### Requirement: Background Styling Options
The component SHALL support background style variants.

#### Scenario: Default background
- **WHEN** backgroundStyle="default" is set or no value provided (default)
- **THEN** SHALL use bg color token (white in light mode)
- **AND** SHALL provide clean, neutral surface
- **AND** SHALL work with all border and elevation options

#### Scenario: Muted background
- **WHEN** backgroundStyle="muted" is set
- **THEN** SHALL use colorPalette.2 for background
- **AND** SHALL provide subtle, recessed appearance
- **AND** SHALL reduce visual prominence


### Requirement: Rounded Corners
The component SHALL provide consistent border radius.

#### Scenario: Corner rounding
- **WHEN** Card.Root renders
- **THEN** SHALL apply 300 radius token
- **AND** SHALL create moderately rounded corners
- **AND** SHALL match design system standards


### Requirement: Theme Integration
The component SHALL support color palette system.

#### Scenario: Default palette
- **WHEN** no colorPalette prop is provided
- **THEN** SHALL use slate color palette
- **AND** SHALL apply to border and background colors
- **AND** SHALL integrate with theme color scales

#### Scenario: Custom palette
- **WHEN** colorPalette prop is provided on Root
- **THEN** SHALL apply specified color palette
- **AND** SHALL affect border and background colors via token references
- **AND** SHALL support all semantic and brand palettes


### Requirement: Interactive Card Variant
The component SHALL support entire card as clickable element.

#### Scenario: Clickable card rendering
- **WHEN** onClick prop is provided on Root
- **THEN** SHALL apply cursor pointer
- **AND** SHALL show hover state styling
- **AND** SHALL handle click events on entire card area
- **AND** SHALL maintain visual indication of interactivity

#### Scenario: Clickable keyboard interaction
- **WHEN** onClick is provided
- **THEN** Root SHALL be keyboard accessible
- **AND** SHALL respond to Enter key
- **AND** SHALL respond to Space key
- **AND** SHALL show focus visible ring

#### Scenario: Click event handling
- **WHEN** user clicks clickable card
- **THEN** SHALL call onClick handler
- **AND** SHALL prevent event bubbling if needed
- **AND** SHALL provide event object to handler


### Requirement: Focus Indication
The component SHALL provide visible focus indicators when interactive.

#### Scenario: Focus visible styling
- **WHEN** clickable card receives keyboard focus
- **THEN** SHALL show focus ring outside card
- **AND** SHALL use focusVisibleRing="outside" setting
- **AND** SHALL meet WCAG 2.1 AA contrast requirements
- **AND** SHALL only show ring for keyboard focus, not mouse clicks


### Requirement: Semantic Structure
The component SHALL provide appropriate semantic structure per nimbus-core standards.

#### Scenario: Container semantics
- **WHEN** Card.Root renders
- **THEN** SHALL render as div by default
- **AND** SHALL support role="article" via props for article-like content
- **AND** SHALL support role="region" via props with aria-label for landmark regions
- **AND** SHALL allow semantic element override via as prop

#### Scenario: Clickable accessibility
- **WHEN** card is clickable
- **THEN** SHALL be keyboard accessible via tabIndex
- **AND** SHALL support Enter and Space keys
- **AND** SHALL provide appropriate role or element type
- **AND** MAY suggest using Button or Link components instead for clearer semantics

#### Scenario: Content structure
- **WHEN** Card contains heading in Header
- **THEN** Header content SHOULD use appropriate heading level (h2, h3, etc.)
- **AND** heading SHALL establish card topic for screen readers
- **AND** SHALL maintain document outline hierarchy


### Requirement: Multi-Slot Recipe
The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling
- **WHEN** card renders
- **THEN** SHALL apply card slot recipe from theme/slot-recipes/card.ts
- **AND** SHALL style: root, header, content slots
- **AND** SHALL support cardPadding variants: sm, md, lg
- **AND** SHALL support borderStyle variants: none, outlined
- **AND** SHALL support elevation variants: none, elevated
- **AND** SHALL support backgroundStyle variants: default, muted

#### Scenario: Recipe registration
- **WHEN** Card component is used
- **THEN** cardRecipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL use "card" key
- **AND** registration SHALL be manual (no auto-discovery)


### Requirement: Layout Display
The component SHALL control layout display characteristics.

#### Scenario: Display mode
- **WHEN** Card.Root renders
- **THEN** SHALL use display: inline-flex
- **AND** SHALL allow natural sizing based on content
- **AND** SHALL allow width override via style props
- **AND** SHALL align items flex-start for vertical layout


### Requirement: Test and Integration Hooks
The component SHALL support data attributes.

#### Scenario: Custom data attributes
- **WHEN** data-* props are provided on Root
- **THEN** SHALL forward all data attributes to root element
- **AND** SHALL support data-testid for testing
- **AND** SHALL support any custom data-* attributes
- **AND** SHALL preserve attribute values


### Requirement: DOM Reference Access
The component SHALL forward refs to DOM elements per nimbus-core standards.

#### Scenario: Root ref
- **WHEN** ref prop is provided on Card.Root
- **THEN** SHALL forward ref to root div element
- **AND** SHALL provide access to HTMLDivElement
- **AND** SHALL support React.Ref<HTMLDivElement> type

#### Scenario: Slot refs
- **WHEN** ref prop is provided on Card.Header or Card.Content
- **THEN** SHALL forward ref to respective slot div element
- **AND** SHALL provide access to HTMLDivElement
- **AND** SHALL support same ref type as Root


### Requirement: Chakra Style Props
The component SHALL accept and apply Chakra style props per nimbus-core standards.

#### Scenario: Style prop override
- **WHEN** Chakra style props are provided on any Card part
- **THEN** SHALL accept width, height, margin, padding, etc.
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL use extractStyleProps utility for separation

#### Scenario: Responsive styles
- **WHEN** responsive style objects or arrays are provided
- **THEN** SHALL apply styles at appropriate breakpoints
- **AND** SHALL support base, sm, md, lg, xl, 2xl breakpoints
- **AND** SHALL use mobile-first responsive approach


### Requirement: Variant Composition
The component SHALL support all valid combinations of variants.

#### Scenario: Independent variants
- **WHEN** multiple variant props are set
- **THEN** SHALL apply all variants independently
- **AND** cardPadding SHALL not conflict with borderStyle
- **AND** elevation SHALL not conflict with backgroundStyle
- **AND** borderStyle SHALL not conflict with backgroundStyle
- **AND** all combinations SHALL produce valid visual output

#### Scenario: Default variant values
- **WHEN** no variant props are provided
- **THEN** SHALL apply cardPadding="md"
- **AND** SHALL apply borderStyle="outlined"
- **AND** SHALL apply elevation="none"
- **AND** SHALL apply backgroundStyle="default"


### Requirement: Type Definitions
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Recipe props type
- **WHEN** CardRecipeProps type is defined
- **THEN** SHALL include cardPadding?: "sm" | "md" | "lg"
- **AND** SHALL include borderStyle?: "none" | "outlined"
- **AND** SHALL include elevation?: "none" | "elevated"
- **AND** SHALL include backgroundStyle?: "default" | "muted"
- **AND** SHALL extend UnstyledProp

#### Scenario: Slot props types
- **WHEN** slot props types are defined
- **THEN** SHALL export CardRootSlotProps extending HTMLChakraProps<"div", CardRecipeProps>
- **AND** SHALL export CardHeaderSlotProps extending HTMLChakraProps<"div">
- **AND** SHALL export CardContentSlotProps extending HTMLChakraProps<"div">

#### Scenario: Main props types
- **WHEN** main component props types are defined
- **THEN** SHALL export CardProps with children, ref, data-* attributes
- **AND** SHALL export CardHeaderProps with children and ref
- **AND** SHALL export CardContentProps with children and ref
- **AND** SHALL omit internal props using OmitInternalProps utility
- **AND** all props SHALL have JSDoc documentation


### Requirement: Rendering Optimization
The component SHALL optimize rendering performance.

#### Scenario: Context optimization
- **WHEN** Card.Root provides context
- **THEN** SHALL memoize context value to prevent unnecessary re-renders
- **AND** SHALL only update context when necessary
- **AND** SHALL use useMemo for context value object

#### Scenario: Effect dependencies
- **WHEN** Header or Content register with context
- **THEN** SHALL include all dependencies in useEffect
- **AND** SHALL properly clean up on unmount
- **AND** SHALL avoid unnecessary effect runs


### Requirement: Debug Identification
The component SHALL provide display names for debugging per nimbus-core standards.

#### Scenario: Display name setting
- **WHEN** Card components are defined
- **THEN** Card.Root SHALL set displayName="Card.Root"
- **AND** Card.Header SHALL set displayName="Card.Header"
- **AND** Card.Content SHALL set displayName="Card.Content"
- **AND** names SHALL appear in React DevTools


### Requirement: Content Flexibility
The component SHALL support flexible content composition.

#### Scenario: Free-form content
- **WHEN** Card.Root contains non-compound children
- **THEN** SHALL render children directly
- **AND** SHALL not require Header or Content components
- **AND** SHALL maintain styling from variants
- **AND** SHALL allow complete layout freedom

#### Scenario: Mixed content
- **WHEN** Card.Root contains both compound parts and other elements
- **THEN** SHALL render Header and Content in coordinated layout
- **AND** SHALL render other children below coordinated layout
- **AND** SHALL maintain proper spacing
