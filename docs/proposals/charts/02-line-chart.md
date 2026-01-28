# Proposal #2: Line Chart

> **Status**: Ready for Implementation **Depends on**: Foundation (#0) **Can
> parallel with**: KPI Card (#1), Bar Chart (#3) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md) **Last Updated**: 2026-01-27
> (brainstorm complete)

## Overview

A line chart component for visualizing trends over time. Core use case: revenue,
orders, and session trends in e-commerce dashboards.

## Scope

### Component API (Simple Props)

Building on `BaseChartProps` from Foundation:

```tsx
interface LineChartProps<
  T extends Record<string, unknown>,
> extends BaseChartProps<T> {
  // Line-specific
  curveType?: "linear" | "smooth" | "step" | "stepAfter"; // default: "linear"
  connectNulls?: boolean; // default: false

  // X-axis
  xAxisType?: "category" | "time"; // auto-detected if omitted

  // Markers (applied to all lines in simple mode)
  showMarkers?: boolean; // default: false
  markerSize?: "sm" | "md" | "lg"; // default: "md"
}
```

**Usage:**

```tsx
<LineChart
  data={salesData}
  index="date"
  categories={["revenue", "orders"]}
  config={{
    revenue: { label: "Revenue", color: "chart.1" },
    orders: { label: "Orders", color: "chart.2" },
  }}
  curveType="smooth"
  showLegend
  showMarkers
  valueFormatter={(v) => `$${v.toLocaleString()}`}
/>
```

The simple API covers single Y-axis cases. For dual Y-axis, consumers must use
the compound API.

### Component API (Compound Composition)

The compound API enables full control, including dual Y-axis:

```tsx
<LineChart.Root data={salesData} config={config} xAxisType="time">
  {/* Axes - dual Y-axis via id */}
  <LineChart.XAxis tickFormatter={formatMonth} />
  <LineChart.YAxis id="left" label="Revenue ($)" />
  <LineChart.YAxis id="right" orientation="right" label="Orders" />

  {/* Lines - per-series control */}
  <LineChart.Line
    dataKey="revenue"
    yAxisId="left"
    curveType="smooth"
    showMarkers
    markerSize="sm"
  />
  <LineChart.Line dataKey="orders" yAxisId="right" curveType="linear" />

  {/* Optional elements */}
  <LineChart.Grid horizontal vertical={false} />
  <LineChart.Tooltip />
  <LineChart.Legend position="bottom" />
</LineChart.Root>
```

**Compound parts:**

| Part      | Purpose                                                                  |
| --------- | ------------------------------------------------------------------------ |
| `Root`    | Context provider, contains scales and data                               |
| `XAxis`   | X-axis with optional `tickFormatter`, `tickCount`                        |
| `YAxis`   | Y-axis with `id`, `orientation`, `label`, `tickFormatter`                |
| `Line`    | Individual series with `dataKey`, `yAxisId`, curve and marker props      |
| `Grid`    | Grid lines via `ChartGrid` primitive                                     |
| `Tooltip` | Shared tooltip with point highlight                                      |
| `Legend`  | Clickable legend with `position: "top" \| "bottom" \| "left" \| "right"` |

### Features

- Multiple series support
- Dual Y-axis support (left/right) via compound API
- Auto-detected or explicit X-axis type (category/time)
- Curve interpolation: linear, smooth, step, stepAfter
- Per-series data point markers with size control
- Shared tooltip at x-position with nearest point highlight
- Clickable legend to toggle series visibility
- Configurable null/missing data handling (`connectNulls`)
- Grid lines (optional)
- Responsive container via `ChartContainer`

### Visx Integration

**Packages used:**

| Package         | Components/Utilities                                           |
| --------------- | -------------------------------------------------------------- |
| `@visx/shape`   | `LinePath` for lines, `Circle` for markers                     |
| `@visx/axis`    | `AxisBottom`, `AxisLeft`, `AxisRight`                          |
| `@visx/scale`   | `scaleLinear`, `scaleTime`, `scaleBand`                        |
| `@visx/grid`    | Via `ChartGrid` primitive from Foundation                      |
| `@visx/tooltip` | `useTooltip`, `TooltipWithBounds`                              |
| `@visx/event`   | `localPoint` for mouse position                                |
| `@visx/curve`   | `curveLinear`, `curveMonotoneX`, `curveStep`, `curveStepAfter` |

**Scale construction:**

```tsx
// X-axis scale (inside Root)
const xScale =
  xAxisType === "time"
    ? scaleTime({ domain: [minDate, maxDate], range: [0, innerWidth] })
    : scaleBand({ domain: categories, range: [0, innerWidth], padding: 0.1 });

// Y-axis scales (one per axis id)
const yScales = {
  left: scaleLinear({ domain: [0, maxLeft], range: [innerHeight, 0] }),
  right: scaleLinear({ domain: [0, maxRight], range: [innerHeight, 0] }),
};
```

**Context structure:**

```tsx
interface LineChartContextValue {
  data: Record<string, unknown>[];
  config: ChartConfig;
  xScale: ScaleBand<string> | ScaleTime<number, number>;
  yScales: Record<string, ScaleLinear<number, number>>;
  innerWidth: number;
  innerHeight: number;
  hiddenSeries: Set<string>;
  toggleSeries: (key: string) => void;
}
```

### Tooltip & Interaction Behavior

**Tooltip mechanics:**

- Mouse move finds nearest x-position via `localPoint` and `bisector`
- Shows all visible series values at that index
- Nearest data point gets enlarged marker (highlight effect)

**Tooltip content (shared at x-position):**

```
┌─────────────────────────┐
│ January 2024            │  ← index label (formatted)
│ ● Revenue: $45,230      │  ← color dot + label + value
│ ● Orders: 1,243         │  ← each visible series
└─────────────────────────┘
```

**Hidden series behavior:**

- Hidden series excluded from tooltip
- Y-axis domain recalculates to fit only visible series
- Tooltip still shows at same x-position, just fewer entries

**Legend interaction:**

- Click to toggle series visibility (hide/show)
- Hidden series get dimmed/struck-through legend item
- Internal state or controlled via `hiddenSeries` prop

### Accessibility

**Using `useChartA11y` from Foundation:**

```tsx
const { getContainerProps, getDataPointProps, announce, focusedIndex } =
  useChartA11y({
    navigationMode: "linear", // Arrow left/right
    dataPoints: data.map((d) => ({
      label: labelFormatter?.(d[indexKey]) ?? String(d[indexKey]),
      value: categories
        .map(
          (cat) =>
            config[cat].label + ": " + (valueFormatter?.(d[cat]) ?? d[cat])
        )
        .join(", "),
    })),
    onFocusChange: (index) => {
      // Sync tooltip with keyboard focus
      showTooltip({ tooltipData: { index, values: getValuesAtIndex(index) } });
    },
  });
```

**Keyboard navigation:**

| Key       | Action                         |
| --------- | ------------------------------ |
| `←` / `→` | Move focus between data points |
| `Home`    | Jump to first data point       |
| `End`     | Jump to last data point        |
| `Escape`  | Clear focus, hide tooltip      |

**Screen reader announcements:**

```tsx
// On focus change, announce via aria-live
announce(`${label}: ${formattedValues}`);
// Example: "January 2024: Revenue $45,230, Orders 1,243"
```

### Accessibility Implementation

```tsx
<div
  ref={containerRef}
  role="figure"
  aria-labelledby={titleId}
  aria-describedby={descId}
  tabIndex={0}
  onKeyDown={handleKeyDown}
  className={styles.container}
>
  <VisuallyHidden id={titleId}>{config.title || "Line chart"}</VisuallyHidden>
  <VisuallyHidden id={descId}>
    {generateDescription(data, categories, config)}
  </VisuallyHidden>

  <svg role="presentation" aria-hidden="true">
    {/* All visual chart elements */}
  </svg>

  {/* Hidden data table for screen readers */}
  <ChartDataTable
    data={data}
    index={index}
    categories={categories}
    config={config}
  />
</div>
```

**Focus indicators:**

- Focused data point gets a visible ring (2px solid, uses `chart.axis` token)
- Focus ring respects `outline-offset` for clarity against the line

### Recipe & Slots

```tsx
// line-chart.recipe.ts
import { sva } from "@chakra-ui/react";

export const lineChartRecipe = sva({
  className: "nimbus-line-chart",
  slots: [
    "root", // Outer container
    "svg", // SVG element
    "grid", // Grid lines
    "axis", // Axis lines and ticks
    "axisLabel", // Axis label text
    "line", // Line path
    "marker", // Data point markers
    "markerHighlight", // Hovered/focused marker
    "tooltip", // Tooltip container
    "tooltipLabel", // Tooltip header (index label)
    "tooltipItem", // Tooltip row (color + label + value)
    "legend", // Legend container
    "legendItem", // Legend entry (clickable)
    "legendDot", // Color indicator in legend
  ],
  base: {
    root: { position: "relative", width: "full" },
    svg: { display: "block", overflow: "visible" },
    axis: { color: "chart.axis", fontSize: "xs" },
    axisLabel: { color: "chart.label", fontSize: "sm", fontWeight: "medium" },
    line: { fill: "none", strokeWidth: 2 },
    marker: { strokeWidth: 2, stroke: "bg.base" },
    markerHighlight: {
      strokeWidth: 3,
      transition: "var(--nimbus-chart-transition)",
    },
    tooltip: { bg: "bg.overlay", shadow: "md", rounded: "md", p: 2 },
    legend: { display: "flex", gap: 4, flexWrap: "wrap" },
    legendItem: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      _disabled: { opacity: 0.5, textDecoration: "line-through" },
    },
  },
});
```

### i18n Messages

```tsx
// line-chart.i18n.ts
import { defineMessages } from "@internationalized/message";

export const lineChartMessages = defineMessages({
  // Accessibility
  chartLabel: {
    id: "nimbus-charts.line-chart.label",
    defaultMessage: "Line chart showing {description}",
  },
  dataPointAnnouncement: {
    id: "nimbus-charts.line-chart.data-point",
    defaultMessage: "{label}: {values}",
  },
  seriesHidden: {
    id: "nimbus-charts.line-chart.series-hidden",
    defaultMessage: "{series} hidden",
  },
  seriesShown: {
    id: "nimbus-charts.line-chart.series-shown",
    defaultMessage: "{series} shown",
  },

  // Legend
  legendToggle: {
    id: "nimbus-charts.line-chart.legend-toggle",
    defaultMessage: "Toggle {series} visibility",
  },

  // Axes (for dual Y-axis)
  leftAxis: {
    id: "nimbus-charts.line-chart.left-axis",
    defaultMessage: "Left axis",
  },
  rightAxis: {
    id: "nimbus-charts.line-chart.right-axis",
    defaultMessage: "Right axis",
  },
});
```

### Files to Create

```
packages/nimbus-charts/src/components/line-chart/
├── line-chart.tsx           # Main component + compound exports
├── line-chart.types.ts      # Props, context types
├── line-chart.recipe.ts     # Slot recipe
├── line-chart.slots.ts      # Styled slot components
├── line-chart.i18n.ts       # Messages
├── line-chart.stories.tsx   # Stories with play functions
├── line-chart.mdx           # Documentation
├── index.ts                 # Public exports
└── components/
    ├── line-chart-root.tsx      # Context provider, scales
    ├── line-chart-line.tsx      # LinePath + markers
    ├── line-chart-x-axis.tsx    # AxisBottom wrapper
    ├── line-chart-y-axis.tsx    # AxisLeft/AxisRight wrapper
    ├── line-chart-tooltip.tsx   # Tooltip with highlight
    └── line-chart-legend.tsx    # Clickable legend
```

## Deliverables

- [ ] Simple props API for common use cases
- [ ] Compound API with Root, Line, XAxis, YAxis, Tooltip, Legend, Grid
- [ ] Dual Y-axis support via `yAxisId`
- [ ] Auto-detected or explicit `xAxisType` (category/time)
- [ ] Curve types: linear, smooth, step, stepAfter
- [ ] Per-series markers with size control
- [ ] Shared tooltip with nearest point highlight
- [ ] Clickable legend to toggle series
- [ ] `connectNulls` prop for missing data handling
- [ ] Full keyboard navigation via `useChartA11y`
- [ ] Recipe with slots
- [ ] i18n messages
- [ ] Stories covering all variants with play function tests
- [ ] MDX documentation

## Stories

| Story          | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| `Basic`        | Single series, default options                       |
| `MultiSeries`  | Two series, shared Y-axis                            |
| `DualYAxis`    | Revenue + Orders with left/right axes                |
| `CurveTypes`   | Visual comparison of linear, smooth, step, stepAfter |
| `WithMarkers`  | Markers enabled, different sizes                     |
| `TimeAxis`     | Date objects on X-axis with `xAxisType="time"`       |
| `WithLegend`   | Legend at different positions                        |
| `MissingData`  | Nulls in data, `connectNulls` comparison             |
| `EmptyState`   | Empty data array                                     |
| `LoadingState` | Loading render prop                                  |
| `ErrorState`   | Error render prop with retry                         |

## Key Decisions

| Aspect            | Decision                         | Rationale                                                    |
| ----------------- | -------------------------------- | ------------------------------------------------------------ |
| **X-axis type**   | Auto-detect or explicit prop     | Supports both categorical and time-series data               |
| **Dual Y-axis**   | Supported via compound API       | Revenue/orders use case requires different scales            |
| **Curve types**   | 4 presets                        | Covers trends (smooth), discrete states (step), raw (linear) |
| **Markers**       | Per-series control               | Different series may need different visual treatment         |
| **Tooltip**       | Shared + nearest point highlight | Standard UX pattern from analytics tools                     |
| **Legend**        | Click to toggle                  | Simple, discoverable interaction                             |
| **Missing data**  | `connectNulls` prop              | Consumer chooses honest gaps vs connected lines              |
| **Show as table** | Deferred                         | Evaluate need after Phase 1                                  |

## Starting a Session

```
I'm implementing Proposal #2 (Line Chart) for nimbus-charts.
See docs/proposals/charts/02-line-chart.md for the finalized scope.
Foundation (#0) should be complete before starting.

Let's start with [Root context + scales | Line component | Axes | Tooltip | Legend].
```
