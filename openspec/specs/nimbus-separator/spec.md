# Specification: Separator Component

## Overview

The Separator component provides a visual or semantic divider that separates content sections within a layout. It supports horizontal and vertical orientations, customizable colors, and follows WCAG 2.1 AA accessibility guidelines using React Aria Components for semantic markup.

**Component:** `Separator`
**Package:** `@commercetools/nimbus`
**Type:** Single-slot component (Tier 1)
**React Aria:** Uses `Separator` from react-aria-components

## Purpose

Separator provides a visual divider to establish rhythm and hierarchy within layouts by grouping and dividing content. It enhances clarity by breaking up content sections while remaining subtle and non-intrusive. The component supports both decorative visual separation and semantic content division with appropriate accessibility attributes.

## Requirements

### Requirement: Orientation Support
The component SHALL support horizontal and vertical orientations.

#### Scenario: Horizontal orientation (default)
- **WHEN** orientation="horizontal" is set or not specified
- **THEN** SHALL render as horizontal line spanning width
- **AND** SHALL have width of 100% (full container width)
- **AND** SHALL have height of 25 (design token)
- **AND** SHALL NOT set aria-orientation attribute (horizontal is default)
- **AND** SHALL apply role="separator" for semantic separation

#### Scenario: Vertical orientation
- **WHEN** orientation="vertical" is set
- **THEN** SHALL render as vertical line spanning height
- **AND** SHALL have width of 25 (design token)
- **AND** SHALL have height of 100% (full container height)
- **AND** SHALL set aria-orientation="vertical" for assistive technology
- **AND** SHALL apply role="separator" for semantic separation

#### Scenario: Responsive orientation
- **WHEN** orientation is set with responsive values
- **THEN** SHALL accept responsive arrays: `["horizontal", "vertical"]`
- **AND** SHALL accept responsive objects: `{ base: "horizontal", md: "vertical" }`
- **AND** SHALL apply orientation at corresponding breakpoints

### Requirement: Color Customization
The component SHALL support color palette customization via design tokens.

#### Scenario: Default color
- **WHEN** colorPalette prop is not provided
- **THEN** SHALL use neutral color palette as default
- **AND** SHALL apply backgroundColor from colorPalette.6
- **AND** SHALL maintain subtle appearance suitable for content separation

#### Scenario: Semantic color palettes
- **WHEN** colorPalette prop is set to semantic value
- **THEN** SHALL accept: primary, neutral, info, positive, warning, critical
- **AND** SHALL use colorPalette.6 for backgroundColor
- **AND** SHALL support light and dark modes via semantic tokens
- **AND** SHALL maintain appropriate visual contrast (3:1 minimum per WCAG 2.1 1.4.11)

#### Scenario: System color palettes
- **WHEN** colorPalette prop is set to system color
- **THEN** SHALL accept all Radix color scales (slate, teal, pink, mint, etc.)
- **AND** SHALL apply same color formula (colorPalette.6)
- **AND** SHALL maintain consistent visual weight across colors

#### Scenario: Responsive color palette
- **WHEN** colorPalette is set with responsive values
- **THEN** SHALL support responsive arrays and objects
- **AND** SHALL apply colors at corresponding breakpoints
- **AND** SHALL use design token resolution

### Requirement: Visual Appearance
The component SHALL render as a subtle visual divider.

#### Scenario: Default styling
- **WHEN** separator renders
- **THEN** SHALL have border set to "0" (no border)
- **AND** SHALL use backgroundColor for visual line
- **AND** SHALL set flexShrink to "0" (prevent shrinking in flex containers)
- **AND** SHALL maintain consistent thickness across all use cases

#### Scenario: Minimal visual weight
- **WHEN** separator appears in layout
- **THEN** SHALL be noticeable but not visually jarring
- **AND** SHALL use subtle color from token scale 6
- **AND** SHALL not compete with primary content
- **AND** SHALL enhance content organization without visual noise

### Requirement: Layout Integration
The component SHALL integrate seamlessly in flex and grid layouts.

