---
"@commercetools/nimbus-theme-generator": patch
---

Fix semantic color remappings (e.g. `semantic: { primary: "brand" }`) not taking
effect when using `createNimbusTheme()`. Components now correctly render with
the remapped palette colors.
