# Proposal #1: KPI Card

> **Status**: Ready for Implementation **Depends on**: Foundation (#0) **Can
> parallel with**: Line Chart (#2), Bar Chart (#3) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md) **Last Updated**: 2026-01-27
> (brainstorm complete)

## Overview

A presentational component for displaying key performance indicators with value,
trend indicator, and comparison text. Used extensively in e-commerce dashboards
for metrics like revenue, orders, AOV, and conversion rate.

## Scope

### Component API

**Compound composition only** (matches Nimbus patterns like Alert, Dialog):

```tsx
<KpiCard.Root variant="default">
  <KpiCard.Label>Total Revenue</KpiCard.Label>
  <KpiCard.Value>$1,234,567</KpiCard.Value>
  <KpiCard.Trend direction="up" sentiment="positive">
    +12.5%
  </KpiCard.Trend>
  <KpiCard.Comparison>vs. last month</KpiCard.Comparison>
</KpiCard.Root>
```

**All slots are optional** except Root - consumers can use just Label + Value
for simple metrics:

```tsx
<KpiCard.Root>
  <KpiCard.Label>Active Users</KpiCard.Label>
  <KpiCard.Value>1,234</KpiCard.Value>
</KpiCard.Root>
```

### Slots

| Slot         | Element | Purpose                                   |
| ------------ | ------- | ----------------------------------------- |
| `root`       | `div`   | Container, provides context               |
| `label`      | `div`   | Metric name (e.g., "Total Revenue")       |
| `value`      | `div`   | Primary metric value (e.g., "$1,234,567") |
| `trend`      | `div`   | Direction arrow + change value            |
| `comparison` | `div`   | Context text (e.g., "vs. last month")     |

### Props & Types

```typescript
// KpiCard.Root
type KpiCardRootProps = {
  variant?: "default" | "compact";
  children: React.ReactNode;
};

// KpiCard.Label
type KpiCardLabelProps = {
  children: React.ReactNode;
  // Inherits Chakra style props via slot
};

// KpiCard.Value
type KpiCardValueProps = {
  children: React.ReactNode;
  // Inherits Chakra style props via slot
};

// KpiCard.Trend
type TrendDirection = "up" | "down" | "unchanged";
type TrendSentiment = "positive" | "negative" | "neutral";

type KpiCardTrendProps = {
  direction: TrendDirection;
  sentiment: TrendSentiment;
  children: React.ReactNode; // The formatted value, e.g., "+12.5%"
};

// KpiCard.Comparison
type KpiCardComparisonProps = {
  children: React.ReactNode;
  // Inherits Chakra style props via slot
};
```

### Variants

| Variant   | Use case                           | Visual differences                                  |
| --------- | ---------------------------------- | --------------------------------------------------- |
| `default` | Standalone cards, dashboards       | Larger value text (`heading-medium`), standard gaps |
| `compact` | Dense dashboards, tables, sidebars | Smaller value text (`body-base`), tighter spacing   |

### Trend Indicator

**Direction** controls the arrow icon:

- `up` → ArrowUpward icon
- `down` → ArrowDownward icon
- `unchanged` → Remove (minus) icon

**Sentiment** controls the color (independent from direction):

- `positive` → `positive.11` (green) - good change
- `negative` → `critical.11` (red) - bad change
- `neutral` → `neutral.11` (gray) - informational

This separation is critical because "up" isn't always good (e.g., bounce rate
increasing is bad).

### Recipe

```typescript
export const kpiCardRecipe = defineSlotRecipe({
  slots: ["root", "label", "value", "trend", "comparison"],
  className: "nimbus-kpi-card",

  base: {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: "100",
    },
    label: {
      color: "neutral.11",
      fontSize: "body-small",
      fontWeight: "400",
    },
    value: {
      color: "neutral.12",
      fontWeight: "600",
    },
    trend: {
      display: "inline-flex",
      alignItems: "center",
      gap: "50",
      fontSize: "body-small",
    },
    comparison: {
      color: "neutral.10",
      fontSize: "body-small",
    },
  },

  variants: {
    variant: {
      default: {
        value: { fontSize: "heading-medium" },
      },
      compact: {
        root: { gap: "50" },
        value: { fontSize: "body-base" },
      },
    },
    sentiment: {
      positive: { trend: { color: "positive.11" } },
      negative: { trend: { color: "critical.11" } },
      neutral: { trend: { color: "neutral.11" } },
    },
  },
});
```

### i18n Messages

Minimal messages for screen reader announcements only (visual text comes from
children):

```typescript
// kpi-card.i18n.ts
export const kpiCardMessages = defineMessages({
  // Direction announcements
  trendIncreased: {
    id: "nimbus-charts.kpi-card.trend-increased",
    defaultMessage: "increased by {value}",
  },
  trendDecreased: {
    id: "nimbus-charts.kpi-card.trend-decreased",
    defaultMessage: "decreased by {value}",
  },
  trendUnchanged: {
    id: "nimbus-charts.kpi-card.trend-unchanged",
    defaultMessage: "unchanged at {value}",
  },

  // Sentiment qualifiers (appended to direction)
  sentimentPositive: {
    id: "nimbus-charts.kpi-card.sentiment-positive",
    defaultMessage: ", which is positive",
  },
  sentimentNegative: {
    id: "nimbus-charts.kpi-card.sentiment-negative",
    defaultMessage: ", which is negative",
  },
  sentimentNeutral: {
    id: "nimbus-charts.kpi-card.sentiment-neutral",
    defaultMessage: "",
  },
});

// Usage in component:
// "increased by +12.5%, which is negative" (for bounce rate going up)
const announcement = useMemo(() => {
  const directionMsg =
    direction === "up"
      ? formatMessage(messages.trendIncreased, { value: children })
      : direction === "down"
        ? formatMessage(messages.trendDecreased, { value: children })
        : formatMessage(messages.trendUnchanged, { value: children });

  const sentimentMsg =
    sentiment === "positive"
      ? formatMessage(messages.sentimentPositive)
      : sentiment === "negative"
        ? formatMessage(messages.sentimentNegative)
        : "";

  return `${directionMsg}${sentimentMsg}`;
}, [direction, sentiment, children, formatMessage]);
```

This ensures screen reader users hear both the direction AND the semantic
meaning (is this change good or bad?).

### Files to Create

```
packages/nimbus-charts/src/components/kpi-card/
├── kpi-card.tsx              # Main compound export
├── kpi-card.types.ts         # Type definitions
├── kpi-card.recipe.ts        # Slot recipe
├── kpi-card.slots.ts         # Chakra slot components
├── kpi-card.i18n.ts          # Screen reader messages
├── kpi-card.stories.tsx      # Stories with play functions
├── kpi-card.dev.mdx          # Developer documentation
├── components/
│   ├── kpi-card.root.tsx     # Root with context provider
│   ├── kpi-card.label.tsx    # Label slot
│   ├── kpi-card.value.tsx    # Value slot
│   ├── kpi-card.trend.tsx    # Trend with icon + a11y
│   └── kpi-card.comparison.tsx # Comparison slot
└── index.ts                  # Barrel export
```

## Deliverables

- [ ] Component with types, recipe, slots
- [ ] i18n messages for trend labels
- [ ] Stories covering:
  - Default variant with all slots
  - Compact variant
  - All sentiment variations (positive/negative/neutral)
  - All direction variations (up/down/unchanged)
  - Minimal usage (just label + value)
  - Loading state example (with Skeleton wrapper)
  - Accessibility test (screen reader announcement)
- [ ] MDX documentation

## Key Decisions

| Aspect              | Decision                         | Rationale                                           |
| ------------------- | -------------------------------- | --------------------------------------------------- |
| **API style**       | Compound only                    | Matches Nimbus patterns (Alert, Dialog, Drawer)     |
| **Trend direction** | Separate from sentiment          | "Up" isn't always good (e.g., bounce rate)          |
| **Trend value**     | Children only                    | Formatters are consumer responsibility (Foundation) |
| **Loading state**   | Consumer wraps with `<Skeleton>` | YAGNI - Chakra's Skeleton works well                |
| **Container**       | Naked (no border/background)     | Consumers wrap in Card/Box as needed                |
| **Accessibility**   | VisuallyHidden + aria-labelledby | Follows Nimbus patterns (React Aria)                |
| **i18n**            | Minimal (a11y labels only)       | Visual text formatted by consumer                   |

## Key Considerations

- **Not SVG-based** - This is a layout component, not a chart
- **A11y**: Uses Nimbus's `VisuallyHidden` for trend announcements,
  `aria-labelledby` linking value to label
- **i18n**: Only screen reader trend labels need translation
- **Styling**: Uses semantic color tokens, naked by default

## Starting a Session

```
I'm implementing Proposal #1 (KPI Card) for nimbus-charts.
See docs/proposals/charts/01-kpi-card.md for the finalized scope.
Foundation (#0) should be complete before starting.

Let's start with [types | recipe | slots | components].
```
