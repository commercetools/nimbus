# Fix ComboBox Initial Input Value

**Change ID:** `fix-combobox-initial-value` **Status:** ✅ Validated - Ready for
Review **Type:** Bug Fix **Priority:** High

## Quick Summary

Fixes a race condition bug where ComboBox renders with blank input field when
`selectedKeys` is set on initial render, despite the selection being recognized
internally.

## What's Wrong

```tsx
// Currently BROKEN - input displays blank
<ComboBox.Root items={fruits} selectedKeys={["apple"]}>
  ...
</ComboBox.Root>

// Current workaround - must manually sync
<ComboBox.Root
  items={fruits}
  selectedKeys={["apple"]}
  inputValue="Apple"  // ❌ Shouldn't be needed
>
  ...
</ComboBox.Root>
```

## What We'll Fix

```tsx
// After fix - works correctly
<ComboBox.Root items={fruits} selectedKeys={["apple"]}>
  ...
</ComboBox.Root>
// Input will display "Apple" automatically ✅
```

## Root Cause

Race condition between React Aria's `CollectionBuilder` and component
initialization:

1. Component tries to resolve selected item's text during `useState`
   initialization
2. Collection isn't populated yet, so returns empty string
3. Sync effect fails to update later because it only watches for selection key
   changes, not collection population

## Solution

Add `lastNodeFoundRef` to track whether selected node was successfully resolved.
Effect will re-run when collection transitions from "node not found" to "node
found" state.

## Files Changed

- `packages/nimbus/src/components/combobox/components/combobox.root.tsx` - Fix
  sync effect logic
- `packages/nimbus/src/components/combobox/combobox.stories.tsx` - Add test
  stories
- `packages/nimbus/src/components/combobox/combobox.dev.mdx` - Remove workaround

## Testing Strategy

1. Manual verification via docs app
2. New Storybook story: `InitialSelectedValue`
3. New Storybook story: `ControlledInputWithSelection`
4. Full regression test suite

## Estimated Effort

~3 hours total (8 small tasks)

## Next Steps

1. Review this proposal
2. Approve for implementation
3. Execute tasks in `tasks.md`
4. Verify all tests pass
5. Merge to main

## Documentation

- **Proposal:** `proposal.md` - Full problem analysis and design decisions
- **Spec Delta:** `specs/combobox-initial-value-sync/spec.md` - Requirements
- **Tasks:** `tasks.md` - Step-by-step implementation guide
- **Bug Analysis:**
  `../../nimbus/src/components/combobox/COMBOBOX_INITIAL_VALUE_BUG.md`
