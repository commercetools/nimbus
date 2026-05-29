# Design: Splitter

This document captures the architectural decisions behind the Splitter
primitive and the reasoning recorded during proposal discussion. Each
decision is paired with the alternative considered and the trade-off
accepted.

## Revision — post-review reshape (supersedes Decisions 4, 5, 6, 9, 10)

A pre-release review found the API over-parameterized a single-value boundary.
The decisions below are kept for history; the following supersede them:

- **Decision 4 (uncontrolled-only):** still uncontrolled for **sizes**, but a
  settled-change callback `onSizesChangeEnd` is added (fires once per
  interaction) so persistence needs no debounce. **Collapse** moves to
  controllable state — `collapsedPane` / `defaultCollapsedPane` /
  `onCollapsedPaneChange` — because it is discrete and low-frequency, so the
  60Hz perf argument does not apply to it.
- **Decision 5 + 6 (hook owns persistence + imperative commands):** the
  `useSplitterLayout` hook is **removed**. Persistence is wired in the consuming
  app with any storage (`defaultSizes` + `onSizesChangeEnd`); cross-subtree
  control is plain controlled state (`collapsedPane`), so there is no imperative
  ref/hook and no `__layoutRef`.
- **Decision 9 (per-pane config in `panes`):** the map stays on Root but carries
  only `minSize`, `collapsible`, `collapsedSize`. `maxSize` is removed (derived
  as `100 − partner.minSize`); per-pane `defaultSize` is removed (single
  canonical `defaultSizes` on Root); per-pane `disabled` is replaced by a
  Root-level `isDisabled` (Nimbus `isDisabled` convention).
- **Decision 10 (double-click restores defaults):** unchanged, plus the
  `restoreDefaults` guard is fixed to a key-existence check so a legitimate `0`
  initial size restores.
- **Added:** documented `size` Root prop; full float-precision sizes (no
  rounding in the pipeline; `aria-valuenow` rounds for AT only, with
  `aria-valuetext`).

`spec.md` reflects the final contract.

## Decision 1: 2-pane primitive, composable via nesting

**Decision.** `Splitter.Root` accepts exactly two `Pane` children with one
`Handle` between them. Layouts requiring more than two panes are expressed
by nesting one `Splitter` inside another's `Pane`.

**Alternative considered.** Flat N-pane: ≥ 2 `Pane` children with N − 1
`Handle` children between them, sizes keyed across all of them, with a
cascading resize algorithm to spill drag remainder through neighbours
that hit `minSize` / `maxSize`.

**Why rejected.** Three issues:

1. **Accessibility.** The W3C window splitter pattern is specified for *a
   separator between two regions* — that is the model in the ARIA APG
   example. With N-pane + cascade, pressing an arrow on a middle handle
   resizes panes that `aria-controls` doesn't point at — non-local
   behaviour with no clean ARIA expression. Nested 2-pane gives a screen
   reader a tree of self-contained widgets, each matching the W3C example
   exactly. Each splitter is locally reasonable.
2. **Responsive design.** App-shell layouts have natural hierarchy:
   `main` is primary; `nav` and `aside` are secondary. Nesting expresses
   that — `[nav | [main | aside]]` lets a consumer collapse the inner
   splitter at one breakpoint and the outer at another, or swap a pane
   for a `Drawer` cleanly. Flat N-pane treats every pane as a peer;
   responsive collapse then becomes hacky (a size of 0 isn't the same as
   removing a pane; orphaned handles need hiding separately).
3. **Implementation cost.** The cascade algorithm is the bulk of
   `react-resizable-panels`'s source. Skipping it lets the primitive
   ship simpler and tighter without losing any layout that nesting can't
   express.

**Cost accepted.** Layouts where panes are genuinely peer-equal (3-way
diff viewer, IDE tree | editor | terminal) read more naturally as flat
JSX than as nested. They still work — one boundary lives one level
deeper in the tree — but the JSX is less obviously a peer relationship.

**Forward compatibility.** The id-keyed config (Decision 2) already
matches what an N-pane shape would want. If a real flat-N case lands
later with consumer demand, we extend the primitive without breaking
existing consumers.

## Decision 2: Id-keyed configuration, not index-based

**Decision.** Sizes, per-pane config, and the imperative command surface
are keyed by pane `id` (a string), not by integer index. `Splitter.Pane`
carries only `id` and content; per-pane settings live in a `panes:
Record<string, PaneConfig>` prop on `Splitter.Root`.

**Alternative considered.** Index-based: `defaultSizes: [number, number]`
on Root, per-pane settings as props on each `<Splitter.Pane>` child.

**Why rejected.** Even with only two panes, index-based has issues:

1. **Configuration drift across the codebase.** Per-pane props on `Pane`
   contradicts the project rule that configuration lives on Root.
2. **Fragile persistence.** Swapping the order of the two panes between
   releases invalidates every persisted layout; with ids, unknown ids
   are dropped and missing ids fall back to defaults.
