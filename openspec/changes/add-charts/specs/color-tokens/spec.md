## ADDED Requirements

### Requirement: Chart Palette Tokens
The system SHALL provide chart palette tokens that are the solid color of a palette, adapted so that it has at least 3:1 contrast against the current background in light mode and in dark mode.

#### Scenario: Chart palette selection
- **WHEN** chart palette tokens are generated
- **THEN** the system SHALL include only palettes whose `contrast` token is white
- **AND** SHALL read the `contrast` token from the generated palette data, not from a hand-written list
- **AND** SHALL NOT include palettes whose `contrast` token is black

#### Scenario: Solid color is adapted by lightness only
- **WHEN** a chart token is generated for a palette and a color mode
- **THEN** the system SHALL start from the palette's solid color (`DEFAULT`)
- **AND** SHALL change only its lightness, as little as needed, until its contrast against the current background of that mode is at least 3:1
- **AND** SHALL compute contrast with chroma-js `contrast()`
- **AND** SHALL keep the hue of the solid color close to the original

#### Scenario: Solid color already has enough contrast
- **WHEN** the solid color of a palette already has at least 3:1 contrast against the current background of the mode
- **THEN** the chart token SHALL equal the solid color

#### Scenario: Adapted separately for each mode
- **WHEN** the solid color differs between light and dark mode, or the backgrounds differ
- **THEN** the system SHALL adapt the color separately for each mode

#### Scenario: Intermediate colors
- **WHEN** chart tokens are generated for a palette and a color mode
- **THEN** the system SHALL generate intermediate colors between the adapted solid color and the current background of that mode
- **AND** the adapted solid color SHALL remain the full-strength color of the palette

#### Scenario: Token output
- **WHEN** chart palette tokens are consumed by `@commercetools/nimbus-tokens`
- **THEN** each chart palette SHALL have one chart token with a light-mode value and a dark-mode value
- **AND** the generated CSS variable SHALL be named `--nimbus-chart-<palette>`

#### Scenario: Contrast is tested
- **WHEN** the unit tests run
- **THEN** a test SHALL check every adapted chart color in both color modes for at least 3:1 contrast against the current background
- **AND** the test SHALL fail if any adapted chart color is below 3:1
