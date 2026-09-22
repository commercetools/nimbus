---
"@commercetools/nimbus": minor
---

Removed 130 `_`-prefixed symbols (e.g. `_CardRoot`, `_MenuTrigger`,
`_DrawerContent`) from the package barrel, across 27 compound components. The
barrel now exports 740 symbols, down from 870.

These were never public API. They existed only so our documentation tooling
could see compound sub-components and generate prop tables; that tooling now
reads prop data from each sub-component's implementation file instead. The
namespace API has always been the supported way to reach these parts — use
`Card.Header`, not `_CardHeader`.

Released as a minor rather than a major under the internal-export exception in
our changeset conventions: the leading underscore marked these as internal, the
namespace API already existed as the documented alternative, and a scan of the
commercetools org-wide Nimbus consumer registry found zero importers. That scan
covers the commercetools org only — Nimbus publishes publicly, so it does not
rule out consumers elsewhere. If you imported one of these names directly,
switch to the namespace equivalent.

Also fixes the `Item` prop table, which showed three inherited props and no
description because another component's generated data overwrote it.
