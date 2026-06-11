# Specification: Splitter

## Overview

The Splitter component provides a compound primitive for a user-resizable
two-pane layout. A `Splitter.Root` contains one `Splitter.Aside` (the
configurable, sized pane) and one `Splitter.Main` (which takes the remaining
space), with one `Splitter.Handle` between them. The aside may be placed before
or after the main pane (a leading or trailing panel). Users drag the handle (or
use the keyboard) to redistribute space; the component owns its size state
internally.

A 2-pane splitter has a single boundary — one degree of freedom — so the entire
size dimension is a single number: the aside's percentage (`size` /
`defaultSize`). The main pane is always the remainder (`100 − size`).
Persistence is wired in the consuming app via `defaultSize` + `onSizeChangeEnd`
and any storage (a single number round-trips); collapse uses the controlled
`collapsed` boolean — there is no companion hook or imperative API.

All sizing and collapse configuration (`minSize`, `maxSize`, `collapsible`,
`collapsedSize`) lives on `Splitter.Root` as flat props. The aside is the only
configurable pane; `maxSize` caps how far it can grow, which fixes the main
pane's floor (`100 − maxSize`). `Splitter.Aside` / `Splitter.Main` carry only
content and an optional `id`. `Splitter.Handle` is anonymous.

Layouts requiring more than two panes are expressed by nesting one `Splitter`
inside another's pane. App-shell layout behaviour (responsive collapse to
drawers, landmark slot semantics) is not part of this component and belongs to a
separate pattern component.

**Component:** `Splitter` (compound API: `Root`, `Aside`, `Main`, `Handle`)
**Package:** `@commercetools/nimbus` **Category:** Layout

## ADDED Requirements

### Requirement: Aside + Main compound API

The component SHALL accept exactly one `Splitter.Aside` and one `Splitter.Main`
child with exactly one `Splitter.Handle` between them. The pane components carry
only content and an optional `id`; the role is designated by the component type,
not by an id.

#### Scenario: Aside + main layout

- **WHEN** `<Splitter.Root>` contains a `Splitter.Aside` and a `Splitter.Main`
  with one `Handle` between them
- **THEN** SHALL render the two panes side by side with a draggable handle on
  the boundary
- **AND** SHALL size the aside to `size` and the main pane to `100 − size`

#### Scenario: Aside on either side

- **WHEN** the `Splitter.Aside` is rendered before the `Splitter.Main` (leading)
  or after it (trailing)
- **THEN** SHALL honour the DOM order for layout
- **AND** SHALL keep `size` referring to the aside regardless of side

#### Scenario: Layouts with more than two panes

- **WHEN** a consumer requires three or more regions
- **THEN** SHALL achieve it by nesting one `Splitter.Root` inside the `children`
  of a `Splitter.Aside` or `Splitter.Main`
- **AND** SHALL NOT support a flat list of three or more panes on a single
  `Splitter.Root`

#### Scenario: Wrong pane count

- **WHEN** `<Splitter.Root>` does not contain exactly one `Splitter.Aside` and
  one `Splitter.Main`, or a number of `Handle` children other than one
- **THEN** SHALL emit a development-time warning
- **AND** SHALL render best-effort

#### Scenario: Optional pane id

- **WHEN** a `Splitter.Aside` or `Splitter.Main` is given an `id`
- **THEN** SHALL render it as the pane element's DOM id (used by the handle's
  `aria-controls`)
- **WHEN** no `id` is given
- **THEN** SHALL generate a stable DOM id automatically

### Requirement: Uncontrolled state model

By default the component SHALL own its aside `size` state internally, exposed via
`defaultSize` (initial value, read once), `onSizeChange` (live notification), and
`onSizeChangeEnd` (settled notification). For the optional controlled
counterpart, see "Optional controlled `size` prop".

#### Scenario: Initial size from `defaultSize`

- **WHEN** `<Splitter.Root defaultSize={30}>` is rendered
- **THEN** SHALL initialize the internal aside size to `30` (main `70`)
- **AND** SHALL ignore subsequent prop changes to `defaultSize`
- **AND** SHALL clamp an out-of-range `defaultSize` into `0–100`, preserving
  float precision (no rounding)

#### Scenario: Initial size with no default

- **WHEN** `defaultSize` is omitted or non-finite
- **THEN** SHALL fall back to a 50/50 split

#### Scenario: `onSizeChange` fires on every size update

- **WHEN** the user drags the handle (each tick), presses an arrow key on a
  focused handle, collapses/expands, or double-clicks to restore
