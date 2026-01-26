# Tasks: Add Mouse Hover Visual Feedback for ComboBox Options

## 1. Implementation

- [x] 1.1 Add `:hover` style to base `option` slot in `combobox.recipe.ts`
  - Location: `packages/nimbus/src/components/combobox/combobox.recipe.ts`
  - Add `&:hover:not([data-disabled='true']): { bg: "primary.2" }` to base
    option
  - Ensure disabled options do not show hover effect

- [ ] 1.2 Fix cursor to `pointer` in base option styles
  - Change `cursor: "menuitem"` to `cursor: "pointer"` per WAI-APG
  - This makes single-select consistent with multi-select

- [ ] 1.3 Verify multi-select hover behavior is unchanged
  - Multi-select already has `_hover` in its variant
  - Confirm base hover doesn't conflict with variant override

## 2. Testing

- [ ] 2.1 Add Storybook story verifying single-select hover
  - Create story demonstrating mouse hover on single-select options
  - Verify visual feedback appears on hover

- [ ] 2.2 Verify existing keyboard navigation tests pass
  - Run `pnpm test packages/nimbus/src/components/combobox/combobox.stories.tsx`
  - Ensure keyboard focus (`data-focused`) still works correctly

- [ ] 2.3 Visual verification in Storybook
  - Start Storybook: `pnpm start:storybook`
  - Navigate to ComboBox stories
  - Verify hover feedback on both single and multi-select modes

## 3. Documentation

- [ ] 3.1 No documentation changes needed
  - This is a bug fix restoring expected behavior
  - Hover feedback is standard UX, not a new feature

## Validation

After completing all tasks:

```bash
pnpm --filter @commercetools/nimbus build
pnpm test packages/nimbus/src/components/combobox/combobox.stories.tsx
```
