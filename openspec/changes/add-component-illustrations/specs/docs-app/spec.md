# Spec Delta

## ADDED Requirements

### Requirement: Overview Illustrations

Category overview cards SHALL show the component's illustration when one exists.

#### Scenario: Grid card

- **WHEN** a component has an illustration
- **THEN** its grid card SHALL show the illustration centered in a top band
- **AND** the band color SHALL match the illustration background in light and dark mode

#### Scenario: List item

- **WHEN** a component has an illustration
- **THEN** its list item SHALL show it as a small square in the icon position

#### Scenario: No illustration

- **WHEN** a component has no illustration
- **THEN** the card SHALL show its current icon

#### Scenario: Same illustration twice

- **WHEN** the same illustration appears twice on one page
- **THEN** each copy SHALL render correctly, with unique internal ids
