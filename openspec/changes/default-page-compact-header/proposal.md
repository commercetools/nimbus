# Proposal

## Why

A pinned `DefaultPage` header keeps the page actions and navigation in reach,
but it uses its full height at every scroll position. When the user works in the
content, much of that height shows orientation information they already have
(subtitle, back link label, a large title). This takes room from the content,
and on short screens or at high browser zoom it can leave almost no room at all.

Pages have no way to give this space back. In the default `constrained` layout
the header is always pinned and cannot be made smaller.

## What Changes

- `DefaultPage.Root` gets a new optional boolean, `collapseHeaderOnScroll`, in
  every layout. It has an effect wherever the header is pinned: with
  `layout="constrained"` (the default) and with `layout="flexible"` plus
  `stickyHeader`. With `layout="flexible"` and no `stickyHeader` it has no
  effect, and development builds log a warning.
- While the user works in the content, the header shows a **collapsed form**:
  - The subtitle is hidden visually. It stays available to assistive technology.
  - The back link shows only its icon, on the title row. A tooltip shows its
    label on hover and keyboard focus.
  - The title stays, smaller. A title with several lines keeps them.
  - Actions and tab navigation stay visible, on the title row and below it.
- **The header follows the scroll position.** Over the first scrolled pixels (as
  many as the header gets shorter), it changes step by step from its full form
  to its collapsed form. Scrolling back plays this backwards. If the user stops
  in between, the header stays in between.
- **Nothing outside the header moves except with the user's scroll.** In the
  flexible layout, the header keeps its full height in the page. In the
  constrained layout, the content area gets the space the header gives back, and
  its content moves exactly with the scroll.
- **Sharp text at rest.** When the header rests at the top or in its collapsed
  form, its text is drawn at its real size.
- **One-step change where this is not available.** Browsers without
  scroll-driven animations (before Chrome and Edge 115, Safari 26 and Firefox
  159, including Firefox ESR 153), and users who prefer reduced motion, get a
  one-step change: once scrolling pauses, the header switches between its two
  forms at once.
- **Header state for page content.** `DefaultPage.Header` accepts a function as
  children that receives `{ isCollapsed }`, so pages can adapt their own header
  content.
- Root publishes the pinned header height as the CSS variable
  `--default-page-header-height`, for sticky offsets and `scroll-margin-top`
  inside the page.
- The BackLink docs are corrected: the label is passed as children, not as
  `aria-label`.
- Pages without `collapseHeaderOnScroll` look and behave as before.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `nimbus-default-page`: new requirements for collapsing the header on scroll
  (scroll-driven and one-step), the collapsed form, the header state for page
  content, the header height variable and accessibility. "Namespace Structure",
  "Header Layout" and "Back Navigation Link" now describe the full form. "Type
  Definitions" gains `collapseHeaderOnScroll` and the function as Header
  children.

## Impact

- **Code**: `packages/nimbus/src/components/default-page/`: types, recipe,
  context, Root, Header and BackLink parts, two hooks (scroll-driven and
  one-step), utilities for measuring and planning the header change, stories,
  docs.
- **Public API**: additive. A new optional `collapseHeaderOnScroll` prop on
  `DefaultPage.Root`, a function as `DefaultPage.Header` children, and the
  `--default-page-header-height` CSS variable on `DefaultPage.Root`. Existing
  code keeps compiling. `DefaultPage` is `@beta`. The attributes Nimbus sets on
  the header for its own styles are not public.
- **Markup**:
  - The back link label is wrapped in its own element on every page, so it can
    be hidden visually. Nothing changes on screen, but snapshot tests of pages
    with a back link change, and tests that find the back link with `getByText`
    now get the wrapper element instead of the link.
    `getByRole("link", { name })` is not affected.
  - With the option on, in the constrained layout, Root clips its content
    vertically (`overflow-y: clip`), and the header's top margin and the content
    area's top padding change while the page scrolls. Values that a page sets
    itself stay in effect.
- **Browsers**: the scroll-driven change needs view and scroll timelines (Chrome
  and Edge 115, Safari 26, Firefox 159). Other browsers get the one-step change.
- **Docs**: the BackLink section and the accessibility section of
  `default-page.dev.mdx`, and a new section on collapsing the header.
- **Dependencies**: none new. Uses the Nimbus `Tooltip`.
