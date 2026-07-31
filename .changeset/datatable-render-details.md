---
"@commercetools/nimbus": minor
---

Add `renderDetails` prop to DataTable for rendering full-width detail panels
below rows. Clicking a row toggles the detail panel open/closed. The
`onDetailsClick` callback fires when a detail panel is toggled. The render
callback receives the row and a `DataTableRowDetailsOptions` object with a
`close` function for dismissing the panel from within. Works alongside existing
selection, pinning, and nested row expansion features.
