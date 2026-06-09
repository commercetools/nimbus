# Specification: Splitter

## Overview

The Splitter component provides a compound primitive for user-resizable panes. A
`Splitter.Root` contains exactly two `Splitter.Pane` children (each with a
string `id`) with one `Splitter.Handle` between them. Users drag the handle (or
use the keyboard) to redistribute space between the two panes; the component
owns its sizes state internally. Persistence is wired in the consuming app via
`defaultSizes` + `onSizesChangeEnd` and any storage; cross-subtree collapse uses
the controlled `collapsedPane` prop — there is no companion hook or imperative
API.

Per-pane configuration (sizes, constraints, collapsibility) lives on
`Splitter.Root` keyed by pane id. `Splitter.Handle` is anonymous — all handle
behaviour is configured on `Root`.

Layouts requiring more than two panes are expressed by nesting one `Splitter`
inside another's `Pane`. The Splitter is the primitive for user-driven resize.
App-shell layout behaviour (responsive collapse to drawers, landmark slot
semantics) is not part of this component and belongs to a separate pattern
component.

**Component:** `Splitter` (compound API: `Root`, `Pane`, `Handle`)
**Package:** `@commercetools/nimbus` **Category:** Layout

## ADDED Requirements

### Requirement: Two-pane compound API

The component SHALL accept exactly two `Splitter.Pane` children, each with a
unique string `id`, and exactly one `Splitter.Handle` between them.

#### Scenario: Two-pane layout

- **WHEN** `<Splitter.Root>` contains two `Pane` children (e.g. ids `nav` and
  `main`) with one `Handle` between them
- **THEN** SHALL render the two panes side by side with a draggable handle on
  the boundary

#### Scenario: Layouts with more than two panes

- **WHEN** a consumer requires three or more regions
- **THEN** SHALL achieve it by nesting one `Splitter.Root` inside the `children`
  of a `Splitter.Pane`
- **AND** SHALL NOT support a flat list of three or more `Pane` children on a
  single `Splitter.Root`

#### Scenario: Wrong child count

- **WHEN** `<Splitter.Root>` contains fewer or more than two `Pane` children, or
  a number of `Handle` children other than one
- **THEN** SHALL emit a development-time warning
- **AND** SHALL render best-effort (skip missing slots; ignore extra panes or
  handles beyond the expected pair)

#### Scenario: Missing or duplicate pane id

- **WHEN** a `Splitter.Pane` has no `id` prop, or both panes share the same `id`
- **THEN** SHALL emit a development-time warning
- **AND** SHALL render best-effort (panes without `id` are excluded from state;
  duplicate ids use last-write-wins)

### Requirement: Uncontrolled state model

By default the component SHALL own its `sizes` state internally, exposed via
`defaultSizes` (initial value, read once), `onSizesChange` (live notification),
and `onSizesChangeEnd` (settled notification). For the optional controlled
counterpart, see "Optional controlled `sizes` prop".

#### Scenario: Initial sizes from `defaultSizes`

- **WHEN** `<Splitter.Root defaultSizes={{ nav: 30, main: 70 }}>` is rendered
- **THEN** SHALL initialize internal sizes to `{ nav: 30, main: 70 }`
- **AND** SHALL ignore subsequent prop changes to `defaultSizes`

- **AND** SHALL normalize `defaultSizes` to sum to 100 while preserving float
  precision (no rounding)

#### Scenario: Initial sizes with no defaults

- **WHEN** `defaultSizes` is omitted or missing an id
- **THEN** SHALL distribute 100 equally across panes (50 / 50)

#### Scenario: `onSizesChange` fires on every size update

- **WHEN** the user drags the handle (each tick), presses an arrow key on a
  focused handle, collapses/expands, or double-clicks to restore
- **THEN** SHALL call `onSizesChange(newSizes)` with the post-change `sizes`
  record (keys = both pane ids, values summing to 100)

#### Scenario: `onSizesChangeEnd` fires once per settled interaction

- **WHEN** a drag ends, an arrow/Home/End key is pressed, a pane collapses or
  expands, or double-click restores defaults
- **THEN** SHALL call `onSizesChangeEnd(sizes)` exactly once for that
  interaction (the seam consumers wire persistence to — no debounce required)

