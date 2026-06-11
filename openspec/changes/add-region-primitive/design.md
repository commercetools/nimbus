# Design: Region primitive

## Context

The `Splitter` work surfaced a recurring need — render content into a pane (and
drive that pane) from a component that does not own the pane's markup. That is
`createPortal` plus a way to find the target by name and a way for the target's
host to expose controls. This document records why `Region` is a standalone
primitive, how it carries both a node and a value, and the decisions that keep it
cheap when a provider wraps an entire app.

## Decision 1: A standalone primitive, not a Splitter feature

"Render content over there" has nothing to do with splitting a view. Baking it
into `Splitter` would add surface area to an already dense component (size state
machine, controlled/uncontrolled collapse, settle-vs-live channels, responsive
sizing, ARIA) and trap a generic capability — the next consumer (a Drawer, a Tabs
panel, an app shell) would reimplement it.

`Splitter` already exposes collapse via controlled `collapsed` /
`onCollapsedChange`. So rather than teaching `Splitter` about regions, the app
shell composes the two: a `Region.Outlet` in the aside publishes the collapse
controls as its `value`, and the Splitter is driven by its own props. **No
Splitter API change.**

## Decision 2: A region carries a node *and* a value

Content placement needs a DOM node; remote control needs callbacks/state. Rather
than two mechanisms, a region record is `{ node, value }`:

- the **outlet** publishes the `node` (callback ref) and, optionally, a `value`;
- `useRegion(name)` returns `{ node, value, Region }`.

This lets one named region express both "paint here" and "here's how to drive
me," which is exactly the shell-owned-side-panel shape (outlet in the aside,
value = `{ isCollapsed, expand, collapse, toggle }`).

## Decision 3: Flat namespace, not context-tree resolution

Regions are keyed by a flat string. A consumer reaches a specific region by name
regardless of nesting. The rejected alternative — resolving up a context chain
with slot accumulation (so a nested instance can be told "you also see the
outer's slots") — is more machinery and is unnecessary: names already
disambiguate, and two nested regions are just two names. Flat keys also make
"reach the outer region from inside an inner one" trivial, which the chain
approach makes awkward.

## Decision 4: External store, not React state (the performance contract)

A `Region.Provider` may wrap an entire application. If the registry were React
state, every `setNode` / `setValue` would re-render the provider and therefore
the whole subtree. So the registry is an **external store** read via
`useSyncExternalStore`:

- `setNode` / `setValue` mutate the store and notify only the listeners for that
  name; the provider never re-renders.
- Per-name records are replaced by identity **only on real change** (and writes
  that are reference-equal are no-ops), so `getSnapshot` returns a stable
  reference and consumers don't tear loops.
- `getServerSnapshot` returns `null` (no outlets on the server; `createPortal` is
  client-only), so SSR renders nothing for a region until hydration.

The full "a panel toggle must not re-render the app" guarantee depends on four
things together, three of which live at the **consumer/host** call site, not in
the primitive:

1. **(primitive)** external store — publishing never re-renders the provider;
2. **(host)** the app flows through the splitter/provider as a stable `children`
   prop, so the host's own state re-renders bail out of the app subtree;
3. **(host)** the published `value` uses stable callbacks (ref-backed) and is
   memoized on its reactive field, so registering does not churn;
4. **(consumer)** effects depend on the **stable callbacks**, not the whole value
   object (whose identity changes when reactive state changes) — otherwise an
   expand-on-mount effect re-runs on every toggle and can ping-pong.

Points 2–4 are a documented usage contract (engineering docs + the
`ShellOwnedSidePanel` story demonstrate them); the primitive cannot enforce them,
but its API is shaped to make them natural (stable `Region` portal identity,
`value` as an opaque slot the host memoizes).

## Decision 5: Stable portal identity

`useRegion` returns a portal component cached per name, and `createRegionPortal`
reads the registry from context at its own render position. A different component
*reference* would make React unmount and remount the projected subtree on every
change; caching per name keeps the projected content alive across collapse/resize.

## Decision 6: Headless — no recipe, slots, tokens, or i18n

`Region` renders no visual chrome. `Region.Outlet` is a plain `div` that fills its
parent by default and is otherwise styleable via standard props. There is nothing
to theme, so — unlike a visual Nimbus component — it intentionally registers no
Chakra recipe and defines no slot recipe or design-token usage, and it ships no
i18n messages (it renders no human-facing text). It still follows the Nimbus
file-type layout, compound-namespace export shape, strict typing, JSDoc, and
Storybook play-function testing.

## Alternatives considered

- **Bake portal + collapse into `Splitter` (`useSplitter`, `id`, slotted
  context).** Rejected: couples a generic capability to one component, adds
  surface area, and needs slot accumulation for nesting. The decoupled `Region`
  is simpler and reusable.
- **Hand out the raw aside DOM node + `createPortal` in consumer code.** Rejected:
  leaks internal DOM into the public API and pushes portal/null-check boilerplate
  onto every consumer.
- **React state registry.** Rejected on performance — re-renders the provider
  (and the app it wraps) on every publish.
- **`value` typed as a fixed shape.** Rejected: the value is host-defined.
  `useRegion<T>` is generic; the registry treats `value` as opaque (`unknown`).