3. **Readability.** `layout.collapse("nav")` and `sizes.nav` communicate
   intent at a glance.
4. **Forward compatibility with N-pane.** If we ever extend the primitive,
   the API shape doesn't change — only the constraint on how many panes
   are allowed.

**Cost accepted.** Every `Splitter.Pane` requires an `id`. Dev-time
warning when an id is missing or duplicated.

## Decision 3: Anonymous handle

**Decision.** `Splitter.Handle` carries no `id` and no per-handle config
props. Behaviour (`keyboardStep`, `isDoubleClickDisabled`, default
`aria-label`) lives on `Root`. The handle infers the two panes it
controls from its sibling Panes in DOM order.

**Alternative considered.** Per-handle config via an `id` + `handles` map
on Root.

**Why rejected.** A 2-pane splitter has exactly one handle; there is
nothing to differentiate per handle. The config-on-Root rule applies to
the single handle just as well as it would to many.

**Cost accepted.** None within the 2-pane shape. If N-pane is ever added
and per-handle config emerges as a need, an opt-in `id` + `handles` map
remains additive.

## Decision 4: Uncontrolled-only

**Decision.** The component owns its sizes state internally. Public
props are `defaultSizes` (read once on mount) and `onSizesChange`
(notification only). No `sizes` prop.

**Alternative considered.** Standard Nimbus controlled/uncontrolled prop
pair (`sizes` + `onSizesChange` + `defaultSizes`).

**Why rejected.** Drag interactions fire at ~60Hz. A controlled prop
means every tick goes through consumer `setState` → re-render of the
consumer's tree. For an app-shell layout wrapping a large React tree,
that's a real performance cost for no semantic win — splitter sizes are
UI ergonomics, not data the rest of the app needs to react to mid-drag.

**Cost accepted.** Cross-app commands (collapse the nav from a header
button) can't be done by lifting state up. We solve this with an
imperative command channel surfaced through the persistence hook — see
Decision 6.

## Decision 5: Hook owns persistence, not the component

**Decision.** `useSplitterLayout` handles loading initial sizes from
storage, saving on change, and debouncing. The component remains a pure
controllable primitive.

**Alternative considered.** RPP's `autoSaveId` pattern — pass a string
to the component, it writes to `localStorage` automatically.

**Why rejected.** Couples the component to a specific storage backend.
Cookies (for SSR), query params (for shareable layouts), server-side
storage (for cross-device persistence), or external state stores all
become impossible without escape hatches. Also forces the component to
handle hydration, SSR safety, debouncing, and stored-value validation
— none of which belong to its core job.

**Hook contract:**

```ts
function useSplitterLayout(options: {
  initialSizes: Record<string, number>;
  id?: string;                                       // → localStorage key
  storage?: {                                        // custom adapter, overrides `id`
    load(): Record<string, number> | undefined;
    save(sizes: Record<string, number>): void;
  };
  debounceMs?: number;                                // default 200
}): SplitterLayout;
```

The hook reconciles stored values against `initialSizes`:

- **Id mismatch** (stored has ids not in `initialSizes`, or vice versa):
  drop unknown ids; for missing ids, fall back to `initialSizes[id]`;
  re-normalize to sum 100.
- **Sum drift within ±1% of 100** → normalize to exactly 100;
  **outside ±1%** → fall back to `initialSizes`.
- **SSR** → first render returns `initialSizes` synchronously when
  `typeof window === "undefined"`; client read happens on first render
  guarded by `typeof window !== "undefined"`. No `useEffect` hydration
  flicker.

## Decision 6: Imperative commands flow through the hook, not a ref

**Decision.** `useSplitterLayout` returns an object containing both the
props to spread on `Root` (`defaultSizes`, `onSizesChange`) and the
commands (`collapse`, `expand`, `setSizes`, `getSizes`, `isCollapsed`).
Internally the hook holds a ref the component populates on mount; the
public command methods go through that ref. All commands take pane ids
(strings).

**Alternative considered A.** Expose a `ref` on `Root` and let consumers
manage it themselves.

**Why rejected.** Forces consumers to handle ref plumbing (lift the ref,
pass it through context or props) for a common case (toolbar button
collapses the nav). The hook hides that.

**Alternative considered B.** State-hook-as-prop pattern (react-aria
style): hook owns state, `<Splitter.Root state={layout}>` reads from it
via `useSyncExternalStore`.

**Why rejected.** Nimbus' established public API uses
controlled/uncontrolled prop pairs, not state hooks as props. Grepping
the codebase, every public hook that returns state objects
(`useDisclosureState`, `useToggleState`, `useListState`) is consumed
*internally* by component implementations, not passed in by consumers.
Following the state-hook pattern would introduce a new convention for a
single component.

**API shape consumers see:**

