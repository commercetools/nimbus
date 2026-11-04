## Why

In an empty `SearchInput`, the hidden clear button still took up space, so a
`trailingElement` did not sit at the field's trailing edge (#2057). The
`nimbus-search-input` spec required that behavior: the button "SHALL keep
button in DOM (not conditionally rendered)" with `opacity: 0`. Fixing the bug
therefore changes the spec, and it also needs a rule the spec never had: the
field must not grow or shrink when the clear button appears or goes away.

This change is retroactive. It records the decisions made while fixing #2057 in
PR #2064, which is already implemented.

## What Changes

- The clear button is rendered only while the field has a value. An empty field
  has no hidden clear button in the DOM or the accessibility tree.
- A `trailingElement` sits at the field's trailing edge while the field is
  empty. With a value, the clear button follows it.
- The field's outer width does not change when the clear button appears or goes
  away. This holds for the browser's default width and for a width the consumer
  sets. No fixed default width is introduced.
- While the field is empty, the input uses the clear button's space, so a
  placeholder is not cut before the field's edge.
- In a field narrower than the input's default width, the text, the
  `trailingElement` and the clear button stay inside the field.
- A new `inputWrapper` slot holds the clear button's space while the field is
  empty, and the root gets a `data-empty` attribute.
- The opacity transition of the clear button is removed.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `nimbus-search-input`: the `Clear Button` requirement changes how the button
  is shown and adds the width and narrow-field rules; the `Multi-Slot Recipe`
  requirement adds the `inputWrapper` slot and the `data-empty` attribute.

## Impact

- `packages/nimbus/src/components/search-input/`: component, recipe, slots,
  types, stories, consumer tests and developer docs.
- `SearchInputInputWrapperSlotProps` is a new exported type, because
  `index.ts` re-exports `search-input.types.ts`. Nothing exported accepts it.
- ScopedSearchInput and SearchInputField render SearchInput, so they get the
  same behavior without changes to their own code. Their outline widths are the
  same as before.
- Chromatic: new snapshots `EmptyWithTrailingElement` and `NarrowField`.
- Changeset: patch for `@commercetools/nimbus`.
