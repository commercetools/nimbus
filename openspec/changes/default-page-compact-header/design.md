# Design

## Context

See proposal.md, "Why", for the problem. This section covers only what shapes
the approach.

- **Page configuration lives on Root.** `DefaultPage.Root` takes `layout`,
  `stickyHeader` and `stickyFooter`. Its props are a discriminated union on
  `layout`.
- **The header is pinned in two ways.**
  - `layout="constrained"` (default): Root is a grid that fills its parent. The
    header is pinned by the grid, and the content scrolls inside
    `DefaultPage.Content`.
  - `layout="flexible"` + `stickyHeader`: Root grows with its content. The
    header uses `position: sticky`. The element that scrolls is outside
    Nimbus. It can be the document or any ancestor, also across shadow DOM
    boundaries, and it can start anywhere on the screen.
- **Host CSS can change the layout.** Recipe styles are emitted in a CSS layer,
  and unlayered host CSS overrides them. A host can, for example, stop
  `DefaultPage.Content` from scrolling, so that an outer element scrolls
  instead.
- **Other code writes the scroll position too:** the user, smooth scrolls
  (`scrollIntoView`, `scroll-behavior: smooth`), `#hash` links and the
  browser's scroll restoration.
- **Header parts.** `BackLink`, `Title`, `Subtitle`, `Actions` and `TabNav` are
  laid out by a grid on `DefaultPage.Header` (`1fr auto`). Pages can also put
  their own content into the header, placed by grid column
  (`default-page.dev.mdx`, "Custom elements in the header").
- **Constraint.** WCAG 2.1 AA.

## Goals / Non-Goals

**Goals:**

- One behavior for both ways of pinning the header, and for hosts that change
  which element scrolls.
- No layout movement the user did not cause: no flicker between the forms, no
  content jump when the header collapses, no controls moving under the pointer,
  and no interruption of the user's scrolling or of smooth scrolls.
- A single source of truth for the collapsed state, used by Nimbus styles and
  by page-owned header content.
- Existing consumer code keeps compiling.

**Non-Goals:**

- Showing the full header on demand (hover, focus or tap) while the content is
  scrolled. The full header returns at the top. See decision 3.
- Changing the default layout, or unpinning the header on very short screens.
- A controlled API for the state (`collapsed` / `onCollapsedChange`).
- `ModalPage`. The API was checked against it (decision 11). It adopts the hook
  in a later change.
- Focus that scrolls under a sticky header in the flexible layout (WCAG 2.4.7).
  This exists without this change and is handled separately.
- The existing `tabIndex={0}` on `DefaultPage.Content`, which is fixed
  separately.

## Decisions

### 1. A boolean `collapseHeaderOnScroll` on Root

Root already owns the page configuration, and it is the part that knows the
layout.

- **Alternative: a prop on `DefaultPage.Header`.** Rejected. Header does not
  know the layout or whether it is pinned, and page configuration would be split
  across two parts.
- **Alternative: a value on `stickyHeader`.** Rejected. `stickyHeader` exists
  only with `layout="flexible"`, so the default layout could not use it.
- **Alternative: `collapsibleHeader`.** Rejected. In Nimbus, `collapsible`
  means the user collapses something: `Splitter` collapses "via Enter on the
  focused handle or the controlled `collapsed` prop" (`splitter.types.ts`). This
  header collapses because of scrolling, and the name says so.

### 2. Types: a plain boolean in every branch, with a development warning

`collapseHeaderOnScroll?: boolean` is added to both branches of the union.
When the header is not pinned (`layout="flexible"` without `stickyHeader`), the
option has no effect, and development builds log a warning.

**Alternative: allow it only where the header is pinned (compile error
otherwise).** Rejected after testing with TypeScript 5.9.3. Every way to write
that rule needs a third branch with `layout: "flexible"`, and this breaks code
that compiles today:

- `<DefaultPage.Root layout={l} />` with `l` typed as
  `"constrained" | "flexible"`;
