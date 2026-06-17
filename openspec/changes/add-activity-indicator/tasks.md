## 1. Scaffold component structure

- [ ] 1.1 Create `packages/nimbus/src/components/activity-indicator/` directory with shell files: `activity-indicator.tsx`, `activity-indicator.types.ts`, `activity-indicator.recipe.ts`, `activity-indicator.slots.tsx`, `activity-indicator.stories.tsx`, `activity-indicator.i18n.ts`, `index.ts`
- [ ] 1.2 Add barrel export (`index.ts`) re-exporting the component and its public types
- [ ] 1.3 Export `ActivityIndicator` and `ActivityIndicatorProps` from the `@commercetools/nimbus` package barrel
- [ ] 1.4 Register `activityIndicator` recipe in `packages/nimbus/src/theme/recipes/index.ts` (without this there are no runtime styles)

## 2. Failing Storybook tests (TDD-first)

- [ ] 2.1 Write a `Base` story asserting the root is a `<span>` containing exactly three `<span>` dots
- [ ] 2.2 Write a story asserting decorative default: no `aria-label` → root has `aria-hidden="true"` and no `role`
- [ ] 2.3 Write a story asserting labeled mode: with `aria-label` → root has `role="status"`, `aria-live="polite"`, and matching accessible name (and is not `aria-hidden`)
- [ ] 2.4 Write a `Sizes` story covering `inherit` (scales with parent `font-size`, in-flow) and fixed sizes `2xs`–`lg` (square footprint; dots overflow without shifting an adjacent sibling)
- [ ] 2.5 Write a `ColorPalettes` story covering `primary` and `white`
- [ ] 2.6 Write a reduced-motion story/assertion (bounce replaced by opacity pulse; never fully static)
- [ ] 2.7 Verify all play functions fail initially (component not yet implemented)

## 3. Implementation

- [ ] 3.1 Implement `activity-indicator.types.ts`: recipe props (`size`, via `RecipeProps<"activityIndicator">`), root slot props from `HTMLChakraProps<"span", …>` (omit `as`/`asChild`/`css`/`colorPalette`; add `colorPalette?: "primary" | "white"`), and `ActivityIndicatorProps` with `aria-label?` and `ref?: React.Ref<HTMLSpanElement>`; JSDoc every public prop
- [ ] 3.2 Implement `activity-indicator.recipe.ts`: `inline-flex` base; em-based dot geometry (dot ≈0.375em, gap ≈0.25em) defined once; `size` variant where `inherit` sets `font-size: inherit` (no box) and fixed sizes set `font-size` + square `width`/`height` (350/500/600/800/1000) with `position: relative` box and absolutely-positioned centered dots layer; `colorPalette` variant (`primary`→`ctvioletAlpha`, `white`→`whiteAlpha`); staggered dot opacities (0.4/0.6/0.8); bounce `@keyframes` with staggered delays; `prefers-reduced-motion: reduce` opacity-pulse fallback; never set `overflow: auto`/`scroll`
- [ ] 3.3 Implement `activity-indicator.slots.tsx`: `withContext<HTMLSpanElement, …>("span")` root slot
- [ ] 3.4 Implement `activity-indicator.i18n.ts` (+ messages) with a default activity label under `Nimbus.ActivityIndicator.*`, applied only in the labeled path
- [ ] 3.5 Implement `activity-indicator.tsx`: render `<span>` root + three `<span>` dots; default `size="inherit"`, `colorPalette="primary"`; when `aria-label` absent → `aria-hidden="true"`, no role; when present → `role="status"` + `aria-live="polite"` + label (fall back to i18n default); set `displayName`; no React Aria

## 4. Documentation

- [ ] 4.1 Create developer documentation (`activity-indicator.mdx` + `activity-indicator.dev.mdx`) via the `/writing-developer-documentation` skill, scoping usage to chat/agent activity and pointing progress use cases to `LoadingSpinner`
- [ ] 4.2 Create designer/guidelines documentation (`activity-indicator.guidelines.mdx`) via the `/writing-designer-documentation` skill
- [ ] 4.3 Create `activity-indicator.docs.spec.tsx` consumer-facing example tests
- [ ] 4.4 Create `activity-indicator.figma.tsx` Code Connect mapping to Figma node `10603-16574`

## 5. Validation

- [ ] 5.1 Run `pnpm extract-intl` so the new i18n messages compile
- [ ] 5.2 Build and run Storybook tests; verify all play functions pass (`pnpm test:dev` for TDD, then build + `pnpm test:storybook`)
- [ ] 5.3 Run `pnpm --filter @commercetools/nimbus typecheck` (and `typecheck:strict`) — no errors
- [ ] 5.4 Run `pnpm lint` — no violations
- [ ] 5.5 Confirm `ActivityIndicator` is exported from the package barrel and renders styled at runtime (recipe registered)
- [ ] 5.6 Add a changeset (`pnpm changeset`) describing the new consumer-facing component
