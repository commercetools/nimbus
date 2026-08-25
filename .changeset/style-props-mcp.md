---
"@commercetools/nimbus": minor
---

Components now declare which style props they support via a
`@supportsStyleProps` JSDoc tag. This metadata is surfaced by the MCP tools
(`get_component`, `get_docs_page`, `migrate_from_uikit`) so AI-assisted
migrations can apply layout and spacing props directly to components instead of
wrapping them in a `Box`.
