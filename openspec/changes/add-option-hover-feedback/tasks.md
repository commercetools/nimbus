# Tasks: Fix ComboBox Option Hover and Scroll Behavior

## 1. Implementation

- [x] 1.1 Add `:hover` style to base `option` slot in `combobox.recipe.ts`
  - Location: `packages/nimbus/src/components/combobox/combobox.recipe.ts`
  - Add `&:hover:not([data-disabled='true']): { bg: "primary.2" }` to base
    option
  - Ensure disabled options do not show hover effect

- [x] 1.2 Fix cursor to `pointer` in base option styles
  - Change `cursor: "menuitem"` to `cursor: "pointer"` per WAI-APG
  - This makes single-select consistent with multi-select

- [x] 1.3 Fix close-on-scroll behavior
  - Location:
    `packages/nimbus/src/components/combobox/components/combobox.root.tsx`
  - Update PopoverContext's `onOpenChange` from no-op to actually close menu
  - Change: `onOpenChange: (open) => { if (!open) setIsOpen(false); }`
  - This enables React Aria's built-in `useCloseOnScroll` to work

- [x] 1.4 Verify multi-select hover behavior is unchanged
  - Multi-select already has `_hover` in its variant
  - Confirmed base hover doesn't conflict with variant override

## 2. Testing

- [x] 2.1 Verify existing tests pass
  - Run `pnpm test packages/nimbus/src/components/combobox/combobox.stories.tsx`
  - All 107 tests pass

- [x] 2.2 Visual verification in Storybook
  - Verify hover feedback on both single and multi-select modes
  - Verify pointer cursor on options
  - Verify dropdown closes on page scroll

## 3. Documentation

- [x] 3.1 No documentation changes needed
  - This is a bug fix restoring expected behavior
  - Hover feedback and close-on-scroll are standard UX patterns

## Validation

After completing all tasks:

```bash
pnpm --filter @commercetools/nimbus build
pnpm test packages/nimbus/src/components/combobox/combobox.stories.tsx
```
