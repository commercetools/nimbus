# Spec: Component Recipe Type System

## Context

This spec defines how Nimbus components export and consume recipe variant types
to ensure correct TypeScript inference in consumer applications.

## MODIFIED Requirements

### Requirement: Recipe files MUST export variant types

Recipe files (`.recipe.ts` or `.recipe.tsx`) MUST export TypeScript types
derived from their variant definitions to enable correct type inference in
consumer applications.

#### Scenario: Component with string union variants

**Given** a component recipe with string union variants (e.g., `placement`,
`size`, `variant`):

```typescript
// drawer.recipe.ts
const drawerVariants = {
  placement: {
    left: {
      /* styles */
    },
    right: {
      /* styles */
    },
    top: {
      /* styles */
    },
    bottom: {
      /* styles */
    },
  },
} as const;

export const drawerSlotRecipe = defineSlotRecipe({
  variants: drawerVariants,
});
```

**When** the recipe file is authored

**Then** it MUST export a type for each variant property using `keyof typeof`:

```typescript
export type DrawerPlacement = keyof typeof drawerVariants.placement;
// Result: "left" | "right" | "top" | "bottom"
```

**And** the type name MUST follow the pattern `{ComponentName}{VariantProperty}`
(PascalCase)

**And** the variant object MUST be declared with `as const` assertion to
preserve literal types

#### Scenario: Component with boolean variants

**Given** a component recipe with boolean variants (true/false keys):

```typescript
const drawerVariants = {
  showBackdrop: {
    true: {
      /* styles */
    },
    false: {
      /* styles */
    },
  },
} as const;
```

**When** the recipe file is authored

**Then** it MUST export the type as `boolean` directly (not `keyof typeof`):

```typescript
export type DrawerShowBackdrop = boolean;
```

**And** the type name MUST follow the pattern `{ComponentName}{VariantProperty}`

#### Scenario: Component with multiple variants

**Given** a component recipe with multiple variant properties:

```typescript
const buttonVariants = {
  size: {
    "2xs": {
      /* styles */
    },
    xs: {
      /* styles */
    },
    md: {
      /* styles */
    },
  },
  variant: {
    solid: {
      /* styles */
    },
    subtle: {
      /* styles */
    },
    outline: {
      /* styles */
    },
    ghost: {
      /* styles */
    },
    link: {
      /* styles */
    },
  },
} as const;
```

**When** the recipe file is authored

**Then** it MUST export a type for EACH variant property:

```typescript
export type ButtonSize = keyof typeof buttonVariants.size;
export type ButtonVariant = keyof typeof buttonVariants.variant;
```

### Requirement: Component types MUST use recipe-exported types

Component type files (`.types.ts` or `.types.tsx`) MUST import variant types
from their corresponding recipe files instead of using `SlotRecipeProps` or
`RecipeProps` lookups.

#### Scenario: Consuming exported variant types

**Given** a recipe file exports variant types:

```typescript
// drawer.recipe.ts
export type DrawerPlacement = keyof typeof drawerVariants.placement;
```

**When** the types file defines component props

**Then** it MUST import the type from the recipe file:

```typescript
// drawer.types.ts
import type { DrawerPlacement } from "./drawer.recipe";
```

**And** it MUST NOT use `SlotRecipeProps` or `RecipeProps` lookups:

```typescript
// ❌ WRONG - do not use
placement?: SlotRecipeProps<"drawer">["placement"];

// ✅ CORRECT
placement?: ConditionalValue<DrawerPlacement>;
```

#### Scenario: Preserving responsive prop support

**Given** a variant type exported from recipe

**When** defining the prop in the types file

**Then** non-boolean props MUST be wrapped in `ConditionalValue` to preserve
responsive prop functionality:

```typescript
import type { ConditionalValue } from "@chakra-ui/react";
import type { DrawerPlacement } from "./drawer.recipe";

type DrawerRecipeProps = {
  placement?: ConditionalValue<DrawerPlacement>; // ✅ Supports responsive
};
```

**And** boolean props MUST be used directly without `ConditionalValue`:

```typescript
type DrawerRecipeProps = {
  showBackdrop?: boolean; // ✅ Boolean - no wrapper needed
};
```

