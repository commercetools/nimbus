# Component Variants Fix Summary

## Task Completed

Fixed the last 5 components that had variants but were still using the old pattern.

## Components Fixed

### 1. money-input
- **Variants**: `size` (sm, md)
- **Changes**:
  - Extracted `moneyInputVariants` const with `as const`
  - Exported `MoneyInputSize` type using `keyof typeof`
  - Updated types file to import and use `ConditionalValue<MoneyInputSize | undefined>`

### 2. split-button
- **Variants**: `variant` (solid, ghost, outline, subtle, link)
- **Changes**:
  - Extracted `splitButtonVariants` const with `as const`
  - Exported `SplitButtonVariant` type using `keyof typeof`
  - Updated types file to import and use `ConditionalValue<SplitButtonVariant | undefined>`

### 3. toggle-button-group
- **Variants**: `size` (xs, md), `colorPalette` (primary, critical, neutral)
- **Changes**:
  - Extracted `toggleButtonGroupVariants` const with `as const`
  - Exported `ToggleButtonGroupSize` and `ToggleButtonGroupColorPalette` types
  - Updated types file to import and use both types with `ConditionalValue`
  - Fixed slot props to remove duplicate `colorPalette` property
  - Updated main props to omit both `size` and `colorPalette` from slot props

### 4. rich-text-input
- **Status**: NO variants (empty `variants: {}`)
- **Action**: Left as-is (no changes needed)

### 5. tag-group
- **Status**: Already follows the new pattern
- **Action**: Left as-is (already correct)

## Components with No Variants (Excluded)

The following 9 components were identified as having NO variants or NO recipe files, so they were correctly left as-is:

1. calendar
2. collapsible-motion
3. field-errors
4. group
5. menu
6. popover
7. range-calendar
8. tooltip
9. (rich-text-input - has empty variants)

## Build Verification

Build completed successfully with no errors:

```
pnpm --filter @commercetools/nimbus build
✓ Generated conditions typings
✓ Generated recipe typings
✓ Generated utility typings
✓ Generated token typings
✓ Generated system types
✓ 2077 modules transformed
✓ built in 10.71s
```

## Type Declaration Verification

All three fixed components have properly generated type declarations:

1. **money-input.recipe.d.ts**: Exports `MoneyInputSize = keyof typeof moneyInputVariants.size`
2. **split-button.recipe.d.ts**: Exports `SplitButtonVariant = keyof typeof splitButtonVariants.variant`
3. **toggle-button-group.recipe.d.ts**: Exports `ToggleButtonGroupSize` and `ToggleButtonGroupColorPalette`

All types files correctly import these types and use them with `ConditionalValue<Type | undefined>`.

## Files Modified

### money-input
- `/packages/nimbus/src/components/money-input/money-input.recipe.tsx`
- `/packages/nimbus/src/components/money-input/money-input.types.ts`

### split-button
- `/packages/nimbus/src/components/split-button/split-button.recipe.tsx`
- `/packages/nimbus/src/components/split-button/split-button.types.ts`

### toggle-button-group
- `/packages/nimbus/src/components/toggle-button-group/toggle-button-group.recipe.tsx`
- `/packages/nimbus/src/components/toggle-button-group/toggle-button-group.types.tsx`

## Pattern Applied

For each component with variants:

1. **Extract variants** to const with `as const`:
   ```typescript
   const componentVariants = {
     variantName: {
       option1: { /* styles */ },
       option2: { /* styles */ },
     },
   } as const;
   ```

2. **Export types** using `keyof typeof`:
   ```typescript
   export type ComponentVariantName = keyof typeof componentVariants.variantName;
   ```

3. **Use in recipe definition**:
   ```typescript
   export const componentRecipe = defineSlotRecipe({
     // ...
     variants: {
       variantName: componentVariants.variantName,
     },
   });
   ```

4. **Import and use in types file**:
   ```typescript
   import type { ComponentVariantName } from './component.recipe';
   
   type ComponentRecipeProps = {
     variantName?: ConditionalValue<ComponentVariantName | undefined>;
   };
   ```

## Result

All components now follow the consistent pattern of extracting variants, exporting types, and using `ConditionalValue` for proper type inference. The build passes successfully with no errors.
