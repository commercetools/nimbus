# Proposal #4: Area Chart

> **Status**: Ready for Implementation **Depends on**: Foundation (#0), ideally
> Line Chart (#2) for shared patterns **Can parallel with**: Pie Chart (#5),
> Funnel Chart (#6) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md) **Last Updated**: 2026-01-27
> (brainstorm complete)

## Overview

An area chart component for visualizing trends with filled regions. Core use
cases: cumulative totals, parts of a whole over time, and volume emphasis in
e-commerce dashboards.

**Area Chart vs Line Chart distinction:**

| Aspect          | Line Chart           | Area Chart                   |
| --------------- | -------------------- | ---------------------------- |
| Visual emphasis | Trend direction      | Magnitude/volume             |
| Fill            | None                 | Solid or gradient below line |
| Stacking        | Not supported        | Primary differentiator       |
| Use case        | "How did it change?" | "How much in total?"         |

## Scope

### Component API (Simple Props)

Building on `BaseChartProps` from Foundation:

```typescript
interface AreaChartProps<
  T extends Record<string, unknown>,
> extends BaseChartProps<T> {
  // Area-specific
  layout?: "overlapping" | "stacked"; // default: "overlapping"
  stackOffset?: "none" | "expand"; // "expand" = 100% stacked, default: "none"

  // Line/curve (same as Line Chart)
  curveType?: "linear" | "smooth" | "step" | "stepAfter"; // default: "smooth"
  connectNulls?: boolean; // default: false

  // X-axis
  xAxisType?: "category" | "time"; // auto-detected if omitted

  // Fill appearance (applied to all areas in simple mode)
  fillOpacity?: number; // default: 0.3 for overlapping, 0.8 for stacked
  showGradient?: boolean; // default: true (vertical fade to transparent)
  showLine?: boolean; // default: true (stroke on top of fill)
}
```

**Usage:**

```tsx
// Simple overlapping areas with gradient
<AreaChart
  data={trafficData}
  index="date"
  categories={["organic", "paid", "direct"]}
  config={{
    organic: { label: "Organic", color: "chart.1" },
    paid: { label: "Paid", color: "chart.2" },
    direct: { label: "Direct", color: "chart.3" },
  }}
  showLegend
  valueFormatter={(v) => v.toLocaleString()}
/>

// Stacked areas showing composition
<AreaChart
  data={revenueByChannel}
  index="month"
  categories={["online", "retail", "wholesale"]}
  config={config}
  layout="stacked"
  showLegend
/>

// 100% stacked (percentage)
<AreaChart
  data={marketShare}
  index="quarter"
  categories={["us", "eu", "apac"]}
  config={config}
  layout="stacked"
  stackOffset="expand"
  valueFormatter={(v) => `${(v * 100).toFixed(0)}%`}
/>
```

### Component API (Compound Composition)

```tsx
<AreaChart.Root data={trafficData} config={config} layout="stacked">
  {/* Axes */}
  <AreaChart.XAxis tickFormatter={formatMonth} />
  <AreaChart.YAxis label="Sessions" tickFormatter={formatNumber} />

  {/* Areas - order matters for stacking (bottom to top) */}
  <AreaChart.Area dataKey="organic" gradient showLine />
  <AreaChart.Area dataKey="paid" gradient showLine />
  <AreaChart.Area dataKey="direct" gradient showLine={false} />

  {/* Optional elements */}
  <AreaChart.Grid horizontal vertical={false} />
  <AreaChart.Tooltip />
  <AreaChart.Legend position="bottom" />
</AreaChart.Root>
```

**Compound parts:**

| Part      | Purpose                                                                              |
| --------- | ------------------------------------------------------------------------------------ | -------- | ------ | -------- |
| `Root`    | Context provider, contains scales, layout state, gradient definitions                |
| `XAxis`   | X-axis with optional `tickFormatter`, `tickCount`                                    |
| `YAxis`   | Y-axis with `label`, `tickFormatter` (single axis only, unlike Line Chart)           |
| `Area`    | Individual series with `dataKey`, `gradient`, `showLine`, `fillOpacity`, `curveType` |
| `Grid`    | Grid lines via `ChartGrid` primitive                                                 |
| `Tooltip` | Shared tooltip at x-position with crosshair                                          |
| `Legend`  | Clickable legend with `position: "top"                                               | "bottom" | "left" | "right"` |

**Context structure:**

```typescript
interface AreaChartContextValue {
  data: Record<string, unknown>[];
  config: ChartConfig;
  layout: "overlapping" | "stacked";
  stackOffset: "none" | "expand";
  xScale: ScaleBand<string> | ScaleTime<number, number>;
  yScale: ScaleLinear<number, number>;
  innerWidth: number;
  innerHeight: number;
  hiddenSeries: Set<string>;
  toggleSeries: (key: string) => void;
  // Gradient IDs for each series (generated in Root)
  gradientIds: Record<string, string>;
}
```

### Features

- Overlapping and stacked layouts
- 100% stacked (percentage) via `stackOffset="expand"`
- Gradient fills (vertical gradient from color to transparent)
- Optional stroke line on top of fill
- Configurable fill opacity
- All Line Chart features (curves, tooltip, legend, connectNulls)
- Auto-detected or explicit X-axis type (category/time)
- Clickable legend to toggle series visibility
- Responsive container via `ChartContainer`

### Visx Integration

**Packages used:**

| Package          | Components/Utilities                                           |
| ---------------- | -------------------------------------------------------------- |
| `@visx/shape`    | `AreaClosed`, `AreaStack`, `LinePath`                          |
| `@visx/curve`    | `curveLinear`, `curveMonotoneX`, `curveStep`, `curveStepAfter` |
| `@visx/gradient` | `LinearGradient` for vertical color fade                       |
| `@visx/axis`     | `AxisBottom`, `AxisLeft`                                       |
| `@visx/scale`    | `scaleLinear`, `scaleTime`, `scaleBand`                        |
| `@visx/grid`     | Via `ChartGrid` primitive from Foundation                      |
| `@visx/tooltip`  | `useTooltip`, `TooltipWithBounds`                              |
| `@visx/event`    | `localPoint` for mouse position                                |

**Scale construction:**

```tsx
// X-axis scale (same as Line Chart)
const xScale =
  xAxisType === "time"
    ? scaleTime({ domain: [minDate, maxDate], range: [0, innerWidth] })
    : scaleBand({ domain: categories, range: [0, innerWidth], padding: 0.1 });

// Y-axis scale - domain depends on layout
const yDomain =
  layout === "stacked"
    ? [
        0,
        max(data, (d) => sum(visibleCategories, (cat) => Number(d[cat]))) ?? 0,
      ]
    : [
        0,
        max(data, (d) => max(visibleCategories, (cat) => Number(d[cat]))) ?? 0,
      ];

// For stackOffset="expand", domain is always [0, 1]
const yScale = scaleLinear({
  domain: stackOffset === "expand" ? [0, 1] : yDomain,
  range: [innerHeight, 0],
  nice: stackOffset !== "expand",
});
```

**Render patterns by layout:**

```tsx
// Overlapping areas (default)
{
  layout === "overlapping" &&
    visibleCategories.map((cat) => (
      <Fragment key={cat}>
        <LinearGradient
          id={gradientIds[cat]}
          from={resolvedColors[cat]}
          to={resolvedColors[cat]}
          fromOpacity={fillOpacity}
          toOpacity={0}
        />
        <AreaClosed
          data={data}
          x={(d) => xScale(getX(d))}
          y={(d) => yScale(Number(d[cat]))}
          yScale={yScale}
          curve={curveMap[curveType]}
          fill={`url(#${gradientIds[cat]})`}
        />
        {showLine && (
          <LinePath
            data={data}
            x={(d) => xScale(getX(d))}
            y={(d) => yScale(Number(d[cat]))}
            stroke={resolvedColors[cat]}
            strokeWidth={2}
            curve={curveMap[curveType]}
          />
        )}
      </Fragment>
    ));
}

// Stacked areas
{
  layout === "stacked" && (
    <AreaStack
      data={data}
      keys={visibleCategories}
      x={(d) => xScale(getX(d.data))}
      y0={(d) => yScale(d[0])}
      y1={(d) => yScale(d[1])}
      curve={curveMap[curveType]}
      offset={stackOffset === "expand" ? "expand" : undefined}
    >
      {({ stacks, path }) =>
        stacks.map((stack) => (
          <Fragment key={stack.key}>
            <LinearGradient
              id={gradientIds[stack.key]}
              from={resolvedColors[stack.key]}
              to={resolvedColors[stack.key]}
              fromOpacity={0.8}
              toOpacity={0.4}
            />
            <path
              d={path(stack) || ""}
              fill={`url(#${gradientIds[stack.key]})`}
            />
            {showLine && (
              <LinePath
                data={stack}
                x={(d) => xScale(getX(d.data))}
                y={(d) => yScale(d[1])}
                stroke={resolvedColors[stack.key]}
                strokeWidth={2}
                curve={curveMap[curveType]}
              />
            )}
          </Fragment>
        ))
      }
    </AreaStack>
  );
}
```

### Tooltip & Interaction Behavior

**Tooltip mechanics:**

- Mouse move finds nearest x-position via `localPoint` and `bisector`
- Shows all visible series values at that index
- For stacked: also shows total and optionally percentages
- Vertical crosshair line at x-position

**Tooltip content by layout:**

```
// Overlapping layout
┌─────────────────────────┐
│ January 2024            │  ← index label (formatted)
│ ● Organic: 12,450       │  ← color dot + label + value
│ ● Paid: 8,230           │  ← each visible series
│ ● Direct: 5,120         │
└─────────────────────────┘

// Stacked layout - shows values + total
┌─────────────────────────┐
│ January 2024            │  ← index label
│ ● Organic: 12,450       │  ← series values
│ ● Paid: 8,230           │
│ ● Direct: 5,120         │
│ ─────────────────────── │
│   Total: 25,800         │  ← stack total
└─────────────────────────┘

// 100% stacked (stackOffset="expand") - shows percentages
┌─────────────────────────┐
│ January 2024            │
│ ● Organic: 48%          │  ← percentage of total
│ ● Paid: 32%             │
│ ● Direct: 20%           │
└─────────────────────────┘
```

**Tooltip props:**

```typescript
type AreaChartTooltipProps = {
  showTotal?: boolean; // Show stack total (stacked layout only), default: true
  showCrosshair?: boolean; // Vertical line at x-position, default: true
};
```

**Hover state styling:**

```typescript
// Hovered area gets slight opacity increase
// Non-hovered areas get dimmed (overlapping layout only)
const areaHoverStyles = {
  transition: "opacity 0.15s ease-out",
};

// Overlapping: dim non-hovered
const areaDimmedOpacity = 0.15;

// Stacked: highlight hovered segment border
const stackHighlightStyles = {
  strokeWidth: 2,
  stroke: "chart.axis",
};
```

**Hidden series behavior:**

| Layout      | Behavior when series hidden                                    |
| ----------- | -------------------------------------------------------------- |
| Overlapping | Area simply removed, others unchanged                          |
| Stacked     | Remaining series fill the space (no gap), Y-scale recalculates |

**Legend interaction:**

- Click to toggle series visibility
- Hidden series get dimmed legend item with `textDecoration: "line-through"`
- Announce visibility change to screen readers

### Accessibility

**Using `useChartA11y` from Foundation:**

```typescript
const { getContainerProps, getDataPointProps, announce, focusedIndex } =
  useChartA11y({
    navigationMode: "linear", // Arrow left/right between data points
    dataPoints: data.map((d, index) => ({
      label: labelFormatter?.(d[indexKey]) ?? String(d[indexKey]),
      value: getAnnouncementForIndex(index),
    })),
    onFocusChange: (index) => {
      // Sync tooltip with keyboard focus
      showTooltip({ tooltipData: { index, values: getValuesAtIndex(index) } });
    },
  });

// Announcement helper varies by layout
const getAnnouncementForIndex = (index: number) => {
  const d = data[index];

  if (layout === "stacked") {
    const total = sum(visibleCategories, (cat) => Number(d[cat]));
    const breakdown = visibleCategories
      .map(
        (cat) => `${config[cat].label}: ${valueFormatter?.(d[cat]) ?? d[cat]}`
      )
      .join(", ");
    return `Total ${valueFormatter?.(total) ?? total}. ${breakdown}`;
  }

  return visibleCategories
    .map((cat) => `${config[cat].label}: ${valueFormatter?.(d[cat]) ?? d[cat]}`)
    .join(", ");
};
```

**Keyboard navigation:**

| Key       | Action                                            |
| --------- | ------------------------------------------------- |
| `←` / `→` | Move focus between data points (x-axis positions) |
| `Home`    | Jump to first data point                          |
| `End`     | Jump to last data point                           |
| `Escape`  | Clear focus, hide tooltip                         |

**ARIA attributes:**

```tsx
<div
  {...getContainerProps()}
  role="img"
  aria-label={formatMessage(
    layout === "stacked"
      ? areaChartMessages.chartLabelStacked
      : areaChartMessages.chartLabel,
    { description: getChartDescription() }
  )}
  aria-describedby={`${chartId}-desc`}
>
  {/* Hidden description for screen readers */}
  <VisuallyHidden id={`${chartId}-desc`}>
    {formatMessage(areaChartMessages.navigationInstructions)}
  </VisuallyHidden>

  <svg role="presentation">
    {/* Invisible hit areas for keyboard navigation */}
    {data.map((d, index) => (
      <rect
        key={index}
        {...getDataPointProps(index)}
        x={xScale(getX(d)) - hitAreaWidth / 2}
        y={0}
        width={hitAreaWidth}
        height={innerHeight}
        fill="transparent"
        role="listitem"
        aria-label={getAnnouncementForIndex(index)}
        tabIndex={focusedIndex === index ? 0 : -1}
      />
    ))}
  </svg>
</div>
```

**Focus indicators:**

```typescript
// Vertical highlight band at focused x-position
const focusHighlightStyles = {
  fill: "chart.axis",
  fillOpacity: 0.1,
  stroke: "chart.axis",
  strokeWidth: 2,
};
```

**Screen reader announcements:**

```typescript
// On focus change (data point navigation)
announce(`${label}: ${formattedValues}`);
// Example overlapping: "January 2024: Organic 12,450, Paid 8,230, Direct 5,120"
// Example stacked: "January 2024: Total 25,800. Organic 12,450, Paid 8,230, Direct 5,120"

// On legend toggle
announce(
  formatMessage(
    hidden ? areaChartMessages.seriesHidden : areaChartMessages.seriesShown,
    { series: config[seriesKey].label }
  )
);
```

### Recipe & Slots

```typescript
// area-chart.recipe.ts
import { sva } from "@chakra-ui/react";

export const areaChartRecipe = sva({
  className: "nimbus-area-chart",
  slots: [
    "root", // Outer container
    "svg", // SVG element
    "grid", // Grid lines
    "axis", // Axis lines and ticks
    "axisLabel", // Axis label text
    "area", // Area fill path
    "line", // Stroke line on top of area
    "crosshair", // Vertical line at hover position
    "focusHighlight", // Highlight band at focused position
    "tooltip", // Tooltip container
    "tooltipLabel", // Tooltip header (index label)
    "tooltipItem", // Tooltip row (color + label + value)
    "tooltipTotal", // Tooltip total row (stacked)
    "legend", // Legend container
    "legendItem", // Legend entry (clickable)
    "legendDot", // Color indicator in legend
  ],
  base: {
    root: {
      position: "relative",
      width: "full",
    },
    svg: {
      display: "block",
      overflow: "visible",
    },
    grid: {
      stroke: "chart.grid",
      strokeOpacity: 0.8,
    },
    axis: {
      color: "chart.axis",
      fontSize: "body-small",
    },
    axisLabel: {
      color: "chart.label",
      fontSize: "body-small",
      fontWeight: "500",
    },
    area: {
      transition: "opacity 0.15s ease-out",
    },
    line: {
      fill: "none",
      strokeWidth: 2,
      pointerEvents: "none",
    },
    crosshair: {
      stroke: "chart.grid",
      strokeWidth: 1,
      strokeDasharray: "4 2",
      pointerEvents: "none",
    },
    focusHighlight: {
      fill: "chart.axis",
      fillOpacity: 0.1,
      stroke: "chart.axis",
      strokeWidth: 2,
      pointerEvents: "none",
    },
    tooltip: {
      bg: "neutral.1",
      borderWidth: "1px",
      borderColor: "neutral.6",
      shadow: "md",
      rounded: "md",
      py: "100",
      px: "150",
    },
    tooltipLabel: {
      color: "chart.label",
      fontSize: "body-small",
      fontWeight: "600",
      mb: "50",
    },
    tooltipItem: {
      display: "flex",
      alignItems: "center",
      gap: "100",
      fontSize: "body-small",
      color: "chart.label",
    },
    tooltipTotal: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "body-small",
      fontWeight: "500",
      color: "chart.label",
      borderTopWidth: "1px",
      borderColor: "neutral.6",
      mt: "50",
      pt: "50",
    },
    legend: {
      display: "flex",
      gap: "200",
      flexWrap: "wrap",
    },
    legendItem: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "100",
      fontSize: "body-small",
      color: "chart.label",
      transition: "opacity 0.15s ease-out",
      _disabled: {
        opacity: 0.5,
        textDecoration: "line-through",
        color: "neutral.10",
      },
    },
    legendDot: {
      width: "100",
      height: "100",
      rounded: "full",
    },
  },
  variants: {
    layout: {
      overlapping: {
        area: {
          fillOpacity: 0.3,
        },
      },
      stacked: {
        area: {
          fillOpacity: 0.8,
        },
      },
    },
  },
});
```

### i18n Messages

```typescript
// area-chart.i18n.ts
import { defineMessages } from "@internationalized/message";

