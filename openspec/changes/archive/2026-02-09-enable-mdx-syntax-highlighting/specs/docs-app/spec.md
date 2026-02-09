## ADDED Requirements

### Requirement: Live Code Meta String Transformation
The system SHALL transform standard language identifiers with meta strings into combined language identifiers for live code detection.

#### Scenario: Preview live code block
- **WHEN** MDX contains a fenced code block with lang `jsx` and meta string containing `live`
- **THEN** the `remarkLiveCode` plugin SHALL set lang to `jsx-live`
- **AND** the Code component SHALL render a LiveCodeEditor with preview tab active

#### Scenario: Editor live code block
- **WHEN** MDX contains a fenced code block with lang `jsx` and meta string containing `live-dev`
- **THEN** the `remarkLiveCode` plugin SHALL set lang to `jsx-live-dev`
- **AND** the Code component SHALL render a LiveCodeEditor with editor tab active

#### Scenario: Meta string precedence
- **WHEN** meta string contains `live-dev`
- **THEN** the plugin SHALL match `live-dev` before `live` to prevent false partial matches

#### Scenario: Non-live code blocks unchanged
- **WHEN** MDX contains a fenced code block without `live` in the meta string
- **THEN** the plugin SHALL NOT modify the lang identifier

## MODIFIED Requirements

### Requirement: Interactive Code Examples
The system SHALL provide live code editor with real-time preview.

#### Scenario: Live code rendering
- **WHEN** MDX contains `jsx live` or `jsx live-dev` fenced code block (standard lang with meta string)
- **THEN** SHALL render LiveCodeEditor component
- **AND** SHALL provide React Live scope with all Nimbus components and icons
- **AND** SHALL show preview and code tabs
- **AND** SHALL support real-time editing with instant preview updates

#### Scenario: Code transformation
- **WHEN** code example includes imports
- **THEN** SHALL automatically strip import statements
- **AND** SHALL make components available as globals
- **AND** SHALL provide syntax highlighting with Prism
