---
"@commercetools/nimbus": minor
---

`ScrollArea`: auto-hide-when-idle behavior, four visual styles, and a dedicated
visibility prop.

- **The scrollbar now auto-hides when idle by default.** It appears when the
  pointer enters the area or when the content scrolls, then fades out after a
  short idle delay; while the pointer rests inside, scrolling or moving toward
  the bar brings it back — so a resting reader is not distracted. Wheel, touch,
  and keyboard scrolling keep working while it is hidden.
- **`variant` now selects the visual style:** `solid` (default — grey track,
  thumb fills it), `inset` (grey track with an inset, floating pill thumb),
  `overlay` (no track, only the thumb shows), and `glass` (translucent, frosted
  track that blurs the content behind it).
- **New `scrollbarVisibility` prop:** `auto-hide` (default) or `always` (the bar
  stays visible and the viewport reserves a gutter). It is independent of
  `variant`, so any visual can also be always-visible, e.g.
  `<ScrollArea variant="inset" scrollbarVisibility="always" />`.
- **Higher-contrast thumb** at rest, so the bar reads clearly (previously it
  looked washed out).
- **Fixed:** the scrollbar now updates when the content changes — e.g. content
  loading in, or swapping the children while the same `ScrollArea` stays mounted
  (tab panels) — without needing a scroll first to trigger it.

Deprecations (still working, no code change required): `variant="hover"` — use
`variant="solid"`; `variant="always"` — use `scrollbarVisibility="always"`.
