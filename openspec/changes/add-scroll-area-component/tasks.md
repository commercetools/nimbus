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

## 5. Post-review fixes

- [x] 5.1 Add gutter to `always` variant so scrollbar does not overlay content
      (width calc for vertical, flex + marginBottom for horizontal)
- [x] 5.2 Add `zIndex: 1` to scrollbar base styles so it paints above sticky
      content inside the viewport
- [x] 5.3 Remove explicit `variant="always"` from stories that don't test it;
      default `hover` variant is used unless explicitly testing `always`
- [x] 5.4 Expand AlwaysVisible story to cover vertical, horizontal, and both
      axes with gutter assertions
- [x] 5.5 Add StickyContentInPanel story comparing always vs hover in a
      header/body/footer layout with a sticky row

## 6. Validation

- [x] 6.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [x] 6.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [x] 6.3 All Storybook story tests pass
      (`pnpm test:storybook:dev packages/nimbus/src/components/scroll-area/scroll-area.stories.tsx`)
- [x] 6.4 Lint passes
      (`pnpm lint -- packages/nimbus/src/components/scroll-area/`)
