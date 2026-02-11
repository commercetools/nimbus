# Toast Story Testing Investigation

**Date:** 2026-02-11 **Branch:**
`CRAFT-1853-nimbus-toast-notification-system--implementation` **Status:** ✅
PRIMARY ISSUE RESOLVED - 10/15 tests passing

---

## Problem Statement

The toast component Storybook stories were failing with duplicate element
errors:

```
TestingLibraryElementError: Found multiple elements with the text: Info toast
```

**Initial State:**

- 1/15 tests passing initially
- Tests failing with "Found multiple elements" errors
- Tests using `findByText()` which expects exactly ONE element
- Duplicate toasts appearing in DOM (e.g., IDs `toast:7` and `toast:f` both with
  "Info toast")

---

## Root Cause (ACTUAL)

**The real issue was NOT Storybook multi-context rendering or cleanup
problems.**

### The Actual Problem: Double Event Firing

When using `onClick` on React Aria Button components:

1. **Native DOM `onClick` event** fires first
2. **React Aria's synthetic `onPress` event** fires second
3. This causes the handler function to execute **twice**

**Evidence:**

```typescript
// Debug logs showed:
[DEBUG STORY] Variants story rendering      (once)
[DEBUG STORY] showToasts() called          (TWICE!)

// Toast IDs created:
- First call: toast:7, toast:9, toast:b, toast:d (4 toasts)
- Second call: toast:f, toast:h, toast:j, toast:... (4 more toasts)
```

**Why this happened:**

- React Aria buttons support both `onClick` (for compatibility) and `onPress`
  (preferred)
- Using `onClick` triggers both the native event AND React Aria's internal event
  handling
- The stories were using `<Button onClick={...}>` instead of
  `<Button onPress={...}>`

---

## Solution Implemented

### Commit: `1b1efa023` - "fix(toast): change Button onClick to onPress"

**Changes:**

- Changed ALL Button components in toast stories from `onClick` to `onPress`
- Removed debug logging used for investigation
- No component code changes needed

**Files Modified:**

- `packages/nimbus/src/components/toast/toast.stories.tsx` - 21 Button onClick →
  onPress changes

**Pattern Applied:**

```typescript
// BEFORE (wrong - causes double-firing):
<Button onClick={showToasts}>Show All Variants</Button>

// AFTER (correct - React Aria pattern):
<Button onPress={showToasts}>Show All Variants</Button>
```

**Note:** Action button callbacks (inside toast options) correctly remain as
`onClick`:

```typescript
// This is correct - action callbacks use onClick:
toast({
  title: "File deleted",
  action: {
    label: "Undo",
    onClick: mockActionHandler, // ✅ Correct
  },
});
```

---

## Results

### Before Fix

- 1/15 tests passing
- "Found multiple elements" errors on 14 tests
- Debug logs confirmed double function execution

### After Fix

- **10/15 tests passing** ✅
- Duplicate toast issue resolved
- Event handlers now fire only once

### Remaining Issues (5 tests)

These failures are **unrelated** to the double-toast issue and appear to be
pre-existing timing/interaction problems:

1. **Auto Dismiss** - Timing-related assertion failures
2. **Dismissal** - State cleanup between test steps
3. **Action Button** - `pointer-events: none` on action button during
   interaction
4. **Closable Control** - Element not found (timing)
5. **Integration** - Toast persistence assertion after 7s wait

**Common patterns in failures:**

- Elements with `pointer-events: none` (animation state)
- Timing issues with toast animations
- Cleanup between test steps

---

## Investigation Timeline

### Phase 1: Cleanup Strategy (Initial Hypothesis - WRONG)

**Hypothesis:** Toast state was leaking between test runs.

**Attempts:**

1. ✅ Added `clearToasts()` helper function
2. ✅ Called cleanup at start of all 15 play functions
3. ✅ Added `toast.reset()` method
4. ✅ Added DOM waiting with `waitFor()`
5. ✅ Added force cleanup fallback

**Result:** Cleanup WAS working, but duplicates still appeared during test
execution.

### Phase 2: Root Cause Discovery (CORRECT)

**Key Discovery Method:** Added debug logging to track function execution:

```typescript
const showToasts = () => {
  console.log("[DEBUG STORY] showToasts() called");
  toast.info({ title: "Info toast" });
  // ...
};
```

**Output revealed the problem:**

```
[DEBUG STORY] showToasts() called  // First call
[DEBUG STORY] showToasts() called  // Second call (unexpected!)
```

**Investigation steps:**

1. Added debug logs to story render functions
2. Added debug logs to toast creation handlers
3. Added debug logs to toast manager
4. Discovered `showToasts()` called twice per button click
5. Tested hypothesis: changed `onClick` to `onPress`
6. **Result:** Function now called only once ✅

---

## Lessons Learned

### What We Thought Was Wrong

- ❌ Storybook multi-context rendering
- ❌ Insufficient cleanup between tests
- ❌ Toast state not resetting properly
- ❌ Multiple ToastOutlet instances

### What Was Actually Wrong

- ✅ React Aria Button firing both onClick and onPress events
- ✅ Using wrong event handler prop for React Aria components
- ✅ Simple prop name mistake causing double execution

### Why Previous Approaches Failed

1. **Cleanup strategies**: Were working correctly, but problem occurred AFTER
   cleanup
