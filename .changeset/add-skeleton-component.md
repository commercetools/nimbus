---
"@commercetools/nimbus": minor
---

`Skeleton`: new loading-placeholder component family for holding space while
content loads, reducing layout shift. Use `Skeleton` for a single rectangle or
circle placeholder, `SkeletonText` for a stack of placeholder lines
(configurable `lines`, with a shorter last line to mimic a paragraph), and
`SkeletonCircle` for avatar/icon placeholders sized by a single `size` prop.
Each supports a `pulse` (default), `wave`, or `none` animation, sizing via
standard style props, and is decorative by default (`aria-hidden`) — communicate
loading state with `aria-busy` on the surrounding container. Animations are
automatically disabled when the user prefers reduced motion. Render skeletons
during loading and swap to real content once it arrives.
