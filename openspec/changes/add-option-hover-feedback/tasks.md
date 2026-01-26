# Tasks: Add Mouse Hover Visual Feedback for ComboBox Options

## 1. Implementation

- [ ] 1.1 Add `_hover` style to base `option` slot in `combobox.recipe.ts`
  - Location: `packages/nimbus/src/components/combobox/combobox.recipe.ts`
  - Add `_hover: { bg: "primary.2" }` to base option styles (around line 176)
  - Ensure disabled options do not show hover effect

- [ ] 1.2 Verify multi-select hover behavior is unchanged
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
