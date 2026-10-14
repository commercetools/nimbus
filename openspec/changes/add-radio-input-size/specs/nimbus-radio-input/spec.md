## MODIFIED Requirements

### Requirement: Size Options
The component SHALL support multiple size variants per nimbus-core standards.

#### Scenario: Size variants
- **WHEN** size prop is set on Root
- **THEN** SHALL support: sm, md
- **AND** SHALL adjust radio indicator size, label text style and the gap between options
- **AND** md SHALL be default size

#### Scenario: Medium size
- **WHEN** size="md" is set or size is omitted
- **THEN** option label SHALL use text style md (16px)
- **AND** radio indicator SHALL be 20px

#### Scenario: Small size
- **WHEN** size="sm" is set
- **THEN** option label SHALL use text style sm (14px)
- **AND** radio indicator SHALL be 16px

#### Scenario: Gap between stacked options
- **WHEN** orientation="vertical" and size="sm"
- **THEN** options SHALL be 8px apart
- **WHEN** orientation="vertical" and size="md"
- **THEN** options SHALL be 12px apart

#### Scenario: Gap between options in a row
- **WHEN** orientation="horizontal"
- **THEN** options SHALL be 16px apart for every size
