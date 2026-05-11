# Specification: Splitter

## Overview

The Splitter component provides a compound primitive for user-resizable panes.
A `Splitter.Root` contains N ≥ 2 `Splitter.Pane` children with N − 1
`Splitter.Handle` children between them. Users drag handles (or use the
keyboard) to redistribute space between adjacent panes; the component owns
its sizes state internally. A companion `useSplitterLayout` hook supplies
persistence and cross-component imperative commands without forcing a
controlled prop.

The Splitter is the primitive for user-driven resize. App-shell layout
behaviour (responsive collapse to drawers, landmark slot semantics) is not
part of this component and belongs to a separate pattern component.

**Component:** `Splitter` (compound API: `Root`, `Pane`, `Handle`)
**Hook:** `useSplitterLayout`
**Package:** `@commercetools/nimbus`
**Category:** Layout

## ADDED Requirements

### Requirement: Compound API with N panes and N−1 handles

The component SHALL accept ≥ 2 `Splitter.Pane` children and exactly one
`Splitter.Handle` between each adjacent pair of panes.

#### Scenario: Two-pane layout

- **WHEN** `<Splitter.Root>` contains two `Pane` children with one `Handle`
  between them
- **THEN** SHALL render the two panes side by side with a draggable handle
  on the boundary

#### Scenario: Three-pane layout

- **WHEN** `<Splitter.Root>` contains three `Pane` children with two
  `Handle` children interleaved (Pane, Handle, Pane, Handle, Pane)
- **THEN** SHALL render three panes in order with two independently
  draggable handles, each controlling its own adjacent boundary

#### Scenario: Mismatched handle count

- **WHEN** the number of `Handle` children is not exactly `(Pane count − 1)`
- **THEN** SHALL emit a development-time warning and render best-effort
  (handles index by registration order, extra handles are ignored, missing
  handles leave that boundary non-draggable)

### Requirement: Uncontrolled state model

The component SHALL own its `sizes` state internally and expose it only via
`defaultSizes` (initial value, read once) and `onSizesChange` (notification).

#### Scenario: Initial sizes from `defaultSizes`

- **WHEN** `<Splitter.Root defaultSizes={[20, 60, 20]}>` is rendered
- **THEN** SHALL initialize internal sizes to `[20, 60, 20]`
- **AND** SHALL ignore subsequent prop changes to `defaultSizes`

#### Scenario: Initial sizes from per-pane `defaultSize`

- **WHEN** `defaultSizes` is omitted but each `Pane` has a `defaultSize`
  prop
- **THEN** SHALL initialize sizes from per-pane `defaultSize` values
- **AND** SHALL normalize the result to sum to 100 (within floating-point
  tolerance)

#### Scenario: Initial sizes with no defaults

- **WHEN** neither `defaultSizes` nor any `Pane.defaultSize` is provided
- **THEN** SHALL distribute 100 equally across panes (100 / N each)

#### Scenario: `onSizesChange` fires on every size update

- **WHEN** the user drags a handle, presses an arrow key on a focused
  handle, double-clicks a handle to collapse, or any imperative command
  mutates sizes
- **THEN** SHALL call `onSizesChange(newSizes)` with the post-change `sizes`
  array (summing to 100)

### Requirement: Per-pane size constraints and cascading resize

Each `Pane` SHALL accept `minSize` (default 0) and `maxSize` (default 100).
Drag operations on a handle SHALL cascade through subsequent panes when an
adjacent pane reaches its `minSize` or `maxSize`.

#### Scenario: Drag respects neighbour `minSize`

- **GIVEN** three panes with `minSize={10}` on each, current sizes `[30, 40,
  30]`
- **WHEN** the user drags handle 0 to attempt sizes `[35, 35, 30]`
- **THEN** SHALL apply normally — no boundary hit

#### Scenario: Drag cascades when neighbour reaches `minSize`

- **GIVEN** three panes with `minSize={10}` on each, current sizes `[30, 15,
  55]`
- **WHEN** the user drags handle 0 to grow pane 0 by 20 percentage points
  (target sizes `[50, -5, 55]`)
- **THEN** SHALL clamp pane 1 to `minSize` (10) and cascade the remaining
  shrink to pane 2
