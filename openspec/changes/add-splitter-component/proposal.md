# Change: Add Splitter component

## Why

Nimbus has no primitive for user-resizable panes. The unmerged `window-splitter`
branch (8 commits, last touched 2025-06) is a 2-pane proof of concept that
never landed because the API choices were premature: it had no story for
cross-app commands, persistence, or collapsibility, and the prop names
(`value` / `defaultValue` / `minValue` / `maxValue` on `Root`) didn't
generalize beyond a single numeric state.

This change reshapes that work into a focused primitive — `Splitter` — that
solves one job well: **a user dragging the boundary between two panes, with
clean integration for persistence, collapse, and cross-app commands.**

Layouts requiring more than two panes are expressed by **nesting** a
`Splitter` inside a `Pane`. App-shell layouts (nav + main + aside,
responsive collapse to drawers) are explicitly **not** in scope here. Those
belong in a follow-up pattern component (`AppLayout` or similar) that
composes `Splitter` and adds breakpoint logic.

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

### Renames from the `window-splitter` branch

- `WindowSplitter` → `Splitter` (drops "Window" — accurate to W3C lineage
  but carries OS-window baggage, and no other React library uses it)
- `WindowSplitter.Separator` → `Splitter.Handle` (the part is interactive;
  the existing `Separator` component in Nimbus is decorative, so name
  collision is avoided and the affordance is clearer)
- Component directory `window-splitter/` → `splitter/`

### Identifier-keyed configuration

- Each `Splitter.Pane` carries a string `id` and its content — **nothing
  else**. All per-pane configuration lives on `Splitter.Root` keyed by id
  (project rule: configuration on Root).
- Root state changes from `value: number` (0–100) to `sizes: Record<string,
  number>` — a map from pane id to percentage of the splitter, with the
  two values summing to 100.
- A `panes` prop on Root holds per-pane settings (`defaultSize`, `minSize`,
  `maxSize`, `disabled`, `collapsible`, `collapsedSize`):
  ```tsx
  <Splitter.Root
    panes={{
      nav:  { defaultSize: 30, minSize: 10, collapsible: true },
      main: { defaultSize: 70, minSize: 20 },
    }}
    onSizesChange={(sizes) => {/* Record<string, number> */}}
  >
    <Splitter.Pane id="nav">…</Splitter.Pane>
    <Splitter.Handle />
    <Splitter.Pane id="main">…</Splitter.Pane>
  </Splitter.Root>
  ```

#### Why id-keyed instead of index-based

- **Reorder-safe persistence.** Swapping the two panes between releases
  doesn't invalidate stored layouts. Unknown ids in storage are dropped;
  missing ids fall back to per-pane defaults.
- **Readable APIs.** `layout.collapse("nav")` beats `layout.collapse(0)`;
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
<Splitter.Root panes={{ nav: {…}, rest: {…} }}>
  <Splitter.Pane id="nav">…</Splitter.Pane>
  <Splitter.Handle />
  <Splitter.Pane id="rest">
    <Splitter.Root panes={{ main: {…}, aside: {…} }}>
      <Splitter.Pane id="main">…</Splitter.Pane>
      <Splitter.Handle />
      <Splitter.Pane id="aside">…</Splitter.Pane>
    </Splitter.Root>
  </Splitter.Pane>
