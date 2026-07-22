---
"@commercetools/nimbus-mcp": minor
---

`migrate_from_uikit`: responses now include two new optional fields when
applicable:

- `propMigrations`: flags slot-prop-to-children collapse patterns (e.g., Stamp
  `label`/`icon` props become Badge `children`).
- `codeReduction`: flags patterns where migration deletes significant code
  (e.g., DataTable's built-in selection replaces custom selection column files).
