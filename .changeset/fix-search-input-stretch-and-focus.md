---
"@commercetools/nimbus": patch
---

**SearchInput** / **ScopedSearchInput** / **TextInput**: fix layout and
click-to-focus behavior so these inputs behave consistently.

- SearchInput now stretches to fill its container (e.g. in a `Stack` or any
  full-width form layout) instead of rendering at a narrow intrinsic width. This
  also fixes the search field inside `ScopedSearchInput`.
- Clicking anywhere on the visible SearchInput field — the search icon, the
  inner padding, or empty space — now focuses the input, not only a direct click
  on the text area.
- TextInput's click-to-focus is now more reliable: clicking the field's padding
  or its leading/trailing elements focuses the input without a brief focus
  flicker, and clicking an interactive trailing element (such as a button) no
  longer pulls focus onto the input.
