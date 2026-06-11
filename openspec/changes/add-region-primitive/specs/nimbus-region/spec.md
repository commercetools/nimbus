# Specification: Region

## Overview

The Region primitive provides headless, component-agnostic **named regions** for
content projection. A `Region.Provider` establishes a scope; `<Region name>`
**targets** within it mark named render locations; and `useRegion(name)` projects
content into a target while reading any value the target's host published.

A region is identified by a **flat string name** and holds a `{ node, value }`
record: the target's DOM node (where projected content paints — an internal
detail) and an optional host-published value (typically control callbacks plus
reactive state). Content projected through `useRegion` paints at the target but
remains in the caller's React tree, so ancestor context (routing, intl, data
client, permissions) is preserved.

Regions are addressed by name, not by tree position, so projection and lookup
work across arbitrary nesting. The registry is an external store: publishing a
node or value notifies only that name's consumers and never re-renders the
provider, so a provider may wrap an entire application cheaply — and
`NimbusProvider` mounts one ambiently. `Region` is headless — it renders no visual
chrome, owns no design tokens, registers no Chakra recipe, and ships no i18n.

`Region` is standalone and composes with other components (e.g. a `Splitter`
shell-owned side panel) without those components depending on it.

**Primitive:** `Region` (a target component `<Region name>` with a
`Region.Provider` static) + `useRegion` hook
**Package:** `@commercetools/nimbus` **Category:** Utilities

## ADDED Requirements

### Requirement: Named-region provider scope

`Region.Provider` SHALL establish a named-region scope backed by a registry and
SHALL render no DOM element of its own (it renders only its children / a context
provider). When a `Region.Provider` is already an ancestor, the inner provider
SHALL reuse the ancestor's registry rather than create a new one, so a single
namespace is shared across nesting.

#### Scenario: Provider establishes a scope

- **WHEN** a subtree is wrapped in `<Region.Provider>`
- **THEN** targets within it SHALL register into that scope's registry
- **AND** consumers within it SHALL resolve regions from the same registry

#### Scenario: Nested providers share the namespace

- **WHEN** a `Region.Provider` is rendered inside another `Region.Provider`
- **THEN** the inner provider SHALL reuse the outer registry
- **AND** a name registered under either SHALL resolve to the same record from
  anywhere inside the outer provider

#### Scenario: Consuming without a provider

- **WHEN** `useRegion(name)` is called with no `Region.Provider` ancestor
- **THEN** it SHALL return `value: null` and a `Region` portal that renders nothing
- **AND** SHALL NOT throw

### Requirement: Ambient region scope in NimbusProvider

`NimbusProvider` SHALL mount a `Region.Provider` ambiently, so that any subtree it
wraps has a shared, app-wide region scope without the consumer wrapping a provider.
Because the provider reuses an ancestor's registry, nested `NimbusProvider`s SHALL
share one region namespace.

#### Scenario: useRegion works under NimbusProvider alone

- **WHEN** a `<Region name="x" />` target and a `useRegion("x")` consumer are
  rendered inside a `NimbusProvider` with no explicit `Region.Provider`
- **THEN** content projected by the consumer SHALL paint at the target
- **AND** the consumer SHALL read any value the target published

### Requirement: Region target registers a node under a name

The `<Region name>` target SHALL render a DOM element and register that element as
the region's `node` under its `name`, clearing it on unmount. It SHALL be backed
by a `chakra.div` so it forwards `ref` and accepts Chakra style props and standard
DOM attributes.

#### Scenario: Target registers its node

- **WHEN** `<Region name="x" />` mounts under a provider
- **THEN** the region named `x` SHALL expose that element as its `node`
- **AND** content projected via `useRegion("x")` SHALL paint inside that element

#### Scenario: Target clears its node on unmount

- **WHEN** a mounted `<Region name="x" />` unmounts
- **THEN** the region named `x` SHALL no longer expose a node
- **AND** consumers of `x` SHALL be notified (projected content stops painting)

#### Scenario: Target forwards ref and props

- **WHEN** a consumer passes a `ref` and style props to `<Region name="x" />`
- **THEN** the `ref` SHALL receive the target element
- **AND** the style props SHALL apply to the rendered element

### Requirement: Layout-transparent target rendering

The `<Region name>` target SHALL render with `display: contents` by default, so it
generates no box of its own and projected children participate in the layout of
the target's parent. Because a portal requires a real container node, the target
element SHALL still exist in the DOM; `display: contents` only removes it from
layout. The default SHALL be overridable via style props (e.g. `display="block"`).

#### Scenario: Projected content lays out in the target's parent

- **WHEN** `<Region name="x" />` sits in a flex (or grid) parent and a consumer
  projects content into `x`
- **THEN** the target SHALL generate no box of its own (`display: contents`)
- **AND** the projected root SHALL lay out as a direct child of the target's parent

#### Scenario: Default display is overridable

- **WHEN** a consumer renders `<Region name="x" display="block" />`
- **THEN** the target SHALL render as a normal block box instead of
  `display: contents`

### Requirement: Target publishes an optional value

The `<Region name>` target SHALL accept an optional `value` and publish it as the
region's `value` for that name, updating it when the prop changes and clearing it
on unmount. When `value` is omitted, the region's `value` SHALL remain `null`.

#### Scenario: Target publishes a value

- **WHEN** `<Region name="x" value={controller} />` is rendered
- **THEN** `useRegion("x").value` SHALL return `controller`

#### Scenario: Value updates propagate

- **WHEN** the `value` passed to a target changes identity
- **THEN** consumers of that name SHALL observe the new value

#### Scenario: Value is independent of the node

- **WHEN** a value is published but the target element has not yet mounted (or has
  unmounted)
- **THEN** `useRegion(name).value` SHALL still return the value

### Requirement: Content projection via a stable portal

`useRegion(name)` SHALL return `{ Region, value }`, where `Region` is a portal
component that renders its children into the named target's node via a portal, or
renders nothing until the target mounts. Projected content SHALL remain in the
caller's React tree (so ancestor context is preserved), and the returned component
SHALL keep a stable identity so the projected subtree is not remounted on
unrelated re-renders.

#### Scenario: Children paint at the target

- **WHEN** a consumer renders `const { Region } = useRegion("x")` then
  `<Region>{content}</Region>`, and a `<Region name="x" />` target is mounted
  elsewhere
- **THEN** `content` SHALL render inside the target element
- **AND** SHALL remain a React child of the consumer (retaining its context)

#### Scenario: Projection before the target mounts

- **WHEN** a consumer projects into a name whose target has not mounted yet
- **THEN** the portal SHALL render nothing
- **AND** SHALL render the children once the target mounts, without remounting on
  later unrelated updates

### Requirement: Flat, nesting-agnostic addressing

`useRegion(name)` SHALL resolve a region by its name regardless of how many
providers or targets sit between the caller and the target. Distinct names SHALL
be independent of one another.

#### Scenario: Reach a specific region across nesting

- **WHEN** a consumer is nested inside several targets/providers and calls
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
messages. The `<Region name>` target's default rendering SHALL be a
layout-transparent, fully overridable element.

#### Scenario: No theme registration required

- **WHEN** `Region` is added to the library
- **THEN** it SHALL NOT require registration in the theme's slot recipes
- **AND** SHALL function without any design-token or recipe dependency
