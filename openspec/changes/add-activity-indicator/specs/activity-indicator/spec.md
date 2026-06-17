## ADDED Requirements

### Requirement: Animated three-dot rendering

The ActivityIndicator SHALL render exactly three dot elements as `<span>` tags inside a `<span>` root element, never using `<div>`. The three dots SHALL display staggered base opacities (0.4, 0.6, 0.8) and animate with a vertical bounce using staggered animation delays so the dots bounce in sequence.

#### Scenario: Renders three span dots

- **WHEN** an ActivityIndicator is rendered with default props
- **THEN** the root element is a `<span>`
- **AND** it contains exactly three `<span>` dot elements

#### Scenario: Dots animate in a staggered sequence

- **WHEN** an ActivityIndicator is rendered and motion is allowed
- **THEN** each dot has a vertical bounce animation
- **AND** each dot's animation begins at a staggered delay so they bounce in sequence

### Requirement: Em-relative default sizing

The ActivityIndicator SHALL default to `size="inherit"`, where the root is laid out as `display: inline-flex` with `font-size: inherit` and the dot geometry is expressed in em units (dot diameter ≈ 0.375em, gap ≈ 0.25em). In this mode the indicator SHALL flow inline in normal document flow and its footprint SHALL be the intrinsic width of the dots, scaling proportionally with the surrounding `font-size`.

#### Scenario: Default size scales with surrounding font-size

- **WHEN** an ActivityIndicator with the default size is placed inside text with a larger `font-size`
- **THEN** the dots render proportionally larger
- **AND** the indicator flows inline within the text without reserving a fixed square box

### Requirement: Fixed icon-box sizing for slot placement

The ActivityIndicator SHALL accept fixed `size` values `2xs`, `xs`, `sm`, `md`, and `lg`. For a fixed size the root SHALL reserve a square icon-box footprint whose `width` and `height` match the corresponding LoadingSpinner scale point (2xs=350, xs=500, sm=600, md=800, lg=1000) so the indicator can be placed in input start/end icon slots like any other icon. The dots SHALL be rendered in an absolutely-positioned layer centered over the square box so that the wider-than-square dots overflow the box horizontally as decoration WITHOUT expanding the box content size or shifting sibling layout.

#### Scenario: Fixed size reserves a square footprint

- **WHEN** an ActivityIndicator is rendered with `size="md"`
- **THEN** the root reserves a square footprint matching the `md` icon scale point
- **AND** the dots are visually centered within that square

#### Scenario: Dots overflow without affecting layout

- **WHEN** an ActivityIndicator with a fixed size is placed next to sibling content
- **THEN** the dots may extend horizontally beyond the square box edges
- **AND** the sibling content is not shifted by the overflowing dots
- **AND** no scrollbars are introduced by the indicator

### Requirement: Decorative-by-default accessibility contract

The ActivityIndicator SHALL be decorative by default: when no `aria-label` is provided, the root SHALL have `aria-hidden="true"` and no ARIA role, on the assumption that adjacent visible text conveys the state. When an `aria-label` is provided, the root SHALL instead expose `role="status"` and `aria-live="polite"` with that accessible name, for standalone use. The component SHALL NOT use React Aria and SHALL NOT expose `role="progressbar"`, because it is non-interactive and is not a progress indicator.

#### Scenario: Decorative when unlabeled

- **WHEN** an ActivityIndicator is rendered without an `aria-label`
- **THEN** the root has `aria-hidden="true"`
- **AND** the root has no `role` attribute

#### Scenario: Live status when labeled

- **WHEN** an ActivityIndicator is rendered with an `aria-label`
- **THEN** the root has `role="status"` and `aria-live="polite"`
- **AND** the accessible name matches the provided label
- **AND** the root is not `aria-hidden`

### Requirement: Color palette theming

The ActivityIndicator SHALL support a `colorPalette` prop with values `primary` and `white`, defaulting to `primary`, mirroring LoadingSpinner (`primary` maps to `ctvioletAlpha`, `white` maps to `whiteAlpha`). The dots SHALL be colored from the active color palette token.

#### Scenario: Both palettes render

- **WHEN** an ActivityIndicator is rendered with `colorPalette="primary"` and again with `colorPalette="white"`
- **THEN** the dots are colored from the corresponding palette in each case

### Requirement: Reduced-motion support

The ActivityIndicator SHALL respect `prefers-reduced-motion: reduce` by replacing the vertical bounce animation with a gentle opacity pulse. The indicator SHALL NOT become fully static and silent under reduced motion, so the "working" state remains perceivable.

#### Scenario: Reduced motion replaces bounce with pulse

- **WHEN** the user agent reports `prefers-reduced-motion: reduce`
- **THEN** the dots do not perform the vertical bounce animation
- **AND** the dots convey activity via a gentle opacity pulse instead

### Requirement: Internationalized default label

The ActivityIndicator SHALL provide an internationalized default activity label (e.g. "Agent is typing") under the `Nimbus.ActivityIndicator.*` key namespace. This default label SHALL only be applied when the consumer opts into a labeled (live-region) presentation; it SHALL NOT be announced when the indicator is decorative, so that a misleading default is never surfaced to assistive technology.

#### Scenario: Default label used only when labeled

- **WHEN** an ActivityIndicator is rendered as a live region without an explicit label string
- **THEN** the internationalized default activity label is used as its accessible name

#### Scenario: No label announced when decorative

- **WHEN** an ActivityIndicator is rendered decoratively (no `aria-label`)
- **THEN** no default label is exposed to assistive technology
