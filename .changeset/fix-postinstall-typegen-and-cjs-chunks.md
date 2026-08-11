---
"@commercetools/nimbus": minor
---

Fixed the `postinstall` type-generation hook, which previously crashed
(`process is not defined`) instead of generating theme typings. It now targets a
new, lightweight `@commercetools/nimbus/theme` entry point instead of the full
package bundle. If type generation didn't run automatically, the manual command
from the installation guide has changed to:

```bash
npx @chakra-ui/cli typegen node_modules/@commercetools/nimbus/dist/theme.es.js
```

Also fixed `require("@commercetools/nimbus")` (the CommonJS build), which threw
`MODULE_NOT_FOUND` due to a chunk-filename mismatch introduced by the Vite
8/Rolldown migration. CommonJS consumers can now `require` the package
correctly.
