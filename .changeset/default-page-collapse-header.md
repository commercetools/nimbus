---
"@commercetools/nimbus": minor
---

`DefaultPage` (Beta): added `collapseHeaderOnScroll` on `DefaultPage.Root`. When
the header is pinned, it shortens after the content scrolls away from the top
and returns to its full form at the top.

The back link label is wrapped in its own element. Snapshot tests and
`getByText` that targeted the link text as a single node need to query that
wrapper, or use `getByRole("link", { name })`.
