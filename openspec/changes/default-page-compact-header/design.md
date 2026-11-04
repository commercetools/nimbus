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
    `DefaultPage.Content`. The header is not inside the element that scrolls.
  - `layout="flexible"` + `stickyHeader`: Root grows with its content. The
    header uses `position: sticky` inside the element that scrolls. That element
    is outside Nimbus. It can be the document or any ancestor, also across
    shadow DOM boundaries, and it can start anywhere on the screen.
- **Host CSS can change the layout.** Recipe styles are emitted in a CSS layer,
  and unlayered host CSS overrides them. Pages also set style props, for example
  a top padding on `DefaultPage.Content`.
- **Other code writes the scroll position too:** the user, smooth scrolls
  (`scrollIntoView`, `scroll-behavior: smooth`), `#hash` links and the browser's
  scroll restoration.
- **Header parts.** `BackLink`, `Title`, `Subtitle`, `Actions` and `TabNav` are
  laid out by a grid on `DefaultPage.Header` (`1fr auto`).
- **Scroll-driven animations.** Animations whose progress follows a scroll
  position instead of time, through view and scroll timelines, with `rangeStart`
  and `rangeEnd`. Supported in Chrome and Edge 115, Safari 26 and Firefox 159
  (released October 27, 2026). The current Firefox ESR is 153, and the calendar
  lists 175 as the next ESR. Safari 26.0 to 26.3 run them on the main thread;
  Safari 26.4 moved them to a separate thread. Sources:
  https://caniuse.com/mdn-css_properties_animation-timeline,
  https://caniuse.com/mdn-api_element_animate_options_rangestart_parameter,
  https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Releases/159,
  https://firefox-admin-docs.mozilla.org/release-notes/,
  https://whattrainisitnow.com/release/?version=esr,
  https://webkit.org/blog/17862/webkit-features-for-safari-26-4/.
- **Constraint.** WCAG 2.1 AA.

## Goals / Non-Goals

**Goals:**

- One behavior for consumers in both layouts, whatever technique each layout
  needs.
- The header follows the user's scrolling directly.
- No layout shift the user did not cause: the content moves only with the
  scroll, never by itself.
- Sharp text whenever the header rests.
- No scroll listeners and no script work on every frame in the main path.
- Existing consumer code keeps compiling.

**Non-Goals:**

- Showing the full header on demand (hover, focus or tap) while the content is
  scrolled. The full header returns at the top.
- Holding the header in place while the mouse pointer is over it. The header
  follows the scroll position (see Risks, tab clicks). The one-step fallback
  keeps its hold.
- Changing the default layout, or unpinning the header on very short screens.
- A controlled API for the state (`collapsed` / `onCollapsedChange`).
- `ModalPage`. The approach was checked against it (decision 15). It adopts the
  hooks in a later change.
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
- **Alternative: `collapsibleHeader`.** Rejected. In Nimbus, `collapsible` means
  the user collapses something: `Splitter` collapses "via Enter on the focused
  handle or the controlled `collapsed` prop" (`splitter.types.ts`). This header
  collapses because of scrolling, and the name says so.
- **Alternative: a prop to choose the technique.** Rejected. Consumers get one
  behavior; Nimbus chooses the technique (decision 12).

### 2. Types: a plain boolean in every branch, with a development warning

`collapseHeaderOnScroll?: boolean` is added to both branches of the union. When
the header is not pinned (`layout="flexible"` without `stickyHeader`), the
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

`DefaultPage.Header` children may also be a function (decision 11).

### 3. The header follows the scroll position

- **Collapse distance.** The full header height minus the pinned height
  (decision 8), rounded to whole pixels, so the pinned header sits on the pixel
  grid.
- **Where it runs.**
  - Flexible layout: a view timeline of Root, from `exit-crossing 0px` to
    `exit-crossing <distance>px`. The change starts when the top of Root reaches
    the top of the scrolling area, so content above Root in the same scroller
    does not count.
  - Constrained layout: a scroll timeline of `DefaultPage.Content`, from `0px`
    to `<distance>px` of its scroll position.
- **Continuous.** Every scroll position in the range has its own in-between
  form. Scrolling back plays it backwards. If the user stops in between, the
  header stays in between.
