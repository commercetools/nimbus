---
"@commercetools/nimbus-mcp": minor
---

`get_tokens`: new `uikitToken` parameter accepts UI Kit token names directly
(e.g. `constraint7`, `customProperties.constraint7`, `designTokens.spacingXl`),
resolves them to their CSS values, finds matching Nimbus tokens via reverse
lookup, and includes a `recommendedCategory` hint so the caller knows which
Nimbus category to use (e.g. `size` for constraints, `spacing` for spacing
tokens).
