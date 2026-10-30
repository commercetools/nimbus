## ADDED Requirements

### Requirement: Compact Header On Scroll

The component SHALL shrink the sticky header while the page is scrolled and
restore it when the page is back at the top, when `stickyHeader` is
`"compact-on-scroll"` and `layout` is `"flexible"`. The component SHALL NOT
require the consumer to identify the scrolling element.

#### Scenario: Header compacts after scrolling past it

- **WHEN** `layout` is `"flexible"` and `stickyHeader` is `"compact-on-scroll"`
- **AND** the page has scrolled by at least the height of the header
- **THEN** the header SHALL be shorter than before
- **AND** the title SHALL use a smaller font size and line height, on one line
- **AND** the header SHALL have less vertical padding
- **AND** the back link label SHALL be hidden and its icon SHALL stay on the
  title row
- **AND** the subtitle SHALL be visually collapsed
- **AND** the actions and tab navigation SHALL stay visible
- **AND** `DefaultPage.Root` SHALL have `data-compact="true"`

#### Scenario: A page below the visible area starts expanded

- **WHEN** the page is entirely below the visible area
- **THEN** the header SHALL keep its full size
- **AND** `data-compact` SHALL NOT be set

#### Scenario: A clipped header restores at the top

- **WHEN** the header is compact
- **AND** the page is scrolled back to the top
- **AND** the header is wider than the visible area, or taller than it
- **THEN** the header SHALL return to full size

#### Scenario: Header stays expanded inside its own height

- **WHEN** the page has scrolled by less than the height of the header
- **THEN** the header SHALL keep its full size
- **AND** `data-compact` SHALL NOT be set

#### Scenario: Header restores at the top

- **WHEN** the header is compact
- **AND** the top edge of the header is back inside the visible area
- **THEN** the header SHALL return to full size
- **AND** `data-compact` SHALL be removed

#### Scenario: Scroll positions between the two thresholds keep the state

- **WHEN** the page is scrolled to a position between the compact and restore
  positions
- **THEN** the header SHALL keep its current state

#### Scenario: Shrinking does not reverse itself

- **WHEN** the header compacts and the browser moves the scroll position because
  the page got shorter
- **THEN** the header SHALL stay compact
- **AND** the same SHALL hold when the browser does not adjust the scroll
  position and when the scroll position is clamped on a short page

#### Scenario: Any scrolling element

- **WHEN** the scrolling element is an ancestor of `DefaultPage.Root`, or the
  document
- **THEN** the header SHALL compact and restore as described above

#### Scenario: Pinned header is unchanged

- **WHEN** `stickyHeader` is `true`
- **THEN** the header SHALL be pinned at full height while the page scrolls
- **AND** `data-compact` SHALL NOT be set

#### Scenario: Feature off adds nothing

- **WHEN** `stickyHeader` is not `"compact-on-scroll"`
- **THEN** `DefaultPage.Root` SHALL NOT render the hidden scroll marker
- **AND** the page SHALL have no compact header styles or transitions

#### Scenario: String value without flexible layout

- **WHEN** `stickyHeader` is `"compact-on-scroll"` and `layout` is not
  `"flexible"` (for example through a type cast)
- **THEN** the header SHALL NOT be sticky
- **AND** the header SHALL NOT compact

### Requirement: Compact Header Accessibility

The compact header SHALL keep the page structure, focus and state of its
content.

#### Scenario: Nothing is removed

- **WHEN** the header compacts or restores
- **THEN** the title SHALL remain the same `h1` element
- **AND** the back link, subtitle and actions SHALL remain in the document
- **AND** a focused element in the header SHALL keep focus
- **AND** the hidden scroll marker SHALL be `aria-hidden`

#### Scenario: Compact back link takes focus

- **WHEN** the header is compact
- **AND** the back link receives keyboard focus
- **THEN** the back link label SHALL be shown
- **AND** the header SHALL stay compact

#### Scenario: Collapsed subtitle contains focus

- **WHEN** the header is compact
- **AND** an element inside the subtitle has focus
- **THEN** the subtitle SHALL be shown at its full size

### Requirement: Compact Header Reduced Motion

The compact header SHALL animate its size change only when the user has not
asked for reduced motion.

#### Scenario: Transition when motion is allowed

- **WHEN** `stickyHeader` is `"compact-on-scroll"`
- **AND** the user has not asked for reduced motion
- **THEN** the header, title, back link and subtitle SHALL have a transition

#### Scenario: No transition with reduced motion

- **WHEN** `prefers-reduced-motion: reduce` matches
- **THEN** the transition duration SHALL be zero
- **AND** the header SHALL still compact and restore

## MODIFIED Requirements

### Requirement: Sticky Variants

The component SHALL support sticky header and footer positioning only in
flexible layout mode. The sticky header SHALL optionally shrink while the page
is scrolled.

#### Scenario: Sticky header in flexible layout

- **WHEN** `layout` is `"flexible"` and `stickyHeader` is true
- **THEN** header SHALL remain visible at the top of the viewport during scroll

#### Scenario: Compact sticky header in flexible layout

- **WHEN** `layout` is `"flexible"` and `stickyHeader` is `"compact-on-scroll"`
- **THEN** header SHALL remain visible at the top of the viewport during scroll
- **AND** header SHALL shrink while the page is scrolled, as described in
  "Compact Header On Scroll"

#### Scenario: Sticky footer in flexible layout

- **WHEN** `layout` is `"flexible"` and `stickyFooter` is true
- **THEN** footer SHALL remain visible at the bottom of the viewport during
  scroll

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
  `stickyFooter` props
- **AND** `stickyHeader` SHALL accept `boolean` or `"compact-on-scroll"`
- **AND** `stickyFooter` SHALL accept `boolean`
- **AND** both branches SHALL include children, ref, and style props

#### Scenario: Type error on invalid combinations

- **WHEN** consumer passes `stickyHeader` without `layout="flexible"`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes `stickyFooter` without `layout="flexible"`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes `layout="constrained"` with `stickyHeader`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes `stickyHeader="compact-on-scroll"` without
  `layout="flexible"`
- **THEN** TypeScript SHALL produce a compile error
- **WHEN** consumer passes a `stickyHeader` string other than
  `"compact-on-scroll"`
- **THEN** TypeScript SHALL produce a compile error

#### Scenario: Compact header recipe prop is private

- **WHEN** DefaultPageProps type is defined
- **THEN** it SHALL NOT include the `compactHeader` recipe prop

#### Scenario: BackLink props type

- **WHEN** DefaultPageBackLinkProps type is defined
- **THEN** SHALL require `href: string` prop

#### Scenario: Slot props types

- **WHEN** slot props types are defined
- **THEN** Root SHALL extend HTMLChakraProps<"div">
- **AND** Header SHALL extend HTMLChakraProps<"header">
- **AND** Title SHALL extend HTMLChakraProps<"h1">
- **AND** Subtitle SHALL extend HTMLChakraProps<"p">
- **AND** Content SHALL extend HTMLChakraProps<"main">
- **AND** Footer SHALL extend HTMLChakraProps<"footer">
- **AND** Actions SHALL extend HTMLChakraProps<"div">
- **AND** BackLink SHALL extend HTMLChakraProps<"a">
- **AND** TabNav SHALL extend HTMLChakraProps<"div">
