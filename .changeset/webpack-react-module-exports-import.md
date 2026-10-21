---
"@commercetools/nimbus": patch
---

Fix webpack builds that use `strictExportPresence: true` (such as `mc-scripts`
for Merchant Center custom applications). Since 3.7.0 they failed with
`export 'module.exports' (imported as 'i') was not found in 'react'`.
