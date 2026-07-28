## ADDED Requirements

### Requirement: Single-value and range components

The capability SHALL provide two public components — `Slider` (single thumb) and
`RangeSlider` (two thumbs) — backed by one shared internal implementation
(`SliderBase`) that wraps React Aria Components' `Slider` primitive. Each public
component SHALL expose a non-union value type; the union SHALL NOT leak into the
public API.

#### Scenario: Single-value Slider

- **WHEN** a `Slider` is rendered with `value` / `defaultValue`
- **THEN** its value SHALL be a `number`
- **AND** `onChange` / `onChangeEnd` SHALL receive a `number`
- **AND** exactly one thumb SHALL be rendered

#### Scenario: Two-thumb RangeSlider

- **WHEN** a `RangeSlider` is rendered with `value` / `defaultValue`
- **THEN** its value SHALL be a `[number, number]` tuple
- **AND** `onChange` / `onChangeEnd` SHALL receive a `[number, number]` tuple
- **AND** two thumbs SHALL be rendered

### Requirement: Value range, stepping, and clamping

The components SHALL constrain values to a numeric range with discrete steps.
`minValue` SHALL default to `0`, `maxValue` to `100`, and `step` to `1`.

#### Scenario: Values clamp to bounds

- **WHEN** an interaction would move a thumb past `minValue` or `maxValue`
- **THEN** the value SHALL be clamped to that bound

#### Scenario: Values snap to step

- **WHEN** the value changes via keyboard or pointer
- **THEN** the resulting value SHALL be snapped to the nearest `step` increment

#### Scenario: Range thumbs cannot cross

- **WHEN** a `RangeSlider` lower thumb is moved toward or past the upper thumb
  (or vice versa)
- **THEN** the moving thumb SHALL be clamped at the other thumb's value
- **AND** the lower value SHALL remain less than or equal to the upper value

### Requirement: Controlled and uncontrolled modes

The components SHALL support both controlled (`value` + `onChange`) and
uncontrolled (`defaultValue`) usage, and SHALL emit `onChange` continuously
during interaction and `onChangeEnd` when interaction settles.

#### Scenario: Uncontrolled with defaultValue

- **WHEN** only `defaultValue` is provided
- **THEN** the component SHALL manage its own value internally
- **AND** SHALL render the initial value on mount

#### Scenario: onChange during interaction

- **WHEN** a thumb is dragged or stepped
- **THEN** `onChange` SHALL fire with each intermediate value

#### Scenario: onChangeEnd on settle

- **WHEN** an interaction completes (pointer released or key press finishes)
- **THEN** `onChangeEnd` SHALL fire once with the final value

### Requirement: Size variants

The recipe SHALL provide `sm` and `md` size variants (default `md`) that vary
track thickness and thumb diameter via design tokens. Thumb sizing SHALL align
with the Switch control's size grid.

#### Scenario: Medium size (default)

- **WHEN** no `size` is provided
- **THEN** the slider SHALL render at `md`

#### Scenario: Small size

- **WHEN** `size="sm"` is set
- **THEN** the track thickness and thumb diameter SHALL be smaller than `md`
- **AND** the size difference SHALL be driven by tokens, not hardcoded values

### Requirement: Orientation

The components SHALL support `horizontal` (default) and `vertical` orientation
via a recipe variant, positioning the fill, thumb, and ticks along the
appropriate axis.

#### Scenario: Horizontal orientation (default)

- **WHEN** no `orientation` is provided
- **THEN** the track SHALL be laid out along the horizontal axis
- **AND** ArrowRight/ArrowLeft SHALL increase/decrease the value

#### Scenario: Vertical orientation

- **WHEN** `orientation="vertical"` is set
- **THEN** the root SHALL carry `data-orientation="vertical"` and the thumb
  `aria-orientation="vertical"`
- **AND** the track SHALL be laid out along the vertical axis
- **AND** ArrowUp SHALL increase the value

### Requirement: Cosmetic variants

