# Change: Add Splitter component

## Why

Nimbus has no primitive for user-resizable panes. Consumers building IDE-like
or sidebar-plus-content layouts have to hand-roll the drag math, keyboard
handling, and the W3C window-splitter ARIA contract — error-prone and rarely
accessible.

`Splitter` fills that gap with one focused job: **a user dragging the boundary
between two panes**, with clean integration points for persistence and
collapse. It is intentionally scoped to exactly two panes; layouts with more
regions are composed by **nesting** a `Splitter` inside a pane.

App-shell layouts (nav + main + aside, responsive collapse to drawers) are
explicitly **not** in scope here. Those belong in a follow-up pattern component
(`AppLayout` or similar) that composes `Splitter` and adds breakpoint logic.

## Why 2-pane and not N-pane

A flat N-pane API was considered and rejected. The reasoning:

### Accessibility

The W3C window splitter pattern is specified for *a separator between two
regions* — that is the model. `aria-valuenow` has unambiguous meaning
because there is exactly one primary pane on each side of the separator.
The W3C ARIA Authoring Practices Guide example for window splitter is
2-pane for this reason.

With N panes and a cascading resize algorithm, pressing an arrow on a
middle handle resizes panes that `aria-controls` doesn't point at —
non-local behaviour with no clean ARIA expression. The model doesn't
extend naturally.

Nesting two-pane splitters gives screen reader users a tree of
self-contained widgets, each matching the W3C example exactly. Each
splitter is announced as "separator between two regions"; AT users can
reason about each one locally.

### Responsive design

App-shell layouts have natural hierarchy: `main` is primary; `nav` and
`aside` are secondary. Nesting expresses that — `[nav | [main | aside]]`
lets a consumer collapse the inner splitter at one breakpoint and the
outer at another, or swap a pane for a `Drawer` cleanly. Flat N-pane
treats every pane as a peer; responsive collapse then becomes hacky
(setting a size to 0 isn't the same as removing a pane; orphaned handles
have to be hidden separately).

### Implementation cost

N-pane requires a cascading resize algorithm (when a neighbour hits
min/max, spill to the next pane in order), multi-handle indexing, and
constraint logic that interacts with the cascade. That's the bulk of
`react-resizable-panels`'s source. None of that complexity is needed for
the 2-pane primitive, and consumers don't need it for layouts where two
panes plus nesting covers the case.

## What Changes

**Component:** `Splitter` (compound: `Root` / `Aside` / `Main` / `Handle`).
**Shape:** one `Splitter.Aside` and one `Splitter.Main` with one `Handle`
between them (aside on either side).

### Single-dimension configuration

A 2-pane splitter has a single boundary — one degree of freedom — so the size is
a single number: the **aside**'s percentage. The **main** pane always takes the
remainder. The role is designated by the component type (`Splitter.Aside` vs
`Splitter.Main`), not by an id, so there is no id-keyed record and no
`primaryPane` pointer. All sizing and collapse configuration is flat on
`Splitter.Root`.

```tsx
<Splitter.Root
  defaultSize={30}        // aside %; main is the remainder (70)
  minSize={10}            // aside floor
  maxSize={80}            // aside ceiling → main floor = 20
  collapsible
  onSizeChangeEnd={(size) => {/* a single number */}}
>
  <Splitter.Aside>…</Splitter.Aside>
  <Splitter.Handle />
  <Splitter.Main>…</Splitter.Main>
</Splitter.Root>
```

Pane `id` is optional (analytics / test hooks); when omitted a stable DOM id is
generated for the handle's `aria-controls`. The aside may be placed before or
after the main pane — `size` always refers to the aside, and the handle's ARIA
value tracks the leading pane so it is correct on either side.

### Three or more regions via nesting

```tsx
<Splitter.Root defaultSize={25}>
  <Splitter.Aside>…</Splitter.Aside>
  <Splitter.Handle />
  <Splitter.Main>
    <Splitter.Root defaultSize={35}>
      <Splitter.Main>…</Splitter.Main>
      <Splitter.Handle />
      <Splitter.Aside>…</Splitter.Aside>
    </Splitter.Root>
  </Splitter.Main>
</Splitter.Root>
```

Each splitter is independently persistable, independently collapsible,
and independently announced to assistive tech.

### Size is uncontrolled by default, optionally controllable

- `defaultSize: number` (the aside %, read once on mount, clamped to `0–100`,
  full float precision), `onSizeChange` (live, every drag tick), and
  `onSizeChangeEnd` (fires once when an interaction settles — the persistence
  seam, no debounce needed). All emit a single number.
