---
"@commercetools/nimbus": minor
---

`DefaultPage` (Beta): added `collapseHeaderOnScroll` to `DefaultPage.Root`.

- While the content is scrolled, a pinned header shows a shorter form: the
  subtitle is hidden visually, the back link shows only its icon with a tooltip,
  and the title is smaller on one line. Actions and tabs stay in place. The full
  header returns at the top. Works with the default `layout="constrained"` and
  with `layout="flexible"` plus `stickyHeader`.
- `DefaultPage.Header` has `data-collapsed="true"` in the shorter form, so pages
  can adapt their own header content.
- `DefaultPage.Root` sets the CSS variable `--default-page-header-height` to the
  current header height, for sticky offsets and `scroll-margin-top` inside the
  page.
- The back link label is now wrapped in its own element on every page. Nothing
  changes on screen, but snapshot tests of pages with a back link change, and
  `getByText` on the label returns that element instead of the link. Use
  `getByRole("link", { name })` to find the back link.
- Docs: the back link label is its accessible name. Pass it as children, not as
  `aria-label`.
