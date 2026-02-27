## ADDED Requirements

### Requirement: Namespace Structure

The component SHALL export as a compound component namespace.

#### Scenario: Component parts

- **WHEN** PageContent is imported
- **THEN** SHALL provide PageContent.Root as layout container
- **AND** SHALL provide PageContent.Column for column content
- **AND** Root SHALL be first property in namespace

#### Scenario: Single-column usage

- **WHEN** consumer uses PageContent.Root without Column children
- **THEN** SHALL render children directly in single-column layout
- **AND** SHALL NOT require PageContent.Column wrappers

#### Scenario: Multi-column usage

- **WHEN** consumer uses PageContent.Root with PageContent.Column children
- **THEN** SHALL render columns according to the `columns` variant
- **AND** SHALL maintain column layout via CSS grid

### Requirement: Width Variant

The component SHALL support three width constraint variants.

#### Scenario: Wide variant (default)

- **WHEN** variant="wide" is set or no variant is specified on Root
- **THEN** SHALL constrain content using sizing tokens: minmax(sm, 6xl)
- **AND** SHALL center content horizontally via CSS grid

#### Scenario: Narrow variant

- **WHEN** variant="narrow" is set on Root
- **THEN** SHALL constrain content using sizing tokens: minmax(sm, 3xl)
- **AND** SHALL center content horizontally via CSS grid

#### Scenario: Full variant

- **WHEN** variant="full" is set on Root
- **THEN** SHALL take full available width with no max-width constraint

### Requirement: Column Layout

The component SHALL support single and multi-column layouts.

#### Scenario: Single column (default)

- **WHEN** columns="1" is set or no columns prop is provided
- **THEN** SHALL render content in a single column
- **AND** SHALL use `minmax(0, 1fr)` grid template

#### Scenario: Equal columns

- **WHEN** columns="1/1" is set on Root
- **THEN** SHALL render two equal-width columns
- **AND** SHALL use `repeat(2, minmax(0, 1fr))` grid template

#### Scenario: Main plus sidebar

- **WHEN** columns="2/1" is set on Root
- **THEN** SHALL render two columns with 2:1 ratio
- **AND** SHALL use `minmax(0, 2fr) minmax(0, 1fr)` grid template

### Requirement: Default Gap

The recipe base SHALL set a default gap of spacing token `800` (32px) between
columns. Consumers override via Chakra's `gap` style prop with spacing tokens.

#### Scenario: Default gap

- **WHEN** no gap style prop is provided
- **THEN** SHALL apply gap of spacing token `800` (32px)

#### Scenario: Custom gap

- **WHEN** gap="1600" style prop is provided on Root
- **THEN** SHALL override default gap with spacing token `1600` (64px)

### Requirement: Sticky Column

The PageContent.Column component SHALL support sticky positioning.

#### Scenario: Sticky boolean

- **WHEN** sticky={true} is set on a Column
- **THEN** SHALL apply `position: sticky` with `top: 0`

#### Scenario: Sticky with custom offset

- **WHEN** sticky={true} and a `top` style prop is provided (e.g., top="400")
- **THEN** SHALL apply `position: sticky` with `top` set to that token value
- **AND** SHALL override the default `top: 0`

#### Scenario: No sticky (default)

- **WHEN** no sticky prop is provided on Column
- **THEN** SHALL NOT apply sticky positioning

#### Scenario: Sticky type

- **WHEN** sticky prop type is checked
- **THEN** SHALL accept `boolean`
- **AND** consumers SHALL use the `top` style prop for custom offsets

### Requirement: Responsive Behavior

The component SHALL collapse multi-column layouts on small screens.

#### Scenario: Small screen collapse

- **WHEN** a multi-column layout (1/1 or 2/1) is rendered on a small screen
- **THEN** SHALL collapse to single column at the `mdDown` breakpoint
- **AND** SHALL stack columns vertically

#### Scenario: Large screen preservation

- **WHEN** a multi-column layout is rendered on a large screen
- **THEN** SHALL maintain the configured column layout

### Requirement: Style Prop Overrides

The component SHALL accept Chakra style props for custom configurations.

#### Scenario: Custom grid template on Root

- **WHEN** gridTemplateColumns style prop is provided on Root
- **THEN** SHALL override the recipe's column layout
- **AND** SHALL allow arbitrary CSS grid configurations

#### Scenario: Custom column span on Column

- **WHEN** gridColumn style prop is provided on Column
- **THEN** SHALL apply the custom grid column value

#### Scenario: Custom max-width on Root

- **WHEN** maxWidth style prop is provided on Root
- **THEN** SHALL override the variant's max-width constraint

### Requirement: Multi-Slot Recipe

The component SHALL use a multi-slot recipe registered as `nimbusPageContent`.

#### Scenario: Slot definition

- **WHEN** the recipe is defined
- **THEN** SHALL define slots: root, column
- **AND** SHALL use className "nimbus-page-content"

#### Scenario: Recipe registration

- **WHEN** PageContent component is used
- **THEN** recipe SHALL be registered in theme/slot-recipes/index.ts
- **AND** registration SHALL use "nimbusPageContent" key

#### Scenario: Variant definition

- **WHEN** recipe variants are defined
- **THEN** SHALL include variant: wide, narrow, full
- **AND** SHALL include columns: "1", "1/1", "2/1"
- **AND** SHALL set defaults: variant=wide, columns="1"

### Requirement: Type Definitions

The component SHALL provide comprehensive TypeScript types.

#### Scenario: Recipe props type

- **WHEN** PageContentRecipeProps type is defined
- **THEN** SHALL include variant?: "wide" | "narrow" | "full"
- **AND** SHALL include columns?: "1" | "1/1" | "2/1"
- **AND** SHALL extend UnstyledProp

#### Scenario: Root props type

- **WHEN** PageContentProps type is defined
- **THEN** SHALL extend OmitInternalProps of PageContentRootSlotProps
- **AND** SHALL include children, ref, and data-* attributes
- **AND** all props SHALL have JSDoc documentation

#### Scenario: Column props type

- **WHEN** PageContentColumnProps type is defined
- **THEN** SHALL extend OmitInternalProps of PageContentColumnSlotProps
- **AND** SHALL include sticky prop
- **AND** SHALL include children and ref
- **AND** all props SHALL have JSDoc documentation

### Requirement: DOM Reference Access

The component SHALL forward refs to DOM elements.

#### Scenario: Root ref

- **WHEN** ref prop is provided on PageContent.Root
- **THEN** SHALL forward ref to root div element

#### Scenario: Column ref

- **WHEN** ref prop is provided on PageContent.Column
- **THEN** SHALL forward ref to column div element

### Requirement: Data Attribute Support

The component SHALL support data attributes for testing.

#### Scenario: Custom data attributes

- **WHEN** data-* props are provided on Root
- **THEN** SHALL forward all data attributes to root element

### Requirement: Debug Identification

The component SHALL provide display names for debugging.

#### Scenario: Display name setting

- **WHEN** PageContent components are defined
- **THEN** PageContent.Root SHALL set displayName="PageContent.Root"
- **AND** PageContent.Column SHALL set displayName="PageContent.Column"

### Requirement: Component Export

The component SHALL be exported from the main package barrel.

#### Scenario: Package export

- **WHEN** PageContent is imported from @commercetools/nimbus
- **THEN** SHALL export PageContent namespace object
- **AND** SHALL export all prop types
- **AND** SHALL export underscore-prefixed individual parts
