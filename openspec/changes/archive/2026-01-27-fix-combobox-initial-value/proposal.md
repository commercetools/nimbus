# Change: Fix ComboBox Initial Input Value

**Change ID:** `fix-combobox-initial-value` **Type:** Bug Fix **Status:** Draft
**Priority:** High (affects all pre-selected ComboBox instances)

## Why

ComboBox components with pre-selected values render with blank input fields due
to a race condition between React Aria's CollectionBuilder and component
initialization, requiring manual workarounds that defeat automatic value
synchronization.

## What Changes

- Modify sync effect in `combobox.root.tsx` to track node resolution state
- Add `lastNodeFoundRef` to detect collection population transitions
- Remove documentation workarounds that manually set `inputValue`
- Add test coverage for initial value rendering

## Problem Statement

When a ComboBox is rendered with `selectedKeys` prop set to a pre-selected value
in single-select mode without controlled `inputValue`, the input field displays
blank even though the selection is internally recognized (evidenced by the clear
button being visible).

This affects any ComboBox that:

1. Uses `selectedKeys` prop with a pre-selected value
2. Does NOT use controlled `inputValue` prop
3. Is in single-select mode (default)

## Root Cause

The bug occurs due to a race condition between React Aria's `CollectionBuilder`
and the component's initial state computation:

1. `ComboBoxRoot` creates JSX content for `CollectionBuilder`
2. `CollectionBuilder` parses content and passes `collection` to
   `ComboBoxRootInner`
3. `useState(computeInitialInputValue)` runs but
   `collection.getItem(selectedKey)` returns `null` because collection isn't
   fully populated yet
4. Input value initializes to empty string
5. The sync effect (lines 1152-1193) has a logic bug:
   - On first run, it sees `selectedKey="apple"` and stores it in
     `lastSelectedKeyRef`
   - `collection.getItem("apple")` still returns `null`, effect returns early
   - On subsequent renders when collection IS populated:
     - `currentSelectedKey === lastSelectedKeyRef.current` → early return
     - Input value never gets updated

## Current Workaround

Users must explicitly set both `selectedKeys` AND `inputValue`:

```tsx
<ComboBox.Root
  selectedKeys={["apple"]}
  inputValue="Apple" // Manual synchronization required
/>
```

This defeats the purpose of automatic value resolution and requires manual
synchronization.

## Proposed Solution

Fix the sync effect (lines 1152-1193 in `combobox.root.tsx`) to track whether
the node was successfully resolved, not just whether the selection key changed.

### Design Decision

Track an additional ref `lastNodeFoundRef` to detect when the collection
transitions from "node not found" to "node found" state. This allows the effect
to re-run when the collection becomes populated with a previously-missing node.

## Success Criteria

1. ComboBox with pre-selected `selectedKeys` displays the selected item's text
   in the input field on initial render
2. No workaround of explicit `inputValue` prop required
3. Existing behavior for controlled `inputValue` prop unchanged
4. All existing tests continue to pass
5. New test added to verify initial value rendering with `selectedKeys`

## Impact Analysis

### Breaking Changes

None - this is a bug fix that restores expected behavior.

### Affected Components

- `ComboBox.Root` component only

### Test Coverage Requirements

- Add Storybook story testing initial render with `selectedKeys`
- Verify controlled `inputValue` prop still works
- Verify uncontrolled mode with `defaultSelectedKey` works

## Related Work

- Documentation workaround applied in `combobox.dev.mdx` (lines 318-343)
- Bug analysis documented in `COMBOBOX_INITIAL_VALUE_BUG.md`

## Alternatives Considered

### Alternative 1: Fix in `computeInitialInputValue`

**Approach:** Make the function wait for collection to be populated.
**Rejected:** Not possible because this is a synchronous function called during
`useState` initialization. Cannot wait for async collection building.

### Alternative 2: Use `useEffect` to set initial value

**Approach:** Remove `computeInitialInputValue` and use effect to set input
value after mount. **Rejected:** Would cause flicker (render with empty input,
then update). Current approach is better as it fixes the existing effect logic.

### Alternative 3: Pre-populate collection outside `CollectionBuilder`

**Approach:** Build collection synchronously before passing to
`CollectionBuilder`. **Rejected:** Would require significant refactoring of
React Aria integration and might break other functionality.

## References

- React Aria CollectionBuilder:
  https://react-spectrum.adobe.com/react-aria/CollectionBuilder.html
- ARIA Combobox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
- Related file:
  `packages/nimbus/src/components/combobox/components/combobox.root.tsx`
