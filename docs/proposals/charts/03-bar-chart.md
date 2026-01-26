# Proposal #3: Bar Chart

> **Status**: Not Started **Depends on**: Foundation (#0) **Can parallel with**:
> KPI Card (#1), Line Chart (#2) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md)

## Overview

A bar chart component for comparing categorical data. Core use cases: top
products, sales by category, revenue by channel.

## Scope

### Component API

**Simple props:**

```tsx
<BarChart
  data={categoryData}
  index="category"
  categories={["revenue"]}
  config={{
    revenue: { label: "Revenue", color: "chart.1" },
  }}
  orientation="vertical"
/>
```

**Compound composition:**

```tsx
<BarChart.Root data={data} config={config} orientation="horizontal">
  <BarChart.XAxis />
  <BarChart.YAxis dataKey="category" />
  <BarChart.Bar dataKey="revenue" />
  <BarChart.Bar dataKey="profit" />
  <BarChart.Tooltip />
  <BarChart.Legend />
</BarChart.Root>
```

### Features

- **Orientation**: Vertical (default) and horizontal
- **Grouping**: Single, grouped (side-by-side), stacked
- Multiple series support
- Tooltip on hover
- Optional legend
- Bar labels (optional, inside or outside)
- Responsive container

### Variants

| Variant      | Use Case                                        |
| ------------ | ----------------------------------------------- |
| `vertical`   | Default, good for time-based comparisons        |
| `horizontal` | Better for long category labels (product names) |
| `grouped`    | Comparing multiple metrics per category         |
| `stacked`    | Showing composition (parts of whole)            |

### Visx Packages

- `@visx/shape` - Bar, BarGroup, BarStack
- `@visx/group` - Group for positioning
- `@visx/axis` - Axis components
- `@visx/scale` - scaleBand, scaleLinear

### Accessibility

- Same patterns as Line Chart
- Keyboard navigation between bars
- Screen reader announces bar value and category
- Uses `useChartA11y` hook from Foundation

### Files to Create

- `bar-chart.tsx` - Main component + compound exports
- `bar-chart.types.ts` - Type definitions
- `bar-chart.recipe.ts` - Slot recipe
- `bar-chart.slots.ts` - Slot components
- `bar-chart.i18n.ts` - UI text
- `bar-chart.stories.tsx` - Stories with play functions
- `bar-chart.mdx` - Documentation
- `components/` - Compound part implementations

## Deliverables

- [ ] Component with compound parts
- [ ] Orientation variants (vertical, horizontal)
- [ ] Grouping variants (single, grouped, stacked)
- [ ] Stories covering all variants
- [ ] MDX documentation

## Starting a Session

```
I'm working on Proposal #3 (Bar Chart) for nimbus-charts.
See docs/proposals/charts/03-bar-chart.md for scope.
Foundation (#0) should be complete before starting.

Let's brainstorm the orientation and grouping variants.
```
