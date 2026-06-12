---
"@commercetools/nimbus": minor
---

`Tree`: new compound component for hierarchical data such as file trees and
nested navigation — compose `Tree.Root`, `Tree.Item`, `Tree.ItemContent`, and
`Tree.Indicator`.

- Keyboard navigation, expand/collapse, type-ahead, and single or multiple
  selection (multiple-selection mode renders a checkbox per row).
- Static children or a dynamic `items` array; a `size` prop (`"sm"` | `"md"`,
  default `"md"`) scales the rows.
- Opt-in drag-and-drop via `dragAndDropHooks` for reordering and re-parenting.
- Accessible `treegrid` with WCAG 2.1 AA keyboard and screen-reader support.
