## ADDED Requirements

### Requirement: Meter semantics

The component SHALL render a single element with `role="meter"` using React Aria
Components `<Meter>` (React Aria renders `role="meter progressbar"`; the second
token is a fallback for browsers without `meter` support), and SHALL expose
`aria-valuemin`, `aria-valuemax` and `aria-valuenow`. The component SHALL NOT be
focusable and SHALL NOT respond to keyboard input.

#### Scenario: Default range

- **WHEN** a Meter is rendered with `value={40}` and no `minValue`/`maxValue`
- **THEN** the element SHALL have `role="meter"`
- **AND** `aria-valuemin` SHALL be `0`, `aria-valuemax` SHALL be `100`, and
  `aria-valuenow` SHALL be `40`

#### Scenario: Custom range

- **WHEN** `minValue={10}`, `maxValue={60}` and `value={35}` are provided
- **THEN** `aria-valuemin` SHALL be `10`, `aria-valuemax` SHALL be `60`
- **AND** the filled part SHALL cover 50% of the track

#### Scenario: Not interactive

- **WHEN** the user presses Tab through a page that contains a Meter
- **THEN** focus SHALL NOT move to the Meter or any of its parts

### Requirement: Accessible name

The component SHALL have an accessible name, from the visible `label` or from
`aria-label` / `aria-labelledby`.

#### Scenario: Visible label

- **WHEN** `label="Storage"` is provided
- **THEN** the label text SHALL be visible
- **AND** the meter SHALL be labelled by it via `aria-labelledby`

#### Scenario: No visible label

- **WHEN** `layout="minimal"` and `aria-label="Storage"` are provided
- **THEN** the meter's accessible name SHALL be "Storage"

#### Scenario: Missing name

- **WHEN** neither `label`, `aria-label` nor `aria-labelledby` is provided
- **THEN** a warning SHALL be logged in development mode (React Aria's built-in
  missing-label warning)

### Requirement: Value formatting

The component SHALL format the displayed value with `Intl.NumberFormat` in the
current locale, using `formatOptions` (default `{ style: "percent" }`).
`valueLabel` SHALL replace the visible value text.

#### Scenario: Default percent

- **WHEN** `value={72}` is rendered in the `en-US` locale with no
  `formatOptions`
- **THEN** the visible value text SHALL be "72%"

#### Scenario: Unit formatting

- **WHEN** `formatOptions={{ style: "unit", unit: "gigabyte" }}` and
  `value={50}` are provided
- **THEN** the visible value text SHALL be the locale-formatted "50 GB"

#### Scenario: Custom value label

- **WHEN** `valueLabel="50 of 100 GB"` is provided
- **THEN** the visible value text SHALL be "50 of 100 GB"

### Requirement: Value clamping

The component SHALL clamp the drawn width to the range 0%–100% and SHALL NOT
divide by zero.

#### Scenario: Value above maximum

- **WHEN** `value={150}` and `maxValue={100}`
- **THEN** the filled part SHALL cover exactly 100% of the track

#### Scenario: Value below minimum

- **WHEN** `value={-10}` and `minValue={0}`
- **THEN** the filled part SHALL cover 0% of the track

#### Scenario: Empty range

- **WHEN** `minValue` equals `maxValue`
- **THEN** the filled part SHALL cover 0% and no error SHALL be thrown

### Requirement: Multiple segments

The component SHALL accept a `segments` array of
`{ id, label, value, colorPalette? }` as an alternative to `value` (the types
SHALL NOT allow both). Segments SHALL be drawn in array order inside one track,
each with a width proportional to its value within the range, separated by a
visible gap.

#### Scenario: Proportional widths

- **WHEN** `maxValue={100}` and segments with values `30` and `20` are provided
- **THEN** the first segment SHALL cover 30% and the second 20% of the track
- **AND** the remaining 50% SHALL show the empty track

#### Scenario: Total exceeds maximum

- **WHEN** the sum of segment values is greater than `maxValue`
- **THEN** segments SHALL be drawn in order and cut at 100% of the track
- **AND** the component SHALL log a warning in development mode

#### Scenario: Negative segment value