- wrappers built with `Omit<DefaultPageProps, "children">` that spread the rest
  into Root;
- `({ layout, ...rest }: DefaultPageProps) => <Root layout={layout} {...rest} />`.

The change would no longer be additive.

### 3. When the header changes form

- **Collapse** when the scroll distance is at least the space given back plus 8
  CSS pixels.
- **Full form** when the scroll distance is less than 1 CSS pixel.
- **In between**, keep the current form.
- **Only when scrolling has paused**: a form change is applied once no scroll
  event has happened for 150 milliseconds. Each scroll event restarts the
  timer. The `scrollend` event is not used, because I don't know its support in
  Safari.
- **Not while the mouse pointer is over the header.** The change waits until the
  pointer leaves the header, or until the user scrolls with the wheel over the
  header. Touch has no hover, so this hold does not apply there.

**Why expand only at the top.** The collapsed form keeps every work part
(actions, tabs). Expanding again would only bring back orientation information,
and it would take room at the moment the user scrolls back to re-read
something. Nielsen Norman Group warns that headers that reappear on scroll up
"assume that any scroll up is an indication that the user wants to access the
header … the user may simply want to reread a previous paragraph"
(https://www.nngroup.com/articles/sticky-headers/). Material's
`exitUntilCollapsed` behavior expands only "when the content is pulled all the
way down" (https://developer.android.com/develop/ui/compose/components/app-bars).

**Why the space given back plus a margin.** After a collapse, the scroll
distance drops by the space given back (decision 6), so it stays at least 8 CSS
pixels and the header cannot flip back by itself. The 8 pixels absorb rounding.
With the full header height as threshold, the header would collapse very late
at 400% zoom, where the visible area can be about 236 CSS pixels tall.

**Why wait for a pause.** Changing the form during a scroll means writing the
scroll position during a scroll (decision 6). Tests showed two problems:

- A scroll write stops a smooth scroll. The CSSOM View spec says that to
  perform a scroll, the browser must first "Abort any ongoing smooth scroll". In
  a test, `scrollIntoView({ behavior: "smooth" })` stopped after about 11 pixels
  instead of 4000.
- React applies a state change one frame later. If the user scrolls in that
  frame, the correction scrolls against them (tested in Chromium and WebKit).

Waiting for a pause avoids both problems. The cost: the header changes just
after the user stops scrolling, not during the scroll.

**Why hold while the pointer is over the header.** A tab click often resets the
scroll position to the top. Without the hold, the header would expand right
after the click, and the tab row would move down by the space given back under
the pointer. A quick second click would then hit the title.

Alternatives:

- **Expand on scroll up.** Rejected, see above.
- **Shrink the header continuously with the scroll** (also with CSS
  scroll-driven animations). Rejected. Hiding the subtitle and moving the back
  link are on/off changes, and a continuous shrink changes the layout on every
  frame.
- **Change the form during the scroll, with safeguards.** Rejected. Smooth and
  programmatic scrolls cannot be detected reliably, so the correction would
  still interrupt some of them.
- **Show the full header on hover, focus or tap.** Rejected. To reach an action
  or a tab, the pointer crosses the header, and the full form would move those
  controls down while the user aims at them. It would also bring the WCAG 1.4.13
  duties. The back link tooltip (decision 7) covers the label.

### 4. Measuring the space given back with a hidden copy

The collapsed height is measured on a copy of the header:

1. Clone the header element (`cloneNode(true)`), set `data-collapsed="true"`,
   `aria-hidden="true"` and `inert` on the copy.
2. Place it inside Root at the top, absolutely positioned, with the header's
   current width and `visibility: hidden`, so it cannot change the layout or
   the scrollable area.
3. Read its height and remove it, all in the same task, before paint.

This runs on mount and when the full header changes size. The live header and
the scroll position are never touched.

- **Alternative: set the collapsed style on the live header for a moment.**
  Rejected. On a short page scrolled to the bottom, the browser clamps the
  scroll position while the header is briefly shorter. In a test the content
  jumped 47 pixels (constrained) and 79 pixels (flexible).
- **Alternative: add up the parts that disappear** (back link row, subtitle,
  padding and line-height differences). Rejected. It is wrong when the actions
  are taller than the collapsed title line.
- **Alternative: compute it from the design tokens.** Rejected. Page-owned
  header content and the page width change the real height.

### 5. One measurement of the scroll distance for both layouts

`distance = content.scrollTop + max(0, header.bottom − content.top)`, with both
edges from `getBoundingClientRect()`.

- In the constrained layout, `header.bottom` equals `content.top`, so the
  distance is `content.scrollTop`.
- In the flexible layout, `content.scrollTop` is 0. Once the header is stuck,
  the content moves under it and `header.bottom − content.top` grows.
- If host CSS changes which element scrolls, the formula still applies. If host
  CSS unpins the header, the distance stays 0 and the header keeps its full
  form.
- Tests confirmed the formula with the scroll container 200 pixels down, an
  app bar above Root, a sticky footer and padding on Content.

When to measure:

- On `scroll` events, through listeners in the capture phase
  (`{ capture: true, passive: true }`) on the document and on every shadow root
  between Root and the document. The walk follows the flat tree
  (`assignedSlot`, then the shadow root's `host`), because `getRootNode()` and
  `Node.contains()` do not cross shadow boundaries. Events whose target is not
  the document, `DefaultPage.Content` or a flat-tree ancestor of Root are
  ignored, so nested scroll areas inside the content (for example the DataTable)
  do not count.
- When the header or the content changes size: `ResizeObserver` with
  `{ box: "border-box" }`, because padding-only changes are not reported with
  the default content box.
- A form change is never applied synchronously inside the `ResizeObserver`
  callback. It goes through the pause timer. Header and content are at the same
  depth in the tree, so a synchronous change there causes the "ResizeObserver
  loop completed with undelivered notifications" error.

Alternatives:

- **Measure per layout** (`scrollTop` in constrained, edge positions in
  flexible). Rejected. In a host that changes which element scrolls, the header
  would silently never collapse.
- **`IntersectionObserver` with the viewport as root.** Rejected. Its edges are
  those of the browser window, not of the scroll container, and it stops
  reporting once the observed element is fully hidden by the scroll container.
- **Find the nearest scrollable ancestor at mount.** Rejected. It breaks when
  the layout or overflow styles change after mount.

### 6. Keep the content still when the header collapses

When the pause timer applies a collapse, it does everything in one task, before
paint:

1. Read the reference point `content.top − content.scrollTop`, the screen
   position of the start of the content.
2. Write `data-collapsed` on the header directly, and sync the React state.
3. Read the reference point again and scroll by the difference with
   `scrollBy({ top, behavior: "instant" })`. The element to scroll is
   `DefaultPage.Content` when it is the element that scrolls. Otherwise it is
   the target of the last scroll event.

`behavior: "instant"` keeps a host's `scroll-behavior: smooth` from animating
the correction. Because the correction runs only after a pause, it never
interrupts the user's scrolling or a smooth scroll.

No correction in these cases:

- **After a jump.** If the scroll position changed in one step by more than the
  space given back (scroll restoration, a `#hash` link), the collapse happens
  without a correction. The target then ends directly below the collapsed
  header, instead of the space given back further down.
- **On the first measurement.** The collapse happens without a correction and
  without a fade.
- **When returning to the full form at the top.** The content then starts
  directly below the full header. In Chromium, scroll anchoring can still move
  the scrolling element when content sits above Root in the same scroller.
  So the scroll offset of that element is saved before the change and set back
  after it.

Tests found no double correction. Hiding the subtitle takes it out of the flow,
and the scroll anchoring spec suppresses adjustment when an element "becomes or
stops being absolutely positioned". So the browser does not correct, and the
correction in this decision does the work in every engine.

**Alternative: let the content jump.** Rejected. The visible text would move up
by the space given back, under the user's eyes.

### 7. Collapsed form: hide orientation, keep work in place

- `Subtitle`: hidden visually with a technique that keeps it in the
  accessibility tree. No `display: none` or `visibility: hidden`.
- `BackLink`: the icon only, inside grid column 1 on the title row, so the
  columns of the header grid do not change. The label is hidden visually in the
  same way as the subtitle, and stays the accessible name. The pointer target is
  at least 24 by 24 CSS pixels (the WCAG 2.2 AA minimum, 2.5.8).
- **Back link tooltip.** In the collapsed form, a Nimbus `Tooltip` shows the
  label on hover and keyboard focus. The tooltip accepts links as triggers
  (`tooltip.dev.mdx`). The tooltip text is the label, so tooltip text, visible
  label and accessible name are the same.
  - The tooltip must not add an `aria-describedby` to the link. React Aria sets
    one while the tooltip is open, which would make screen readers read the
    label twice. The tooltip content is `aria-hidden`.
  - In the full form the tooltip is disabled.
  - Tooltips do not open on touch. On touch devices the collapsed back link
    shows only its icon, and its name stays available to assistive technology.
    This is documented.
- `Title`: smaller font size and line height, one line, ellipsis for text
  titles that do not fit (see Risks).
- `Actions`: stay on the title row. With a back link, the full form places
  Actions in grid rows 2–3, so the collapsed form moves them to row 1, where the
  title is.
- `TabNav` and page-owned header content: unchanged, in the same grid column.
- Header padding gets smaller.
- The back link label is wrapped in its own element on every page. This is
  simpler than rendering the wrapper only when the option is on.
- **BackLink docs.** `default-page.dev.mdx` currently tells pages to set an
  `aria-label` on the back link, but the code renders the label as text. A page
  that follows the docs would get a screen reader name that differs from the
  tooltip. The docs are corrected in this change: pass the label as children.

### 8. One state attribute, used by Nimbus styles and by pages

`DefaultPage.Header` gets `data-collapsed="true"` while it shows its collapsed
form. It is public and documented.

- The recipe gets a boolean `collapseHeaderOnScroll` variant, like
  `stickyHeader`. It holds the collapsed styles under
  `&[data-collapsed="true"]` and the fade. Pages without the option get none of
  these styles. There is precedent for attribute selectors in recipes
  (`localized-field.recipe.ts` uses `&[data-expanded="true"]`).
- The docs show a scoped selector, `.nimbus-default-page__header[data-collapsed]`.
  A bare `[data-collapsed] &` would also match other ancestors that have the
  attribute.
- **Alternative: a private recipe variant for the state.** Rejected. The state
  would exist twice, and the variant would leak into the public slot types.

### 9. The header height as a CSS variable

While the option is on and the header has been measured, Root sets
`--default-page-header-height` to the current header height in pixels (for
example `92px`). It is updated with the form change and from the
`ResizeObserver`.

Documented uses, in the flexible layout with a sticky header, where the header
covers the top of the scrolling area:

- `top` for sticky elements inside the page;
- `scroll-margin-top` on anchor targets inside the page, so a `#hash` link does
  not hide its target under the header.

Rules in the docs:

- Always with a fallback: `var(--default-page-header-height, 0px)`. Without the
  option, before the first measurement and during server rendering, the
  variable is not set.
- Not for `scroll-padding-top`. That property belongs on the scrolling element,
  which is outside Root in the flexible layout, and custom properties are only
  inherited downwards.
- Not in the constrained layout. There the header does not cover the content,
  so an offset would leave a gap.
- Not for sizes such as `min-height` or `height`. A size that depends on the
  header height can cause a `ResizeObserver` loop error.

The name follows the component prefix used elsewhere (`--accordion-height` in
`accordion.recipe.ts`).

### 10. Motion

- The height changes in one step. Parts that appear fade in (opacity only).
  Parts that disappear are hidden at once. A visually hidden part leaves the
  layout right away, so it could not fade out while the height changes in one
  step.
- Nielsen Norman Group: "In general, it's best to not use animation at all and
  simply keep the header in place as the user scrolls", but a shrinking header
  "should not disappear, jump, or otherwise startle the user". An opacity fade
  avoids layout work on every frame.
- `_motionReduce` removes the fade.
- No fade on the first measurement.

### 11. Built for reuse, and checked against ModalPage

The hook takes the header and content elements and makes no other assumptions
about DefaultPage. `ModalPage` can adopt it in its own change. The hook then
moves to `packages/nimbus/src/hooks/`.

The API was also checked against `ModalPage`, and it fits without changes:

- **Same problem.** ModalPage always pins its top bar, header and footer
  (`modal-page.recipe.ts`: grid rows `auto auto 1fr auto`, content
  `overflow: auto`).
- **Same parts.** Its header has `Title`, `Subtitle`, `Actions` and `TabNav`,
  and they follow the same rules as here.
- **Same API.** `collapseHeaderOnScroll` on `ModalPage.Root` and
  `data-collapsed` on `ModalPage.Header`. Its Root has no `layout` prop, so the
  prop is a plain optional boolean there too.
- **Differences to handle in that change:**
  - The back link tooltip is DefaultPage-only. ModalPage's back navigation
    lives in `ModalPage.TopBar`, which is not part of the header and does not
    collapse.
  - The CSS variable follows the component prefix:
    `--modal-page-header-height`.
  - `ModalPage.Title` is a `div` around an `h2` heading, so the collapsed styles
    target the inner heading, and the "same heading element" rule applies to the
    `h2`.
  - `ModalPage.Root` does not call `splitVariantProps`, so the recipe variant is
    passed to its slot directly.

## Risks / Trade-offs

- [A title cut off with an ellipsis can fail WCAG failure F69 (1.4.4 Resize
  Text, level AA) when text is enlarged; the worst case is 400% zoom, where only
  a few characters remain next to the actions] → Accepted trade-off (decision of
  2026-10-30, confirmed after the second review). The full title shows at the
  top, and the `h1` text stays complete for assistive technology. Revisit if an
  audit flags it. The docs advise putting the part of the title that tells
  records apart first.
- [The header changes form about 150 milliseconds after scrolling stops, not
  during the scroll] → By design (decision 3).
- [While the pointer rests over the header, the header keeps its form] → By
  design (decision 3). It changes when the pointer leaves.
- [The hidden copy duplicates element IDs for a moment] → It is never painted,
  is `aria-hidden` and `inert`, and is removed in the same task.
- [Capturing listeners run for every scroll on the page] → They are added only
  when the option is on. Unrelated targets are ignored, and each check reads two
  rectangles.
- [A full-height scroll area inside the content (for example a Splitter or a
  ScrollArea) is ignored, so the header never collapses] → Documented.
- [In JSDOM every rectangle is 0, so the header always shows its full form in
  consumer unit tests] → Documented: test the collapse in a real browser through
  `data-collapsed`.
- [The development warning appears only in development builds] → The docs
  state the pinned-header requirement.
- [Snapshot tests of pages with a back link change, and `getByText` on the back
  link returns the wrapper element] → Mentioned in the changeset, with
  `getByRole("link", { name })` as the recommended query.
- [The Nimbus Tooltip has no border, so it loses its edge in forced colors
  mode] → A Tooltip issue, outside this change.

## Migration Plan

Additive and opt-in. Existing code keeps compiling. No migration for existing
pages. Rollback: remove the prop.

## Open Questions

- Exact collapsed values (padding, title font size and line height) and the
  fade timing. These come from the Nimbus design and do not change the approach.
