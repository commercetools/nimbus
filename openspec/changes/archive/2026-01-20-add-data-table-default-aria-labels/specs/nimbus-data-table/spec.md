## ADDED Requirements

### Requirement: Component Aria Labels

The DataTable subcomponents SHALL have accessible labels for screen reader
identification.

#### Scenario: Default table label

- **WHEN** DataTable.Table renders without explicit aria-label
- **THEN** SHALL apply default localized label "Data table"
- **AND** label SHALL be customizable via aria-label prop

#### Scenario: Default header label

- **WHEN** DataTable.Header renders without explicit aria-label
- **THEN** SHALL apply default localized label "Data table header"
- **AND** label SHALL be customizable via aria-label prop

#### Scenario: Default body label

- **WHEN** DataTable.Body renders without explicit aria-label
- **THEN** SHALL apply default localized label "Data table body"
- **AND** label SHALL be customizable via aria-label prop

#### Scenario: Manager drawer label

- **WHEN** DataTable.Manager drawer opens
- **THEN** Drawer.Content SHALL have aria-label using "settings" i18n message
- **AND** Settings tabs SHALL have accessible label via tabListAriaLabel

#### Scenario: Custom label override

- **WHEN** component receives explicit aria-label prop
- **THEN** SHALL use provided label instead of default
- **AND** SHALL not apply localized default