- **THEN** SHALL call `onSizeChange(size)` with the post-change aside size
  (`0–100`)

#### Scenario: `onSizeChangeEnd` fires once per settled interaction

- **WHEN** a drag ends, an arrow/Home/End key is pressed, the aside collapses or
  expands, or double-click restores defaults
- **THEN** SHALL call `onSizeChangeEnd(size)` exactly once for that interaction
  (the seam consumers wire persistence to — no debounce required)

#### Scenario: Size preserves float precision

- **WHEN** `defaultSize`, drag, or keyboard produce a fractional percentage
  (e.g. `31.25`)
- **THEN** SHALL apply and report it unrounded through the size pipeline
- **AND** the handle's `aria-valuenow` MAY be rounded for assistive technology
  without affecting the applied layout

### Requirement: Aside size constraints with clamping

`Splitter.Root` SHALL accept flat `minSize` (default 0) and `maxSize` (default
100) describing the aside's allowed window. Drag and keyboard operations on the
handle SHALL clamp the aside size into `[minSize, maxSize]`. Because the main
pane is the remainder, `maxSize` fixes the main pane's floor (`100 − maxSize`);
there is no main-specific knob.

#### Scenario: Drag respects the aside `minSize`

- **GIVEN** `minSize: 10`, current aside size `30`
- **WHEN** the user drags the handle to attempt an aside size of `5`
- **THEN** SHALL clamp the aside to `10`

#### Scenario: Drag respects the aside `maxSize` (the main pane's floor)

- **GIVEN** `maxSize: 70`, current aside size `60`
- **WHEN** the user drags the handle to attempt an aside size of `80`
- **THEN** SHALL clamp the aside to `70` (main pane never below `30`)

### Requirement: Collapsible aside

When `collapsible: true` is set on `Splitter.Root`, the aside SHALL support being
collapsed to its `collapsedSize` (default 0). Only the aside collapses. Collapse
state is a boolean: `collapsed` (controlled), `defaultCollapsed` (uncontrolled),
and `onCollapsedChange(collapsed)` (notification). Enter on the focused handle
toggles collapse. Double-click is reserved for restoring the boundary to its
initial position, not for collapsing.

While the aside is collapsed, resizing the boundary (drag and the arrow / Home /
End keys) SHALL be disabled. A collapsed aside sits at its `collapsedSize`, below
its `minSize`, so a resize could only snap straight to `minSize`. It is instead
reopened via Enter (toggle), double-click (restore defaults), or the controlled
`collapsed` prop.

#### Scenario: Enter on focused handle toggles collapse

- **GIVEN** aside size `30` with `collapsible: true`
- **WHEN** the handle has keyboard focus and Enter is pressed
- **THEN** SHALL collapse the aside if it is not collapsed (set its size to
  `collapsedSize`, grow the main pane to absorb the freed space)
- **AND** SHALL fire `onCollapsedChange(true)`
- **OR** SHALL expand the aside (restore the pre-collapse size) if it is
  currently collapsed
- **AND** SHALL fire `onCollapsedChange(false)` for the expand transition

#### Scenario: Controlled `collapsed` from anywhere

- **GIVEN** the consumer renders `<Splitter.Root collapsed={state} …>`
- **WHEN** code outside the splitter subtree sets `state` to `true` (e.g. a
  toolbar button)
- **THEN** SHALL collapse the aside to its `collapsedSize` and grow the main pane
- **WHEN** `state` is set back to `false`
- **THEN** SHALL restore the pre-collapse size

#### Scenario: Enter is a no-op when the aside is not collapsible

- **GIVEN** `collapsible` is not set
- **WHEN** the handle has keyboard focus and Enter is pressed
- **THEN** SHALL NOT change the size and SHALL NOT fire `onCollapsedChange`

#### Scenario: `onCollapsedChange(false)` fires when leaving the collapsed state

- **GIVEN** a collapsed aside (size === `collapsedSize`)
- **WHEN** any operation (Enter toggle, double-click restore, controlled prop)
  increases the aside's size above `collapsedSize`
- **THEN** SHALL fire `onCollapsedChange(false)` exactly once for that transition

#### Scenario: Resizing is disabled while the aside is collapsed

- **GIVEN** a collapsed aside (size === `collapsedSize`)
- **WHEN** the user drags the handle or presses an arrow / Home / End key
- **THEN** SHALL NOT change the size
- **AND** SHALL keep the aside collapsed (no `onCollapsedChange`)

### Requirement: Double-click restores defaults

Double-click on the handle SHALL restore the boundary to its initial position —
the size the component resolved on mount from `defaultSize` (if provided),
otherwise the 50/50 fallback. The behaviour applies to all splitters, not only
collapsible ones.

