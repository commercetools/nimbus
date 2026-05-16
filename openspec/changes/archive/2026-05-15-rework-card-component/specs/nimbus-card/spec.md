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
- **AND** SHALL use a unified `--card-spacing` CSS variable for all spacing
- **AND** spacing between adjacent slot children equals `--card-spacing` (via
  slot padding, not flexbox gap)
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

- **WHEN** Card.Header renders
- **THEN** SHALL receive full padding (`p: --card-spacing`) on all sides
- **AND** when followed directly by Body or Footer, the next slot suppresses its
  own top padding via adjacent sibling selectors

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
- **THEN** SHALL receive full padding (`p: --card-spacing`) on all sides
- **AND** SHALL suppress top padding when directly preceded by Card.Header
  (adjacent sibling selector)

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
- **AND** SHALL support variant options: plain, outlined, elevated,
  outlined-elevated, muted, outlined-muted, elevated-muted,
  outlined-elevated-muted

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
- **AND** SHALL include variant?: "plain" | "outlined" | "elevated" |
  "outlined-elevated" | "muted" | "outlined-muted" | "elevated-muted" |
  "outlined-elevated-muted"
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

## ADDED Requirements

### Requirement: Footer Section

The component SHALL provide footer section for actions and metadata.

#### Scenario: Footer rendering

- **WHEN** Card.Footer renders
- **THEN** SHALL render as div element via footer slot component
- **AND** SHALL accept all Chakra style props
- **AND** SHALL render content as provided
- **AND** SHALL forward ref to div element

#### Scenario: Footer padding

- **WHEN** Card.Footer renders
- **THEN** SHALL receive full padding (`p: --card-spacing`) on all sides
- **AND** SHALL suppress top padding when directly preceded by Card.Header or
  Card.Body (adjacent sibling selectors)
- **AND** when a non-slot element (e.g. Separator) sits between slots, both
  slots retain full padding for visually balanced spacing around the element

### Requirement: Size Options

The component SHALL support size variants controlling padding and gap per
nimbus-core standards.

#### Scenario: Small size

- **WHEN** size="sm" is set on Root
- **THEN** SHALL set `--card-spacing` to `spacing.300` token
- **AND** all slots SHALL use `--card-spacing` for padding on all sides
- **AND** adjacent slots SHALL collapse top padding on the later slot

#### Scenario: Medium size

- **WHEN** size="md" is set or no value provided (default)
- **THEN** SHALL set `--card-spacing` to `spacing.400` token
- **AND** all slots SHALL use `--card-spacing` for padding on all sides
- **AND** adjacent slots SHALL collapse top padding on the later slot

#### Scenario: Large size

- **WHEN** size="lg" is set on Root
- **THEN** SHALL set `--card-spacing` to `spacing.600` token
- **AND** all slots SHALL use `--card-spacing` for padding on all sides
- **AND** adjacent slots SHALL collapse top padding on the later slot

### Requirement: Visual Variant Options

The component SHALL support a `variant` prop that exposes every combination of
three independent visual axes — `outlined` (border yes/no), `elevated` (shadow
yes/no), and `muted` (background default/muted) — as eight enumerated kebab-case
values. Variant names list each axis that is on, joined with hyphens, in the
fixed order `outlined-elevated-muted`. Axes that are off are omitted from the
name. The all-off case is named `plain`.

#### Scenario: Plain variant

- **WHEN** variant="plain" is set
- **THEN** SHALL render without border
- **AND** SHALL have no shadow
- **AND** SHALL use default background (bg token)

#### Scenario: Outlined variant

- **WHEN** variant="outlined" is set or no value provided (default)
- **THEN** SHALL render with solid-25 border using colorPalette.6
- **AND** SHALL have no shadow
- **AND** SHALL use default background (bg token)

#### Scenario: Elevated variant

- **WHEN** variant="elevated" is set
- **THEN** SHALL render without border
- **AND** SHALL apply shadow token level 1
- **AND** SHALL use default background (bg token)

