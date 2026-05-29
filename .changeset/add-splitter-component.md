---
"@commercetools/nimbus": minor
---

feat(splitter): add Splitter component

A compound primitive for user-resizable 2-pane layouts. `Splitter.Root` contains
exactly two `Splitter.Pane` children with one `Splitter.Handle` between them;
per-pane constraints (`minSize`, `collapsible`, `collapsedSize`) live on
`Splitter.Root` keyed by pane id.

Sizes are uncontrolled for drag performance — set the initial split with
`defaultSizes` and react to changes with `onSizesChange` (live) or
`onSizesChangeEnd` (fires once per settled interaction, ideal for persisting to
any storage without debouncing). Collapse is plain controllable state
(`collapsedPane` / `defaultCollapsedPane` / `onCollapsedPaneChange`), so a
button anywhere in the app can collapse a pane. `isDisabled` makes the whole
splitter non-interactive. Percentages keep full float precision for
pixel-precise layouts at a known width.

Implements the W3C window splitter ARIA pattern: handle is `role="separator"`
with `aria-valuemin`/`aria-valuemax`/`aria-valuetext`, `aria-controls` pointing
at the previous pane sibling, full keyboard support (arrows, Home/End for
bounds, Enter to toggle collapse), focus-visible ring, and a touch-target-
expanded hit area. Double-click on the handle restores the initial sizes.
Layouts with 3+ regions are expressed by nesting a Splitter inside a Pane.