- **No scroll writes.** Nothing outside the header changes size or position
  except with the user's scroll (decision 4), so the component never writes the
  scroll position, needs no pause and does not interrupt smooth scrolls.

Alternatives:

- **One-step change after scrolling pauses.** The first implementation of this
  change. A collapse that gives space back must correct the scroll position, and
  writing it during a scroll stops smooth scrolls (the CSSOM View spec:
  performing a scroll must first "Abort any ongoing smooth scroll"; in a test,
  `scrollIntoView({ behavior: "smooth" })` stopped after about 11 pixels). So
  the change had to wait for a 150 millisecond pause and could not follow the
  scroll. It stays as the fallback (decision 12).
- **A timed animation of the one-step change.** Prototyped ("keep the space",
  200 milliseconds). Rejected: it still waits for the pause and is not tied to
  the scroll. Deleted.
- **View transitions.** Tested in Chromium and WebKit: during a transition the
  page did not receive clicks, and a second document-level transition cancelled
  the first, including transitions of the app. Rejected.
- **One scroll listener that writes a progress value.** Rejected. It runs script
  on the main thread on every frame, and all three engines now support
  scroll-driven animations.

### 4. No layout shift: how the header gets shorter

- **Flexible layout.** The header keeps its full height in the page. Its sticky
  `top` is minus the collapse distance, so normal scrolling moves it up until
  only the pinned height is visible. Nothing after the header moves.
- **Constrained layout.** Two scroll-driven animations of layout properties,
  always running:
  - the header's top margin goes down by the collapse distance: the header moves
    up, and its grid row gets shorter. Root has `overflow-y: clip`, so the
    header is cut off at Root's top edge;
  - the content area's top padding grows by the same amount, so the content
    moves exactly with the scroll.

  Both start from the values the page sets itself, read before the animations
  run, so a page's own padding or margin stays in effect. The content area, with
  its scrollbar, always starts at the bottom of the header. In the range, the
  browser lays out the header and the content area on each frame; past the range
  the values stay the same. Measured in Chromium, scrolling 2 pixels per frame
  through the range and back: median 16.7 milliseconds per frame, slowest 17.7
  milliseconds (runs 2 and 3; run 1 after load had one 50 millisecond frame,
  cause unknown). Tested in Chromium and WebKit: the growing padding did not
  move the scroll position by itself.

Alternatives:

- **Constrained: move the header with a transform, and let the content area
  reach up under it.** Prototyped and rejected: the content area's scrollbar
  started behind the header, a page's own top padding replaced the compensation,
  and the header moved with a transform (decision 5 on soft text).
- **Shrink the header height and let the content area grow, without
  compensation.** Rejected: the content would move twice as fast as the scroll
  in the range.

### 5. Header parts move with transforms, and rest without animations

- **Motions.**
  - Title: moves to its collapsed place and scales to the collapsed font size.
    It keeps its lines (decision 7).
  - Back link: the icon moves before the first line of the title. The label
    fades out in the first half.
  - Subtitle: stays below the title and fades out in the first half. In the
    second half it lets clicks through to the parts below it.
  - Actions: move to the middle of the title row.
  - Tab navigation: stays at the bottom of the header.
- **Created once, run by the browser.** Script measures the two forms
  (decision 9) and creates Web Animations with the scroll-driven timeline. No
  script runs while scrolling.
- **Rest.** While an animation moves or scales an element, the browser draws
  that element from a picture, and its text looked soft (reported on a 1x
  display; it could not be reproduced in headless Chromium). So at rest the
  parts have no animations:
  - pinned: their end look as fixed styles, with moves rounded to whole device
    pixels;
  - at the top: no animations and no styles, 500 milliseconds after the header
    returned to its full form.
- **Leaving a rest.** A new animation takes effect one frame later.
  - Leaving the pinned form, the fixed styles stay until the animations take
    effect.
  - At the top, input that usually comes before scrolling (wheel, touch, scroll
    keys, pointer down) starts the animations ahead of the scroll.
  - Measured in Chromium at 15 pixels per frame: a scroll without such input is
    off by 4.9 and 9.9 pixels for two frames; leaving the pinned form is off by
    4.9 pixels for one frame (constrained: two frames). With a wheel, one frame.

