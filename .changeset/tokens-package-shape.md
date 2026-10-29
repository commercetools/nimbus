---
"@commercetools/nimbus-tokens": patch
---

TypeScript types for `@commercetools/nimbus-tokens` now resolve for ESM imports
under `node16`, `nodenext` and `bundler` module resolution. Previously these
setups reported that no declaration file was found.

Tools that read the `main` field instead of `exports` (for example Jest 27 and
older) can now load the package. Before, the file `main` pointed to was missing
from the published package.
