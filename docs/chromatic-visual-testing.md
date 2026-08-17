# Chromatic Visual Regression: Authoring Stories

Chromatic captures each opted-in story in a consistent cloud browser and diffs
it against a stored baseline. A story is therefore a visual test, and this doc
is how you decide what it should capture.

This is the _why_ behind the two rule-docs that sit closer to the code: the
Chromatic section of [`stories.md`](./file-type-guidelines/stories.md) (terse
rules plus paste-ready snippets) and the
[`writing-stories` skill](../.claude/skills/writing-stories/SKILL.md) (templates
plus a validation checklist). All three group their rules under the same five
headings used below.

> **Looking for CI?** Triggers, the changed-files gate, TurboSnap, baselines and
> acceptance, the two PR checks, and merge gating live in
> [`chromatic-ci.md`](./chromatic-ci.md).

Four questions decide every snapshot call:

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

## 1. Does it paint?

**Enumerate surfaces from source, not memory.** Read the recipe (every painting
selector - `_hover`, `_focusWithin`, `_disabled`, `_active`, `data-invalid`,
`data-readonly`, ... - and every `variant`/`size` key) and the component (every
conditional render or prop, e.g. `isDisabled={x || isReadOnly}`). Coverage is
the **cross-product** of recipe states × conditional branches: a read-only field
that stays undimmed but disables its trailing button is a distinct surface even
though the field "looks like default." Any "renders like default" call must name
the exact delta you checked. What gets missed:

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
carries `ReadOnlyState`; MultilineTextInput, NumberInput and TextInput have no
`data-readonly` rule and correctly carry none.

**Primitives with no painted surface get no VRT at all.** The test isn't "has a
recipe file" - it's **does it paint, and is there a state space to enumerate?**
(Glob `*.recipe.*` when checking: some recipes are `.recipe.tsx`, so a
`.ts`-only look concludes they have none.) Each such component gets zero
snapshots plus a one-line `meta` note -
`// No VRT: <reason> (see chromatic-visual-testing.md).` - so the omission reads
as deliberate rather than forgotten. The shapes:

- **Pass-through style-prop primitives** (Box, Flex, Stack, Grid, Spacer - a
  `<div>`, no recipe). Every appearance comes from consumer style props, so a
  snapshot tests Chakra + tokens, not the component.
- **A recipe that paints nothing** (Group: `inline-flex` + `alignItems`, zero
  variants). It sets no color, border or spacing, so the pixels are the
  children's.
- **Headless / layout-transparent** (Region: `display: contents`). No box is
  rendered; the stories assert _where content lands_, which is DOM containment.
- **No DOM of its own** - providers, and behavior-only wrappers that alter a
  child without painting (MakeElementFocusable). VisuallyHidden is the same call
  inverted: it paints, but off-screen by design, so there's nothing in frame to
  diff.
- **Every axis owned by another recipe** - InlineSvg reuses `iconRecipe`, so
  Icon's `Sizes` and `CustomColor` already baseline it. Name the covering
  stories in the note, not just the delegation.

The inverse is the more common case: a primitive whose recipe **does** paint
gets a normal audit - Separator's `orientation` over a `colorPalette.6` fill,
Icon's `size`.

## 2. Is the state reachable in this frame?

**A state can be inert in the default frame - snapshot the condition that fires
it.** Nothing looks wrong: the prop is set, the story renders, and the baseline
records the state _off_ while reading as coverage. The triggers seen so far:

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
  all - its `Sizes` showcase, left at the default, renders empty boxes while its
  width assertions still pass.
- **An inherited property with nothing to inherit.** ScrollArea's viewport sets
  `borderRadius: inherit`, inert until a consumer passes a radius, so the
  rounded-corner clipping was baselined nowhere until the matrix cells set one.

**Hover and pressed need a forced pseudo-class, which a play can't deliver.**
`userEvent.hover` fires DOM events without recomputing the pseudo-class - it
yields neither a real CSS `:hover` nor React Aria's `data-hovered`, and a
synthetic `pointerenter` doesn't either. The two conventions in our recipes fail
differently: Chakra `_hover` / `_active` compile to CSS pseudo-classes, which
page JS cannot force at all, while React Aria's `[data-hovered]` /
`[data-pressed]` are JS-set attributes a play _could_ set by hand. Don't - our
recipes are split across both, so forcing the attribute styles only part of the
frame and baselines a half-hovered state, which is worse than no snapshot.
Pressed isn't automatically a no-op either: Button sets `data-pressed` but
styles no rule for it, while NumberInput's steppers paint `_active`. Check the
recipe.

**Everything else a play _can_ drive, snapshot settled** - drag-over
(`data-drop-target`), option focus (`data-focused`), selection
(`aria-selected`). Only `:hover` / `:active` / `data-hovered` have no
play-dispatchable event.

