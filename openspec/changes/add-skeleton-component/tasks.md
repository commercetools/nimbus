## 1. Theme groundwork

- [x] 1.1 Add a `skeleton-wave` keyframe to
      `packages/nimbus/src/theme/keyframes.ts` (`translateX(-100%)` →
      `translateX(100%)` with a brief end pause). Confirm the existing `pulse`
      keyframe is present and reusable.

## 2. Scaffolding & types

- [x] 2.1 Create `packages/nimbus/src/components/skeleton/` with the standard
      Tier-1 layout (mirroring `badge`): `skeleton.tsx`, `skeleton.types.ts`,
      `skeleton.recipe.ts`, `skeleton.slots.tsx`, `skeleton.stories.tsx`,
      `index.ts`.
- [x] 2.2 Define types in `skeleton.types.ts` (four-layer): `SkeletonProps`
      (width, height, borderRadius, animation, aria-hidden, div passthrough,
      ref), `SkeletonTextProps` (lines, lineHeight, spacing, lastLineWidth,
      animation), `SkeletonCircleProps` (size, animation). JSDoc every public
      prop.

## 3. Styling (recipe + slot)

- [x] 3.1 Create `skeleton.recipe.ts` via `defineRecipe`: base
      (`backgroundColor: neutralAlpha.3`, block, overflow hidden, relative,
      `_motionReduce` → no animation); `shape` variant (rectangle radius 4px /
      circle radius full + `aspectRatio: 1/1`); `animation` variant (pulse reuses
      `pulse` keyframe; wave uses `skeleton-wave` + `::after` gradient sweep with
      a `_dark` shimmer-color override; none). `defaultVariants`:
      shape=rectangle, animation=pulse.
- [x] 3.2 Register the recipe as `nimbusSkeleton` in
      `packages/nimbus/src/theme/recipes/index.ts`.
- [x] 3.3 Create `skeleton.slots.tsx` with a single `withContext` root slot
      rendering a `<div>`.

## 4. Component implementation (TDD: write story tests first, then implement)

- [x] 4.1 In `skeleton.stories.tsx`, write Storybook stories with play functions
      asserting each spec scenario BEFORE implementing: sized rectangle
      placeholder, circle shape (full radius + equal w/h), pulse default,
      animation="none", aria-hidden by default, SkeletonText renders N lines with
      shorter last line, SkeletonCircle sized, ref forwarded.
- [x] 4.2 Implement `Skeleton` in `skeleton.tsx`: render the recipe slot with
      `shape`/`animation` variants, `aria-hidden` default true,
      width/height/borderRadius + style props passthrough, `ref` forwarded;
      `displayName` set.
- [x] 4.3 Implement `SkeletonText`: render a `<div>` stack of `lines` `Skeleton`
      elements with `spacing` gap, each `lineHeight` tall, the last line at
      `lastLineWidth`; forward `animation`; `aria-hidden` on the container;
      `displayName` set.
- [x] 4.4 Implement `SkeletonCircle`: render `Skeleton` with `shape="circle"` and
      `size` mapped to equal width/height; `displayName` set.
- [x] 4.5 Export `Skeleton`, `SkeletonText`, `SkeletonCircle` and their types
      from `skeleton/index.ts` and add to the package public API barrel
      (`packages/nimbus/src/components/index.ts`).

## 5. Verification

- [x] 5.1 Build the package
      (`pnpm --filter @commercetools/nimbus build`) then run
      `pnpm test packages/nimbus/src/components/skeleton/skeleton.stories.tsx`
      until green.
- [x] 5.2 Run `pnpm --filter @commercetools/nimbus typecheck` and `pnpm lint` on
      the skeleton files; resolve any errors.

## 6. Documentation

- [x] 6.1 Add `skeleton.docs.spec.tsx` consumer examples, `skeleton.dev.mdx`
      engineering docs, and `skeleton.mdx` designer docs. Document the standalone
      (no `isLoaded`) usage pattern and the container `aria-busy` accessibility
      guidance, plus reduced-motion behavior.

## 7. Text-style-matched sizing (SkeletonText)

- [x] 7.1 Add a `textStyle` prop to `SkeletonText` (default `body`) that sets the
      container's `font-size`/`line-height`, so each line's `1em` bar height and
      the `calc(1lh - 1em)` gap scale to the chosen Nimbus text style. Keep
      `lineHeight` and `spacing` as explicit overrides.
- [x] 7.2 Add stories asserting the bar height and line pitch match the text
      style (e.g. `body` 16/26 and `3xl` 30/36) via measured geometry.
- [x] 7.3 Document `textStyle` in `skeleton.mdx` and `skeleton.dev.mdx`.
