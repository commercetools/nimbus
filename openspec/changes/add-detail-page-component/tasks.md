## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/components/detail-page/` directory with
      files: `detail-page.tsx`, `detail-page.types.ts`, `detail-page.recipe.ts`,
      `detail-page.slots.tsx`, `detail-page.stories.tsx`, `detail-page.docs.spec.tsx`,
      `detail-page.dev.mdx`, `detail-page.mdx`, `detail-page.i18n.ts`,
      `detail-page.messages.ts`, `components/index.ts`, and individual slot
      component files
- [x] 1.2 Register `detailPageSlotRecipe` in `src/theme/slot-recipes/index.ts`
      as `nimbusDetailPage`
- [x] 1.3 Export DetailPage and types from `src/components/detail-page/index.ts`
- [x] 1.4 Add `export * from "./detail-page"` to `src/components/index.ts`

## 2. Implementation

- [x] 2.1 Implement types in `detail-page.types.ts` (slot props per semantic
      HTML element, main props with OmitInternalProps, BackLink requires `href`)
- [x] 2.2 Implement slot recipe in `detail-page.recipe.ts` (8 slots: root,
      header, backLink, title, subtitle, headerActions, content, footer; CSS
      grid header with named areas; flex column root)
- [x] 2.3 Implement slot components in `detail-page.slots.tsx`
      (createSlotRecipeContext with key "nimbusDetailPage")
- [x] 2.4 Implement sub-components: Root (splitVariantProps), Header, BackLink
      (React Aria useLink + i18n default label), Title, Subtitle, HeaderActions,
      Content, Footer
- [x] 2.5 Implement `detail-page.tsx` compound namespace object with JSDoc
- [x] 2.6 Implement i18n messages (`detail-page.i18n.ts`, `detail-page.messages.ts`,
      `intl/` locale files for de, en, es, fr-FR, pt-BR)

## 3. Testing

- [x] 3.1 Write Storybook stories with play functions covering: InfoDetailPage
      (no footer), FormDetailPage (with footer), WithHeaderActions (grid layout),
      TabularDetailPage (Tabs inside Content)
- [x] 3.2 Write consumer implementation tests (`detail-page.docs.spec.tsx`)
      covering all four usage patterns

## 4. Documentation

- [x] 4.1 Create developer documentation (`detail-page.dev.mdx`) with import,
      basic usage, all four patterns, component parts table, accessibility
      section, API reference
- [x] 4.2 Create documentation index page (`detail-page.mdx`) with frontmatter,
      live examples, PropsTable, accessibility standards, predecessor section

## 5. Validation

- [x] 5.1 TypeScript compiles without errors
- [x] 5.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [x] 5.3 All 4 Storybook stories pass with play functions
- [x] 5.4 All 4 consumer implementation tests pass
- [x] 5.5 Lint passes (`pnpm lint`)
