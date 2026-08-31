# @commercetools/nimbus-viz

Data visualization library for the [Nimbus](../../README.md) design system — a
set of React chart components built on [visx](https://airbnb.io/visx/) and
themed with Nimbus design tokens.

> 🚧 **Prototype stage.** The public surface is still settling and the version
> is `0.0.0` (unpublished). APIs may change before the first release.

## Install

```bash
pnpm add @commercetools/nimbus-viz
```

`react` and `react-dom` are peer dependencies.

## Quick start

Every chart reads its colors from a `ChartThemeProvider`, and takes an explicit
pixel `width`/`height`. Wrap charts once near the root, then use
`ResponsiveContainer` to size a chart to its parent:

```tsx
import {
  ChartThemeProvider,
  ResponsiveContainer,
  LineChart,
} from "@commercetools/nimbus-viz";

const series = [
  {
    id: "orders",
    label: "Orders",
    data: [
      { x: new Date("2024-01-01"), y: 120 },
      { x: new Date("2024-02-01"), y: 145 },
      { x: new Date("2024-03-01"), y: 138 },
    ],
  },
];

export function OrdersTrend() {
  return (
    <ChartThemeProvider mode="light">
      <ResponsiveContainer height={260}>
        {(width, height) => (
          <LineChart width={width} height={height} series={series} />
        )}
      </ResponsiveContainer>
    </ChartThemeProvider>
  );
}
```

`useChartTheme` throws if a chart is rendered outside a `ChartThemeProvider`, so
the provider is required.

## Theming & dark mode

`ChartThemeProvider` resolves every chart color (ink, grid, accent, categorical
ramp, positive/negative, surface) from Nimbus tokens for the given `mode`:

```tsx
<ChartThemeProvider mode={isDark ? "dark" : "light"}>
  {/* … */}
</ChartThemeProvider>
```

Dark mode is a **selected** palette (its own token steps against the dark
surface), not an automatic inversion. Wire `mode` to your host app's active
Nimbus color mode.

Chart text is isolated from host CSS: each chart's root `<svg>` pins the font
family and a fluid base font-size, so charts look the same whether or not the
surrounding page resets typography.

## Sizing

`ResponsiveContainer` measures its parent and hands a chart a positive
`width`/`height`, re-rendering on resize. Two modes:

```tsx
{
  /* Fixed height, fluid width */
}
<ResponsiveContainer height={260}>
  {(w, h) => <BarChart width={w} height={h} data={data} />}
</ResponsiveContainer>;

{
  /* Height derived from an aspect ratio, clamped */
}
<ResponsiveContainer aspectRatio={1.7} minHeight={200} maxHeight={320}>
  {(w, h) => <BarChart width={w} height={h} data={data} />}
</ResponsiveContainer>;
```

Charts render nothing until a positive size is observed, so they never compute
against a zero-size layout.

## Consistent entity colors across charts

Wrap a dashboard in `ColorScaleProvider` with the full set of entity ids so a
given series keeps one color across every chart (a line, its stacked bar, its
legend). Colors are assigned in fixed categorical order — never cycled:

```tsx
import { ColorScaleProvider } from "@commercetools/nimbus-viz";

<ColorScaleProvider domain={["EU", "US", "APAC"]}>
  {/* GroupedBarChart, LineChart, DonutChart… all agree on each region's hue */}
</ColorScaleProvider>;
```

## Interaction & accessibility

- **Tooltips** — every plot with inspectable marks ships a hover tooltip out of
  the box (identity header + formatted values). Self-labeling displays
  (`StatCard`, `Gauge`, `Sparkline`, `DataTable`) and the center-readout donut
  are the deliberate exceptions.
- **Accessibility** — each chart renders as `role="img"` with a sensible default
  `aria-label`; pass `ariaLabel` to override. `DataTable` renders semantic table
  markup.
- **Legends** — any chart that distinguishes two or more entities by color
  carries a legend or direct labels, so identity is never color-alone.

## Component catalog

47 components, grouped by the question they answer. The families track the
[FT Visual Vocabulary](https://github.com/Financial-Times/chart-doctor/tree/main/visual-vocabulary):

| Family / intent       | Components                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| Trend over time       | `LineChart`, `StackedAreaChart`, `Streamgraph`, `Sparkline`, `ControlChart`, `CandlestickChart`   |
| Categorical magnitude | `BarChart`, `GroupedBarChart`, `LollipopChart`, `RadialBarChart`, `Histogram`, `ParetoChart`      |
| Part-to-whole         | `StackedBarChart`, `DonutChart`, `Treemap`, `Sunburst`, `WaffleChart`, `Marimekko`, `FunnelChart` |
| Deviation             | `DivergingBarChart`, `DivergingStackedBar` (Likert), `PopulationPyramid`                          |
| Compare / delta       | `DumbbellChart`, `SlopeChart`, `WaterfallChart`, `BulletChart`                                    |
| Rank                  | `BumpChart`                                                                                       |
| Relationship          | `ScatterPlot`, `BubbleChart`, `ConnectedScatterplot`, `RadarChart`, `ParallelCoordinates`         |
| Distribution          | `BoxPlot`, `ViolinPlot`, `BeeswarmPlot`, `CumulativeCurve`                                        |
| Matrix / retention    | `Heatmap`, `CalendarHeatmap`, `CohortTriangle`, `RfmGrid`                                         |
| Flow                  | `SankeyDiagram`, `ChordDiagram`                                                                   |
| Timeline / schedule   | `GanttChart`                                                                                      |
| Spatial               | `TileGridMap`                                                                                     |
| Single value          | `StatCard`, `Gauge`                                                                               |
| Tabular fallback      | `DataTable`                                                                                       |

Composable **overlays** (`ReferenceLine`, `TargetMarker`, `TrendLine`,
`ThresholdBand`, `ConfidenceBand`, `ErrorBars`, `BenchmarkSeries`, `Annotation`,
`EventMarkers`, `NowLine`) layer annotations over the axis-based charts.

> **Geographic data.** `TileGridMap` is a **tile/hex grid** (equal-area regions
> laid out on a grid), not a geographic **choropleth**. It's the supported geo
> option today; a true boundary-shape choropleth is intentionally not shipped —
> it needs vetted, licensed boundary data (topojson) that isn't bundled. Reach
> for `TileGridMap` for "metric by region" comparisons where exact geography
> isn't required.

## Development

This package lives in the Nimbus monorepo.

```bash
# Type-check
pnpm --filter @commercetools/nimbus-viz typecheck

# Unit + render tests (Vitest, jsdom) — classifier, resolver routing, and a
# render-smoke that resolves and mounts every registered chart
pnpm --filter @commercetools/nimbus-viz test

# Build (tsup → dist ESM + CJS + d.ts)
pnpm --filter @commercetools/nimbus-viz build

# Run the interactive gallery (Vite) — browse every chart by type and intent
pnpm --filter @commercetools/nimbus-viz gallery
```

The gallery under `gallery/` is a development tool for reviewing chart quality,
catalog coverage, and per-intent presets with realistic sample data.
