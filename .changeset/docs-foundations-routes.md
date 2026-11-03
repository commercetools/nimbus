---
"@commercetools/nimbus-mcp": patch
---

The design token and style prop pages now live under `foundations/`, and the
Contribute pages live under `contribute/`. `get_docs_page` returns the new paths
(for example `foundations/style-props/spacing`) and still accepts the old
`home/design-tokens`, `home/style-props` and `home/contribute` paths. The new
docs page "Customize in three steps" is available at
`foundations/customize-in-three-steps`.
