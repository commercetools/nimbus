# Implementation Tasks

## 1. Code Changes

- [x] 1.1 Update regex in `use-inline-svg.ts` to handle colon-separated
      namespace prefixes
- [x] 1.2 Verify existing kebab-case conversion still works correctly

## 2. Testing

- [x] 2.1 Build the nimbus package (`pnpm --filter @commercetools/nimbus build`)
- [x] 2.2 Run existing Storybook tests to verify no regressions
      (`pnpm test:storybook`)
- [x] 2.3 Verify `SecurityTest` story no longer produces console warnings for
      `xmlns:xlink`
- [x] 2.4 Test with SVG containing various namespace attributes (`xmlns:xlink`,
      `xml:lang`, `xlink:href`)

## 3. Validation

- [x] 3.1 Confirm no React DOM property warnings in browser console
- [x] 3.2 Verify all existing tests pass
- [x] 3.3 Verify TypeScript compilation succeeds
