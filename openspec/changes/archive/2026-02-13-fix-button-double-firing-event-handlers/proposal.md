# Change: Fix Button double-firing event handlers and align API with React Aria

## Why

Button event handlers (`onClick`, `onPress`, `onFocus`, `onBlur`) fired twice
per interaction because `contextProps` was merged into both `useButton()` and a
final `mergeProps()` call. Fixing this required replacing `mergeProps` with JSX
spread ordering and fully delegating behavior to `useButton`. This surfaced
that the component was manually overriding `aria-disabled` and `data-disabled`
instead of letting the hook handle them, and that the public API still centered
native HTML props rather than their React Aria equivalents.

## What Changes

- Replace `mergeProps` with JSX spread ordering so `useButton`'s processed
  handlers overwrite raw ones — prevents double-firing
- Delegate disabled-state attributes entirely to `useButton` (removes manual
  `aria-disabled` and `data-disabled` overrides)
- Expose `useButton`'s `isPressed` as `data-pressed` attribute for CSS styling
- Deprecate native HTML props (`onClick`, `disabled`, `onMouseEnter`,
  `onMouseLeave`, `aria-disabled`, `tabIndex`) via `@deprecated` JSDoc,
  pointing to React Aria equivalents

## Impact

- **Affected specs**: `nimbus-button`
- **Affected code**:
  - `button.tsx` — spread ordering, `data-pressed`, remove manual overrides
  - `button.types.ts` — `NativePropsWithAriaEquivalents` type with deprecations
  - `button.stories.tsx` — regression stories
  - `button.docs.spec.tsx` — consumer implementation tests
- **Breaking**: No — deprecated props still work
- **PR**: https://github.com/commercetools/nimbus/pull/1061
