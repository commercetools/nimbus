## MODIFIED Requirements

### Requirement: Optimized Rendering

The component SHALL keep overlay content out of the DOM while closed, and SHALL
stay anchored to its trigger while the page moves.

#### Scenario: Lazy mounting

- **WHEN** the popover is closed
- **THEN** the overlay content SHALL NOT be mounted in the DOM
- **AND** it SHALL mount when the popover opens
- **AND** it SHALL unmount once the exit animation has finished

#### Scenario: Scroll optimization

- **WHEN** the page scrolls or the viewport resizes while the popover is open
- **THEN** the popover SHALL remain anchored to its trigger
- **AND** it SHALL stay within the viewport, flipping or shifting as needed
- **AND** no scroll-dismissal option SHALL be exposed
