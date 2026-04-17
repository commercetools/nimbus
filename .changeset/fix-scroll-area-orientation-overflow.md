---
"@commercetools/nimbus": patch
---

Fix `ScrollArea` silently overflowing and stretching `width: 100%` children.
Zag's default `min-width: fit-content` on the content slot caused the wrapper to
grow to fit its widest child, so siblings sized at `100%` inherited that
overgrown width. The wrapper is now sized to the viewport by default, and the
default `orientation` is `"both"` so descendant overflow surfaces a scrollbar
indicator instead of being silently scrollable. Setting `orientation` to
`"vertical"` or `"horizontal"` now actively clips the opposite axis.
