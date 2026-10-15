## ADDED Requirements

### Requirement: Compound parts

The component SHALL be a compound component with the parts `Meter.Root`,
`Meter.Label`, `Meter.Value`, `Meter.Track` and `Meter.Legend`. `Meter.Root`
SHALL hold all data (`value` or `segments`, `minValue`, `maxValue`,
`formatOptions`, `valueLabel`, `colorPalette`). The other parts SHALL hold no
values and SHALL read what they show from `Meter.Root`. Each part except
`Meter.Root` SHALL be optional.

#### Scenario: Only the track

- **WHEN** `Meter.Root` contains only `Meter.Track`
- **THEN** only the bar SHALL be shown
- **AND** `aria-valuenow` and `aria-valuetext` SHALL be the same as with all
  parts rendered

#### Scenario: Part outside Root

- **WHEN** `Meter.Value` is rendered outside `Meter.Root`
- **THEN** an error SHALL be thrown that names `Meter.Root`

### Requirement: Meter semantics

`Meter.Root` SHALL render a single element with `role="meter"` using React Aria
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

The meter SHALL have an accessible name, from `Meter.Label` or from `aria-label`
/ `aria-labelledby` on `Meter.Root`.

#### Scenario: Visible label

- **WHEN** `<Meter.Label>Storage</Meter.Label>` is rendered inside `Meter.Root`
- **THEN** the label text SHALL be visible
- **AND** the meter SHALL be labelled by it via `aria-labelledby`

#### Scenario: No visible label

- **WHEN** `Meter.Root` has `aria-label="Storage"` and no `Meter.Label`
- **THEN** the meter's accessible name SHALL be "Storage"

#### Scenario: Missing name

- **WHEN** there is no `Meter.Label` and `Meter.Root` has neither `aria-label`
  nor `aria-labelledby`
- **THEN** a warning SHALL be logged in development mode (React Aria's built-in
  missing-label warning)

### Requirement: Value formatting

`Meter.Value` SHALL show the value formatted with `Intl.NumberFormat` in the
current locale, using `formatOptions` on `Meter.Root` (default
`{ style: "percent" }`). `valueLabel` SHALL replace the visible value text.

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
- **AND** the legend and `aria-valuetext` SHALL show each segment's drawn
  amount, so `[60, 60]` with `maxValue={100}` is announced as "100% (A: 60%, B:
  40%)"
- **AND** the component SHALL log a warning in development mode

#### Scenario: Negative segment value

- **WHEN** a segment has a negative value
- **THEN** it SHALL be treated as `0`, including in the legend and
  `aria-valuetext`
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
With `segments`, `minValue` SHALL be `0` (enforced by the type), so the parts
add up to the total. `aria-valuenow` SHALL be the sum of the clamped segment
amounts, and `aria-valuetext`
SHALL be the formatted total followed, in parentheses, by each segment's label
and formatted value, joined with `Intl.ListFormat` (type `unit`, style `short`).

#### Scenario: Summary value text

- **WHEN** `<Meter.Label>Storage</Meter.Label>`,
  `formatOptions={{ style: "unit", unit: "gigabyte" }}` and segments "Images"
  (30) and "Videos" (20) are rendered in `en-US`
- **THEN** there SHALL be exactly one element with `role="meter"`
- **AND** `aria-valuenow` SHALL be `50`
- **AND** `aria-valuetext` SHALL be "50 GB (Images: 30 GB, Videos: 20 GB)"

#### Scenario: No nested meters

- **WHEN** segments are rendered
- **THEN** the meter SHALL be the only element with an explicit `role`

### Requirement: Legend

In multi-segment mode `Meter.Legend` SHALL render a visible legend with one item
per segment, showing a color swatch, the segment label and the formatted value.
The legend SHALL be hidden from assistive technology (`aria-hidden="true"`)
because `aria-valuetext` already carries the same information. In single-value
mode `Meter.Legend` SHALL render nothing. When `segments` are given and no
`Meter.Legend` is rendered, `Meter.Root` SHALL log a development warning,
because the segments would then differ by color only.

#### Scenario: Legend items

