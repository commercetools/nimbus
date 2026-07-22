---
"@commercetools/nimbus-mcp": patch
---

Add structured migration guidance fields (`propShapeTransforms`,
`callbackAdapters`, `typeNotes`) to `migrate_from_uikit`. Populated for
DataTable (column generic typing, sort callback, Selection type) and backfilled
across SelectInput, NumberInput, MoneyInput, DateInput, DateTimeInput,
DateRangeInput, TimeInput, CheckboxInput, ToggleInput, LocalizedTextInput,
LocalizedMultilineTextInput, LocalizedMoneyInput, LocalizedRichTextInput, Tag,
CollapsiblePanel, and DropdownMenu — documenting callback signature changes and
type-level migration requirements for each.