#### Scenario: Double-click restores the initial size

- **GIVEN** the splitter was mounted with `defaultSize = 30`
- **AND** the user has dragged the aside to `60`
- **WHEN** the user double-clicks the handle
- **THEN** SHALL set the aside size back to `30`
- **AND** SHALL fire `onSizeChangeEnd(30)`

#### Scenario: Double-click is disabled

- **WHEN** `<Splitter.Root isDoubleClickDisabled>` is set
- **THEN** SHALL NOT restore defaults on the handle's double-click
- **AND** SHALL NOT prevent other handle interactions (drag, keyboard)

#### Scenario: Double-click does not collapse

- **GIVEN** `collapsible` is set
- **WHEN** the user double-clicks the handle
- **THEN** SHALL NOT collapse the aside
- **AND** SHALL restore the boundary to its initial position

### Requirement: Keyboard navigation on Handle

The `Handle` SHALL be focusable, have `role="separator"`, and respond to arrow
keys, Home, End, and Enter according to the W3C window splitter pattern. Δ is
expressed as growing the leading pane; for a trailing aside this maps to
shrinking the aside.

#### Scenario: Arrow keys on a horizontal handle

- **GIVEN** `<Splitter.Root orientation="horizontal" keyboardStep={5}>` with a
  focused handle and the aside leading
- **WHEN** the user presses ArrowRight
- **THEN** SHALL grow the leading (aside) pane by 5 percentage points and shrink
  the main pane by 5
- **AND** SHALL clamp at the aside's `minSize` / `maxSize` if a limit is hit
- **AND** SHALL emit `onSizeChange` with the new aside size
- **AND** SHALL prevent default browser scroll

#### Scenario: Arrow keys on a vertical handle

- **GIVEN** `<Splitter.Root orientation="vertical">` with a focused handle and
  the aside leading
- **WHEN** the user presses ArrowDown
- **THEN** SHALL apply Δ = +5 to grow the leading (aside) pane and shrink the
  main pane

#### Scenario: Home/End jump to bounds

- **GIVEN** a focused handle with the aside leading
- **WHEN** the user presses Home
- **THEN** SHALL shrink the aside to its `minSize`
- **WHEN** the user presses End
- **THEN** SHALL grow the aside to its `maxSize`

#### Scenario: Keyboard interactions are no-ops when the splitter is disabled

- **WHEN** `<Splitter.Root isDisabled>` is set
- **THEN** SHALL ignore keyboard input (and drag, and collapse)
- **AND** SHALL set `tabIndex={-1}` so the handle is not in the tab order

### Requirement: ARIA semantics on Handle

The `Handle` SHALL expose the W3C window-splitter ARIA model. The value tracks
the leading pane, so it is correct whichever side the aside is on.

#### Scenario: ARIA attributes reflect handle position

- **GIVEN** the aside leads with size 30 and the main pane is 70, with
  `minSize: 10` and `maxSize: 90`
- **THEN** the handle SHALL emit:
  - `role="separator"`
  - `aria-valuenow={30}` (size of the leading pane, rounded for AT)
  - `aria-valuetext="30%"`
  - `aria-valuemin={10}` (`minSize`)
  - `aria-valuemax={90}` (`maxSize`)
  - `aria-orientation` matching `Splitter.Root.orientation`
  - `aria-controls={asideDomId}` (the DOM id of the leading Pane sibling)
  - `aria-disabled="true"` only when `Splitter.Root` is `isDisabled`

#### Scenario: ARIA bounds map onto a trailing aside

- **GIVEN** the aside trails (main pane leading) with the aside window
  `[minSize: 10, maxSize: 80]`
- **THEN** the handle SHALL emit `aria-valuemin={20}` and `aria-valuemax={90}`
  (the complement of the aside window, since the leading pane is the main pane)

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

### Requirement: Behaviour-anonymous Handle

`Splitter.Handle` SHALL NOT accept per-handle *behaviour* configuration props
(e.g. `keyboardStep`, `collapsible`). All behaviour is configured on
`Splitter.Root`. The handle still accepts standard DOM attributes (`id`,
`className`, `data-*`, etc.) and `aria-label` / `aria-labelledby` overrides.

#### Scenario: Handle resolves its panes from sibling DOM order

- **GIVEN** a `Splitter.Handle` rendered between the aside and main panes
- **THEN** SHALL resolve the "leading pane" and "trailing pane" from their DOM
  order
- **AND** SHALL derive `aria-controls` from the leading pane's DOM id

