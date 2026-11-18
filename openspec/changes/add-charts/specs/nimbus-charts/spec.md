## Purpose

Charts that show data series in Area, Bar, Line, Pie, Radar and Radial form, with Nimbus colors, tooltips, legends and accessible keyboard and screen reader behavior.

## ADDED Requirements

### Requirement: Chart Components
The system SHALL export `AreaChart`, `BarChart`, `LineChart`, `PieChart`, `RadarChart` and `RadialChart` from `@commercetools/nimbus`.

#### Scenario: Chart renders data
- **WHEN** a chart receives `data`, `config` and `aria-label`
- **THEN** it SHALL render an SVG chart that shows each configured series
- **AND** it SHALL set `displayName`

#### Scenario: Cartesian chart props
- **WHEN** `AreaChart`, `BarChart`, `LineChart` or `RadarChart` is used
- **THEN** it SHALL accept `xAxisKey` and `series`
- **AND** SHALL accept `showLegend`, `showGrid` and `showTooltip`

#### Scenario: Stacked series
- **WHEN** `AreaChart` or `BarChart` receives `stacked`
- **THEN** it SHALL stack the series on top of each other

#### Scenario: Category chart props
- **WHEN** `PieChart` or `RadialChart` is used
- **THEN** it SHALL accept `nameKey` and `valueKey` instead of `xAxisKey` and `series`
- **AND** each category SHALL take its color from the `config` entry for its name

#### Scenario: No Recharts API exposed
- **WHEN** a consumer imports from `@commercetools/nimbus`
- **THEN** no Recharts component SHALL be exported
- **AND** charts SHALL NOT accept Recharts parts as children

### Requirement: Chart Config
The system SHALL accept a `ChartConfig` that maps each data key to a label and a palette name.

#### Scenario: Palette color
- **WHEN** a config entry has `palette: "violet"`
- **THEN** the series SHALL be drawn with `var(--nimbus-chart-violet)`
- **AND** that color SHALL be the closest version of the palette's solid color that has at least 3:1 contrast against the current background
- **AND** the color SHALL change with light and dark mode without JavaScript

#### Scenario: Palettes with a black contrast color
- **WHEN** a config entry uses a palette whose contrast color is black (for example `yellow`)
- **THEN** TypeScript SHALL report an error, because it is not a chart palette

#### Scenario: Labels
- **WHEN** a config entry has a `label`
- **THEN** the tooltip and the legend SHALL show that label and the same color as the series

#### Scenario: Unknown series key
- **WHEN** `series` contains a key that is not in `config`
- **THEN** the chart SHALL skip that series
- **AND** SHALL log a warning in development

#### Scenario: Invalid palette
- **WHEN** a config entry has a palette name that does not exist
- **THEN** the chart SHALL log a warning in development
- **AND** SHALL use the first palette in production

### Requirement: Chart Accessibility
Charts SHALL meet WCAG 2.1 AA.

#### Scenario: Required label
- **WHEN** a consumer uses a chart without `aria-label`
- **THEN** TypeScript SHALL report an error

#### Scenario: Keyboard navigation
- **WHEN** the chart has focus and the user presses ArrowRight or ArrowLeft
- **THEN** the active data point SHALL move to the next or previous point
- **AND** the tooltip SHALL show that point
- **AND** the chart SHALL be reachable with the Tab key

#### Scenario: Screen reader
- **WHEN** the active data point changes
- **THEN** the tooltip content SHALL be announced through a live region

#### Scenario: Color is not the only signal
- **WHEN** a Bar or Pie chart has adjacent bars or slices
- **THEN** they SHALL be separated by a gap or an outline
- **AND** the legend SHALL show a text label for each series

#### Scenario: Series with many lines
- **WHEN** a Line chart has more series than the documented threshold
- **THEN** each line SHALL also have a different dash style or marker

#### Scenario: Contrast
- **WHEN** a series is drawn with a palette color
- **THEN** it SHALL have at least 3:1 contrast against the current background of the active color mode, in light and dark mode

### Requirement: Chart Appearance
Charts SHALL look like the shadcn charts (https://ui.shadcn.com/charts), in Nimbus colors.

#### Scenario: Reference look
- **WHEN** a chart is rendered
- **THEN** its grid, axes, bar and slice shapes, tooltip and legend SHALL follow the visual traits recorded from the shadcn reference screenshots in `design.md`
- **AND** all colors SHALL come from Nimbus tokens

#### Scenario: Area fill
- **WHEN** an `AreaChart` draws the area under a line
- **THEN** the area SHALL use an intermediate color between the series color and the current background
- **AND** the line on top SHALL use the full-strength series color

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
- **THEN** the chart SHALL use a default aspect ratio and SHALL NOT collapse to zero height

### Requirement: Chart Tooltip and Legend
Charts SHALL show a Nimbus-styled tooltip and legend that read the shared config.

#### Scenario: Tooltip
- **WHEN** `showTooltip` is true and the user hovers or focuses a data point
- **THEN** a tooltip SHALL show the label, color and value of each series at that point

#### Scenario: Legend
- **WHEN** `showLegend` is true
- **THEN** a legend SHALL show the label and color of each series

### Requirement: Chart Tests and Docs
Each chart SHALL have Storybook tests, documentation and a consumer example.

#### Scenario: Story tests
- **WHEN** story tests run for a chart
- **THEN** they SHALL cover render, empty state, loading state, tooltip and legend, keyboard navigation, and light and dark mode

#### Scenario: Consumer example
- **WHEN** a consumer reads the developer documentation of a chart
- **THEN** it SHALL include a copy-ready example from `*.docs.spec.tsx`
