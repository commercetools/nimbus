# Change: Add Splitter component

## Why

Nimbus has no primitive for user-resizable panes. Consumers building IDE-like
or sidebar-plus-content layouts have to hand-roll the drag math, keyboard
handling, and the W3C window-splitter ARIA contract — error-prone and rarely
accessible.

`Splitter` fills that gap with one focused job: **a user dragging the boundary
between two panes**, with clean integration points for persistence and
collapse. It is intentionally scoped to exactly two panes; layouts with more
regions are composed by **nesting** a `Splitter` inside a `Pane`.

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

### Forward compatibility

The id-keyed configuration (see below) already matches what an N-pane
shape would want. If a real flat-N use case lands later (3-way diff
viewer, etc.), we extend the primitive without breaking existing
consumers.

## What Changes

**Component:** `Splitter` (compound: `Root` / `Pane` / `Handle`).
**Shape:** exactly two `Pane` children with one `Handle` between them.

### Identifier-keyed configuration

- Each `Splitter.Pane` carries a string `id` and its content — **nothing
  else**. All per-pane configuration lives on `Splitter.Root` keyed by id
  (project rule: configuration on Root).
- Root owns a `sizes` record — a map from pane id to percentage of the
  splitter, with the two values summing to 100.
- A `panes` prop on Root holds the static per-pane settings (`minSize`,
  `collapsible`, `collapsedSize`):
  ```tsx
  <Splitter.Root
    defaultSizes={{ nav: 30, main: 70 }}
    panes={{
      nav:  { minSize: 10, collapsible: true },
      main: { minSize: 20 },
    }}
    onSizesChangeEnd={(sizes) => {/* Record<string, number> */}}
  >
    <Splitter.Pane id="nav">…</Splitter.Pane>
    <Splitter.Handle />
    <Splitter.Pane id="main">…</Splitter.Pane>
  </Splitter.Root>
  ```

#### Why id-keyed instead of index-based

- **Reorder-safe persistence.** Swapping the two panes between releases
  doesn't invalidate stored layouts. Unknown ids in storage are dropped;
  missing ids fall back to a 50/50 split.
- **Readable APIs.** `collapsedPane="nav"` beats `collapsedPane={0}`;
  `sizes.nav` beats `sizes[0]`.
- **Clean ARIA wiring.** `aria-controls` on the handle is just the DOM id
  of the previous Pane sibling.
- **Configuration on Root.** Per-pane settings live in a single Root prop
  keyed by id, matching the project rule. Nothing leaks onto
  `<Splitter.Pane>`.
- **Forward compatibility.** If the primitive ever grows to N panes, the
  shape doesn't change.

### Three or more regions via nesting

```tsx
<Splitter.Root defaultSizes={{ nav: 25, rest: 75 }}>
  <Splitter.Pane id="nav">…</Splitter.Pane>
  <Splitter.Handle />
  <Splitter.Pane id="rest">
    <Splitter.Root defaultSizes={{ main: 65, aside: 35 }}>
      <Splitter.Pane id="main">…</Splitter.Pane>
      <Splitter.Handle />
      <Splitter.Pane id="aside">…</Splitter.Pane>
    </Splitter.Root>
  </Splitter.Pane>
</Splitter.Root>
```

Each splitter is independently persistable, independently collapsible,
and independently announced to assistive tech.

### Sizes are uncontrolled

- `defaultSizes: Record<string, number>` (read once on mount, normalized to
  sum 100, full float precision), `onSizesChange` (live, every drag tick),
  and `onSizesChangeEnd` (fires once when an interaction settles — the
  persistence seam, no debounce needed). There is no `sizes` prop.
- Drag fires at ~60Hz; forcing controlled sizes would re-render the
  consumer's tree on every tick for no semantic gain. `onSizesChangeEnd`
  delivers the settled value once per interaction, which is all persistence
  needs.

### Per-pane configuration on Root

