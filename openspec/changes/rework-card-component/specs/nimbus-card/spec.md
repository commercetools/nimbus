# Spec Delta: nimbus-card

## MODIFIED Requirements

### Requirement: Namespace Structure

The component SHALL export as compound component namespace.

#### Scenario: Component parts

- **WHEN** Card is imported
- **THEN** SHALL provide Card.Root as card container
- **AND** SHALL provide Card.Header for title section
- **AND** SHALL provide Card.Body for main content area
- **AND** SHALL provide Card.Footer for actions/metadata section
- **AND** Root SHALL be first property in namespace

#### Scenario: Flexible composition

- **WHEN** consumer uses Card components
- **THEN** SHALL allow Card.Root without compound parts (free-form content)
- **AND** SHALL allow Card.Root with any single part (Header, Body, or Footer)
- **AND** SHALL allow any combination of Header, Body, and Footer
- **AND** SHALL render parts in DOM order as placed by consumer
- **AND** SHALL apply correct edge padding via CSS regardless of which parts are
  present

### Requirement: Container Component

The component SHALL provide root container with styling configuration.

#### Scenario: Root rendering

- **WHEN** Card.Root renders
- **THEN** SHALL render as div element
- **AND** SHALL accept all Chakra style props
- **AND** SHALL apply recipe variants
- **AND** SHALL NOT use React context for child layout coordination

#### Scenario: Layout behavior

- **WHEN** Card.Root renders with child parts
- **THEN** SHALL use CSS flexbox column layout
- **AND** SHALL apply gap between children that scales with size variant
- **AND** gap SHALL be 100 token for sm, 200 token for md, 400 token for lg
- **AND** SHALL NOT wrap children in an intermediate Stack component

#### Scenario: Style prop forwarding

- **WHEN** style props are provided on Root
- **THEN** SHALL extract and apply style props to root element
- **AND** SHALL separate recipe props from style props
- **AND** SHALL apply recipe variants first, then style overrides

### Requirement: Title Section

The component SHALL provide header section for titles and metadata.

#### Scenario: Header rendering

- **WHEN** Card.Header renders
- **THEN** SHALL render as div element via header slot component
- **AND** SHALL accept all Chakra style props
- **AND** SHALL render content as provided
- **AND** SHALL forward ref to div element

#### Scenario: Header padding

- **WHEN** Card.Header is the first child of Card.Root
- **THEN** SHALL receive top padding via CSS `:first-child` selector
- **AND** SHALL always receive horizontal padding from the size variant
- **AND** SHALL NOT receive bottom padding (gap handles spacing between parts)

### Requirement: Main Content Area

The component SHALL provide primary content container named Body.

#### Scenario: Body rendering

- **WHEN** Card.Body renders
- **THEN** SHALL render as div element via body slot component
- **AND** SHALL accept all Chakra style props
- **AND** SHALL support any content type
- **AND** SHALL forward ref to div element

#### Scenario: Body padding

- **WHEN** Card.Body renders
- **THEN** SHALL receive horizontal padding from the size variant
- **AND** SHALL receive top padding via `:first-child` if it is the first child
- **AND** SHALL receive bottom padding via `:last-child` if it is the last child

### Requirement: Footer Section

The component SHALL provide footer section for actions and metadata.

#### Scenario: Footer rendering

- **WHEN** Card.Footer renders
- **THEN** SHALL render as div element via footer slot component
- **AND** SHALL accept all Chakra style props
- **AND** SHALL render content as provided
- **AND** SHALL forward ref to div element

#### Scenario: Footer padding

- **WHEN** Card.Footer is the last child of Card.Root
- **THEN** SHALL receive bottom padding via CSS `:last-child` selector
- **AND** SHALL always receive horizontal padding from the size variant
- **AND** SHALL NOT receive top padding (gap handles spacing between parts)

### Requirement: Size Options

The component SHALL support size variants controlling padding and gap per
nimbus-core standards.

#### Scenario: Small size

- **WHEN** size="sm" is set on Root
- **THEN** SHALL apply 200 token as horizontal padding on all slots
- **AND** SHALL apply 200 token as top padding on first child
- **AND** SHALL apply 200 token as bottom padding on last child
- **AND** SHALL apply 100 token as gap between children

#### Scenario: Medium size

- **WHEN** size="md" is set or no value provided (default)
- **THEN** SHALL apply 400 token as horizontal padding on all slots
- **AND** SHALL apply 400 token as top padding on first child
- **AND** SHALL apply 400 token as bottom padding on last child
- **AND** SHALL apply 200 token as gap between children

#### Scenario: Large size

- **WHEN** size="lg" is set on Root
- **THEN** SHALL apply 600 token as horizontal padding on all slots
- **AND** SHALL apply 600 token as top padding on first child
- **AND** SHALL apply 600 token as bottom padding on last child
- **AND** SHALL apply 400 token as gap between children

### Requirement: Visual Variant Options

The component SHALL support variant prop for visual treatment per nimbus-core
standards.

#### Scenario: Outlined variant

- **WHEN** variant="outlined" is set or no value provided (default)
- **THEN** SHALL render with solid-25 border using colorPalette.3
- **AND** SHALL use default background (bg token)
- **AND** SHALL have no shadow

