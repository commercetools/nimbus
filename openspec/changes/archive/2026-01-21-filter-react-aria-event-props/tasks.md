# Implementation Tasks

## 1. Implementation

- [x] 1.1 Update `button.slots.tsx` to add `REACT_ARIA_EVENT_PROPS` constant
      listing all React Aria event handlers
- [x] 1.2 Create `isReactAriaEventProp` helper function to check if a prop
      matches any React Aria event pattern
- [x] 1.3 Update `shouldForwardProp` logic in `ButtonRoot` to filter React Aria
      event props using the new helper
- [x] 1.4 Add comprehensive JSDoc comments explaining why these props must be
      filtered

## 2. Testing

- [x] 2.1 Add unit test in `button.spec.tsx` that verifies React Aria event
      props are filtered and do not cause warnings
- [x] 2.2 Run Calendar tests to verify no "Unknown event handler property"
      warnings
- [x] 2.3 Run RangeCalendar tests to verify no "Unknown event handler property"
      warnings
- [x] 2.4 Run full Button test suite to ensure no regressions

## 3. Validation

- [x] 3.1 Build the nimbus package
- [x] 3.2 Run all Storybook tests with no warnings
- [x] 3.3 Verify console is clean when using Calendar/RangeCalendar with
      multi-month display
- [x] 3.4 Confirm all existing Button functionality still works (all tests pass)