#### Scenario: Horizontal separator in vertical stack
- **WHEN** horizontal separator is used in vertical flex container
- **THEN** SHALL span full width of container
- **AND** SHALL maintain consistent height (25)
- **AND** SHALL not shrink due to flexShrink: 0
- **AND** SHALL separate content above and below

#### Scenario: Vertical separator in horizontal stack
- **WHEN** vertical separator is used in horizontal flex container
- **THEN** SHALL span full height of container
- **AND** SHALL maintain consistent width (25)
- **AND** SHALL not shrink due to flexShrink: 0
- **AND** SHALL separate content left and right

#### Scenario: Grid layout integration
- **WHEN** separator is used in grid layout
- **THEN** SHALL respect grid cell boundaries
- **AND** SHALL maintain orientation-specific dimensions
- **AND** SHALL work with grid gap and spacing

### Requirement: Accessibility Semantics
The component SHALL provide appropriate ARIA attributes per nimbus-core standards.

#### Scenario: Separator role
- **WHEN** separator renders
- **THEN** SHALL apply role="separator" via React Aria
- **AND** SHALL be recognized as divider by assistive technology
- **AND** SHALL be non-focusable (decorative separator)
- **AND** SHALL NOT have tabindex attribute

#### Scenario: Orientation announcement
- **WHEN** separator is horizontal
- **THEN** SHALL NOT set aria-orientation (horizontal is implicit default)
- **AND** SHALL be announced as separator by screen readers

#### Scenario: Vertical orientation announcement
- **WHEN** separator is vertical
- **THEN** SHALL set aria-orientation="vertical"
- **AND** SHALL announce vertical orientation to assistive technology
- **AND** SHALL help users understand layout structure

#### Scenario: Decorative vs semantic
- **WHEN** separator is purely decorative
- **THEN** role="separator" SHALL be appropriate for non-focusable divider
- **AND** SHALL not interfere with content navigation
- **WHEN** separator has semantic meaning
- **THEN** SHALL provide context through surrounding content
- **AND** SHALL enhance document structure understanding

### Requirement: React Aria Integration
The component SHALL use React Aria Components for accessibility per nimbus-core standards.

#### Scenario: React Aria Separator usage
- **WHEN** component implements separator functionality
- **THEN** SHALL use Separator from react-aria-components
- **AND** SHALL wrap with Chakra's withContext for styling
- **AND** SHALL follow multi-layered architecture: RAC → Chakra → Nimbus
- **AND** SHALL forward orientation prop to React Aria Separator

#### Scenario: Accessibility attributes
- **WHEN** React Aria Separator renders
- **THEN** SHALL automatically apply role="separator"
- **AND** SHALL manage aria-orientation based on orientation prop
- **AND** SHALL provide consistent ARIA patterns across browsers

### Requirement: Ref Forwarding
The component SHALL forward refs to the underlying DOM element per nimbus-core standards.

#### Scenario: Ref access
- **WHEN** ref prop is provided
- **THEN** SHALL forward ref to root element (React Aria Separator)
- **AND** SHALL provide access to HTMLDivElement
- **AND** SHALL support React.Ref<HTMLDivElement> type
- **AND** SHALL allow DOM manipulation and measurements

### Requirement: Recipe-Based Styling
The component SHALL use Chakra UI single-slot recipe per nimbus-core standards.

#### Scenario: Recipe application
- **WHEN** component renders
- **THEN** SHALL apply separator recipe from theme/recipes/separator.ts
- **AND** recipe SHALL be registered in theme configuration
- **AND** SHALL support recipe props: orientation
- **AND** SHALL use createRecipeContext for Chakra integration

#### Scenario: Base styles
- **WHEN** recipe applies
- **THEN** SHALL set border: "0"
- **AND** SHALL set flexShrink: "0"
- **AND** SHALL set colorPalette: "neutral" as default
- **AND** SHALL set backgroundColor: "colorPalette.6"
- **AND** SHALL use design tokens for all values

