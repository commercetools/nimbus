# Change: Fix ComboBox Option Hover and Scroll Behavior

## Why

ComboBox has three UX/behavior issues:

1. **No hover background**: Multi-select options show hover feedback (via
   `_hover` CSS), but single-select options show none
2. **Incorrect cursor**: Single-select uses `cursor: menuitem` (invalid CSS,
   falls back to default arrow) while multi-select correctly uses
   `cursor: pointer`
3. **No close on scroll**: When the dropdown is open and user scrolls the page,
   the dropdown stays open instead of closing (regression from CRAFT-1822
   refactor)

The W3C WAI ARIA Authoring Practices Guide (APG) explicitly recommends
`cursor: pointer` for listbox options: "To help people with visual impairments
identify the listbox as an interactive element, the cursor is changed to a
pointer when hovering over the list."

The hover background issue stems from coupling between React Aria's virtual
focus system and CSS styling. When `shouldFocusOnHover` was correctly removed
(to prevent mouse hijacking keyboard navigation), visual hover feedback was lost
because styling only used `data-focused="true"`.

The close-on-scroll issue was caused by the PopoverContext having a no-op
`onOpenChange` handler, which prevented React Aria's built-in `useCloseOnScroll`
from closing the dropdown.

## What Changes

- **Add CSS `:hover` styling** to base option styles in `combobox.recipe.ts`
- **Fix cursor to `pointer`** in base option styles per WAI-APG recommendation
- **Fix close-on-scroll** by updating PopoverContext's `onOpenChange` to
  actually close the menu when React Aria requests it
- Keyboard navigation continues to use `data-focused="true"` (unchanged)
- Mouse hover uses CSS `:hover` pseudo-class (new)
- Both use the same background color (`primary.2`) for consistency

## Impact

- **Affected specs**: `nimbus-combobox`
- **Affected code**:
  - `packages/nimbus/src/components/combobox/combobox.recipe.ts`
  - `packages/nimbus/src/components/combobox/components/combobox.root.tsx`
- **Breaking changes**: None - restores expected behavior
- **Accessibility**: Improves perceivability per WAI-APG listbox pattern
  recommendations
