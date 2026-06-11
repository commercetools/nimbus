# Specification: Region

## Overview

The Region primitive provides headless, component-agnostic **named regions** for
content projection. A `Region.Provider` establishes a scope; `Region.Outlet`s
within it mark named render targets; and `useRegion(name)` projects content into
a target while reading the target's live DOM node and any value its host
published.

A region is identified by a **flat string name** and holds a `{ node, value }`
record: the outlet's DOM node (where projected content paints) and an optional
host-published value (typically control callbacks plus reactive state). Content
projected through `useRegion` paints at the outlet but remains in the caller's
React tree, so ancestor context (routing, intl, data client, permissions) is
preserved.

Regions are addressed by name, not by tree position, so projection and lookup
work across arbitrary nesting. The registry is an external store: publishing a
node or value notifies only that name's consumers and never re-renders the
provider, so a provider may wrap an entire application cheaply. `Region` is
headless — it renders no visual chrome, owns no design tokens, registers no Chakra
recipe, and ships no i18n.

`Region` is standalone and composes with other components (e.g. a `Splitter`
shell-owned side panel) without those components depending on it.

**Primitive:** `Region` (compound API: `Root`, `Outlet`) + `useRegion` hook
**Package:** `@commercetools/nimbus` **Category:** Utilities

## ADDED Requirements

### Requirement: Named-region provider scope

`Region.Provider` SHALL establish a named-region scope backed by a registry. When
a `Region.Provider` is already an ancestor, the inner provider SHALL reuse the
ancestor's registry rather than create a new one, so a single namespace is shared
across nesting.

#### Scenario: Provider establishes a scope

- **WHEN** a subtree is wrapped in `<Region.Provider>`
- **THEN** outlets within it SHALL register into that scope's registry
- **AND** consumers within it SHALL resolve regions from the same registry

#### Scenario: Nested providers share the namespace

- **WHEN** a `Region.Provider` is rendered inside another `Region.Provider`
- **THEN** the inner provider SHALL reuse the outer registry
- **AND** a name registered under either SHALL resolve to the same record from
  anywhere inside the outer provider

#### Scenario: Consuming without a provider

- **WHEN** `useRegion(name)` is called with no `Region.Provider` ancestor
- **THEN** it SHALL return `node: null` and `value: null`
- **AND** SHALL NOT throw

### Requirement: Outlet registers a node under a name

`Region.Outlet` SHALL render a DOM element and register that element as the
region's `node` under its `name`, clearing it on unmount. It SHALL render a plain
`div` that fills its parent by default and forward standard props and `ref`.

#### Scenario: Outlet publishes its node

- **WHEN** `<Region.Outlet name="x" />` mounts under a provider
- **THEN** the region named `x` SHALL expose that element as its `node`
- **AND** `useRegion("x").node` SHALL return that element

#### Scenario: Outlet clears its node on unmount

- **WHEN** a mounted `<Region.Outlet name="x" />` unmounts
- **THEN** the region named `x` SHALL no longer expose a node
- **AND** consumers of `x` SHALL be notified

#### Scenario: Outlet forwards ref and props

- **WHEN** a consumer passes a `ref` and standard `div` props to `Region.Outlet`
- **THEN** the `ref` SHALL receive the outlet element
- **AND** the props SHALL apply to the rendered element

### Requirement: Outlet publishes an optional value

`Region.Outlet` SHALL accept an optional `value` and publish it as the region's
`value` for that name, updating it when the prop changes and clearing it on
unmount. When `value` is omitted, the region's `value` SHALL remain `null`.

#### Scenario: Outlet publishes a value

- **WHEN** `<Region.Outlet name="x" value={controller} />` is rendered
- **THEN** `useRegion("x").value` SHALL return `controller`

#### Scenario: Value updates propagate

- **WHEN** the `value` passed to an outlet changes identity
- **THEN** consumers of that name SHALL observe the new value

#### Scenario: Value is independent of the node

- **WHEN** a value is published but the outlet element has not yet mounted (or
  has unmounted)
- **THEN** `useRegion(name).value` SHALL still return the value
- **AND** `useRegion(name).node` SHALL be `null`

### Requirement: Content projection via a stable portal

`useRegion(name)` SHALL return a `Region` portal component that renders its
children into the named outlet's node via a portal, or renders nothing until the
outlet mounts. Projected content SHALL remain in the caller's React tree (so
ancestor context is preserved), and the returned component SHALL keep a stable
identity so the projected subtree is not remounted on unrelated re-renders.

#### Scenario: Children paint at the outlet

- **WHEN** a consumer renders `const { Region } = useRegion("x")` then
  `<Region>{content}</Region>`, and an outlet named `x` is mounted elsewhere
- **THEN** `content` SHALL render inside the outlet element
- **AND** SHALL remain a React child of the consumer (retaining its context)

#### Scenario: Projection before the outlet mounts

- **WHEN** a consumer projects into a name whose outlet has not mounted yet
- **THEN** the portal SHALL render nothing
- **AND** SHALL render the children once the outlet mounts, without remounting on
  later unrelated updates

### Requirement: Flat, nesting-agnostic addressing

`useRegion(name)` SHALL resolve a region by its name regardless of how many
providers or outlets sit between the caller and the target. Distinct names SHALL
be independent of one another.

#### Scenario: Reach a specific region across nesting

- **WHEN** a consumer is nested inside several outlets/providers and calls
  `useRegion("outer")`
- **THEN** it SHALL resolve the region named `"outer"` regardless of intervening
  nesting
- **AND** SHALL project into and read that region, not a nearer one

### Requirement: Publishing does not re-render the provider

The registry SHALL be an external store consumed via `useSyncExternalStore`.
Registering, updating, or clearing a node or value SHALL notify only the
consumers of that name and SHALL NOT re-render `Region.Provider`. A write whose
node or value is reference-equal to the current record SHALL be a no-op (no
notification), and a record's snapshot identity SHALL change only when its node or
value actually changes.

#### Scenario: A publish notifies only that name's consumers

- **WHEN** a node or value is published for name `x`
- **THEN** only consumers of `x` SHALL be notified
- **AND** consumers of other names SHALL NOT be notified
- **AND** `Region.Provider` SHALL NOT re-render

#### Scenario: Reference-equal write is a no-op

- **WHEN** the same node or value reference is published again for a name
- **THEN** consumers SHALL NOT be notified

### Requirement: Headless with no theming or i18n

`Region` SHALL render no visual chrome of its own, SHALL NOT register a Chakra
recipe or slot recipe, SHALL NOT depend on design tokens, and SHALL NOT ship i18n
messages. `Region.Outlet`'s default rendering SHALL be a layout-neutral, fully
overridable element.

#### Scenario: No theme registration required

- **WHEN** `Region` is added to the library
- **THEN** it SHALL NOT require registration in the theme's slot recipes
- **AND** SHALL function without any design-token or recipe dependency
