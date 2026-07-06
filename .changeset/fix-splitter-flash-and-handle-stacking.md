---
"@commercetools/nimbus": patch
---

**Splitter**: two fixes.

- Fixed a first-paint flash where a `Splitter` driven by
  `useResponsiveSplitterSizes` with a pixel/token `size` briefly showed the
  uncontrolled 50/50 split before snapping to the configured size on load. Pane
  registration and the controlled-size/collapse reconcile now run in layout
  effects, so a size that resolves after mount (once the container is measured)
  is adopted before the first paint instead of a frame later.
- The resize handle now reliably renders above pane content on hover. Each pane
  is its own stacking context (`isolation: isolate`), so positioned or
  `position: sticky` content inside a pane (e.g. a sticky header or footer with
  its own `z-index`) can no longer paint over the handle.
