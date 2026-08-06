# Chromatic Visual Regression: Authoring Stories

Which stories get snapshotted, and why. Nimbus runs
[Chromatic](https://www.chromatic.com/) over Storybook, capturing each opted-in
story in a consistent cloud browser and diffing it against a stored baseline -
so a story is a visual test, and this doc is how you decide what it should
capture.

This is the _why_ behind the two rule-docs that sit closer to the code: the
Chromatic section of [`stories.md`](./file-type-guidelines/stories.md) (terse
rules plus paste-ready snippets) and the
[`writing-stories` skill](../.claude/skills/writing-stories/SKILL.md) (templates
plus a validation checklist). All three group their rules under the same five
headings used below.

> **Looking for CI?** Triggers, the changed-files gate, TurboSnap, baselines and
> acceptance, the two PR checks, and merge gating live in
> [`chromatic-ci.md`](./chromatic-ci.md).

Four questions decide every snapshot call, and nearly every rule below is an
instance of one:

1. **Does it paint?** Is there a component-owned pixel at all.
2. **Is the state reachable in this frame?** Inert props, zeroing variants,
   inherited values with nothing to inherit, hover/pressed.
3. **Who owns the pixels?** Delegation to children, consumers, thin wrappers,
   composition patterns.
4. **Does the play land the frame?** End state, blur, settled animation,
   determinism.

Work them in order, then
[pack what survives](#5-packing-the-surfaces-into-frames) into as few frames as
the axes allow.

## How the mechanism works

**Snapshots are opt-in, at three levels.** `chromatic.disableSnapshot` is
settable at story, component and project level - our layering is
`disableSnapshot: true` as the project default in `preview.tsx`, overridden to
`false` on the VRT stories. Chromatic's docs recommend disabling for
interaction-focused tests to "prevent false positives," which is why `WithRef`
and Button's context/DOM-filtering stories stay off.

**Crop padding is global, not per story.** Chromatic crops each snapshot to the
story's rendered content, so a ring painted outside layout (box-shadow, CSS
outline) clips at the crop edge when content sits flush against it - body or
`layout: "padded"` padding sits outside the crop and can't reach in. A
`preview.tsx` decorator wraps every non-`fullscreen` story in `1rem`, giving
rings room inside the crop and keeping the canvas from jumping as you browse.
`fullscreen` stories are exempt because they mean to touch the edges.

**Keep barrel imports out of `preview.tsx`** - they trigger full rebuilds under
TurboSnap.

## 1. Does it paint?

**Enumerate surfaces from source, not memory.** Read the recipe (every painting
selector - `_hover`, `_focusWithin`, `_disabled`, `_active`, `data-invalid`,
`data-readonly`, ... - and every `variant`/`size` key) and the component (every
conditional render or prop, e.g. `isDisabled={x || isReadOnly}`). Coverage is
the **cross-product** of recipe states × conditional branches: a read-only field
that stays undimmed but disables its trailing button is a distinct surface even
though the field "looks like default." Any "renders like default" call must name
the exact delta you checked. Three things that get missed:

- **Ambient axes** - nothing in the prop list names these: RTL/`dir` (mirrored
  adornment layout), locale, theme. Same for built-in adornments.
- **A comma-separated selector list is as many surfaces as it names**, while
  reading like one rule. Toolbar styles
  `& .nimbus-group, & .nimbus-toggle-button-group__root` together, so a matrix
  built from `Group` alone leaves the toggle-group half baselined nowhere; a
  frame has to contain each child type the rule reaches.
- **Sibling story sets.** A surface a peer snapshots and yours doesn't (e.g.
  `RTLSupport`) is a gap until you can name why it doesn't apply.

**A state that renders identically to the default gets no snapshot.** With no
recipe rule for it, a dedicated `ReadOnly` / `Disabled` / `Invalid` story is a
redundant baseline, not coverage. Read-only is the trap because the call is
component-dependent: MoneyInput styles it (it disables the currency Select) and
carries `ReadOnlyState`; MultilineTextInput / NumberInput / TextInput have no
`data-readonly` rule and correctly carry none.

