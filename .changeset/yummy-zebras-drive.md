---
"@commercetools/nimbus": patch
---

Updates vite type resolution settings to colocate types with component code in
`/dist`. Ensures all utility types are exported in `/dist`. Removes all file
extensions from exported file paths in indexes for proper type resolution.
