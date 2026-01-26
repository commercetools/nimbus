# Proposal #6: Funnel Chart

> **Status**: Not Started **Depends on**: Foundation (#0) **Can parallel with**:
> Area Chart (#4), Pie Chart (#5) **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md)

## Overview

A funnel chart component for visualizing conversion flows. Primary use case:
e-commerce checkout funnel (sessions → product views → add to cart → checkout →
purchase).

## Scope

### Component API

**Simple props:**

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
/>
```

**Compound composition:**

```tsx
<FunnelChart.Root data={funnelData} config={config} orientation="vertical">
  <FunnelChart.Stage dataKey="sessions" />
  <FunnelChart.Stage dataKey="productViews" />
  <FunnelChart.Stage dataKey="addToCart" />
  <FunnelChart.Stage dataKey="checkout" />
  <FunnelChart.Stage dataKey="purchase" />
  <FunnelChart.ConversionLabels />
  <FunnelChart.Tooltip />
</FunnelChart.Root>
```

### Features

- Vertical (default) and horizontal orientation
- Stage labels with values and percentages
- Conversion rate between stages (e.g., "45% conversion")
- Drop-off visualization
- Tooltip with stage details
- Responsive sizing

### Data Format

```typescript
interface FunnelData {
  stage: string;
  value: number;
  // Optional
  previousValue?: number; // For calculating conversion
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

### Visx Implementation

Visx doesn't have a built-in funnel. Implementation options:

1. Custom SVG shapes (trapezoids) with `@visx/shape` primitives
2. Stacked bars with decreasing widths
3. Path-based approach with calculated vertices

### Accessibility

- Linear navigation through stages (Tab or arrow keys)
- Announcements: "Add to Cart: 2,600 users, 40% conversion from Product Views"
- Conversion rates are key information to announce

## Deliverables

- [ ] Component with compound parts
- [ ] Orientation variants (vertical, horizontal)
- [ ] Conversion rate calculations and display
- [ ] Stories and documentation

## Starting a Session

```
I'm working on Proposal #6 (Funnel Chart) for nimbus-charts.
See docs/proposals/charts/06-funnel-chart.md for scope.
Foundation (#0) should be complete before starting.

Let's brainstorm the custom Visx implementation for funnel shapes.
```
