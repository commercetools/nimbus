# Writing Stories Validation Checklist

### Validation Checklist

You MUST validate against these requirements:

#### File Structure

- [ ] Story file location - `src/components/{name}/{name}.stories.tsx` for a
      component, `src/patterns/{group}/{name}/{name}.stories.tsx` for a pattern
      (groups: `buttons`, `actions`, `dialogs`, `fields`, `pages`)
- [ ] A large stories file is split by topic into `{name}.{topic}.stories.tsx`
      files with the same `title` and `component` (see "Splitting a large
      stories file" in `docs/file-type-guidelines/stories.md`)
- [ ] Imports from `@storybook/react-vite` and `storybook/test`
- [ ] Meta configuration with title, component, tags
- [ ] Default export of meta
- [ ] Story type from `StoryObj<typeof ComponentName>` (the component, not
      `typeof meta` - see note in `docs/file-type-guidelines/stories.md`)

#### Required Stories

- [ ] Base/Default story exists (MUST be first; in a split stories file, first
      in `{name}.stories.tsx`)
- [ ] Sizes story (if component has sizes)
- [ ] Variants story (if component has variants)
- [ ] Focused story (if component is focusable)
- [ ] Disabled story (for interactive components)
- [ ] Controlled story (for stateful components)
- [ ] SmokeTest story if the component has interacting axes; independent axes use dedicated showcase stories instead

#### Chromatic Snapshots

One line per check; the rule and its reasoning are in **Chromatic Snapshots: What
Gets Captured** in `reference/chromatic-snapshots.md`.

**0. Is the opt-in actually wired?** Mechanical, and checked first - the rest of
this list assumes the frames exist.

- [ ] **Every** story with `tags: ["vrt"]` also carries
      `parameters: { chromatic: { disableSnapshot: false } }`, on that same
      story. The tag alone captures nothing (Chromatic never reads it), so a tag
      without the parameter is a story that claims a baseline and has none - the
      failure is silent in both directions
- [ ] No story restates the project default (`disableSnapshot: true`); a
      deliberate omission is recorded as a comment, not a redundant parameter

**1. Does it paint?**

- [ ] Surfaces enumerated from the **recipe + component source** (painting
      selectors, variant/size keys, conditional props, ambient RTL/locale/theme
      axes), and snapshots cover their **cross-product** - not recalled from memory
- [ ] Every child type a **comma-separated selector** names appears in some frame
- [ ] Diffed against **sibling components'** story sets; each surface a peer
      snapshots and this one doesn't is either covered or named as not applicable
- [ ] Any "renders like default" verdict **names the exact delta** checked
- [ ] A state with **no distinct recipe surface** gets no dedicated story
      (read-only with no `data-readonly` rule renders like default)
- [ ] **Primitives that paint no surface** get **no VRT at all**, with a one-line
      `meta` note in the format
      `// No VRT: <reason> (see chromatic-visual-testing.md).` - pass-through
      style props, a recipe that paints nothing (Group, CollapsibleMotion),
      headless `display: contents` (Region), no DOM of its own (providers,
      MakeElementFocusable, VisuallyHidden), or every axis owned by another
      recipe (InlineSvg → Icon, whose covering stories the note names). Check
      whether the recipe **paints**, not whether it exists (Separator and Icon
      get normal audits)

**2. Is the state reachable in this frame?**

- [ ] **Condition-triggered** states get a frame where the trigger actually holds:
      sticky scrolled in the play (bounded `overflow: auto` ancestor,
      `offsetHeight`-derived target, each combination its own frame, and a
      `scrollHeight > clientHeight` wait before scrolling),
      `scrollBehavior="inside"` given overflowing content, a variant-zeroed surface
      pinned to the variant that paints it, an inherited property given a value to
      inherit
- [ ] A **separate `Focused` story per independent focus surface** (fused/adjacent
      controls, or multiple `_focusWithin` regions) - not one story tabbing through
      all, since only one element holds focus per snapshot. Each opts in
- [ ] The focus **ring is confirmed to render** before opting in - not styled on a
      slot that never gets the focus state (DropZone)
- [ ] **Overlays** snapshot the **open** state (rendered open, left open); each
      distinct open surface is its own story; open/close & dismissal stay behavioral
- [ ] **Portal** components (Toast/overlays): transient UI held open
      (`duration: Infinity`) and awaited; the component's own focus reached via
      its **real keyboard path**, not `.focus()`; an overlay hanging below a
      short root given `minHeight` so the crop keeps it
- [ ] State that outlives unmount (toast queue, React Aria drag session) is
      cleared in **the teardown a `beforeEach` returns** - it runs after the
      capture, so it can't disturb the frame, and it still fires when the
      leaking story is last in the file. The run is `isolate: false`; a file's
      stories share one page. Not cleaned at the top of the next play
- [ ] **`placement`** snapshotted only when it changes the **layout** (Drawer
      side/top/bottom panels), not a mere reposition (Dialog = center only;
      Menu/Tooltip RA-positioning = behavioral)
- [ ] No hand-rolled **hover/pressed** capture - a play can't force the
      pseudo-class, and setting `[data-hovered]`/`[data-pressed]` by hand
      half-styles the frame (recipes are split with Chakra `_hover`/`_active`).
      Pressed is not categorically a no-op - the recipe was checked. Everything
      else a play can drive is snapshotted settled

**3. Who owns the pixels?**

- [ ] Snapshotted stories render the component **directly** - no debug read-outs,
      value dumps, or demo-wrapper scaffolding in the frame. **Load-bearing,
      static** scaffolding is admissible and named as such
- [ ] **Thin wrappers** snapshot only the axis they introduce (+ `Focused`/`Disabled`
      if added), not a re-rendered copy of the wrapped component's matrix
- [ ] A **composition pattern** snapshots what it hardcodes, not what children paint
      or consumers pass
- [ ] A **`*Field` pattern** has exactly **two** snapshots, with every delegation
      named; `FormField.Input`'s `cloneElement` checked before calling a state
      un-forwarded
- [ ] For a **compound component with optional slots**, each frame names the recipe
      rule it alone fires (typically a `:has()` selector); plausible-but-duplicate
      compositions stay off-snapshot with a pointer to the frame that holds them
- [ ] A child **inheriting `colorPalette`** from its host is snapshotted per host

**4. Does the play land the frame?**

- [ ] Each snapshotted story's **play ends in the state the snapshot is named for** -
      no stray focus ring, cleared/mutated value, or left-open overlay unless
      intended. A play can be assertion-honest yet snapshot the wrong picture
- [ ] A story left focused by **`userEvent.click`** is blurred - React Aria keeps
      `data-focus-visible` set after a synthetic click
- [ ] Nothing is left un-snapshotted because of its play's **end state** - fix the
      play; snapshotted stories that end focused call `blur()`
- [ ] Nothing is left un-snapshotted because a play already asserts the state -
      `aria-*` values, callback arguments and attributes prove state, not pixels
- [ ] Every `step()` name matches what it asserts; raise the **assertion to the
      name**, never lower the name. No tautological assertions, no un-`await`ed
      async helpers
- [ ] No play added **for completeness** - each is there because the story's name
      makes a behavioral claim or its frame needs an interaction to exist
- [ ] Any frame ending with focus in a text input hides the caret
      (`canvasElement.style.caretColor = "transparent"`) - not just `Focused`
      stories: an open Combobox keeps focus in its input too
- [ ] **Determinism**: dates pinned to a fixed anchor (live "today" stays
      off-snapshot), no random values, async-derived state awaited
- [ ] **Animated** states: paused frame confirmed to show the target. Frozen via
      the component's **own animation-off prop** where it has one
      (`animation="none"`); the play-level **pin** (`animation: none` + explicit
      `transform`) used only where it doesn't, and required where an infinite
      animation's endpoints both hide the content (indeterminate progress)
- [ ] **Reduced motion** left off-snapshot - no Chromatic mode is configured and
      JS can't fake `@media (prefers-reduced-motion)`. The story instead asserts
      the compiled `_motionReduce` rule still ships, anchored to the element's
      own hashed class rather than a hardcoded selector

**5. Packing the surfaces into frames**

- [ ] `SmokeTest` matrix is **exhaustive** over the interacting axes the component
      has (e.g. size x variant x palette, plus selected/unselected for toggles)
- [ ] Axis arrays span the **recipe's live keys** - mirroring a value the recipe
      itself comments out is fine (Button's `lg`/`2xl`); trimming one it still
      ships is a gap. A component with no recipe takes the range of the one it
      borrows (IconButton → Button), and a value the recipe **hardcodes**
      collapses the axis (MultilineTextInput gives `state x size x variant`)
- [ ] **Palette scope matches the frame** - a matrix _axis_ uses
      `SEMANTIC_COLOR_PALETTES`; a standalone `ColorPalettes` showcase costs one
      frame regardless, so it uses `DisplayColorPalettes` (`@/utils`), covering
      all three groups
- [ ] Distinct **state-combinations** are covered, not just single flags
      (selected-disabled ≠ unselected-disabled), where the selection model makes
      them reachable
- [ ] **`disabled` is folded out** into its own story - but only while what it
      dims is uniform; once another state repaints that surface (a tinted
      `[data-selected]`), the combination is back in the matrix
- [ ] Each state checked for being rendered **more than one way** (mode-/variant-
      driven); each distinct surface gets its **own** story, not a folded gallery
      (MoneyInput: `Focused` + `FocusedWithCurrencyLabel`)
- [ ] The interacting-axes matrix is named **`SmokeTest`** (not
      `Variants`/`VariantsAndSizes`); the axis list lives in the doc comment
- [ ] Only behavior-only stories and stories whose look is already in `SmokeTest` left
      snapshot-off (project default) - never drop a visual state to save cost

#### Play Functions (CRITICAL)

- [ ] ALL interactive components have play functions
- [ ] Every `step()` name is **backed by its assertions** - if the name claims a
      behavior the checks don't prove, strengthen the checks to prove it; only
      rename/drop the claim when the behavior is genuinely another story's
      concern (and note where it's covered)
- [ ] Uses `step()` for test organization
- [ ] Uses `within()` for scoped queries
- [ ] Uses `waitFor()` for async operations
- [ ] Tests keyboard navigation (Tab, Enter, Space, Arrows)
- [ ] Tests accessibility attributes (aria-_, data-_)
- [ ] Tests state changes and synchronization
- [ ] Tests disabled states (cannot focus, cannot interact)
- [ ] Tests edge cases and boundaries

#### Query Strategy

- [ ] Prefers `getByRole()` for interactive elements
- [ ] Uses `getByLabelText()` for form inputs
- [ ] Uses `getByTestId()` sparingly
- [ ] Portal content uses parent element access
- [ ] No hardcoded selectors without good reason

#### Test Coverage

- [ ] Initial render verified
- [ ] Focus management tested
- [ ] Click/press interactions tested
- [ ] Keyboard interactions tested
- [ ] State synchronization tested
- [ ] Async operations use waitFor
- [ ] Accessibility requirements verified

#### Story Organization

- [ ] Stories in prescribed order
- [ ] Clear, descriptive story names
- [ ] Consistent args usage
- [ ] Proper use of render function for variants