**Primitives with no painted surface get no VRT at all.** The test isn't "has a
recipe file" - it's **does it paint, and is there a state space to enumerate?**
(Glob `*.recipe.*` when checking: 9 recipes are `.recipe.tsx`, so a `.ts`-only
look concludes they have none.) Three shapes fail it, each getting zero
snapshots plus a one-line `meta` note so the omission reads as deliberate:

- **Pass-through style-prop primitives** (Box, Flex, Stack, Grid, SimpleGrid,
  Spacer - a `<div>`, no recipe). Every appearance comes from consumer style
  props, so a snapshot tests Chakra + tokens, not the component.
- **A recipe that paints nothing** (Group: `inline-flex` + `alignItems`, zero
  variants). It sets no color, border or spacing, so the pixels are the
  children's.
- **Headless / layout-transparent** (Region: `display: contents`). No box is
  rendered; the stories assert _where content lands_, which is DOM containment.

The inverse is the more common case: a primitive whose recipe **does** paint
gets a normal audit - Separator's `orientation` over a `colorPalette.6` fill,
Icon's six-value `size`.

## 2. Is the state reachable in this frame?

**A state can be inert in the default frame - snapshot the condition that fires
it.** Nothing looks wrong: the prop is set, the story renders, and the baseline
records the state _off_ while reading as coverage. Four triggers seen so far:

- **Sticky.** `position: sticky` (a recipe variant in DefaultPage, an inline
  prop on PageContent.Column) paints nothing until content passes beneath it, so
  scroll in the play and capture pinned. Needs a **bounded scroll port**
  (`height: 100%` resolves against nothing otherwise) and an
  **`offsetHeight`-derived** target, so a padding-token change can't silently
  stop it scrolling past. **Wait for the port to be scrollable before scrolling
  it** (`scrollHeight > clientHeight`): CI lays out later than a local run, so a
  play that scrolls on mount can find nothing to scroll, leave the state
  unfired, and fail only in Chromatic.
- **Overflow.** `scrollBehavior="inside"` is only `maxH` + `overflow: auto`, so
  it wants tall content, not a scroll.
- **A variant that zeroes the surface.** ScrollArea's default `hover` sets
  `scrollbar { opacity: 0 }`, so a frame has to pin `always` to paint a track at
  all - its `Sizes` showcase, left at the default, renders four empty boxes
  while its width assertions still pass.
- **An inherited property with nothing to inherit.** ScrollArea's viewport sets
  `borderRadius: inherit`, inert until a consumer passes a radius, so the
  rounded-corner clipping was baselined nowhere until the matrix cells set one.

**Hover and pressed need a forced pseudo-class, which a play can't deliver.**
`userEvent.hover` fires DOM events without recomputing the pseudo-class - a
spike confirmed it yields neither a real CSS `:hover` nor React Aria's
`data-hovered`, and a synthetic `pointerenter` doesn't either. The two
conventions in our recipes fail differently: Chakra `_hover` / `_active` compile
to CSS pseudo-classes, which page JS cannot force at all, while React Aria's
`[data-hovered]` / `[data-pressed]` are JS-set attributes a play _could_ set by
hand. Don't - our recipes are split across both, so forcing the attribute styles
only part of the frame and baselines a half-hovered state, which is worse than
no snapshot. Pressed isn't automatically a no-op either: Button sets
`data-pressed` but styles no rule for it, while NumberInput's steppers paint
`_active` (`bg: neutral.4`). Check the recipe.

**Everything else a play _can_ drive, snapshot settled** - drag-over
(`data-drop-target`), option focus (`data-focused`), selection
(`aria-selected`). Only `:hover` / `:active` / `data-hovered` have no
play-dispatchable event.

**One focus snapshot per reachable focus surface.** Fused or adjacent focusable
sub-controls, and `_focusWithin` on more than one region, need a focus story per
target - each side's ring clears the seam differently. There is no "all focused"
state, since only one element holds focus at a time, so the per-target stories
are the complete set (don't add a combined-ring snapshot). **Confirm the ring
renders first**: on a slot that never gets the focus state the snapshot captures
nothing (DropZone: ring on the root, focus on a hidden inner element).

**Overlays: snapshot the _open_ state** - `defaultOpen` (Dialog/Drawer/Menu) or
open it in the play and await the portal - and leave it open; the entrance
animation settles on its last frame. Each distinct open surface is its own
story: open dialogs/drawers fill the viewport with a backdrop and can't share a
frame, so there's no `SmokeTest` matrix (independent recipe variants become
separate open showcases). open/close, focus trap and dismissal stay behavioral.

