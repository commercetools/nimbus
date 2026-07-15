---
"@commercetools/nimbus": minor
---

**DataTable**: Add column-level `align` prop, default cell color, and sticky
cell backgrounds.

- Added `align` property to `DataTableColumnItem` with values `'start'`
  (default), `'center'`, `'end'`, and `'stretch'`. Use `align: 'end'` for
  right-aligned numeric columns and `align: 'stretch'` to let custom cell
  renderers fill the full cell width.
- Changed default body-cell text color from `neutral.11` to `neutral.12` for
  improved contrast. Per-cell overrides via inline render JSX still take
  precedence.
- Applied opaque backgrounds to sticky header columns and sticky body cells
  (selection, drag, expand, pin) so scrolled content no longer shows through.
