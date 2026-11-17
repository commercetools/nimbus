---
"@commercetools/nimbus": minor
---

`DataTable`: new `stickyRows` prop. Rows whose ids are in the `Set` stay visible
at the top or bottom edge of the table when they are scrolled out of view.

- Several sticky rows stack in row order, below the header at the top and at the
  bottom edge, without overlap. A row that is pinned and sticky is first in the
  top stack.
- Sticky rows need `maxHeight`, as the sticky header does. Without it no row is
  sticky, and in development a warning says so. A warning also appears when the
  sticky rows are together taller than half of the visible height.
- A sticky row has a slight background highlight. A row with a background of its
  own keeps it. Use an opaque color, so rows that scroll under the sticky row do
  not show through. A disabled sticky row keeps an opaque background and dims
  its content.
- New `isSticky` field in `DataTableRowRenderProps`, for custom row render
  functions.
- With the keyboard, the focused row is kept clear of the header and of the rows
  that are stuck.
- `apiRef.scrollToRow` keeps the row clear of the stuck rows. A sticky row that
  is stuck is already in view, so the Promise resolves `true` without scrolling.
- A drag can start from a stuck row. Pointer drops over the stuck rows follow
  React Aria's default.
- A table with sticky rows draws its row dividers as cell borders
  (`border-collapse: separate`), so a divider moves with a stuck row and the
  rows that scroll under it do not show through. Other tables are not changed.
- Pass a new `Set` to change the sticky rows. Virtualized tables are not
  covered.

The sticky header now has a higher stacking level (`z-index` 15, was 14), so
that it stays above stuck rows.
