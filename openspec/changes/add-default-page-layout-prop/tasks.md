## 1. Types

- [ ] 1.1 Update `default-page.types.ts`: Replace flat `DefaultPageRecipeVariantProps`
      with a discriminated union on `layout`. The `"constrained"` branch (and
      default) SHALL NOT include `stickyHeader`/`stickyFooter`. The `"flexible"`
      branch SHALL include both as optional booleans. Both branches extend
      OmitInternalProps, children, and ref.
- [ ] 1.2 Verify TypeScript produces errors for invalid combinations:
      `<Root stickyHeader />`, `<Root layout="constrained" stickyHeader />`.
      Verify valid combinations compile: `<Root />`,
      `<Root layout="constrained" />`, `<Root layout="flexible" stickyHeader />`.

## 2. Recipe

- [ ] 2.1 Update `default-page.recipe.ts`: Move `height: 100%` and content
      `overflow: auto` from `base` styles into a `layout: "constrained"` variant.
      Add `layout: "flexible"` variant with `height: auto` on root and no
      overflow on content. Set `defaultVariants: { layout: "constrained" }`.
- [ ] 2.2 Keep `stickyHeader` and `stickyFooter` boolean variants unchanged
      in the recipe (TypeScript types enforce valid combinations, not CSS).

## 3. Component

- [ ] 3.1 Update `default-page.root.tsx`: Ensure `layout` variant prop is
      passed through to the recipe via `splitVariantProps`.

## 4. Stories

- [ ] 4.1 Update existing constrained stories to use explicit
      `layout="constrained"` (or omit it to demonstrate default behavior).
- [ ] 4.2 Add `FlexibleLayout` story: `layout="flexible"` with enough content
      to demonstrate the whole page scrolling (no sticky).
- [ ] 4.3 Add `FlexibleStickyHeader` story: `layout="flexible"` with
      `stickyHeader` — demonstrates header pinned while page scrolls.
- [ ] 4.4 Add `FlexibleStickyHeaderAndFooter` story: `layout="flexible"` with
      `stickyHeader` and `stickyFooter` — demonstrates both pinned.
- [ ] 4.5 Update or remove `StickyHeaderAndFooter` story (currently uses
      constrained layout with sticky props, which is the invalid combination).

## 5. Documentation

- [ ] 5.1 Update `default-page.dev.mdx`: Add "Layout Modes" section explaining
      constrained vs flexible with code examples. Explain when to use each mode.
- [ ] 5.2 Update `default-page.docs.spec.tsx`: Add consumer implementation
      examples for both layout modes.
- [ ] 5.3 Update `default-page.mdx`: Add layout mode examples to live docs.

## 6. Validation

- [ ] 6.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [ ] 6.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [ ] 6.3 All Storybook stories render with passing play functions
- [ ] 6.4 Lint passes (`pnpm lint`)
