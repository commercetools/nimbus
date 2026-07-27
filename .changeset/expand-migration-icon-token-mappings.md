---
"@commercetools/nimbus-mcp": minor
---

`migrate_from_uikit`: Add 142 specific icon migration mappings (e.g.
`BinFilledIcon` → `Delete`, `SearchIcon` → `Search`), direct mappings for
`SearchTextInput` → `SearchInput` and `ViewSwitcher` → `ToggleButtonGroup`,
token redirect for `customProperties`/`designTokens` imports to the
`get_tokens` tool, and corrected DataTable guidance (accessor is the sole
cell renderer; merge renderItem/render into accessor; width must be numeric
pixels, percentage, or fr units).
