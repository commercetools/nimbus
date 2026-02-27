---
"@commercetools/nimbus": patch
---

Replace `@chakra-ui/react` barrel imports with modular subpath imports
(`/styled-system`, `/box`, `/steps`, `/toast`, `/hooks`, `/preset-base`) across
all 181 source files. Add local `mergeRefs` utility to eliminate the last barrel
import dependency. Update docs, templates, and skill files to prevent
reintroduction.
