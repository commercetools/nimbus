---
"@commercetools/nimbus": patch
---

- `LoadingSpinner`: spinners now render at their requested `size` in Safari
  instead of all appearing in the same very large size. Like an icon, a spinner
  inside a `Button` now takes the size the button gives to icons, so it needs no
  `size`.
- `LoadingSpinner`: the ring is now drawn on whole pixels at 24px, so it is
  sharper. Its stroke is slightly thinner (2px, was 2.5px at 24px).
- `LoadingSpinner`: the `ref` is now typed as `SVGSVGElement` (was
  `HTMLDivElement`), because the spinner now renders as an `svg` element.
- `FormActionBar`, `ConfirmationDialog` and `FormDialog`: the loading spinner in
  the save, delete or confirm button now has the same size as the icons of that
  button (for example 24px in the default button, was 14px).
- `DataTable`: a table with `isResizable` and `allowsPinning={false}` no longer
  shows a horizontal scrollbar when no column is wider than the table. The
  resize handle of the last column is now as wide as the handles of the other
  columns.
