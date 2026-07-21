# Specification: Item

## Overview

`Item` is a Tier 3 presentational compound that lays out a **horizontal content
row**: `Item.Root` (establishes the styling context and the row layout) plus
`.Header`, `.Media`, `.Content` (wrapping `.Title` and `.Description`),
`.Actions`, and `.Footer`. Laying multiple rows out as a set is the job of the
separate, peer `ItemGroup` component (see the `nimbus-item-group` capability),
not an `Item.*` part.

`Item.Root` is presentational by default (`<div>`) and **upgrades to an
accessible link** (`<a>` via the `react-aria` `useLink` hook) when an `href` is
present. It has no button mode and no selection state; row actions live as
nested controls in `.Actions`, and selectable/navigable collections are the
responsibility of `List`/`Menu`. `variant` (`plain | outline | subtle`) and
`size` (`xs | sm | md`) axes control the row's visual treatment and density;
`Item.Media` carries its own `variant` (`default | icon | image`).

**Component:** `Item` **Package:** `@commercetools/nimbus` **Category:** Layout
/ Data display

## ADDED Requirements

### Requirement: Compound row layout

The component SHALL expose a compound API — `Item.Root`, `Item.Header`,
`Item.Media`, `Item.Content`, `Item.Title`, `Item.Description`, `Item.Actions`,
`Item.Footer` — that lays out a single content row. `Item.Root` SHALL establish
the `nimbusItem` styling context every part reads, and SHALL arrange media
leading, the content column in the middle, and actions trailing, with optional
header/footer bands above/below the row.

#### Scenario: Render a row with all core parts

- **WHEN** an `Item.Root` contains `Item.Media`, an `Item.Content` with
  `Item.Title` and `Item.Description`, and an `Item.Actions`
- **THEN** it SHALL render the media leading, the title above the description in
  the middle column, and the actions trailing on the same row

#### Scenario: Optional header and footer bands

- **WHEN** an `Item.Root` includes `Item.Header` and/or `Item.Footer`
- **THEN** the header SHALL render as a full-width band above the
  media+content+actions row and the footer as a full-width band below it

#### Scenario: Parts read the Root context

- **WHEN** a part is rendered inside `Item.Root`
- **THEN** it SHALL derive its styling from the `variant`/`size` published by
  `Item.Root` without consumer prop-drilling

### Requirement: Link-upgrade interactivity

`Item.Root` SHALL render a non-interactive `<div>` by default, and SHALL render
an accessible link (`<a>`) when an `href` is provided. Link behavior SHALL be
supplied by the `useLink` hook from `react-aria` (the same primitive Nimbus's
`Link` uses), while `Item`'s own recipe remains authoritative for appearance.
`Item.Root` SHALL NOT provide a button/pressable-row mode and SHALL NOT own
selection state.

#### Scenario: Presentational by default

- **WHEN** `Item.Root` is rendered without an `href`
- **THEN** it SHALL render a `<div>` with no link/button role and no interactive
  tab stop introduced by `Item.Root` itself

#### Scenario: Upgrades to a link with href

- **WHEN** `Item.Root` is given an `href`
- **THEN** it SHALL render an `<a>` that is keyboard focusable, activates on
  Enter, and shows a recipe-driven focus-visible ring
- **AND** it SHALL forward link props (`target`, `rel`, `onPress`/`onClick`,
  router props) to the underlying link

#### Scenario: Actions remain independently operable inside a link row

- **WHEN** an `Item.Root` with an `href` contains `Item.Actions` holding a
  `Button`/`IconButton`
- **THEN** the action control SHALL be a focus stop independent of the row link
  and SHALL be operable without triggering row navigation

#### Scenario: No row-as-button mode

- **WHEN** a consumer needs the row to perform an action rather than navigate
- **THEN** the component SHALL NOT offer a button role on `Item.Root`; the
  action SHALL be expressed as a `Button`/`IconButton` inside `Item.Actions`

### Requirement: Root variant and size

`Item.Root` SHALL accept a `variant` of `"plain"` (default), `"outline"`, or
`"subtle"`, and a `size` of `"xs"`, `"sm"`, or `"md"` (default `"md"`)
controlling padding and gap density.

#### Scenario: Visual variants

- **WHEN** `variant="outline"` is set
- **THEN** the row SHALL render a token-based border
- **AND WHEN** `variant="subtle"` is set
- **THEN** the row SHALL render a token-based subtle surface background
- **AND WHEN** `variant="plain"` (default) is set
- **THEN** the row SHALL render with no border and no filled surface

#### Scenario: Density sizes

- **WHEN** `size` is `"xs"`, `"sm"`, or `"md"`
- **THEN** the row SHALL scale its padding and gap by the corresponding
  token-based density step, with `"md"` as the default

### Requirement: Media variants

`Item.Media` SHALL accept a `variant` of `"default"`, `"icon"`, or `"image"`
sizing and shaping its leading content, and SHALL be a fixed, non-shrinking
slot.

#### Scenario: Media content types

- **WHEN** `Item.Media` is given `variant="icon"` with an icon child
- **THEN** it SHALL size the icon for an inline row glyph
- **AND WHEN** `variant="image"` is set with an image child
- **THEN** it SHALL constrain the image to the row's media box
- **AND** in all cases the media slot SHALL NOT shrink when the content column
  grows

### Requirement: Accessibility (WCAG 2.1 AA)

The component SHALL be accessible by default. A link-mode row SHALL be a genuine
accessible link; `Item.Media` SHALL be decorative unless named; and interactive
affordances SHALL never be conveyed by color alone.

#### Scenario: Decorative media not mislabelled

- **WHEN** `Item.Media` contains a decorative glyph with no consumer-provided
  name
- **THEN** it SHALL be treated as decorative (`aria-hidden`) and SHALL NOT
  inject a misleading generic label into the accessibility tree
- **AND WHEN** the consumer provides an accessible name
- **THEN** the media SHALL expose that name

#### Scenario: Link affordance not color-only

- **WHEN** an `Item.Root` is in link mode
- **THEN** its interactive state (focus) SHALL be conveyed by a visible
  focus-visible indicator, not by color change alone

### Requirement: Component registration and theming

The component SHALL follow Nimbus structure, styling, and export conventions.

#### Scenario: Slot recipe registration

- **WHEN** the theme is assembled
- **THEN** the component SHALL register a slot recipe as `nimbusItem` (slots for
  `root`, `header`, `media`, `content`, `title`, `description`, `actions`,
  `footer`) with `variant` (`plain`/`outline`/`subtle`) and `size`
  (`xs`/`sm`/`md`) on the root
- **AND** `Item.Media`'s `variant` (`default`/`icon`/`image`) SHALL be applied
  via a `data-variant` attribute the media slot targets, since it is independent
  of the root's shared-context `variant`

#### Scenario: Barrel export

- **WHEN** consumers import from `@commercetools/nimbus`
- **THEN** the package SHALL export `Item` and its public types from the barrel
