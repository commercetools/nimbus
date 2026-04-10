## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/components/scroll-area/` directory with
      files: `scroll-area.tsx`, `scroll-area.types.ts`, `scroll-area.recipe.ts`,
      `scroll-area.stories.tsx`, `index.ts`
- [x] 1.2 Export `ScrollArea` and `ScrollAreaProps` from
      `src/components/scroll-area/index.ts`
- [x] 1.3 Add `export * from "./scroll-area"` to `src/components/index.ts`
- [x] 1.4 Register `scrollAreaSlotRecipe` as `scrollArea` in
      `src/theme/slot-recipes/index.ts`

## 2. Implementation

- [x] 2.1 Implement slot recipe in `scroll-area.recipe.ts` (Nimbus token colors,
      size variants, visibility variants, focus ring on root via `_focusWithin`)
- [x] 2.2 Implement `ScrollAreaParts` private component (reads
      `useScrollAreaContext()` for conditional `tabIndex`, renders Viewport,
      Content, Scrollbar(s), Corner based on `orientation`)
- [x] 2.3 Implement `ScrollArea` public component (extracts props,
      renders `ChakraScrollArea.Root` with forwarded props)

## 3. Stories

- [x] 3.1 Write Storybook stories with play functions covering: Default
      (overflowing, vertical scrollbar, keyboard focusable), NonOverflowing
      (short content), RoleRegion (role + aria-label), KeyboardFocusRing
      (Tab focus + ring), VerticalOnly, HorizontalOnly, BothAxes,
      AlwaysVisible, WithAriaLabelledBy, WithStyleProps, Sizes, SmokeTest

## 4. Documentation

- [x] 4.1 Create overview documentation (`scroll-area.mdx`)
- [x] 4.2 Create developer documentation (`scroll-area.dev.mdx`)
- [x] 4.3 Create accessibility documentation (`scroll-area.a11y.mdx`)

## 5. Validation

- [x] 5.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [x] 5.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [x] 5.3 All 12 Storybook story tests pass
      (`pnpm test:storybook:dev packages/nimbus/src/components/scroll-area/scroll-area.stories.tsx`)
- [x] 5.4 Lint passes
      (`pnpm lint -- packages/nimbus/src/components/scroll-area/`)
