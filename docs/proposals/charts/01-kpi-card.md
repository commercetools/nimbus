# Proposal #1: KPI Card

> **Status**: Not Started **Depends on**: Foundation (#0) **Can parallel with**:
> Line Chart (#2), Bar Chart (#3) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md)

## Overview

A presentational component for displaying key performance indicators with value,
trend indicator, and comparison text. Used extensively in e-commerce dashboards
for metrics like revenue, orders, AOV, and conversion rate.

## Scope

### Component API

**Compound composition:**

```tsx
<KpiCard.Root>
  <KpiCard.Label>Total Revenue</KpiCard.Label>
  <KpiCard.Value>$1,234,567</KpiCard.Value>
  <KpiCard.Trend direction="up" value={12.5} />
  <KpiCard.Comparison>vs. last month</KpiCard.Comparison>
</KpiCard.Root>
```

**Simple props API:**

```tsx
<KpiCard
  label="Total Revenue"
  value={1234567}
  trend={{ direction: "up", value: 12.5 }}
  comparison="vs. last month"
  valueFormatter={(v) => `$${v.toLocaleString()}`}
/>
```

### Features

- Variants: `default`, `compact`
- Trend directions: `up`, `down`, `unchanged`
- Trend sentiment: `positive`, `negative`, `neutral` (up isn't always good)
- Loading state (skeleton)
- Custom value formatting

### Files to Create

- `kpi-card.tsx` - Main component + compound exports
- `kpi-card.types.ts` - Type definitions
- `kpi-card.recipe.ts` - Slot recipe
- `kpi-card.slots.ts` - Slot components
- `kpi-card.i18n.ts` - Trend labels ("increased", "decreased", "unchanged")
- `kpi-card.stories.tsx` - Stories with play functions
- `kpi-card.mdx` - Documentation
- `components/` - Compound part implementations

## Deliverables

- [ ] Component with types, recipe, slots
- [ ] i18n messages for trend labels
- [ ] Stories covering all variants, states, and a11y
- [ ] MDX documentation

## Key Considerations

- **Not SVG-based** - This is a layout component, not a chart
- **A11y**: Semantic HTML, proper heading levels, ARIA for trend indicators
- **i18n**: Trend labels need translation ("increased by 12.5%")

## Starting a Session

```
I'm working on Proposal #1 (KPI Card) for nimbus-charts.
See docs/proposals/charts/01-kpi-card.md for scope.
Foundation (#0) should be complete before starting.

Let's brainstorm the component API and variants.
```
