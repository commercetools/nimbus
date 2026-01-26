# Proposal #4: Area Chart

> **Status**: Not Started **Depends on**: Foundation (#0), ideally Line Chart
> (#2) for shared patterns **Can parallel with**: Pie Chart (#5), Funnel Chart
> (#6) **Parent Plan**: [nimbus-charts-plan.md](../nimbus-charts-plan.md)

## Overview

An area chart component for visualizing trends with filled regions. Builds on
Line Chart patterns with added gradient fills and stacking capabilities.

## Scope

### Component API

**Simple props:**

```tsx
<AreaChart
  data={salesData}
  index="month"
  categories={["revenue", "costs"]}
  config={{
    revenue: { label: "Revenue", color: "chart.1" },
    costs: { label: "Costs", color: "chart.2" },
  }}
  stacked
/>
```

**Compound composition:**

```tsx
<AreaChart.Root data={salesData} config={config}>
  <AreaChart.XAxis dataKey="month" />
  <AreaChart.YAxis />
  <AreaChart.Area dataKey="revenue" gradient />
  <AreaChart.Area dataKey="costs" gradient />
  <AreaChart.Tooltip />
  <AreaChart.Legend />
</AreaChart.Root>
```

### Features

- All Line Chart features
- Gradient fills (vertical gradient from color to transparent)
- Stacked areas (for composition over time)
- Stroke line on top of fill
- Opacity control

### Variants

| Variant    | Use Case                                           |
| ---------- | -------------------------------------------------- |
| `default`  | Single or overlapping areas                        |
| `stacked`  | Parts of whole over time (revenue by product line) |
| `gradient` | Visual polish with color fade                      |

### Visx Packages

- `@visx/shape` - AreaClosed, AreaStack
- `@visx/curve` - Curve interpolation options
- `@visx/gradient` - LinearGradient definitions

### Relationship to Line Chart

Area Chart should reuse significant code from Line Chart:

- Same axis components
- Same tooltip patterns
- Same legend component
- Same a11y approach

Consider extracting shared primitives during implementation.

## Deliverables

- [ ] Component with compound parts
- [ ] Gradient support
- [ ] Stacked variant
- [ ] Stories and documentation

## Starting a Session

```
I'm working on Proposal #4 (Area Chart) for nimbus-charts.
See docs/proposals/charts/04-area-chart.md for scope.
Foundation (#0) should be complete. Review Line Chart (#2) for shared patterns.

Let's brainstorm how to extend Line Chart patterns for Area.
```
