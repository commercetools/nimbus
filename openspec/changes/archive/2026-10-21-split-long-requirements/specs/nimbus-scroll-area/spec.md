## MODIFIED Requirements

### Requirement: Content wrapper sizes to viewport by default

For default and `vertical` orientations, the content wrapper SHALL size its
width to the viewport and SHALL fill the viewport height when the content is
shorter than it, growing with the content when the content is taller. For
`orientation="horizontal"`, the wrapper SHALL instead preserve Zag's
`min-width: fit-content` so a row of items can scroll horizontally.

#### Scenario: `width: 100%` sibling of a wide child

- **WHEN** a `ScrollArea` with default or vertical orientation contains a
  sibling with `width: 100%` alongside an intrinsically wider element
- **THEN** the `width: 100%` sibling SHALL size against the viewport width,
  not the wider element's width

#### Scenario: Vertical centering of a short child

- **WHEN** a consumer renders a single child with flex/grid centering and
  `height: 100%` inside a `ScrollArea` whose children are shorter than the
  viewport
- **THEN** the child SHALL be vertically centered within the viewport
- **AND** the content wrapper SHALL fill the viewport vertically so the
  child's `height: 100%` resolves against a definite height

#### Scenario: Horizontal orientation preserves fit-content

- **WHEN** `orientation="horizontal"` is set with a row of items whose
  total width exceeds the viewport
- **THEN** the content wrapper SHALL grow to fit its widest descendants
- **AND** the horizontal scrollbar SHALL reflect that overflow

#### Scenario: Content growth is reflected without scrolling

- **WHEN** the content grows after mount — content loading in, or swapping the
  children while the same `ScrollArea` stays mounted (e.g. tab panels) — and no
  scroll has occurred
- **THEN** the scrollbar SHALL reflect the new overflow and thumb size from the
  content resize alone, without requiring a scroll to trigger a re-measure

#### Scenario: Content taller than the viewport

- **WHEN** the content is taller than the viewport
- **THEN** the content wrapper SHALL grow with the content rather than staying
  clamped to the viewport height, so that a change in content size is observed

#### Scenario: Descendant overflow still scrolls

- **WHEN** a descendant overflows the content wrapper on either axis
- **THEN** the overflow SHALL still be surfaced as viewport scroll via
  `scrollHeight` / `scrollWidth`, so scrolling is unaffected
