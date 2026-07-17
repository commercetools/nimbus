## MODIFIED Requirements

### Requirement: SearchInput layout

The SearchInput root layout SHALL support a `trailingElement` slot rendered after the existing clear button. The trailing element SHALL participate in the root's inline-flex layout as the last visible child.

#### Scenario: Root layout includes trailing element

- **WHEN** a SearchInput is rendered with a `trailingElement`
- **THEN** the trailing element SHALL render as the last child in the root's inline-flex layout
- **AND** it SHALL appear visually after the clear button