#### Scenario: Elevated variant

- **WHEN** variant="elevated" is set
- **THEN** SHALL render without border
- **AND** SHALL apply shadow token level 1
- **AND** SHALL use default background (bg token)

#### Scenario: Filled variant

- **WHEN** variant="filled" is set
- **THEN** SHALL render without border
- **AND** SHALL have no shadow
- **AND** SHALL use colorPalette.2 muted background

#### Scenario: Plain variant

- **WHEN** variant="plain" is set
- **THEN** SHALL render without border
- **AND** SHALL have no shadow
- **AND** SHALL use default background (bg token)

### Requirement: Layout Display

The component SHALL control layout display characteristics.

#### Scenario: Display mode

- **WHEN** Card.Root renders
- **THEN** SHALL use display: flex
- **AND** SHALL use flexDirection: column
- **AND** SHALL allow width override via style props
- **AND** SHALL align items flex-start for vertical layout

### Requirement: Multi-Slot Recipe

The component SHALL use multi-slot recipe per nimbus-core standards.

#### Scenario: Slot styling

- **WHEN** card renders
- **THEN** SHALL apply card slot recipe from theme/slot-recipes
- **AND** SHALL style: root, header, body, footer slots
- **AND** SHALL support size variants: sm, md, lg
- **AND** SHALL support variant options: outlined, elevated, filled, plain

#### Scenario: Recipe registration

- **WHEN** Card component is used
- **THEN** cardRecipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL use "nimbusCard" key
- **AND** registration SHALL be manual (no auto-discovery)

### Requirement: Type Definitions

The component SHALL provide comprehensive TypeScript types per nimbus-core
standards.

#### Scenario: Recipe props type

- **WHEN** CardRecipeProps type is defined
- **THEN** SHALL include size?: "sm" | "md" | "lg"
- **AND** SHALL include variant?: "outlined" | "elevated" | "filled" | "plain"
- **AND** SHALL extend UnstyledProp

#### Scenario: Slot props types

- **WHEN** slot props types are defined
- **THEN** SHALL export CardRootSlotProps extending HTMLChakraProps<"div",
  CardRecipeProps>
- **AND** SHALL export CardHeaderSlotProps extending HTMLChakraProps<"div">
- **AND** SHALL export CardBodySlotProps extending HTMLChakraProps<"div">
- **AND** SHALL export CardFooterSlotProps extending HTMLChakraProps<"div">

#### Scenario: Main props types

- **WHEN** main component props types are defined
- **THEN** SHALL export CardProps with children, ref, data-\* attributes
- **AND** SHALL export CardHeaderProps with children and ref
- **AND** SHALL export CardBodyProps with children and ref
- **AND** SHALL export CardFooterProps with children and ref
- **AND** SHALL omit internal props using OmitInternalProps utility
- **AND** all props SHALL have JSDoc documentation

### Requirement: Debug Identification

The component SHALL provide display names for debugging per nimbus-core
standards.

#### Scenario: Display name setting

- **WHEN** Card components are defined
- **THEN** Card.Root SHALL set displayName="Card.Root"
- **AND** Card.Header SHALL set displayName="Card.Header"
- **AND** Card.Body SHALL set displayName="Card.Body"
- **AND** Card.Footer SHALL set displayName="Card.Footer"
- **AND** names SHALL appear in React DevTools

### Requirement: Content Flexibility

The component SHALL support flexible content composition.

#### Scenario: Free-form content

- **WHEN** Card.Root contains non-compound children
- **THEN** SHALL render children directly
- **AND** SHALL not require Header, Body, or Footer components
- **AND** SHALL maintain styling from variants
- **AND** SHALL allow complete layout freedom

#### Scenario: Mixed content

- **WHEN** Card.Root contains both compound parts and other elements
- **THEN** SHALL render all children in DOM order
- **AND** SHALL apply slot styling to compound parts
- **AND** SHALL maintain proper spacing via gap

## REMOVED Requirements

### Requirement: Rendering Optimization

_Removed: The context-based registration pattern (useMemo for context value,
useEffect for registration) is being removed entirely. There is no context to
optimize. Standard React rendering applies._

### Requirement: Main Content Area (original Content-based)

_Removed: Replaced by the Body-based Main Content Area requirement above.
Card.Content is renamed to Card.Body._

### Requirement: Card Padding Options

_Removed: Replaced by the Size Options requirement. `cardPadding` prop is
renamed to `size` to align with Nimbus conventions._

### Requirement: Border Styling Options

_Removed: Collapsed into the Visual Variant Options requirement. `borderStyle`
prop is replaced by `variant`._

### Requirement: Shadow Options

_Removed: Collapsed into the Visual Variant Options requirement. `elevation`
prop is replaced by `variant`._

### Requirement: Background Styling Options

_Removed: Collapsed into the Visual Variant Options requirement.
`backgroundStyle` prop is replaced by `variant`._

### Requirement: Variant Composition

_Removed: The four independent variant props are collapsed into two standard
props (`variant` and `size`). The combinatorial explosion is replaced by curated
presets._
