# Change: Add Region primitive

## Why

Components frequently need to render content **somewhere else in the layout**
than where it is authored — an agent panel that belongs in a shell-owned aside,
a toolbar slot filled by the active page, a detail pane driven from a list. The
React tool for this is `createPortal`, but using it directly leaks raw DOM nodes
into component APIs, forces every consumer to null-check the target and call
`createPortal` by hand, and couples the "where content goes" mechanism to
whichever component happens to own the target.

The `Splitter` ([add-splitter-component](../add-splitter-component/proposal.md))
surfaced this need first: a consumer that does not own the splitter markup wants
to project content into a pane and drive the aside's collapse from afar. Baking a
portal/registry layer into `Splitter` would both add surface area to an already
dense component and trap a generic capability inside one component — the next
component that needs "render over there" (a Drawer, a Tabs panel, an app shell)
would reimplement it.

`Region` is that capability extracted as a small, headless, component-agnostic
primitive. The `Splitter` does not depend on it; they **compose** in consumer
code. Any component can host region outlets, and any consumer can project into
them by name.

## What Changes

**Primitive:** `Region` — a **target** component `<Region name>` with a
`Region.Provider` static — plus the `useRegion` hook. Headless: it renders no
visual chrome of its own and owns no design tokens.

### Named regions carrying a node and an optional value

A region is identified by a **flat string name** and holds two things:

- a **node** — the target's DOM element, where projected content paints (an
  internal detail; consumers don't read it);
- an optional **value** — data the target's host publishes for consumers,
  typically control callbacks plus reactive state (e.g. a panel's `expand` /
  `collapse` / `isCollapsed`).

```tsx
// where content lands; may also publish a value for consumers
<Region name="app-side-panel" value={controller} />
```

### Layout-transparent target (`display: contents`)

`createPortal` requires a real DOM node as its container — there is no API to
portal "into a position." So the target must render an element. It renders that
element with **`display: contents`**, so the element generates **no box of its
own**: projected children lay out as direct children of the target's parent (a
flex/grid parent treats the projected root as a direct child). This gives precise
layout with no wrapper box. The target is a `chakra.div`, so it accepts style
props; `display` can be overridden to make it a real box.

### Projection that preserves the React tree

`useRegion(name)` returns a **stable** portal component (`Region`) plus the
target's published `value`:

```tsx
const { Region: Aside, value } = useRegion<PanelControls>("app-side-panel");
value?.expand();
return <Aside>{panel}</Aside>; // paints at the target, stays in THIS React tree
```

Because projection uses `createPortal`, content authored in a deeply nested
consumer keeps every ancestor context (routing, intl, data client, permissions)
while painting at the target's DOM location. The returned `Region` component has
stable identity, so the projected subtree is never torn down and remounted on
unrelated re-renders.

### Flat, nesting-agnostic namespace

Regions are addressed by name, not by tree position. A consumer nested under
several providers/targets reaches a specific region (e.g. a shell-level one) by
name regardless of what is between them. Two nested regions are simply two names
— there is no slot-accumulation or context-chain resolution.

### Provider scope with reuse (ambient in NimbusProvider)

`Region.Provider` establishes a scope. When a provider is already an ancestor,
its registry is **reused** (the namespace is shared across nesting); otherwise it
creates and hosts a fresh registry. It renders no DOM element of its own — hence
`.Provider`, not `.Root`. `NimbusProvider` mounts one ambiently, so a Nimbus app
gets a shared, app-wide region scope without wrapping anything; `useRegion`
resolves to a `null` value (and a portal that renders nothing) before a target
mounts, so it is always safe to call.

### External-store backing (performance)

The registry is an **external store** consumed via `useSyncExternalStore`, not
React state. Publishing or clearing a node/value notifies only the consumers of
that name — it never re-renders `Region.Provider`. This matters because the
provider may wrap an entire application (a shell-owned side panel): projecting
content or toggling a panel through a published callback must not re-render the
app. Per-name records are replaced by identity only on real change, so consumer
snapshots are stable.

### Composition with Splitter (no Splitter change)

`Splitter` keeps its existing controlled `collapsed` / `onCollapsedChange` API
and gains nothing. The app shell composes the two: put a `<Region name>` in the
aside that publishes the collapse controls as its `value`, and let a consumer
anywhere fill the pane and open/close it via `useRegion` (the scope comes from the
ambient `NimbusProvider`).

### Explicit non-goals

- **No visual rendering, recipe, slots, or design tokens.** `Region` is headless;
  the target is a layout-transparent `chakra.div` (`display: contents`) — it
  accepts style props but has nothing to theme, so it registers no Chakra recipe.
- **No i18n.** It renders no human-facing text of its own.
- **No automatic mounting of targets.** Hosts place `<Region name>` explicitly;
  the primitive does not inject targets into other components.
- **No cross-document / cross-window portalling.** Same-document only, like
  `createPortal`.
- **No replacement for React Aria portal utilities.** `Region` is about
  app-authored named slots, not overlay portal containers.

## Impact

- **Affected specs:** `nimbus-region` (new capability).
- **Affected code:**
  - **NEW**: `packages/nimbus/src/components/region/`
  - **MODIFIED**: `packages/nimbus/src/components/index.ts` (export `./region`)
  - **MODIFIED**: `packages/nimbus/src/components/nimbus-provider/nimbus-provider.tsx`
    (mounts an ambient `Region.Provider`)
- **No Chakra recipe / slot-recipe registration** (headless — nothing to theme).
- **Consumers:** none — new primitive, no breaking changes. `Splitter` is
  unchanged and composes with `Region` in consumer code. `NimbusProvider` gains an
  ambient region scope (additive; existing apps are unaffected).
