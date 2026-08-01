## MODIFIED Requirements

### Requirement: Component spacing defaults

All component recipes SHALL use spacing token references shifted down ~1 stop
from their previous values, producing ~25-30% less whitespace by default. The
spacing token scale itself SHALL NOT change — only which tokens recipes select.

#### Scenario: Spacing shift applies uniformly

- **WHEN** a recipe previously used spacing token `"400"` (16px)
- **THEN** it SHALL now use `"300"` (12px)
- **AND** the same proportional shift SHALL apply to all spacing properties
  (padding, gap, margin) across all 43 affected recipe files

#### Scenario: Floor values are preserved

- **WHEN** a recipe uses spacing token `"50"` (2px) or `"25"` (1px)
- **THEN** the value SHALL remain unchanged
- **AND** no spacing value SHALL be reduced below `"25"` (1px)

#### Scenario: CSS custom property values shift equally

- **WHEN** a recipe assigns a CSS custom property like `"spacing.400"`
- **THEN** it SHALL shift to `"spacing.300"`
- **AND** curly-brace interpolations like `{spacing.400}` SHALL shift to
  `{spacing.300}`

#### Scenario: Component APIs unchanged

- **WHEN** a consumer uses any Nimbus component
- **THEN** all props, types, and interfaces SHALL remain identical to before
- **AND** only the visual rendering SHALL differ (denser spacing)

### Requirement: Test assertions reflect new spacing

Story tests that assert specific pixel values for padding or height SHALL be
updated to match the new spacing values.

#### Scenario: DataTable cell padding assertions

- **WHEN** the DataTable Condensed story test checks cell padding
- **THEN** default padding SHALL assert `12px` vertical and `16px` horizontal
- **AND** condensed padding SHALL assert `8px 16px`

#### Scenario: Card padding assertion

- **WHEN** the Card "Without Compound" story test checks root padding
- **THEN** it SHALL assert `12px` for size `md`
