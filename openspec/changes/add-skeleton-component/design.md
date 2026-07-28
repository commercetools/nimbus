## Context

Nimbus is missing a loading-placeholder component. Chakra UI v3 dropped its
built-in Skeleton, so there is nothing to inherit — it must be implemented from
scratch as a CSS-driven recipe. There is no React Aria primitive (skeletons are
non-interactive and decorative). References: `badge` (defineRecipe),
`loading-spinner` (a11y + file structure), `progress-bar` (`_motionReduce`, CSS
custom properties).

## Goals / Non-Goals

**Goals:**

- A small, explicit family: `Skeleton`, `SkeletonText`, `SkeletonCircle`.
- Single `defineRecipe` (`nimbusSkeleton`) with `shape` + `animation` variants.
- `pulse` (default), `wave`, and `none` animations; tokens for color/radius/
  duration; reduced-motion respected.
- Decorative by default (`aria-hidden`); document container `aria-busy` for
  consumers.

**Non-Goals:**

- The Chakra `isLoaded` content-wrapper pattern. Consumers render the skeleton
  during loading and swap to real content via conditional rendering — this keeps
  loading-state management out of the styling component and matches Nimbus's
  existing approach (`LoadingSpinner` is also state-external).
- `role="progressbar"`/progress semantics — a skeleton is a layout placeholder,
  not a process reporter.
- AntD-style specialty members (Button/Avatar/Input/Image) — not needed.

## Decisions

- **Tier 1, single `defineRecipe` (not slot recipe).** One styled DOM element
  with `shape` + `animation` variants. Register as `nimbusSkeleton` in
  `src/theme/recipes/index.ts`. Matches `badge`.
- **`Skeleton` is the only recipe-backed element.** `SkeletonText` is a plain
  React layout wrapper rendering a `<div>` stack of N `Skeleton` lines (no own
  recipe). `SkeletonCircle` is sugar that renders `Skeleton shape="circle"`.
- **Animations:** `pulse` reuses the existing `pulse` keyframe in
  `src/theme/keyframes.ts` (`50% { opacity: 0.5 }`), duration `2s`, ease-in-out,
  infinite. `wave` adds a new `skeleton-wave` keyframe (`translateX(-100%)` →
  `translateX(100%)`) driving an `::after` gradient sweep; the shimmer highlight
  color uses a CSS custom property with a `_dark` override so it works in both
  modes. `none` applies no animation.
- **Base color `colors.neutralAlpha.3`** — adapts to light/dark via the alpha
  scale; muted enough not to compete with content.
- **Shapes:** `rectangle` (default, radius `100`/4px), `circle` (radius `full` +
  `aspectRatio: 1/1`).
- **Accessibility:** root `aria-hidden="true"` by default. Reduced motion via
  `_motionReduce` condition in the recipe (`animation: none`, and disable the
  `::after` wave). Document that consumers set `aria-busy` on the loading region.
- **Sizing:** `Skeleton` takes `width`/`height`/`borderRadius` as style props
  (Box-style passthrough). `SkeletonCircle` maps a single `size` to equal w/h.
  `SkeletonText` lines default to `height: 1em`.
- **File structure (Tier 1):** `skeleton.tsx` (3 exports), `skeleton.types.ts`,
  `skeleton.recipe.ts`, `skeleton.slots.tsx` (single `withContext` root),
  `skeleton.stories.tsx`, docs mdx + `skeleton.docs.spec.tsx`, `index.ts`.

## Risks / Trade-offs

- **Wave shimmer in dark mode** → a fixed white highlight looks wrong on the
  dark base. Mitigation: drive the highlight via a CSS custom property with a
  `_dark` override (subtle low-opacity white), mirroring `progress-bar`'s CSS-var
  approach.
- **No `isLoaded` may surprise Chakra-migrating consumers** → Mitigation:
  document the standalone conditional-render pattern explicitly in the dev docs.
- **`SkeletonText` not recipe-backed** → its lines are `Skeleton` instances, so
  styling stays consistent; only layout (stack + spacing + last-line width) is
  bespoke. Acceptable; documented.
- **Decorative-by-default could hide meaningful placeholders** → Mitigation:
  allow `aria-hidden` to be overridden and document the container `aria-busy`
  pattern for screen-reader announcement.