#### Scenario: Sizes preserve float precision

- **WHEN** `defaultSizes`, drag, or keyboard produce a fractional percentage
  (e.g. `31.25`)
- **THEN** SHALL apply and report it unrounded through the size pipeline
- **AND** the handle's `aria-valuenow` MAY be rounded for assistive technology
  without affecting the applied layout

### Requirement: Per-pane size constraints with clamping

Each entry in the `panes` map on `Root` SHALL accept `minSize` (default 0).
Drag and keyboard operations on the handle SHALL clamp Δ so neither pane falls
below its `minSize`. A pane's upper bound is the complement of its partner's
`minSize` (`max = 100 − partner.minSize`); there is no separate `maxSize` knob.
No cascade behaviour applies — with only two panes, there is nowhere to spill
remainder.

#### Scenario: Drag respects neighbour `minSize`

- **GIVEN** two panes `a`, `b` each with `minSize: 10`, current sizes
  `{ a: 30, b: 70 }`
- **WHEN** the user drags the handle to attempt `{ a: 95, b: 5 }`
- **THEN** SHALL clamp `b` to its `minSize` (10)
- **AND** SHALL produce sizes `{ a: 90, b: 10 }`

#### Scenario: Drag respects the derived upper bound

- **GIVEN** two panes `a`, `b` with `panes.b.minSize: 30`, current sizes
  `{ a: 60, b: 40 }`
- **WHEN** the user drags the handle to attempt `{ a: 80, b: 20 }`
- **THEN** SHALL clamp `a` to `100 − b.minSize` (70)
- **AND** SHALL produce sizes `{ a: 70, b: 30 }`

### Requirement: Collapsible panes

