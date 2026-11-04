## 1. Types and recipe

- [x] 1.1 Widen `stickyHeader` to `boolean | "compact-on-scroll"` on the
      flexible props only
- [x] 1.2 Add the Root-private `compactHeader` recipe prop
      (`"idle" | "compact"`) and omit it from the public props
- [x] 1.3 Add the `scrollSentinel` slot (out of flow, grid row 1) and the
      `compactHeader` variant with all compact values and transitions
- [x] 1.4 Add `_motionReduce` with a zero duration to every compact transition

## 2. Behavior

- [x] 2.1 `hooks/use-compact-on-scroll.ts`: `nextPhase`, `parseStickyHeader`,
      `useCompactOnScroll` (viewport root, edge positions, no scroll listener)
- [x] 2.2 Root: decode the prop before splitting recipe props, render the
      sentinel only in compact mode, set `data-compact`
- [x] 2.3 Keep the hook and `nextPhase` out of the package barrel

## 3. Stories and tests

- [x] 3.1 Unit spec for `nextPhase`, `parseStickyHeader` (including the string
      without flexible layout) and the hook's observer setup
- [x] 3.2 Story with an ancestor scroller: no change at scrollTop 5, 30 and 60,
      one change past the header with scrollTop still above 0, two after
      returning to the top
- [x] 3.3 Stories for `overflow-anchor: none`, a short page, a 320px wide
      container, document scroll and reduced motion
- [x] 3.4 `FlexibleStickyHeader` still passes

## 4. Documentation

- [x] 4.1 `default-page.mdx` and `default-page.dev.mdx`
- [x] 4.2 Minor changeset per `docs/changeset-conventions.md`

## 5. Verification

- [x] 5.1 Unit spec green
- [x] 5.2
      `pnpm test:storybook:dev packages/nimbus/src/components/default-page/default-page.stories.tsx`
      green
- [x] 5.3 Check the compact values against the Figma frame
- [ ] 5.4 Manual Safari pass (no Safari run in CI)
- [x] 5.5
      `pnpm exec openspec validate default-page-compact-header --type change --strict`
