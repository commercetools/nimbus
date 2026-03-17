## MODIFIED Requirements

### Requirement: Currency code validation
The component SHALL validate currency codes against the known currencies data.

#### Scenario: ISO 4217 currency codes
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
