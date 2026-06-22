---
"@commercetools/nimbus": minor
---

`Splitter`: fixes to collapsed-handle interaction and responsive sizing.

- The collapsed handle is now **keyboard-only**: while an aside is collapsed it
  no longer shows a hover track, and double-clicking it does nothing. `Enter`
  still expands it. Because `collapsedSize` defaults to `0` (the aside fully
  disappears), provide your own visible control — a button driving the
  `collapsed` prop, or a trigger near the collapsed aside — so mouse users can
  reopen it.
- `useResponsiveSplitterSizes`: a pixel/token `size` no longer flashes a 50/50
  split for one frame on load — it resolves to the configured size before the
  first paint.
- `useResponsiveSplitterSizes`: an aside collapsed on mount with a pixel/token
  `collapsedSize` now renders at that collapsed size instead of staying at 0%
  (invisible).
