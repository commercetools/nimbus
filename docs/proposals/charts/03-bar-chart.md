# Proposal #3: Bar Chart

> **Status**: Ready for Implementation **Depends on**: Foundation (#0) **Can
> parallel with**: KPI Card (#1), Line Chart (#2) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md) **Last Updated**: 2026-01-27
> (brainstorm complete)

## Overview

A bar chart component for comparing categorical data. Core use cases: top
products, sales by category, revenue by channel, market share breakdowns.

## Scope

### Component API (Simple Props)

Building on `BaseChartProps` from Foundation:

```typescript
interface BarChartProps<
  T extends Record<string, unknown>,
> extends BaseChartProps<T> {
  // Bar-specific
  orientation?: "vertical" | "horizontal"; // default: "vertical"
  layout?: "grouped" | "stacked"; // default: "grouped" (single series = just one bar)

  // Bar appearance
  barRadius?: "none" | "sm" | "md" | "full"; // default: "sm" (top corners only)
  barGap?: number; // Gap between bars in group (0-1), default: 0.1
  barPadding?: number; // Padding between groups (0-1), default: 0.2

  // Labels
  showBarLabels?: boolean; // default: false
  barLabelPosition?: "inside" | "outside" | "auto"; // default: "auto"

  // Stacked-specific
  stackOffset?: "none" | "expand"; // "expand" = 100% stacked, default: "none"
}
```

**Usage:**

```tsx
<BarChart
  data={categoryData}
  index="category"
  categories={["revenue", "profit"]}
  config={{
    revenue: { label: "Revenue", color: "chart.1" },
    profit: { label: "Profit", color: "chart.2" },
  }}
  orientation="vertical"
  layout="grouped"
  showLegend
  valueFormatter={(v) => `$${v.toLocaleString()}`}
/>
```

The simple API covers most use cases. For full control, use the compound API.

### Component API (Compound Composition)

```tsx
<BarChart.Root
  data={data}
  config={config}
  orientation="horizontal"
  layout="stacked"
>
  {/* Axes */}
  <BarChart.XAxis tickFormatter={formatCurrency} />
  <BarChart.YAxis dataKey="category" />

  {/* Bars - order matters for stacking */}
  <BarChart.Bar dataKey="revenue" radius="sm" />
  <BarChart.Bar dataKey="profit" radius="sm" />

  {/* Optional elements */}
  <BarChart.Grid horizontal vertical={false} />
  <BarChart.Tooltip />
  <BarChart.Legend position="bottom" />
  <BarChart.BarLabel position="outside" />
</BarChart.Root>
```

**Compound parts:**

| Part       | Purpose                                                          |
| ---------- | ---------------------------------------------------------------- | --------- | ------- | -------- |
| `Root`     | Context provider, contains scales, orientation, and layout state |
| `XAxis`    | X-axis - value axis (vertical) or category axis (horizontal)     |
| `YAxis`    | Y-axis - category axis (vertical) or value axis (horizontal)     |
| `Bar`      | Individual series with `dataKey`, optional `radius` override     |
| `Grid`     | Grid lines via `ChartGrid` primitive                             |
| `Tooltip`  | Tooltip showing bar values                                       |
| `Legend`   | Clickable legend with `position: "top"                           | "bottom"  | "left"  | "right"` |
| `BarLabel` | Value labels on bars with `position: "inside"                    | "outside" | "auto"` |

**Context structure:**

```typescript
interface BarChartContextValue {
  data: Record<string, unknown>[];
  config: ChartConfig;
  orientation: "vertical" | "horizontal";
  layout: "grouped" | "stacked";
  categoryScale: ScaleBand<string>;
  valueScale: ScaleLinear<number, number>;
  groupScale?: ScaleBand<string>; // Only for grouped layout
  innerWidth: number;
  innerHeight: number;
  hiddenSeries: Set<string>;
  toggleSeries: (key: string) => void;
  stackOffset: "none" | "expand";
}
```

**Axis behavior based on orientation:**

| Orientation  | X-Axis (Bottom)      | Y-Axis (Left)        |
| ------------ | -------------------- | -------------------- |
| `vertical`   | Category (scaleBand) | Value (scaleLinear)  |
| `horizontal` | Value (scaleLinear)  | Category (scaleBand) |

### Features

- Vertical and horizontal orientation
- Single, grouped, and stacked layouts
- 100% stacked (percentage) via `stackOffset="expand"`
- Multiple series support
- Configurable bar radius using Nimbus tokens
- Optional bar labels (inside/outside/auto)
- Tooltip on hover with optional full-stack breakdown
- Clickable legend to toggle series visibility
- Negative value support
- Responsive container via `ChartContainer`

### Visx Integration

**Packages used:**

| Package         | Components/Utilities                                |
| --------------- | --------------------------------------------------- |
| `@visx/shape`   | `Bar`, `BarGroup`, `BarStack`, `BarStackHorizontal` |
| `@visx/group`   | `Group` for positioning and margins                 |
| `@visx/axis`    | `AxisBottom`, `AxisLeft`                            |
| `@visx/scale`   | `scaleBand`, `scaleLinear`, `scaleOrdinal`          |
| `@visx/grid`    | Via `ChartGrid` primitive from Foundation           |
| `@visx/tooltip` | `useTooltip`, `TooltipWithBounds`                   |
| `@visx/event`   | `localPoint` for mouse position                     |

**Scale construction:**

```tsx
// Category scale (band)
const categoryScale = scaleBand<string>({
  domain: data.map((d) => String(d[indexKey])),
  range: orientation === "vertical" ? [0, innerWidth] : [0, innerHeight],
  padding: barPadding,
});

// Value scale (linear)
const maxValue =
  layout === "stacked"
    ? max(data, (d) => sum(categories, (cat) => Number(d[cat])))
    : max(data, (d) => max(categories, (cat) => Number(d[cat])));

const valueScale = scaleLinear<number>({
  domain: [0, maxValue ?? 0],
  range: orientation === "vertical" ? [innerHeight, 0] : [0, innerWidth],
  nice: true,
});

// Group scale (for grouped layout only)
const groupScale = scaleBand<string>({
  domain: categories,
  range: [0, categoryScale.bandwidth()],
  padding: barGap,
});
```

**Render patterns by layout:**

```tsx
// Single series or grouped
{layout === "grouped" && (
  <BarGroup
    data={data}
    keys={visibleCategories}
    x0={d => String(d[indexKey])}
    x0Scale={categoryScale}
    x1Scale={groupScale}
    yScale={valueScale}
    color={(key) => resolvedColors[key]}
  >
    {(barGroups) => barGroups.map(barGroup => (
      <Group key={barGroup.index} left={barGroup.x0}>
        {barGroup.bars.map(bar => (
          <Bar key={bar.key} x={bar.x} y={bar.y} width={bar.width} height={bar.height}
               fill={bar.color} rx={resolvedRadius} />
        ))}
      </Group>
    ))}
  </BarGroup>
)}

// Stacked (vertical)
{layout === "stacked" && orientation === "vertical" && (
  <BarStack
    data={data}
    keys={visibleCategories}
    x={d => String(d[indexKey])}
    xScale={categoryScale}
    yScale={valueScale}
    color={(key) => resolvedColors[key]}
    offset={stackOffset === "expand" ? "expand" : undefined}
  >
    {(barStacks) => /* render bars */}
  </BarStack>
)}

// Stacked (horizontal)
{layout === "stacked" && orientation === "horizontal" && (
  <BarStackHorizontal
    data={data}
    keys={visibleCategories}
    y={d => String(d[indexKey])}
    xScale={valueScale}
    yScale={categoryScale}
    color={(key) => resolvedColors[key]}
    offset={stackOffset === "expand" ? "expand" : undefined}
  >
    {(barStacks) => /* render bars */}
  </BarStackHorizontal>
)}
```

**Design token usage:**

```typescript
// Bar radius using Nimbus tokens
const radiusMap = {
  none: "0", // radii.none
  sm: "radii.100", // 2px
  md: "radii.200", // 4px
  full: "radii.full", // 9999px
};

// Colors via chart tokens from Foundation
const config = {
  revenue: { label: "Revenue", color: "chart.1" }, // -> blue.9
  profit: { label: "Profit", color: "chart.2" }, // -> teal.9
};

// Structural tokens
const axisColor = "chart.axis"; // -> gray.11
const gridColor = "chart.grid"; // -> gray.6
const labelColor = "chart.label"; // -> gray.12

// Bar label contrast (for inside labels)
const getLabelColor = (seriesKey: string, position: "inside" | "outside") => {
  if (position === "inside") {
    return `${config[seriesKey].color}.contrast`;
  }
  return "chart.label";
};
```

### Tooltip & Interaction Behavior

**Tooltip mechanics:**

- Mouse enter on bar shows tooltip for that specific bar
- For stacked bars, tooltip shows the hovered segment + total
- For grouped bars, tooltip shows just the hovered bar
- Tooltip follows mouse within bar bounds
- Mouse leave hides tooltip

**Tooltip content by layout:**

```
// Single bar or grouped
+--------------------------+
| Electronics              |  <- category label (index)
| * Revenue: $45,230       |  <- hovered series (highlighted)
+--------------------------+

// Stacked layout - shows segment + total
+--------------------------+
| Electronics              |  <- category label
| * Revenue: $45,230       |  <- hovered segment (highlighted)
|   Total: $62,450         |  <- stack total
+--------------------------+

// Optional: full breakdown mode (via prop)
+--------------------------+
| Electronics              |  <- category label
| * Revenue: $45,230       |  <- highlighted (hovered)
| o Profit: $17,220        |  <- other series (dimmed)
|   Total: $62,450         |  <- stack total
+--------------------------+
```

**Tooltip props:**

```typescript
type BarChartTooltipProps = {
  showTotal?: boolean; // Show stack total (stacked layout only), default: true
  showAllSeries?: boolean; // Show all series in tooltip, default: false
};
```

**Hover state styling:**

```typescript
// Hovered bar gets slight brightness increase
const barHoverStyles = {
  filter: "brightness(1.1)",
  transition: "filter 0.15s ease-out",
};

// Non-hovered bars in same group get dimmed (grouped layout)
const barDimmedStyles = {
  opacity: 0.6,
};
```

**Hidden series behavior:**

- Hidden series excluded from render and tooltip
- Stacked: remaining series fill the space (no gap)
- Grouped: remaining bars expand to fill group width
- Value scale recalculates to fit only visible series

**Legend interaction:**

- Click to toggle series visibility
- Hidden series get dimmed legend item with `textDecoration: "line-through"`
- Uses `neutral.10` for hidden state vs `chart.label` for visible

### Accessibility

**Using `useChartA11y` from Foundation:**

```typescript
const { getContainerProps, getDataPointProps, announce, focusedIndex } =
  useChartA11y({
    navigationMode: "linear", // Arrow left/right between categories
    dataPoints: flattenedBars.map((bar) => ({
      label: bar.category,
      value: getBarAnnouncement(bar),
    })),
    onFocusChange: (index) => {
      const bar = flattenedBars[index];
      showTooltip({ tooltipData: bar });
      announce(getBarAnnouncement(bar));
    },
  });
```

**Keyboard navigation:**

| Key       | Action                                                    |
| --------- | --------------------------------------------------------- |
| `←` / `→` | Move between bars (vertical orientation)                  |
| `↑` / `↓` | Move between bars (horizontal orientation)                |
| `↑` / `↓` | Move between series within category (grouped, vertical)   |
| `←` / `→` | Move between series within category (grouped, horizontal) |
| `Home`    | Jump to first bar                                         |
| `End`     | Jump to last bar                                          |
| `Escape`  | Clear focus, hide tooltip                                 |

**Navigation order for grouped bars:**

- Primary axis (between categories): Arrow keys matching orientation
- Secondary axis (between series): Arrow keys perpendicular to orientation
- Example (vertical grouped): `←`/`→` moves between categories, `↑`/`↓` moves
  between series within a category

**Navigation order:**

```typescript
// Flatten bars for navigation based on layout
const getFlattenedBars = () => {
  if (layout === "grouped") {
    // Navigate by category, then by series within category
    // [Cat1-Series1, Cat1-Series2, Cat2-Series1, Cat2-Series2, ...]
    return data.flatMap((d) =>
      visibleCategories.map((cat) => ({
        category: String(d[indexKey]),
        seriesKey: cat,
        value: Number(d[cat]),
      }))
    );
  }

  if (layout === "stacked") {
    // Navigate by category (announce full stack), then drill into segments
    return data.map((d) => ({
      category: String(d[indexKey]),
      seriesKey: "__stack__",
      value: sum(visibleCategories, (cat) => Number(d[cat])),
      segments: visibleCategories.map((cat) => ({
        seriesKey: cat,
        value: Number(d[cat]),
      })),
    }));
  }
};
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
  <VisuallyHidden id={titleId}>{config.title || "Bar chart"}</VisuallyHidden>
  <VisuallyHidden id={descId}>
    {generateBarDescription(data, categories, config, layout)}
  </VisuallyHidden>

  <svg role="presentation" aria-hidden="true">
    {/* Bars, axes, grid - no ARIA roles on SVG elements */}
  </svg>

  <ChartDataTable
    data={data}
    index={index}
    categories={categories}
    config={config}
    layout={layout}
  />
</div>
```

**Focus indicators:**

```typescript
// Focus ring using chart tokens
const focusRingStyles = {
  outline: "2px solid",
  outlineColor: "chart.axis",
  outlineOffset: "2px",
};
```

**Screen reader announcements:**

```typescript
// On focus change
announce(`${bar.category}, ${config[bar.seriesKey].label}: ${formattedValue}`);

// On legend toggle
announce(
  formatMessage(
    hidden ? barChartMessages.seriesHidden : barChartMessages.seriesShown,
    { series: config[seriesKey].label }
  )
);

// On stack drill-in (Enter key)
announce(
  `${bar.category} stack: ${segments
    .map((s) => `${config[s.seriesKey].label} ${formatValue(s.value)}`)
    .join(", ")}`
);
```

### Recipe & Slots

```typescript
// bar-chart.recipe.ts
import { sva } from "@chakra-ui/react";

export const barChartRecipe = sva({
  className: "nimbus-bar-chart",
  slots: [
    "root", // Outer container
    "svg", // SVG element
    "grid", // Grid lines
    "axis", // Axis lines and ticks
    "axisLabel", // Axis label text
    "bar", // Individual bar rect
    "barGroup", // Group container for grouped bars
    "barStack", // Stack container for stacked bars
    "barLabel", // Value label on/near bar
    "tooltip", // Tooltip container
    "tooltipHeader", // Tooltip category label
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
    bar: {
      transition: "var(--nimbus-chart-transition)",
      _hover: {
        filter: "brightness(1.1)",
      },
      '&[data-focused="true"]': {
        outline: "2px solid",
        outlineColor: "chart.axis",
        outlineOffset: "2px",
      },
    },
    barLabel: {
      fontSize: "body-small",
      fontWeight: "500",
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
    tooltipHeader: {
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
    orientation: {
      vertical: {},
      horizontal: {},
    },
    layout: {
      grouped: {},
      stacked: {},
    },
    barLabelPosition: {
      inside: {},
      outside: {
        barLabel: {
          color: "chart.label",
        },
      },
    },
  },
  compoundVariants: [
    {
      orientation: "horizontal",
      barLabelPosition: "outside",
      css: {
        barLabel: {
          textAnchor: "start",
        },
      },
    },
    {
      orientation: "vertical",
      barLabelPosition: "outside",
      css: {
        barLabel: {
          textAnchor: "middle",
        },
      },
    },
  ],
});
```

### i18n Messages

```typescript
// bar-chart.i18n.ts
import { defineMessages } from "@internationalized/message";

export const barChartMessages = defineMessages({
  // Accessibility - chart description
  chartLabel: {
    id: "nimbus-charts.bar-chart.label",
    defaultMessage: "Bar chart showing {description}",
  },
  chartLabelGrouped: {
    id: "nimbus-charts.bar-chart.label-grouped",
    defaultMessage:
      "Grouped bar chart comparing {categories} across {indexLabel}",
  },
  chartLabelStacked: {
    id: "nimbus-charts.bar-chart.label-stacked",
    defaultMessage:
      "Stacked bar chart showing {categories} composition by {indexLabel}",
  },

  // Accessibility - data point announcements
  barAnnouncement: {
    id: "nimbus-charts.bar-chart.bar-announcement",
    defaultMessage: "{category}, {series}: {value}",
  },
  barAnnouncementStacked: {
    id: "nimbus-charts.bar-chart.bar-announcement-stacked",
    defaultMessage: "{category}, {series}: {value}, {percentage} of total",
  },
  stackTotalAnnouncement: {
    id: "nimbus-charts.bar-chart.stack-total",
    defaultMessage: "Total: {value}",
  },

  // Accessibility - navigation
  navigationInstructions: {
    id: "nimbus-charts.bar-chart.navigation-instructions",
    defaultMessage: "Use arrow keys to navigate between bars",
  },

  // Legend
  legendToggle: {
    id: "nimbus-charts.bar-chart.legend-toggle",
    defaultMessage: "Toggle {series} visibility",
  },
  seriesHidden: {
    id: "nimbus-charts.bar-chart.series-hidden",
    defaultMessage: "{series} hidden",
  },
  seriesShown: {
    id: "nimbus-charts.bar-chart.series-shown",
    defaultMessage: "{series} shown",
  },

  // Tooltip
  tooltipTotal: {
    id: "nimbus-charts.bar-chart.tooltip-total",
    defaultMessage: "Total",
  },

  // Percentage (for expand/100% stacked)
  percentageOfTotal: {
    id: "nimbus-charts.bar-chart.percentage-of-total",
    defaultMessage: "{percentage} of total",
  },
});
```

### Files to Create

```
packages/nimbus-charts/src/components/bar-chart/
+-- bar-chart.tsx              # Main component + compound exports
+-- bar-chart.types.ts         # Props, context types
+-- bar-chart.recipe.ts        # Slot recipe
+-- bar-chart.slots.ts         # Styled slot components
+-- bar-chart.i18n.ts          # Messages
+-- bar-chart.stories.tsx      # Stories with play functions
+-- bar-chart.dev.mdx          # Developer documentation
+-- index.ts                   # Public exports
+-- components/
    +-- bar-chart-root.tsx         # Context provider, scales
    +-- bar-chart-bar.tsx          # Bar/BarGroup/BarStack wrapper
    +-- bar-chart-x-axis.tsx       # AxisBottom wrapper
    +-- bar-chart-y-axis.tsx       # AxisLeft wrapper
    +-- bar-chart-grid.tsx         # Grid lines via ChartGrid
    +-- bar-chart-tooltip.tsx      # Tooltip with series highlight
    +-- bar-chart-legend.tsx       # Clickable legend
    +-- bar-chart-bar-label.tsx    # Value labels on bars
```

## Deliverables

- [ ] Simple props API for common use cases
- [ ] Compound API with Root, Bar, XAxis, YAxis, Tooltip, Legend, Grid, BarLabel
- [ ] Orientation support (vertical, horizontal)
- [ ] Layout support (grouped, stacked)
- [ ] 100% stacked via `stackOffset="expand"`
- [ ] Bar radius with Nimbus tokens (none/sm/md/full)
- [ ] Bar labels with auto-positioning
- [ ] Negative value support
- [ ] Shared tooltip with optional full-stack breakdown
- [ ] Clickable legend to toggle series
- [ ] Full keyboard navigation via `useChartA11y`
- [ ] Recipe with slots using design tokens
- [ ] i18n messages for accessibility
- [ ] Stories covering all variants with play function tests
- [ ] MDX documentation

## Stories

| Story                | Purpose                                           |
| -------------------- | ------------------------------------------------- |
| `Basic`              | Single series, vertical orientation, default opts |
| `MultiSeries`        | Multiple series, grouped layout                   |
| `Horizontal`         | Horizontal orientation with long category labels  |
| `Stacked`            | Stacked layout showing composition                |
| `StackedPercentage`  | 100% stacked with `stackOffset="expand"`          |
| `StackedHorizontal`  | Horizontal stacked bars                           |
| `WithBarLabels`      | Labels inside/outside/auto comparison             |
| `BarRadius`          | Visual comparison of none, sm, md, full radius    |
| `WithLegend`         | Legend at different positions                     |
| `LegendInteraction`  | Play function testing series toggle               |
| `CustomColors`       | Using all 7 chart tokens                          |
| `NegativeValues`     | Bars extending below zero                         |
| `EmptyState`         | Empty data array with render prop                 |
| `LoadingState`       | Loading render prop                               |
| `ErrorState`         | Error render prop with retry                      |
| `KeyboardNavigation` | Play function testing a11y navigation             |
| `Responsive`         | Resizing behavior with aspectRatio                |

## Key Decisions

| Aspect           | Decision                            | Rationale                                              |
| ---------------- | ----------------------------------- | ------------------------------------------------------ |
| **Orientation**  | Prop, not separate components       | Single component handles both, reduces API surface     |
| **Layout**       | `grouped` / `stacked` prop          | Covers single series (grouped with 1 cat), multi       |
| **100% stacked** | `stackOffset="expand"`              | Matches Visx API, clear intent for percentage charts   |
| **Bar radius**   | Token-based sizes (none/sm/md/full) | Consistent with Nimbus sizing patterns                 |
| **Bar labels**   | Optional, auto-position by default  | Most charts don't need labels; auto handles small      |
| **Negative**     | Supported                           | Revenue changes, profit/loss charts need this          |
| **Tooltip**      | Single bar focus, optional stack    | Simple default, opt-in complexity for stacked          |
| **Legend**       | Rescales remaining bars             | Grouped expands widths, stacked fills space            |
| **Keyboard**     | Arrow keys by orientation           | Arrows for categories; perpendicular arrows for series |
| **Horizontal**   | Swapped scales, not rotated         | Proper implementation, not CSS rotation hack           |

## Starting a Session

```
I'm implementing Proposal #3 (Bar Chart) for nimbus-charts.
See docs/proposals/charts/03-bar-chart.md for the finalized scope.
Foundation (#0) should be complete before starting.

Let's start with [Root context + scales | Bar component | Axes | Tooltip | Legend | BarLabels].
```