- **WHEN** a segment has a negative value
- **THEN** it SHALL be treated as `0`
- **AND** the component SHALL log a warning in development mode

#### Scenario: Zero segment

- **WHEN** a segment has value `0`
- **THEN** no bar part SHALL be drawn for it
- **AND** it SHALL still appear in the legend

#### Scenario: Empty segments

- **WHEN** `segments={[]}` is provided
- **THEN** an empty track SHALL be rendered and `aria-valuenow` SHALL be `0`

### Requirement: Segment accessibility

In multi-segment mode the component SHALL expose exactly one `role="meter"`.
Segment values are amounts counted from `minValue`. `aria-valuenow` SHALL be
`minValue` plus the sum of the clamped segment amounts, and `aria-valuetext`
SHALL be the formatted total followed, in parentheses, by each segment's label
and formatted value, joined with `Intl.ListFormat` (type `unit`, style `short`).

#### Scenario: Summary value text

- **WHEN** `label="Storage"`,
  `formatOptions={{ style: "unit", unit: "gigabyte" }}` and segments "Images"
  (30) and "Videos" (20) are rendered in `en-US`
- **THEN** there SHALL be exactly one element with `role="meter"`
- **AND** `aria-valuenow` SHALL be `50`
- **AND** `aria-valuetext` SHALL be "50 GB (Images: 30 GB, Videos: 20 GB)"

#### Scenario: No nested meters

- **WHEN** segments are rendered
- **THEN** the meter SHALL be the only element with an explicit `role`

### Requirement: Legend

In multi-segment mode the component SHALL render a visible legend with one item
per segment, showing a color swatch, the segment label and the formatted value.
The legend SHALL be hidden from assistive technology (`aria-hidden="true"`)
because `aria-valuetext` already carries the same information. In single-value
mode no legend SHALL be rendered.

#### Scenario: Legend items

- **WHEN** three segments are provided
- **THEN** the legend SHALL show three items, in segment order, each with
  swatch, label and formatted value

#### Scenario: Legend hidden from assistive technology

- **WHEN** segments are rendered
- **THEN** the legend container SHALL have `aria-hidden="true"`

#### Scenario: No legend for single value

- **WHEN** only `value` is provided
- **THEN** no legend SHALL be rendered

### Requirement: Color

The component SHALL use `colorPalette` (default `primary`) for the fill in
single-value mode and SHALL allow `colorPalette` per segment. Segments without a
`colorPalette` SHALL get colors from a fixed default sequence. Fills SHALL be
flat colors (no gradient) and SHALL NOT animate. Every fill color SHALL have a
contrast ratio of at least 3:1 against the track (WCAG 2.1 SC 1.4.11), and
meaning SHALL NOT depend on color alone (the legend and value text carry it).

#### Scenario: Semantic color

- **WHEN** `colorPalette="critical"` is provided
- **THEN** the fill SHALL use the `critical` palette

#### Scenario: Per-segment color

- **WHEN** a segment has `colorPalette="warning"`
- **THEN** that segment and its legend swatch SHALL use the `warning` palette

#### Scenario: Default segment colors

- **WHEN** segments have no `colorPalette`
- **THEN** each segment SHALL get the next color of the default sequence, and
  adjacent segments SHALL NOT share the same color

### Requirement: Sizes and layouts

The component SHALL support `size` (`2xs` | `md`, default `md`) and `layout`
(`minimal` | `inline` | `stacked`, default `stacked`) with the same meaning as
`ProgressBar`.

#### Scenario: Stacked layout

- **WHEN** `layout="stacked"` with a label
- **THEN** label and value text SHALL be shown above the track

#### Scenario: Inline layout

- **WHEN** `layout="inline"` with a label
- **THEN** label, track and value text SHALL be shown on one line

#### Scenario: Minimal layout

- **WHEN** `layout="minimal"`
- **THEN** only the track SHALL be shown (plus the legend in multi-segment mode)

### Requirement: Style props and ref

The component SHALL accept Nimbus style props on the root and SHALL forward
`ref` to the root element.

#### Scenario: Ref forwarding

- **WHEN** a `ref` is passed
- **THEN** it SHALL point to the element with `role="meter"`
