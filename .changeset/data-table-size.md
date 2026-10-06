---
"@commercetools/nimbus": minor
---

`DataTable`: new `size` prop (`sm`, `md`, `lg`) for denser tables. The sizes use
the same cell padding and text size as `Table`.

- Tables without `size` look the same as before.
- `sm`, `md` and `lg` also set the cell text size. If your cell renderers set
  their own size (for example `<Text textStyle="sm">`), you can remove it.
- The drag, selection, expand and pin controls stay 24×24px at every size.
- **Deprecated:** `density`. Use `size` instead: it sets the default text size
  and the density (cell padding). When both are passed, `size` wins and
  `density` is ignored. In development, this logs a warning.
- **Deprecated:** `size="xl"`. It is the default only to keep the previous
  appearance; passing it explicitly logs a warning in development. Use `md`,
  which becomes the default in the next major release. `lg` is the larger
  option.
- Layout settings tab of `DataTable.Manager`: the "Row density" toggle is now a
  select that picks a size instead of `density`: one option per size, with an
  icon and a label (Spacious, Comfortable, Standard, Compact). It offers `xl`,
  `lg`, `md` and `sm` to a table that started with `xl`, and only `lg`, `md` and
  `sm` to a table that started with another size. `onSettingsChange` now
  receives `"changeSize"` and the chosen size as its second argument. The
  `"toggleRowDensity"` action is no longer sent: handle `"changeSize"` and pass
  the value to `size`.
