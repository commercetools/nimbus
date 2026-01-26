# Change: Add Mouse Hover Visual Feedback for ComboBox Options

## Why

ComboBox Option items in single selection mode currently have no visual hover
feedback when users move their mouse over them. This creates an inconsistent and
confusing UX where:

1. Multi-select options show hover feedback (via `_hover` CSS)
2. Single-select options show no hover feedback
3. Users get no visual confirmation that options are interactive

The root cause is a coupling between React Aria's virtual focus system
(`shouldFocusOnHover`) and CSS visual feedback. When `shouldFocusOnHover` was
correctly removed (to prevent mouse movement from hijacking keyboard
navigation), the visual hover feedback was inadvertently lost because styling
only used `data-focused="true"` for hover-like effects.

## What Changes

- **Add CSS `_hover` styling** to base option styles in `combobox.recipe.ts`
- This provides **visual feedback independent of virtual focus**
- Keyboard navigation continues to use `data-focused="true"` (unchanged)
- Mouse hover uses CSS `_hover` pseudo-class (new)
- Both use the same background color (`primary.2`) for consistency

## Impact

- **Affected specs**: `nimbus-combobox`
- **Affected code**:
  `packages/nimbus/src/components/combobox/combobox.recipe.ts`
- **Breaking changes**: None - this is additive visual enhancement
- **Accessibility**: Improves UX without affecting keyboard navigation or screen
  readers
