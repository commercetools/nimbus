---
"@commercetools/nimbus": minor
---

`Tree`: new compound component for hierarchical data such as file trees and
nested navigation — compose `Tree.Root`, `Tree.Item`, `Tree.ItemContent`,
`Tree.Indicator`, and `Tree.SubTree`.

- Keyboard navigation, expand/collapse, type-ahead, and single or multiple
  selection (multiple-selection mode renders a checkbox per row).
- Static children or dynamic data via `Tree.SubTree`; a `size` prop (`"sm"` |
  `"md"`, default `"md"`) scales the rows.
- `useTree` hook manages hierarchy state and opt-in drag-and-drop (reorder +
  re-parent) — spread its result onto `Tree.Root`. Dynamic and draggable trees
  need no `react-aria-components` / `react-stately` imports.
- Accessible `treegrid` with WCAG 2.1 AA keyboard and screen-reader support.
