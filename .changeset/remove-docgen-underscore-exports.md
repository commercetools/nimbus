---
"@commercetools/nimbus": major
---

Removed 130 `_`-prefixed symbols (e.g. `_CardRoot`, `_MenuTrigger`,
`_DrawerContent`) from the public package barrel, across 27 compound components.
The barrel now exports 740 symbols, down from 870.

These were never intended as public API — they existed only so our internal
documentation tooling could see compound sub-components and generate prop
tables. That tooling now reads prop data directly from each sub-component's
implementation file instead, so the re-exports are no longer needed. If you were
relying on one of these names, switch to the namespace API instead (e.g.
`Card.Header`, not `_CardHeader`).

No consumer in the commercetools org imports a `_`-prefixed name (verified by
scanning the org-wide `@mcf/nimbus-consumer-registry`: zero hits). These symbols
were nonetheless part of the public barrel's export surface, so this is called
out as a breaking change rather than assumed safe.
