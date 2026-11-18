## ADDED Requirements

### Requirement: Chart Color Tokens
The system SHALL provide one chart color token per chart palette. The token SHALL be the solid color of the palette, adapted in lightness so that it has at least 3:1 contrast against the current background in light mode and in dark mode.

#### Scenario: Chart palette selection
- **WHEN** chart color tokens are generated
- **THEN** the system SHALL include only palettes whose `contrast` token is white
- **AND** SHALL compute the contrast color with the function the palette generator uses (`calculateContrastColor` in `contrast-color.ts`), not from a hand-written list

#### Scenario: Current background
- **WHEN** a chart color is checked for contrast
- **THEN** the system SHALL use the `bg` token of the color mode as the background
- **AND** that background SHALL be `#fff` in light mode and the dark `neutral.1` color in dark mode

#### Scenario: Solid color is adapted by lightness only
- **WHEN** the solid color (`DEFAULT`) of a palette has less than 3:1 contrast against the current background
- **THEN** the system SHALL change only its lightness in OKLCH, in the direction that increases contrast
- **AND** the adapted color SHALL have a contrast of at least 3:1 and at most 3.2:1 against the current background
- **AND** for chromatic colors (OKLCH chroma of at least 0.02) the hue SHALL be within 3 degrees of the solid color
- **AND** achromatic colors SHALL be checked for lightness and contrast only
- **AND** SHALL compute contrast with chroma-js `contrast()`

#### Scenario: Solid color already has enough contrast
- **WHEN** the solid color of a palette already has at least 3:1 contrast against the current background of the mode
- **THEN** the chart token SHALL equal the solid color

#### Scenario: Adapted separately for each mode
- **WHEN** the solid color or the background differs between light and dark mode
- **THEN** the system SHALL adapt the color separately for each mode

#### Scenario: Token output
- **WHEN** chart color tokens are generated
- **THEN** the system SHALL write them to the committed file `packages/tokens/src/base/chart-tokens.json`
- **AND** `@commercetools/nimbus-tokens` SHALL read that file as a Style Dictionary source
- **AND** each chart palette SHALL have one token `color.chart.<palette>` with the shape `{ light: { DEFAULT }, dark: { DEFAULT } }`, so that it has a light-mode value and a dark-mode value
- **AND** the generated CSS variable SHALL be `--nimbus-colors-chart-<palette>`
- **AND** the Nimbus theme SHALL register the tokens as `chart` in the semantic color tokens

#### Scenario: Contrast is checked on the emitted value
- **WHEN** the tokens build converts a chart color to its generated format (rounded HSL)
- **THEN** the contrast tests SHALL measure the value as emitted, not the hex value before conversion
- **AND** the generator SHALL choose a value whose emitted form still has at least 3:1 contrast

#### Scenario: Output matches the palettes
- **WHEN** the build or the tests run
- **THEN** a check SHALL fail if `chart-tokens.json` differs from the output of the generator

#### Scenario: Contrast is tested with failing fixtures
- **WHEN** the unit tests run
- **THEN** a test SHALL check every chart color in both color modes for at least 3:1 contrast against the current background
- **AND** a test SHALL use `orange` in light mode (2.97:1 before, at least 3:1 after) as a fixture that changes
- **AND** a test SHALL use a synthetic dark solid such as `#484848` on `#111111` (2.06:1 before, at least 3:1 after) as a fixture that changes
- **AND** the tests SHALL fail if any chart color is below 3:1
