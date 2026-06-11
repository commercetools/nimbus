# Design: Splitter

This document captures the architectural decisions behind the Splitter
primitive. Each decision is paired with the alternative considered and the
trade-off accepted.

## Decision 1: 2-pane primitive, composable via nesting

**Decision.** `Splitter.Root` accepts one `Splitter.Aside` and one
`Splitter.Main` child with one `Handle` between them. Layouts requiring more
than two panes are expressed by nesting one `Splitter` inside another's pane.

**Alternative considered.** Flat N-pane: ≥ 2 pane children with N − 1
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

## Decision 2: A single aside dimension, designated by component type

**Decision.** A 2-pane splitter has one boundary — one degree of freedom — so
the size is a single number: the **aside**'s percentage (`size` /
`defaultSize`). The **main** pane always takes the remainder (`100 − size`). The
two panes are distinct components — `Splitter.Aside` (the configured, sized one)
and `Splitter.Main` — so the role is designated by the component *type*, not by
an id or a pointer prop. Sizing/collapse config is flat on `Splitter.Root`. Pane
`id` is optional (analytics / test hooks).

**Alternatives considered.**

- **A. Id-keyed record.** A generic `Splitter.Pane id="…"`, with
  `defaultSizes: Record<id, number>` summing to 100 and a `panes` config map
  keyed by id.
- **B. Index/position-based.** `defaultSizes: [number, number]`, the first child
  always primary.

**Why rejected.** Both over-express the one degree of freedom. The record forces
consumers to maintain two interdependent numbers that must sum to 100 (and a
parallel id-keyed config map), when only one number is free. Index/position makes
"which child is sized" invisible at the call site and fragile under reorder.
Naming the sized pane by type (`Splitter.Aside`) makes the single `size` number
unambiguous, removes the record and the config map, and lets the aside sit on
either side without changing what `size` means.

**Cost accepted.** A consumer who thinks "the main pane should be at least 40%"
expresses it as the aside's `maxSize` (`100 − 40 = 60`) rather than a
main-specific prop — one small mental step, in exchange for keeping all config
on the single configured pane. Collapse is likewise aside-only (Decision 6).

## Decision 3: Anonymous handle

**Decision.** `Splitter.Handle` carries no `id` and no per-handle config
props. Behaviour (`keyboardStep`, `isDoubleClickDisabled`, default
`aria-label`) lives on `Root`. The handle infers the two panes it
controls from its sibling panes in DOM order, and its ARIA value tracks the
leading pane (so it is correct whether the aside leads or trails).

**Alternative considered.** Per-handle config via an `id` + `handles` map
on Root.

**Why rejected.** A 2-pane splitter has exactly one handle; there is
nothing to differentiate per handle. The config-on-Root rule applies to
the single handle just as well as it would to many.

**Cost accepted.** None within the 2-pane shape.

## Decision 4: Size is uncontrolled by default (optional settle-only control); collapse is controllable

**Decision.** Two stateful concerns, two idioms chosen by their update
frequency:

- **Size** is uncontrolled by default. The component owns the aside size; the
  public props are `defaultSize` (read once on mount), `onSizeChange` (live,
  every drag tick), and `onSizeChangeEnd` (fired once when an interaction
  settles). An optional **settle-only** `size` prop adds controlled-at-rest
  behaviour without the 60Hz cost (see below). All emit/accept a single number.
- **Collapse** is controllable state — `collapsed` / `defaultCollapsed` /
  `onCollapsedChange` (a boolean) — the standard Nimbus controlled/uncontrolled
  pair.

**Alternative considered.** A *live* controlled `size` prop where the
prop is the render source on every drag tick.

**Why rejected.** Drag fires at ~60Hz. A live-controlled `size` prop
means every tick goes through consumer `setState` → re-render of the
consumer's tree, because the handle can only move once the prop comes
back. For an app-shell wrapping a large React tree that's a real cost for
no semantic win — splitter sizes are UI ergonomics, not data the rest of
the app reacts to mid-drag.

