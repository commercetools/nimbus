---
"@commercetools/nimbus": patch
---

**Splitter**: collapsing or expanding the aside no longer fires `onSizeChangeEnd`.

`onSizeChangeEnd` is the resize-settle channel (drag end, keyboard, double-click
restore) — the seam consumers wire persistence to. Collapse/expand are signalled
by `onCollapsedChange`, so they no longer also emit `onSizeChangeEnd`. This fixes
controlled-size consumers that feed the settled value back into `size`: a
programmatic collapse previously fed the collapsed size back, so the aside
reopened at the collapsed width (e.g. 0) instead of its real width. `onSizeChange`
(the live, per-tick channel) still reports collapse/expand.
