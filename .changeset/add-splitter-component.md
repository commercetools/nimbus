---
"@commercetools/nimbus": minor
---

`Splitter`: new compound component for user-resizable two-pane layouts. A
draggable, keyboard-operable handle sits between a configurable `Splitter.Aside`
and a `Splitter.Main` that fills the remaining space (the aside can sit on
either side, horizontal or vertical). You configure a single dimension — the
aside's `size` — plus optional `minSize` / `maxSize` and a collapsible aside.
Size is uncontrolled by default (`defaultSize`) or controllable in place via the
`size` prop for responsive, per-breakpoint layouts; a single number round-trips
to your own storage via `onSizeChangeEnd`. Nest splitters for three or more
regions. See the docs for the full API.

Also ships `useResponsiveSplitterSizes`, a companion hook for consumers who want
to express pane sizes in pixels, size tokens, or per-container-width breakpoints
instead of percentages. It measures the container, translates your config into
the percentage `Splitter.Root` consumes, clamps to your `minSize` / `maxSize`,
and can persist the user's settled size across reloads.