2. **Multi-context theory**: Was a red herring based on seeing multiple DOM
   elements (which were from the two function calls, not separate contexts)
3. **Timing adjustments**: Couldn't help because the issue was synchronous
   double-firing

---

## Remaining Work

### High Priority: Fix 5 Failing Tests

The remaining test failures need investigation for:

1. **Animation timing** - Elements may need `waitFor()` with longer timeouts
2. **Pointer events** - Action buttons may need animation completion waits
3. **Cleanup improvements** - May need better state reset between test steps

### Recommended Approach

**For each failing test:**

1. Run test individually to isolate the issue
2. Check if element has `pointer-events: none` (animation in progress)
3. Add `await new Promise(resolve => setTimeout(resolve, 500))` after toast
   creation
4. Verify element is interactive before attempting clicks
5. Use `waitFor()` with appropriate timeout for assertions

**Example pattern for pointer-events issues:**

```typescript
await userEvent.click(button);
const actionButton = await body.findByRole("button", { name: /undo/i });

// Wait for animation to complete
await waitFor(
  () => {
    const styles = window.getComputedStyle(actionButton);
    expect(styles.pointerEvents).not.toBe("none");
  },
  { timeout: 2000 }
);

// Now safe to interact
await userEvent.click(actionButton);
```

---

## Best Practices Established

### For React Aria Components

✅ **Always use `onPress` for Button components:**

```typescript
<Button onPress={handleClick}>Click Me</Button>
```

❌ **Don't use `onClick` on React Aria Buttons:**

```typescript
<Button onClick={handleClick}>Click Me</Button>  // Will fire twice!
```

### For Toast Action Callbacks

✅ **Use `onClick` in toast action objects:**

```typescript
toast({
  title: "Action required",
  action: {
    label: "Undo",
    onClick: () => {}, // Correct for action callbacks
  },
});
```

---

## Testing Checklist

### Verified Working (10 tests)

- ✅ Variants - All 4 toast types render correctly
- ✅ ARIA Roles - Correct role/aria-live attributes
- ✅ Pause Behavior - Timer pauses on hover/focus
- ✅ Promise Pattern - Loading → success/error transitions
- ✅ Stacking And Queuing - Multiple toasts stack properly
- ✅ Multi Placement - Toasts in different regions
- ✅ Keyboard Navigation - Tab navigation works
- ✅ Reduced Motion - Toast renders (CSS behavior)
- ✅ Programmatic Update - toast.update() changes content
- ✅ Internationalization - Translated aria-labels

### Needs Fix (5 tests)

- ❌ Auto Dismiss - Timing assertions fail
- ❌ Dismissal - State cleanup issues
- ❌ Action Button - pointer-events: none error
- ❌ Closable Control - Element not found
- ❌ Integration - Toast persistence fails

---

## Quick Reference

### Run Tests

```bash
# All toast tests
pnpm test packages/nimbus/src/components/toast/toast.stories.tsx

# Specific test
pnpm test packages/nimbus/src/components/toast/toast.stories.tsx --testNamePattern="Variants"

# Verbose output
pnpm test packages/nimbus/src/components/toast/toast.stories.tsx --reporter=verbose
```

### Key Files

- **Stories:** `packages/nimbus/src/components/toast/toast.stories.tsx`
- **Manager:** `packages/nimbus/src/components/toast/toast.manager.ts`
- **Outlet:** `packages/nimbus/src/components/toast/toast.outlet.tsx`
- **Toasters:** `packages/nimbus/src/components/toast/toast.toasters.ts`

### Last Commits

- `1b1efa023` - fix(toast): change Button onClick to onPress (SOLUTION)
- `eda935ab3` - test(toast): improve story cleanup (previous attempt)

---

## Context for Future Sessions

### When Resuming This Work

1. **Current state:** 10/15 tests passing, onClick→onPress fix committed
2. **Next goal:** Fix remaining 5 test failures
3. **Approach:** Investigate animation timing and pointer-events issues
4. **Don't retry:** onClick/onPress changes (already fixed), cleanup strategies
   (already exhausted)

### Quick Start

```bash
# Check current status
pnpm test packages/nimbus/src/components/toast/toast.stories.tsx

# Should show: 10 passed, 5 failed
# If different, read git log for changes since this document
```

---

## Success Criteria

✅ **Phase 1 Complete:** Primary double-toast issue resolved

- Root cause identified (onClick vs onPress)
- Solution implemented and committed
- 10/15 tests passing (up from 1/15)

🎯 **Phase 2 Target:** Remaining test failures

- Fix animation timing issues
- Fix pointer-events handling
- Achieve 15/15 tests passing
- Document patterns for future toast tests

---

## Documentation Updates

This investigation revealed an important pattern for the component library:

**Add to component guidelines:**

> React Aria Button components MUST use `onPress` instead of `onClick` to avoid
> double event firing. The `onClick` prop is supported for compatibility but
> triggers both native and synthetic events.

**Test pattern to document:**

```typescript
// ✅ Correct pattern for React Aria Buttons in tests:
const button = canvas.getByRole("button", { name: /click me/i });
await userEvent.click(button);  // Works correctly with onPress

// ✅ Button component definition:
<Button onPress={handleClick}>Click Me</Button>
```
