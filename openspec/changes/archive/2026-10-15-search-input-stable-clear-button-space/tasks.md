## 1. Clear button only while the field has a value

- [x] 1.1 Render the clear button only when React Aria's `isEmpty` render prop is false, and remove the `opacity` and `pointerEvents` toggles
- [x] 1.2 Set `data-empty="true"` on the root slot while the field is empty
- [x] 1.3 Replace the opacity checks in stories and `search-input.docs.spec.tsx` with checks that the button is absent when empty and present with a value
- [x] 1.4 Add a story step that checks focus stays on the input after clearing

## 2. Stable field width

- [x] 2.1 Add the `inputWrapper` slot to the recipe, `search-input.slots.tsx` and `search-input.types.ts`, and wrap the input in it
- [x] 2.2 Set `--search-input-clear-button-space` on the root per size while `data-empty="true"` (clear button plus root gap)
- [x] 2.3 Use the variable as the wrapper's `paddingInlineEnd` and add it to the input's `width: calc(100% + …)`
- [x] 2.4 Regenerate theme typings so the new slot name type-checks
- [x] 2.5 Update tests that found the root through `parentElement` or `closest("div")` to use `closest(".nimbus-search-input__root")`

## 3. Narrow fields

- [x] 3.1 Give the wrapper `flexGrow: 1` and `minWidth: 0` so it can shrink below the input's default width

## 4. Stories and visual regression

- [x] 4.1 Add `EmptyWithTrailingElement` (snapshot): empty fields with a trailing button in both sizes
- [x] 4.2 Add `TrailingElementAlignment`: trailing element at the edge when empty, clear button after it with a value
- [x] 4.3 Add `StableWidth`: outline width unchanged while typing and clearing, and no free space after an empty input, in both sizes with and without a trailing element
- [x] 4.4 Add `NarrowField` (snapshot): 192px fields stay inside their outline, and an empty field's input reaches the edge
- [x] 4.5 Confirm each new check fails without its fix

## 5. Documentation and release

- [x] 5.1 Update the behavior notes in `search-input.dev.mdx`
- [x] 5.2 Add a patch changeset for `@commercetools/nimbus`
- [x] 5.3 Compare outline widths with the `main` Storybook in the snapshotted SearchInput, ScopedSearchInput and SearchInputField stories
