# Proposal #5: Pie/Donut Chart

> **Status**: Ready for Implementation **Depends on**: Foundation (#0) **Can
> parallel with**: Area Chart (#4), Funnel Chart (#6) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md) **Last Updated**: 2026-01-27
> (brainstorm complete)

## Overview

A pie/donut chart component for visualizing parts of a whole. Use cases: revenue
by category, traffic by device, payment method distribution.

## Scope

### Component API (Simple Props)

Building on patterns from Foundation, but adapted for radial data:

```typescript
interface PieChartProps<T extends Record<string, unknown>> {
  data: T[];
  dataKey: keyof T | string; // Value field (e.g., "value")
  nameKey: keyof T | string; // Category field (e.g., "category")
  config: ChartConfig;

  // Variant
  variant?: "pie" | "donut"; // default: "pie"
  innerRadius?: number; // donut hole size (0-1 ratio), default: 0.6

  // Sizing (from BaseChartProps)
  aspectRatio?: number; // default: 1 (square)
  width?: number;
  height?: number;

  // Display options
  showTooltip?: boolean; // default: true
  showLegend?: boolean; // default: false

  // Formatters
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;

  // Interaction
  onSegmentClick?: (segment: T | null) => void;

  // State render props (inherited)
  renderEmptyState?: () => ReactNode;
  renderErrorState?: (error: Error, retry: () => void) => ReactNode;
  renderLoading?: () => ReactNode;
}
```

**Note**: Unlike Line/Area charts, Pie charts use `dataKey`/`nameKey` instead of
`index`/`categories` because the data shape is different (array of category
objects vs time-series rows).

**Usage:**

```tsx
<PieChart
  data={categoryData}
  dataKey="value"
  nameKey="category"
  config={{
    electronics: { label: "Electronics", color: "chart.1" },
    clothing: { label: "Clothing", color: "chart.2" },
    home: { label: "Home & Garden", color: "chart.3" },
  }}
  variant="donut"
  showLegend
  valueFormatter={(v) => `$${v.toLocaleString()}`}
/>
```

### Component API (Compound Composition)

```tsx
<PieChart.Root data={categoryData} config={config}>
  <PieChart.Pie dataKey="value" nameKey="category" innerRadius={0.6} />
  <PieChart.CenterLabel>
    <Text fontWeight="bold" fontSize="heading-medium">
      $1.2M
    </Text>
    <Text fontSize="body-small" color="neutral.11">
      Total Revenue
    </Text>
  </PieChart.CenterLabel>
  <PieChart.Tooltip />
  <PieChart.Legend position="right" />
</PieChart.Root>
```

**Compound parts:**

| Part          | Purpose                                                                           |
| ------------- | --------------------------------------------------------------------------------- | -------- | ------ | -------- |
| `Root`        | Context provider, contains scales and interaction state                           |
| `Pie`         | The pie/donut itself with `dataKey`, `nameKey`, `innerRadius`                     |
| `CenterLabel` | Positioned in donut center, renders children. Only visible when `innerRadius > 0` |
| `Tooltip`     | Segment tooltip on hover/focus                                                    |
| `Legend`      | Clickable legend with `position: "top"                                            | "bottom" | "left" | "right"` |

**Context structure:**

```typescript
interface PieChartContextValue {
  data: Record<string, unknown>[];
  config: ChartConfig;
  // Computed from data
  total: number;
  arcs: Array<{ data: T; startAngle: number; endAngle: number; value: number }>;
  // Interaction state
  highlightedSegment: string | null;
  setHighlightedSegment: (key: string | null) => void;
  hoveredSegment: string | null;
  setHoveredSegment: (key: string | null) => void;
  // Dimensions
  radius: number;
  innerRadius: number;
  centerX: number;
  centerY: number;
}
```

### Variants

| Variant | Description                         |
| ------- | ----------------------------------- |
| `pie`   | Full circle, no center hole         |
| `donut` | Ring with customizable inner radius |

### Visx Integration

**Packages used:**

| Package         | Components/Utilities              |
| --------------- | --------------------------------- |
| `@visx/shape`   | `Pie`, `Arc` for segments         |
| `@visx/group`   | `Group` for centering the chart   |
| `@visx/tooltip` | `useTooltip`, `TooltipWithBounds` |

**Arc rendering using slot styles:**

```tsx
// Inside PieChart.Pie component
const styles = useSlotRecipe({ recipe: pieChartRecipe });

const pie = Pie({
  data,
  pieValue: (d) => Number(d[dataKey]),
  pieSort: null, // Preserve data order
});

{
  pie.arcs.map((arc, index) => {
    const segmentKey = arc.data[nameKey];
    const isHovered = hoveredSegment === segmentKey;
    const isHighlighted = highlightedSegment === segmentKey;
    const isDimmed = highlightedSegment && !isHighlighted;

    // Expand offset calculated for "pulled slice" effect
    const centroid = arc.centroid();
    const angle = Math.atan2(centroid[1], centroid[0]);

    return (
      <Group
        key={segmentKey}
        css={styles.segment}
        data-hovered={isHovered || undefined}
        data-dimmed={isDimmed || undefined}
        style={{
          "--expand-x": `${Math.cos(angle) * (isHovered ? 8 : 0)}px`,
          "--expand-y": `${Math.sin(angle) * (isHovered ? 8 : 0)}px`,
        }}
      >
        <Arc
          arc={arc}
          outerRadius={radius}
          innerRadius={innerRadius}
          fill={resolvedColors[segmentKey]}
          {...getDataPointProps(index)}
        />
      </Group>
    );
  });
}
```

**CenterLabel using slot:**

```tsx
<foreignObject
  x={centerX - innerRadius * 0.7}
  y={centerY - innerRadius * 0.7}
  width={innerRadius * 1.4}
  height={innerRadius * 1.4}
>
  <Box css={styles.centerLabel}>{children}</Box>
</foreignObject>
```

### Tooltip & Interaction Behavior

**Tooltip mechanics:**

- Hover/focus on segment shows tooltip near cursor position
- Tooltip shows: segment name, value, and percentage of total
- Segment expands outward (pulled slice effect)

**Tooltip content:**

```
┌─────────────────────────┐
│ ● Electronics           │  ← color dot + segment name
│   $500,000 (42%)        │  ← value + percentage
└─────────────────────────┘
```

**Tooltip props:**

```typescript
type PieChartTooltipProps = {
  showPercentage?: boolean; // Show "42% of total", default: true
};
```

**Legend interaction (highlight mode):**

| Action                  | Behavior                                           |
| ----------------------- | -------------------------------------------------- |
| Click legend item       | Highlights that segment, dims all others           |
| Click same item again   | Clears highlight, all segments return to normal    |
| Hover segment           | Segment expands, tooltip appears                   |
| Hover while highlighted | Hovered segment expands, highlight state unchanged |

> **Note**: Pie chart legend uses highlight mode (dims other segments) rather
> than toggle (hide/show). See Foundation § Legend Interaction Patterns for
> rationale.

**Legend item using React Aria ToggleButton:**

```tsx
import { ToggleButton } from "react-aria-components";

// Inside Legend component
{
  Object.entries(config).map(([segmentKey, segmentConfig]) => (
    <ToggleButton
      key={segmentKey}
      css={styles.legendItem}
      isSelected={highlightedSegment === segmentKey}
      onChange={() => toggleHighlight(segmentKey)}
      data-highlighted={highlightedSegment === segmentKey || undefined}
      data-not-highlighted={
        (highlightedSegment && highlightedSegment !== segmentKey) || undefined
      }
    >
      <Box
        css={styles.legendDot}
        style={{ background: resolvedColors[segmentKey] }}
      />
      {segmentConfig.label}
    </ToggleButton>
  ));
}
```

**Tooltip using Visx + Chakra Box:**

```tsx
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";
import { Box } from "@chakra-ui/react";

<TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
  <Box css={styles.tooltip}>
    <Box css={styles.tooltipLabel}>
      <Box css={styles.legendDot} style={{ background: segmentColor }} />
      {segmentLabel}
    </Box>
    <Box css={styles.tooltipValue}>
      {formattedValue} {showPercentage && `(${percentage}%)`}
    </Box>
  </Box>
</TooltipWithBounds>;
```

### Accessibility

**Using `useChartA11y` from Foundation with circular navigation:**

```typescript
const { getContainerProps, getDataPointProps, announce, focusedIndex } =
  useChartA11y({
    navigationMode: "circular", // Arrow left/right wraps around
    dataPoints: data.map((d) => ({
      label: String(d[nameKey]),
      value: getAnnouncementForSegment(d),
    })),
    onFocusChange: (index) => {
      setHoveredSegment(data[index][nameKey]);
      showTooltip({ tooltipData: data[index] });
    },
  });

// Announcement includes value and percentage
const getAnnouncementForSegment = (d: T) => {
  const value = Number(d[dataKey]);
  const percentage = ((value / total) * 100).toFixed(1);
  const formattedValue = valueFormatter?.(value) ?? String(value);
  return `${formattedValue}, ${percentage}% of total`;
};
```

**Keyboard navigation:**

| Key       | Action                                     |
| --------- | ------------------------------------------ |
| `←` / `→` | Move focus between segments (wraps around) |
| `Home`    | Jump to first segment                      |
| `End`     | Jump to last segment                       |
| `Enter`   | Toggle highlight on focused segment        |
| `Escape`  | Clear highlight, hide tooltip              |

**Screen reader announcements:**

```typescript
// On focus change
announce(`${label}: ${formattedValue}, ${percentage}% of total`);
// Example: "Electronics: $500,000, 42% of total"

// On highlight toggle
announce(
  formatMessage(
    highlighted
      ? pieChartMessages.segmentHighlighted
      : pieChartMessages.highlightCleared,
    { segment: config[segmentKey].label }
  )
);
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
  <VisuallyHidden id={titleId}>{config.title || "Pie chart"}</VisuallyHidden>
  <VisuallyHidden id={descId}>
    {generatePieDescription(data, dataKey, nameKey, config)}
  </VisuallyHidden>

  <svg role="presentation" aria-hidden="true">
    {/* Pie segments - no ARIA roles */}
  </svg>

  {/* Pie uses simple list format, not table */}
  <VisuallyHidden as="ul">
    {data.map((item) => (
      <li key={item[nameKey]}>
        {item[nameKey]}: {valueFormatter(item[dataKey])},
        {percentageFormatter(item[dataKey] / total)} of total
      </li>
    ))}
  </VisuallyHidden>
</div>
```

### Recipe & Slots

```typescript
// pie-chart.recipe.ts
import { sva } from "@chakra-ui/react";

export const pieChartRecipe = sva({
  className: "nimbus-pie-chart",
  slots: [
    "root", // Outer container
    "svg", // SVG element
    "segment", // Individual pie/donut segment
    "centerLabel", // Donut center content area
    "tooltip", // Tooltip container
    "tooltipLabel", // Tooltip header (segment name)
    "tooltipValue", // Tooltip value row
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
    segment: {
      cursor: "pointer",
      outline: "none",
      transform: "translate(var(--expand-x, 0), var(--expand-y, 0))",
      transition: "var(--nimbus-chart-transition)",
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "chart.axis",
        outlineOffset: "2px",
      },
      _dimmed: {
        opacity: 0.3,
      },
    },
    centerLabel: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      width: "full",
      height: "full",
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
      display: "flex",
      alignItems: "center",
      gap: "100",
      color: "chart.label",
      fontSize: "body-small",
      fontWeight: "600",
      mb: "50",
    },
    tooltipValue: {
      color: "chart.label",
      fontSize: "body-small",
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
      _highlighted: {
        fontWeight: "500",
      },
      _notHighlighted: {
        opacity: 0.5,
      },
    },
    legendDot: {
      width: "100",
      height: "100",
      rounded: "full",
    },
  },
});
```

### i18n Messages

```typescript
// pie-chart.i18n.ts
import { defineMessages } from "@internationalized/message";

export const pieChartMessages = defineMessages({
  // Accessibility - chart description
  chartLabel: {
    id: "nimbus-charts.pie-chart.label",
    defaultMessage: "Pie chart showing {description}",
  },
  chartLabelDonut: {
    id: "nimbus-charts.pie-chart.label-donut",
    defaultMessage: "Donut chart showing {description}",
  },

  // Accessibility - data point announcements
  segmentAnnouncement: {
    id: "nimbus-charts.pie-chart.segment",
    defaultMessage: "{label}: {value}, {percentage} of total",
  },

  // Accessibility - navigation
  navigationInstructions: {
    id: "nimbus-charts.pie-chart.navigation-instructions",
    defaultMessage:
      "Use left and right arrow keys to navigate between segments. Navigation wraps around.",
  },

  // Highlight interaction
  segmentHighlighted: {
    id: "nimbus-charts.pie-chart.segment-highlighted",
    defaultMessage: "{segment} highlighted",
  },
  highlightCleared: {
    id: "nimbus-charts.pie-chart.highlight-cleared",
    defaultMessage: "Highlight cleared",
  },

  // Legend
  legendHighlight: {
    id: "nimbus-charts.pie-chart.legend-highlight",
    defaultMessage: "Highlight {segment}",
  },

  // Tooltip
  percentageOfTotal: {
    id: "nimbus-charts.pie-chart.percentage-of-total",
    defaultMessage: "{percentage} of total",
  },
});
```

### Files to Create

```
packages/nimbus-charts/src/components/pie-chart/
├── pie-chart.tsx              # Main component + compound exports
├── pie-chart.types.ts         # Props, context types
├── pie-chart.recipe.ts        # Slot recipe
├── pie-chart.slots.ts         # Styled slot components
├── pie-chart.i18n.ts          # Messages
├── pie-chart.stories.tsx      # Stories with play functions
├── pie-chart.dev.mdx          # Developer documentation
├── index.ts                   # Public exports
└── components/
    ├── pie-chart-root.tsx         # Context provider, arc calculations
    ├── pie-chart-pie.tsx          # Pie/Arc rendering with hover effect
    ├── pie-chart-center-label.tsx # Donut center content (foreignObject)
    ├── pie-chart-tooltip.tsx      # Tooltip with percentage
    └── pie-chart-legend.tsx       # ToggleButton-based legend
```

## Deliverables

- [ ] Simple props API for common use cases
- [ ] Compound API with Root, Pie, CenterLabel, Tooltip, Legend
- [ ] Pie and donut variants via `innerRadius`
- [ ] Pulled slice hover effect using recipe styles
- [ ] Legend with highlight interaction (ToggleButton)
- [ ] Tooltip showing value and percentage
- [ ] Full keyboard navigation via `useChartA11y` (circular mode)
- [ ] Screen reader announcements with percentages
- [ ] Recipe with slots using design tokens
- [ ] i18n messages for accessibility
- [ ] Stories covering all variants with play function tests
- [ ] MDX documentation

## Stories

| Story                | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `Basic`              | Simple pie chart with default options                     |
| `Donut`              | Donut variant with `innerRadius`                          |
| `DonutWithCenter`    | Donut with CenterLabel showing total                      |
| `CustomInnerRadius`  | Different `innerRadius` values comparison (0.4, 0.6, 0.8) |
| `WithLegend`         | Legend at different positions (top, bottom, left, right)  |
| `LegendHighlight`    | Play function testing highlight interaction               |
| `HoverExpand`        | Visual demonstration of pulled slice effect               |
| `ManySegments`       | 7 segments using all chart colors                         |
| `SmallSegments`      | Data with small percentages (<5%) to test rendering       |
| `SingleSegment`      | Edge case: only one data point (full circle)              |
| `WithTooltip`        | Tooltip with percentage display                           |
| `CustomFormatters`   | Custom `valueFormatter` and `labelFormatter`              |
| `EmptyState`         | Empty data array with render prop                         |
| `LoadingState`       | Loading render prop                                       |
| `ErrorState`         | Error render prop with retry                              |
| `KeyboardNavigation` | Play function testing circular a11y navigation            |
| `Responsive`         | Resizing behavior with aspectRatio                        |
| `CompoundAPI`        | Compound composition with all parts                       |

## Key Decisions

| Aspect               | Decision                                       | Rationale                                                       |
| -------------------- | ---------------------------------------------- | --------------------------------------------------------------- |
| **Segment labels**   | Tooltip only                                   | Keeps chart clean, works at any size, avoids layout complexity  |
| **Center label**     | Children only                                  | Matches Nimbus compound pattern, full flexibility for consumers |
| **Legend click**     | Highlight (not hide)                           | Natural for part-of-whole; hiding distorts the story            |
| **Hover effect**     | Scale outward (pulled slice)                   | Classic pie chart interaction, clear visual feedback            |
| **Data shape**       | `dataKey`/`nameKey` (not `index`/`categories`) | Pie data is category array, not time-series rows                |
| **Inner radius**     | 0-1 ratio, default 0.6 for donut               | Relative to radius; 0.6 leaves room for center label            |
| **Aspect ratio**     | Default 1 (square)                             | Pie charts are naturally circular                               |
| **Navigation mode**  | Circular (wraps around)                        | Natural for radial layout; matches mental model                 |
| **Tooltip position** | Near cursor (not fixed)                        | Follows Visx pattern, stays close to interaction point          |
| **Sort order**       | Preserve data order                            | Consumer controls segment order; no auto-sorting by value       |

## Starting a Session

```
I'm implementing Proposal #5 (Pie/Donut Chart) for nimbus-charts.
See docs/proposals/charts/05-pie-chart.md for the finalized scope.
Foundation (#0) should be complete before starting.

Let's start with [Root context + arc calculations | Pie component | CenterLabel | Tooltip | Legend].
```
