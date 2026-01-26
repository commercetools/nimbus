# Change: ComboBox Option Interaction Requirements

## Why

This change formally specifies the interaction requirements for ComboBox options
to ensure consistent, accessible behavior across selection modes.

## What Changes

Specifies three interaction requirements for ComboBox options:

1. **Hover visual feedback**: Options SHALL display hover background styling
   (`primary.2`) when the mouse hovers over them, independent of keyboard focus
   state

2. **Pointer cursor**: Options SHALL display `cursor: pointer` to indicate
   interactivity, per WAI-APG listbox pattern recommendations

3. **Close on scroll**: The dropdown SHALL close when the user scrolls the page,
   preserving selection state

These requirements apply consistently to both single-select and multi-select
modes.

## Impact

- **Affected specs**: `nimbus-combobox`
- **Affected code**:
  - `packages/nimbus/src/components/combobox/combobox.recipe.ts`
  - `packages/nimbus/src/components/combobox/components/combobox.root.tsx`
- **Breaking changes**: None
- **Accessibility**: Aligns with WAI-APG listbox pattern recommendations
