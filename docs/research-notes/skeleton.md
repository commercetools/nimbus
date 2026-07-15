# Skeleton — Research Notes

## Summary

A purely presentational loading-placeholder component. Renders muted, optionally
animated shapes (rectangle, text lines, circle) that hold space for content
while it loads, reducing perceived wait and preventing layout shift. No React
Aria (no interaction). Chakra UI v3 dropped its built-in Skeleton, so Nimbus
implements from scratch with a `defineRecipe`.

## 1. Behavior & UX

- Standalone pattern (render skeleton during loading, swap to real content via
  conditional rendering) vs content-wrapper `isLoaded` pattern (Chakra v2 /
  Mantine `visible`). **Recommend standalone** — keeps loading-state management
  out of the styling component, matches Nimbus philosophy.
- Animation: `pulse` (opacity oscillation, default), `wave`/shimmer (gradient
  sweep via `::after`), `none`.
- Common shapes: text lines, circle/avatar, rectangle/block.

## 2. Prior art

- **MUI**: single + `variant` (text/circular/rectangular/rounded); pulse+wave;
  compose multi-line manually.
- **Ant Design**: family (Button/Avatar/Input/Image); `paragraph.rows`;
  `loading` content-wrapper.
- **Chakra v2**: `Skeleton`/`SkeletonText`(noOfLines)/`SkeletonCircle`;
  `isLoaded`. v3 removed it.
- **Mantine**: single; `visible`; `circle`/`radius`/`animate`.
- **Polaris**: specialized (SkeletonBodyText `lines`, SkeletonDisplayText,
  SkeletonThumbnail); standalone; pulse.

## 3. React Aria foundation

- **None.** No Skeleton component/hook. `ProgressBar` exists but a skeleton is
  NOT a progress indicator (don't use `role="progressbar"`). `VisuallyHidden` is
  relevant for an optional "Loading…" label. Classified as "simple HTML, no
  React Aria."

## 4. Accessibility (WCAG 2.1 AA)

- Skeleton shapes are decorative → `aria-hidden="true"` by default.
- Loading announcement is a page/section concern: document that consumers set
  `aria-busy` on the container holding the loading region (Nimbus Skeleton can't
  know its container). Optionally accept `aria-label` → renders `role="img"`.
- **prefers-reduced-motion**: disable animation via `_motionReduce` condition in
  the recipe (`animation: none`).

## 5. Recommended Nimbus API

**Three named exports: `Skeleton`, `SkeletonText`, `SkeletonCircle`.** No
`isLoaded`.

- `Skeleton` (base): `width`, `height`, `borderRadius`, `animation`
  ("pulse"|"wave"|"none", default pulse), `aria-hidden` (default true), HTML div
  passthrough, `ref`. Tier 1 — single `defineRecipe` with `shape` (rectangle
  default / circle) + `animation` variants.
- `SkeletonText`: `lines` (default 3), `lineHeight` ("1em"), `spacing`,
  `lastLineWidth` ("60%"), `animation`. A plain React layout wrapper composing N
  `Skeleton` lines (NO own recipe).
- `SkeletonCircle`: `size` (equal w/h), `animation`. Sugar over
  `Skeleton shape="circle"`.

### Recipe / tokens

- Register `nimbusSkeleton` in `src/theme/recipes/index.ts` (NOT slot-recipes).
- Base color: `colors.neutralAlpha.3` (adapts light/dark).
- `pulse`: reuse existing `pulse` keyframe in `src/theme/keyframes.ts`
  (`50% { opacity: 0.5 }`), duration token `2s`, ease-in-out, infinite.
- `wave`: add new `skeleton-wave` keyframe (`translateX(-100%) → 100%`) +
  `::after` gradient sweep; shimmer highlight via CSS var with `_dark` override.
- Shape variants: rectangle (radius `100`/4px), circle (radius `full`,
  `aspectRatio: 1/1`).
- `_motionReduce`: `animation: none`.

### File structure (Tier 1)

`packages/nimbus/src/components/skeleton/`: `skeleton.tsx` (3 exports),
`skeleton.types.ts`, `skeleton.recipe.ts`, `skeleton.slots.tsx` (single
withContext root), `skeleton.stories.tsx`, docs mdx + `skeleton.docs.spec.tsx`,
`index.ts`. Reference: `badge` (recipe pattern), `loading-spinner` (a11y +
structure), `progress-bar` (CSS var + `_motionReduce`).

## Reference paths

- `src/theme/keyframes.ts` (add `skeleton-wave`; `pulse` already present)
- `src/theme/recipes/index.ts` (register `nimbusSkeleton`)
- `src/components/{badge,loading-spinner,progress-bar}/`
- `packages/tokens/src/base/tokens.json` (neutralAlpha, duration, borderRadius,
  size)
