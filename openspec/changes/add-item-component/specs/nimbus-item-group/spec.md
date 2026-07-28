# Specification: ItemGroup

## Overview

`ItemGroup` is a standalone presentational compound that lays a set of `Item`
rows out as a vertical stack, with optional dividers between them. It is a
**peer** of `Item` (it wraps `Item.Root` rows rather than nesting inside one),
so it is its own component with its own recipe, not an `Item.*` part.

Parts: `ItemGroup.Root` (the stack container) and `ItemGroup.Separator` (a
horizontal divider between rows).

**Component:** `ItemGroup`
**Package:** `@commercetools/nimbus`
**Category:** Layout / Data display

## ADDED Requirements

### Requirement: Group container

`ItemGroup.Root` SHALL render a container that lays its child `Item` rows out as
a full-width vertical stack, establishing the `nimbusItemGroup` styling context.

#### Scenario: Wraps rows as a vertical stack

- **WHEN** multiple `Item.Root` rows are wrapped in `ItemGroup.Root`
- **THEN** the group SHALL render them stacked vertically at full width

#### Scenario: No invalid list semantics

- **WHEN** `ItemGroup.Root` is rendered
- **THEN** it SHALL NOT assign `role="list"`, because a list role would require
  every child to be a `listitem` and would forbid separator children
  (`aria-required-children`), which the free-composition API cannot guarantee

### Requirement: Group separator

`ItemGroup.Separator` SHALL render a horizontal divider intended to sit between
rows in an `ItemGroup.Root`, exposing `role="separator"` and not being a focus
stop.

#### Scenario: Divider between rows

- **WHEN** `ItemGroup.Separator` is placed between two rows in an
  `ItemGroup.Root`
- **THEN** it SHALL render a full-width horizontal divider with
  `role="separator"`
- **AND** it SHALL NOT be a keyboard focus stop

### Requirement: Grouped link rows

`ItemGroup` SHALL support rows that are themselves links, so a group can present
a set of navigable rows.

#### Scenario: Group of link rows

- **WHEN** an `ItemGroup.Root` contains multiple `Item.Root` rows each given an
  `href`
- **THEN** each row SHALL render as an independent accessible link within the
  group

### Requirement: Component registration and theming

The component SHALL follow Nimbus structure, styling, and export conventions.

#### Scenario: Slot recipe registration

- **WHEN** the theme is assembled
- **THEN** the component SHALL register a slot recipe as `nimbusItemGroup`
  (slots `root` and `separator`)

#### Scenario: Barrel export

- **WHEN** consumers import from `@commercetools/nimbus`
- **THEN** the package SHALL export `ItemGroup` and its public types from the
  barrel
