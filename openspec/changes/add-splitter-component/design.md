# Design: Splitter

This document captures the architectural decisions behind the Splitter
primitive. Each decision is paired with the alternative considered and the
trade-off accepted.

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

**Decision.** Sizes and per-pane config are keyed by pane `id` (a string),
not by integer index. `Splitter.Pane` carries only `id` and content; per-pane
settings live in a `panes: Record<string, PaneConfig>` prop on
`Splitter.Root`.

**Alternative considered.** Index-based: `defaultSizes: [number, number]`
on Root, per-pane settings as props on each `<Splitter.Pane>` child.

**Why rejected.** Even with only two panes, index-based has issues:

1. **Configuration drift across the codebase.** Per-pane props on `Pane`
   contradicts the project rule that configuration lives on Root.
2. **Fragile persistence.** Swapping the order of the two panes between
   releases invalidates every persisted layout; with ids, unknown ids
   are dropped and missing ids fall back to defaults.
3. **Readability.** `collapsedPane="nav"` and `sizes.nav` communicate
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

## Decision 4: Sizes are uncontrolled; collapse is controllable

**Decision.** Two stateful concerns, two idioms chosen by their update
frequency:

- **Sizes** are uncontrolled. The component owns the sizes state; the
  public props are `defaultSizes` (read once on mount), `onSizesChange`
  (live, every drag tick), and `onSizesChangeEnd` (fired once when an
  interaction settles). No `sizes` prop.
- **Collapse** is controllable state — `collapsedPane` /
  `defaultCollapsedPane` / `onCollapsedPaneChange` (a single pane id or
  `null`) — the standard Nimbus controlled/uncontrolled pair.

**Alternative considered.** A controlled `sizes` prop (full
controlled/uncontrolled pair, like collapse).

**Why rejected.** Drag interactions fire at ~60Hz. A controlled `sizes`
prop means every tick goes through consumer `setState` → re-render of the
consumer's tree. For an app-shell layout wrapping a large React tree
that's a real performance cost for no semantic win — splitter sizes are
UI ergonomics, not data the rest of the app needs to react to mid-drag.
`onSizesChangeEnd` gives a settled value once per interaction, which is
all persistence needs (no debounce). Collapse, by contrast, is discrete
and low-frequency, so the 60Hz argument does not apply — it gets the full
controlled pair so any control in the app can drive it.

**Cost accepted.** Sizes can't be force-set from outside via a prop.
That is acceptable: the only real cross-subtree need is collapse (a
toolbar button collapsing the nav), which the controlled `collapsedPane`
prop covers — see Decision 6.

## Decision 5: Persistence is consumer-wired, not baked in

**Decision.** The component ships no persistence machinery. Consumers
hydrate `defaultSizes` from whatever storage they choose and write back
in `onSizesChangeEnd`; collapse persists through its controlled
`collapsedPane` state. There is no bundled hook and no `autoSaveId`.

**Alternative considered.** An `autoSaveId`-style prop (as in
`react-resizable-panels`) — pass a string and the component writes to
`localStorage` automatically; or a bundled persistence hook that owns
loading, saving, and debouncing.

**Why rejected.** Both couple the component to a storage backend. Cookies
(for SSR), query params (for shareable layouts), server-side storage (for
cross-device persistence), or an external state store all become awkward
without escape hatches. They also pull hydration, SSR safety, debouncing,
and stored-value validation into the component — none of which belong to
its core job. Because `defaultSizes` and `onSizesChangeEnd` share the same
`Record<id, number>` shape, the round-trip is already a one-liner against
any storage, so a dedicated hook earns its surface area only marginally.

**Shape consumers see:**

```tsx
const [sizes, setSizes] = useStoredValue("ide-layout", { nav: 30, main: 70 });

<Splitter.Root
  defaultSizes={sizes}        // hydrate (read once on mount)
  onSizesChangeEnd={setSizes} // settled value → write back
  panes={{ nav: { minSize: 10, collapsible: true }, main: { minSize: 20 } }}
>
  …
</Splitter.Root>;
```

