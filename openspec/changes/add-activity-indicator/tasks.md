## 1. Scaffold component structure

- [x] 1.1 Create `packages/nimbus/src/components/activity-indicator/` directory
      with shell files: `activity-indicator.tsx`, `activity-indicator.types.ts`,
      `activity-indicator.recipe.ts`, `activity-indicator.slots.tsx`,
      `activity-indicator.stories.tsx`, `index.ts`
- [x] 1.2 Add barrel export (`index.ts`) re-exporting the component and its
      public types
- [x] 1.3 Export `ActivityIndicator` and `ActivityIndicatorProps` from the
      `@commercetools/nimbus` package barrel
- [x] 1.4 Register `activityIndicator` recipe in
      `packages/nimbus/src/theme/recipes/index.ts` (without this there are no
      runtime styles)

## 2. Failing Storybook tests (TDD-first)

- [x] 2.1 Write a `Base` story asserting the root is a `<span>` containing a
      single `<svg>` with three `<circle>` dots
- [x] 2.2 Write a story asserting decorative default: no `aria-label` → root has
      `aria-hidden="true"` and no `role`
- [x] 2.3 Assert the indicator is decorative regardless of props: always
      `aria-hidden="true"`, no `role`, no live-region attributes; no
      `aria-label` prop is accepted
- [x] 2.4 Write a `Sizes` story covering `inherit` (scales with parent
      `font-size`, in-flow) and fixed sizes `2xs`–`lg` (square footprint
      matching LoadingSpinner; does not shift an adjacent sibling)
- [x] 2.5 Write a `ColorPalettes` story covering every Nimbus palette in both
      the `plain` and `contrast` variants (no `primary`/`white` remap — any
      palette is accepted as-is)
- [x] 2.6 Write a reduced-motion story/assertion (bounce replaced by opacity
      pulse; never fully static)
- [x] 2.7 Verify all play functions fail initially (component not yet
      implemented)

## 3. Implementation

- [x] 3.1 Implement `activity-indicator.types.ts`: recipe props (`size` +
      `variant`, via `RecipeProps<"nimbusActivityIndicator">`), root slot props
      from `HTMLChakraProps<"span", …>` (omit `as`/`asChild`/`css`);
      `ActivityIndicatorProps` omits the broad slot `colorPalette` and adds
      `colorPalette?: NimbusColorPalette` plus
      `ref?: React.Ref<HTMLSpanElement>` (no `aria-label` prop — the component
      is decorative); JSDoc every public prop
- [x] 3.2 Implement `activity-indicator.recipe.ts`: `inline-flex` base that
      centers the square `<svg>` (`viewBox="0 0 24 24"`) via
      `align-items`/`justify-content` (with `flex-shrink: 0`); the SVG carries no
      intrinsic dimensions, so it fills the root box and keeps its default
      `overflow: visible` for the bounce (the recipe never sets
      `width`/`height: 100%` on the SVG or `overflow: auto`/`scroll`); `size`
      variant where `inherit` sets a `1em` box and fixed sizes set the root's
      square `width`/`height` (350/500/600/800/1000); `variant` controlling dot
      fill (`plain`→`colorPalette.11`, `contrast`→`colorPalette.contrast`);
      staggered dot opacities (0.4/0.6/0.8); bounce `@keyframes` with staggered
      delays; `prefers-reduced-motion: reduce` opacity-pulse fallback
- [x] 3.3 Implement `activity-indicator.slots.tsx`:
      `withContext<HTMLSpanElement, …>("span")` root slot
- [x] 3.5 Implement `activity-indicator.tsx`: render `<span>` root wrapping a
      single square `<svg>` with three `<circle>` dots; default
      `size="inherit"`, `colorPalette="primary"`; the root is always
      `aria-hidden="true"` with no role (purely decorative; the SVG is also
      `aria-hidden`); set `displayName`; no React Aria, no i18n

## 4. Documentation

- [x] 4.1 Create developer documentation (`activity-indicator.mdx` +
      `activity-indicator.dev.mdx`) via the `/writing-developer-documentation`
      skill, scoping usage to chat/agent activity and pointing progress use
      cases to `LoadingSpinner`
- [x] 4.2 Create designer/guidelines documentation
      (`activity-indicator.guidelines.mdx`) via the
      `/writing-designer-documentation` skill
- [x] 4.3 Create `activity-indicator.docs.spec.tsx` consumer-facing example
      tests
- [x] 4.4 Create `activity-indicator.figma.tsx` Code Connect mapping to Figma
      node `10603-16574`

## 5. Validation

- [x] 5.2 Build and run Storybook tests; verify all play functions pass
      (`pnpm test:dev` for TDD, then build + `pnpm test:storybook`)
- [x] 5.3 Run `pnpm --filter @commercetools/nimbus typecheck` (and
      `typecheck:strict`) — no errors
- [x] 5.4 Run `pnpm lint` — no violations
- [x] 5.5 Confirm `ActivityIndicator` is exported from the package barrel and
      renders styled at runtime (recipe registered)
- [x] 5.6 Add a changeset (`pnpm changeset`) describing the new consumer-facing
      component
