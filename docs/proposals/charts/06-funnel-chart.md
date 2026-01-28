# Proposal #6: Funnel Chart

> **Status**: Ready for Implementation **Depends on**: Foundation (#0) **Can
> parallel with**: Area Chart (#4), Pie Chart (#5) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md) **Last Updated**: 2026-01-27
> (brainstorm complete)

## Overview

A funnel chart component for visualizing conversion flows. Primary use case:
e-commerce checkout funnel (sessions → product views → add to cart → checkout →
purchase).

## Scope

### Component API (Simple Props)

Building on patterns from Foundation, adapted for funnel data:

```typescript
interface FunnelChartProps<T extends Record<string, unknown>> {
  data: T[];
  dataKey: keyof T | string; // Value field (e.g., "value")
  nameKey: keyof T | string; // Stage name field (e.g., "stage")
  config: ChartConfig;

  // Orientation
  orientation?: "vertical" | "horizontal"; // default: "vertical"

  // Sizing (from BaseChartProps)
  aspectRatio?: number; // default: 3/4 for vertical, 16/9 for horizontal
  width?: number;
  height?: number;
  maxHeight?: number;

  // Display options
  showTooltip?: boolean; // default: true
  showConversionRate?: boolean; // default: true (between stages)
  showLabels?: boolean; // default: true (stage name + value beside)

  // Formatters
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;
  conversionFormatter?: (rate: number) => string; // default: "65%"

  // Interaction
  onStageClick?: (stage: T | null) => void;

  // State render props (inherited)
  renderEmptyState?: () => ReactNode;
  renderErrorState?: (error: Error, retry: () => void) => ReactNode;
  renderLoading?: () => ReactNode;
}
```

**Note**: Like Pie charts, Funnel charts use `dataKey`/`nameKey` instead of
`index`/`categories` because the data shape is a stage array, not time-series
rows.

**Usage:**

```tsx
<FunnelChart
  data={funnelData}
  dataKey="value"
  nameKey="stage"
  config={{
    sessions: { label: "Sessions", color: "chart.1" },
    productViews: { label: "Product Views", color: "chart.2" },
    addToCart: { label: "Add to Cart", color: "chart.3" },
    checkout: { label: "Checkout", color: "chart.4" },
    purchase: { label: "Purchase", color: "chart.5" },
  }}
  showConversionRate
  valueFormatter={(v) => v.toLocaleString()}
/>
```

### Component API (Compound Composition)

```tsx
<FunnelChart.Root data={funnelData} config={config} orientation="vertical">
  <FunnelChart.Stages dataKey="value" nameKey="stage" />
  <FunnelChart.ConversionLabels />
  <FunnelChart.StageLabels position="right" />
  <FunnelChart.Tooltip />
</FunnelChart.Root>
```

**Compound parts:**

| Part               | Purpose                                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------------------------------- |
| `Root`             | Context provider, contains dimensions and interaction state                                                 |
| `Stages`           | Renders all trapezoid shapes with `dataKey`, `nameKey`                                                      |
| `ConversionLabels` | Conversion rate labels between stages (e.g., "↓ 65%")                                                       |
| `StageLabels`      | Stage name + value labels with `position: "left" \| "right"` (vertical) or `"top" \| "bottom"` (horizontal) |
| `Tooltip`          | Stage tooltip on hover/focus                                                                                |

**Context structure:**

```typescript
interface FunnelChartContextValue {
  data: Record<string, unknown>[];
  config: ChartConfig;
  orientation: "vertical" | "horizontal";

  // Computed from data
  stages: Array<{
    key: string;
    value: number;
    width: number; // Calculated width (0-1 ratio)
    conversionRate: number; // Rate from previous stage (null for first)
    overallRate: number; // Rate from first stage
  }>;
  maxValue: number; // First stage value (100% reference)

  // Interaction state
  hoveredStage: string | null;
  setHoveredStage: (key: string | null) => void;

  // Dimensions
  innerWidth: number;
  innerHeight: number;
  stageHeight: number; // Height per stage (vertical) or width (horizontal)
  gap: number; // Gap between stages for conversion labels
}
```

### Data Format

```typescript
interface FunnelData {
  stage: string;
  value: number;
}

// Example
const funnelData = [
  { stage: "sessions", value: 10000 },
  { stage: "productViews", value: 6500 }, // 65% of sessions
  { stage: "addToCart", value: 2600 }, // 40% of views
  { stage: "checkout", value: 1300 }, // 50% of cart
  { stage: "purchase", value: 910 }, // 70% of checkout
];
```

### Funnel Layout

**Centered symmetric funnel** — each stage is horizontally centered with width
proportional to its value:

```
    ┌─────────────────────────┐   Sessions: 10,000
     \                       /
              ↓ 65%
      └─────────────────────┘     Product Views: 6,500
        \                 /
              ↓ 40%
         └───────────────┘        Add to Cart: 2,600
           \           /
              ↓ 50%
            └─────────┘           Checkout: 1,300
              \     /
              ↓ 70%
               └───┘              Purchase: 910
```

### Visx Integration

**Packages used:**

| Package         | Components/Utilities                      |
| --------------- | ----------------------------------------- |
| `@visx/shape`   | `LinePath` or raw `<path>` for trapezoids |
| `@visx/group`   | `Group` for positioning stages            |
| `@visx/scale`   | `scaleLinear` for width calculations      |
| `@visx/tooltip` | `useTooltip`, `TooltipWithBounds`         |

**Trapezoid path calculation:**

```typescript
// Calculate trapezoid vertices for a stage
function getStagePath(
  stageIndex: number,
  currentWidth: number, // 0-1 ratio
  nextWidth: number, // 0-1 ratio (or same as current for last stage)
  stageHeight: number,
  totalWidth: number,
  gap: number,
  orientation: "vertical" | "horizontal"
): string {
  if (orientation === "vertical") {
    const y = stageIndex * (stageHeight + gap);
    const topWidth = currentWidth * totalWidth;
    const bottomWidth = nextWidth * totalWidth;
    const topOffset = (totalWidth - topWidth) / 2;
    const bottomOffset = (totalWidth - bottomWidth) / 2;

    // Trapezoid: top-left → top-right → bottom-right → bottom-left
    return `
      M ${topOffset} ${y}
      L ${topOffset + topWidth} ${y}
      L ${bottomOffset + bottomWidth} ${y + stageHeight}
      L ${bottomOffset} ${y + stageHeight}
      Z
    `;
  }
  // Horizontal: similar logic, rotated 90°
}
```

**Stage rendering using slot styles:**

```tsx
// Inside FunnelChart.Stages component
const styles = useSlotRecipe({ recipe: funnelChartRecipe });

{
  stages.map((stage, index) => {
    const nextStage = stages[index + 1];
    const nextWidth = nextStage ? nextStage.width : stage.width;
    const isHovered = hoveredStage === stage.key;

    return (
      <Group key={stage.key}>
        <path
          d={getStagePath(
            index,
            stage.width,
            nextWidth,
            stageHeight,
            innerWidth,
            gap,
            orientation
          )}
          fill={resolvedColors[stage.key]}
          css={styles.stage}
          data-hovered={isHovered || undefined}
          {...getDataPointProps(index)}
        />
      </Group>
    );
  });
}
```

### Tooltip & Interaction Behavior

**Tooltip mechanics:**

- Hover/focus on stage shows tooltip near cursor position
- Tooltip shows: stage name, value, step conversion, and overall conversion
- Stage gets subtle highlight effect (brightness increase)

**Tooltip content:**

```
┌────────────────────────────────┐
│ ● Add to Cart                  │  ← color dot + stage name
│   2,600                        │  ← formatted value
│   40% from Product Views       │  ← step conversion
│   26% of Sessions              │  ← overall conversion
└────────────────────────────────┘
```

**Tooltip props:**

```typescript
type FunnelChartTooltipProps = {
  showStepConversion?: boolean; // default: true
  showOverallConversion?: boolean; // default: true
};
```

**Interaction behavior:**

| Action             | Behavior                               |
| ------------------ | -------------------------------------- |
| Hover stage        | Stage brightens, tooltip appears       |
| Focus stage (kb)   | Same as hover                          |
| Click stage        | Fires `onStageClick` callback          |
| Mouse leave / blur | Stage returns to normal, tooltip hides |

**Tooltip using Visx + Chakra Box:**

```tsx
import { TooltipWithBounds, useTooltip } from "@visx/tooltip";
import { Box } from "@chakra-ui/react";

<TooltipWithBounds left={tooltipLeft} top={tooltipTop}>
  <Box css={styles.tooltip}>
    <Box css={styles.tooltipHeader}>
      <Box css={styles.colorDot} style={{ background: stageColor }} />
      {stageLabel}
    </Box>
    <Box css={styles.tooltipValue}>{formattedValue}</Box>
    {showStepConversion && prevStage && (
      <Box css={styles.tooltipConversion}>
        {stepRate}% from {prevStage.label}
      </Box>
    )}
    {showOverallConversion && (
      <Box css={styles.tooltipConversion}>
        {overallRate}% of {firstStage.label}
      </Box>
    )}
  </Box>
</TooltipWithBounds>;
```

### Accessibility

**Using `useChartA11y` from Foundation with vertical navigation:**

```typescript
const { getContainerProps, getDataPointProps, announce, focusedIndex } =
  useChartA11y({
    navigationMode: orientation === "vertical" ? "vertical" : "linear",
    dataPoints: stages.map((stage, index) => ({
      label: config[stage.key].label,
      value: getAnnouncementForStage(stage, index),
    })),
    onFocusChange: (index) => {
      setHoveredStage(stages[index].key);
      showTooltip({ tooltipData: stages[index] });
    },
  });

// Announcement includes value and conversion rates
const getAnnouncementForStage = (stage: Stage, index: number) => {
  const formattedValue = valueFormatter?.(stage.value) ?? String(stage.value);
  const prevStage = stages[index - 1];

  if (index === 0) {
    return formattedValue;
  }

  return `${formattedValue}, ${(stage.conversionRate * 100).toFixed(0)}% conversion from ${config[prevStage.key].label}`;
};
```

**Keyboard navigation:**

| Key               | Action (Vertical)         | Action (Horizontal)       |
| ----------------- | ------------------------- | ------------------------- |
| `↑` / `↓`         | Move focus between stages | —                         |
| `←` / `→`         | —                         | Move focus between stages |
| `Home`            | Jump to first stage       | Jump to first stage       |
| `End`             | Jump to last stage        | Jump to last stage        |
| `Enter` / `Space` | Trigger `onStageClick`    | Trigger `onStageClick`    |
| `Escape`          | Clear focus, hide tooltip | Clear focus, hide tooltip |

**Screen reader announcements:**

```typescript
// On focus change
announce(
  `${label}: ${formattedValue}, ${conversionRate}% conversion from ${prevLabel}`
);
// Example: "Add to Cart: 2,600, 40% conversion from Product Views"

// First stage (no conversion)
announce(`${label}: ${formattedValue}`);
// Example: "Sessions: 10,000"
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
  <VisuallyHidden id={titleId}>{config.title || "Funnel chart"}</VisuallyHidden>
  <VisuallyHidden id={descId}>
    {generateFunnelDescription(data, dataKey, nameKey)}
  </VisuallyHidden>

  <svg role="presentation" aria-hidden="true">
    {/* Funnel stages - no ARIA roles */}
  </svg>

  <VisuallyHidden as="ol">
    {data.map((stage, i) => (
      <li key={stage[nameKey]}>
        {stage[nameKey]}: {valueFormatter(stage[dataKey])}
        {i > 0 &&
          `, ${percentageFormatter(stage[dataKey] / data[i - 1][dataKey])} conversion from previous`}
        {i > 0 &&
          `, ${percentageFormatter(stage[dataKey] / data[0][dataKey])} overall conversion`}
      </li>
    ))}
  </VisuallyHidden>
</div>
```

### Recipe & Slots

```typescript
// funnel-chart.recipe.ts
import { sva } from "@chakra-ui/react";

export const funnelChartRecipe = sva({
  className: "nimbus-funnel-chart",
  slots: [
    "root", // Outer container
    "svg", // SVG element
    "stage", // Individual trapezoid stage
    "conversionLabel", // Conversion rate label between stages
    "stageLabel", // Stage name + value beside stage
    "stageName", // Stage name text
    "stageValue", // Stage value text
    "tooltip", // Tooltip container
    "tooltipHeader", // Tooltip stage name row
    "tooltipValue", // Tooltip value row
    "tooltipConversion", // Tooltip conversion rate row
    "colorDot", // Color indicator (tooltip, labels)
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
    stage: {
      cursor: "pointer",
      outline: "none",
      transition: "var(--nimbus-chart-transition)",
      _hovered: {
        filter: "brightness(1.1)",
      },
      _focusVisible: {
        outline: "2px solid",
        outlineColor: "chart.axis",
        outlineOffset: "2px",
      },
    },
    conversionLabel: {
      fontSize: "body-small",
      fontWeight: "500",
      color: "neutral.11",
      textAnchor: "middle",
      dominantBaseline: "middle",
    },
    stageLabel: {
      display: "flex",
      flexDirection: "column",
      gap: "25",
    },
    stageName: {
      fontSize: "body-small",
      fontWeight: "600",
      color: "chart.label",
    },
    stageValue: {
      fontSize: "body-small",
      color: "neutral.11",
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
      fontWeight: "500",
      mb: "50",
    },
    tooltipConversion: {
      color: "neutral.11",
      fontSize: "body-small",
    },
    colorDot: {
      width: "100",
      height: "100",
      rounded: "full",
    },
  },
  variants: {
    orientation: {
      vertical: {
        stageLabel: {
          position: "absolute",
          left: "100%",
          marginLeft: "200",
        },
      },
      horizontal: {
        stageLabel: {
          position: "absolute",
          top: "100%",
          marginTop: "100",
          textAlign: "center",
        },
      },
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});
```

### i18n Messages

```typescript
// funnel-chart.i18n.ts
import { defineMessages } from "@internationalized/message";

export const funnelChartMessages = defineMessages({
  // Accessibility - chart description
  chartLabel: {
    id: "nimbus-charts.funnel-chart.label",
    defaultMessage: "Funnel chart showing {description}",
  },

  // Accessibility - navigation instructions
  navigationInstructions: {
    id: "nimbus-charts.funnel-chart.navigation-instructions",
    defaultMessage: "Use {direction} arrow keys to navigate between stages.",
  },

  // Accessibility - stage announcements
  stageAnnouncement: {
    id: "nimbus-charts.funnel-chart.stage",
    defaultMessage: "{label}: {value}",
  },
  stageAnnouncementWithConversion: {
    id: "nimbus-charts.funnel-chart.stage-with-conversion",
    defaultMessage: "{label}: {value}, {rate} conversion from {previousLabel}",
  },

  // Conversion labels
  conversionRate: {
    id: "nimbus-charts.funnel-chart.conversion-rate",
    defaultMessage: "{rate}",
  },
  conversionArrow: {
    id: "nimbus-charts.funnel-chart.conversion-arrow",
    defaultMessage: "↓ {rate}",
  },
  conversionArrowHorizontal: {
    id: "nimbus-charts.funnel-chart.conversion-arrow-horizontal",
    defaultMessage: "→ {rate}",
  },

  // Tooltip
  stepConversion: {
    id: "nimbus-charts.funnel-chart.step-conversion",
    defaultMessage: "{rate} from {previousLabel}",
  },
  overallConversion: {
    id: "nimbus-charts.funnel-chart.overall-conversion",
    defaultMessage: "{rate} of {firstLabel}",
  },

  // Stage labels
  stageOf: {
    id: "nimbus-charts.funnel-chart.stage-of",
    defaultMessage: "Stage {current} of {total}",
  },
});
```

### Files to Create

```
packages/nimbus-charts/src/components/funnel-chart/
├── funnel-chart.tsx              # Main component + compound exports
├── funnel-chart.types.ts         # Props, context types
├── funnel-chart.recipe.ts        # Slot recipe
├── funnel-chart.slots.ts         # Styled slot components
├── funnel-chart.i18n.ts          # Messages
├── funnel-chart.stories.tsx      # Stories with play functions
├── funnel-chart.dev.mdx          # Developer documentation
├── index.ts                      # Public exports
├── utils/
│   └── path-calculations.ts      # Trapezoid path generation utilities
└── components/
    ├── funnel-chart-root.tsx             # Context provider, stage calculations
    ├── funnel-chart-stages.tsx           # Trapezoid rendering
    ├── funnel-chart-conversion-labels.tsx # "↓ 65%" labels between stages
    ├── funnel-chart-stage-labels.tsx     # Stage name + value beside stages
    └── funnel-chart-tooltip.tsx          # Tooltip with conversion rates
```

**Utility file for path calculations:**

```typescript
// utils/path-calculations.ts
export interface StageGeometry {
  path: string;
  centerX: number;
  centerY: number;
  labelPosition: { x: number; y: number };
  conversionLabelPosition: { x: number; y: number };
}

export function calculateStageGeometry(
  index: number,
  currentWidth: number,
  nextWidth: number,
  stageHeight: number,
  totalWidth: number,
  totalHeight: number,
  gap: number,
  orientation: "vertical" | "horizontal"
): StageGeometry;

export function calculateConversionRate(
  currentValue: number,
  previousValue: number
): number;

export function calculateOverallRate(
  currentValue: number,
  firstValue: number
): number;
```

## Deliverables

- [ ] Simple props API for common use cases
- [ ] Compound API with Root, Stages, ConversionLabels, StageLabels, Tooltip
- [ ] Vertical and horizontal orientation variants
- [ ] Path-based centered trapezoid rendering
- [ ] Conversion rate calculations (step and overall)
- [ ] Conversion labels between stages
- [ ] Stage labels (name + value) beside stages
- [ ] Tooltip showing value and both conversion rates
- [ ] Full keyboard navigation via `useChartA11y` (vertical/linear modes)
- [ ] Screen reader announcements with conversion context
- [ ] Recipe with slots using design tokens
- [ ] i18n messages for accessibility and labels
- [ ] Stories covering all variants with play function tests
- [ ] MDX documentation

## Stories

| Story                     | Purpose                                               |
| ------------------------- | ----------------------------------------------------- |
| `Basic`                   | Simple funnel with default options (vertical)         |
| `Horizontal`              | Horizontal orientation variant                        |
| `WithConversionRates`     | Conversion labels visible between stages              |
| `WithoutConversionRates`  | Clean funnel without conversion labels                |
| `CustomFormatters`        | Custom `valueFormatter` and `conversionFormatter`     |
| `ThreeStages`             | Minimal funnel (awareness → consideration → purchase) |
| `SevenStages`             | Maximum recommended stages using all chart colors     |
| `HighConversion`          | Data with high conversion rates (>80% each step)      |
| `LowConversion`           | Data with steep drop-offs (<20% each step)            |
| `SingleDropOff`           | One major drop-off point, others high conversion      |
| `WithTooltip`             | Tooltip interaction demonstration                     |
| `TooltipCustomContent`    | Custom tooltip showing only step conversion           |
| `StageLabelsLeft`         | Stage labels positioned on left (vertical)            |
| `StageLabelsTop`          | Stage labels positioned on top (horizontal)           |
| `KeyboardNavigation`      | Play function testing vertical a11y navigation        |
| `KeyboardNavigationHoriz` | Play function testing horizontal a11y navigation      |
| `OnStageClick`            | Click handler demonstration                           |
| `Responsive`              | Resizing behavior with aspectRatio                    |
| `FixedDimensions`         | Explicit width/height instead of aspectRatio          |
| `EmptyState`              | Empty data array with render prop                     |
| `LoadingState`            | Loading render prop                                   |
| `ErrorState`              | Error render prop with retry                          |
| `CompoundAPI`             | Compound composition with all parts                   |

## Key Decisions

| Aspect                 | Decision                          | Rationale                                                            |
| ---------------------- | --------------------------------- | -------------------------------------------------------------------- |
| **Shape approach**     | Path-based trapezoids             | Full control, classic funnel look, smooth edges                      |
| **Layout style**       | Centered (symmetric)              | Recognizable funnel silhouette, clear narrowing visual               |
| **Width calculation**  | Proportional to value             | Accurate representation of conversion data                           |
| **Conversion display** | Between stages (step rate)        | Immediate insight into where drop-off occurs                         |
| **Label placement**    | Beside stages                     | Keeps funnel clean, works at any size                                |
| **Orientation**        | Both vertical and horizontal      | Minimal extra complexity, covers different layout needs              |
| **Navigation mode**    | Vertical (↑/↓) or linear (←/→)    | Matches visual orientation; natural mental model                     |
| **Hover effect**       | Brightness increase               | Subtle feedback without distorting shape (unlike pie's pulled slice) |
| **Tooltip content**    | Value + step + overall conversion | Complete context for the stage                                       |
| **Data shape**         | `dataKey`/`nameKey` (like Pie)    | Funnel data is stage array, not time-series rows                     |
| **Aspect ratio**       | 3/4 vertical, 16/9 horizontal     | Natural proportions for each orientation                             |
| **Gap between stages** | Fixed gap for conversion labels   | Consistent spacing, room for "↓ 65%" labels                          |
| **Last stage width**   | Same as its value (no taper)      | Accurate representation; bottom isn't artificially narrowed          |

## Starting a Session

```
I'm implementing Proposal #6 (Funnel Chart) for nimbus-charts.
See docs/proposals/charts/06-funnel-chart.md for the finalized scope.
Foundation (#0) should be complete before starting.

Let's start with [Root context + stage calculations | Stages component | ConversionLabels | StageLabels | Tooltip].
```
