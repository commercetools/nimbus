# Button useButton Hook Refactoring Log

## Goal

Ensure every button state and functionality is properly channeled through the
`useButton` hook from React Aria, matching the architectural patterns used by
other Nimbus components (switch, text-input, etc.).

## Issues Identified

| #   | Issue                                                                  | Status                |
| --- | ---------------------------------------------------------------------- | --------------------- |
| 1   | `isPressed` not destructured from `useButton`                          | Already fixed by user |
| 2   | `aria-disabled` manually set, bypassing `useButton` output             | Done                  |
| 3   | `data-disabled` derived from raw props, not hook output                | Done (no change)      |
| 4   | `contextProps` spread raw onto DOM (includes React Aria logical props) | Done                  |
| 5   | `shouldForwardProp` blocklist in slots redundant after cleanup         | Done                  |

## Changes Log

### Step 2: Remove manual `aria-disabled` override

**Before:**

```tsx
<ButtonRoot
  {...contextProps}
  {...componentProps}
  aria-disabled={contextProps.isDisabled || undefined}
  data-disabled={contextProps.isDisabled || undefined}
>
```

**Problem:** `useButton` already handles `aria-disabled`/`disabled` based on
element type. The manual override:

- Always sets `aria-disabled` regardless of element type
- On native `<button>`, causes BOTH `disabled` AND `aria-disabled` to be present
- Bypasses the hook's decision logic

**Change:** Removed manual `aria-disabled`. Now `useButton` decides:

- Native `<button>`: sets `disabled` attribute (element not focusable)
- Non-native elements (`as="a"`): sets `aria-disabled` (remains in tab order)

**Obstacles:**

- Tests expected `aria-disabled="true"` on native buttons. Updated
  `button.spec.tsx` to use `toBeDisabled()` for native buttons and added a
  separate test for non-native elements verifying `aria-disabled`.
- Story `WithinReactAriaContext` also needed updating (same assertion).

---

### Step 3: Derive `data-disabled` from hook-processed state

**Analysis:** `data-disabled={contextProps.isDisabled || undefined}` uses
`contextProps.isDisabled` which is the resolved value after `useContextProps`
merges context + user props. This is the correct source — same pattern as
switch's `props.isDisabled`.

**Change:** No code change needed. The derivation was already correct. The
`isDisabled` value is now explicitly destructured from `contextProps` in the
Step 4 cleanup, making the data flow more visible.

---

### Step 4: Stop spreading raw `contextProps` onto ButtonRoot

**Before:**

```tsx
const componentProps = mergeProps(buttonProps, { as, asChild, slot });

<ButtonRoot
  ref={contextRef}
  {...contextProps}      // ALL props including React Aria logical props
  {...componentProps}    // useButton DOM output + as/asChild/slot
>
```

**After:**

```tsx
const {
  onPress, onPressStart, onPressEnd, onPressChange, onPressUp,
  onFocusChange, isDisabled, preventFocusOnPress, excludeFromTabOrder,
  slot,
  ...passthroughProps
} = contextProps;

<ButtonRoot
  ref={contextRef}
  {...passthroughProps}  // recipe, style, data-*, className, DOM events
  {...buttonProps}       // hook's DOM output (overrides DOM events via spread order)
  as={as}
  asChild={asChild}
  slot={contextProps.slot || undefined}
  data-disabled={isDisabled || undefined}
  data-pressed={isPressed || undefined}
>
```

**Key decisions:**

1. **JSX spread order instead of `mergeProps`**: Using
   `{...passthroughProps} {...buttonProps}` instead of
   `mergeProps(passthroughProps, buttonProps)`. `mergeProps` chains event
   handlers which would cause double-firing since `useButton` already wraps the
   original handlers internally. JSX spread override (`Object.assign` semantics)
   ensures only the hook's wrapped handlers execute.

2. **Which props to destructure out**: Only React Aria logical props that have
   NO DOM equivalent: `onPress*`, `onFocusChange`, `isDisabled`,
   `preventFocusOnPress`, `excludeFromTabOrder`. Standard DOM events (`onClick`,
   `onFocus`, `onKeyDown`) stay in `passthroughProps` and are properly
   overridden by `buttonProps` via spread order.

3. **`mergeProps` import removed**: No longer needed since we use JSX spread
   order for all prop merging.

**Obstacles:**

- ESLint `@typescript-eslint/no-unused-vars` flagged the
  destructured-and-discarded React Aria props. Used
  `eslint-disable`/`eslint-enable` block comments, consistent with existing
  codebase pattern (see `steps.root.tsx`).

---

### Step 5: Simplify `shouldForwardProp` in slots

**Before:** Explicit `REACT_ARIA_EVENT_PROPS` blocklist (12 entries) + emotion
`shouldForwardProp` + Chakra system prop check.

**After:** Just emotion `shouldForwardProp` + Chakra system prop check.

**Rationale:** All React Aria event props (`onPress`, `onPressStart`, etc.) are
already rejected by `@emotion/is-prop-valid` since they're not standard DOM
events. The explicit blocklist was fully redundant. The slots file now serves as
a defense-in-depth layer rather than the primary filter.

**Obstacles:** None. All tests pass including the `DOM prop filtering` test that
provides `onFocusChange`, `onHoverStart`, `onPressChange` via ButtonContext.

### Downstream: localized-field stories

**Problem:** The `Disabled` story in `localized-field.stories.tsx` had 4
assertions checking `aria-disabled="true"` on expand buttons (native `<button>`
elements). After Step 2, `useButton` sets `disabled` instead of `aria-disabled`
on native buttons, causing the story to fail.

**Change:** Replaced all 4 `.toHaveAttribute("aria-disabled", "true")` with
`.toBeDisabled()` (lines 339, 361, 380, 402).

---

## Test Results

All tests pass after refactoring:

- **Unit tests**: 14/14 passed (button.spec.tsx)
- **Storybook tests**: 13/13 passed (button.stories.tsx)
- **Collapsible-motion**: 23/23 passed (uses ButtonContext.Provider)
- **Localized-field**: 12/12 passed (localized-field.stories.tsx)
- **TypeScript**: Clean (no errors)
- **ESLint**: Clean (no errors)
