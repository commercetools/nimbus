## MODIFIED Requirements

### Requirement: Fixed icon-box sizing for slot placement

The ActivityIndicator SHALL accept fixed `size` values `2xs`, `xs`, `sm`, `md`, and `lg`. For a fixed size the root SHALL reserve a square icon-box footprint that matches the LoadingSpinner at the same size, so the indicator can be placed in input start/end icon slots like any other icon.

#### Scenario: Fixed size reserves a square footprint

- **WHEN** an ActivityIndicator is rendered with `size="md"`
- **THEN** the root reserves a square footprint matching the `md` icon scale point
- **AND** the dots are visually centered within that square

#### Scenario: Square footprint does not affect layout

- **WHEN** an ActivityIndicator with a fixed size is placed next to sibling content
- **THEN** its footprint is the square icon box, matching a LoadingSpinner at the same size
- **AND** the sibling content is not shifted
- **AND** no scrollbars are introduced by the indicator

#### Scenario: Footprint matches the LoadingSpinner scale points

- **WHEN** an ActivityIndicator is rendered with a fixed `size`
- **THEN** the root's `width` and `height` both equal the LoadingSpinner scale point for that size (2xs=350, xs=500, sm=600, md=800, lg=1000)
- **AND** the square `<svg>` scales to fill that box, with the three dots composed inside its `viewBox` grid, so the footprint stays square and does not expand the box content size

### Requirement: Purely decorative accessibility contract

The ActivityIndicator SHALL be purely decorative: the root SHALL always have `aria-hidden="true"` and no ARIA role, and the component SHALL NOT accept an `aria-label` prop. Conveying the activity state to assistive technology is the consumer's responsibility — through adjacent visible text (e.g. "Thinking…") or a live region owned by the surrounding chat/turn container.

#### Scenario: Decorative regardless of props

- **WHEN** an ActivityIndicator is rendered with any combination of props
- **THEN** the root has `aria-hidden="true"`
- **AND** the root has no `role` attribute
- **AND** the root has no live-region attributes (`aria-live`, `role="status"`)

#### Scenario: No aria-label prop

- **WHEN** a consumer uses the ActivityIndicator
- **THEN** the public type does not expose an `aria-label` prop
- **AND** activity is announced (if needed) by a consumer-owned persistent live region, not by the component

## ADDED Requirements

### Requirement: No component-owned live region

The ActivityIndicator SHALL NOT own a live region. Because the indicator is typically mounted only while activity is in progress, a component-owned `role="status"`/`aria-live` region would mount together with its content and would not be announced reliably across screen readers: a live region must already exist in the DOM before its content changes, and an `aria-label` on a region with no text content is likewise not reliably announced as a live update.

#### Scenario: No live region anywhere in the component

- **WHEN** an ActivityIndicator is rendered with any combination of props
- **THEN** neither the root nor any element inside it has `aria-live` or `role="status"`

### Requirement: Not a progress indicator

The ActivityIndicator SHALL NOT use React Aria and SHALL NOT expose `role="progressbar"`, because it is non-interactive and is not a progress indicator.

#### Scenario: No progressbar role

- **WHEN** an ActivityIndicator is rendered with any combination of props
- **THEN** neither the root nor any element inside it has `role="progressbar"`
