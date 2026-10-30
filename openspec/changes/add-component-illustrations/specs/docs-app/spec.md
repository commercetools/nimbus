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

#### Scenario: Category card

- **WHEN** a document has no illustration of its own but documents below it in the menu do
- **THEN** its card SHALL show the illustrations of up to three of them as a small group
- **AND** they SHALL be ordered by menu order, then by title

#### Scenario: No illustration

- **WHEN** a document and the documents below it have no illustration
- **THEN** the card SHALL show its current icon

#### Scenario: Same illustration twice

- **WHEN** the same illustration appears twice on one page
- **THEN** each copy SHALL render correctly, with unique internal ids
