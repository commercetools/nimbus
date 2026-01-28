# Fix Recipe Type Inference in Consumer Applications

## Problem Statement

Nimbus components display incorrect TypeScript types in consumer applications
(e.g., Merchant Center). Component props work correctly at runtime, but IDEs
show wrong type definitions, causing false TypeScript errors and broken
autocomplete.

### Symptoms

```tsx
// In consumer application
<Drawer.Root placement="left">
  {" "}
  // ❌ TypeScript Error
  {/* ... */}
</Drawer.Root>
```

**Error:**
`Type '"left"' is not assignable to type 'ConditionalValue<"bottom" | "top" | "start" | "end" | undefined>'.`

**Expected:** `placement` should accept `"left" | "right" | "top" | "bottom"`
(per Nimbus documentation)

**Reality:** Component works at runtime, only types are wrong in consumer IDEs.

## Root Cause

Type definitions use `SlotRecipeProps<"drawer">["placement"]` which performs a
**type lookup at consumer compile time**, not Nimbus build time:

1. Nimbus defines types as: `placement?: SlotRecipeProps<"drawer">["placement"]`
2. `SlotRecipeProps` resolves against `ConfigSlotRecipes` interface
3. In Nimbus workspace: `ConfigSlotRecipes["drawer"]` contains Nimbus's custom
   types
4. In consumer apps: `ConfigSlotRecipes["drawer"]` contains Chakra's **default**
   types
5. Consumer sees wrong values (e.g., `"start" | "end"` instead of
   `"left" | "right"`)

**Empirically verified:** Compared published `@chakra-ui/react@3.31.0` npm
package against Nimbus workspace. Chakra's Drawer uses `"start" | "end"`
placement while Nimbus uses `"left" | "right"`.

## Proposed Solution

Export variant types directly from recipe files using `keyof typeof` pattern,
eliminating dependency on consumer's Chakra type definitions.

### Approach

**Before (problematic):**

```typescript
// drawer.recipe.ts
export const drawerSlotRecipe = defineSlotRecipe({
  variants: {
    placement: { left: {}, right: {}, top: {}, bottom: {} },
  },
});

// drawer.types.ts
type DrawerRecipeProps = {
  placement?: SlotRecipeProps<"drawer">["placement"]; // ❌ Resolves at consumer compile time
};
```

**After (proposed):**

```typescript
// drawer.recipe.ts
const drawerVariants = {
  placement: { left: {}, right: {}, top: {}, bottom: {} },
  showBackdrop: { true: {}, false: {} },
} as const;

export const drawerSlotRecipe = defineSlotRecipe({
  variants: drawerVariants,
});

export type DrawerPlacement = keyof typeof drawerVariants.placement;
export type DrawerShowBackdrop = boolean;

// drawer.types.ts
import type { ConditionalValue } from "@chakra-ui/react";
import type { DrawerPlacement } from "./drawer.recipe";

type DrawerRecipeProps = {
  placement?: ConditionalValue<DrawerPlacement>; // ✅ Concrete type baked into .d.ts
  showBackdrop?: boolean;
};
```

### Benefits

- **Fixes consumer type inference** - Concrete types baked into `.d.ts` files
- **Preserves documentation** - PropsTable extraction continues to work
- **Maintains responsive props** - `ConditionalValue` wrapper preserved
- **Single source of truth** - Variant values defined once in recipe
- **No breaking changes** - Component API unchanged, types only
- **No runtime impact** - JavaScript behavior unaffected

### Validation

POC implementation completed on Drawer and Alert components (not committed):

- ✅ PropsTable extraction preserved
- ✅ Generated `.d.ts` files contain concrete types
- ✅ TypeScript compilation succeeds
- ✅ No regression in documentation quality

## Scope

### Affected Components: 47 Total

**All components using `RecipeProps` or `SlotRecipeProps` pattern:**

- 30 components with `SlotRecipeProps` (multi-element recipes)
- 17 components with `RecipeProps` (single-element recipes)

See `tasks.md` for complete list organized by priority.

### Not Affected: 21 Components

Components without recipe variants (e.g., Box, Flex, Grid, Stack, Spacer,
VisuallyHidden) do not need updates.

## Trade-offs

### Advantages

1. **Eliminates type resolution dependency** on consumer's Chakra installation
2. **Maintains DRY principle** - Variants defined once in recipe
3. **Better tooling support** - Direct `keyof typeof` works with
   react-docgen-typescript
4. **Explicit and clear** - Types are visible in generated `.d.ts` files
5. **No consumer setup required** - Works out of the box

### Disadvantages

1. **Code change volume** - 47 components need updates (estimated 8-13 hours)
2. **New convention** - Establishes pattern not currently used in recipe files
3. **Slight verbosity** - Each variant needs explicit type export

### Alternatives Considered & Rejected

1. **Module Augmentation** - Requires consumer setup, bad DX
2. **Bundle Chakra with Nimbus** - Doesn't solve type resolution, massive
   maintenance burden
3. **ExtractVariantKeys utility type** - react-docgen-typescript can't resolve
   it

See analysis document for detailed reasoning.

## Success Criteria

### Before Merging

- [ ] All 47 affected components updated
- [ ] TypeScript compilation passes: `pnpm typecheck`
- [ ] All tests pass: `pnpm test`
- [ ] Documentation builds: `pnpm build:docs`
- [ ] All PropsTable JSON files contain concrete types (not `"any"`)
- [ ] Spot check generated `.d.ts` files for concrete unions
- [ ] No `SlotRecipeProps<` or `RecipeProps<` references in types files (except
      imports)

### After Merging

- [ ] Consumer applications report correct types in IDEs
- [ ] No new TypeScript errors in consumer apps
- [ ] Documentation site renders correctly
- [ ] Responsive props still functional: `{{ base: "value1", md: "value2" }}`

## Dependencies

**Blocks:** None - this is a pure type safety improvement

**Blocked by:** None - can start immediately

**Related:**

- Documentation: See `/docs/adr/type-inference-bug-analysis.md` for complete
  technical analysis, POC results, and implementation patterns

## Estimated Effort

- **Implementation**: 8-13 hours (can be parallelized across contributors)
- **Testing & Verification**: 2 hours
- **Documentation updates**: Included in implementation
- **Total**: 10-15 hours

## Risks

**Low Risk:**

- Types-only change, no runtime code modification
- POC validated approach on 2 components successfully
- Existing tests provide safety net

**Mitigation:**

- Follow validation checklist per component
- Build and test after each component update
- Monitor PropsTable extraction throughout

## References

- **Technical Analysis**: `/docs/adr/type-inference-bug-analysis.md`
- **POC Files**: Drawer and Alert components (validation branch)
- **Chakra Recipe System**: https://www.chakra-ui.com/docs/theming/recipes
- **TypeScript `keyof typeof`**:
  https://www.typescriptlang.org/docs/handbook/2/keyof-types.html
