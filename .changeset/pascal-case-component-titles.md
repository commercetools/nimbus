---
"@commercetools/nimbus-mcp": patch
---

Component titles in `list_components`, `search_docs` and `get_component`
responses now use the React component name, for example `IconButton` instead of
`Icon button`. Searching by the spaced form (`icon button`) still finds the
component.
