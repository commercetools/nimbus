---
"@commercetools/nimbus": patch
---

**SearchInput** / **ScopedSearchInput** / **TextInput**: fix layout and
click-to-focus behavior so these inputs behave consistently.

- SearchInput now sizes like the other inputs: it stretches to fill a stretching
  container (such as a `Stack` or `FormField`) instead of staying at a narrow
  fixed width, while still sizing to its content when used standalone. This also
  fixes the search field inside `ScopedSearchInput`.
- Clicking anywhere on the visible SearchInput field — the search icon, the
  inner padding, or empty space — now focuses the input, not only a direct click
  on the text area.
- TextInput's click-to-focus is now more reliable: clicking the field's padding
  or its leading/trailing elements focuses the input without a brief focus
  flicker, and clicking an interactive trailing element (such as a button) no
  longer pulls focus onto the input.