Alternatives:

- **Keep the animations at rest.** Rejected: soft text.
- **Fill only backwards, with the end look as a fixed style.** Rejected after a
  test: Chrome keeps the animation active past the end of the range.
- **Layout properties for the parts** (position offsets, font size). Rejected:
  the title's line breaks would change on every frame, and the parts would
  depend on the main thread.

### 6. The state comes from an `IntersectionObserver`

- The header is observed with two thresholds: all of it visible (minus half a
  pixel) means **full**; no more than the pinned height visible (plus half a
  pixel) means **pinned**; anything in between means **collapsing**.
- This works because in both layouts the visible part of the header changes with
  the scroll position: in the flexible layout through sticky positioning, in the
  constrained layout through the top margin and Root's clip. In the constrained
  layout the layout animations therefore always run.
- Only the ratio is used. Chrome reports `isIntersecting: false` below the first
  threshold, even when part of the header is visible (tested).
- A ratio of 0 (the header scrolled away with an outer scroller) keeps the
  current state.
- **Alternative: scroll listeners.** Rejected: script on every scroll event.

### 7. Long titles keep their lines

- The title is scaled, not cut. When the scaled title is taller than the
  collapsed title row, the row grows by the difference, and the pinned height
  includes it. The text keeps the normal space above and below it.
- Pages that want one line truncate the title themselves: `DefaultPage.Title`
  takes style props, so `truncate` or `lineClamp` work. The header measures
  itself again when the title changes size.
- The one-step fallback keeps the lines too, so long titles look the same in
  both techniques. This differs from the design value "one line" (Open
  Questions): multi-line titles were supported before, and the component must
  not take them away.
- **Trade-off.** Because the title is scaled, its collapsed line spacing is the
  full line height times the scale (25.6 pixels in the stories), not the
  collapsed design value (22 pixels).
- **Alternatives:** a crossfade to a one-line copy with an ellipsis, and showing
  only the first line. Rejected: both cut the title.

### 8. Pinned state: compact back link and tooltip

- When the header is pinned, Nimbus marks the header with an internal attribute.
  The recipe then hides the back link label visually and makes the link a 24 by
  24 pixel box around its icon. Negative margins keep the link's outer size and
  the icon's place, so nothing else moves.
- The back link tooltip turns on (decision 13).
- The pinned height is the collapsed form's height plus the extra title row
  height (decision 7).

### 9. Measuring both forms with hidden copies

Both forms are measured on copies of the header:

1. Clone the header (`cloneNode(true)`), set or remove the collapsed styling
   attribute, set `aria-hidden="true"` and `inert`, and remove the fixed rest
   styles of the live parts from the copy.
2. Place it inside Root at the top, absolutely positioned, with the header's
   current width and `visibility: hidden`, so it cannot change the layout or the
   scrollable area.
3. Read the header height and the boxes of the parts (title with font size and
   line height, back link and its icon, actions, tab navigation), and remove the
   copy, all in the same task, before paint.

This runs on mount and when the header changes size. The live header and the
scroll position are never touched.

- **Alternative: set the collapsed style on the live header for a moment.**
  Rejected. On a short page scrolled to the bottom, the browser clamps the
  scroll position while the header is briefly shorter. In a test the content
  jumped 47 pixels (constrained) and 79 pixels (flexible).
- **Alternative: compute it from the design tokens.** Rejected. The page width,
  the title length and the actions change the real sizes.

### 10. One header state, internal attributes

The header state (full, collapsing, pinned) lives in the hook and the context.
Nimbus writes internal attributes on the header for its own styles: the
collapsed form of the one-step fallback, and the pinned state of the
scroll-driven change. They are not documented and not public API.

- The recipe gets a boolean `collapseHeaderOnScroll` variant, like
  `stickyHeader`. Pages without the option get none of these styles.
- **Alternative: document the attribute for page styles.** Rejected. Pages would
  target Nimbus internals (decision 11).

### 11. Header state for page content: a function as children

