## MODIFIED Requirements

### Requirement: Combobox trigger layout

The Combobox trigger grid layout SHALL include a `trailingElement` grid area after the `toggle` area. The full grid template becomes `"leadingElement content clear toggle trailingElement"`. The trailing element grid area SHALL only be occupied when the `trailingElement` prop is provided.

#### Scenario: Grid layout includes trailing element area

- **WHEN** a Combobox is rendered with a `trailingElement`
- **THEN** the trigger's CSS grid template SHALL include the `trailingElement` area after `toggle`
- **AND** the trailing element content SHALL be placed in that grid area
