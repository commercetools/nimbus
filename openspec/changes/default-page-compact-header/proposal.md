# Proposal

## Why

A pinned `DefaultPage` header keeps the page actions and navigation in reach,
but it uses its full height at every scroll position. When the user works in
the content, much of that height shows orientation information they already
have (subtitle, back link label, a large title). This takes room from the
content, and on short screens or at high browser zoom it can leave almost no
room at all.

Pages have no way to give this space back. In the default `constrained` layout
the header is always pinned and cannot be made smaller.

## What Changes

- `DefaultPage.Root` gets a new optional boolean, `collapseHeaderOnScroll`, in
  every layout. It has an effect wherever the header is pinned: with
  `layout="constrained"` (the default) and with `layout="flexible"` plus
  `stickyHeader`. With `layout="flexible"` and no `stickyHeader` it has no
  effect, and development builds log a warning.
- While the user works in the content, the header shows a **collapsed form**:
  - The subtitle is hidden visually. It stays available to assistive
    technology.
  - The back link shows only its icon, on the title row. A tooltip shows its
    label on hover and keyboard focus.
  - The title stays, smaller and on one line.
  - Actions, tab navigation and any other header content stay visible, in their
    places.
- The header collapses once the content has scrolled a little more than the
  height the header gives back. It returns to its full form only when the
  content is back at the top. In between, it keeps its current form.
- The header changes form only when scrolling has paused, and not while the
  mouse pointer is over the header. It never interrupts the user's scrolling or
  a smooth scroll.
- When the header collapses after the user scrolled, the content the user is
  reading stays where it is on screen.
- The header has `data-collapsed="true"` while it shows its collapsed form, so
  pages can adapt their own header content.
- Root publishes the current header height as the CSS variable
  `--default-page-header-height`, for sticky offsets and `scroll-margin-top`
  inside the page.
- The height changes in one step. Parts that appear fade in.
  `prefers-reduced-motion` turns the fade off.
- The BackLink docs are corrected: the label is passed as children, not as
  `aria-label`.
- Pages without `collapseHeaderOnScroll` look and behave as before.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `nimbus-default-page`: new requirements for collapsing the header on scroll,
  the collapsed form, the header height variable and accessibility. "Namespace
  Structure", "Header Layout" and "Back Navigation Link" now describe the full
  form. "Type Definitions" gains `collapseHeaderOnScroll`.

## Impact

- **Code**: `packages/nimbus/src/components/default-page/`: types, recipe,
  Root, Header and BackLink parts, a new hook and context for the header state,
  stories, docs.
- **Public API**: additive. A new optional `collapseHeaderOnScroll` prop on
  `DefaultPage.Root`, a `data-collapsed` attribute on `DefaultPage.Header`, and
  the `--default-page-header-height` CSS variable on `DefaultPage.Root`.
  Existing code keeps compiling. `DefaultPage` is `@beta`.
- **Markup**: the back link label is wrapped in its own element on every page,
  so it can be hidden visually. Nothing changes on screen, but snapshot tests of
  pages with a back link change, and tests that find the back link with
  `getByText` now get the wrapper element instead of the link.
  `getByRole("link", { name })` is not affected.
- **Docs**: the BackLink section and the accessibility section of
  `default-page.dev.mdx`.
- **Dependencies**: none new. Uses the Nimbus `Tooltip`.
