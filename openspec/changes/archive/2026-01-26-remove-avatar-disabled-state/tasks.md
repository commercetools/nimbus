# Tasks: Remove Avatar Disabled State

## Implementation Tasks

### Task 1: Remove disabled styles from recipe

**File:** `packages/nimbus/src/components/avatar/avatar.recipe.ts`

**Changes:**

- Remove the `_disabled: { layerStyle: "disabled" }` line from the base styles

**Validation:**

- TypeScript compiles without errors
- Recipe builds correctly

---

### Task 2: Remove isDisabled prop from types

**File:** `packages/nimbus/src/components/avatar/avatar.types.ts`

**Changes:**

- Remove the `isDisabled` prop and its JSDoc comment from `AvatarProps`

**Validation:**

- TypeScript compiles without errors
- No consumers reference isDisabled (check with grep)

---

### Task 3: Remove disabled examples from documentation

**File:** `packages/nimbus/src/components/avatar/avatar.dev.mdx`

**Changes:**

- Remove the "Disabled state" section (lines 109-125)

**Validation:**

- Documentation builds without errors
- No broken links or references

---

### Task 4: Update spec to remove disabled requirement

**File:** `openspec/specs/nimbus-avatar/spec.md`

**Changes:**

- Remove "Requirement: Disabled State Support" section and its scenarios

**Validation:**

- `pnpm openspec validate nimbus-avatar` passes

---

### Task 5: Build and test

**Commands:**

```bash
pnpm --filter @commercetools/nimbus build
pnpm --filter @commercetools/nimbus typecheck
pnpm test packages/nimbus/src/components/avatar/avatar.stories.tsx
```

**Validation:**

- Package builds successfully
- Type checking passes
- All Avatar story tests pass

## Parallel Execution

Tasks 1-4 can be executed in parallel as they modify independent files. Task 5
must run after all others complete.

## Rollback Plan

If issues arise, revert the changes to all modified files. The removal is
straightforward and can be easily reverted.
