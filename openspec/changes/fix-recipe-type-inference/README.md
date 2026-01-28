# Fix Recipe Type Inference in Consumer Applications

## Quick Links

- **Proposal**: [`proposal.md`](./proposal.md) - Problem statement, solution
  approach, and trade-offs
- **Tasks**: [`tasks.md`](./tasks.md) - Detailed implementation breakdown with
  47 component checklist
- **Spec**: [`specs/type-system/spec.md`](./specs/type-system/spec.md) -
  Technical requirements and scenarios
- **Analysis**:
  [`/docs/adr/type-inference-bug-analysis.md`](/docs/adr/type-inference-bug-analysis.md) -
  Complete technical analysis with POC results

## TL;DR

**Problem:** Consumer apps see wrong TypeScript types for Nimbus component props
(e.g., Drawer accepts `"left"` but IDE shows error).

**Root Cause:** Types reference `SlotRecipeProps<"drawer">` which resolves
against consumer's Chakra defaults, not Nimbus's custom recipes.

**Solution:** Export types directly from recipes using `keyof typeof`, wrap in
`ConditionalValue` in types files.

**Scope:** 47 components need updates (8-13 hours estimated).

**Status:** ✅ Validated via POC (Drawer, Alert) - ready for full rollout.

## Implementation Quick Start

For each affected component:

1. **Recipe file**: Extract variants to `const myVariants = { ... } as const`
2. **Recipe file**: Export types using `keyof typeof`
3. **Types file**: Import types from recipe, wrap in `ConditionalValue`

**Example:**

```diff
// drawer.recipe.ts
+ const drawerVariants = {
+   placement: { left: {}, right: {}, top: {}, bottom: {} },
+ } as const;

  export const drawerSlotRecipe = defineSlotRecipe({
-   variants: { placement: { left: {}, right: {}, top: {}, bottom: {} } },
+   variants: drawerVariants,
  });

+ export type DrawerPlacement = keyof typeof drawerVariants.placement;

// drawer.types.ts
- import type { SlotRecipeProps } from "@chakra-ui/react";
+ import type { ConditionalValue } from "@chakra-ui/react";
+ import type { DrawerPlacement } from "./drawer.recipe";

  type DrawerRecipeProps = {
-   placement?: SlotRecipeProps<"drawer">["placement"];
+   placement?: ConditionalValue<DrawerPlacement>;
  };
```

## Progress Tracking

Use the
[Component Reference Table](../../docs/adr/type-inference-bug-analysis.md#complete-component-reference-table)
in the analysis document to track implementation progress across all 47
components.

**Current Status:** 0/47 completed (0%)

## Validation

After implementing:

```bash
# Build and verify
pnpm --filter @commercetools/nimbus build
pnpm --filter docs build:docs

# Check for remaining issues
grep -r "SlotRecipeProps<\|RecipeProps<" packages/nimbus/src/components/*/*.types.ts* | grep -v import

# Expected: No matches
```

## References

- [TypeScript keyof operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
- [TypeScript as const](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)
- [Chakra UI Recipe System](https://www.chakra-ui.com/docs/theming/recipes)
