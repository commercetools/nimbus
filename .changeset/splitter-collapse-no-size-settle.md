---
"@commercetools/nimbus": minor
---

`Splitter`: collapsing or expanding the aside is no longer reported on the size
callbacks (`onSizeChange` / `onSizeChangeEnd`) — only on `onCollapsedChange`.

- Fixed: a controlled splitter (you drive `size` and feed `onSizeChangeEnd` back)
  no longer breaks on a programmatic collapse. Previously, collapsing fed the
  collapsed size back into `size`, so expanding reopened the aside at the
  collapsed width (e.g. `0`) instead of its previous width. Collapse/expand now
  preserve the size to restore, with no special wiring on your part.
- Behavior change: `onSizeChange` and `onSizeChangeEnd` now fire only for genuine
  resizes (drag, keyboard, double-click restore). They no longer fire on
  collapse/expand. If you need to react to the aside collapsing or expanding, use
  `onCollapsedChange`.
