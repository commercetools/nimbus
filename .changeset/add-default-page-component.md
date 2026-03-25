---
"@commercetools/nimbus": minor
---

Add `DefaultPage` compound component — a single page layout that covers all
eight Merchant Center Application Kit page patterns (info, form, tabular, and
custom variants for both main and detail views) through composition. Include
`BackLink` for detail views, omit it for main pages.

Introduces a `layout` prop with two modes: `"constrained"` (default — content
scrolls, header/footer pinned by grid) and `"flexible"` (whole page scrolls,
with optional `stickyHeader`/`stickyFooter`). A TypeScript discriminated union
prevents invalid prop combinations at compile time.
