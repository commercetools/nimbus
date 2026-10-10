---
"@commercetools/nimbus": minor
---

`DataTable`: new `size` prop (`sm`, `md`, `lg`) for denser tables. The sizes use
the same cell padding and text size as `Table`.

- Tables without `size` keep their cell padding, header height and text size.
  (Rows are slightly shorter in every table because of the cell alignment fix
  that ships with this release.)
- `sm`, `md` and `lg` also set the cell text size. If your cell renderers set
  their own size (for example `<Text textStyle="sm">`), you can remove it.
- The drag, selection, expand and pin controls stay 24×24px at every size.
- **Deprecated:** `density`. Use `size` instead: it sets the default text size
  and the density (cell padding). When both are passed, `size` wins and
  `density` is ignored. In development, passing `density` logs a warning.
- **Deprecated:** `size="xl"`. It is the default only to keep the previous
  appearance; passing it explicitly logs a warning in development. Use `md`,
  which becomes the default in the next major release. `lg` is the larger
  option.
- Layout settings tab of `DataTable.Manager`: the "Row density" toggle is now a
  select that picks a size instead of `density`: one option per size, with an
  icon and a label (Spacious, Comfortable, Standard, Compact). It offers `xl`,
  `lg`, `md` and `sm` to a table that has had `xl` as its size (no `size`, or
  `size="xl"`), and only `lg`, `md` and `sm` to a table that never had it.
  `onSettingsChange` now receives `"changeSize"` and the chosen `DataTableSize`
  as its second argument: pass it to `size`.
- **Breaking change:** `UPDATE_ACTIONS.TOGGLE_ROW_DENSITY` is removed and
  replaced by `UPDATE_ACTIONS.CHANGE_SIZE`. Code that references the constant
  gets a compile error, and a handler that only checks for `"toggleRowDensity"`
  no longer receives it. We know of no such usage.
