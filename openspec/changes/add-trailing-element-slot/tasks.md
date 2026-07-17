## 1. Combobox — trailingElement

- [ ] 1.1 Add `trailingElement` slot to `combobox.recipe.ts` with base styles and size-variant icon sizing matching `leadingElement`
- [ ] 1.2 Add `ComboBoxTrailingElementSlot` to `combobox.slots.tsx`
- [ ] 1.3 Add `trailingElement?: ReactNode` prop to `ComboBoxRootProps` in `combobox.types.ts` with JSDoc
- [ ] 1.4 Pass `trailingElement` through `ComboBoxRootContextValue` and render it after the toggle button in `combobox.trigger.tsx`
- [ ] 1.5 Update trigger grid template to include `trailingElement` area: `"leadingElement content clear toggle trailingElement"`
- [ ] 1.6 Add Storybook story for Combobox with `trailingElement` in `combobox.stories.tsx`

## 2. Select — trailingElement

- [ ] 2.1 Add `trailingElement` slot to `select.recipe.tsx` with base styles and size-variant icon sizing matching `leadingElement`
- [ ] 2.2 Add `SelectTrailingElementSlot` to `select.slots.tsx`
- [ ] 2.3 Add `trailingElement?: ReactNode` prop to `SelectProps` in `select.types.tsx` with JSDoc
- [ ] 2.4 Render the trailing element after the clear/dropdown controls in `select.root.tsx`
- [ ] 2.5 Add Storybook story for Select with `trailingElement` in `select.stories.tsx`

## 3. SearchInput — trailingElement

- [ ] 3.1 Add `trailingElement` slot to `search-input.recipe.ts` with base styles and size-variant icon sizing
- [ ] 3.2 Add `SearchInputTrailingElementSlot` to `search-input.slots.tsx`
- [ ] 3.3 Add `trailingElement?: ReactNode` prop to `SearchInputProps` in `search-input.types.ts` with JSDoc
- [ ] 3.4 Render the trailing element after the clear button in `search-input.tsx`
- [ ] 3.5 Add Storybook story for SearchInput with `trailingElement` in `search-input.stories.tsx`

## 4. Verification

- [ ] 4.1 Run `pnpm --filter @commercetools/nimbus typecheck:dev` to verify type correctness
- [ ] 4.2 Run `pnpm test:dev` on all three component story files to verify tests pass
