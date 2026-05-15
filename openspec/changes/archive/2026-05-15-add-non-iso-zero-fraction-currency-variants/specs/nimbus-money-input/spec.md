## MODIFIED Requirements

### Requirement: Currency Selection
The component SHALL provide currency selection via dropdown or label display.

#### Scenario: Currency dropdown
- **WHEN** currencies array is provided with values
- **THEN** SHALL render Select component for currency selection
- **AND** SHALL use currency code as both key and display text
- **AND** SHALL call change handlers when currency changes
- **AND** SHALL support isCurrencyInputDisabled prop to disable dropdown

#### Scenario: Currency label
- **WHEN** currencies array is empty or not provided
- **THEN** SHALL render static label showing current currency code
- **AND** SHALL not allow currency changes
- **AND** label SHALL be semantically associated with amount input

#### Scenario: Currency code validation
- **WHEN** a standard ISO 4217 currency code is provided
- **THEN** SHALL validate against known currency codes from currencies data
- **AND** SHALL access fractionDigits from currency data

#### Scenario: Non-ISO zero-fraction variant currency codes
- **WHEN** a non-ISO zero-fraction variant code is provided (e.g. `HUF0`, `TRY0`, `CZK0`, `ILS0`, `KZT0`, `TWD0`)
- **THEN** SHALL recognise the code as valid
- **AND** SHALL use `fractionDigits: 0` for the currency
- **AND** `convertToMoneyValue` SHALL return a `centPrecision` value with `fractionDigits: 0`
- **AND** `parseMoneyValue` SHALL correctly parse the money value with 0 fraction digits
- **AND** `isHighPrecision` SHALL return true when decimal places are present, false otherwise