**And** `ConditionalValue` MUST be imported from `@chakra-ui/react`:

```typescript
import type { ConditionalValue } from "@chakra-ui/react";
```

#### Scenario: Documentation extraction compatibility

**Given** variant types are defined using `keyof typeof` pattern

**When** `react-docgen-typescript` extracts component types for documentation

**Then** it MUST successfully resolve the concrete union types

**And** PropsTable JSON MUST contain concrete type values like:

```json
{
  "type": {
    "name": "ConditionalValue<\"left\" | \"right\" | \"top\" | \"bottom\">"
  }
}
```

**And** it MUST NOT contain `"any"` or unresolved type references

### Requirement: Variant definitions MUST use const assertion

Recipe variant objects MUST be declared with TypeScript's `as const` assertion
to preserve literal types for accurate type extraction.

#### Scenario: Declaring variant constants

**Given** a component recipe with variants

**When** extracting variants to a constant

**Then** the constant MUST be declared with `as const`:

```typescript
// ✅ CORRECT
const drawerVariants = {
  placement: { left: {}, right: {}, top: {}, bottom: {} },
} as const;

// ❌ WRONG - types will widen to string
const drawerVariants = {
  placement: { left: {}, right: {}, top: {}, bottom: {} },
};
```

**And** the constant MUST be used in the recipe definition:

```typescript
export const drawerSlotRecipe = defineSlotRecipe({
  variants: drawerVariants, // ← Reference the const
});
```

### Requirement: Type exports MUST use direct keyof typeof

Recipe files MUST export variant types using direct `keyof typeof` expressions,
not utility types, to ensure compatibility with documentation tooling.

#### Scenario: Direct type extraction

**Given** a variant constant is defined

**When** exporting the variant type

**Then** it MUST use direct `keyof typeof` expression:

```typescript
// ✅ CORRECT - react-docgen-typescript can resolve this
export type DrawerPlacement = keyof typeof drawerVariants.placement;

// ❌ WRONG - react-docgen-typescript cannot resolve utility types
export type DrawerPlacement = ExtractVariantKeys<
  typeof drawerVariants.placement
>;
```

**Rationale:** Documentation tooling (`react-docgen-typescript`) cannot fully
resolve complex utility types across file boundaries, but can resolve direct
`keyof typeof` expressions.

## REMOVED Requirements

### Requirement: Component types MAY use SlotRecipeProps for variant types

**Status:** REMOVED

**Previously:** Component type files could reference Chakra's `SlotRecipeProps`
or `RecipeProps` types for variant definitions:

```typescript
// Old pattern - no longer allowed
type DrawerRecipeProps = {
  placement?: SlotRecipeProps<"drawer">["placement"];
};
```

**Reason for removal:** This pattern causes type lookups to resolve against
consumer's Chakra installation, which contains different default values than
Nimbus's custom recipes. This results in incorrect type inference in consumer
applications.

**Migration:** All existing usages must be replaced with the new pattern defined
in "Recipe files MUST export variant types" requirement.

---

## Implementation Notes

### Files Affected

This spec change impacts:

- All `.recipe.ts` and `.recipe.tsx` files with variants (47 components)
- All `.types.ts` and `.types.tsx` files using `SlotRecipeProps` or
  `RecipeProps` (47 components)
- `packages/nimbus/src/type-utils/` (new utility types, though not used in final
  implementation)

### Non-Breaking Change

This change is **types-only** and does not affect:

- Component runtime behavior
- Component public API
- Consumer code (except fixing type errors)
- Documentation content

### Backward Compatibility

This is a **non-breaking change**:

- Existing consumer code continues to work at runtime
- No prop renames or API changes
- Only fixes incorrect type definitions
- Consumers may need to remove type assertion workarounds

### Testing Requirements

- [ ] All existing tests must pass (no runtime changes)
- [ ] TypeScript compilation must pass
- [ ] Documentation build must succeed
- [ ] PropsTable extraction must show concrete types

### Documentation Requirements

- [ ] Technical analysis document exists at
      `/docs/adr/type-inference-bug-analysis.md`
- [ ] Implementation patterns documented with examples
- [ ] All 47 affected components listed with tracking status