#### Scenario: Outlined + elevated variant

- **WHEN** variant="outlined-elevated" is set
- **THEN** SHALL render with solid-25 border using colorPalette.6
- **AND** SHALL apply shadow token level 1
- **AND** SHALL use default background (bg token)

#### Scenario: Muted variant

- **WHEN** variant="muted" is set
- **THEN** SHALL render without border
- **AND** SHALL have no shadow
- **AND** SHALL use colorPalette.2 muted background

#### Scenario: Outlined + muted variant

- **WHEN** variant="outlined-muted" is set
- **THEN** SHALL render with solid-25 border using colorPalette.6
- **AND** SHALL have no shadow
- **AND** SHALL use colorPalette.2 muted background

#### Scenario: Elevated + muted variant

- **WHEN** variant="elevated-muted" is set
- **THEN** SHALL render without border
- **AND** SHALL apply shadow token level 1
- **AND** SHALL use colorPalette.2 muted background

#### Scenario: Outlined + elevated + muted variant

- **WHEN** variant="outlined-elevated-muted" is set
- **THEN** SHALL render with solid-25 border using colorPalette.6
- **AND** SHALL apply shadow token level 1
- **AND** SHALL use colorPalette.2 muted background

#### Scenario: Variant name format

- **WHEN** a `variant` value is constructed
- **THEN** the name SHALL list each enabled axis in the order
  `outlined`, `elevated`, `muted`, joined with `-`
- **AND** the name SHALL omit any axis that is off
- **AND** the all-off case SHALL be named `plain`

### Requirement: Slot-Based Accessibility

The component SHALL automatically apply ARIA labelling attributes when React
Aria slot children are present. The component SHALL NOT apply any implicit
`role` — semantic role is left to the consumer.

#### Scenario: Full slot wiring

- **WHEN** Card.Root contains `<Heading slot="title">` and
  `<Text slot="description">`
- **THEN** SHALL apply `aria-labelledby` pointing to the Heading's generated ID
- **AND** SHALL apply `aria-describedby` pointing to the Text's generated ID
- **AND** SHALL NOT apply a `role` attribute

#### Scenario: Title slot only

- **WHEN** Card.Root contains `<Heading slot="title">` but no
  `<Text slot="description">`
- **THEN** SHALL apply `aria-labelledby` pointing to the Heading's generated ID
- **AND** SHALL NOT apply `aria-describedby`
- **AND** SHALL NOT apply a `role` attribute

#### Scenario: Description slot only

- **WHEN** Card.Root contains `<Text slot="description">` but no
  `<Heading slot="title">`
- **THEN** SHALL apply `aria-describedby` pointing to the Text's generated ID
- **AND** SHALL NOT apply `aria-labelledby`
- **AND** SHALL NOT apply a `role` attribute

#### Scenario: No slots

- **WHEN** Card.Root contains no slot-prop children
- **THEN** SHALL NOT apply `aria-labelledby`
- **AND** SHALL NOT apply `aria-describedby`
- **AND** SHALL NOT apply a `role` attribute

#### Scenario: Manual aria-label

- **WHEN** consumer passes `aria-label` directly to Card.Root
- **THEN** SHALL forward `aria-label` to the root element
- **AND** slot-based wiring SHALL still function if slots are also present

#### Scenario: Consumer-provided role

- **WHEN** consumer passes `role` directly to Card.Root
- **THEN** SHALL forward `role` to the root element

#### Scenario: Slot matching

- **WHEN** `<Heading>` without `slot="title"` is inside Card.Root
- **THEN** SHALL NOT affect the Heading (slot matching is strict)
- **AND** SHALL NOT apply any ARIA labelling attributes

## REMOVED Requirements

### Requirement: Rendering Optimization

_Removed: The context-based registration pattern (useMemo for context value,
useEffect for registration) is being removed entirely. There is no context to
optimize. Standard React rendering applies._

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
