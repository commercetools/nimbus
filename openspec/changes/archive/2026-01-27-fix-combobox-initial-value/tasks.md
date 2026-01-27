# Implementation Tasks: Fix ComboBox Initial Value

## Overview

This document outlines the ordered tasks to fix the ComboBox initial input value
bug. Each task is small, verifiable, and delivers user-visible progress.

## Task List

### 1. Add `lastNodeFoundRef` tracking to sync effect ✅

**Description:** Add new ref to track whether the selected node was successfully
found in collection.

**Steps:**

1. Add `const lastNodeFoundRef = useRef<boolean>(false)` near
   `lastSelectedKeyRef` declaration (around line 1134)
2. Ensure ref is declared before the sync effect

**Validation:**

- TypeScript compiles without errors
- No runtime errors when rendering ComboBox

**Dependencies:** None **Estimated effort:** 15 minutes

---

### 2. Modify sync effect early-return logic ✅

**Description:** Update the sync effect to check both selection key change AND
node found status.

**Steps:**

1. Locate sync effect (lines 1152-1193 in `combobox.root.tsx`)
2. Move `selectedNode` resolution before early-return check
3. Add `nodeFound` constant: `const nodeFound = selectedNode !== null`
4. Modify early-return condition to:
   ```typescript
   if (
     currentSelectedKey === lastSelectedKeyRef.current &&
     (lastNodeFoundRef.current || currentSelectedKey === null)
   ) {
     return;
   }
   ```
5. Update both refs after early-return:
   `lastSelectedKeyRef.current = currentSelectedKey` and
   `lastNodeFoundRef.current = nodeFound`

**Validation:**

- TypeScript compiles without errors
- Effect logic is sound (no infinite loops)
- Existing Storybook stories still work

**Dependencies:** Task 1 **Estimated effort:** 30 minutes

---

### 3. Test fix with existing read-only example ✅

**Description:** Verify the fix resolves the issue in the documentation example.

**Steps:**

1. Remove workaround `inputValue="Apple"` from `combobox.dev.mdx` line 330
2. Build nimbus package: `pnpm --filter @commercetools/nimbus build`
3. Start docs app: `pnpm start:docs`
4. Navigate to ComboBox read-only example
5. Verify input displays "Apple"

**Validation:**

- Input shows "Apple" on initial render
- Clear button is visible
- No console errors or warnings

**Dependencies:** Task 2 **Estimated effort:** 15 minutes

---

### 4. Add Storybook story for initial selected value ✅

**Description:** Create test story verifying initial value rendering with
`selectedKeys`.

**Steps:**

1. Open `packages/nimbus/src/components/combobox/combobox.stories.tsx`
2. Add new story:

   ```typescript
   export const InitialSelectedValue: Story = {
     render: () => {
       const fruits = [
         { id: 'apple', name: 'Apple' },
         { id: 'banana', name: 'Banana' },
         { id: 'orange', name: 'Orange' },
       ];
       return (
         <ComposedComboBox
           items={fruits}
           selectedKeys={["apple"]}
           aria-label="ComboBox with initial selection"
         />
       );
     },
     play: async ({ canvasElement }) => {
       const canvas = within(canvasElement);
       const input = canvas.getByRole('combobox');

       // Verify input displays selected item's text
       await waitFor(() => {
         expect(input).toHaveValue('Apple');
       });

       // Verify clear button is visible
       const clearButton = canvas.getByRole('button', { name: /clear/i });
       expect(clearButton).toBeVisible();
     },
   };
   ```

**Validation:**

- Build package: `pnpm --filter @commercetools/nimbus build`
- Run story test:
  `pnpm test packages/nimbus/src/components/combobox/combobox.stories.tsx --testNamePattern="InitialSelectedValue"`
- Test passes

**Dependencies:** Task 2 **Estimated effort:** 45 minutes

---

### 5. Add test for controlled inputValue unchanged ✅

**Description:** Verify controlled `inputValue` prop still takes precedence.

**Steps:**

1. Add story to `combobox.stories.tsx`:

   ```typescript
   export const ControlledInputWithSelection: Story = {
     render: () => {
       const fruits = [
         { id: 'apple', name: 'Apple' },
         { id: 'banana', name: 'Banana' },
       ];
       return (
         <ComposedComboBox
           items={fruits}
           selectedKeys={["apple"]}
           inputValue="Custom Value"
           aria-label="Controlled input"
         />
       );
     },
     play: async ({ canvasElement }) => {
       const canvas = within(canvasElement);
       const input = canvas.getByRole('combobox');

       // Verify controlled value is displayed, not selected item text
       expect(input).toHaveValue('Custom Value');
     },
   };
   ```

**Validation:**

- Build and run test
- Test passes
- Controlled behavior unchanged

**Dependencies:** Task 2 **Estimated effort:** 30 minutes

---

### 6. Run full test suite ✅

**Description:** Ensure all existing tests still pass with the fix.

**Steps:**

1. Build package: `pnpm --filter @commercetools/nimbus build`
2. Run all ComboBox tests: `pnpm test packages/nimbus/src/components/combobox/`
3. Check for any failures or regressions

**Validation:**

- All existing tests pass
- No new console errors or warnings
- TypeScript builds without errors

**Dependencies:** Tasks 1-5 **Estimated effort:** 20 minutes

---

### 7. Update documentation examples ✅

**Description:** Remove workarounds from documentation now that bug is fixed.

**Steps:**

1. Remove `inputValue="Apple"` workaround from `combobox.dev.mdx` line 330 (if
   not already done in Task 3)
2. Review other documentation examples for similar workarounds
3. Add comment in code explaining the fix (optional)

**Validation:**

- Documentation examples render correctly without workarounds
- Build docs app and verify visually

**Dependencies:** Task 6 **Estimated effort:** 15 minutes

---

### 8. Remove or update bug documentation ✅

**Description:** Archive or update the bug analysis file.

**Steps:**

1. Either:
   - Delete `COMBOBOX_INITIAL_VALUE_BUG.md`
   - OR move to archive/resolved folder
   - OR add "RESOLVED" section with fix reference
2. Update any references to the bug in comments or documentation

**Validation:**

- No stale bug documentation remains
- Fix is documented for future reference

**Dependencies:** Task 7 **Estimated effort:** 10 minutes

---

## Summary

**Total estimated effort:** ~3 hours **Parallelizable work:** Tasks 4 and 5 can
be done in parallel after Task 2 **Critical path:** Tasks 1 → 2 → 3 → 6 → 7 → 8

**Test strategy:**

- Manual verification via docs app (Task 3)
- Automated Storybook tests (Tasks 4-5)
- Regression testing (Task 6)

**Rollback plan:** If issues arise, revert the effect logic change (Task 2) and
restore documentation workaround.
