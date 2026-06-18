---
"@commercetools/nimbus": patch
---

**Splitter**: collapsing or expanding the aside no longer fires `onSizeChange` or
`onSizeChangeEnd`.

Collapse/expand change only the aside's layout (main takes the remainder) and are
signalled by `onCollapsedChange` — they are not size *changes* a consumer should
react to on the size channels. The size channels stay resize-only (drag,
keyboard, double-click restore). This fixes controlled-size consumers that feed
the settled value back into `size`: a programmatic collapse previously fed the
collapsed size back, so the aside reopened at the collapsed width (e.g. 0) instead
of its real width.
