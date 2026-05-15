## 1. Scaffold

- [ ] 1.1 Create `packages/nimbus/src/components/page-content/` directory with
      files: `page-content.tsx`, `page-content.types.ts`, `page-content.recipe.ts`,
      `page-content.slots.tsx`, `page-content.stories.tsx`, `page-content.docs.spec.tsx`,
      `page-content.dev.mdx`, `page-content.i18n.ts`, `components/index.ts`,
      `components/page-content.root.tsx`, `components/page-content.column.tsx`,
      `index.ts`
- [x] 1.2 Register `pageContentRecipe` in `src/theme/slot-recipes/index.ts` as
      `nimbusPageContent`
- [x] 1.3 Export PageContent and types from `src/components/page-content/index.ts`
- [x] 1.4 Add `export * from "./page-content"` to `src/components/index.ts`

## 2. Failing Tests (TDD)

- [x] 2.1 Write Storybook stories with play functions covering: all 3 width
      variants (wide/narrow/full), all 3 column layouts (1, 1/1, 2/1), sticky
      sidebar, default gap, custom gap override, single-column without Column
      wrappers, data-testid forwarding, responsive collapse
- [x] 2.2 Write consumer implementation tests (`page-content.docs.spec.tsx`)

## 3. Implementation

- [x] 3.1 Implement types in `page-content.types.ts` (PageContentRecipeProps,
      slot props, main props with sticky typed as
      `boolean | ConditionalValue<UtilityValues["top"]>`)
- [x] 3.2 Implement slot recipe in `page-content.recipe.ts` (slots: root,
      column; variants: variant wide/narrow/full, columns 1/1-1/2-1; base gap
      "800"; responsive mdDown collapse)
- [x] 3.3 Implement slot components in `page-content.slots.tsx`
      (createSlotRecipeContext with key "nimbusPageContent", withProvider for
      Root, withContext for Column)
- [x] 3.4 Implement `components/page-content.root.tsx` (splitVariantProps,
      extractStyleProps, CSS grid centering, forward props)
- [x] 3.5 Implement `components/page-content.column.tsx` (extractStyleProps,
      apply sticky positioning when sticky prop is set)
- [x] 3.6 Implement `page-content.tsx` namespace object (Root first, Column
      second, underscore exports)

## 4. Documentation

- [x] 4.1 Create developer documentation (`page-content.dev.mdx`)
- [ ] 4.2 Create i18n file (`page-content.i18n.ts`) — minimal, no user-facing
      text

## 5. Validation

- [ ] 5.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [ ] 5.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [ ] 5.3 Storybook stories render all variants
- [ ] 5.4 Consumer implementation tests pass
- [ ] 5.5 Full test suite passes
