# activity-indicator Specification

## Purpose

Shows that an agent or a background process is working, as animated dots next to text such as "Thinking…".

## Requirements

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

The ActivityIndicator SHALL accept fixed `size` values `2xs`, `xs`, `sm`, `md`, and `lg`. For a fixed size the root SHALL reserve a square icon-box footprint that matches the LoadingSpinner at the same size, so the indicator can be placed in input start/end icon slots like any other icon.

#### Scenario: Footprint matches the LoadingSpinner scale points

- **WHEN** an ActivityIndicator is rendered with a fixed `size`
- **THEN** the root's `width` and `height` both equal the LoadingSpinner scale point for that size (2xs=350, xs=500, sm=600, md=800, lg=1000)
- **AND** the square `<svg>` scales to fill that box, with the three dots composed inside its `viewBox` grid

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

#### Scenario: Decorative regardless of props

- **WHEN** an ActivityIndicator is rendered with any combination of props
- **THEN** the root has `aria-hidden="true"`
- **AND** the root has no `role` attribute

#### Scenario: No aria-label prop

- **WHEN** a consumer uses the ActivityIndicator
- **THEN** the public type does not expose an `aria-label` prop

#### Scenario: Not a progress indicator

- **WHEN** an ActivityIndicator is rendered
- **THEN** it does not use React Aria and does not expose `role="progressbar"`, because it is non-interactive and does not report progress

### Requirement: No component-owned live region

The ActivityIndicator SHALL NOT own a live region. The indicator is usually mounted only while activity is in progress, and a `role="status"`/`aria-live` region that mounts together with its content is not announced reliably by screen readers, because a live region must already exist in the DOM before its content changes.

#### Scenario: No live-region attributes

- **WHEN** an ActivityIndicator is rendered with any combination of props
- **THEN** the root has no live-region attributes (`aria-live`, `role="status"`)

#### Scenario: Announcement is owned by the consumer

- **WHEN** the activity needs to be announced to assistive technology
- **THEN** it is announced by a consumer-owned live region that stays in the DOM during the activity, not by the component

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
