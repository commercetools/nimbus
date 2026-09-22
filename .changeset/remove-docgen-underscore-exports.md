---
"@commercetools/nimbus": patch
---

Removed the internal `_`-prefixed symbols (e.g. `_CardRoot`, `_MenuTrigger`)
that our documentation tooling no longer needs. They were never part of the
supported API. If you imported one directly, use the namespace API instead —
`Card.Header` rather than `_CardHeader`.
