## 1. Scaffold

- [ ] 1.1 Create `packages/nimbus/src/components/main-page/` directory with
      files: `main-page.tsx`, `main-page.types.ts`, `main-page.recipe.ts`,
      `main-page.slots.tsx`, `main-page.stories.tsx`, `main-page.docs.spec.tsx`,
      `main-page.dev.mdx`, `main-page.mdx`, `main-page.guidelines.mdx`,
      `components/index.ts`, `components/main-page.root.tsx`,
      `components/main-page.header.tsx`, `components/main-page.title.tsx`,
      `components/main-page.actions.tsx`, `components/main-page.content.tsx`,
      `components/main-page.footer.tsx`, `index.ts`
- [ ] 1.2 Register `mainPageRecipe` in `src/theme/slot-recipes/index.ts` as
      `nimbusMainPage`
- [ ] 1.3 Export MainPage and types from `src/components/main-page/index.ts`
- [ ] 1.4 Add `export * from "./main-page"` to `src/components/index.ts`

## 2. Failing Tests (TDD)

- [ ] 2.1 Write Storybook stories with play functions covering: info page
      (title + actions + content, no footer), form page (with footer containing
      buttons), tabular page (with Tabs inside content), title rendering, actions
      area rendering, footer presence/absence, data-testid forwarding
- [ ] 2.2 Write consumer implementation tests (`main-page.docs.spec.tsx`)
      covering info page, form page, and tabular page patterns

## 3. Implementation

- [ ] 3.1 Implement types in `main-page.types.ts` (MainPageRecipeProps — no
      variants needed for root; slot props for all 6 slots; main props extending
      OmitInternalProps; MainPageContentProps includes PageContent variant/columns)
- [ ] 3.2 Implement slot recipe in `main-page.recipe.ts` (slots: root, header,
      title, actions, content, footer; root uses CSS grid
      `grid-template-rows: auto 1fr auto`; header uses flex
      `justify-content: space-between`; content is scrollable; footer has
      top border)
- [ ] 3.3 Implement slot components in `main-page.slots.tsx`
      (createSlotRecipeContext with key "nimbusMainPage", withProvider for Root,
      withContext for Header/Title/Actions/Content/Footer)
- [ ] 3.4 Implement `components/main-page.root.tsx` (splitVariantProps,
      extractStyleProps, grid container, forward props)
- [ ] 3.5 Implement `components/main-page.header.tsx` (extractStyleProps, flex
      layout)
- [ ] 3.6 Implement `components/main-page.title.tsx` (extractStyleProps, styled
      title container)
- [ ] 3.7 Implement `components/main-page.actions.tsx` (extractStyleProps, flex
      row with gap)
- [ ] 3.8 Implement `components/main-page.content.tsx` (imports PageContent.Root
      from page-content component via direct file import, forwards variant and
      columns props, renders children inside PageContent.Root)
- [ ] 3.9 Implement `components/main-page.footer.tsx` (extractStyleProps, footer
      container with top border)
- [ ] 3.10 Implement `main-page.tsx` namespace object (Root first, then Header,
      Title, Actions, Content, Footer; underscore exports for individual parts)

## 4. Documentation

- [ ] 4.1 Create component overview (`main-page.mdx`) with live examples for
      all three page patterns (info, form, tabular) and variables section
- [ ] 4.2 Create developer documentation (`main-page.dev.mdx`) with getting
      started, usage examples (info, form, tabular), API reference, consumer
      tests, and MC migration guide
- [ ] 4.3 Create designer guidelines (`main-page.guidelines.mdx`) with best
      practices, when to use/not use, page type selection, do/don't examples

## 5. Validation

- [ ] 5.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [ ] 5.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [ ] 5.3 Storybook stories render all patterns with passing play functions
- [ ] 5.4 Consumer implementation tests pass
- [ ] 5.5 Lint passes (`pnpm lint`)
