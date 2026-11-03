## ADDED Requirements

### Requirement: Designer page "What the system supports"
The docs app SHALL provide a designer-facing page that states what Nimbus
supports and what needs a one-off or a custom composition.

#### Scenario: Supported choices are listed
- **WHEN** a designer opens the page
- **THEN** it SHALL list, per component group, the variants, sizes and palettes that exist
- **AND** SHALL state how to proceed when a design is not covered: ask the Nimbus team, or mark it as a one-off

#### Scenario: Same level names as developers
- **WHEN** the page describes how much developer work a design costs
- **THEN** it SHALL use the three level names of the ladder page

### Requirement: Shared glossary
The docs SHALL define `variant`, `size`, `colorPalette`, "one-off" and "custom
composition" once, and designer and developer pages SHALL use these meanings.

#### Scenario: One meaning of custom
- **WHEN** a page uses "custom" or "one-off"
- **THEN** it SHALL mean work outside what Nimbus offers
- **AND** designer pages SHALL NOT use "custom colors" for other palettes of the system (Badge uses "Other palette colors")