- **WHEN** three segments are provided and `Meter.Legend` is rendered
- **THEN** the legend SHALL show three items, in segment order, each with
  swatch, label and formatted value

#### Scenario: Legend hidden from assistive technology

- **WHEN** segments are rendered with `Meter.Legend`
- **THEN** the legend container SHALL have `aria-hidden="true"`

#### Scenario: No legend for single value

- **WHEN** only `value` is provided and `Meter.Legend` is rendered
- **THEN** no legend SHALL be rendered

#### Scenario: Segments without legend

- **WHEN** `segments` are provided and no `Meter.Legend` is rendered
- **THEN** a development warning SHALL be logged that names `Meter.Legend`

### Requirement: Color

The component SHALL use `colorPalette` (default `primary`) for the fill in
single-value mode and SHALL allow `colorPalette` per segment. Segments without a
`colorPalette` SHALL get colors from a fixed default sequence. Fills SHALL be
flat colors (no gradient) using the palette's solid step (`colorPalette.9`) and
SHALL NOT animate. Meaning SHALL NOT depend on color alone (the legend and value
text carry it).

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

### Requirement: Thresholds

`Meter.Root` SHALL accept `thresholds` (an array of `{ from, colorPalette }`)
for a single `value`. The fill SHALL use the `colorPalette` of the threshold
with the highest `from` that the clamped value reaches (greater than or equal
to `from`). Below all thresholds, the fill SHALL use `colorPalette` of
`Meter.Root`. The order of the array SHALL NOT change the result. The type
SHALL NOT allow `thresholds` together with `segments`.

#### Scenario: Value reaches a threshold

- **WHEN** `value={92}` and `thresholds` are `warning` from 80 and `critical`
  from 95
- **THEN** the fill SHALL use the `warning` palette

#### Scenario: Value at a threshold

- **WHEN** `value={95}` with the same thresholds
- **THEN** the fill SHALL use the `critical` palette

#### Scenario: Value below all thresholds

- **WHEN** `value={50}` with the same thresholds and no `colorPalette`
- **THEN** the fill SHALL use the `primary` palette

### Requirement: Sizes and layouts

`Meter.Root` SHALL support `size` (`sm` | `md` | `lg`, default `md`), which sets
the bar thickness (4px, 8px, 12px) and a matching text style for label, value
and legend (`sm` → `xs`, `md` → `sm`, `lg` → `md`). The `textStyle` style prop
SHALL change the text, on `Meter.Root` for all parts or on one part only.

`Meter.Root` SHALL support `layout` (`stacked` | `inline`, default `stacked`),
which places each part in a fixed area. The result SHALL NOT depend on the order
in which the parts are written. A part that is left out SHALL leave no empty
space.

#### Scenario: Default text style follows size

- **WHEN** `size="lg"` and no `textStyle` is provided
- **THEN** the bar SHALL be 12px high and the text SHALL use text style `md`

#### Scenario: Text style on Root

- **WHEN** `size="sm"` and `textStyle="md"` are set on `Meter.Root`
- **THEN** the bar SHALL be 4px high and label, value and legend SHALL use text
  style `md`

#### Scenario: Text style on one part

- **WHEN** `textStyle="xl"` is set on `Meter.Value` only
- **THEN** the value text SHALL use text style `xl` and the label SHALL keep the
  default text style

#### Scenario: Stacked layout

- **WHEN** `layout="stacked"` with `Meter.Label`, `Meter.Value` and
  `Meter.Track`
- **THEN** the label SHALL be at the start and the value text at the end of one
  line above the track

#### Scenario: Inline layout

- **WHEN** `layout="inline"` with `Meter.Label`, `Meter.Value` and `Meter.Track`
- **THEN** label, track and value text SHALL be shown on one line, in this order

#### Scenario: Parts in another order

- **WHEN** the parts are written in another order inside `Meter.Root`
- **THEN** they SHALL be placed as in the same layout with the default order

### Requirement: Style props and ref

The component SHALL accept Nimbus style props on the root and SHALL forward
`ref` to the root element.

#### Scenario: Ref forwarding

- **WHEN** a `ref` is passed
- **THEN** it SHALL point to the element with `role="meter"`
