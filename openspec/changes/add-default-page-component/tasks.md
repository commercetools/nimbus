## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/components/default-page/` directory with
      files: `default-page.tsx`, `default-page.types.ts`,
      `default-page.recipe.ts`, `default-page.slots.tsx`,
      `default-page.i18n.ts`, `default-page.messages.ts`, `components/index.ts`,
      and individual slot component files
- [x] 1.2 Register `defaultPageSlotRecipe` in `src/theme/slot-recipes/index.ts`
      as `nimbusDefaultPage`
- [x] 1.3 Export DefaultPage and types from
      `src/components/default-page/index.ts`
- [x] 1.4 Add `export * from "./default-page"` to `src/components/index.ts`

## 2. Implementation

- [x] 2.1 Implement types in `default-page.types.ts` (9 slot props per semantic
      HTML element, recipe variant props for stickyHeader/stickyFooter, main
      props with OmitInternalProps, BackLink requires `href`)
- [x] 2.2 Implement slot recipe in `default-page.recipe.ts` (9 slots: root,
      header, backLink, title, subtitle, actions, tabNav, content, footer; CSS
      grid root with `auto 1fr auto`; CSS grid header with `:has()` rules;
      stickyHeader/stickyFooter variants)
- [x] 2.3 Implement slot components in `default-page.slots.tsx`
      (createSlotRecipeContext with key "nimbusDefaultPage")
- [x] 2.4 Implement sub-components: Root (splitVariantProps), Header, BackLink
      (React Aria useLink + i18n default label), Title, Subtitle, Actions,
      TabNav, Content, Footer
- [x] 2.5 Implement `default-page.tsx` compound namespace object with JSDoc
- [x] 2.6 Implement i18n messages (`default-page.i18n.ts`,
      `default-page.messages.ts`, `intl/` locale files for de, en, es, fr-FR,
      pt-BR)

## 3. Testing

- [x] 3.1 Write Storybook stories with play functions covering: main page (no
      back link, no footer), detail page (with back link), form page (with
      footer), tabular page (with TabNav), sticky header/footer, all slot
      rendering
- [x] 3.2 Write consumer implementation tests (`default-page.docs.spec.tsx`)
      covering main page, detail page, form page, and tabular page patterns

## 4. Documentation

- [x] 4.1 Create developer documentation (`default-page.dev.mdx`) with import,
      basic usage, all page patterns, component parts table, MC migration guide,
      accessibility section, API reference
- [x] 4.2 Create documentation index page (`default-page.mdx`) with frontmatter,
      live examples, PropsTable, accessibility standards, predecessor section
- [x] 4.3 Create designer guidelines (`default-page.guidelines.mdx`) with best
      practices, when to use/not use, back link labeling, header/footer guidance

## 5. Validation

- [x] 5.1 TypeScript compiles without errors
- [x] 5.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [ ] 5.3 Storybook stories render all patterns with passing play functions
- [ ] 5.4 Consumer implementation tests pass
- [ ] 5.5 Lint passes (`pnpm lint`)
