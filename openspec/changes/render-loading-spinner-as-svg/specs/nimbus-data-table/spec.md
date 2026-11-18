# Spec Delta

## ADDED Requirements

### Requirement: Last Column Resizer Containment
The resize handle of the last column SHALL stay inside the table at rest, so that it adds no scrollable width.

#### Scenario: Resizable table without a pin column
- **WHEN** the table has isResizable and allowsPinning={false}
- **AND** no column is wider than the table
- **THEN** the table SHALL NOT show a horizontal scrollbar
- **AND** the scroll width of the table container SHALL equal its client width

#### Scenario: Last handle ends inside the table
- **WHEN** the last column has a resize handle
- **THEN** the right edge of that handle SHALL be at or inside the right edge of the table container
- **AND** the handle SHALL be as wide as the handles of the other columns
