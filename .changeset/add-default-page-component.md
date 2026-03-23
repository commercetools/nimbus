---
"@commercetools/nimbus": minor
---

Add `DefaultPage` compound component, replacing the experimental `DetailPage`
and `MainPage` components with a single unified page layout.

`DefaultPage` covers all eight Merchant Center Application Kit page patterns
(info, form, tabular, and custom variants for both main and detail views)
through composition. Include `BackLink` for detail views, omit it for main pages
— CSS `:has()` adjusts the header grid automatically.

Introduces a `layout` prop with two modes: `"constrained"` (default — content
scrolls, header/footer pinned by grid) and `"flexible"` (whole page scrolls,
with optional `stickyHeader`/`stickyFooter`). A TypeScript discriminated union
prevents invalid prop combinations at compile time.

**Removed:** experimental `DetailPage` and `MainPage` components. Per Nimbus
versioning policy, experimental components can be removed without a major
version bump.
