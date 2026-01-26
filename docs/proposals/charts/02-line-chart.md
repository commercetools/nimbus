# Proposal #2: Line Chart

> **Status**: Not Started **Depends on**: Foundation (#0) **Can parallel with**:
> KPI Card (#1), Bar Chart (#3) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md)

## Overview

A line chart component for visualizing trends over time. Core use case: revenue,
orders, and session trends in e-commerce dashboards.

## Scope

### Component API

**Simple props:**

```tsx
<LineChart
  data={salesData}
  index="month"
  categories={["revenue", "orders"]}
  config={{
    revenue: { label: "Revenue", color: "chart.1" },
    orders: { label: "Orders", color: "chart.2" },
  }}
  showLegend
  valueFormatter={(v) => `$${v.toLocaleString()}`}
/>
```

**Compound composition:**

```tsx
<LineChart.Root data={salesData} config={config}>
  <LineChart.XAxis dataKey="month" tickFormatter={formatMonth} />
  <LineChart.YAxis />
  <LineChart.Line dataKey="revenue" />
  <LineChart.Line dataKey="orders" />
  <LineChart.Tooltip />
  <LineChart.Legend position="bottom" />
  <LineChart.Grid />
</LineChart.Root>
```

### Features

- Multiple series support
- Tooltip on hover (shared tooltip at x-position)
- Optional legend (clickable to toggle series)
- Grid lines (optional)
- Responsive container
- Curved vs straight lines option
- Data point markers (optional)

### Visx Packages

- `@visx/shape` - LinePath
- `@visx/axis` - Axis components
- `@visx/scale` - scaleLinear, scaleTime, scaleBand
- `@visx/tooltip` - Tooltip utilities
- `@visx/responsive` - ParentSize wrapper

### Accessibility

- Keyboard navigation between data points (arrow keys)
- Screen reader announcements for values and trends
- "Show as table" toggle linking to nimbus Table
- Focus indicators on interactive elements
- Uses `useChartA11y` hook from Foundation

### Files to Create

- `line-chart.tsx` - Main component + compound exports
- `line-chart.types.ts` - Type definitions
- `line-chart.recipe.ts` - Slot recipe
- `line-chart.slots.ts` - Slot components
- `line-chart.i18n.ts` - UI text
- `line-chart.stories.tsx` - Stories with play functions
- `line-chart.mdx` - Documentation
- `components/` - Compound part implementations

## Deliverables

- [ ] Component with compound parts (Root, Line, XAxis, YAxis, Tooltip, Legend)
- [ ] Recipe with slots
- [ ] Stories covering: basic, multi-series, with legend, empty, loading, error
- [ ] A11y tests in play functions
- [ ] MDX documentation

## Starting a Session

```
I'm working on Proposal #2 (Line Chart) for nimbus-charts.
See docs/proposals/charts/02-line-chart.md for scope.
Foundation (#0) should be complete before starting.

Let's brainstorm the Visx integration and component structure.
```
