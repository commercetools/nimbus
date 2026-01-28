# Implementation Tasks: Fix Recipe Type Inference

## Overview

This document breaks down the implementation into manageable, verifiable tasks.
Tasks are organized by priority tier and can be parallelized across multiple
contributors.

**Total Effort:** 10-15 hours (8-13 hours implementation + 2 hours verification)

**Parallelization:** Tasks can be executed in parallel within each tier, but
Tier 1 should be prioritized over Tier 2.

---

## Phase 0: Foundation (30 minutes)

These foundational tasks should be completed first before any component updates.

### Task 0.1: Create Utility Type Infrastructure

**Description:** Add type utility infrastructure (though direct `keyof typeof`
will be used in practice).

**Files to modify:**

- `packages/nimbus/src/type-utils/extract-variant-keys.ts` (create)
- `packages/nimbus/src/type-utils/index.ts` (update)

**Implementation:**

```typescript
// extract-variant-keys.ts
export type ExtractVariantKeys<T> = keyof T extends "true" | "false"
  ? boolean
  : keyof T;
```

**Validation:**

- [ ] File created and exported from type-utils index
- [ ] TypeScript compilation passes
- [ ] Can be imported from `@/type-utils`

**Estimated effort:** 5 minutes

### Task 0.2: Document POC Findings

**Description:** Ensure technical analysis document is complete and accessible
to team.

**Files to verify:**

- `/docs/adr/type-inference-bug-analysis.md` exists
- Contains complete component checklist (47 components)
- Contains implementation patterns and examples

**Validation:**

- [ ] Analysis document reviewed by team
- [ ] Implementation patterns understood
- [ ] Questions answered before starting work

**Estimated effort:** 25 minutes (team review)

---

## Phase 1: Tier 1 Components (21 components, 3-5 hours)

**Priority:** High - These components have recipe name conflicts with Chakra
defaults, causing the most severe type mismatches.

### SlotRecipeProps Components (16 components)

#### Task 1.1: accordion

- **Pattern:** Full recipe type
- **Recipe file:**
  `packages/nimbus/src/components/accordion/accordion.recipe.ts`
- **Types file:** `packages/nimbus/src/components/accordion/accordion.types.ts`
- **Variants to extract:** `size` (sm, md)

**Validation:**

```bash
pnpm --filter @commercetools/nimbus build
cat packages/nimbus/dist/components/accordion/accordion.types.d.ts | grep "ConditionalValue"
pnpm --filter docs build:docs
cat apps/docs/src/data/types/AccordionRoot.json | grep -A3 "size"
```

**Estimated effort:** 15 minutes

#### Task 1.2: checkbox

- **Pattern:** Individual props (`size`)
- **Recipe file:** `packages/nimbus/src/components/checkbox/checkbox.recipe.ts`
- **Types file:** `packages/nimbus/src/components/checkbox/checkbox.types.ts`
- **Variants to extract:** `size`

**Estimated effort:** 10 minutes

#### Task 1.3: dialog

- **Pattern:** Individual props (`placement`, `scrollBehavior`)
- **Recipe file:** `packages/nimbus/src/components/dialog/dialog.recipe.ts`
- **Types file:** `packages/nimbus/src/components/dialog/dialog.types.ts`
- **Variants to extract:** `placement`, `scrollBehavior`

**Estimated effort:** 10 minutes

#### Task 1.4: menu

- **Pattern:** Full recipe type
- **Recipe file:** `packages/nimbus/src/components/menu/menu.recipe.ts`
- **Types file:** `packages/nimbus/src/components/menu/menu.types.ts`
- **Variants to extract:** All variants from recipe

**Estimated effort:** 15 minutes

#### Task 1.5: switch

- **Pattern:** Full recipe type
- **Recipe file:** `packages/nimbus/src/components/switch/switch.recipe.tsx`
- **Types file:** `packages/nimbus/src/components/switch/switch.types.tsx`
- **Variants to extract:** All variants from recipe

**Estimated effort:** 15 minutes

#### Task 1.6: tabs

