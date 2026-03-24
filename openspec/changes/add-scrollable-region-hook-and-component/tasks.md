## 1. Scaffold

- [ ] 1.1 Create `packages/nimbus/src/hooks/use-scrollable-region/` directory
      with files: `use-scrollable-region.ts`, `use-scrollable-region.types.ts`,
      `index.ts`
- [ ] 1.2 Create `packages/nimbus/src/components/scrollable-region/` directory
      with files: `scrollable-region.tsx`, `scrollable-region.types.ts`,
      `scrollable-region.stories.tsx`, `index.ts`
- [ ] 1.3 Export `useScrollableRegion` and its types from
      `src/hooks/use-scrollable-region/index.ts`
- [ ] 1.4 Add `export * from "./use-scrollable-region"` to `src/hooks/index.ts`
- [ ] 1.5 Export `ScrollableRegion` and its types from
      `src/components/scrollable-region/index.ts`
- [ ] 1.6 Add `export * from "./scrollable-region"` to
      `src/components/index.ts`

## 2. Failing Tests (TDD)

- [ ] 2.1 Write Storybook stories with play functions covering: base
      non-overflowing state (no tabIndex, no role), overflowing state (tabIndex
      present, role applied, aria-label set), keyboard focus ring visibility,
      role="region" renders `<section>`, role="group" renders `<div>` with
      `role="group"`, overflow state change on resize
- [ ] 2.2 Write unit tests for `useScrollableRegion` covering: default options,
      ref callback creates observer, cleanup on unmount, dev-mode warning when
      overflowing without label

## 3. Implementation

- [ ] 3.1 Implement types in `use-scrollable-region.types.ts`
      (`UseScrollableRegionOptions` with `role`, `aria-label`,
      `aria-labelledby`, `debounceMs`, `overflow`;
      `UseScrollableRegionReturn` with `ref`, `isOverflowing`,
      `containerProps`)
- [ ] 3.2 Implement `useScrollableRegion` hook in `use-scrollable-region.ts`
      (ResizeObserver, debounced overflow check, useFocusRing, conditional
      containerProps, dev-mode warning, cleanup)
- [ ] 3.3 Implement types in `scrollable-region.types.ts`
      (`ScrollableRegionProps` extending hook options + HTML attributes +
      children)
- [ ] 3.4 Implement `ScrollableRegion` component in `scrollable-region.tsx`
      (forwardRef wrapper calling the hook, element switching, ref merging)

## 4. Documentation

- [ ] 4.1 Create developer documentation (`scrollable-region.dev.mdx`)
- [ ] 4.2 Create consumer implementation tests
      (`scrollable-region.docs.spec.tsx`)
- [ ] 4.3 Create designer documentation (`scrollable-region.guidelines.mdx`)

## 5. Validation

- [ ] 5.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [ ] 5.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [ ] 5.3 Storybook story tests pass
      (`pnpm test:dev packages/nimbus/src/components/scrollable-region/scrollable-region.stories.tsx`)
- [ ] 5.4 Hook unit tests pass
      (`pnpm test:dev packages/nimbus/src/hooks/use-scrollable-region/`)
- [ ] 5.5 Lint passes (`pnpm lint`)
- [ ] 5.6 Full test suite passes (`pnpm test:dev`)