The recipe SHALL provide a cosmetic `variant` prop with three values — `filled`
(default), `minimal`, and `enclosed` — applying identically to `Slider` and
`RangeSlider`. `variant` SHALL compose orthogonally with `size`, `orientation`,
`showTicks`, the value tooltip, and the disabled/invalid states, and SHALL
introduce no behavioral, API, or accessibility change.

#### Scenario: Filled variant (default)

- **WHEN** no `variant` is provided
- **THEN** the slider SHALL render a thin neutral track with a colored filled
  portion and a bordered white thumb

#### Scenario: Minimal variant (idle)

- **WHEN** `variant="minimal"` is set and the control is idle
- **THEN** the slider SHALL render a neutral track whose visible bar is thinner
  than `filled`, carrying a normal-size knob painted a single solid palette
  color (`colorPalette.9`, fill and border together)
- **AND** a single `Slider` SHALL show no progress fill; a `RangeSlider` SHALL
  paint its range segment (the span between the two thumbs) the same
  `colorPalette.9`
- **AND** the keyboard focus ring SHALL remain the brand color

#### Scenario: Minimal variant comes alive when engaged

- **WHEN** a `minimal` slider is hovered, focused, or being dragged
- **THEN** the visible track bar (and, on a `RangeSlider`, the range segment)
  SHALL grow to the normal `filled` thickness
- **AND** the knob (and the range segment) SHALL shift from `colorPalette.9` to
  `colorPalette.10`, while the knob's size stays constant
- **AND** the underlying DOM box sizes SHALL be unchanged — only painted layers
  resize or recolor — so layout, the pointer target, and the thumb-size grid
  match the other variants

#### Scenario: Enclosed variant

- **WHEN** `variant="enclosed"` is set
- **THEN** the track SHALL be as thick as the thumb (iOS-style bar)
- **AND** the thumb SHALL sit contained within the bar with a shadow and no
  visible border

### Requirement: Per-thumb value tooltip

Each thumb SHALL be wrapped in a Nimbus `Tooltip` whose content is that thumb's
current formatted value (`formatOptions`-aware). The tooltip SHALL be open while
the thumb is hovered, keyboard-focused, or being dragged, SHALL be dismissible
with Escape, and SHALL be independent per thumb. There SHALL be no static value
output element.

#### Scenario: Tooltip on hover

- **WHEN** a thumb is hovered
- **THEN** a tooltip showing that thumb's current value SHALL appear

#### Scenario: Tooltip on keyboard focus and update on step

- **WHEN** a thumb receives keyboard focus and is stepped
- **THEN** the tooltip SHALL be visible
- **AND** its text SHALL update to the new value

#### Scenario: Formatted value

- **WHEN** `formatOptions` is provided
- **THEN** the tooltip value SHALL be formatted accordingly

#### Scenario: Independent range tooltips

- **WHEN** a `RangeSlider` renders two thumbs
- **THEN** each thumb SHALL show its own value in its own tooltip

### Requirement: Tick marks

The components SHALL render opt-in tick marks when `showTicks` is set, spaced by
`tickStep` (defaulting to `step`). A tick SHALL always be placed at `maxValue`,
so an unevenly-dividing `tickStep` produces a shorter final interval. Tick
coloring SHALL adapt to whether the tick sits over the fill or under a thumb.

#### Scenario: Ticks disabled by default

- **WHEN** `showTicks` is not set
- **THEN** no tick elements SHALL be rendered

#### Scenario: Ticks at each interval including max

- **WHEN** `showTicks` is set with a `tickStep` (or `step`) that evenly divides
  the range
- **THEN** one tick SHALL be rendered at each interval from `minValue` through
  `maxValue`

#### Scenario: Tick always at maxValue

- **WHEN** `tickStep` does not evenly divide `maxValue - minValue`
- **THEN** a tick SHALL still be placed at `maxValue`

### Requirement: Disabled and invalid states