- **Pattern:** Individual props (`variant`, `orientation`, `placement`, `size`)
- **Recipe file:** `packages/nimbus/src/components/tabs/tabs.recipe.ts`
- **Types file:** `packages/nimbus/src/components/tabs/tabs.types.ts`
- **Variants to extract:** `variant`, `orientation`, `placement`, `size`

**Estimated effort:** 15 minutes

#### Task 1.7: calendar

- **Pattern:** Full recipe type
- **Recipe file:** `packages/nimbus/src/components/calendar/calendar.recipe.ts`
- **Types file:** `packages/nimbus/src/components/calendar/calendar.types.ts`
- **Variants to extract:** All variants from recipe

**Estimated effort:** 15 minutes

#### Task 1.8: range-calendar

- **Pattern:** Full recipe type
- **Recipe file:**
  `packages/nimbus/src/components/range-calendar/range-calendar.recipe.ts`
- **Types file:**
  `packages/nimbus/src/components/range-calendar/range-calendar.types.ts`
- **Variants to extract:** All variants from recipe

**Estimated effort:** 15 minutes

#### Task 1.9: data-table

- **Pattern:** Full recipe type
- **Recipe file:**
  `packages/nimbus/src/components/data-table/data-table.recipe.ts`
- **Types file:**
  `packages/nimbus/src/components/data-table/data-table.types.ts`
- **Variants to extract:** All variants from recipe

**Estimated effort:** 15 minutes

#### Task 1.10: radio-input

- **Pattern:** Individual props (`orientation`)
- **Recipe file:**
  `packages/nimbus/src/components/radio-input/radio-input.recipe.ts`
- **Types file:**
  `packages/nimbus/src/components/radio-input/radio-input.types.ts`
- **Variants to extract:** `orientation`

**Note:** Uses `RecipeProps`, not `SlotRecipeProps`

**Estimated effort:** 10 minutes

#### Task 1.11: select

- **Pattern:** Individual props (`size`, `variant`)
- **Recipe file:** `packages/nimbus/src/components/select/select.recipe.ts`
- **Types file:** `packages/nimbus/src/components/select/select.types.tsx`
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 1.12: field-errors

- **Pattern:** Full recipe type
- **Recipe file:**
  `packages/nimbus/src/components/field-errors/field-errors.recipe.ts`
- **Types file:**
  `packages/nimbus/src/components/field-errors/field-errors.types.ts`
- **Variants to extract:** All variants from recipe

**Estimated effort:** 15 minutes

#### Task 1.13: form-field

- **Pattern:** Individual props (`size`, `direction`)
- **Recipe file:**
  `packages/nimbus/src/components/form-field/form-field.recipe.ts`
- **Types file:**
  `packages/nimbus/src/components/form-field/form-field.types.ts`
- **Variants to extract:** `size`, `direction`

**Estimated effort:** 10 minutes

#### Task 1.14: table

- **Pattern:** Full recipe type
- **Recipe file:** `packages/nimbus/src/components/table/table.recipe.ts`
- **Types file:** `packages/nimbus/src/components/table/table.types.ts`
- **Variants to extract:** All variants from recipe

**Estimated effort:** 15 minutes

### RecipeProps Components (5 components)

#### Task 1.15: avatar

- **Pattern:** Individual props (`size`)
- **Recipe file:** `packages/nimbus/src/components/avatar/avatar.recipe.ts`
- **Types file:** `packages/nimbus/src/components/avatar/avatar.types.ts`
- **Variants to extract:** `size`

**Estimated effort:** 10 minutes

#### Task 1.16: badge

- **Pattern:** Individual props (`size`)
- **Recipe file:** `packages/nimbus/src/components/badge/badge.recipe.ts`
- **Types file:** `packages/nimbus/src/components/badge/badge.types.ts`
- **Variants to extract:** `size`

**Estimated effort:** 10 minutes

#### Task 1.17: button

- **Pattern:** Individual props (`size`, `variant`)
- **Recipe file:** `packages/nimbus/src/components/button/button.recipe.ts`
- **Types file:** `packages/nimbus/src/components/button/button.types.ts`
- **Variants to extract:** `size`, `variant`

**Note:** Highly used component - extra care needed

**Estimated effort:** 15 minutes

#### Task 1.18: popover

