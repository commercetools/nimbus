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
shell composes the two: a `<Region name>` in the aside publishes the collapse
controls as its `value`, and the Splitter is driven by its own props. **No
Splitter API change.**

## Decision 2: A region carries a node *and* a value

Content placement needs a DOM node; remote control needs callbacks/state. Rather
than two mechanisms, a region record is `{ node, value }`:

- the **target** (`<Region name>`) publishes the `node` (callback ref) and,
  optionally, a `value`;
- `useRegion(name)` returns `{ Region, value }` — the `node` stays internal (it
  only drives the portal), so consumers see a clean "fill it / read its value"
  surface and never touch raw DOM.

This lets one named region express both "paint here" and "here's how to drive
me," which is exactly the shell-owned-side-panel shape (target in the aside,
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
- `getServerSnapshot` returns `null` (no targets on the server; `createPortal` is
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

## Decision 6: Layout-transparent target (`display: contents`)

A portal needs a real DOM node as its container — there is no API to portal "into
a position," so the target *must* render an element. But a normal wrapper box adds
a layout node between the target's parent and the projected content: in a flex/grid
parent the projected root becomes a grandchild, not a direct item, which breaks
precise layout. So the target renders with **`display: contents`** by default: the
element exists (the portal has its container) but generates **no box**, and its
children — the projected content — participate in the *parent's* layout as if the
wrapper weren't there. This is the standard technique for "render here without a
wrapper," and it's non-obvious enough to be worth stating in the spec.

Trade-off: a `display: contents` element can't carry its own box (background,
padding, border, positioning, scroll). Those belong on the projected content or
the parent. Because the target is a `chakra.div`, the default is overridable —
`<Region name="x" display="block" />` makes it a real box when that's wanted.

## Decision 7: Single consumer-facing surface; ambient scope in NimbusProvider

The common consumer need is "fill a named slot," so the API is shaped around it:

- the **target** is the bare `<Region name>` component (no separate `Outlet`
  concept — the placeholder *is* a `Region`);
- **filling** is `useRegion(name) → { Region, value }`; and
- the **scope** is mounted ambiently by `NimbusProvider` (alongside the i18n
  provider and toast outlet), so consumers place targets and call `useRegion`
  without ever wrapping a provider.

`node` is dropped from the public hook return — it was an imperative escape hatch
no common flow used; keeping it internal shrinks the surface. The provider is
reuse-or-create, so the ambient mount is backward-compatible: an explicit
`Region.Provider` (or a nested `NimbusProvider`) just reuses the existing
registry. The consequence — accepted deliberately — is that the region namespace
is **app-global**: names must be unique across the app, consistent with the flat
namespace of Decision 3.

## Decision 8: Headless — no recipe, slots, tokens, or i18n

`Region` renders no visual chrome. The target is a layout-transparent `chakra.div`
(`display: contents`) — it accepts style props but has nothing to theme, so —
unlike a visual Nimbus component — it intentionally registers no Chakra recipe and
defines no slot recipe or design-token usage, and it ships no i18n messages (it
renders no human-facing text). It still follows the Nimbus file-type layout,
component-with-statics export shape, strict typing, JSDoc, and Storybook
play-function testing.

## Alternatives considered

- **Bake portal + collapse into `Splitter` (`useSplitter`, `id`, slotted
  context).** Rejected: couples a generic capability to one component, adds
  surface area, and needs slot accumulation for nesting. The decoupled `Region`
  is simpler and reusable.
- **A separate `Region.Outlet` for the target.** Rejected: with the bare
  `<Region name>` *being* the target, `Outlet` was a redundant concept. One fewer
  thing to learn.
- **A fill-parent wrapper box for the target.** Rejected: it inserts a layout node
  between the parent and the projected content. `display: contents` removes the
  box while keeping the container the portal needs.
- **Expose the target `node` in `useRegion`.** Rejected: no common flow used it;
  it leaked an imperative DOM handle into the public surface.
- **Hand out the raw aside DOM node + `createPortal` in consumer code.** Rejected:
  leaks internal DOM into the public API and pushes portal/null-check boilerplate
  onto every consumer.
- **React state registry.** Rejected on performance — re-renders the provider
  (and the app it wraps) on every publish.
- **`value` typed as a fixed shape.** Rejected: the value is host-defined.
  `useRegion<T>` is generic; the registry treats `value` as opaque (`unknown`).
