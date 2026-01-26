# Change: Add Mouse Hover Visual Feedback for ComboBox Options

## Why

ComboBox Option items in single selection mode currently have two UX issues:

1. **No hover background**: Multi-select options show hover feedback (via
   `_hover` CSS), but single-select options show none
2. **Incorrect cursor**: Single-select uses `cursor: menuitem` (invalid CSS,
   falls back to default arrow) while multi-select correctly uses
   `cursor: pointer`

The W3C WAI ARIA Authoring Practices Guide (APG) explicitly recommends
`cursor: pointer` for listbox options: "To help people with visual impairments
identify the listbox as an interactive element, the cursor is changed to a
pointer when hovering over the list."

The hover background issue stems from coupling between React Aria's virtual
focus system and CSS styling. When `shouldFocusOnHover` was correctly removed
(to prevent mouse hijacking keyboard navigation), visual hover feedback was lost
because styling only used `data-focused="true"`.

## What Changes

- **Add CSS `:hover` styling** to base option styles in `combobox.recipe.ts`
- **Fix cursor to `pointer`** in base option styles per WAI-APG recommendation
- Keyboard navigation continues to use `data-focused="true"` (unchanged)
- Mouse hover uses CSS `:hover` pseudo-class (new)
- Both use the same background color (`primary.2`) for consistency

## Impact

- **Affected specs**: `nimbus-combobox`
- **Affected code**:
  `packages/nimbus/src/components/combobox/combobox.recipe.ts`
- **Breaking changes**: None - this is additive visual enhancement
- **Accessibility**: Improves perceivability per WAI-APG listbox pattern
  recommendations