- **Pattern:** Full recipe type
- **Recipe file:** `packages/nimbus/src/components/popover/popover.recipe.tsx`
- **Types file:** `packages/nimbus/src/components/popover/popover.types.ts`
- **Variants to extract:** All variants from recipe

**Estimated effort:** 15 minutes

#### Task 1.19: separator

- **Pattern:** Full recipe type
- **Recipe file:**
  `packages/nimbus/src/components/separator/separator.recipe.ts`
- **Types file:** `packages/nimbus/src/components/separator/separator.types.ts`
- **Variants to extract:** All variants from recipe

**Estimated effort:** 10 minutes

---

## Phase 2: Tier 2 Components (26 components, 3-6 hours)

**Priority:** Medium - Nimbus-specific recipe names, less likely to cause severe
conflicts but still affected.

### SlotRecipeProps Components (21 components)

#### Task 2.1: card

- **Pattern:** Individual props (`cardPadding`, `borderStyle`, `elevation`,
  `backgroundStyle`)
- **Variants to extract:** `cardPadding`, `borderStyle`, `elevation`,
  `backgroundStyle`

**Estimated effort:** 15 minutes

#### Task 2.2: collapsible-motion

- **Pattern:** Full recipe type
- **Variants to extract:** All variants

**Estimated effort:** 15 minutes

#### Task 2.3: combobox

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.4: date-input

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.5: date-picker

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.6: date-range-picker

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.7: draggable-list

- **Pattern:** Individual props (`size`)
- **Variants to extract:** `size`

**Estimated effort:** 10 minutes

#### Task 2.8: list

- **Pattern:** Full recipe type
- **Variants to extract:** All variants

**Estimated effort:** 15 minutes

#### Task 2.9: localized-field

- **Pattern:** Individual props (`size`, `type`)
- **Variants to extract:** `size`, `type`

**Estimated effort:** 10 minutes

#### Task 2.10: money-input

- **Pattern:** Individual props (`size`)
- **Variants to extract:** `size`

**Estimated effort:** 10 minutes

#### Task 2.11: multiline-text-input

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.12: number-input

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.13: progress-bar

- **Pattern:** Individual props (`size`, `isDynamic`, `isIndeterminate`,
  `variant`, `layout`)
- **Variants to extract:** `size`, `isDynamic`, `isIndeterminate`, `variant`,
  `layout`

**Note:** Multiple boolean variants - use explicit `boolean` type

**Estimated effort:** 15 minutes

#### Task 2.14: rich-text-input

- **Pattern:** Full recipe type
- **Variants to extract:** All variants

**Estimated effort:** 15 minutes

#### Task 2.15: scoped-search-input

- **Pattern:** Individual props (`size`)
- **Variants to extract:** `size`

**Estimated effort:** 10 minutes

#### Task 2.16: search-input

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.17: split-button

- **Pattern:** Full recipe type
- **Variants to extract:** All variants

**Estimated effort:** 15 minutes

#### Task 2.18: text-input

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.19: time-input

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.20: tag-group

- **Pattern:** Individual props (`size`)
- **Variants to extract:** `size`

**Note:** Uses `RecipeProps`, not `SlotRecipeProps`

**Estimated effort:** 10 minutes

### RecipeProps Components (11 components)

#### Task 2.21: code

- **Pattern:** Full recipe type
- **Variants to extract:** All variants

**Estimated effort:** 15 minutes

#### Task 2.22: group

- **Pattern:** Full recipe type
- **Variants to extract:** All variants

**Estimated effort:** 15 minutes

#### Task 2.23: heading

- **Pattern:** Individual props (`size`)
- **Variants to extract:** `size`

**Estimated effort:** 10 minutes

#### Task 2.24: icon

- **Pattern:** Full recipe type
- **Recipe file:** `packages/nimbus/src/components/icon/icon.recipe.tsx`
- **Variants to extract:** `size`

**Estimated effort:** 15 minutes

#### Task 2.25: kbd

- **Pattern:** Full recipe type
- **Variants to extract:** All variants

**Estimated effort:** 15 minutes

#### Task 2.26: link

- **Pattern:** Individual props (`size`, `fontColor`)
- **Variants to extract:** `size`, `fontColor`

**Estimated effort:** 10 minutes

#### Task 2.27: loading-spinner