- `panes: Record<string, PaneConfig>` on Root carries `minSize`,
  `collapsible`, and `collapsedSize` for each pane id.
- A pane's upper bound is derived (`100 − partner.minSize`), so a single
  `minSize` per side fully describes the one boundary — there is no
  `maxSize`.
- `keyboardStep` (arrow-key delta, default 5), `isDoubleClickDisabled`, and
  `isDisabled` (makes the whole splitter non-interactive, per the Nimbus
  `isDisabled` convention) live on Root.

### Collapsible panes

- `collapsible` + `collapsedSize` set per-pane in Root's `panes` map.
- Collapse is controllable state — `collapsedPane` / `defaultCollapsedPane`
  / `onCollapsedPaneChange` (a single pane id or `null`; one pane collapses
  at a time). Any control in the app can drive it with plain `useState`.
- Keyboard: Enter on the focused `Handle` toggles collapse of the adjacent
  collapsible pane. If both panes are collapsible, the smaller is preferred
  (ties broken by left/top).

### Double-click restores defaults

- Double-click on `Handle` restores the boundary to its initial position
  (the sizes resolved on mount from `defaultSizes`, otherwise the 50/50
  fallback).
- The gesture is decoupled from collapsibility: it works on every splitter,
  including those without any `collapsible` panes. Gated by Root-level
  `isDoubleClickDisabled`.

### Persistence

- Consumer-wired with any storage (localStorage, cookies, query params,
  server): hydrate `defaultSizes` from stored values, write back in
  `onSizesChangeEnd`, and persist collapse via its controlled state. No
  bundled hook and no baked-in `autoSaveId` — the component stays decoupled
  from any storage backend.

### Visual presentation

- A `size` variant (`sm` / `md` / `lg`) on Root sets the handle track's
  visual thickness — the standard recipe `size` dimension. Sizes carry full
  float precision end-to-end; only the handle's `aria-valuenow` is rounded
  (for AT), alongside `aria-valuetext`.

### ARIA and keyboard model

- `Handle` is `role="separator"` with `aria-valuenow` / `aria-valuemin` /
  `aria-valuemax` / `aria-valuetext`, `aria-orientation`, and `aria-controls`
  pointing at the previous Pane sibling. Built on React Aria primitives
  (`useSeparator`, `useMove`, `useFocusRing`).
- Arrow keys move the boundary by `keyboardStep` (orientation-aware); Home /
  End jump to the bounds; Enter toggles collapse.
- `orientation: "horizontal" | "vertical"` on Root sets the layout axis and
  the active arrow keys.

### Explicit non-goals

- **No 3+ panes per splitter.** Use nesting. See "Why 2-pane and not
  N-pane" above.
- **No cascading resize.** Not needed without N-pane; `minSize` simply
  clamps at the boundary.
- **No controlled `sizes` prop.** Drag fires at ~60Hz; forcing controlled
  state means every tick re-renders the consumer's tree. Uncontrolled sizes
  plus `onSizesChangeEnd` cover every real use case without that cost.
- **No multi-unit sizes** (px / rem / vh). Percentages only. Mixing units
  requires a constraint solver and matches no pattern in Nimbus.
- **No baked-in persistence.** No `autoSaveId`, no bundled persistence hook;
  consumers choose the storage and wire it through `defaultSizes` +
  `onSizesChangeEnd`.
- **No app-shell behaviour.** Responsive collapse, drawer fallbacks on
  narrow viewports, landmark slots — all deferred to a separate `AppLayout`
  pattern component that composes `Splitter`.
- **No per-handle configuration.** A 2-pane splitter has one handle;
  there's nothing to differentiate.
- **No imperative ref or state-hook-as-prop.** Nimbus' public API
  consistently uses controlled/uncontrolled prop pairs; cross-subtree
  collapse is the controlled `collapsedPane` prop, not an imperative
  command channel.

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