```tsx
const layout = useSplitterLayout({
  initialSizes: { nav: 30, main: 70 },
  id: "ide",
});

<Splitter.Root
  panes={{
    nav:  { minSize: 10, collapsible: true },
    main: { minSize: 20 },
  }}
  defaultSizes={layout.defaultSizes}
  onSizesChange={layout.onSizesChange}
>
  <Splitter.Pane id="nav">…</Splitter.Pane>
  <Splitter.Handle />
  <Splitter.Pane id="main">…</Splitter.Pane>
</Splitter.Root>

// Elsewhere, with access to the same `layout`:
layout.collapse("nav");
layout.expand("nav");
layout.setSizes({ nav: 0, main: 100 });
```

## Decision 7: Naming — `Splitter` / `Pane` / `Handle`

- **`Splitter`** over `WindowSplitter` (drops irrelevant "window"
  connotation), `Resizable*` (capability-first reads worse in
  compositions like `AppLayout`), `SplitPane` (singular, not
  compound-friendly).
- **`Pane`** stays — it's the standard term across the field
  (`Panel` in RPP is essentially synonymous; `Pane` aligns with
  `SplitPane`).
- **`Handle`** over `Separator` for two reasons: (1) Nimbus already
  has a decorative `Separator` component, and (2) "handle" communicates
  "you grab this" — the part is interactive, not just a visual divider.
  The underlying ARIA role remains `separator` (per W3C spec); the
  rename is purely API-level.

## Decision 8: Drag clamps at min/max (no cascade)

Dragging the handle by Δ (in percentage points, after pixel→% conversion):

1. Attempt to grow the previous pane by Δ, shrink the next pane by Δ.
2. If the next pane would fall below its `minSize` (or below its
   `collapsedSize` when collapsible and the user is committing the
   collapse via Enter), clamp Δ to what fits. The handle stops at the
   boundary.
3. Mirror behaviour when Δ is negative (clamp at the previous pane's
   `minSize` / `maxSize` instead).

No cascade — with only two panes, there is nowhere to spill to. This
is a meaningful simplification over the N-pane case and removes the
biggest single chunk of complexity from comparable libraries.

The algorithm runs synchronously during `useMove` callbacks. The new
`sizes` record always sums to 100 (within floating-point tolerance).

## Decision 9: Per-pane configuration in Root's `panes` map

All per-pane settings — `defaultSize`, `minSize`, `maxSize`, `disabled`,
`collapsible`, `collapsedSize` — live in `Splitter.Root`'s `panes` prop
keyed by pane id. The previous `minValue` / `maxValue` / `step` /
`isDisabled` on `Root` are removed.

**Why.** Project rule: configuration on Root, not on sub-components.
With ids, this is a clean map; nothing leaks onto `<Splitter.Pane>`.

`keyboardStep` (formerly `step` on `Root`) stays on `Root`.

## Decision 10: Double-click restores defaults; Enter toggles collapse

**Decision.** Double-click on the handle restores the boundary to the
initial sizes derived on mount. Enter on the focused handle toggles
collapse of the adjacent collapsible pane. The two gestures bind to
different actions, not the same action.

**Alternatives considered.**

- **A. Double-click toggles collapse (same as Enter).** Pairs the mouse
  affordance with the keyboard one, giving the collapse feature two
  discoverable bindings.
- **B. Double-click restores defaults; Enter toggles collapse.**
  (Chosen.) Decouples the gestures so each does something on every
  splitter — including those that aren't collapsible.

**Why B over A.** Most splitters in real apps aren't collapsible
(e.g. a code editor's left/right pane split). Under A, double-click is
a no-op on those splitters — discoverable but useless, exactly the
case where a user would reach for the gesture to "reset". Under B,
double-click is meaningful everywhere: a single, intuitive way to undo
a stray drag. Collapse remains reachable via the keyboard (Enter on the
focused handle) and the imperative `useSplitterLayout.collapse(paneId)`.

The cost is that consumers who want a single mouse gesture for collapse
have to surface it themselves (a button, a context menu item). For the
collapsible case specifically that's a small ask — the consumer
already designed for collapsibility — and it keeps the primitive's
double-click contract uniform.

`isDoubleClickDisabled` on Root keeps the same name but now suppresses the
restore-defaults action.

## What's out of scope (recap)

- 3+ panes per splitter — see Decision 1; use nesting.
- Cascading resize — see Decision 8; not needed for 2 panes.
- Controlled `sizes` prop — see Decision 4.
- Multiple size units (px / rem / vh) — adds a constraint solver for no
  meaningful gain on top of % + min/max.
- `autoSaveId` baked into the component — see Decision 5.
- App-shell behaviour (responsive collapse, landmark slots, drawer
  fallback on narrow viewports) — explicit follow-up as `AppLayout`
  pattern component.
- Per-handle configuration — see Decision 3.
- State-hook-as-prop pattern — see Decision 6 alternative B.
