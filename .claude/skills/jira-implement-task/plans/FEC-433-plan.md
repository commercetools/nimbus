# FEC-433: Create PublicPageLayout Pattern

## Summary

Create a new `PublicPageLayout` pattern at
`packages/nimbus/src/patterns/pages/public-page-layout/` providing a pre-built
layout for public-facing pages (login, registration, etc.) with logo, welcome
message, content area, and legal footer.

## File Set

1. `public-page-layout.types.ts` — TypeScript types
2. `public-page-layout.tsx` — Main component
3. `public-page-layout.stories.tsx` — Storybook stories with play functions
4. `public-page-layout.mdx` — Designer documentation (frontmatter + overview)
5. `public-page-layout.dev.mdx` — Developer documentation
6. `public-page-layout.docs.spec.tsx` — Consumer implementation tests
7. `public-page-layout.i18n.ts` — i18n source messages
8. `index.ts` — Barrel export
9. `pages/index.ts` — Category barrel export
10. Update `patterns/index.ts` — Add pages export

## Tasks

### Task 1: Types + Component + Barrel Exports

**Files:**

- `public-page-layout.types.ts`
- `public-page-layout.tsx`
- `index.ts` (component barrel)
- `pages/index.ts` (category barrel)
- Update `patterns/index.ts`

**Props (flat API):**

- `logo` — ReactNode for brand logo
- `welcomeMessage` — string | ReactNode for welcome heading
- `legalMessage` — ReactNode for legal/footer content
- `contentWidth` — "normal" | "wide" (default "normal")
- `children` — main content (e.g., login form)

**Composes:** Flex, Stack, Heading, Text (via `@/components/...` direct imports)

**Test:** `pnpm --filter @commercetools/nimbus typecheck` passes

### Task 2: Stories with Play Functions

**File:** `public-page-layout.stories.tsx`

**Stories to cover:**

- `Default` — default layout with logo, welcome message, children
- `WideContent` — with contentWidth="wide"
- `CustomLogo` — custom ReactNode logo
- `WithLegalMessage` — with legal/footer content
- `MinimalLayout` — only required children prop

**Play functions verify:** layout structure, content rendering, data-slot attrs

### Task 3: i18n Source Messages

**File:** `public-page-layout.i18n.ts`

Messages needed:

- `welcomeMessage` — default welcome heading text
- `ariaLabel` — accessible label for the layout landmark

Then run `pnpm extract-intl` to generate compiled messages + intl files.

### Task 4: Documentation

**Files:**

- `public-page-layout.mdx` — frontmatter + overview
- `public-page-layout.dev.mdx` — developer docs
- `public-page-layout.docs.spec.tsx` — consumer tests

### Task 5: Verification

- `pnpm --filter @commercetools/nimbus build` succeeds
- `pnpm --filter @commercetools/nimbus typecheck` passes
- `pnpm test:dev <stories file>` passes
- `pnpm test:dev <docs.spec file>` passes
