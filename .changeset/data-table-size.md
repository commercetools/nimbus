---
"@commercetools/nimbus": minor
---

`DataTable`: new `size` prop (`sm`, `md`, `lg`) for denser tables. The sizes use
the same cell padding and text size as `Table`.

- Tables without `size` look the same as before.
- `sm`, `md` and `lg` also set the cell text size. If your cell renderers set
  their own size (for example `<Text textStyle="sm">`), you can remove it.
- The drag, selection, expand and pin controls stay 24×24px at every size.
- **Deprecated:** `density`. Use `size="lg"` or `size="md"` instead. When both
  are passed, `size` wins and `density` is ignored. In development, this logs a
  warning.
- **Deprecated:** `size="xl"`. It is the default only to keep the previous
  appearance; passing it explicitly logs a warning in development. Use `lg`.
