---
"@commercetools/nimbus": minor
---

feat(tree): add Tree component (FEC-985)

A new compound component for displaying hierarchical data such as file trees and
nested navigation. Compose `Tree.Root`, `Tree.Item`, `Tree.ItemContent`, and
`Tree.Indicator`:

- Keyboard navigation (arrow keys, Home/End, type-ahead), expand/collapse, and
  single or multiple selection — in multiple-selection mode each row renders a
  selection checkbox automatically.
- Works with static composition (nested `Tree.Item`s) or dynamic collections (an
  `items` array plus a recursive render function using `Collection`).
- Visual indentation reflects each item's nesting level. A `size` prop (`"sm"`
  or `"md"`, default `"md"`) scales row height, font size, chevron size and
  indentation.
- Opt-in drag-and-drop: pass `dragAndDropHooks` from `useDragAndDrop` to
  `Tree.Root` to enable reordering, re-parenting (drop onto a group), drop
  indicators, and keyboard drag-and-drop. See the docs for the integration
  pattern.

Implemented with React Aria's accessible `treegrid` pattern for WCAG 2.1 AA
keyboard and screen-reader support.