export const areaChartMessages = defineMessages({
  // Accessibility - chart description
  chartLabel: {
    id: "nimbus-charts.area-chart.label",
    defaultMessage: "Area chart showing {description}",
  },
  chartLabelStacked: {
    id: "nimbus-charts.area-chart.label-stacked",
    defaultMessage:
      "Stacked area chart showing {categories} composition over {indexLabel}",
  },

  // Accessibility - data point announcements
  dataPointAnnouncement: {
    id: "nimbus-charts.area-chart.data-point",
    defaultMessage: "{label}: {values}",
  },
  dataPointAnnouncementStacked: {
    id: "nimbus-charts.area-chart.data-point-stacked",
    defaultMessage: "{label}: Total {total}. {breakdown}",
  },
  dataPointPercentage: {
    id: "nimbus-charts.area-chart.data-point-percentage",
    defaultMessage: "{series}: {percentage} of total",
  },

  // Accessibility - navigation
  navigationInstructions: {
    id: "nimbus-charts.area-chart.navigation-instructions",
    defaultMessage:
      "Use left and right arrow keys to navigate between data points",
  },

  // Legend
  legendToggle: {
    id: "nimbus-charts.area-chart.legend-toggle",
    defaultMessage: "Toggle {series} visibility",
  },
  seriesHidden: {
    id: "nimbus-charts.area-chart.series-hidden",
    defaultMessage: "{series} hidden",
  },
  seriesShown: {
    id: "nimbus-charts.area-chart.series-shown",
    defaultMessage: "{series} shown",
  },

  // Tooltip
  tooltipTotal: {
    id: "nimbus-charts.area-chart.tooltip-total",
    defaultMessage: "Total",
  },

  // Percentage (for expand/100% stacked)
  percentageOfTotal: {
    id: "nimbus-charts.area-chart.percentage-of-total",
    defaultMessage: "{percentage} of total",
  },
});
```

### Files to Create

```
packages/nimbus-charts/src/components/area-chart/
├── area-chart.tsx           # Main component + compound exports
├── area-chart.types.ts      # Props, context types
├── area-chart.recipe.ts     # Slot recipe
├── area-chart.slots.ts      # Styled slot components
├── area-chart.i18n.ts       # Messages
├── area-chart.stories.tsx   # Stories with play functions
├── area-chart.dev.mdx       # Developer documentation
├── index.ts                 # Public exports
└── components/
    ├── area-chart-root.tsx      # Context provider, scales, gradient defs
    ├── area-chart-area.tsx      # AreaClosed/AreaStack + optional LinePath
    ├── area-chart-x-axis.tsx    # AxisBottom wrapper
    ├── area-chart-y-axis.tsx    # AxisLeft wrapper
    ├── area-chart-grid.tsx      # Grid lines via ChartGrid
    ├── area-chart-tooltip.tsx   # Tooltip with crosshair
    └── area-chart-legend.tsx    # Clickable legend
