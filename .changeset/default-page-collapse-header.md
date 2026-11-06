---
"@commercetools/nimbus": minor
---

`DefaultPage` (Beta): added `collapseHeaderOnScroll` to `DefaultPage.Root`.

- While the content is scrolled, a pinned header shows a shorter form: the
  subtitle is hidden visually, the back link shows only its icon with a tooltip,
  and the title is smaller. Actions and tabs stay visible. The full header
  returns at the top. Works with the default `layout="constrained"` and with
  `layout="flexible"` plus `stickyHeader`.
- In browsers that support scroll-driven animations, the header follows the
  scroll position. In other browsers, and when the user prefers reduced motion,
  it changes in one step after scrolling pauses.
- A title with several lines keeps all of them in the shorter form. To keep it
  on one line, truncate it with style props, for example
  `<DefaultPage.Title truncate>`.
- `DefaultPage.Header` accepts a function as children. It receives
  `{ isCollapsed }`, so pages can adapt their own header content.
- `DefaultPage.Root` sets the CSS variable `--default-page-header-height`, for
  sticky offsets and `scroll-margin-top` inside the page. When the header
  follows the scroll position, it is the height of the collapsed header; in the
  one-step change, it is the current header height.
- In the constrained layout, `DefaultPage.Root` cuts off content that reaches
  out of it at the top or bottom edge while the header follows the scroll
  position. Elements rendered in a portal, such as menus and tooltips, are not
  affected.
- The back link label is now wrapped in its own element on every page. Nothing
  changes on screen, but snapshot tests of pages with a back link change, and
  `getByText` on the label returns that element instead of the link. Use
  `getByRole("link", { name })` to find the back link.
- Docs: the back link label is its accessible name. Pass it as children, not as
  `aria-label`.