#### Scenario: Orientation variants
- **WHEN** recipe applies orientation variant
- **THEN** horizontal variant SHALL set width: "100%", height: "25"
- **AND** vertical variant SHALL set width: "25", height: "100%"
- **AND** SHALL use design token 25 for thickness (0.0625rem)
- **AND** default variant SHALL be "horizontal"

### Requirement: Custom Styling
The component SHALL accept Chakra style props.

#### Scenario: Style prop override
- **WHEN** style props are provided
- **THEN** SHALL accept all Chakra style props (margin, padding, width, height, backgroundColor, etc.)
- **AND** SHALL apply responsive style values
- **AND** custom styles SHALL override recipe defaults
- **AND** SHALL extract style props using extractStyleProps utility

#### Scenario: Spacing customization
- **WHEN** spacing props are provided
- **THEN** SHALL accept margin props: m, mt, mr, mb, ml, mx, my
- **AND** SHALL use design token values for consistent spacing
- **AND** SHALL support responsive spacing values
- **AND** SHALL allow custom margins around separator

#### Scenario: Size customization
- **WHEN** size props are provided
- **THEN** SHALL accept width and height overrides
- **AND** SHALL allow custom thickness via width (vertical) or height (horizontal)
- **AND** SHALL maintain orientation-specific dimension behavior
- **AND** SHALL support responsive size values

### Requirement: AsChild Pattern Support
The component SHALL support Chakra's asChild pattern for composition.

#### Scenario: AsChild composition
- **WHEN** asChild={true} is set
- **THEN** SHALL apply Separator styles to direct child element
- **AND** SHALL preserve child element's functionality and semantics
- **AND** SHALL merge separator props with child props
- **AND** SHALL support any valid React element as child

### Requirement: Type Safety
The component SHALL provide comprehensive TypeScript types per nimbus-core standards.

#### Scenario: Props interface
- **WHEN** component is imported
- **THEN** SHALL export SeparatorProps interface
- **AND** SHALL include JSDoc comments for all props
- **AND** SHALL extend OmitInternalProps<SeparatorRootSlotProps>
- **AND** SHALL support ref type React.Ref<HTMLDivElement>
- **AND** SHALL support data attributes via `[key: data-${string}]: unknown`

#### Scenario: Recipe props
- **WHEN** component uses recipe
- **THEN** SHALL export SeparatorRecipeProps type
- **AND** SHALL include orientation variant autocomplete
- **AND** SHALL support unstyledProp for disabling recipe styles

#### Scenario: Slot props
- **WHEN** component defines slots
- **THEN** SHALL export SeparatorRootSlotProps type
- **AND** SHALL extend HTMLChakraProps<"div", SeparatorRecipeProps>
- **AND** SHALL provide type safety for slot components

### Requirement: Slot Component Architecture
The component SHALL use single-slot architecture per nimbus-core standards.

#### Scenario: Slot component definition
- **WHEN** component uses Chakra styling
- **THEN** SHALL define SeparatorRoot slot in separator.slots.tsx
- **AND** SHALL use createRecipeContext with key: "separator"
- **AND** SHALL type slot as SlotComponent<HTMLDivElement, SeparatorRootSlotProps>
- **AND** SHALL create slot with withContext<HTMLDivElement, SeparatorRootSlotProps>("div")

#### Scenario: Slot component usage
- **WHEN** main component renders
- **THEN** SHALL use SeparatorRoot as wrapper for React Aria Separator
- **AND** SHALL pass asChild={true} to merge with React Aria element
- **AND** SHALL apply recipe props to SeparatorRoot
- **AND** SHALL apply style props to SeparatorRoot

### Requirement: Prop Handling Pattern
The component SHALL follow sequential prop extraction per nimbus-core standards.

#### Scenario: Recipe variant splitting
- **WHEN** component receives props
- **THEN** SHALL use useRecipe hook with separatorRecipe
- **AND** SHALL call recipe.splitVariantProps to extract recipe props
- **AND** SHALL separate orientation into recipeProps
- **AND** SHALL pass remaining props to variantFreeProps