A pane configured with `collapsible: true` in the `panes` map SHALL support
being collapsed to its `collapsedSize` (default 0). Collapse state is
controllable: `collapsedPane` (controlled), `defaultCollapsedPane`
(uncontrolled), and `onCollapsedPaneChange(paneId | null)` (notification). A
2-pane splitter collapses at most one pane at a time, so the value is a single
id or `null`. Enter on the focused handle toggles collapse. Double-click is
reserved for restoring the boundary to its initial position (see "Double-click
restores defaults"), not for collapsing.

While a pane is collapsed, resizing the boundary (drag and the arrow / Home /
End keys) SHALL be disabled. A collapsed pane sits at its `collapsedSize`, below
its `minSize` — inside the invalid `[collapsedSize, minSize)` range — so a resize
could only snap straight to `minSize`. The pane is instead reopened via Enter
(toggle), double-click (restore defaults), or the controlled `collapsedPane`
prop.

#### Scenario: Enter on focused handle toggles collapse

- **GIVEN** sizes `{ nav: 30, main: 70 }` with `panes.nav.collapsible: true`
- **WHEN** the handle has keyboard focus and Enter is pressed
- **THEN** SHALL collapse `nav` if nothing is collapsed (set its size to
  `collapsedSize`, grow the other pane to absorb the freed space)
- **AND** SHALL fire `onCollapsedPaneChange("nav")` on Root
- **OR** SHALL expand the collapsed pane (restore the pre-collapse sizes) if a
  pane is currently collapsed
- **AND** SHALL fire `onCollapsedPaneChange(null)` for the expand transition
- **AND** SHALL produce sizes summing to 100

#### Scenario: Controlled `collapsedPane` from anywhere

- **GIVEN** the consumer renders `<Splitter.Root collapsedPane={state} …>`
- **WHEN** code outside the splitter subtree sets `state` to a collapsible
  pane id (e.g. a toolbar button)
- **THEN** SHALL collapse that pane to its `collapsedSize` and grow the other
- **WHEN** `state` is set back to `null`
- **THEN** SHALL restore the pre-collapse sizes

#### Scenario: Both panes collapsible — Enter targets the smaller

- **GIVEN** both panes are `collapsible` and nothing is collapsed
- **WHEN** the handle has keyboard focus and Enter is pressed
- **THEN** SHALL collapse the smaller of the two panes
- **AND** SHALL break ties by preferring the left/top pane

#### Scenario: `onCollapsedPaneChange(null)` fires when leaving collapsed state

- **GIVEN** a collapsed pane (size === `collapsedSize`)
- **WHEN** any operation (Enter toggle, double-click restore, controlled prop)
  increases the pane's size above `collapsedSize`
- **THEN** SHALL fire `onCollapsedPaneChange(null)` on Root exactly once for
  that transition

#### Scenario: Resizing is disabled while a pane is collapsed

- **GIVEN** a collapsed pane (size === `collapsedSize`)
- **WHEN** the user drags the handle or presses an arrow / Home / End key
- **THEN** SHALL NOT change the sizes
- **AND** SHALL keep the pane collapsed (no `onCollapsedPaneChange`)

### Requirement: Double-click restores defaults

Double-click on the handle SHALL restore the boundary to its initial position —
the sizes the component resolved on mount from `defaultSizes` (if provided),
otherwise the 50/50 fallback. The behaviour applies to all splitters, not only
collapsible ones.

#### Scenario: Double-click restores the initial sizes

- **GIVEN** the splitter was mounted with `defaultSizes = { nav: 30, main: 70 }`
- **AND** the user has dragged the handle to `{ nav: 60, main: 40 }`
- **WHEN** the user double-clicks the handle
- **THEN** SHALL set sizes back to `{ nav: 30, main: 70 }`
- **AND** SHALL fire `onSizesChange({ nav: 30, main: 70 })`

#### Scenario: Double-click is disabled

- **WHEN** `<Splitter.Root isDoubleClickDisabled>` is set
- **THEN** SHALL NOT restore defaults on the handle's double-click
- **AND** SHALL NOT prevent other handle interactions (drag, keyboard)

#### Scenario: Double-click does not collapse

- **GIVEN** `panes.nav = { collapsible: true }`
- **WHEN** the user double-clicks the handle
- **THEN** SHALL NOT collapse the `nav` pane
- **AND** SHALL restore the boundary to its initial position

### Requirement: Keyboard navigation on Handle

The `Handle` SHALL be focusable, have `role="separator"`, and respond to arrow
keys, Home, End, and Enter according to the W3C window splitter pattern.

#### Scenario: Arrow keys on a horizontal handle

- **GIVEN** `<Splitter.Root orientation="horizontal" keyboardStep={5}>` with
  focused handle
- **WHEN** the user presses ArrowRight
- **THEN** SHALL grow the previous (left) pane by 5 percentage points and shrink
  the next (right) pane by 5
- **AND** SHALL clamp at either pane's `minSize` if a limit is hit
- **AND** SHALL emit `onSizesChange` with the new sizes record
- **AND** SHALL prevent default browser scroll

#### Scenario: Arrow keys on a vertical handle

- **GIVEN** `<Splitter.Root orientation="vertical">` with focused handle
- **WHEN** the user presses ArrowDown
- **THEN** SHALL apply Δ = +5 to grow the upper pane and shrink the lower

#### Scenario: Home/End jump to bounds

- **GIVEN** focused handle between previous pane _a_ and next pane _b_
- **WHEN** the user presses Home
- **THEN** SHALL shrink _a_ to its `minSize` and grow _b_ accordingly
- **WHEN** the user presses End
- **THEN** SHALL grow _a_ to its max (`100 − b.minSize`) and shrink _b_ accordingly

#### Scenario: Keyboard interactions are no-ops when the splitter is disabled

- **WHEN** `<Splitter.Root isDisabled>` is set
- **THEN** SHALL ignore keyboard input (and drag, and collapse)
- **AND** SHALL set `tabIndex={-1}` so the handle is not in the tab order

### Requirement: ARIA semantics on Handle

The `Handle` SHALL expose the W3C window-splitter ARIA model.

#### Scenario: ARIA attributes reflect handle position

- **GIVEN** the previous pane has id `nav` (size 30) and the next pane has id
  `main` (size 70), with `panes.nav.minSize: 10` and `panes.main.minSize: 10`
- **THEN** the handle SHALL emit:
  - `role="separator"`
  - `aria-valuenow={30}` (size of the previous pane, rounded for AT)
  - `aria-valuetext="30%"`
  - `aria-valuemin={10}` (`panes.nav.minSize`)
  - `aria-valuemax={90}` (100 − `panes.main.minSize`)
  - `aria-orientation` matching `Splitter.Root.orientation`
  - `aria-controls={navDomId}` (the DOM id of the previous Pane sibling)
  - `aria-disabled="true"` only when `Splitter.Root` is `isDisabled`

#### Scenario: aria-label defaults

- **WHEN** no `aria-label` or `aria-labelledby` is supplied on the `Handle`
- **THEN** SHALL apply a default `aria-label` localised via i18n (English
  fallback: `"Resize panes"`)

### Requirement: Orientation

The `Splitter.Root` SHALL accept `orientation: "horizontal" | "vertical"`
(default `"horizontal"`) and lay panes / handle accordingly.

#### Scenario: Horizontal layout

- **WHEN** `orientation="horizontal"`
- **THEN** panes SHALL be arranged left-to-right
- **AND** the handle SHALL have `aria-orientation="horizontal"` (per W3C
  separator semantics, which describe the boundary axis, not the layout axis)
- **AND** drag SHALL respond to `deltaX`
- **AND** ArrowLeft / ArrowRight SHALL be the active keys

#### Scenario: Vertical layout

- **WHEN** `orientation="vertical"`
- **THEN** panes SHALL be arranged top-to-bottom
- **AND** the handle SHALL have `aria-orientation="vertical"`
- **AND** drag SHALL respond to `deltaY`
- **AND** ArrowUp / ArrowDown SHALL be the active keys

### Requirement: Anonymous Handle

`Splitter.Handle` SHALL NOT accept an `id` prop or any per-handle configuration
props. Behaviour is configured on `Splitter.Root` (`keyboardStep`,
`isDoubleClickDisabled`, default `aria-label`).

#### Scenario: Handle resolves its panes from sibling DOM order

- **GIVEN** a `Splitter.Handle` rendered between the two `Splitter.Pane`
  children
- **THEN** SHALL resolve the "previous pane" and "next pane" from its
  immediately-previous and immediately-next Pane siblings
- **AND** SHALL derive `aria-controls` from the previous Pane's DOM id

#### Scenario: Per-handle config is rejected at the type level

- **WHEN** consumer attempts `<Splitter.Handle id="…">` or
  `<Splitter.Handle keyboardStep={…}>`
- **THEN** TypeScript SHALL emit a compile error (`Handle` props include only
  standard HTML/style props plus `aria-label` overrides)

### Requirement: Nesting for layouts with more than two regions

A `Splitter` SHALL be nestable inside the `children` of any `Splitter.Pane`. The
inner Splitter is independent of the outer — its own state, persistence,
callbacks, and ARIA subtree.

#### Scenario: Three-region layout via nesting

- **GIVEN** a consumer wants a three-region layout `nav | main | aside`
- **WHEN** they render an outer `<Splitter.Root>` splitting `nav` from a `rest`
  pane, and an inner `<Splitter.Root>` inside the `rest` pane's children
  splitting `main` from `aside`
- **THEN** SHALL render three resizable regions
- **AND** SHALL expose two independently focusable handles in the tab order
- **AND** SHALL allow each splitter to be configured / persisted / collapsed
  independently
- **AND** SHALL announce each splitter as a self-contained widget to assistive
  technology

### Requirement: Persistence via storage-agnostic props

The component SHALL be persistable with any storage the consumer chooses, with
no bespoke hook. Initial sizes are hydrated by passing stored values to
`defaultSizes`; the settled value is reported via `onSizesChangeEnd` for writing
back; collapse persists via its controlled `collapsedPane` state.

#### Scenario: Hydrate from stored sizes

- **WHEN** the consumer passes `defaultSizes={storedSizes}` (read from any
  storage during render)
- **THEN** SHALL initialize the boundary from those values on first render (no
  flicker), normalized to sum 100 with float precision preserved

#### Scenario: Persist on settled change

- **WHEN** an interaction settles (drag end, keypress, collapse/expand, restore)
- **THEN** SHALL call `onSizesChangeEnd(sizes)` once, which the consumer wires
  to its storage `set` — no debouncing required since it fires per interaction,
  not per drag tick

#### Scenario: Unknown stored ids have no effect

- **GIVEN** stored sizes contain an id not present in the current panes
- **WHEN** they are passed as `defaultSizes`
- **THEN** SHALL look sizes up by the current pane ids and fall back to a 50/50
  split for any id missing a valid value (the mount-time normalization keeps
  the boundary well-formed)

#### Scenario: No imperative API

- **WHEN** the consumer needs to collapse a pane from outside the subtree
- **THEN** SHALL do so via the controlled `collapsedPane` prop (plain state),
  NOT via an imperative ref or hook command

### Requirement: Visual presentation via Chakra slot recipe

The component SHALL ship a `splitterSlotRecipe` registered as `nimbusSplitter`
in `packages/nimbus/src/theme/slot-recipes/index.ts` with slots `root`, `pane`,
and `handle`, plus variants for `size` (`sm` / `md` / `lg`) and `orientation`
(`horizontal` / `vertical`).

#### Scenario: Handle visibility states

- **WHEN** the handle is hovered or focused
- **THEN** SHALL apply the corresponding visual state (background colour change,
  focus ring) defined in the recipe
- **AND** SHALL use Nimbus design tokens for all colours (no hardcoded hex
  values)

#### Scenario: Disabled handle styling

- **WHEN** `Splitter.Root` is `isDisabled`
- **THEN** SHALL not show the resize cursor and SHALL not reveal the handle
  track on hover
- **AND** SHALL NOT apply a `not-allowed` cursor or reduced opacity — the
  handle track is invisible at rest, so such an affordance has nothing to
  attach to and would only surface a misleading cursor

#### Scenario: Focus ring uses `_focusVisible`

- **WHEN** the handle receives keyboard focus
- **THEN** SHALL render the focus ring via the recipe's `_focusVisible` selector
- **AND** SHALL NOT render the focus ring on mouse-click focus

### Requirement: Optional controlled `sizes` prop

The component MAY be controlled for size via an optional `sizes` prop — the
controlled counterpart to `defaultSizes`, mutually exclusive with it. Control is
**settle-only**: internal sizes stay authoritative during interaction
(drag/keyboard update live, with no consumer feedback), and the prop is
reconciled into state when it changes.

#### Scenario: Controlled `sizes` reflects external changes in place

- **GIVEN** the consumer renders `<Splitter.Root sizes={state} …>`
- **WHEN** code outside the splitter sets `state` to new proportions
- **THEN** SHALL render at the new proportions WITHOUT remounting the panes
  (pane content — scroll, focus, inputs — is preserved)
- **AND** SHALL normalize the incoming value to sum 100 (no `minSize` clamp)

#### Scenario: Settle-only notification

- **WHEN** the user drags or uses the keyboard on a controlled splitter
- **THEN** SHALL update the layout live from internal state (no per-tick consumer
  feedback required)
- **AND** SHALL call `onSizesChangeEnd` once when the interaction settles

#### Scenario: Ignoring `onSizesChangeEnd` falls back to uncontrolled

- **GIVEN** `sizes` is set but `onSizesChangeEnd` is not wired (or not fed back)
- **WHEN** the user resizes
- **THEN** SHALL keep the last interactive value (no snap-back) and behave as
  uncontrolled thereafter
- **AND** SHALL emit a development-time warning

#### Scenario: Collapse takes precedence over controlled `sizes`

- **GIVEN** both `sizes` and `collapsedPane` are controlled
- **WHEN** a pane is collapsed
- **THEN** the collapsed pane SHALL stay at its `collapsedSize`, and the
  controlled `sizes` SHALL govern the expanded proportions (applied on expand)

### Requirement: WCAG 2.1 AA compliance

The component SHALL meet WCAG 2.1 AA requirements as exercised in Storybook play
functions.

#### Scenario: Handle reachable by keyboard

- **WHEN** the user navigates with Tab
- **THEN** SHALL reach the handle in DOM order
- **AND** SHALL skip the handle when `Splitter.Root` is `isDisabled`

#### Scenario: Focus indicator is visible

- **WHEN** the handle receives keyboard focus
- **THEN** SHALL render a visible focus ring (via `_focusVisible` in the recipe)
  with contrast meeting WCAG AA

#### Scenario: Touch target size

- **WHEN** rendered at any size variant
- **THEN** the handle's interactive hit area SHALL be at least 24×24 CSS pixels
  (with hit area extended via padding if visual width is smaller)
