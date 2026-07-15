---
"@commercetools/nimbus-mcp": minor
---

**migrate_from_uikit**: structured `propMappings` with build-time type
validation.

Migration entries now include an optional `propMappings` array with explicit
prop-level translations — prop renames, value mappings, structural changes, and
removals — validated at build time against the live Nimbus and UIKit type data.
The tool result includes `propMappings` when available, giving consumers
structured data alongside the existing `notes` and `breakingChanges` prose.

- 59 of 80 entries populated (remaining 21 have no prop-level changes).
- Fixes incorrect data: Badge now uses `colorPalette` (not `tone`), `Card.Body`
  (not `Card.Content`), and several other UIKit prop name corrections caught by
  the new validation.