- **Pattern:** Individual props (`size`)
- **Variants to extract:** `size`

**Estimated effort:** 10 minutes

#### Task 2.28: toggle-button

- **Pattern:** Individual props (`size`, `variant`)
- **Variants to extract:** `size`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.29: toggle-button-group

- **Pattern:** Full recipe type
- **Variants to extract:** All variants

**Estimated effort:** 15 minutes

#### Task 2.30: toolbar

- **Pattern:** Individual props (`size`, `orientation`, `variant`)
- **Variants to extract:** `size`, `orientation`, `variant`

**Estimated effort:** 10 minutes

#### Task 2.31: tooltip

- **Pattern:** Full recipe type
- **Variants to extract:** All variants

**Estimated effort:** 15 minutes

---

## Phase 3: Verification & Testing (2 hours)

### Task 3.1: Build Verification

**Description:** Ensure all components build successfully and generate correct
type definitions.

**Commands:**

```bash
# Full clean build
pnpm nimbus:reset
pnpm install
pnpm build

# Verify no SlotRecipeProps/RecipeProps usage remains
grep -r "SlotRecipeProps\|RecipeProps" packages/nimbus/src/components/*/*.types.ts* | \
  grep -v "import" | \
  grep -v "//"

# Expected: No matches
```

**Validation:**

- [ ] Build completes without errors
- [ ] No remaining `SlotRecipeProps<` or `RecipeProps<` in type definitions
- [ ] All `.d.ts` files generated successfully

**Estimated effort:** 15 minutes

### Task 3.2: Type Checking

**Description:** Verify TypeScript compilation across entire workspace.

**Commands:**

```bash
# Type check entire workspace
pnpm typecheck

# Strict type check for nimbus package
pnpm --filter @commercetools/nimbus typecheck:strict
```

**Validation:**

- [ ] No TypeScript errors
- [ ] No new type warnings
- [ ] All packages type-check successfully

**Estimated effort:** 10 minutes

### Task 3.3: Test Suite Validation

**Description:** Ensure all tests still pass (no runtime changes expected).

**Commands:**

```bash
# Run all tests
pnpm test

# Run unit tests only (fast)
pnpm test:unit

# Run Storybook tests (requires build)
pnpm test:storybook
```

**Validation:**

- [ ] All unit tests pass
- [ ] All Storybook tests pass
- [ ] No new test failures introduced

**Estimated effort:** 20 minutes

### Task 3.4: Documentation Build Verification

**Description:** Rebuild docs site and verify PropsTable extraction quality.

**Commands:**

```bash
# Rebuild documentation
pnpm --filter docs build:docs

# Verify PropsTable extraction for key components
cat apps/docs/src/data/types/DrawerRoot.json | grep -A3 "placement"
cat apps/docs/src/data/types/AlertRoot.json | grep -A3 "variant"
cat apps/docs/src/data/types/ButtonProps.json | grep -A3 "size"

# Build docs app
pnpm --filter docs build:app
```

**Validation:**

- [ ] Documentation build succeeds
- [ ] All PropsTable JSON files contain concrete types (not `"any"`)
- [ ] Sample verification shows correct type extraction
- [ ] Docs app builds successfully

**Estimated effort:** 20 minutes

### Task 3.5: Spot Check Generated Types

**Description:** Manually verify a sample of generated `.d.ts` files contain
correct concrete types.

**Sample components to check:**

- drawer
- alert
- button
- tabs
- combobox

**What to verify:**

```typescript
// In drawer.recipe.d.ts - should see exported types
export type DrawerPlacement = "left" | "right" | "top" | "bottom";

// In drawer.types.d.ts - should see concrete usage
placement?: ConditionalValue<DrawerPlacement>;
```

**Validation:**

- [ ] Recipe files export variant types
- [ ] Types files use imported types
- [ ] No `SlotRecipeProps` or `RecipeProps` in generated files
- [ ] Concrete unions visible in type definitions

**Estimated effort:** 15 minutes

### Task 3.6: Consumer Simulation Test

**Description:** Test the fix in a minimal consumer-like environment to verify
IDE type inference works correctly.

**Setup:**

