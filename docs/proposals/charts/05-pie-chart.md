# Proposal #5: Pie/Donut Chart

> **Status**: Not Started **Depends on**: Foundation (#0) **Can parallel with**:
> Area Chart (#4), Funnel Chart (#6) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md)

## Overview

A pie/donut chart component for visualizing parts of a whole. Use cases: revenue
by category, traffic by device, payment method distribution.

## Scope

### Component API

**Simple props:**

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
/>
```

**Compound composition:**

```tsx
<PieChart.Root data={categoryData} config={config}>
  <PieChart.Pie dataKey="value" nameKey="category" innerRadius={60} />
  <PieChart.CenterLabel>
    <Text fontWeight="bold">$1.2M</Text>
    <Text fontSize="sm">Total Revenue</Text>
  </PieChart.CenterLabel>
  <PieChart.Tooltip />
  <PieChart.Legend position="right" />
</PieChart.Root>
```

### Features

- Pie and donut variants (innerRadius controls)
- Center label for donut (total, title, etc.)
- Segment labels (value, percentage, or both)
- Tooltip on hover/focus
- Legend (clickable to highlight segment)
- Animated segment expansion on hover

### Variants

| Variant | Description                         |
| ------- | ----------------------------------- |
| `pie`   | Full circle, no center hole         |
| `donut` | Ring with customizable inner radius |

### Visx Packages

- `@visx/shape` - Pie, Arc
- `@visx/group` - Centering the chart

### Accessibility Considerations

Radial charts present unique a11y challenges:

- Keyboard navigation around the circle (clockwise/counter-clockwise)
- Meaningful announcements: "Electronics: $500,000, 42% of total"
- Consider if pie charts are the right choice for screen reader users (data
  table alternative is especially important here)

## Deliverables

- [ ] Component with compound parts (Root, Pie, CenterLabel, Tooltip, Legend)
- [ ] Pie and donut variants
- [ ] Stories covering all variants
- [ ] MDX documentation

## Starting a Session

```
I'm working on Proposal #5 (Pie/Donut Chart) for nimbus-charts.
See docs/proposals/charts/05-pie-chart.md for scope.
Foundation (#0) should be complete before starting.

Let's brainstorm the radial layout and donut center label patterns.
```