- **AND** SHALL produce final sizes `[50, 10, 40]` (sum = 100)

#### Scenario: Drag stops at boundary when cascade exhausted

- **GIVEN** sizes `[30, 10, 10, 50]` with all `minSize` = 10
- **WHEN** the user attempts to grow pane 0 by 25 (would require shrinking
  panes 1 and 2 below `minSize` and pane 3 by 5)
- **THEN** SHALL shrink pane 3 by 5 (its only available room) and clamp the
  drag so pane 0 grows by only 5
- **AND** SHALL produce sizes `[35, 10, 10, 45]`

#### Scenario: Drag respects `maxSize`

- **GIVEN** two panes with pane 0 `maxSize={70}`, current sizes `[60, 40]`
- **WHEN** the user drags handle 0 to attempt sizes `[80, 20]`
- **THEN** SHALL clamp pane 0 to its `maxSize` (70) and produce sizes
  `[70, 30]`

### Requirement: Collapsible panes

A `Pane` with `collapsible` SHALL support being collapsed to its
`collapsedSize` (default 0) via double-click on an adjacent handle, the
Enter key on a focused adjacent handle, or the imperative `collapse(index)`
command from the layout hook.

#### Scenario: Double-click collapses adjacent collapsible pane

- **GIVEN** sizes `[20, 60, 20]` with pane 0 `collapsible` and
  `collapsedSize={0}`
- **WHEN** the user double-clicks handle 0
- **THEN** SHALL set pane 0 size to 0
- **AND** SHALL redistribute the freed 20 to pane 1 (closest neighbour
  first, cascading further if pane 1 has a `maxSize`)
- **AND** SHALL fire `onCollapse` on pane 0
- **AND** SHALL produce sizes summing to 100

#### Scenario: Double-click on handle with two collapsible neighbours

- **GIVEN** both panes adjacent to handle *i* are `collapsible`
- **WHEN** the user double-clicks handle *i*
- **THEN** SHALL collapse the smaller of the two adjacent panes
- **AND** SHALL break ties by preferring the lower-indexed (left/top) pane

#### Scenario: Double-click is disabled

- **WHEN** `<Splitter.Handle disableDoubleClick>` is set
- **THEN** SHALL NOT collapse on double-click
- **AND** SHALL NOT prevent other handle interactions (drag, keyboard)

#### Scenario: Enter on focused handle toggles collapse

- **GIVEN** sizes `[20, 60, 20]` with pane 0 `collapsible`
- **WHEN** handle 0 has keyboard focus and Enter is pressed
- **THEN** SHALL collapse pane 0 if not currently collapsed
- **OR** SHALL expand pane 0 to its `defaultSize` if currently collapsed

#### Scenario: `onExpand` fires when leaving collapsed state

- **GIVEN** a collapsed pane (size === `collapsedSize`)
- **WHEN** any operation increases the pane's size above `collapsedSize`
- **THEN** SHALL fire `onExpand` exactly once for that transition

### Requirement: Keyboard navigation on handles

Each `Handle` SHALL be focusable, have `role="separator"`, and respond to
arrow keys, Home, End, and Enter according to the W3C window splitter
pattern, with cascade-aware updates.

#### Scenario: Arrow keys on a horizontal handle

- **GIVEN** `<Splitter.Root orientation="horizontal">` with focused handle
  and `keyboardStep` default of 5
- **WHEN** the user presses ArrowRight
- **THEN** SHALL apply Δ = +5 percentage points via the cascade-resize
  algorithm (growing the left pane, shrinking the right with cascade)
- **AND** SHALL emit `onSizesChange` with the new sizes
- **AND** SHALL prevent default browser scroll

#### Scenario: Arrow keys on a vertical handle

- **GIVEN** `<Splitter.Root orientation="vertical">` with focused handle
- **WHEN** the user presses ArrowDown
- **THEN** SHALL apply Δ = +5 to grow the upper pane and shrink the lower

#### Scenario: Home/End jump to bounds

- **GIVEN** a focused handle controlling boundary between pane *i* and pane
  *i+1*
- **WHEN** the user presses Home
- **THEN** SHALL shrink pane *i* to its `minSize` (cascading as needed) and
  grow pane *i+1* accordingly