**Portals land in the frame, so the capture is page-wide.** Hold transient UI
open (`duration: Infinity` for toasts), await it, and clean up between stories
(Toast's `clearToasts()`) so nothing leaks into the next capture. A portal
component can be focusable in its own right (Toast's root has `tabIndex=0` +
`focusRing: outside`) - reach it the real way (hotkey + Tab), not a synthetic
`.focus()`.

**Snapshot `placement` only when it changes the _layout_**, not when it merely
repositions the same box:

- **Drawer** swaps the layout (full-height side panel ↔ full-width top/bottom
  bar) → one open snapshot each.
- **Dialog** is a recipe variant but only shifts vertical position (an
  `alignItems`/margin change; the same box, higher or lower) → **center only**.
- **Menu/Tooltip** is React Aria positioning (same box repositioned, no arrow) →
  behavioral.

## 3. Who owns the pixels?

**Snapshot the component, not the harness.** Anything in the render tree lands
in the baseline, so a snapshotted story renders the component **directly** - no
debug read-outs, value dumps or controls scaffolding. Those aids are fine on
un-snapshotted behavioral stories (MoneyInput's `MoneyInputExample` renders a
`JSON.stringify(value)` panel); snapshotting one bakes the read-out into the
baseline and flaps on every value change. The line is **load-bearing and
static**, not "is it a wrapper": a wrapper the component needs to resolve at all
(DefaultPage's fixed-height `overflow: auto` Box), or visible children for a
component that paints nothing (PageContent's placeholder boxes). Both are
static; a read-out isn't.

**Thin wrappers get no matrix.** A component that only constrains or forwards a
wrapped component's props re-covers nothing by re-rendering the wrapped grid.
FloatingActionButton wraps IconButton at a fixed circular shape, so it snapshots
`ColorPalettes` + `Focused` + `Disabled` only - size × variant are IconButton's,
already covered there. (Distinct from independent axes: there the axes don't
interact; here the wrapper delegates them wholesale.)

**A composition pattern owns the values it hardcodes.** Same paint-vs-forward
test as the primitives, one level up: FormActionBar fixes the button set, order
and palettes; PublicPageLayout fixes `gap`, `maxW`, `minHeight`. Snapshot those;
delegate what the children paint and anything the consumer passes in.

**Composed field patterns snapshot the composition, not its parts.** A `*Field`
(`src/patterns/fields/`) has no recipe - it wraps `FormField` around an input -
so it takes two snapshots: composed resting field, composed error state.
Delegate layout / `direction` / `size` to FormField's `SmokeTest`, the
InfoButton to its `OpenInfoBox`, disabled and read-only to the input
(FormField's recipe styles neither), and every input-painted surface to that
input's audit. Read propagation from `FormField.Input`, not the pattern's JSX:
`cloneElement(child, inputProps)` delivers `isInvalid` / `isDisabled` /
`isRequired` / `isReadOnly` by context, so the prop list will tell you a state
isn't forwarded when it is.

**A compound component's unit is the recipe rule, not the realistic
composition.** With several optional slots the pull is to snapshot every
plausible arrangement - DefaultPage's info/form/tabular × main/detail. Slot
presence only makes a new surface where a **rule keys off it** (there, two
`:has()` selectors); the rest is the same slots in a different grid row. Ask
which rule the frame alone fires - "it's a realistic page" means documentation,
not a snapshot.

**An inherited token makes a cross-cell neither audit covers.** `colorPalette`
cascades, so a child with no palette default takes its host's - FormActionBar's
spinner strokes `primary.10` in save, `critical.10` in delete. One frame per
host palette.

## 4. Does the play land the frame?

**The snapshot is the play's end state.** "Chromatic waits for the entire play
function to execute and captures a snapshot only at the end," so IconButton's
six-`step()` `Base` produces exactly one. Nothing blurs the element for you:
whatever the last step leaves (a stray focus ring, a cleared value, a left-open
overlay) is what gets captured. Separate axis from assertion-honesty - a play
can assert exactly what its step names claim and still leave the wrong picture,
which is how an honest-looking `ReadOnly` / `Clearable` snapshots a focused or
emptied control. For an intermediate state, split it into its own story rather
than expect a mid-play capture.

**A play's end state is never a reason to skip a snapshot.** "Ends focused",
"ends open", "ends cleaned up", "drifts because nothing is pinned" are work to
do: adjust the play to land on the frame, or author one that does. Conversely a
snapshotted story that ends focused needs `blur()`, or the ring and caret land
in the baseline - and **a click leaves it focused**: React Aria keeps
`data-focus-visible` set after `userEvent.click`, so a clicked trigger paints
its ring even though a real mouse click wouldn't.

**Don't add a play to a snapshotted story for completeness.** Each interaction
is another frame to land deliberately, while a resting visual props alone
produce is already tested by the snapshot plus the always-on a11y check. Where a
play does belong the two aren't in tension - a story can both assert behavior
and be snapshotted. The rule is per **component**, not per story; see
[stories.md](./file-type-guidelines/stories.md) for which stories need one.

**Hide the blinking text caret on a focused input.** Focusing paints the
browser's native caret, which Chromatic can't stabilize (its
[animations docs](https://www.chromatic.com/docs/animations/) cover only CSS and
JS animations), so the snapshot diffs on whichever blink phase it lands on.
`caret-color` inherits, so one line on the canvas cascades to the input - scoped
to the story, not the shared `preview.tsx`:

```typescript
play: async ({ canvasElement }) => {
  canvasElement.style.caretColor = "transparent"; // native caret can't be paused
  await userEvent.tab();
  // ...assert the ring
},
```

**Animated components: know where Chromatic pauses.** It auto-pauses CSS
transitions, CSS/SVG animations and videos (not JS animations - pause those
manually) and seeks a **fixed** frame. The default pause point is the **last**
frame of the cycle (`pauseAnimationAtEnd: false` switches it to the first). The
trap is an `iteration-count: infinite` animation whose endpoints both hide the
content: `progress-indeterminate` sweeps a 40% pill `translateX(-100% → 300%)`,
parking it off the track at both ends, so the default snapshot is an empty
track. **Pin a representative frame** in the play (`animation: none` + an
explicit transform), as ProgressBar's `Indeterminate` does with
`translateX(75%)`. A full-turn `spin` needs no pin - both endpoints render
identically. The docs don't spell out the infinite case, so confirm the paused
frame on the first run.

**Pin dates; opt live ones out.** A snapshotted date story pins a fixed anchor
(a `CalendarDate` / `CalendarDateTime` in the args or `defaultValue` /
`defaultFocusedValue`). One rendering a live "today" drifts the baseline daily,
so it omits `tags: ["vrt"]` and verifies its behavior with a play instead.

**Await state your component _derives_ from an image load.** Chromatic waits for
images to load, but not for that (Avatar hides its `<img>` until `onLoad`, and
swaps to a fallback on error). Serve images locally (`staticDirs`) to avoid a
flaky network dependency, and wait in the play for the post-load / post-error
state you mean to snapshot. See [stories.md](./file-type-guidelines/stories.md)
for the pattern.

**Fonts/async loading can shift tooltips/menus** - relevant to IconButton's
`ColorPalettes` story (it wraps each button in a `Tooltip`). Preload fonts or
add a delay if those snapshots turn out flaky.

## 5. Packing the surfaces into frames

**Coverage is the target; the matrix is only the cheapest container.** Cost has
two levers and no others: TurboSnap bills unchanged snapshots at 1/5, and
folding a `colorPalette × size × variant × state` grid into one `SmokeTest`
keeps combinatorial coverage to a single billable snapshot (a reviewer also
catches cross-axis regressions in one image). The `vrt` selection means "don't
re-snapshot a state an on-snapshot already covers", never "snapshot fewer
states". The matrix's tradeoff is granularity: a diff in any cell flags the
whole snapshot, and editing it re-snapshots the whole grid, so reserve
standalone snapshots for states needing distinct setup or isolated review
(`Focused`, `DisabledGroup`, an open menu), not straight recipe output.

**Any state the matrix can't render in one static image gets its own snapshotted
story.** This is the governing rule behind the whole section - focus rings,
disabled-but-focusable, an open tooltip/popover, special layouts. The matrix
holds the interacting axes; a state it structurally can't hold becomes a
separate frame, never a dropped state.

**A matrix is only for _interacting_ axes.** When axes are independent - one
just scales or recolors the other (Badge/Avatar `size × colorPalette`, Switch
`size × on/off`) - snapshot each as its own showcase; the cross-product adds
cells, not coverage. **Name the matrix `SmokeTest` and render it last** - the
role name stays accurate as axes change, and the axis list goes in the doc
comment.

**Over the axes it does span, the matrix must be exhaustive.** A single-axis
showcase varies one axis with the rest at defaults, so
`size="2xs" variant="ghost" colorPalette="critical"` is captured by **nothing**
but the matrix - exactly where recipe regressions hide. Axis arrays span the
**full supported range**; a trimmed or commented-out value leaves those cells
covered by nothing. Scope call: matrices iterate the 6
`SEMANTIC_COLOR_PALETTES`; the `BRAND` (3) and `SYSTEM` (25) palettes run the
same token machinery and are deliberately not snapshotted.

**Fold an axis in only if it interacts.** `disabled` is the canonical exception:
it resolves to a single shared `layerStyle` (`opacity: 0.5` +
`cursor: not-allowed`) identical across every palette/size/variant, so a
`Disabled`/`DisabledGroup` story captures it once instead of the matrix
re-rendering every cell at half opacity for no new coverage.

**The fold-out only holds while what it dims is uniform**, so it loses to "cover
distinct state-combinations" below. `layerStyle: "disabled"` dims whatever sits
underneath, so once another state repaints that surface - Tree and DraggableList
both tint `[data-selected]` - selected-disabled is a separate pixel and belongs
in the matrix (FEC-1180: missed in both). Whether it exists at all depends on
the selection model: React Aria reassigns single selection away from a disabled
item (unreachable in Tabs), while consumer-owned props and multi-select allow
it.

**An axis the recipe hardcodes was never an axis.** MultilineTextInput pins
`colorPalette: "neutral"`, so its matrix is `state × size × variant` with no
palette axis - don't force the full `SEMANTIC_COLOR_PALETTES` sweep onto a
recipe that can only ever render one. Distinct from the uniform-transform case
above: `disabled` is a real axis folded out; a hardcoded palette had nothing to
fold.

**Cover distinct state-combinations, not just single flags.** With multiple
booleans (selected, disabled, invalid, read-only), each combination that renders
differently needs coverage: selected-disabled is visually distinct from
unselected-disabled, so a `Disabled` story showing only the unselected case
leaves a gap.

**One state rendered more than one way → one story each, not a gallery frame.**
Check whether the component renders `Focused` / `Disabled` / `ReadOnly` /
`Invalid` mode- or variant-driven before assuming one story covers it.
MoneyInput renders focus and disabled two ways - dropdown mode (a currency
Select) and label mode (`currencies={[]}`, a static label with its own
`currencyLabel[data-disabled] { opacity: 0.5 }` rule) - so it carries
`Focused` + `FocusedWithCurrencyLabel` and `DisabledState` +
`DisabledWithCurrencyLabel`. Independent surfaces don't interact the way matrix
axes do, so folding them into one render trades away their independent baselines
and per-surface triage. Snapshot count isn't a performance concern (Chromatic
parallelizes; TurboSnap keeps a stable extra story near free).

**Modes are for global config, not component props.** Chromatic
[modes](https://www.chromatic.com/docs/modes/) (`chromatic.modes`) capture the
same story under different _global_ settings - viewport, theme, locale - each
independently baselined. A difference you produce by passing props (MoneyInput's
dropdown vs. label mode) is a separate **story**, not a mode. No modes are
configured: one desktop viewport, light theme.

## Sources

- [Visual tests](https://www.chromatic.com/docs/visual/)
- [Snapshots](https://www.chromatic.com/docs/snapshots/)
- [Interaction tests](https://www.chromatic.com/docs/interactions/)
- [Disable snapshots](https://www.chromatic.com/docs/disable-snapshots/)
- [TurboSnap](https://www.chromatic.com/docs/turbosnap/)
- [Modes](https://www.chromatic.com/docs/modes/)
