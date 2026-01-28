---
"@commercetools/nimbus": patch
---

Fix TypeScript type inference for component variants in consumer applications

Component variant props (placement, size, variant) now use concrete type definitions exported from recipe files instead of Chakra UI type lookups. This fixes incorrect type suggestions and TypeScript errors in consumer applications (e.g., Merchant Center) while maintaining responsive prop support and documentation generation.

**Fixed components:** 37 components with recipe variants now export concrete types
**Pattern:** Recipe files export types using `keyof typeof`, types files import and wrap in `ConditionalValue`
**Impact:** No breaking changes - component API and runtime behavior unchanged, types only

Affected components: accordion, alert, avatar, badge, button, card, checkbox, combobox, data-table, date-input, date-picker, date-range-picker, dialog, draggable-list, drawer, form-field, icon, link, loading-spinner, localized-field, money-input, multiline-text-input, number-input, progress-bar, radio-input, scoped-search-input, search-input, select, separator, split-button, switch, tabs, text-input, time-input, toggle-button, toggle-button-group, toolbar
