## 1. Scaffolding and Barrel Exports

- [x] 1.1 Create directory `packages/nimbus/src/patterns/pages/public-page-layout/`
- [x] 1.2 Create `index.ts` barrel export for the component
- [x] 1.3 Create `packages/nimbus/src/patterns/pages/index.ts` category barrel export
- [x] 1.4 Update `packages/nimbus/src/patterns/index.ts` to re-export pages

## 2. Types

- [x] 2.1 Create `public-page-layout.types.ts` with `PublicPageLayoutProps` (logo, welcomeMessage, legalMessage, contentWidth, children, aria-label) — all props with JSDoc

## 3. i18n

- [x] 3.1 Create `public-page-layout.i18n.ts` with messages: `ariaLabel` ("Public page") — welcomeMessage removed (no default, matching original MC component)
- [x] 3.2 Run `pnpm extract-intl` to generate compiled messages and intl files

## 4. Component Implementation

- [x] 4.1 Create `public-page-layout.tsx` composing Flex, Stack, Heading, Text with i18n defaults, data-slot attributes, contentWidth max-width mapping, and `<main>` landmark with aria-label
- [x] 4.2 Verify `pnpm --filter @commercetools/nimbus typecheck` passes

## 5. Stories

- [x] 5.1 Create `public-page-layout.stories.tsx` with stories: Default, WideContent, CustomLogo, WithLegalMessage, MinimalLayout, CustomAriaLabel, WithBackgroundStyle
- [x] 5.2 Add play functions verifying layout structure, data-slot attributes, content rendering, and landmark accessibility
- [x] 5.3 Verify `pnpm test:dev` passes for the stories file

## 6. Documentation

- [x] 6.1 Create `public-page-layout.mdx` with frontmatter (menu: [Patterns, Pages, Public page layout], related-components: [Flex, Stack, Heading, Text]) and overview/anatomy/usage sections
- [x] 6.2 Create `public-page-layout.dev.mdx` with import example, basic usage, usage examples, escape hatch section, and API reference
- [x] 6.3 Create `public-page-layout.docs.spec.tsx` with consumer implementation test examples (login form layout, registration layout with legal message)

## 7. Verification

- [x] 7.1 Verify `pnpm --filter @commercetools/nimbus build` succeeds
- [x] 7.2 Verify `pnpm --filter @commercetools/nimbus typecheck` passes
- [x] 7.3 Verify `pnpm test:dev` passes for stories and docs.spec files