- An optional `size` prop adds **settle-only** controlled behaviour: internal
  state drives the layout during interaction (no per-tick consumer feedback, so
  no ~60Hz re-render), and the prop is reconciled in when it changes. This lets
  consumers swap the proportion per breakpoint in place — no remount, so pane
  content (scroll, focus) survives, which a `key` swap could not preserve.

### Flat aside configuration on Root

- `minSize` (default 0) and `maxSize` (default 100) bound the aside. Because the
  main pane is the remainder, `maxSize` fixes the main pane's floor
  (`100 − maxSize`), so the single aside window fully describes both sides of the
  one boundary — there is no main-specific knob.
- `keyboardStep` (arrow-key delta, default 5), `isDoubleClickDisabled`, and
  `isDisabled` (makes the whole splitter non-interactive, per the Nimbus
  `isDisabled` convention) live on Root.

### Collapsible aside

- `collapsible` + `collapsedSize` on Root. Only the aside collapses.
- Collapse is controllable boolean state — `collapsed` / `defaultCollapsed` /
  `onCollapsedChange(boolean)`. Any control in the app can drive it with plain
  `useState`.
- Keyboard: Enter on the focused `Handle` toggles the aside's collapse.

### Double-click restores defaults

- Double-click on `Handle` restores the boundary to its initial position
  (the size resolved on mount from `defaultSize`, otherwise the 50/50
  fallback).
- The gesture is decoupled from collapsibility: it works on every splitter,
  including non-collapsible ones. Gated by Root-level `isDoubleClickDisabled`.

### Persistence

- Consumer-wired with any storage (localStorage, cookies, query params,
  server): hydrate `defaultSize` from a stored number, write back the number in
  `onSizeChangeEnd`, and persist collapse via its controlled boolean. No
  bundled hook and no baked-in `autoSaveId` — the component stays decoupled
  from any storage backend.

### Visual presentation

- The handle track has a single fixed thickness. Sizes carry full float
  precision end-to-end; only the handle's `aria-valuenow` is rounded (for AT),
  alongside `aria-valuetext`. (Future visual variants can be added to the recipe
  as an explicit dimension if needed.)

### ARIA and keyboard model

- `Handle` is `role="separator"` with `aria-valuenow` / `aria-valuemin` /
  `aria-valuemax` / `aria-valuetext`, `aria-orientation`, and `aria-controls`
  pointing at the leading Pane sibling. Built on React Aria primitives
  (`useSeparator`, `useMove`, `useFocusRing`). The value tracks the leading pane,
  so it is correct whether the aside leads or trails.
- Arrow keys move the boundary by `keyboardStep` (orientation-aware); Home /
  End jump to the aside's bounds; Enter toggles the aside's collapse.
- `orientation: "horizontal" | "vertical"` on Root sets the layout axis and
  the active arrow keys.

### Explicit non-goals

- **No 3+ panes per splitter.** Use nesting. See "Why 2-pane and not
  N-pane" above.
- **No cascading resize.** Not needed without N-pane; `minSize` / `maxSize`
  simply clamp the aside at the boundary.
- **No multi-unit sizes** (px / rem / vh) on the component. Percentages only.
  A pixel-aware companion hook is a separate, later effort.
- **No baked-in persistence.** No `autoSaveId`, no bundled persistence hook;
  consumers choose the storage and wire it through `defaultSize` +
  `onSizeChangeEnd`.
- **No app-shell behaviour.** Responsive collapse, drawer fallbacks on
  narrow viewports, landmark slots — all deferred to a separate `AppLayout`
  pattern component that composes `Splitter`.
- **No per-handle configuration.** A 2-pane splitter has one handle;
  there's nothing to differentiate.
- **No imperative ref or state-hook-as-prop.** Nimbus' public API
  consistently uses controlled/uncontrolled prop pairs; cross-subtree
  collapse is the controlled `collapsed` prop, not an imperative command
  channel.

## Impact

- **Affected specs:** `nimbus-splitter` (new capability).
- **Affected code:**
  - **NEW**: `packages/nimbus/src/components/splitter/`
  - **MODIFIED**: `packages/nimbus/src/components/index.ts` (export
    `./splitter`)
  - **MODIFIED**: `packages/nimbus/src/theme/slot-recipes/index.ts`
    (register `splitterSlotRecipe` as `nimbusSplitter`)
- **Consumers:** none — new component, no breaking changes for downstream
  code.
