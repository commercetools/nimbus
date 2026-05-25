---
"@commercetools/nimbus": minor
---

feat(splitter): add Splitter component and useSplitterLayout hook

A compound primitive for user-resizable 2-pane layouts. `Splitter.Root` contains
exactly two `Splitter.Pane` children with one `Splitter.Handle` between them;
per-pane configuration (sizes, constraints, collapsibility) lives on
`Splitter.Root` keyed by pane id. The component is uncontrolled by design — the
companion `useSplitterLayout` hook handles persistence (localStorage by `id` or
a custom storage adapter) and cross-component imperative commands (`collapse`,
`expand`, `setSizes`, `getSizes`, `isCollapsed`) without re-rendering the
consumer tree on every drag tick.

Implements the W3C window splitter ARIA pattern: handle is `role="separator"`
with per-pane `aria-valuemin`/`aria-valuemax`, `aria-controls` pointing at the
previous pane sibling, full keyboard support (arrows, Home/End for bounds, Enter
to toggle collapse), focus-visible ring, and a touch-target- expanded hit area.
Collapsible panes toggle via double-click on the handle or Enter;
`disableDoubleClick` opts out of the click affordance. Layouts with 3+ regions
are expressed by nesting a Splitter inside a Pane.
