# Tasks: ComboBox Option Interaction Requirements

## 1. Implementation

- [x] 1.1 Add hover styling to base option slot
  - Location: `packages/nimbus/src/components/combobox/combobox.recipe.ts`
  - Add `&:hover:not([data-disabled='true']): { bg: "primary.2" }` to base
    option
  - Ensure disabled options do not show hover effect

- [x] 1.2 Set cursor to pointer in base option styles
  - Set `cursor: "pointer"` per WAI-APG listbox pattern
  - Applies consistently across single-select and multi-select modes

- [x] 1.3 Enable close-on-scroll behavior
  - Location:
    `packages/nimbus/src/components/combobox/components/combobox.root.tsx`
  - Update PopoverContext's `onOpenChange` to close menu when requested
  - Change: `onOpenChange: (open) => { if (!open) setIsOpen(false); }`

- [x] 1.4 Verify multi-select hover behavior unchanged
  - Multi-select variant has its own `_hover` style
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
  - Hover feedback, pointer cursor, and close-on-scroll are standard UX patterns

## Validation

After completing all tasks:

```bash
pnpm --filter @commercetools/nimbus build
pnpm test packages/nimbus/src/components/combobox/combobox.stories.tsx
```
