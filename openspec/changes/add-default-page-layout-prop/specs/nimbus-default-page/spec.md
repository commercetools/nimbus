## MODIFIED Requirements

### Requirement: Root Grid Layout

The Root component SHALL support two explicit layout modes via a `layout` prop.

#### Scenario: Constrained layout (default)

- **WHEN** `layout` is `"constrained"` or omitted on DefaultPage.Root
- **THEN** SHALL use `height: 100%` to fill parent height
- **AND** SHALL use `grid-template-rows: auto 1fr auto`
- **AND** Content slot SHALL use `overflow: auto` for independent scrolling
- **AND** header and footer SHALL be naturally pinned by the grid (no sticky
  positioning needed)

#### Scenario: Flexible layout

- **WHEN** `layout` is `"flexible"` on DefaultPage.Root
- **THEN** SHALL use `height: auto` so root grows with content
- **AND** SHALL use `grid-template-rows: auto 1fr auto`
- **AND** Content slot SHALL NOT use `overflow: auto`
- **AND** the entire page SHALL scroll as a single unit

#### Scenario: Footer absent

- **WHEN** DefaultPage.Footer is not rendered inside Root
- **THEN** the third grid row (auto) SHALL collapse to zero height
- **AND** content SHALL fill remaining space below header

### Requirement: Sticky Variants

The component SHALL support sticky header and footer positioning only in
flexible layout mode.

#### Scenario: Sticky header in flexible layout

- **WHEN** `layout` is `"flexible"` and `stickyHeader` is true
- **THEN** header SHALL use `position: sticky` with `top: 0`
- **AND** SHALL use `zIndex: 1` and background color `bg`

#### Scenario: Sticky footer in flexible layout

- **WHEN** `layout` is `"flexible"` and `stickyFooter` is true
- **THEN** footer SHALL use `position: sticky` with `bottom: 0`
- **AND** SHALL use `zIndex: 1` and background color `bg`

#### Scenario: No sticky in constrained layout

- **WHEN** `layout` is `"constrained"` or omitted
- **THEN** `stickyHeader` and `stickyFooter` props SHALL NOT be available
- **AND** TypeScript SHALL produce a compile error if they are provided

#### Scenario: Default in flexible layout

- **WHEN** `layout` is `"flexible"` and neither `stickyHeader` nor
  `stickyFooter` is provided
- **THEN** header and footer SHALL scroll with the page content

### Requirement: Type Definitions

The component SHALL provide comprehensive TypeScript types with discriminated
union enforcement.

#### Scenario: Root props discriminated union

- **WHEN** DefaultPageProps type is defined
- **THEN** SHALL use a discriminated union on the `layout` prop
- **AND** the `"constrained"` branch (and default/omitted) SHALL NOT include
  `stickyHeader` or `stickyFooter`
- **AND** the `"flexible"` branch SHALL include optional `stickyHeader` and
  `stickyFooter` boolean props
- **AND** both branches SHALL include children, ref, and style props

#### Scenario: Type error on invalid combinations

- **WHEN** consumer passes `stickyHeader` without `layout="flexible"`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes `stickyFooter` without `layout="flexible"`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes `layout="constrained"` with `stickyHeader`
- **THEN** TypeScript SHALL produce a compile error

### Requirement: Multi-Slot Recipe

The component SHALL use a multi-slot recipe registered as `nimbusDefaultPage`.

#### Scenario: Layout variant definition

- **WHEN** the recipe defines variants
- **THEN** SHALL define `layout` variant with `"constrained"` and `"flexible"`
  values
- **AND** `"constrained"` SHALL set root `height: 100%` and content
  `overflow: auto`
- **AND** `"flexible"` SHALL set root `height: auto` and content without
  overflow

#### Scenario: Default variant

- **WHEN** no `layout` variant is specified
- **THEN** SHALL default to `"constrained"` behavior

#### Scenario: Sticky variant definition

- **WHEN** the recipe defines variants
- **THEN** SHALL define `stickyHeader` boolean variant
- **AND** SHALL define `stickyFooter` boolean variant
