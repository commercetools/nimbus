# Change: Add Splitter component

## Why

Nimbus has no primitive for user-resizable panes. The unmerged `window-splitter`
branch (8 commits, last touched 2025-06) is a 2-pane proof of concept that
never landed because the API choices were premature: it conflated two distinct
problems (app-shell layout vs. user-driven resize), it was hardcoded to exactly
two panes via a single `value: number` state model, and it had no story for
cross-app commands, persistence, or collapsibility.

This change reshapes that work into a focused primitive — `Splitter` — that
solves one job well: **users dragging boundaries between N panes, with
predictable cascading behaviour and a clean integration story for persistence
and cross-app commands.**

App-shell layouts (nav + main + aside, responsive collapse to drawers) are
explicitly **not** in scope here. Those belong in a follow-up pattern component
(`AppLayout` or similar) that composes `Splitter` and adds breakpoint logic.
Keeping the primitive pure means the same component works for IDE-style panes,
diff viewers, mail preview panels, and any other case where a user wants to
drag a boundary and have it stick.

## What Changes

**Component:** `Splitter` (compound: `Root` / `Pane` / `Handle`).

### Renames from the `window-splitter` branch

- `WindowSplitter` → `Splitter` (drops "Window" — accurate to W3C lineage but
  carries OS-window baggage, and no other React library uses it)
- `WindowSplitter.Separator` → `Splitter.Handle` (the part is interactive; the
  existing `Separator` component in Nimbus is decorative, so name collision is
  avoided and the affordance is clearer)
- Component directory `window-splitter/` → `splitter/`

### N-pane support (replaces 2-pane hardcoding)

- Root state changes from `value: number` (0–100) to `sizes: number[]`
  (percentages summing to 100), with one entry per `Pane` child.
- `isPrimary` is removed from `Pane`. Each pane just reads its own index out
  of `sizes`.
- Multiple `Handle` children are allowed — one between each adjacent pair of
  panes. Handles are auto-indexed by child order.
- Cascading resize: dragging handle *i* attempts to shift size between pane
  *i* and pane *i+1*. If the neighbour is at its `minSize`/`maxSize`, the
  remainder cascades to pane *i+2*, and so on.

### Uncontrolled component, hook-driven persistence

- The component is **uncontrolled**. Props are `defaultSizes: number[]` (read
  once on mount) and `onSizesChange: (sizes: number[]) => void` (notification
  callback). There is no `sizes` prop.
- A new `useSplitterLayout` hook handles persistence and cross-app commands
  in one object:
  ```ts
  const layout = useSplitterLayout({
    initialSizes: [20, 60, 20],
    id?: string,                        // localStorage key
    storage?: { load(): number[] | undefined; save(sizes: number[]): void },
    debounceMs?: number,                // default 200
  });
  ```
  Returns: `{ defaultSizes, onSizesChange, collapse, expand, setSizes,
  getSizes, isCollapsed }`.
- Internally the hook holds a ref the component populates on mount; commands
  go through that ref. State stays inside the component, drag never
  re-renders the consumer tree.

### Per-pane configuration

- `defaultSize`, `minSize`, `maxSize`, `disabled`, `collapsible`,
  `collapsedSize`, `onCollapse`, `onExpand` all live on `Pane`, not on `Root`.
- Removes `minValue`, `maxValue`, `step`, `isDisabled` from `Root` (`step`
  moves to `Handle` as `keyboardStep`).

### Collapsible panes (new)

- `collapsible` + `collapsedSize` on `Pane`.
- `onCollapse` / `onExpand` notification callbacks.
- Double-click on `Handle` toggles collapse of the adjacent collapsible pane
  (closest one wins, prefer the smaller side). Configurable via
  `disableDoubleClick` on `Handle`.
- Keyboard: Enter on a focused `Handle` toggles collapse of the same neighbour
  as double-click. Replaces the current hardcoded "Enter jumps to minValue
  then back to 50" behaviour.

### What stays the same

- `orientation: "horizontal" | "vertical"` on `Root`.
- React Aria integration on `Handle` (`useSeparator`, `useMove`, `useFocusRing`).
- ARIA model: each `Handle` is `role="separator"` with `aria-valuenow`,
  `aria-valuemin`, `aria-valuemax`, `aria-orientation`, `aria-controls`
  pointing at the primary pane it resizes (pane *i*).
- Keyboard model on `Handle`: arrow keys move by `keyboardStep`
  (orientation-aware), Home/End jump the adjacent boundary to its bounds.

### Explicit non-goals

- **No controlled `sizes` prop.** The drag loop runs at ~60Hz; forcing
  controlled state means every tick re-renders the consumer's tree.
  Uncontrolled + imperative-via-hook covers every real use case without that
  cost.
- **No multi-unit sizes** (px / rem / vh). Percentages only. Mixing units
  requires a constraint solver and matches no pattern in Nimbus.
- **No baked-in `autoSaveId`.** Persistence lives in `useSplitterLayout` so
  consumers choose the storage (localStorage, sessionStorage, cookie, server).
- **No app-shell behaviour.** Responsive collapse, drawer fallbacks on narrow
  viewports, landmark slots (`<nav>`/`<main>`/`<aside>`) — all deferred to a
  separate `AppLayout` pattern component that composes `Splitter`.
- **No state-hook-as-prop pattern** (react-aria's `useToggleState` /
  `useDisclosureState` shape). Nimbus' public API consistently uses
  controlled/uncontrolled prop pairs; the imperative-commands-via-hook approach
  here keeps that convention while solving the cross-app command case.

## Supersedes

This change supersedes the unmerged `window-splitter` branch. The directory
structure, recipe scaffolding, react-aria integration patterns, and existing
stories will be reused, but the public API (component name, prop shape, state
model) is replaced. The branch will be rebased onto this proposal's
implementation rather than merged as-is.

## Impact

- **Affected specs:** `nimbus-splitter` (new capability).
- **Affected code:**
  - **NEW**: `packages/nimbus/src/components/splitter/` (replaces
    `window-splitter/`)
  - **MODIFIED**: `packages/nimbus/src/components/index.ts` (export
    `./splitter` instead of `./window-splitter`)
  - **MODIFIED**: `packages/nimbus/src/theme/slot-recipes/index.ts` (register
    `splitterSlotRecipe`)
- **Consumers:** none yet — `window-splitter` never shipped. No breaking
  changes for downstream code.
