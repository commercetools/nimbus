## Purpose

Charts that show data series in Area, Bar, Line, Pie, Radar and Radial form,
with Nimbus colors, tooltips, legends and accessible keyboard and screen reader
behavior.

## ADDED Requirements

### Requirement: Chart Components

The system SHALL export `AreaChart`, `BarChart`, `LineChart`, `PieChart`,
`RadarChart` and `RadialChart` from `@commercetools/nimbus`.

#### Scenario: Chart renders data

- **WHEN** a chart receives `data`, `config` and `aria-label`
- **THEN** it SHALL render an SVG chart that shows each configured series
- **AND** it SHALL set `displayName`

#### Scenario: Cartesian chart props

- **WHEN** `AreaChart`, `BarChart`, `LineChart` or `RadarChart` is used
- **THEN** it SHALL accept `xAxisKey` and `series`
- **AND** SHALL accept `showGrid` and `showTooltip`
- **AND** SHALL accept `showLegend`, which is effective only for a single series

#### Scenario: Stacked series

- **WHEN** `AreaChart` or `BarChart` receives `stacked`
- **THEN** it SHALL stack the series on top of each other

#### Scenario: Category chart props

- **WHEN** `PieChart` or `RadialChart` is used
- **THEN** it SHALL accept `nameKey` and `valueKey` instead of `xAxisKey` and
  `series`
- **AND** each category SHALL take its color from the `config` entry for its
  name

#### Scenario: Recharts is not part of the public API

- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** the six charts, the `Chart` namespace and the shared chart types
  SHALL be exported for charts
- **AND** no Recharts component, hook or type SHALL be exported or required to
  use a chart
- **AND** charts SHALL accept only the documented props, not Recharts parts as
  children

### Requirement: Chart Composition

The system SHALL export a `Chart` namespace with `Root`, `Plot`, `Bar`, `Line`,
`Area`, `XAxis`, `Grid` and `Tooltip` to compose cartesian charts, for example
bars and a line in one chart.

#### Scenario: Mixed chart

- **WHEN** `Chart.Plot` contains a `Chart.Bar` and a `Chart.Line` inside
  `Chart.Root`
- **THEN** it SHALL draw both series in one chart with the colors and labels
  from `config`
- **AND** the legend and tooltip SHALL list both series

#### Scenario: Same behavior as the components

- **WHEN** a chart is composed from the parts
- **THEN** it SHALL show the empty state, the loading state, the legend rule,
  the tooltip, the keyboard behavior and the reduced-motion behavior of the six
  charts
- **AND** `aria-label` SHALL be required on `Chart.Root`

#### Scenario: Series parts

- **WHEN** a series part has a `dataKey` that is in `series` of `Chart.Root`
- **THEN** it SHALL take its color from the resolved `config`
- **AND** a `dataKey` that is not in `series` SHALL draw nothing
- **AND** `Chart.Line` SHALL use dash patterns when the chart has more than 3
  series
- **AND** `Chart.Bar` and `Chart.Area` SHALL stack with `stacked`

#### Scenario: Default series

- **WHEN** `Chart.Root` has no `series`
- **THEN** the series SHALL be the keys of `config`, in order

#### Scenario: Parts outside the root

- **WHEN** a part is used outside `Chart.Root`
- **THEN** it SHALL throw an error that names `Chart.Root`

#### Scenario: Documented

- **WHEN** a consumer reads the `Chart` documentation
- **THEN** it SHALL include a copy-ready mixed chart example from
  `chart.docs.spec.tsx`

### Requirement: Recharts Peer Dependency

The system SHALL treat Recharts as an external peer dependency of
`@commercetools/nimbus`.

#### Scenario: Package setup

- **WHEN** the `@commercetools/nimbus` package is built and published
- **THEN** `recharts` SHALL be a peer dependency and a dev dependency, and SHALL
  be external in the library build
- **AND** `pnpm check:bundle-size` and `pnpm check:bundler-compat` SHALL pass

#### Scenario: Installation docs

- **WHEN** a consumer reads the installation docs
- **THEN** a "Charts (Optional)" section SHALL tell them to install `recharts`
  and `react-is`

### Requirement: Chart Config

