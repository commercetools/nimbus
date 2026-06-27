---
"@commercetools/nimbus": minor
---

**Tabs & TabNav**: add an opt-in `animated` prop that slides a single active
marker between items as the selection changes, instead of snapping it. The
indicator adapts to the variant, orientation, and placement — an underline bar
for the `line`/`tabs` look, a side bar for vertical `Tabs`, and a filled
highlight for `pills` (`Tabs`) and `filled`/`pill` (`TabNav`). It is decorative
(`aria-hidden`, non-focusable), so selection, focus, and keyboard navigation are
unaffected, and the slide automatically respects `prefers-reduced-motion`.
`animated` defaults to `false`, so existing usage is unchanged.

`TabNav` also gains `filled` and `pill` variants (soft rounded-rect and capsule
active highlights) alongside the default `tabs` underline.