## Decision 6: Cross-subtree control is plain controlled state, not a ref

**Decision.** Collapsing a pane from outside the splitter subtree (a
header or toolbar button) is done with the controlled `collapsedPane`
prop driven by ordinary `useState`. There is no imperative ref or command
object.

**Alternative considered A.** Expose an imperative `ref` (or a bundled
hook holding one) on `Root` with `collapse(id)` / `expand(id)` commands.

**Why rejected.** Forces consumers into ref plumbing (lift the ref, thread
it through context or props) for what is plain state: "which pane is
collapsed." Controlled state lifts naturally and reads declaratively.

**Alternative considered B.** State-hook-as-prop pattern (React Aria
style): a hook owns state, `<Splitter.Root state={…}>` reads it via
`useSyncExternalStore`.

**Why rejected.** Nimbus' established public API uses
controlled/uncontrolled prop pairs, not state hooks as props. Every public
hook in the codebase that returns a state object (`useDisclosureState`,
`useToggleState`, `useListState`) is consumed *internally* by component
implementations, not passed in by consumers. Following the state-hook
pattern would introduce a new convention for a single component.

**Shape consumers see:**

```tsx
const [collapsed, setCollapsed] = useState<string | null>(null);

<Button onPress={() => setCollapsed((c) => (c === "nav" ? null : "nav"))}>
  Toggle nav
</Button>
<Splitter.Root
  collapsedPane={collapsed}
  onCollapsedPaneChange={setCollapsed}
  panes={{ nav: { minSize: 10, collapsible: true }, main: { minSize: 20 } }}
>
  …
</Splitter.Root>;
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

## Decision 8: Drag clamps at the boundary (no cascade)

Dragging the handle by Δ (in percentage points, after pixel→% conversion):

1. Attempt to grow the previous pane by Δ, shrink the next pane by Δ.
2. If the next pane would fall below its `minSize` (or below its
   `collapsedSize` when collapsible and the user is committing the
   collapse via Enter), clamp Δ to what fits. The handle stops at the
   boundary.
3. Mirror behaviour when Δ is negative (clamp at the previous pane's
   `minSize` instead — which is the next pane's derived upper bound).

No cascade — with only two panes, there is nowhere to spill to. This
is a meaningful simplification over the N-pane case and removes the
biggest single chunk of complexity from comparable libraries.

The algorithm runs synchronously during `useMove` callbacks. The new
`sizes` record always sums to 100 (within floating-point tolerance).

## Decision 9: Per-pane configuration in Root's `panes` map

Static per-pane settings — `minSize`, `collapsible`, `collapsedSize` —
live in `Splitter.Root`'s `panes` prop keyed by pane id. There is no
`maxSize` (a pane's upper bound is derived as `100 − partner.minSize`, so
a single value per side fully describes the one boundary) and no per-pane
`defaultSize` (initial proportions come from the single `defaultSizes`
prop on Root). Per-pane disabling is not a knob either — `isDisabled` on
Root disables the whole splitter, per the Nimbus `isDisabled` convention.

**Why.** Project rule: configuration on Root, not on sub-components. With
ids, this is a clean map; nothing leaks onto `<Splitter.Pane>`. Splitting
sizing by lifecycle — dynamic proportions in `defaultSizes` (which
round-trips with the size callbacks), static constraints in `panes` —
keeps each prop single-purpose. `keyboardStep` and `isDoubleClickDisabled`
likewise live on Root.

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
focused handle) and the controlled `collapsedPane` prop.

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
  meaningful gain on top of % + min.
- Baked-in persistence (`autoSaveId`, bundled hook) — see Decision 5.
- App-shell behaviour (responsive collapse, landmark slots, drawer
  fallback on narrow viewports) — explicit follow-up as `AppLayout`
  pattern component.
- Per-handle configuration — see Decision 3.
- Imperative ref / state-hook-as-prop for cross-subtree control — see
  Decision 6.