**What we adopted instead.** An optional **settle-only** controlled
`size` prop. Internal state stays the render source and the authority
*during* interaction (drag/keyboard need no consumer feedback, so the
60Hz cost above never applies), and the prop is reconciled into state
only when it *changes* (the settle seam) — mirroring the `collapsed`
controlled pattern. `onSizeChange`/`onSizeChangeEnd` are unchanged.
This unlocks in-place, per-breakpoint layout control without remounting
panes (a `key` swap would tear down pane content), which `defaultSize` +
`onSizeChangeEnd` alone cannot do.

**Details.** Reconcile is effect-based, so a consumer that sets `size`
but ignores `onSizeChangeEnd` keeps the last interactive value (no
snap-back) and behaves as uncontrolled thereafter — dev-warned. Inbound
values are clamped into `0–100` but not `minSize`-clamped (the next
interaction re-clamps). When both `size` and `collapsed` are controlled
and disagree, collapse wins (the aside stays at `collapsedSize`, and the
controlled `size` governs the expanded proportion).

## Decision 5: Persistence is consumer-wired, not baked in

**Decision.** The component ships no persistence machinery. Consumers
hydrate `defaultSize` from whatever storage they choose and write back
in `onSizeChangeEnd`; collapse persists through its controlled
`collapsed` boolean. There is no bundled hook and no `autoSaveId`.

**Alternative considered.** An `autoSaveId`-style prop (as in
`react-resizable-panels`) — pass a string and the component writes to
`localStorage` automatically; or a bundled persistence hook that owns
loading, saving, and debouncing.

**Why rejected.** Both couple the component to a storage backend. Cookies
(for SSR), query params (for shareable layouts), server-side storage (for
cross-device persistence), or an external state store all become awkward
without escape hatches. Because the size is a single number that
`onSizeChangeEnd` emits and `defaultSize` accepts, the round-trip is already a
one-liner against any storage, so a dedicated hook earns its surface area only
marginally. (A pixel-aware companion hook — converting px intents to the
percentage the component consumes — is a separate, later effort and is
explicitly out of scope here.)

**Shape consumers see:**

```tsx
const [size, setSize] = useStoredValue("ide-layout", 30);

<Splitter.Root
  defaultSize={size} // hydrate (read once on mount)
  onSizeChangeEnd={setSize} // settled value → write back
  minSize={10}
  maxSize={80}
>
  <Splitter.Aside>…</Splitter.Aside>
  <Splitter.Handle />
  <Splitter.Main>…</Splitter.Main>
</Splitter.Root>;
```

## Decision 6: Cross-subtree control is plain controlled state, not a ref

**Decision.** Collapsing the aside from outside the splitter subtree (a
header or toolbar button) is done with the controlled `collapsed` boolean
driven by ordinary `useState`. Only the aside collapses, so the state is a
boolean — not an id. There is no imperative ref or command object.

**Alternative considered A.** Expose an imperative `ref` (or a bundled
hook holding one) on `Root` with `collapse()` / `expand()` commands.

**Why rejected.** Forces consumers into ref plumbing (lift the ref, thread
it through context or props) for what is plain state: "is the aside
collapsed." Controlled state lifts naturally and reads declaratively.

**Alternative considered B.** State-hook-as-prop pattern (React Aria
style): a hook owns state, `<Splitter.Root state={…}>` reads it via
`useSyncExternalStore`.

**Why rejected.** Nimbus' established public API uses
controlled/uncontrolled prop pairs, not state hooks as props. Following the
state-hook pattern would introduce a new convention for a single component.

**Shape consumers see:**

```tsx
const [collapsed, setCollapsed] = useState(false);

<Button onPress={() => setCollapsed((c) => !c)}>Toggle nav</Button>
<Splitter.Root
  collapsible
  collapsed={collapsed}
  onCollapsedChange={setCollapsed}
  minSize={10}
  maxSize={80}
>
  <Splitter.Aside>…</Splitter.Aside>
  <Splitter.Handle />
  <Splitter.Main>…</Splitter.Main>
</Splitter.Root>;
```