- **WHEN** the user presses End
- **THEN** SHALL grow pane *i* to its `maxSize` and shrink pane *i+1*
  accordingly

#### Scenario: Keyboard interactions are no-ops when handle is disabled

- **WHEN** the handle's owning `Splitter.Root` is disabled, or both
  adjacent panes have `disabled={true}`
- **THEN** SHALL ignore keyboard input
- **AND** SHALL set `tabIndex={-1}` so the handle is not in the tab order

### Requirement: ARIA semantics on Handle

Each `Handle` SHALL expose the W3C window-splitter ARIA model in a way
that's accurate for its position in the splitter.

#### Scenario: ARIA attributes reflect handle position

- **GIVEN** handle *i* between pane *i* (size = 20) and pane *i+1* (size =
  60), with `minSize` 10 on both
- **THEN** the handle SHALL emit:
  - `role="separator"`
  - `aria-valuenow={20}` (size of pane *i*)
  - `aria-valuemin={10}` (pane *i*'s `minSize`)
  - `aria-valuemax={80}` (sum of pane *i* and *i+1* sizes minus pane
    *i+1*'s `minSize`, capped by pane *i*'s `maxSize`)
  - `aria-orientation` matching `Splitter.Root.orientation`
  - `aria-controls={paneI.id}` (pane *i*, the primary pane on the
    left/top side of the handle)

#### Scenario: aria-label defaults

- **WHEN** no `aria-label` or `aria-labelledby` is supplied on a `Handle`
- **THEN** SHALL apply a default `aria-label` localised via i18n (English
  fallback: `"Resize panes"`)

### Requirement: Orientation

The `Splitter.Root` SHALL accept `orientation: "horizontal" | "vertical"`
(default `"horizontal"`) and lay panes/handles accordingly.

#### Scenario: Horizontal layout

- **WHEN** `orientation="horizontal"`
- **THEN** panes SHALL be arranged left-to-right
- **AND** handles SHALL have `aria-orientation="horizontal"` (per W3C
  separator semantics, which describe the boundary axis, not the layout
  axis)
- **AND** drag SHALL respond to `deltaX`
- **AND** ArrowLeft/ArrowRight SHALL be the active keys

#### Scenario: Vertical layout

- **WHEN** `orientation="vertical"`
- **THEN** panes SHALL be arranged top-to-bottom
- **AND** handles SHALL have `aria-orientation="vertical"`
- **AND** drag SHALL respond to `deltaY`
- **AND** ArrowUp/ArrowDown SHALL be the active keys

### Requirement: `useSplitterLayout` hook for persistence and commands

The `useSplitterLayout` hook SHALL provide synchronous initial sizes
hydration, debounced persistence, and a unified imperative API. The
component SHALL remain pure — the hook holds no React state for sizes
during drag.

#### Scenario: Hook returns props for the component

- **WHEN** consumer calls
  `useSplitterLayout({ initialSizes: [20, 60, 20] })`
- **THEN** SHALL return at minimum `{ defaultSizes, onSizesChange }`
  that consumers spread on `Splitter.Root`
- **AND** SHALL return imperative methods `collapse`, `expand`, `setSizes`,
  `getSizes`, `isCollapsed` callable from anywhere with access to the
  layout object

#### Scenario: localStorage persistence by `id`

- **WHEN** `useSplitterLayout({ initialSizes: [20, 60, 20], id: "my-key" })`
  is called and `localStorage.getItem("my-key")` contains
  `"[25, 55, 20]"`
- **THEN** SHALL return `defaultSizes = [25, 55, 20]` on first render
- **AND** subsequent `onSizesChange` invocations SHALL write to
  `localStorage.setItem("my-key", JSON.stringify(sizes))` debounced by
  `debounceMs` (default 200)

#### Scenario: Custom storage adapter

- **WHEN** `useSplitterLayout({ initialSizes, storage })` is called with
  `storage: { load, save }`
- **THEN** SHALL call `storage.load()` synchronously on first render and
  use its return value as `defaultSizes` (falling back to `initialSizes` on
  any invalid return)
- **AND** SHALL call `storage.save(sizes)` (debounced) on each size change
- **AND** SHALL NOT touch `localStorage` even if `id` is also provided
  (`storage` overrides `id`)

#### Scenario: SSR safety

- **WHEN** the hook executes during SSR (`typeof window === "undefined"`)
  and only `id` is provided (no custom `storage`)
- **THEN** SHALL return `defaultSizes = initialSizes` without touching
  `localStorage`
- **AND** the same hook on the client SHALL read the persisted value on
  first render (no `useEffect` flicker), guarded by the `typeof window`
  check

#### Scenario: Stored value rejected on length mismatch

- **WHEN** stored sizes have a different length than `initialSizes`
- **THEN** SHALL ignore the stored value and return `initialSizes` as
  `defaultSizes`
- **AND** SHALL log a development-only warning

#### Scenario: Stored value normalized on sum drift

- **WHEN** stored sizes sum to within ±1% of 100 (e.g. floating-point
  drift)
- **THEN** SHALL scale the array so the sum is exactly 100
- **WHEN** stored sizes sum to outside ±1% of 100
- **THEN** SHALL fall back to `initialSizes`

#### Scenario: Imperative `setSizes` from anywhere

- **GIVEN** consumer holds the `layout` object returned by
  `useSplitterLayout`
- **WHEN** code outside the `Splitter` subtree calls
  `layout.setSizes([0, 70, 30])`
- **THEN** SHALL update the component's internal sizes to `[0, 70, 30]`
- **AND** SHALL fire `onSizesChange([0, 70, 30])`
- **AND** SHALL NOT cause re-render of components that only read
  imperative methods (no subscription to sizes)

#### Scenario: Imperative `collapse` / `expand`

- **WHEN** consumer calls `layout.collapse(0)` on a collapsible pane
- **THEN** SHALL set pane 0's size to its `collapsedSize` and redistribute
  freed space via the cascade-resize algorithm
- **AND** SHALL fire `onCollapse` on pane 0
- **WHEN** `layout.expand(0)` is called on a currently collapsed pane
- **THEN** SHALL restore pane 0 to its `defaultSize` (or `initialSizes[0]`
  if no per-pane default exists)
- **AND** SHALL fire `onExpand` on pane 0

### Requirement: Visual presentation via Chakra slot recipe

The component SHALL ship a `splitterSlotRecipe` registered in
`packages/nimbus/src/theme/slot-recipes/index.ts` with slots `root`,
`pane`, and `handle`, plus variants matching the existing branch (`size`:
`sm`/`md`/`lg`, `orientation`: `horizontal`/`vertical`).

#### Scenario: Handle visibility states

- **WHEN** a handle is hovered or focused
- **THEN** SHALL apply the corresponding visual state (background colour
  change, focus ring) defined in the recipe
- **AND** SHALL use Nimbus design tokens for all colours (no hardcoded
  hex values)

#### Scenario: Disabled handle styling

- **WHEN** a handle is disabled (its `Splitter.Root` is disabled or
  both adjacent panes are disabled)
- **THEN** SHALL apply the disabled visual variant (`cursor: not-allowed`,
  reduced opacity)

### Requirement: No controlled `sizes` prop

The component SHALL NOT accept a `sizes` prop. External mutation goes
through `useSplitterLayout`'s imperative API.

#### Scenario: Passing `sizes` is rejected at the type level

- **WHEN** consumer attempts `<Splitter.Root sizes={…}>`
- **THEN** TypeScript SHALL emit a compile error (no `sizes` prop in
  `SplitterRootProps`)

### Requirement: WCAG 2.1 AA compliance

The component SHALL meet WCAG 2.1 AA requirements as exercised in
Storybook play functions.

#### Scenario: All interactions reachable by keyboard

- **WHEN** the user navigates with Tab
- **THEN** SHALL reach every handle in DOM order
- **AND** SHALL skip disabled handles

#### Scenario: Focus indicator is visible

- **WHEN** a handle receives keyboard focus
- **THEN** SHALL render a visible focus ring (via `_focusVisible` in the
  recipe) with contrast meeting WCAG AA

#### Scenario: Touch target size

- **WHEN** rendered at any size variant
- **THEN** the handle's interactive hit area SHALL be at least 24×24
  CSS pixels (with hit area extended via padding if visual width is
  smaller)
