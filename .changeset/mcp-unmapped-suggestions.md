---
"@commercetools/nimbus-mcp": minor
---

**migrate_from_uikit**: unmapped components now include catalog suggestions.

When a UI Kit component has no explicit migration rule, the tool searches the
Nimbus component catalog and returns a `suggestion` with the likely Nimbus
equivalent and a confidence level (`high` or `medium`). The `unmapped` array in
file-mode responses changes from `string[]` to `UnmappedComponent[]` objects. In
component-name mode, unrecognized names now return a suggestion result instead
of an error when a catalog match is found.
