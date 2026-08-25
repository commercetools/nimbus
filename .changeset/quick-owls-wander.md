---
"@commercetools/nimbus": minor
---

Adds a `trailingElement` slot to `ComboBox`, `Select` and `SearchInput`, for
placing content — icons, buttons, filters — at the trailing edge of the field.

### `ComboBox`

- New `trailingElement` prop on `ComboBox.Root`, rendered after the input content
  and before the clear and toggle buttons.

### `Select`

- New `trailingElement` prop on `Select.Root`, rendered after the selected value
  and before the clear button and chevron. Interactive content is supported here:
  pressing a trailing button runs its own handler instead of opening the listbox.
- When a trailing element competes with a long value for space, the value
  truncates with an ellipsis rather than running underneath it.
- The trigger's visual chrome now sits on a wrapping element rather than the
  button itself, so the focus ring is drawn around the whole field. Rendering and
  click behaviour are unchanged: the field measures identically to before in both
  sizes and every variant, and clicking anywhere on it still opens the listbox. If
  you target the internal `nimbus-select__trigger` class in your own CSS, note it
  is now a `div` rather than a `button` — an element-qualified selector such as
  `button.nimbus-select__trigger` no longer matches.

### `SearchInput`

- New `trailingElement` prop, rendered after the input and before the clear
  button.
- New `leadingElement` prop. It defaults to the search icon, so existing usage is
  unaffected; pass an element to replace the icon, or `null` to remove it.
  Interactive leading content now receives clicks.