```bash
# Create test consumer project
cd /tmp
npm create vite@latest nimbus-test-consumer -- --template react-ts
cd nimbus-test-consumer
npm install
npm install file:/path/to/ui-kit-docs-poc/packages/nimbus/dist
```

**Test:**

```tsx
// src/App.tsx
import { Drawer, Alert } from '@commercetools/nimbus';

// Verify IDE autocomplete and type checking
<Drawer.Root placement="left"> {/* Should not error */}
  {/* ... */}
</Drawer.Root>

<Alert.Root variant="outlined"> {/* Should not error */}
  {/* ... */}
</Alert.Root>
```

**Validation:**

- [ ] No TypeScript errors in consumer app
- [ ] IDE autocomplete shows correct values
- [ ] Responsive props type correctly:
      `placement={{ base: "bottom", md: "left" }}`

**Estimated effort:** 30 minutes

### Task 3.7: Documentation Review

**Description:** Review updated component documentation for any rendering
issues.

**Commands:**

```bash
# Start docs site
pnpm start:docs

# Navigate to updated components
# Check PropsTable renders correctly
```

**Components to spot-check:**

- drawer
- alert
- button
- tabs
- accordion

**Validation:**

- [ ] PropsTable displays correct variant values
- [ ] Type information renders properly
- [ ] No broken links or rendering errors
- [ ] Examples still work

**Estimated effort:** 15 minutes

### Task 3.8: Create Changeset

**Description:** Document the change for version management.

**Commands:**

```bash
pnpm changeset
```

**Changeset content:**

```
---
"@commercetools/nimbus": patch
---

Fix TypeScript type inference for component variants in consumer applications.

Component variant props (like placement, size, variant) now use concrete type
definitions instead of Chakra UI type lookups. This fixes incorrect type
suggestions in consumer applications while maintaining responsive prop support
and documentation generation.

Affected: All components with recipe-based variants (47 components total).

No breaking changes - component API and runtime behavior unchanged.
```

**Validation:**

- [ ] Changeset created
- [ ] Describes the fix clearly
- [ ] Marked as patch version (no breaking changes)

**Estimated effort:** 5 minutes

---

## Phase 4: Final Checks (10 minutes)

### Task 4.1: Final Validation Command

**Description:** Run comprehensive validation to ensure nothing was missed.

**Commands:**

```bash
# Check for any remaining problematic patterns
grep -r "SlotRecipeProps<\|RecipeProps<" packages/nimbus/src/components/*/[^/]*.types.ts* 2>/dev/null | wc -l

# Expected: 0

# Verify all 47 components have corresponding recipe exports
for comp in accordion alert avatar badge button calendar card checkbox code collapsible-motion combobox data-table date-input date-picker date-range-picker dialog draggable-list drawer field-errors form-field group heading icon kbd link list loading-spinner localized-field menu money-input multiline-text-input number-input popover progress-bar radio-input range-calendar rich-text-input scoped-search-input search-input select separator split-button switch table tabs tag-group text-input time-input toggle-button toggle-button-group toolbar tooltip; do
  if ! grep -q "export type" packages/nimbus/src/components/$comp/$comp.recipe.ts* 2>/dev/null; then
    echo "Missing exports in $comp"
  fi
done

# Expected: No output
```

**Validation:**

- [ ] No remaining `SlotRecipeProps<` or `RecipeProps<` usage
- [ ] All recipe files export variant types
- [ ] Build passes
- [ ] Tests pass
- [ ] Documentation builds

**Estimated effort:** 10 minutes

---

## Parallelization Strategy

### Recommended Team Distribution

**Option 1: By Tier (Sequential)**

- **Team A**: Phase 1 - Tier 1 components (21 components)
- **Team B**: Phase 2 - Tier 2 components (26 components)
- Start Phase 2 after Phase 1 completes

**Option 2: By Component Type (Parallel)**

- **Team A**: All SlotRecipeProps components (30 total)
- **Team B**: All RecipeProps components (17 total)
- Work in parallel from start

**Option 3: Small Batches (Parallel + Sequential)**

- Divide into 3-5 component batches
- Each contributor takes a batch
- Complete verification after each batch
- Reduces risk of merge conflicts

### Recommended: Option 3