#### Scenario: Style prop extraction
- **WHEN** component processes variantFreeProps
- **THEN** SHALL call extractStyleProps utility
- **AND** SHALL separate Chakra style props into styleProps
- **AND** SHALL separate functional props into functionalProps
- **AND** SHALL maintain prop type safety throughout

#### Scenario: Prop forwarding
- **WHEN** component renders elements
- **THEN** SHALL forward recipeProps to SeparatorRoot for styling
- **AND** SHALL forward styleProps to SeparatorRoot for custom styles
- **AND** SHALL forward functionalProps to React Aria Separator
- **AND** SHALL forward ref to React Aria Separator

### Requirement: Testing and Metadata Support
The component SHALL accept data attributes.

#### Scenario: Data attributes
- **WHEN** data-* attributes are provided
- **THEN** SHALL forward all data attributes to root element
- **AND** SHALL support testing attributes (data-testid)
- **AND** SHALL support custom metadata attributes
- **AND** SHALL be queryable in tests via data-testid

### Requirement: Display Name
The component SHALL provide display name for debugging per nimbus-core standards.

#### Scenario: React DevTools identification
- **WHEN** Separator is inspected in React DevTools
- **THEN** displayName SHALL be "Separator"
- **AND** SHALL appear in component tree
- **AND** SHALL aid debugging and development

### Requirement: Theme Registration
The component recipe SHALL be registered in theme configuration per nimbus-core standards.

#### Scenario: Recipe registration
- **WHEN** component is added to package
- **THEN** recipe SHALL be manually registered in theme/recipes/index.ts
- **AND** SHALL be imported: `import { separatorRecipe } from "@/components/separator/separator.recipe"`
- **AND** SHALL be included in recipes object export: `separator: separatorRecipe`
- **AND** CRITICAL: registration SHALL not be automatic (no auto-discovery)

### Requirement: Visual Contrast
The component SHALL meet non-text contrast requirements per WCAG 2.1.

#### Scenario: Visual contrast accessibility
- **WHEN** separator renders with any color palette
- **THEN** SHALL maintain 3:1 contrast ratio against background (WCAG 2.1 1.4.11)
- **AND** SHALL use colorPalette.6 for sufficient contrast
- **AND** SHALL be perceivable by users with low vision
- **AND** SHALL meet contrast requirements in both light and dark modes

### Requirement: Barrel Export
The component SHALL be exported from package index per nimbus-core standards.

#### Scenario: Public API export
- **WHEN** component is added to package
- **THEN** SHALL export Separator from component index.ts
- **AND** SHALL re-export from packages/nimbus/src/index.ts
- **AND** SHALL be importable as: `import { Separator } from '@commercetools/nimbus'`
- **AND** SHALL export SeparatorProps type for TypeScript users

### Requirement: Documentation Support
The component SHALL include comprehensive documentation per nimbus-core standards.

#### Scenario: JSDoc comments
- **WHEN** component implementation is authored
- **THEN** SHALL include JSDoc block describing purpose and features
- **AND** SHALL document key capabilities (ref forwarding, HTML attributes, variants, style props, asChild, React Aria)
- **AND** SHALL provide clear description: "A visual separator that divides content sections"

#### Scenario: MDX documentation
- **WHEN** component is created
- **THEN** SHALL have separator.mdx for user-facing documentation
- **AND** SHALL include frontmatter with menu, title, description
- **AND** SHALL include usage examples with jsx-live code blocks
- **AND** SHALL document orientation options, color customization, best practices
- **AND** SHALL include accessibility standards section
- **AND** SHALL reference Figma design library

#### Scenario: Storybook stories
- **WHEN** component is created
- **THEN** SHALL have separator.stories.tsx file
- **AND** stories SHALL serve as visual documentation and tests
- **AND** SHALL include Base, Horizontal, Vertical, Orientations, MultipleBackgrounds stories
- **AND** SHALL include play functions testing accessibility attributes
- **AND** SHALL verify role="separator", aria-orientation, and non-focusable behavior