`DefaultPage.Header` accepts a function as children that receives
`{ isCollapsed }`.

- Scroll-driven: `isCollapsed` turns `true` with the first scrolled pixels, as
  soon as the header starts to collapse, and `false` when it is back in its full
  form.
- One-step fallback: `isCollapsed` is `true` while the header shows its
  collapsed form.
- Page content does not get the transitions of the Nimbus parts. Content that
  changes its size when the state changes makes the header measure itself again,
  and the page content can move.
- When the header cannot collapse, `isCollapsed` is always `false`.

### 12. One-step fallback

Used when the browser has no view or scroll timelines, or when
`prefers-reduced-motion: reduce` matches. Motion that follows the user's
scrolling is motion triggered by interaction (WCAG 2.3.3,
https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html).

The fallback is the first implementation of this change:

- **When.** Collapse once the scroll distance reaches a threshold, return to the
  full form when it is below 1 CSS pixel, keep the form in between. Apply a
  change only after no scroll event happened for 150 milliseconds, and not while
  the mouse pointer is over the header (released when the pointer leaves or the
  wheel is used over the header).
- **Scroll distance.** `content.scrollTop + max(0, header.bottom − content.top)`
  with edges from `getBoundingClientRect()`, measured on `scroll` events in the
  capture phase on the document and on every shadow root between Root and the
  document (flat tree), ignoring unrelated targets. `ResizeObserver` with
  `{ box: "border-box" }` on header and content; form changes never apply
  synchronously in its callback.
- **Constrained layout.** The header gives its space back. The threshold is the
  space given back plus 8 CSS pixels. A collapse after a scroll corrects the
  scroll position by the space given back, in the same task, with
  `behavior: "instant"`, so the content stays still. No correction after a jump
  or on the first measurement. At the top, the scroll offset of the scrolling
  element is saved and restored around the change (Chromium scroll anchoring).
- **Flexible layout.** The collapsed header keeps its full height in the page
  with a bottom margin, so nothing after it moves and no correction is needed.
  The threshold is 8 CSS pixels after the content reaches the space the header
  keeps.
- **Motion.** The height changes at once. Parts that appear fade in (150
  milliseconds, `ease-out`); `_motionReduce` removes the fade.

### 13. Collapsed form

- `Subtitle`: hidden visually with a technique that keeps it in the
  accessibility tree. No `display: none` or `visibility: hidden`.
- `BackLink`: the icon only, on the title row, inside grid column 1, so the
  columns of the header grid do not change. The label is hidden visually and
  stays the accessible name. The pointer target is at least 24 by 24 CSS pixels
  (WCAG 2.2, 2.5.8).
- **Back link tooltip.** In the collapsed form (pinned, in the scroll-driven
  change), a Nimbus `Tooltip` shows the label on hover and keyboard focus. The
  tooltip text is the label.
  - The tooltip must not add an `aria-describedby` to the link. The tooltip
    content is `aria-hidden`.
  - In the full form the tooltip is disabled.
  - Tooltips do not open on touch. This is documented.
- `Title`: the collapsed font size, all lines (decision 7).
- `Actions`: on the title row.
- `TabNav`: below the title row.
- Header padding gets smaller.
- The back link label is wrapped in its own element on every page.
- **BackLink docs.** `default-page.dev.mdx` currently tells pages to set an
  `aria-label` on the back link, but the code renders the label as text. The
  docs are corrected: pass the label as children.

### 14. The header height as a CSS variable

While the option is on and the header has been measured, Root sets
`--default-page-header-height`:

- scroll-driven: the pinned height, a fixed value;
- one-step fallback: the current header height, updated with each change.

Documented uses, in the flexible layout with a sticky header: `top` for sticky
elements inside the page, and `scroll-margin-top` on anchor targets. Rules in
the docs: always with a fallback (`var(--default-page-header-height, 0px)`); not
for `scroll-padding-top` (the scrolling element is outside Root); not in the
constrained layout (the header does not cover the content); not for sizes.

- **Alternative: the visible height on every frame.** Rejected: it changes on
  every scrolled frame while the header collapses, which costs main-thread work.
  Trade-off: a jump target that ends within the first collapse distance of the
  page can be partly covered.