Assign each contributor 3-5 components at a time:

**Batch 1** (Tier 1, high visibility):

- drawer, alert, button, tabs, dialog

**Batch 2** (Tier 1, high usage):

- accordion, menu, checkbox, select, switch

**Batch 3** (Tier 1, remaining):

- calendar, range-calendar, data-table, table, field-errors, form-field

**Batch 4-9** (Tier 2):

- Split remaining 26 components across batches

---

## Task Dependencies

### Critical Path

```
Phase 0 (Foundation)
  ↓
Phase 1 or 2 (Component updates - can be parallel)
  ↓
Phase 3.1 (Build verification)
  ↓
Phase 3.2 (Type checking)
  ↓
Phase 3.3 (Test suite)
  ↓
Phase 3.4 (Documentation build)
  ↓
Phase 3.5-3.7 (Final checks)
  ↓
Phase 3.8 (Changeset)
  ↓
Phase 4 (Final validation)
```

### No Dependencies Within Phases

- All Phase 1 tasks can run in parallel
- All Phase 2 tasks can run in parallel
- Phase 3 tasks should run sequentially in order

---

## Success Metrics

### Completion Criteria

- ✅ All 47 components updated with new pattern
- ✅ Zero `SlotRecipeProps<` or `RecipeProps<` references in component type
  files
- ✅ All builds pass (nimbus, docs)
- ✅ All tests pass (unit, storybook)
- ✅ PropsTable shows concrete types for all components
- ✅ Consumer simulation test passes
- ✅ Changeset created

### Quality Metrics

- **Type Safety:** No `any` types in PropsTable extraction
- **Documentation:** All PropsTable JSON files show concrete unions
- **Build Time:** No significant change from baseline
- **Test Coverage:** No reduction in test coverage
- **Bundle Size:** No significant change (types only)

---

## Notes

### Per-Component Checklist

For each component, follow this checklist:

1. [ ] Open recipe file
2. [ ] Extract variants to const with `as const`
3. [ ] Update `defineSlotRecipe`/`defineRecipe` to use const
4. [ ] Export types:
       `export type ComponentProp = keyof typeof componentVariants.prop`
5. [ ] For boolean variants: Export as `boolean` directly
6. [ ] Open types file
7. [ ] Import `ConditionalValue` from `@chakra-ui/react`
8. [ ] Import variant types from recipe file
9. [ ] Replace `SlotRecipeProps<"name">` with imported types
10. [ ] Wrap non-boolean props in `ConditionalValue`
11. [ ] Build: `pnpm --filter @commercetools/nimbus build`
12. [ ] Verify generated `.d.ts` files
13. [ ] Rebuild docs: `pnpm --filter docs build:docs`
14. [ ] Verify PropsTable JSON

### Common Patterns

**For boolean variants:**

```typescript
// Recipe file
const variants = {
  showSomething: { true: {}, false: {} },
} as const;

// Export as boolean, not keyof typeof
export type ComponentShowSomething = boolean;

// Types file - use directly without ConditionalValue
showSomething?: boolean;
```

**For string union variants:**

```typescript
// Recipe file
export type ComponentSize = keyof typeof componentVariants.size;

// Types file - wrap in ConditionalValue
size?: ConditionalValue<ComponentSize>;
```

**For full recipe type conversion:**

```typescript
// Before
type ComponentRecipeProps = SlotRecipeProps<"component">;

// After - list all variants explicitly
import type { ComponentSize, ComponentVariant } from "./component.recipe";

type ComponentRecipeProps = {
  size?: ConditionalValue<ComponentSize>;
  variant?: ConditionalValue<ComponentVariant>;
};
```

### Troubleshooting

**If PropsTable shows `"any"`:**

- Verify recipe file exports types using direct `keyof typeof` (not utility
  type)
- Check types file imports from recipe
- Rebuild both nimbus and docs

**If TypeScript errors:**

- Ensure `as const` is used on variants object
- Verify all exported types are imported in types file
- Check for typos in type names

**If tests fail:**

- This should not happen (no runtime changes)
- Check for accidental code changes
- Revert and try again

### Reference Implementation

Drawer and Alert components were used for POC validation. These can serve as
reference examples once re-implemented following this task plan.
