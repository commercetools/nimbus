# Implementation Tasks

## 1. Button Core Fix

- [x] 1.1 Remove `mergeProps` — replace with JSX spread ordering
      (`{...contextProps} {...buttonProps}`) so `useButton`'s processed handlers
      overwrite raw context handlers
- [x] 1.2 Expose `isPressed` from `useButton` as `data-pressed` attribute
- [x] 1.3 Remove manual `aria-disabled` override — `useButton` manages this
      per element type
- [x] 1.4 Remove redundant `data-disabled` attribute

## 2. Deprecate Native HTML Props

- [x] 2.1 Add `NativePropsWithAriaEquivalents` type with `@deprecated` JSDoc
      for `onClick`, `onMouseEnter`, `onMouseLeave`, `disabled`,
      `aria-disabled`, `tabIndex`
- [x] 2.2 Integrate deprecated type into `ButtonProps`

## 3. Tests

- [x] 3.1 Add `EventHandlersFireOnce` regression story
- [x] 3.2 Add `DOMPropFiltering` story
- [x] 3.3 Add `DisabledAsLink` story
- [x] 3.4 Create `button.docs.spec.tsx` consumer implementation tests

## 4. Validation

- [x] 4.1 All Button stories pass
- [x] 4.2 TypeScript clean
