# Change: Fix TextInput React DOM Property Warnings

## Why

When using `TextInput.Context.Provider` with React Aria props (`isDisabled`,
`isRequired`, `isReadOnly`), React DOM property warnings are produced because
these props leak through to the native `<input>` element instead of being
properly normalized to DOM attributes.

The root cause is a dual context consumption issue: TextInput manually reads and
normalizes context props via `useSlottedContext(InputContext)` and uses
`useTextField` to convert them to DOM-ready attributes, but the inner `<Input>`
component from react-aria-components also consumes `InputContext` internally via
`useContextProps` and spreads the raw React Aria props directly to the DOM,
bypassing TextInput's normalization.

## What Changes

- Wrap TextInput's returned JSX in `InputContext.Provider value={null}` to
  prevent the inner `<Input>` from consuming the outer context
- This allows TextInput to maintain full control over context normalization
  while preventing double consumption
- No API changes - the fix is internal implementation only

## Impact

- **Affected specs**: nimbus-text-input
- **Affected code**: `packages/nimbus/src/components/text-input/text-input.tsx`
  (lines 118-140)
- **Affected tests**:
  `packages/nimbus/src/components/text-input/text-input.stories.tsx`
  (WithinReactAriaContext and OverrideContextWithLocalProps stories)
- **Breaking changes**: None - this is a bug fix that restores intended behavior
- **Migration required**: None - consumers are unaffected
