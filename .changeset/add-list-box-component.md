---
"@commercetools/nimbus": minor
---

`ListBox`: new compound component for a standalone selection list —
`ListBox.Root`, `ListBox.Item`, `ListBox.Section` and `ListBox.LoadMore`. Reach
for it when a list of options should stay visible on the page — filter lists,
list pickers, transfer lists, command palettes; `Select` still covers dropdown
fields and `ComboBox` covers type-to-filter fields.

- Single and multiple selection. Single-select shows the selected row with a
  full-row highlight; multiple-select shows a checkbox on each option.
- Sections with headers, rich items (leading media, a `label` + `description`
  two-line option, and trailing content), and drag-and-drop reordering via React
  Aria's `dragAndDropHooks`.
- Full keyboard support and the WAI-ARIA listbox pattern (arrow keys, Home/End,
  type-ahead). Name the list with `aria-label` or `aria-labelledby`.
- `variant` — `card` (default, a standalone elevated surface) or `plain` (a bare
  list for embedding inside an overlay). Plus `size` (`sm`/`md`) and `density`
  (`comfortable`/`compact`).
- A localized empty state (overridable with `renderEmptyState`) and an in-list
  loading spinner via `ListBox.LoadMore`.

Experimental. See the
[ListBox docs](https://nimbus-documentation.vercel.app/components/inputs/list-box)
for the full prop reference.
