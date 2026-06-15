---
"@commercetools/nimbus": patch
---

**SearchInput** / **ScopedSearchInput**: fix two layout/interaction issues so
they behave like the other form inputs.

- SearchInput now stretches to fill its container (e.g. in a `Stack` or any
  full-width form layout) instead of rendering at a narrow intrinsic width. This
  also fixes the search field inside `ScopedSearchInput`.
- Clicking anywhere on the visible SearchInput field — the search icon, the
  inner padding, or empty space — now focuses the input, not only a direct click
  on the text area.