**One focus snapshot per reachable focus surface.** Fused or adjacent focusable
sub-controls, and `_focusWithin` on more than one region, need a focus story per
target - each side's ring clears the seam differently. There is no "all focused"
state, since only one element holds focus at a time, so the per-target stories
are the complete set. **Confirm the ring renders first**: on a slot that never
gets the focus state the snapshot captures nothing (DropZone: ring on the root,
focus on a hidden inner element).

**Overlays: snapshot the _open_ state** - `defaultOpen` (Dialog/Drawer/Menu) or
open it in the play and await the portal - and leave it open; the entrance
animation settles on its last frame. Each distinct open surface is its own
story: open dialogs/drawers fill the viewport with a backdrop and can't share a
frame, so there's no `SmokeTest` matrix. Opening, closing, focus trap and
dismissal stay behavioral.

**Portals land in the frame only if the page is tall enough.** An
absolutely-positioned portal adds no document height, so an overlay below a
short root is cropped - fine in Storybook, cut in the build. Dialog and Toast
fill the viewport and escape it; a listbox under one input needs a decorator
reserving room (Combobox's `roomForPopover`). Hold transient UI open
(`duration: Infinity` for toasts) and await it before the capture. A portal
component can be focusable in its own right (Toast's root has `tabIndex=0` +
`focusRing: outside`) - reach it the real way (hotkey + Tab), not a synthetic
`.focus()`.

**Stories in a file share one browser page, so teardown is a snapshot concern.**
The run sets `browser.isolate: false` (`vitest.storybook.config.ts`), so
anything held outside React survives unmount into the next story's frame:
Chakra's toast manager keeps its portal mounted, and React Aria's keyboard drag
session is a module global that only Enter or Escape ends - left live it holds
`inert` over the page and re-applies it to whatever mounts next. Clean up in
**the teardown a `beforeEach` returns**, not at the top of the next play:
Storybook runs it after the story, so it can't disturb the frame just captured,
and it still fires when the leaking story is last in the file. Snippet in
[stories.md](./file-type-guidelines/stories.md).

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
component that paints nothing (PageContent's placeholder boxes) both qualify. A
read-out doesn't, because it isn't static.

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
presence only makes a new surface where a **rule keys off it** (there, `:has()`
selectors); the rest is the same slots in a different grid row. Ask which rule
the frame alone fires - "it's a realistic page" means documentation, not a
snapshot.

**An inherited token makes a cross-cell neither audit covers.** `colorPalette`
cascades, so a child with no palette default takes its host's - FormActionBar's
spinner strokes the save palette in one frame and the delete palette in another.
One frame per host palette.

## 4. Does the play land the frame?

**The snapshot is the play's end state.** Chromatic waits for the entire play to
execute and captures only at the end, so a multi-`step()` play still produces
exactly one frame. Nothing blurs the element for you: whatever the last step
leaves (a stray focus ring, a cleared value, a left-open overlay) is what gets
captured. A play can assert exactly what its step names claim and still leave
the wrong picture - that's how an honest-looking `ReadOnly` or `Clearable` ends
up snapshotting a focused or emptied control. For an intermediate state, split
it into its own story rather than expect a mid-play capture.

**A play's end state is never a reason to skip a snapshot.** "Ends focused",
"ends open", "ends cleaned up", "drifts because nothing is pinned" are work to
do: adjust the play to land on the frame, or author one that does. Conversely a
snapshotted story that ends focused needs `blur()`, or the ring and caret land
in the baseline - and **a click leaves it focused**: React Aria keeps
`data-focus-visible` set after `userEvent.click`, so a clicked trigger paints
its ring even though a real mouse click wouldn't.

**Hide the blinking text caret on a focused input.** Chromatic's animation
pausing covers
[CSS and JS animations](https://www.chromatic.com/docs/animations/) but not the
browser's native caret, so a focused input diffs on whichever blink phase it
lands on - not a Chromatic bug to chase. `caret-color` inherits, so one line on
the canvas cascades to the input. Snippet in
[stories.md](./file-type-guidelines/stories.md).

**Animated components: know where Chromatic pauses.** It auto-pauses CSS
transitions, CSS/SVG animations and videos (not JS animations - pause those
manually) and seeks a **fixed** frame, by default the **last** of the cycle
(`pauseAnimationAtEnd: false` switches it to the first). The trap is an
`iteration-count: infinite` animation whose endpoints both hide the content:
ProgressBar's indeterminate fill sweeps a pill off the track at both ends, so
the default snapshot is an empty track. A full-turn `spin` needs no handling -
both endpoints render identically. The docs don't spell out the infinite case,
so confirm the paused frame on the first run.

**Freeze an animation with the component's own prop where it has one.** Skeleton
takes `animation="none"`, which holds its showcase still without reaching into
the DOM, and its `SmokeTest` still covers the animated values as an axis. Only
where no such prop exists does the play **pin** a frame by hand
(`animation: none` + an explicit transform), as ProgressBar's `Indeterminate`
does.

**Reduced motion can't be snapshotted, so assert the rule instead.**
`_motionReduce` compiles to a real `@media (prefers-reduced-motion: reduce)`
query: a JS `matchMedia` mock can't influence it, and forcing it would need a
Chromatic mode, which we don't configure (see **Modes are for global config**
below). So a `ReducedMotion` story stays off-snapshot and asserts the compiled
stylesheet still ships the `_motionReduce` block, anchored to the element's own
hashed class so dropping the rule fails the test.

## 5. Packing the surfaces into frames

**Any state the matrix can't render in one static image gets its own snapshotted
story.** This is the governing rule behind the whole section - focus rings,
disabled-but-focusable, an open tooltip/popover, special layouts. The matrix
holds the interacting axes; a state it structurally can't hold becomes a
separate frame, never a dropped state. Granularity is what the matrix costs you:
a diff in any cell flags the whole snapshot and editing it re-snapshots the
whole grid, so a state you want to triage independently is better off in its own
frame too.

**A matrix is only for _interacting_ axes.** When axes are independent - one
just scales or recolors the other (`size × colorPalette`, `size × on/off`) -
snapshot each as its own showcase; the cross-product adds cells, not coverage.
**`compoundVariants` settle it**: declaring one states the axes produce
something neither yields alone, so the matrix is mandatory. **Name the matrix
`SmokeTest`** - the role name stays accurate as axes change, and the axis list
goes in the doc comment.

**Over the axes it does span, the matrix must be exhaustive.** A single-axis
showcase varies one axis with the rest at defaults, so
`size="2xs" variant="ghost" colorPalette="critical"` is captured by **nothing**
but the matrix - exactly where recipe regressions hide. Axis arrays span **the
recipe's live keys**, not every key the type union names: mirroring a value the
recipe itself comments out is fine, while trimming one it still ships leaves
those cells covered by nothing. For a component with no recipe, read the one it
borrows - IconButton has none and takes `ButtonProps`, so Button's live keys are
its supported range. A value the recipe **hardcodes** collapses the axis
entirely: MultilineTextInput pins `colorPalette: "neutral"`, so its matrix is
`state × size × variant` and forcing a palette sweep onto it would render the
same cell repeatedly.

**Palette scope depends on whether it multiplies.** As a **matrix axis**,
palettes iterate `SEMANTIC_COLOR_PALETTES` - the `BRAND` and `SYSTEM` sets run
the same token machinery and would multiply every cell for no new coverage. A
**standalone `ColorPalettes` showcase** is one frame however many swatches it
holds, so it uses the shared `DisplayColorPalettes` helper (`@/utils`), which
renders all three groups labelled. Leaving such a showcase off-snapshot because
only the semantic set is in scope is a defensible call rather than a rule, but
it forgoes coverage the single frame would have carried for free.

**Cover distinct state-combinations, not just single flags.** With multiple
booleans (selected, disabled, invalid, read-only), each combination that renders
differently needs coverage: selected-disabled is visually distinct from
unselected-disabled, so a `Disabled` story showing only the unselected case
leaves a gap. Whether a combination exists at all depends on the selection
model: React Aria reassigns single selection away from a disabled item
(unreachable in Tabs), while consumer-owned props and multi-select allow it.

**`disabled` folds out of the matrix only while what it dims is uniform.** It
normally resolves to a single shared `layerStyle` identical across every
palette/size/variant, so a `Disabled`/`DisabledGroup` story captures it once
instead of the matrix re-rendering every cell at half opacity for no new
coverage. But `layerStyle: "disabled"` dims whatever sits underneath, so once
another state repaints that surface - Tree and DraggableList both tint
`[data-selected]` - selected-disabled is a separate pixel and goes back in the
matrix.

**One state rendered more than one way → one story each, not a gallery frame.**
Check whether the component renders `Focused` / `Disabled` / `ReadOnly` /
`Invalid` mode- or variant-driven before assuming one story covers it.
MoneyInput renders focus and disabled two ways - dropdown mode (a currency
Select) and label mode (`currencies={[]}`, a static label with its own disabled
rule) - so it carries `Focused` + `FocusedWithCurrencyLabel` and
`DisabledState` + `DisabledWithCurrencyLabel`. Folding them into one render
trades away their independent baselines and per-surface triage to save a
snapshot, which isn't a cost worth saving.

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
