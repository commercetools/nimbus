## ADDED Requirements

### Requirement: Animated three-dot rendering

The ActivityIndicator SHALL render a `<span>` root element (never `<div>`) containing a single square `<svg>` (`viewBox="0 0 24 24"`, `aria-hidden`) with exactly three `<circle>` dots. The three dots SHALL display staggered base opacities (0.4, 0.6, 0.8) and animate with a vertical bounce using staggered animation delays so the dots bounce in sequence.

#### Scenario: Renders three circle dots inside an svg

- **WHEN** an ActivityIndicator is rendered with default props
- **THEN** the root element is a `<span>`
- **AND** it contains exactly one `<svg>` with three `<circle>` dot elements

#### Scenario: Dots animate in a staggered sequence

- **WHEN** an ActivityIndicator is rendered and motion is allowed
- **THEN** each dot has a vertical bounce animation
- **AND** each dot's animation begins at a staggered delay so they bounce in sequence

### Requirement: Em-relative default sizing

The ActivityIndicator SHALL default to `size="inherit"`, where the root is laid out as `display: inline-flex` (with the dots centered) and sized as a `1em` square box, so the SVG fills it. In this mode the indicator SHALL flow inline with — and scale proportionally to — the surrounding `font-size`.

#### Scenario: Default size scales with surrounding font-size

- **WHEN** an ActivityIndicator with the default size is placed inside text with a larger `font-size`
- **THEN** the indicator renders proportionally larger
- **AND** the indicator flows inline within the text

### Requirement: Fixed icon-box sizing for slot placement

The ActivityIndicator SHALL accept fixed `size` values `2xs`, `xs`, `sm`, `md`, and `lg`. For a fixed size the root SHALL reserve a square icon-box footprint whose `width` and `height` match the corresponding LoadingSpinner scale point (2xs=350, xs=500, sm=600, md=800, lg=1000) so the indicator can be placed in input start/end icon slots like any other icon. The square `<svg>` SHALL scale to fill that box, with the three dots composed inside its `viewBox` grid so the footprint stays square and does not expand the box content size or shift sibling layout.

#### Scenario: Fixed size reserves a square footprint

- **WHEN** an ActivityIndicator is rendered with `size="md"`
- **THEN** the root reserves a square footprint matching the `md` icon scale point
- **AND** the dots are visually centered within that square

#### Scenario: Square footprint does not affect layout

- **WHEN** an ActivityIndicator with a fixed size is placed next to sibling content
- **THEN** its footprint is the square icon box, matching a LoadingSpinner at the same size
- **AND** the sibling content is not shifted
- **AND** no scrollbars are introduced by the indicator

### Requirement: Purely decorative accessibility contract

The ActivityIndicator SHALL be purely decorative: the root SHALL always have `aria-hidden="true"` and no ARIA role, and the component SHALL NOT accept an `aria-label` prop. Conveying the activity state to assistive technology is the consumer's responsibility — through adjacent visible text (e.g. "Thinking…") or a live region owned by the surrounding chat/turn container.

The component SHALL NOT own a live region. Because the indicator is typically mounted only while activity is in progress, a component-owned `role="status"`/`aria-live` region would mount together with its content and would not be announced reliably across screen readers (a live region must already exist in the DOM before its content changes; an `aria-label` on a region with no text content is likewise not reliably announced as a live update). The component SHALL NOT use React Aria and SHALL NOT expose `role="progressbar"`, because it is non-interactive and is not a progress indicator.

#### Scenario: Decorative regardless of props

- **WHEN** an ActivityIndicator is rendered with any combination of props
- **THEN** the root has `aria-hidden="true"`
- **AND** the root has no `role` attribute
- **AND** the root has no live-region attributes (`aria-live`, `role="status"`)

#### Scenario: No aria-label prop

- **WHEN** a consumer uses the ActivityIndicator
- **THEN** the public type does not expose an `aria-label` prop
- **AND** activity is announced (if needed) by a consumer-owned persistent live region, not by the component

### Requirement: Color palette theming

The ActivityIndicator SHALL support a `colorPalette` prop accepting any Nimbus color palette, defaulting to `primary`, with no `LoadingSpinner`-style restriction and no per-palette remap. By default the dots SHALL be filled from the active palette's `11` shade.

#### Scenario: Default palette renders

- **WHEN** an ActivityIndicator is rendered with default props
- **THEN** the dots are filled from the `primary` palette's `11` shade

#### Scenario: Any Nimbus palette renders

- **WHEN** an ActivityIndicator is rendered with an arbitrary palette (e.g. `colorPalette="positive"` or `colorPalette="ctyellow"`)
- **THEN** the dots are filled from that palette's `11` shade

### Requirement: Contrast variant for solid surfaces

The ActivityIndicator SHALL support a `variant` prop with values `plain` (default) and `contrast`. `plain` SHALL fill the dots from `colorPalette.11`. `contrast` SHALL fill the dots from `colorPalette.contrast` — the palette's auto black/white step — so the dots remain legible when placed on a solid `colorPalette.9`-style colored surface.

#### Scenario: Plain variant uses the colored step

- **WHEN** an ActivityIndicator is rendered with the default `variant` (or `variant="plain"`)
- **THEN** the dots are filled from `colorPalette.11`

#### Scenario: Contrast variant uses the contrast step

- **WHEN** an ActivityIndicator is rendered with `variant="contrast"` on a solid colored surface
- **THEN** the dots are filled from `colorPalette.contrast`
- **AND** that step resolves to black or white per palette (e.g. a light palette yields black dots, a dark palette yields white dots)

### Requirement: Reduced-motion support

The ActivityIndicator SHALL respect `prefers-reduced-motion: reduce` by replacing the vertical bounce animation with a gentle opacity pulse. The indicator SHALL NOT become fully static and silent under reduced motion, so the "working" state remains perceivable.

#### Scenario: Reduced motion replaces bounce with pulse

- **WHEN** the user agent reports `prefers-reduced-motion: reduce`
- **THEN** the dots do not perform the vertical bounce animation
- **AND** the dots convey activity via a gentle opacity pulse instead