The components SHALL support a disabled state (via React Aria's `isDisabled`)
and a Nimbus-only invalid state (`isInvalid`). Because React Aria's `Slider` has
no native validation state, `isInvalid` SHALL surface as `data-invalid` on the
root element and SHALL NOT be forwarded to the underlying React Aria slider. The
invalid thumb border SHALL override each variant's own thumb border.

#### Scenario: Disabled state

- **WHEN** `isDisabled` is set
- **THEN** the root SHALL carry `data-disabled` and apply the disabled layer
  style
- **AND** pointer interaction SHALL be prevented

#### Scenario: Invalid styling

- **WHEN** `isInvalid` is set (directly or cloned in by FormField)
- **THEN** the root SHALL carry `data-invalid="true"`
- **AND** the thumb SHALL render a critical-colored border for every variant
- **AND** `isInvalid` SHALL NOT be passed to the React Aria slider

### Requirement: FormField integration

The slider SHALL integrate with `FormField.Root` as a labelable group. Label,
description, and error SHALL be owned by FormField and injected onto the control
(which clones it with React-Aria-named props such as `aria-labelledby` and
`isInvalid`). The slider SHALL render no visible label of its own.

#### Scenario: Label association via FormField

- **WHEN** a slider is placed inside `FormField.Root` with a `FormField.Label`
- **THEN** the slider group SHALL be associated with the label via
  `aria-labelledby`

#### Scenario: Invalid state from FormField

- **WHEN** `FormField.Root` is marked invalid
- **THEN** the injected `isInvalid` SHALL surface as `data-invalid` on the
  slider root

#### Scenario: Remains operable within FormField

- **WHEN** the slider is focused inside a FormField and stepped with the
  keyboard
- **THEN** the value SHALL change and stay within bounds

### Requirement: Accessible labeling and i18n thumb labels

The slider SHALL be usable standalone via an `aria-label` / `aria-labelledby`
for its accessible name, rendering no visible label. `RangeSlider` SHALL apply
localized default thumb labels — `Minimum` and `Maximum` — when `thumbLabels`
are not supplied; a single `Slider` SHALL NOT apply a default per-thumb label.

#### Scenario: Standalone accessible name

- **WHEN** a standalone slider is given `aria-label`
- **THEN** that value SHALL be its accessible name and no visible label SHALL
  render

#### Scenario: Explicit thumb labels

- **WHEN** `thumbLabels` is provided
- **THEN** each thumb SHALL use the corresponding label as its `aria-label`

#### Scenario: Localized default range thumb labels

- **WHEN** a `RangeSlider` is rendered without `thumbLabels`
- **THEN** the lower thumb SHALL be labeled with the localized `Minimum` string
  and the upper thumb with the localized `Maximum` string

### Requirement: Keyboard interaction and WCAG 2.1 AA compliance

All thumbs SHALL be operable by keyboard and meet WCAG 2.1 AA. React Aria SHALL
provide the ARIA `slider` role, value attributes, keyboard handling, focus
management, RTL support, and touch behavior.

#### Scenario: Arrow key stepping

- **WHEN** a focused thumb receives ArrowRight/ArrowUp or ArrowLeft/ArrowDown
- **THEN** the value SHALL increase or decrease by `step`

#### Scenario: Home and End

- **WHEN** a focused thumb receives Home or End
- **THEN** the value SHALL jump to `minValue` or `maxValue` respectively

#### Scenario: Focus-visible ring

- **WHEN** a thumb is focused via keyboard
- **THEN** a visible focus ring SHALL be shown on the thumb

#### Scenario: ARIA slider semantics

- **WHEN** the slider renders
- **THEN** each thumb SHALL expose `role="slider"` with `aria-valuenow`,
  `aria-valuemin`, and `aria-valuemax`

### Requirement: Thumb centering

The thumb SHALL be centered on the cross axis of the track in both orientations.
Because React Aria positions the thumb on the main axis only, the recipe SHALL
supply cross-axis centering (`top: 50%` for horizontal, `inset-inline-start: 50%`
for vertical) in an RTL-safe way without overriding React Aria's inline
main-axis position.

#### Scenario: Horizontal thumb centered

- **WHEN** a horizontal slider renders
- **THEN** the thumb center SHALL align with the track's vertical center

#### Scenario: Vertical thumb centered

- **WHEN** a vertical slider renders
- **THEN** the thumb center SHALL align with the track's horizontal center
- **AND** centering SHALL remain correct under RTL
