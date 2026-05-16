## 1. Scaffold

- [x] 1.1 Create `packages/nimbus/src/components/scroll-area/` directory with
      files: `scroll-area.tsx`, `scroll-area.types.ts`, `scroll-area.recipe.ts`,
      `scroll-area.stories.tsx`, `index.ts`
- [x] 1.2 Export `ScrollArea` and `ScrollAreaProps` from
      `src/components/scroll-area/index.ts`
- [x] 1.3 Add `export * from "./scroll-area"` to `src/components/index.ts`
- [x] 1.4 Register `scrollAreaSlotRecipe` as `scrollArea` in
      `src/theme/slot-recipes/index.ts`

## 2. Implementation

- [x] 2.1 Implement slot recipe in `scroll-area.recipe.ts` (Nimbus token colors,
      size variants, visibility variants, focus ring on root via `_focusWithin`)
- [x] 2.2 Implement `ScrollAreaParts` private component (reads
      `useScrollAreaContext()` for conditional `tabIndex`, renders Viewport,
      Content, Scrollbar(s), Corner based on `orientation`)
- [x] 2.3 Implement `ScrollArea` public component (extracts props,
      renders `ChakraScrollArea.Root` with forwarded props)

## 3. Stories

- [x] 3.1 Write Storybook stories with play functions covering: Default
      (overflowing, vertical scrollbar, keyboard focusable),
      DefaultSurfacesBothScrollbars, DefaultChildSizing (sibling sizing
      invariants), NonOverflowing, ContentFillsViewport (vertical centering
      of a shorter child), KeyboardFocusRing, StrictOrientations (axis
      clipping + opposite-axis suppression), AlwaysVisible, CustomStyling,
      Sizes, ExternalControl, DynamicContent, ForwardsApi,
      StickyContentInPanel, ContentPadding

## 4. Documentation

- [x] 4.1 Create overview documentation (`scroll-area.mdx`)
- [x] 4.2 Create developer documentation (`scroll-area.dev.mdx`)
- [x] 4.3 Create accessibility documentation (`scroll-area.a11y.mdx`)

## 5. Post-review fixes

- [x] 5.1 Add gutter to `always` variant so scrollbar does not overlay content
      (width calc for vertical, flex + marginBottom for horizontal)
- [x] 5.2 Add `zIndex: 1` to scrollbar base styles so it paints above sticky
      content inside the viewport
- [x] 5.3 Remove explicit `variant="always"` from stories that don't test it;
      default `hover` variant is used unless explicitly testing `always`
- [x] 5.4 Expand AlwaysVisible story to cover vertical, horizontal, and both
      axes with gutter assertions
- [x] 5.5 Add StickyContentInPanel story comparing always vs hover in a
      header/body/footer layout with a sticky row

## 6. Padding prop forwarding

- [x] 6.1 Add `extractPaddingProps` utility in `src/utils/` covering all 24
      Chakra padding style prop keys
- [x] 6.2 Split padding props from root props in ScrollArea component and
      forward to Content slot
- [x] 6.3 Add PaddingOnRoot story to visualize padding behavior

## 7. Validation

- [x] 7.1 TypeScript compiles without errors
      (`pnpm --filter @commercetools/nimbus typecheck`)
- [x] 7.2 Build succeeds (`pnpm --filter @commercetools/nimbus build`)
- [x] 7.3 All Storybook story tests pass
      (`pnpm test:storybook:dev packages/nimbus/src/components/scroll-area/scroll-area.stories.tsx`)
- [x] 7.4 Lint passes
      (`pnpm lint -- packages/nimbus/src/components/scroll-area/`)

## 8. Post-release hotfix (PR #1389)

- [x] 8.1 Override Zag's inline `min-width: fit-content` on the content
      slot so `width: 100%` siblings size to the viewport instead of the
      widest descendant
- [x] 8.2 Change default `orientation` from `"vertical"` to `"both"` so
      descendant overflow on either axis always surfaces a visible
      scrollbar indicator
- [x] 8.3 Clip the opposite axis on the viewport via inline style for
      strict `orientation="vertical"` / `"horizontal"` so descendants
      cannot scroll silently
- [x] 8.4 Give the content wrapper `height: 100%` for default and
      `vertical` orientations so consumers can vertically center shorter
      children with flex/grid + `height: 100%`
- [x] 8.5 Fix recipe so each scrollbar hides based on its own axis data
      attribute (was: hid only when neither axis overflowed)
- [x] 8.6 Remove `overflow`, `overflowX`, `overflowY` from
      `ScrollAreaProps` at the type level
- [x] 8.7 Reduce `ids` shape to `root`, `viewport`, `content` — the only
      keys honored by the underlying state machine
- [x] 8.8 Add stories locking in the new invariants:
      `DefaultSurfacesBothScrollbars`, `DefaultChildSizing`,
      `StrictOrientations`, `ContentFillsViewport`
- [x] 8.9 Remove stories subsumed by the above: `SmokeTest`,
      `VerticalOnly`, `HorizontalOnly`, `BothAxes`
