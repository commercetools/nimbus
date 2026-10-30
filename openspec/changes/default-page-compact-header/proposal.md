## Why

Flexible `DefaultPage` pages with `stickyHeader` keep the full header pinned
while the page scrolls. On long pages, and at high browser zoom, the pinned
header covers a large part of the viewport. The first consumer is the Merchant
Center cart discount pages (FEC-1446), which use
`<DefaultPage.Root layout="flexible" stickyHeader>`. There the scrolling element
is an ancestor that Nimbus does not own, so the component cannot be given a
scroll container.

We want the pinned header to shrink once the page has scrolled and return to
full size at the top, without the consumer naming a scroll container.

## What Changes

- `stickyHeader` accepts `"compact-on-scroll"` in addition to `boolean`, in the
  flexible layout only.
  - `stickyHeader={true}` is unchanged: a pinned header at full height.
  - Omitting `stickyHeader` is unchanged.
  - `"compact-on-scroll"` pins the header and shrinks it while the page is
    scrolled.
- The compact header has less vertical padding and a smaller title. The back
  link keeps its icon on the title row and hides its label. The subtitle
  collapses. Actions and tab navigation stay visible. The sizes match the
  compact frame: 12px vertical padding, a 16px title on a 22px line.
- The header compacts after the page has scrolled by the height of the header
  and restores when the top of the header is back in view. Scroll positions in
  between keep the current state, so the shrink itself can never flip the state
  back.
- The size change is animated. `prefers-reduced-motion` turns the animation off.
- A focused back link shows its label again, and a focused subtitle is shown
  again, without restoring the header.
- `DefaultPage.Root` has `data-compact="true"` while the header is compact.
- When the page is not in the `"compact-on-scroll"` mode, the rendered markup
  and styles are unchanged.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `nimbus-default-page`: "Sticky Variants" and "Type Definitions" accept
  `"compact-on-scroll"`; new requirements cover the compact header on scroll,
  its accessibility and its reduced motion behavior.

## Impact

- **Code**: `packages/nimbus/src/components/default-page/` — types, recipe
  (`compactHeader` variant, `scrollSentinel` slot), slots, root, new
  `hooks/use-compact-on-scroll.ts`, stories, docs.
- **Public API**: additive. `stickyHeader` is widened from `boolean` to
  `boolean | "compact-on-scroll"` in the flexible branch. The constrained branch
  is unchanged, so `stickyHeader="compact-on-scroll"` without
  `layout="flexible"` stays a compile error.
- **Visual**: none for existing consumers. The new compact states are covered by
  the `FlexibleCompactOnScroll` story.
- **DOM**: with `"compact-on-scroll"` one hidden element is added as the first
  child of `DefaultPage.Root`.
- **Consumers**: Merchant Center cart discount pages change `stickyHeader` to
  `stickyHeader="compact-on-scroll"`.