The system SHALL accept a `ChartConfig` that maps each data key to a label and a
chart palette name.

#### Scenario: Palette is optional

- **WHEN** a config entry has no `palette`
- **THEN** the chart SHALL use the palette of the default order that matches the
  position of the series (or category)

#### Scenario: Palette color

- **WHEN** a config entry has `palette: "violet"`
- **THEN** the series SHALL be drawn with `var(--nimbus-colors-chart-violet)`
- **AND** that color SHALL be the palette's solid color, adapted only in
  lightness to have at least 3:1 contrast against the current background
- **AND** the color SHALL change with light and dark mode without JavaScript

#### Scenario: Palette names are typed

- **WHEN** a consumer writes a palette name in `config`
- **THEN** TypeScript SHALL accept only the chart palette names
- **AND** SHALL report an error for a palette with a black contrast color (for
  example `yellow`)

#### Scenario: Labels

- **WHEN** a config entry has a `label`
- **THEN** the tooltip and the legend SHALL show that label and the same color
  as the series

#### Scenario: Unknown series key

- **WHEN** `series` contains a key that is not in `config`
- **THEN** the chart SHALL skip that series
- **AND** SHALL log a warning in development

#### Scenario: Invalid palette at run time

- **WHEN** a config entry has a palette name that is not a chart palette (for
  example from untyped data)
- **THEN** the chart SHALL log a warning in development
- **AND** SHALL use the first palette in the default order in production

### Requirement: Chart Accessibility

Charts SHALL meet WCAG 2.1 AA.

#### Scenario: Required label

- **WHEN** a consumer uses a chart without `aria-label`
- **THEN** TypeScript SHALL report an error

#### Scenario: Recharts defaults are kept

- **WHEN** a chart is rendered
- **THEN** it SHALL keep the Recharts accessibility layer defaults, which are
  `role="application"` and `tabIndex={0}`
- **AND** a story test SHALL check both

#### Scenario: Keyboard navigation

- **WHEN** the chart has focus and the user presses ArrowRight or ArrowLeft
- **THEN** the active data point SHALL move to the next or previous point
- **AND** the tooltip SHALL show that point
- **AND** the chart SHALL be reachable with the Tab key
- **AND** pressing Enter SHALL hide or show the tooltip

#### Scenario: Screen reader

- **WHEN** the active data point changes
- **THEN** the tooltip content SHALL be announced through a live region
- **AND** the tooltip SHALL have `role="status"` and `aria-live="assertive"`

#### Scenario: Legend with two or more series

- **WHEN** a chart has two or more series or categories
- **THEN** the legend SHALL be shown with a text label for each series
- **AND** `showLegend` SHALL have no effect on that chart

#### Scenario: Single series legend

- **WHEN** a chart has one series
- **THEN** the legend SHALL be shown only when `showLegend` is true

#### Scenario: Separation of adjacent shapes

- **WHEN** a Bar chart has adjacent bars, or a Pie or Radial chart has adjacent
  slices
- **THEN** they SHALL be separated by a 2 px stroke in the `bg` color

#### Scenario: Series with many lines

- **WHEN** a Line chart has more than 3 series
- **THEN** each line SHALL also have a dash pattern from a list of six different
  patterns
- **AND** with more than 6 series the patterns SHALL repeat

#### Scenario: Default palette order

- **WHEN** a chart assigns palettes by default order
- **THEN** the default order SHALL have exactly 11 palettes, in this order:
  `ctviolet`, `orange`, `teal`, `crimson`, `blue`, `grass`, `plum`, `bronze`,
  `cyan`, `red`, `slate`
- **AND** each pair of these palettes SHALL differ by a deltaE2000 of at least
  15, in light and dark mode
- **AND** a chart with more than 11 series SHALL warn in development and reuse
  palettes in the same order
- **AND** a consumer MAY choose any other chart palette by name
- **AND** a unit test SHALL check the order

#### Scenario: Series contrast

- **WHEN** a series is drawn with a palette color
- **THEN** it SHALL have at least 3:1 contrast against the current background of
  the active color mode, in light and dark mode

#### Scenario: Text contrast

