## MODIFIED Requirements

### Requirement: Interactive Code Examples
The system SHALL provide live code editor with real-time preview.

#### Scenario: Live code rendering
- **WHEN** MDX contains `jsx live` or `jsx live-dev` fenced code block (standard lang with meta string)
- **THEN** SHALL render LiveCodeEditor component
- **AND** SHALL provide React Live scope with all Nimbus components and icons
- **AND** SHALL show a preview with a code toggle that opens the editor (see `docs-page-presentation`, "Example frame")
- **AND** SHALL support real-time editing with instant preview updates

#### Scenario: Code transformation
- **WHEN** code example includes imports
- **THEN** SHALL automatically strip import statements
- **AND** SHALL make components available as globals
- **AND** SHALL provide syntax highlighting with Prism