## Decision 7: Naming — `Splitter` / `Aside` / `Main` / `Handle`

- **`Splitter`** over `WindowSplitter` (drops irrelevant "window"
  connotation), `Resizable*` (capability-first reads worse in
  compositions like `AppLayout`), `SplitPane` (singular, not
  compound-friendly).
- **`Aside` / `Main`** over a generic `Pane`. The two panes of an app-shell
  split are not peers — one is the primary content area, the other a
  supporting rail. Naming them by role makes the single `size` number
  unambiguous (it is always the aside's), removes the need for ids or a
  `primaryPane` pointer, and reads as the layout intent at the call site.
  `Main` carries the `<main>`-adjacent "primary content" connotation; `Aside`
  the supporting one.
- **`Handle`** over `Separator` for two reasons: (1) Nimbus already
  has a decorative `Separator` component, and (2) "handle" communicates
  "you grab this" — the part is interactive, not just a visual divider.
  The underlying ARIA role remains `separator` (per W3C spec); the
  rename is purely API-level.

## Decision 8: Drag clamps at the boundary (no cascade)

Dragging the handle by Δ (in percentage points, after pixel→% conversion):

1. Translate the gesture (grow the leading pane by Δ) into an aside Δ: aside
   leading → `+Δ`, aside trailing → `−Δ`.
2. Apply the aside Δ, clamped into the aside's `[minSize, maxSize]` window. The
   handle stops at the boundary; because the main pane is the remainder,
   `maxSize` is also the main pane's floor (`100 − maxSize`).

No cascade — with only two panes, there is nowhere to spill to. This
is a meaningful simplification over the N-pane case and removes the
biggest single chunk of complexity from comparable libraries.

The algorithm runs synchronously during `useMove` callbacks, preserving full
float precision (no rounding).

## Decision 9: Flat aside configuration on Root

Static sizing settings — `minSize`, `maxSize`, `collapsible`, `collapsedSize` —
are flat props on `Splitter.Root` and describe the aside. There is no per-pane
config map (the role-by-type design removes the need to key config by id) and no
per-pane `defaultSize` (the initial proportion is the single `defaultSize` on
Root). Per-pane disabling is not a knob either — `isDisabled` on Root disables
the whole splitter, per the Nimbus `isDisabled` convention.

**Why.** Project rule: configuration on Root, not on sub-components. With one
configured pane (the aside), the config is a flat handful of props rather than a
keyed map. `maxSize` bounds the main pane's floor as the complement, so the one
aside window fully describes both sides of the single boundary. `keyboardStep`
and `isDoubleClickDisabled` likewise live on Root.

## Decision 10: Double-click restores defaults; Enter toggles collapse

**Decision.** Double-click on the handle restores the boundary to the
initial size derived on mount. Enter on the focused handle toggles the
aside's collapse (when collapsible). The two gestures bind to different
actions, not the same action.

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
focused handle) and the controlled `collapsed` prop.

`isDoubleClickDisabled` on Root keeps the same name but now suppresses the
restore-defaults action.

## What's out of scope (recap)

- 3+ panes per splitter — see Decision 1; use nesting.
- Cascading resize — see Decision 8; not needed for 2 panes.
- Live controlled `size` prop — see Decision 4 (settle-only only).
- Multiple size units (px / rem / vh) and a pixel-aware companion hook — a
  separate, later effort; the component consumes percentages only.
- Baked-in persistence (`autoSaveId`, bundled hook) — see Decision 5.
- App-shell behaviour (responsive collapse, landmark slots, drawer
  fallback on narrow viewports) — explicit follow-up as `AppLayout`
  pattern component.
- Per-handle configuration — see Decision 3.
- Imperative ref / state-hook-as-prop for cross-subtree control — see
  Decision 6.
