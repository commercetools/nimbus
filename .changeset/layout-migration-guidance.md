---
"@commercetools/nimbus-mcp": minor
---

`migrate_from_uikit`: layout primitive responses (`Constraints.Horizontal`,
`Spacings.Stack`, `Spacings.Inline`, `Spacings.Inset`, `Spacings.InsetSquish`)
now include a `layoutGuidance` field that instructs the consuming LLM to migrate
nested layout structures as a single unit rather than component-by-component.
