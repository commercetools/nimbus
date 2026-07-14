---
"@commercetools/nimbus-mcp": minor
---

**get_docs_page**: new MCP tool that returns the full content of a Nimbus
documentation page by its route path. Accepts an optional `section` parameter to
retrieve a single tab view (e.g. "dev", "guidelines", "a11y") from tabbed pages.
Use `search_docs` first to discover page paths, then `get_docs_page` to read the
full content.
