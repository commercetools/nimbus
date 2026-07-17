## MODIFIED Requirements

### Requirement: Select trigger layout

The Select trigger layout SHALL support a `trailingElement` slot rendered after the existing clear button and dropdown indicator controls. The trailing element SHALL participate in the trigger's flex layout as the last visible child.

#### Scenario: Trigger layout includes trailing element

- **WHEN** a Select is rendered with a `trailingElement`
- **THEN** the trailing element SHALL render as the last child in the trigger's flex layout
- **AND** it SHALL appear visually after the dropdown indicator
