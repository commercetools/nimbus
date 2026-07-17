## ADDED Requirements

### Requirement: Combobox supports trailingElement prop

The Combobox component SHALL accept an optional `trailingElement` prop of type `ReactNode` on its root props. When provided, the trailing element SHALL render after the built-in clear and toggle buttons, at the far trailing edge of the trigger.

#### Scenario: Trailing element renders after built-in controls

- **WHEN** a Combobox is rendered with `trailingElement={<SomeIcon />}`
- **THEN** the trailing element SHALL appear after the clear button and toggle button in the DOM and visual layout

#### Scenario: Trailing element is absent when prop is not provided

- **WHEN** a Combobox is rendered without a `trailingElement` prop
- **THEN** no trailing element slot SHALL be present in the DOM
- **AND** the layout SHALL be identical to the current behavior

#### Scenario: Trailing element respects size variants

- **WHEN** a Combobox is rendered with `size="sm"` and a `trailingElement` containing an SVG icon
- **THEN** the icon SHALL be sized to match the `leadingElement` icon size for that size variant

#### Scenario: Trailing element inherits disabled state styling

- **WHEN** a Combobox is rendered with `isDisabled={true}` and a `trailingElement`
- **THEN** the trailing element slot SHALL inherit the disabled visual treatment from the root
