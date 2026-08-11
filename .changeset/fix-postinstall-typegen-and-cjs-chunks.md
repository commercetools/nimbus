---
"@commercetools/nimbus": minor
"@commercetools/nimbus-tokens": minor
---

`@commercetools/nimbus`: Fixed the `postinstall` type-generation hook, which
previously crashed (`process is not defined`) instead of generating theme
typings. It now targets a new, lightweight `@commercetools/nimbus/theme` entry
point instead of the full package bundle. If type generation didn't run
automatically, the manual command from the installation guide has changed to:

```bash
npx @chakra-ui/cli typegen node_modules/@commercetools/nimbus/dist/theme.es.js
```

Also fixed `require("@commercetools/nimbus")` and
`require("@commercetools/nimbus/<component>")` (the CommonJS build), which threw
`MODULE_NOT_FOUND`. CommonJS consumers can now `require` the package and its
component subpaths correctly.

`@commercetools/nimbus-tokens`: Fixed `require("@commercetools/nimbus-tokens")`
(the CommonJS build), which threw `MODULE_NOT_FOUND`. CommonJS consumers can now
`require` the package correctly.
