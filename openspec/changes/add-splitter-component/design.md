# Design: Splitter

This document captures the architectural decisions behind the Splitter
primitive and the reasoning recorded during proposal discussion. Each
decision is paired with the alternative considered and the trade-off
accepted.

## Decision 1: N-pane primitive, not 2-pane

**Decision.** `Splitter.Root` accepts ≥ 2 `Pane` children with N − 1 `Handle`
children between them. State is `sizes: number[]` summing to 100.

**Alternative considered.** Keep the 2-pane API and require nesting for
three-column layouts. Implementation simpler (no cascading resize), each
splitter is a closed system.

**Why rejected.** Nesting forces a hierarchical structure on what the user
perceives as peer regions. For an IDE-style three-pane workspace (tree |
editor | terminal), nesting communicates a relationship that doesn't exist.
N-pane gives an honest AT tree where peers are peers. Nesting remains
possible (a `Splitter` inside a `Pane` still works) for the cases where the
hierarchy is real — but it's not forced.

**Cost accepted.** Cascading resize when neighbours hit `minSize`/`maxSize`
is non-trivial logic with a meaningful test surface. This is the same
algorithm `react-resizable-panels` spends most of its source on.

## Decision 2: Uncontrolled-only

**Decision.** The component owns its sizes state internally. Public props are
`defaultSizes` (read once on mount) and `onSizesChange` (notification only).
No `sizes` prop.

**Alternative considered.** Standard Nimbus controlled/uncontrolled prop pair
(`sizes` + `onSizesChange` + `defaultSizes`).

**Why rejected.** Drag interactions fire at ~60Hz. A controlled prop means
every tick goes through consumer `setState` → re-render of the consumer's
tree. For an app-shell layout that wraps a large React tree, that's a
real performance cost for no semantic win — splitter sizes are UI
ergonomics, not data the rest of the app needs to react to mid-drag.

**Cost accepted.** Cross-app commands (collapse the nav from a header
button) can't be done by lifting state up. We solve this with an imperative
command channel surfaced through the persistence hook — see Decision 4.

## Decision 3: Hook owns persistence, not the component

**Decision.** `useSplitterLayout` handles loading initial sizes from storage,
saving on change, and debouncing. The component remains a pure controllable
primitive.

**Alternative considered.** RPP's `autoSaveId` pattern — pass a string to the
component, it writes to `localStorage` automatically.

**Why rejected.** Couples the component to a specific storage backend.
Cookies (for SSR), query params (for shareable layouts), server-side
storage (for cross-device persistence), or external state stores all become
impossible without escape hatches. Also forces the component to handle
hydration, SSR safety, debouncing, and stored-value validation — none of
which belong to its core job.

**Hook contract:**

```ts
function useSplitterLayout(options: {
  initialSizes: number[];
  id?: string;                            // → localStorage key
  storage?: {                              // custom adapter, overrides `id`
    load(): number[] | undefined;
    save(sizes: number[]): void;
  };
  debounceMs?: number;                     // default 200
}): SplitterLayout;
```

The hook validates stored values against `initialSizes`:

- **Length mismatch** (stored `[20, 60, 20]` but `initialSizes` is `[25, 75]`,
  e.g. a pane was removed between releases) → fall back to `initialSizes`.
- **Sum ≠ 100** → normalize, or fall back if normalization would drop a
  pane below 0.
- **SSR** → first render returns `initialSizes` synchronously when
  `typeof window === "undefined"`; client read happens on first render
  guarded by `typeof window !== "undefined"`. No `useEffect` hydration
  flicker.

## Decision 4: Imperative commands flow through the hook, not a ref

**Decision.** `useSplitterLayout` returns an object containing both the props
to spread on `Root` (`defaultSizes`, `onSizesChange`) and the commands
(`collapse`, `expand`, `setSizes`, `getSizes`, `isCollapsed`). Internally the
hook holds a ref the component populates on mount; the public command methods
go through that ref.

**Alternative considered A.** Expose a `ref` on `Root` and let consumers
manage it themselves.

