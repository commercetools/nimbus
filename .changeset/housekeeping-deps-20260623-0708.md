---
"@commercetools/nimbus": patch
---

Update React Aria dependencies to their latest minor versions (`react-aria`
3.50.0, `react-aria-components` 1.19.0, `react-stately` 3.48.0).

- `Menu`'s `onAction` callback now receives the selected item's value as a
  second argument (`onAction(key, value)`), following React Aria's updated
  signature. Existing handlers that only read the key continue to work
  unchanged.
- Fixed keyboard navigation for removable tags in `ComboBox` (multi-select) and
  `TagGroup`: the tag's remove button is no longer a separate tab stop, which
  restores the single-Tab-stop entry into the tag list and arrow-key navigation
  between tags. Tags are still removed with Delete/Backspace once focused.
