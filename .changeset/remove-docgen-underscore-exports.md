---
"@commercetools/nimbus": patch
---

Removed the internal `_`-prefixed symbols (e.g. `_CardRoot`, `_MenuTrigger`)
that our documentation tooling no longer needs. They were never part of the
supported API. If you imported one directly, use the namespace API instead —
`Card.Header` rather than `_CardHeader`.

`Grid.Item` and `SimpleGrid.Item` are now Nimbus components instead of Chakra's
`GridItem` re-exported directly. Props, ref forwarding and rendered DOM are
unchanged; only the component identity differs.
