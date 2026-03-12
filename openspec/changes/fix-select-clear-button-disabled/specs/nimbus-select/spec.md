## MODIFIED Requirements
### Requirement: Interactive States
The component SHALL support multiple interaction states per nimbus-core standards.

#### Scenario: Disabled state
- **WHEN** disabled={true} is set
- **THEN** SHALL apply disabled styling to trigger
- **AND** SHALL prevent opening dropdown
- **AND** SHALL disable the clear button so it cannot be used to remove the selected value
- **AND** SHALL set aria-disabled="true"

#### Scenario: Read-only state
- **WHEN** readOnly={true} is set
- **THEN** SHALL display selected value
- **AND** SHALL prevent opening dropdown
- **AND** SHALL set aria-readonly="true"
