---
"@commercetools/nimbus": minor
---

`Splitter`: new compound component for user-resizable two-pane layouts.
`Splitter.Root` holds exactly two `Splitter.Pane`s with a draggable,
keyboard-operable `Splitter.Handle` between them; per-pane constraints
(`minSize`, `collapsible`, `collapsedSize`) are set on `Splitter.Root` keyed by
pane id.

- Set the initial split with `defaultSizes`. Sizes are uncontrolled for drag
  performance — read changes with `onSizesChange` (live) or `onSizesChangeEnd`
  (fires once per settled interaction; wire persistence here, no debouncing
  needed).
- Collapse panes with controllable state (`collapsedPane` /
  `defaultCollapsedPane` / `onCollapsedPaneChange`), so any control in your app
  can collapse a pane. Enter on the focused handle toggles collapse;
  double-click restores the initial split (suppress with
  `isDoubleClickDisabled`).
- `isDisabled` makes the whole splitter non-interactive. `orientation` switches
  between horizontal and vertical, and the `size` variant sets handle thickness.
- Sizes carry full float precision, so you can hit exact pixel widths at a known
  container size.
- The handle is fully keyboard accessible (arrow keys, Home/End); compose three
  or more regions by nesting a Splitter inside a Pane.