#### Scenario: Per-handle behavioural config is rejected at the type level

- **WHEN** consumer attempts `<Splitter.Handle keyboardStep={…}>` or any
  behavioural prop that belongs on `Splitter.Root`
- **THEN** TypeScript SHALL emit a compile error (`Handle` props include only
  standard HTML/style/DOM props plus `aria-label` overrides)

### Requirement: Nesting for layouts with more than two regions

A `Splitter` SHALL be nestable inside the `children` of any `Splitter.Aside` or
`Splitter.Main`. The inner Splitter is independent of the outer — its own state,
persistence, callbacks, and ARIA subtree.

#### Scenario: Three-region layout via nesting

- **GIVEN** a consumer wants a three-region layout `nav | main | aside`
- **WHEN** they render an outer `<Splitter.Root>` splitting a nav aside from a
  main pane, and an inner `<Splitter.Root>` inside the main pane's children
- **THEN** SHALL render three resizable regions
- **AND** SHALL expose two independently focusable handles in the tab order
- **AND** SHALL allow each splitter to be configured / persisted / collapsed
  independently
- **AND** SHALL announce each splitter as a self-contained widget to assistive
  technology

### Requirement: Persistence via storage-agnostic props

The component SHALL be persistable with any storage the consumer chooses, with
no bespoke hook. The initial size is hydrated by passing a stored number to
`defaultSize`; the settled value is reported as a number via `onSizeChangeEnd`
for writing back; collapse persists via its controlled `collapsed` boolean.

#### Scenario: Hydrate from a stored size

- **WHEN** the consumer passes `defaultSize={storedSize}` (read from any storage
  during render)
- **THEN** SHALL initialize the boundary from that value on first render (no
  flicker), clamped into `0–100` with float precision preserved

#### Scenario: Persist on settled change

- **WHEN** an interaction settles (drag end, keypress, collapse/expand, restore)
- **THEN** SHALL call `onSizeChangeEnd(size)` once, which the consumer wires to
  its storage `set` — no debouncing required since it fires per interaction, not
  per drag tick

#### Scenario: No imperative API

- **WHEN** the consumer needs to collapse the aside from outside the subtree
- **THEN** SHALL do so via the controlled `collapsed` prop (plain state), NOT via
  an imperative ref or hook command

### Requirement: Visual presentation via Chakra slot recipe

The component SHALL ship a `splitterSlotRecipe` registered as `nimbusSplitter`
in `packages/nimbus/src/theme/slot-recipes/index.ts` with slots `root`, `pane`,
and `handle`, and an `orientation` variant (`horizontal` / `vertical`). The
handle track has a single fixed thickness (no `size` variant).

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

### Requirement: Optional controlled `size` prop

The component SHALL accept an optional `size` prop — the controlled counterpart
to `defaultSize`, mutually exclusive with it. When provided, the splitter SHALL
be controlled for size with **settle-only** semantics: the internal size stays
authoritative during interaction (drag/keyboard update live, with no consumer
feedback), and the prop SHALL be reconciled into state when it changes.

#### Scenario: Controlled `size` reflects external changes in place

- **GIVEN** the consumer renders `<Splitter.Root size={state} …>`
- **WHEN** code outside the splitter sets `state` to a new aside size
- **THEN** SHALL render at the new size WITHOUT remounting the panes (pane
  content — scroll, focus, inputs — is preserved)
- **AND** SHALL clamp the incoming value into `0–100`

#### Scenario: Settle-only notification

- **WHEN** the user drags or uses the keyboard on a controlled splitter
- **THEN** SHALL update the layout live from internal state (no per-tick consumer
  feedback required)
- **AND** SHALL call `onSizeChangeEnd` once when the interaction settles

#### Scenario: Ignoring `onSizeChangeEnd` falls back to uncontrolled

- **GIVEN** `size` is set but `onSizeChangeEnd` is not wired (or not fed back)
- **WHEN** the user resizes
- **THEN** SHALL keep the last interactive value (no snap-back) and behave as
  uncontrolled thereafter
- **AND** SHALL emit a development-time warning

#### Scenario: Collapse takes precedence over controlled `size`

- **GIVEN** both `size` and `collapsed` are controlled
- **WHEN** the aside is collapsed
- **THEN** the aside SHALL stay at its `collapsedSize`, and the controlled `size`
  SHALL govern the expanded proportion (applied on expand)

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

- **WHEN** rendered
- **THEN** the handle's interactive hit area SHALL be at least 24×24 CSS pixels
  (with hit area extended via padding if the visual width is smaller)
