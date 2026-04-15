## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/components/modal-page/` directory with
      files: `modal-page.tsx`, `modal-page.types.ts`, `modal-page.recipe.ts`,
      `modal-page.slots.tsx`, `modal-page.i18n.ts`, `modal-page.messages.ts`,
      `components/index.ts`, and individual slot component files
- [x] 1.2 Register `modalPageSlotRecipe` in `src/theme/slot-recipes/index.ts`
      as `nimbusModalPage`
- [x] 1.3 Export ModalPage and types from
      `src/components/modal-page/index.ts`
- [x] 1.4 Add `export * from "./modal-page"` to `src/components/index.ts`

## 2. Implementation

- [x] 2.1 Implement types in `modal-page.types.ts` (9 slot props, main
      props with OmitInternalProps, TopBar requires `previousPathLabel` and
      `currentPathLabel`, Root requires `isOpen` and `onClose`)
- [x] 2.2 Implement slot recipe in `modal-page.recipe.ts` (9 slots: root,
      topBar, header, title, subtitle, actions, tabNav, content, footer;
      structured layout with scrollable content; footer with built-in
      button spacing; header padding removal when TabNav present)
- [x] 2.3 Implement slot components in `modal-page.slots.tsx`
      (createSlotRecipeContext with key "nimbusModalPage")
- [x] 2.4 Implement sub-components: Root (controlled Drawer),
      TopBar (breadcrumb with back button, auto-focus), Header, Title
      (accessible dialog name), Subtitle, Actions, TabNav, Content, Footer
- [x] 2.5 Implement `modal-page.tsx` compound namespace object with JSDoc
- [x] 2.6 Implement i18n messages for back button label with locale support

## 3. Testing

- [x] 3.1 Write Storybook stories with play functions covering: info page,
      form page, tabular page, scrollable content, multi-column content,
      keyboard navigation, stacked modal pages, custom page width
- [x] 3.2 Write consumer implementation tests (`modal-page.docs.spec.tsx`)
      covering basic usage, form page, and multi-column layout patterns

## 4. Documentation

- [x] 4.1 Create developer documentation (`modal-page.dev.mdx`) with
      import, basic usage, closing patterns, multi-column content, header
      actions, tabular page, stacked pages, component requirements,
      accessibility section, API reference
- [x] 4.2 Create documentation index page (`modal-page.mdx`) with
      frontmatter, live examples for all page patterns, guidelines,
      accessibility standards
- [x] 4.3 Create accessibility documentation (`modal-page.a11y.mdx`) with
      live example and accessibility standards checklist

## 5. Validation

- [x] 5.1 TypeScript compiles without errors
- [x] 5.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [x] 5.3 Storybook stories render all patterns with passing play functions
- [x] 5.4 Consumer implementation tests pass