The name follows the component prefix used elsewhere (`--accordion-height` in
`accordion.recipe.ts`).

### 15. Built for reuse, and checked against ModalPage

The hooks take the header, content and container elements and the layout, and
make no other assumptions about DefaultPage. `ModalPage` can adopt them in its
own change; the hooks then move to `packages/nimbus/src/hooks/`.

- ModalPage always pins its top bar, header and footer, and its content scrolls
  (`modal-page.recipe.ts`: grid rows `auto auto 1fr auto`, content
  `overflow: auto`). That is the constrained technique (decision 4).
- Its header has `Title`, `Subtitle`, `Actions` and `TabNav`.
- Differences for that change: no back link in the header (it lives in
  `ModalPage.TopBar`); the variable is `--modal-page-header-height`;
  `ModalPage.Title` is a `div` around an `h2`; `ModalPage.Root` does not call
  `splitVariantProps`.

## Risks / Trade-offs

- [A tab click that scrolls the page to the top returns the header to its full
  form at once, so the tabs move down under the pointer] → Accepted (decision of
  2026-11-04) and documented. The one-step fallback keeps its pointer hold.
- [When scrolling starts without input that comes before it (a `#hash` link, a
  script), the parts are off for one or two frames; leaving the pinned form, for
  one frame (constrained: two)] → Measured (decision 5) and accepted.
- [If the user stops scrolling in the range, the header stays half collapsed] →
  By design (decision 3).
- [Firefox ESR 153 and Safari before 26 get the one-step change] → Same result,
  without the transition (decision 12).
- [The speed in Firefox and in Safari 26.0 to 26.3 was not measured] → Checked
  by hand (tasks).
- [The collapsed line spacing of a scaled multi-line title differs from the
  design value] → Accepted (decision 7).
- [In the constrained layout, Root clips its content at its top and bottom edge,
  for example a focus ring that touches the edge] → Accepted (decision of
  2026-11-04).
- [Page content in the header that changes size with `isCollapsed` makes the
  page content move] → Documented (decision 11).
- [A jump target within the first collapse distance can be partly covered] →
  Accepted (decision 14).
- [The hidden copies duplicate element IDs for a moment] → They are never
  painted, are `aria-hidden` and `inert`, and are removed in the same task.
- [A full-height scroll area inside the content (for example a Splitter) in the
  constrained layout is not the element that scrolls, so the header does not
  collapse] → Documented.
- [In JSDOM there are no scroll timelines and every rectangle is 0, so the
  header always shows its full form in consumer unit tests] → Documented: test
  the collapse in a real browser.
- [The development warning appears only in development builds] → The docs state
  the pinned-header requirement.
- [Snapshot tests of pages with a back link change, and `getByText` on the back
  link returns the wrapper element] → Mentioned in the changeset, with
  `getByRole("link", { name })` as the recommended query.
- [The Nimbus Tooltip has no border, so it loses its edge in forced colors mode]
  → A Tooltip issue, outside this change.

## Migration Plan

Additive and opt-in. Existing code keeps compiling. No migration for existing
pages. Rollback: remove the prop.

## Open Questions

- **Resolved (2026-11-04): exact collapsed values.** Source: the compact header
  frame in Figma, file key `tfXVZi7JOixYEhZqjg954I`, node `2603:7737` ("Header
  Detail Page", 88 pixels high), and its design note, node `678:14220` ("Header
  — Compact scroll state").
  - Header padding: 12 pixels top and bottom (`spacing.300`). With a TabNav, 0
    at the bottom and 12 pixels (`spacing.300`) above the TabNav. Horizontal
    padding does not change.
  - Title: font size 16 pixels (`fontSizes.400`), line height 22 pixels
    (`lineHeights.550`), weight unchanged. The design shows one line; decision 7
    keeps all lines.
  - Back link: a 24 by 24 pixel icon (`sizes.600`), 4 pixels (`spacing.100`)
    before the title.
  - Fade timing (one-step fallback): 150 milliseconds (`durations.fast`),
    `ease-out`, removed by `_motionReduce`. The design note says "State changes
    are instant"; the design owner has not decided yet.