**Why rejected.** Forces consumers to handle ref plumbing (lift the ref, pass
it through context or props) for a common case (toolbar button collapses
the nav). The hook hides that.

**Alternative considered B.** State-hook-as-prop pattern (react-aria style):
hook owns state, `<Splitter.Root state={layout}>` reads from it via
`useSyncExternalStore`.

**Why rejected.** Nimbus' established public API uses controlled/uncontrolled
prop pairs, not state hooks as props. Grepping the codebase, every public
hook that returns state objects (`useDisclosureState`, `useToggleState`,
`useListState`) is consumed *internally* by component implementations, not
passed in by consumers. Following the state-hook pattern would introduce a
new convention for a single component.

**API shape consumers see:**

```tsx
const layout = useSplitterLayout({ initialSizes: [20, 60, 20], id: "ide" });

<Splitter.Root defaultSizes={layout.defaultSizes}
               onSizesChange={layout.onSizesChange}>…</Splitter.Root>

// Elsewhere, with access to the same `layout`:
layout.collapse(0);
layout.expand(0);
layout.setSizes([0, 70, 30]);
```

## Decision 5: Naming — `Splitter` / `Pane` / `Handle`

- **`Splitter`** over `WindowSplitter` (drops irrelevant "window"
  connotation), `Resizable*` (capability-first reads worse in compositions
  like `AppLayout`), `SplitPane` (singular, not compound-friendly).
- **`Pane`** stays — it's the standard term across the field
  (`Panel` in RPP is essentially synonymous; `Pane` aligns with
  `SplitPane`).
- **`Handle`** over `Separator` for two reasons: (1) Nimbus already has a
  decorative `Separator` component, and (2) "handle" communicates "you
  grab this" — the part is interactive, not just a visual divider. The
  underlying ARIA role remains `separator` (per W3C spec); the rename is
  purely API-level.

## Decision 6: Cascading resize algorithm

Dragging `Handle[i]` by Δ (in percentage points, after pixel→% conversion):

1. Attempt to grow `Pane[i]` by Δ, shrink `Pane[i+1]` by Δ.
2. If `Pane[i+1]` would fall below `minSize` (or below `collapsedSize` when
   collapsible and the user is committing the collapse via Enter / double-
   click), clamp it and cascade the remainder to `Pane[i+2]`, then `Pane[i+3]`,
   etc.
3. Mirror behaviour when Δ is negative (cascade left/up instead).
4. If cascading reaches the boundary, clamp Δ — the handle stops moving.

The algorithm runs synchronously during `useMove` callbacks. The new `sizes`
array always sums to 100 (within floating-point tolerance).

## Decision 7: Per-pane configuration over Root-level configuration

`defaultSize`, `minSize`, `maxSize`, `disabled`, `collapsible`,
`collapsedSize`, `onCollapse`, `onExpand` all live on `Pane`. The previous
`minValue`/`maxValue`/`step`/`isDisabled` on `Root` are removed.

**Why.** Per-pane configuration is what every comparable library does (RPP,
Allotment) and it scales to N panes cleanly. Root-level `minValue`/`maxValue`
made sense only because the 2-pane state was a single `value: 0–100`. With
`sizes: number[]`, each pane has its own constraints naturally.

`keyboardStep` (formerly `step` on `Root`) moves to `Handle` because in a
multi-handle splitter, different boundaries can reasonably have different
keyboard step sizes (a fine adjustment on a small pane, coarser on a large
one).

## What's out of scope (recap)

- Controlled `sizes` prop — see Decision 2.
- Multiple size units (px / rem / vh) — adds a constraint solver for no
  meaningful gain on top of % + min/max.
- `autoSaveId` baked into the component — see Decision 3.
- Persistence-aware SSR primitives beyond what the hook does — consumers
  with SSR can use the custom `storage` adapter with cookies.
- App-shell behaviour (responsive collapse, landmark slots, drawer fallback
  on narrow viewports) — explicit follow-up as `AppLayout` pattern component.
- State-hook-as-prop pattern — see Decision 4 alternative B.
