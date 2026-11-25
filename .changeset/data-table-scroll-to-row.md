---
"@commercetools/nimbus": minor
---

`DataTable`: new `apiRef` prop with `scrollToRow(key, options)` and
`getScrollContainer()`. Use it to scroll a row into view from your own code. The
`ref` prop still points to the root element.

- `align` is `"start"`, `"center"`, `"end"` or `"nearest"` (default). The header
  never covers the row, and the first and last rows stop at the edges.
- `behavior` is `"auto"` (instant, default) or `"smooth"`. `"smooth"` scrolls
  instantly when the user prefers reduced motion.
- The Promise resolves `true` when the row is at its final position. It resolves
  `false` for a key that is not a shown row: an unknown key, a row hidden by
  `search`, or a nested child row. It also resolves `false` when the row is not
  in place when the scrolling ends: the user scrolled, the table cannot scroll,
  or the row moved or was removed during a smooth scroll.
- The Promise rejects with an `AbortError` when a newer call replaces it or the
  table unmounts. Ignore this error in your `catch`.
- React Aria's focused row is always set. Keyboard focus moves to the row only
  with `focus: true`. A disabled row is scrolled to, but focus does not change.
  When focus is already inside the table, the focused row stays as it is unless
  you pass `focus: true`.
- New exported types: `DataTableApi` and `DataTableScrollToRowOptions`.
