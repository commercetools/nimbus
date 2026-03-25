## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/hooks/use-scrollable-region/` directory
      with files: `use-scrollable-region.ts`, `use-scrollable-region.types.ts`,
      `index.ts`
- [x] 1.2 Create `packages/nimbus/src/components/scrollable-region/` directory
      with files: `scrollable-region.tsx`, `scrollable-region.types.ts`,
      `scrollable-region.stories.tsx`, `index.ts`
- [x] 1.3 Export hook and types from internal barrel
      `src/hooks/use-scrollable-region/index.ts` (internal only, not re-exported
      from `src/hooks/index.ts`)
- [x] 1.4 Export `ScrollableRegion` and its types from
      `src/components/scrollable-region/index.ts`
- [x] 1.5 Add `export * from "./scrollable-region"` to
      `src/components/index.ts`

## 2. Failing Tests (TDD)

- [x] 2.1 Write Storybook stories with play functions covering: base
      non-overflowing state (role and aria-label present, no tabIndex),
      overflowing state (tabIndex present), keyboard focus ring visibility,
      `role="region"` renders `<section>` by default, `role="group"` renders
      `<div>` with `role="group"`, scrollable axis variants

## 3. Implementation

- [x] 3.1 Implement types in `use-scrollable-region.types.ts`
      (`UseScrollableRegionOptions` with `role`, `aria-label`,
      `aria-labelledby`, `debounceMs`, `scrollable`;
      `UseScrollableRegionReturn` with `ref`, `isOverflowing`,
      `containerProps`)
- [x] 3.2 Implement `useScrollableRegion` hook in `use-scrollable-region.ts`
      (ResizeObserver, debounced overflow check, useFocusRing, always-applied
      role/aria, conditional tabIndex, dev-mode warning for role="region",
      cleanup)
- [x] 3.3 Implement types in `scrollable-region.types.ts`
      (`ScrollableRegionProps` based on `BoxProps` + hook options, with `as`
      prop for polymorphic rendering)
- [x] 3.4 Implement `ScrollableRegion` component in `scrollable-region.tsx`
      (wrapper calling the hook, polymorphic rendering via `as` prop, ref
      merging, Box style props forwarding)

## 4. Documentation

- [x] 4.1 Create developer documentation (`scrollable-region.dev.mdx`)
- [x] 4.2 Create designer documentation (`scrollable-region.guidelines.mdx`)
- [x] 4.3 Create accessibility documentation (`scrollable-region.a11y.mdx`)
- [x] 4.4 Create overview documentation (`scrollable-region.mdx`)

## 5. Validation

- [x] 5.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [x] 5.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [x] 5.3 Storybook story tests pass
- [x] 5.4 Lint passes (`pnpm lint`)
