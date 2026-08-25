---
"@commercetools/nimbus": minor
---

`ComboBox`, `Select` and `SearchInput` gain a `trailingElement` prop for placing
an icon, button or filter control at the trailing edge of the field, beside the
existing clear and toggle controls.

### `Select`

- The trailing element sits beside the trigger rather than inside it, so
  interactive content keeps its own behaviour: pressing a trailing button runs
  your handler without opening the listbox.
- **Fixed:** a field with `isClearable={false}` no longer reserves space for the
  clear button it never renders, so it is around 24px narrower with no gap
  before the chevron. `MoneyInput`, `ScopedSearchInput` and `Pagination` each
  embed such a field and change appearance accordingly.

### `SearchInput`

- New `leadingElement` prop. It defaults to the search icon, so existing usage
  is unaffected; pass an element to replace the icon, or `null` to remove it.
  Interactive leading content now receives clicks.
