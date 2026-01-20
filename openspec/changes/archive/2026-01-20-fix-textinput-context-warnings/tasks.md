# Implementation Tasks

## 1. Code Implementation

- [x] 1.1 Wrap TextInput return statement in
      `InputContext.Provider value={null}`
  - File: `packages/nimbus/src/components/text-input/text-input.tsx`
  - Location: Lines 118-140
  - Validation: No code changes to logic, only wrapper addition

## 2. Testing

- [x] 2.1 Build the nimbus package
  - Command: `pnpm --filter @commercetools/nimbus build`
  - Validation: Build completes without errors

- [x] 2.2 Run TextInput story tests
  - Command:
    `pnpm test packages/nimbus/src/components/text-input/text-input.stories.tsx`
  - Validation: No React DOM property warnings in test output
  - Validation: WithinReactAriaContext story passes all assertions
  - Validation: OverrideContextWithLocalProps story passes all assertions

- [x] 2.3 Run full test suite
  - Command: `pnpm test`
  - Validation: All tests pass
  - Validation: No regressions in other components

## 3. Verification

- [ ] 3.1 Verify WithinReactAriaContext story behavior
  - Manual: Start Storybook with `pnpm start:storybook`
  - Visual: Navigate to TextInput > WithinReactAriaContext story
  - Verify: Input is disabled (cannot type)
  - Verify: Input has aria-required="true" attribute
  - Verify: Input has readonly attribute
  - Verify: No console warnings appear

- [ ] 3.2 Verify OverrideContextWithLocalProps story behavior
  - Visual: Navigate to TextInput > OverrideContextWithLocalProps story
  - Verify: Input is NOT disabled (can type)
  - Verify: Input does NOT have aria-required attribute
  - Verify: Input does NOT have readonly attribute
  - Verify: Local props successfully override context

## 4. Documentation

- [x] 4.1 No documentation changes needed (internal fix only)
