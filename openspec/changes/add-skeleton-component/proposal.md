## Why

The Merchant Center is data-heavy: most screens fetch records before they can
render. Without a shared loading-placeholder, teams either show spinners (which
cause layout shift when content pops in) or hand-roll grey boxes. Nimbus has no
`Skeleton` component. A skeleton holds space for content while it loads,
reducing perceived wait and preventing layout shift.

## What Changes

- Add a `Skeleton` component family with three named exports:
  - `Skeleton` — base placeholder (rectangle or circle shape) with a
    configurable animation (`"pulse"` default, `"wave"`, or `"none"`).
  - `SkeletonText` — a stack of N placeholder lines (a plain layout wrapper that
    composes `Skeleton` lines; the last line is shorter to mimic real text).
  - `SkeletonCircle` — sugar over `Skeleton` with `shape="circle"` and equal
    width/height.
- Add a single Chakra `defineRecipe` (`nimbusSkeleton`, Tier 1, **not** a slot
  recipe) with `shape` (rectangle/circle) and `animation` variants.
- Add a new `skeleton-wave` keyframe to the theme; reuse the existing `pulse`
  keyframe for the default animation.
- Skeleton shapes are `aria-hidden="true"` by default (decorative); animation is
  disabled under `prefers-reduced-motion`.
- Out of scope: the Chakra `isLoaded` content-wrapper pattern — consumers use
  standalone conditional rendering instead.

## Capabilities

### New Capabilities

- `nimbus-skeleton`: A presentational loading-placeholder component family
  (`Skeleton`, `SkeletonText`, `SkeletonCircle`) that renders muted, optionally
  animated shapes to hold space while content loads, with accessible
  (decorative) and reduced-motion behavior.

### Modified Capabilities

<!-- None — net-new component capability. -->

## Impact

- **New code:** `packages/nimbus/src/components/skeleton/` (component, types,
  recipe, slots, stories, docs, barrel).
- **Theme:** register `nimbusSkeleton` in
  `packages/nimbus/src/theme/recipes/index.ts`; add `skeleton-wave` keyframe in
  `packages/nimbus/src/theme/keyframes.ts`.
- **Exports:** add `Skeleton`, `SkeletonText`, `SkeletonCircle` to the package
  public API barrel.
- **Dependencies:** none new (pure CSS/Chakra; no React Aria).
- **Release:** minor version bump (new component, additive).