```

## Deliverables

- [ ] Simple props API for common use cases
- [ ] Compound API with Root, Area, XAxis, YAxis, Tooltip, Legend, Grid
- [ ] Layout support (`overlapping`, `stacked`)
- [ ] 100% stacked via `stackOffset="expand"`
- [ ] Gradient fills with `LinearGradient` (vertical fade)
- [ ] Optional stroke line on top of fill (`showLine`)
- [ ] Configurable fill opacity
- [ ] Curve types: linear, smooth, step, stepAfter
- [ ] Auto-detected or explicit `xAxisType` (category/time)
- [ ] `connectNulls` prop for missing data handling
- [ ] Shared tooltip at x-position with crosshair
- [ ] Tooltip shows total for stacked layout
- [ ] Tooltip shows percentages for 100% stacked
- [ ] Clickable legend to toggle series visibility
- [ ] Series toggle recalculates Y-scale (stacked fills gap)
- [ ] Full keyboard navigation via `useChartA11y`
- [ ] Focus highlight band at current position
- [ ] Screen reader announcements (varies by layout)
- [ ] Recipe with slots using design tokens
- [ ] i18n messages for accessibility
- [ ] Stories covering all variants with play function tests
- [ ] MDX documentation

## Stories

| Story                 | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| `Basic`               | Single series, overlapping layout, gradient fill       |
| `MultiSeries`         | Multiple overlapping areas with transparency           |
| `Stacked`             | Stacked layout showing composition over time           |
| `StackedPercentage`   | 100% stacked with `stackOffset="expand"`               |
| `CurveTypes`          | Visual comparison of linear, smooth, step, stepAfter   |
| `WithoutGradient`     | Solid fill (`showGradient={false}`)                    |
| `WithoutLine`         | Fill only, no stroke line (`showLine={false}`)         |
| `CustomOpacity`       | Different `fillOpacity` values comparison              |
| `TimeAxis`            | Date objects on X-axis with `xAxisType="time"`         |
| `WithLegend`          | Legend at different positions                          |
| `LegendInteraction`   | Play function testing series toggle behavior           |
| `StackedLegendToggle` | Play function: stacked areas refill when series hidden |
| `MissingData`         | Nulls in data, `connectNulls` comparison               |
| `WithCrosshair`       | Tooltip with vertical crosshair line                   |
| `EmptyState`          | Empty data array with render prop                      |
| `LoadingState`        | Loading render prop                                    |
| `ErrorState`          | Error render prop with retry                           |
| `KeyboardNavigation`  | Play function testing a11y navigation                  |
| `Responsive`          | Resizing behavior with aspectRatio                     |
| `CompoundAPI`         | Compound composition with per-area customization       |

## Key Decisions

| Aspect                          | Decision                                              | Rationale                                                                            |
| ------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Layout**                      | `overlapping` / `stacked` prop                        | Clear distinction between use cases; overlapping for trends, stacked for composition |
| **100% stacked**                | `stackOffset="expand"`                                | Matches Visx API and Bar Chart pattern; consistent mental model                      |
| **Gradient**                    | Vertical `LinearGradient` (top→transparent)           | Standard area chart pattern; emphasizes values near the line                         |
| **Gradient per-series**         | Unique IDs generated in Root                          | Avoids SVG gradient ID conflicts when multiple charts on page                        |
| **Fill opacity**                | Lower for overlapping (0.3), higher for stacked (0.8) | Overlapping needs transparency to see through; stacked doesn't overlap               |
| **Stroke line**                 | Optional via `showLine` prop, default true            | Some designs prefer fill-only; stroke adds clarity at boundaries                     |
| **Dual Y-axis**                 | Not supported                                         | Stacking makes dual Y-axis confusing; keeps API simpler than Line Chart              |
| **Curve types**                 | Same 4 as Line Chart                                  | Consistency across chart types; smooth default suits area charts                     |
| **Tooltip**                     | Shared at x-position + crosshair                      | Same pattern as Line Chart; crosshair helps locate position                          |
| **Tooltip total**               | Shown for stacked layout                              | Users need to see both breakdown and sum                                             |
| **Hidden series (stacked)**     | Remaining series fill space                           | No gaps; maintains visual continuity                                                 |
| **Hidden series (overlapping)** | Area removed, others unchanged                        | Simple removal; no reflow needed                                                     |
| **Focus indicator**             | Vertical highlight band                               | Better than point marker since area spans height                                     |
| **Keyboard nav**                | Linear (left/right by x-position)                     | Matches Line Chart; natural for time-series                                          |
| **Shared code with Line Chart** | Evaluate during implementation                        | Avoid premature abstraction; extract if duplication is clear                         |

## Starting a Session

```
I'm implementing Proposal #4 (Area Chart) for nimbus-charts.
See docs/proposals/charts/04-area-chart.md for the finalized scope.
Foundation (#0) should be complete. Review Line Chart (#2) for shared patterns.

Let's start with [Root context + scales + gradients | Area component | Axes | Tooltip | Legend].
```