- **WHEN** a chart shows text (axis labels, legend, tooltip, empty state)
- **THEN** the text SHALL use the `fg` or `fg.subtle` token
- **AND** SHALL have at least 4.5:1 contrast against its background in light and
  dark mode

#### Scenario: Grid lines

- **WHEN** a chart shows grid lines
- **THEN** they SHALL be decorative and need not reach 3:1

### Requirement: Chart Axis Labels

Cartesian charts SHALL keep the first and last x axis label.

#### Scenario: Long or many labels

- **WHEN** a Bar, Line or Area chart has x axis labels that do not all fit
- **THEN** the first and the last label SHALL be drawn and lie inside the chart
- **AND** labels in between that would overlap SHALL be dropped
- **AND** Line and Area charts SHALL keep a 12 px margin on the left and right

### Requirement: Radial Rings

A `RadialChart` SHALL draw one ring for each category.

#### Scenario: Ring geometry

- **WHEN** a `RadialChart` is drawn
- **THEN** each ring SHALL start at the top and grow clockwise on a light gray
  track
- **AND** the ring with the largest value SHALL be a full circle, and every
  other ring SHALL be drawn relative to it

### Requirement: Chart Appearance

Charts SHALL look like the shadcn charts (https://ui.shadcn.com/charts), in
Nimbus colors.

#### Scenario: Reference look

- **WHEN** a chart is rendered
- **THEN** its grid, axes, bar and slice shapes, tooltip and legend SHALL follow
  the visual traits recorded from the shadcn reference screenshots in
  `design.md`
- **AND** all colors SHALL come from Nimbus tokens

#### Scenario: Smooth curves without overshoot

- **WHEN** a `LineChart` or an `AreaChart` draws a series
- **THEN** it SHALL use monotone interpolation, so a curve never goes below the
  lowest or above the highest value of the data

#### Scenario: Area fill

- **WHEN** an `AreaChart` draws the area under a line
- **THEN** the area SHALL use a vertical gradient of the series color, from
  about 0.8 opacity at the line to about 0.1 opacity at the baseline
- **AND** the line on top SHALL use the full series color

### Requirement: Chart Motion

Charts SHALL respect the reduced motion preference.

#### Scenario: Animation prop

- **WHEN** a chart receives `isAnimationActive`
- **THEN** it SHALL turn the Recharts draw animation on or off accordingly

#### Scenario: Reduced motion

- **WHEN** `isAnimationActive` is not set and the user prefers reduced motion
- **THEN** the chart SHALL draw without animation

### Requirement: Chart States

Charts SHALL show clear empty and loading states.

#### Scenario: Empty data

- **WHEN** `data` is an empty array
- **THEN** the chart SHALL show an empty state instead of a blank area

#### Scenario: Loading

- **WHEN** `isLoading` is true
- **THEN** the chart SHALL show the Nimbus skeleton

#### Scenario: Container size

- **WHEN** the parent has no fixed height
- **THEN** the chart SHALL use a default aspect ratio and SHALL NOT collapse to
  zero height

### Requirement: Chart Tooltip and Legend

Charts SHALL show a Nimbus-styled tooltip and legend that read the shared
config.

#### Scenario: Tooltip

- **WHEN** `showTooltip` is true and the user hovers or focuses a data point
- **THEN** a tooltip SHALL show the label, color and value of each series at
  that point

#### Scenario: Legend content

- **WHEN** the legend is shown
- **THEN** it SHALL show the label and color of each series

### Requirement: Chart Tests and Docs

Each chart SHALL have Storybook tests, documentation and a consumer example.

#### Scenario: Story tests

- **WHEN** story tests run for a chart
- **THEN** they SHALL cover render, empty state, loading state, tooltip and
  legend, keyboard navigation, and light and dark mode
- **AND** the same cases SHALL be covered for every chart type, with the cases
  that do not apply to a type recorded in its story file
- **AND** snapshotted chart stories SHALL turn off or finish the Recharts
  animation, because Chromatic does not pause JavaScript animations

#### Scenario: Consumer example

- **WHEN** a consumer reads the developer documentation of a chart
- **THEN** it SHALL include a copy-ready example from `*.docs.spec.tsx`