</Splitter.Root>
```

Each splitter is independently persistable, independently collapsible,
and independently announced to assistive tech.

### Uncontrolled component, hook-driven persistence

- The component is **uncontrolled**. Props are `defaultSizes: Record<string,
  number>` (read once on mount) and `onSizesChange: (sizes: Record<string,
  number>) => void` (notification callback). There is no `sizes` prop.
- A new `useSplitterLayout` hook handles persistence and cross-app commands
  in one object:
  ```ts
  const layout = useSplitterLayout({
    initialSizes: { nav: 30, main: 70 },
    id?: string,                        // localStorage key
    storage?: {
      load(): Record<string, number> | undefined;
      save(sizes: Record<string, number>): void;
    },
    debounceMs?: number,                // default 200
  });
  ```
  Returns: `{ defaultSizes, onSizesChange, collapse, expand, setSizes,
  getSizes, isCollapsed }` — all id-keyed.
- Internally the hook holds a ref the component populates on mount;
  commands go through that ref. State stays inside the component, drag
  never re-renders the consumer tree.

### Per-pane configuration on Root

- `panes: Record<string, PaneConfig>` on Root carries `defaultSize`,
  `minSize`, `maxSize`, `disabled`, `collapsible`, `collapsedSize` for
  each pane id.
- Removes `minValue`, `maxValue`, `isDisabled` from `Root`.
- `keyboardStep` (formerly `step` on `Root`) stays on `Root`.
- `disableDoubleClick` lives on `Root`.

### Collapsible panes (new)

- `collapsible` + `collapsedSize` set per-pane in Root's `panes` map.
- Root-level `onCollapse: (paneId: string) => void` and
  `onExpand: (paneId: string) => void` notification callbacks.
- Keyboard: Enter on the focused `Handle` toggles collapse of the
  adjacent collapsible pane. If both panes are collapsible, the smaller
  is preferred (ties broken by left/top). Replaces the current hardcoded
  "Enter jumps to minValue then back to 50" behaviour.
- Imperative: `useSplitterLayout`'s `collapse(paneId)` / `expand(paneId)`
  drive the same transitions from anywhere in the consumer tree.

### Double-click restores defaults (new)

- Double-click on `Handle` restores the boundary to its initial position
  (sizes resolved on mount from `defaultSizes` or `panes[id].defaultSize`).
- The gesture is decoupled from collapsibility: it works on every
  splitter, including those without any `collapsible` panes. Gated by
  Root-level `disableDoubleClick: boolean`.

### What stays the same

- `orientation: "horizontal" | "vertical"` on `Root`.
- React Aria integration on `Handle` (`useSeparator`, `useMove`,
  `useFocusRing`).
- ARIA model: `Handle` is `role="separator"` with `aria-valuenow`,
  `aria-valuemin`, `aria-valuemax`, `aria-orientation`, `aria-controls`
  pointing at the previous Pane sibling.
- Keyboard model on `Handle`: arrow keys move by Root-level `keyboardStep`
  (orientation-aware), Home/End jump the boundary to its bounds.

### Explicit non-goals

- **No 3+ panes per splitter.** Use nesting. See "Why 2-pane and not
  N-pane" above.
- **No cascading resize.** Not needed without N-pane; min/max simply
  clamp at the boundary.
- **No controlled `sizes` prop.** Drag fires at ~60Hz; forcing controlled
  state means every tick re-renders the consumer's tree. Uncontrolled +
  imperative-via-hook covers every real use case without that cost.
- **No multi-unit sizes** (px / rem / vh). Percentages only. Mixing units
  requires a constraint solver and matches no pattern in Nimbus.
- **No baked-in `autoSaveId`.** Persistence lives in `useSplitterLayout`
  so consumers choose the storage (localStorage, sessionStorage, cookie,
  server).
- **No app-shell behaviour.** Responsive collapse, drawer fallbacks on
  narrow viewports, landmark slots — all deferred to a separate
  `AppLayout` pattern component that composes `Splitter`.
- **No per-handle configuration.** A 2-pane splitter has one handle;
  there's nothing to differentiate.
- **No state-hook-as-prop pattern.** Nimbus' public API consistently uses
  controlled/uncontrolled prop pairs; the imperative-commands-via-hook
  approach here keeps that convention while solving the cross-app
  command case.

## Supersedes

This change supersedes the unmerged `window-splitter` branch. The
directory structure, recipe scaffolding, react-aria integration patterns,
and existing stories will be reused, but the public API (component name,
prop shape, state model) is replaced.

## Impact

- **Affected specs:** `nimbus-splitter` (new capability).
- **Affected code:**
  - **NEW**: `packages/nimbus/src/components/splitter/` (replaces
    `window-splitter/`)
  - **MODIFIED**: `packages/nimbus/src/components/index.ts` (export
    `./splitter` instead of `./window-splitter`)
  - **MODIFIED**: `packages/nimbus/src/theme/slot-recipes/index.ts`
    (register `splitterSlotRecipe` as `nimbusSplitter`)
- **Consumers:** none yet — `window-splitter` never shipped. No breaking
  changes for downstream code.
