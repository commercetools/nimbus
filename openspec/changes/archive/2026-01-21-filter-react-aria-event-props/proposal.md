# Change: Filter React Aria Event Props in Button Component

## Why

The Button component's `shouldForwardProp` function currently only filters
`onPress`, allowing other React Aria-specific event handlers like
`onFocusChange`, `onHoverStart`, `onPressChange`, and others to leak through to
the DOM. This causes "Unknown event handler property" warnings when the Button
is used within Calendar/RangeCalendar components with multi-month displays,
where React Aria's `ButtonContext` slots pass custom event handlers that are not
valid DOM events.

These warnings indicate:

- Console noise in development and tests (developer experience issue)
- Props leaking to DOM elements (violates separation of concerns)
- Potential confusion when debugging unrelated issues

## What Changes

- Update `ButtonRoot` component's `shouldForwardProp` to filter ALL React
  Aria-specific event handlers
- Add comprehensive list of React Aria event props that should never reach the
  DOM
- Add unit test to verify React Aria event props are properly filtered
- Verify existing Calendar and RangeCalendar tests pass without warnings

## Impact

- **Affected specs**: `nimbus-button`
- **Affected code**:
  - `packages/nimbus/src/components/button/button.slots.tsx` (modify filtering
    logic)
  - `packages/nimbus/src/components/button/button.spec.tsx` (add test)
  - `packages/nimbus/src/components/calendar/calendar.docs.spec.tsx`
    (verification)
  - `packages/nimbus/src/components/range-calendar/range-calendar.docs.spec.tsx`
    (verification)
- **Breaking**: No - this is a bug fix that prevents props from reaching the DOM
- **Dependencies**: None - isolated change to Button component
