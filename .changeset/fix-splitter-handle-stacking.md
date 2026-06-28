---
"@commercetools/nimbus": patch
---

**Splitter**: the resize handle now reliably renders above pane content on
hover. Each pane is its own stacking context (`isolation: isolate`), so
positioned or `position: sticky` content inside a pane (e.g. a sticky header or
footer with its own `z-index`) can no longer paint over the handle.
