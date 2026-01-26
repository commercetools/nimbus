# Nimbus Charts: Tailored Implementation Plan

> **Status**: Draft - Brainstorm output **Date**: 2026-01-26 **Based on**:
> External agency charting requirements document

## Executive Summary

Building a charting extension for Nimbus as a separate package
(`@commercetools/nimbus-charts`) using Visx for rendering, with first-class
accessibility baked in from day one.

---

## Key Decisions

| Aspect            | Decision                                | Rationale                                                                         |
| ----------------- | --------------------------------------- | --------------------------------------------------------------------------------- |
| **Library**       | Visx                                    | Best CSS-in-JS integration, tree-shakeable, full control for design system        |
| **Accessibility** | Hybrid: React Aria + custom             | React Aria for focus management, custom announcements for meaningful data context |
| **Package**       | Separate `@commercetools/nimbus-charts` | Opt-in for consumers, independent versioning, keeps core nimbus lean              |
| **Tokens**        | Semantic aliases                        | Reference existing `colors.{color}.{step}` via `chart.*` namespace                |
| **i18n**          | Hybrid with formatters                  | Static UI text in `.i18n.ts`, data formatting via props                           |
| **API**           | Props + compound composition            | Simple API for common cases, compound components for customization                |
| **KPI Card**      | In nimbus-charts                        | All data visualization components together                                        |

---

## Token Integration

Chart tokens will be semantic aliases to existing Radix-based colors (steps
1-12 + contrast):

```typescript
semanticTokens: {
  colors: {
    // Categorical (data series) - step 9 is the solid accent
    "chart.1": { value: "{colors.blue.9}" },
    "chart.2": { value: "{colors.teal.9}" },
    "chart.3": { value: "{colors.amber.9}" },
    "chart.4": { value: "{colors.purple.9}" },
    "chart.5": { value: "{colors.pink.9}" },

    // Structural
    "chart.grid": { value: "{colors.gray.6}" },
    "chart.axis": { value: "{colors.gray.11}" },
    "chart.label": { value: "{colors.gray.12}" },

    // Contrast for text on colored chart elements
    "chart.1.contrast": { value: "{colors.blue.contrast}" },
    "chart.2.contrast": { value: "{colors.teal.contrast}" },
    // etc.
  }
}
```

Dark mode comes free since each step already has `_light`/`_dark` baked in.

---

## Accessibility Architecture

### Core Requirements

1. **Keyboard navigation** - Arrow keys between data points, Enter/Space to
   activate
2. **Screen reader support** - Meaningful announcements (e.g., "Revenue
   increased 12% from January to February")
3. **Focus visibility** - 2px+ outline, 3:1 contrast
4. **Non-color differentiation** - Patterns/shapes alongside color

### Implementation Approach

- **React Aria**: `useFocusManager` for focus management, roving tabindex
- **Custom**: Chart-specific announcement logic with `aria-live` regions
- **Shared hook**: `useChartA11y` encapsulates keyboard nav + announcements

---

## Component API Design

### Progressive Disclosure Pattern

```tsx
// Level 1: Simple props (80% of use cases)
<AreaChart
  data={salesData}
  index="month"
  categories={["revenue"]}
  config={chartConfig}
/>

// Level 2: Common customization
<AreaChart
  data={salesData}
  index="month"
  categories={["revenue", "profit"]}
  config={chartConfig}
  showLegend
  valueFormatter={(v) => `$${v.toLocaleString()}`}
/>

// Level 3: Compound composition (full control)
<AreaChart.Root data={salesData} config={chartConfig}>
  <AreaChart.XAxis tickFormatter={formatMonth} />
  <AreaChart.YAxis />
  <AreaChart.Area dataKey="revenue" gradient />
  <AreaChart.Tooltip content={<CustomTooltip />} />
  <AreaChart.Legend position="bottom" />
</AreaChart.Root>
```

### Props Interface

```typescript
interface ChartConfig {
  [key: string]: {
    label: string;
    color: string; // Semantic token like "chart.1"
    icon?: React.ComponentType;
  };
}

interface BaseChartProps<T extends Record<string, unknown>> {
  data: T[];
  index: keyof T | string;
  categories: (keyof T | string)[];
  config: ChartConfig;

  // Optional with sensible defaults
  showTooltip?: boolean; // default: true
  showLegend?: boolean; // default: false
  showGrid?: boolean; // default: true

  // Formatters (i18n for dynamic data)
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;

  // Sizing
  size?: "sm" | "md" | "lg";
  aspectRatio?: number;

  // Events
  onValueChange?: (value: T | null) => void;
}
```

---

## Package Structure

```
packages/nimbus-charts/
├── src/
│   ├── components/
│   │   ├── area-chart/
│   │   │   ├── area-chart.tsx
│   │   │   ├── area-chart.types.ts
│   │   │   ├── area-chart.recipe.ts
│   │   │   ├── area-chart.slots.ts
│   │   │   ├── area-chart.i18n.ts
│   │   │   ├── area-chart.stories.tsx
│   │   │   ├── area-chart.mdx
│   │   │   ├── components/
│   │   │   │   ├── area-chart.root.tsx
│   │   │   │   ├── area-chart.area.tsx
│   │   │   │   ├── area-chart.x-axis.tsx
│   │   │   │   ├── area-chart.y-axis.tsx
│   │   │   │   ├── area-chart.tooltip.tsx
│   │   │   │   ├── area-chart.legend.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── bar-chart/
│   │   ├── line-chart/
│   │   ├── pie-chart/
│   │   ├── funnel-chart/
│   │   └── kpi-card/
│   ├── primitives/
│   │   ├── chart-container/
│   │   ├── chart-grid/
│   │   ├── chart-empty-state/
│   │   ├── chart-error-state/
│   │   └── chart-loading/
│   ├── hooks/
│   │   ├── use-chart-a11y.ts
│   │   ├── use-chart-theme.ts
│   │   └── use-chart-formatters.ts
│   ├── theme/
│   │   └── recipes.ts
│   └── index.ts
├── package.json
├── tsconfig.json
└── CLAUDE.md
```

### Dependencies

```json
{
  "peerDependencies": {
    "@commercetools/nimbus": "^x.x.x",
    "react": "^18.0.0",
    "react-aria-components": "^1.0.0"
  },
  "dependencies": {
    "@visx/axis": "^3.x.x",
    "@visx/grid": "^3.x.x",
    "@visx/group": "^3.x.x",
    "@visx/scale": "^3.x.x",
    "@visx/shape": "^3.x.x",
    "@visx/tooltip": "^3.x.x",
    "@visx/responsive": "^3.x.x"
  }
}
```

---

## Phased Roadmap

### Phase 1: MVP

1. KPI Card
2. Line Chart
3. Bar Chart

### Phase 2: Core Expansion

- Area Chart
- Pie/Donut Chart
- Funnel Chart

### Phase 3: Advanced

- Combo/Dual-axis Chart
- Gauge/Progress Chart
- Sparklines

### Phase 4: Specialized (If needed)

- Geographic maps
- Sankey diagrams
- Cohort heatmaps
- Waterfall charts

---

## i18n Strategy

### Static UI Text (in `.i18n.ts` files)

```typescript
// area-chart.i18n.ts
export const areaChartMessages = defineMessages({
  emptyState: {
    id: "nimbus-charts.area-chart.empty",
    defaultMessage: "No data available",
  },
  errorState: {
    id: "nimbus-charts.area-chart.error",
    defaultMessage: "Failed to load chart data",
  },
  // Accessibility announcements
  a11yTrendUp: {
    id: "nimbus-charts.area-chart.a11y.trend-up",
    defaultMessage: "{metric} increased {percent}% from {from} to {to}",
  },
});
```

### Dynamic Data (via formatter props)

```tsx
<AreaChart
  data={data}
  valueFormatter={(v) =>
    intl.formatNumber(v, { style: "currency", currency: "EUR" })
  }
  labelFormatter={(label) => intl.formatDate(label, { month: "short" })}
/>
```

---

## Open Questions

1. **Color palette size**: 5 categorical colors enough? Or extend to 8-10?
2. **Animation**: Include from Phase 1 or defer? (Must respect
   `prefers-reduced-motion`)
3. **Export capabilities**: PNG/CSV export in scope or out of scope?
4. **Zoom/pan**: Which chart types need this? Line/Area for time series?

---

## Work Streams & Proposals

### Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                     FOUNDATION (Sequential)                      │
│                         Proposal #0                              │
├─────────────────────────────────────────────────────────────────┤
│  Package Setup → Chart Tokens → Shared Hooks & Primitives       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 1 COMPONENTS (Parallel)                   │
│                   Proposals #1, #2, #3                           │
├─────────────────────────────────────────────────────────────────┤
│      KPI Card          Line Chart           Bar Chart           │
│     (Person A)         (Person B)          (Person C)           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PHASE 2 COMPONENTS (Parallel)                   │
│                   Proposals #4, #5, #6                           │
├─────────────────────────────────────────────────────────────────┤
│     Area Chart        Pie/Donut Chart      Funnel Chart         │
└─────────────────────────────────────────────────────────────────┘
```

---

### Proposal #0: Foundation

**Blocks**: All other proposals **Assignees**: 1 person (sets conventions for
others)

#### Scope

**0.1 Package Scaffolding**

- Create `packages/nimbus-charts/` directory structure
- Configure `package.json` with dependencies (Visx, peer deps)
- Configure `tsconfig.json` extending workspace config
- Set up build configuration (matching nimbus package)
- Create `CLAUDE.md` with package-specific guidelines
- Add to workspace `pnpm-workspace.yaml`

**0.2 Chart Tokens**

- Add semantic tokens to `packages/tokens`:
  ```
  chart.1 through chart.5 (categorical)
  chart.grid, chart.axis, chart.label (structural)
  chart.1.contrast through chart.5.contrast
  ```
- Rebuild tokens package
- Verify dark mode works automatically

**0.3 Shared Infrastructure**

_Hooks:_

- `useChartA11y` - Keyboard navigation (arrow keys), focus management (React
  Aria), screen reader announcements
- `useChartTheme` - Token resolution, color mode awareness
- `useChartFormatters` - Default value/label formatting utilities

_Primitives:_

- `ChartContainer` - Responsive wrapper, aspect ratio handling
- `ChartGrid` - Grid lines primitive (wraps Visx)
- `ChartEmptyState` - "No data available" with i18n
- `ChartErrorState` - Error display with retry action
- `ChartLoading` - Skeleton loader matching chart dimensions

_Base Types:_

- `ChartConfig` interface
- `BaseChartProps<T>` generic interface
- Shared prop types (size, formatters, events)

_i18n:_

- Shared messages for empty/error/loading states
- A11y announcement templates

#### Deliverables

- [ ] Buildable package with `pnpm --filter @commercetools/nimbus-charts build`
- [ ] Tokens available and documented
- [ ] All hooks with unit tests
- [ ] All primitives with stories
- [ ] Base types exported

---

### Proposal #1: KPI Card

**Depends on**: Foundation (#0) **Can parallel with**: Line Chart (#2), Bar
Chart (#3)

#### Scope

- `KpiCard` component with compound API:
  ```tsx
  <KpiCard.Root>
    <KpiCard.Label>Total Revenue</KpiCard.Label>
    <KpiCard.Value>$1,234,567</KpiCard.Value>
    <KpiCard.Trend direction="up" value={12.5} />
    <KpiCard.Comparison>vs. last month</KpiCard.Comparison>
  </KpiCard.Root>
  ```
- Simple props API:
  ```tsx
  <KpiCard
    label="Total Revenue"
    value={1234567}
    trend={{ direction: "up", value: 12.5 }}
    comparison="vs. last month"
    valueFormatter={(v) => `$${v.toLocaleString()}`}
  />
  ```
- Variants: default, compact
- Recipe with slots
- Full a11y (semantic HTML, ARIA)
- i18n for trend labels ("increased", "decreased", "unchanged")
- Stories with play functions
- Documentation

#### Deliverables

- [ ] Component with types, recipe, slots
- [ ] i18n messages
- [ ] Stories covering all variants and states
- [ ] MDX documentation

---

### Proposal #2: Line Chart

**Depends on**: Foundation (#0) **Can parallel with**: KPI Card (#1), Bar Chart
(#3)

#### Scope

- `LineChart` component with hybrid API (props + compound)
- Visx integration: `@visx/shape` (LinePath), `@visx/axis`, `@visx/scale`,
  `@visx/tooltip`
- Features:
  - Multiple series support
  - Tooltip on hover
  - Optional legend
  - Grid lines
  - Responsive container
- Full a11y:
  - Keyboard navigation between data points
  - Screen reader announcements for values and trends
  - "Show as table" toggle (links to nimbus Table)
- i18n for UI elements
- Stories with play functions testing interactions
- Documentation

#### Deliverables

- [ ] Component with compound parts (Root, Line, XAxis, YAxis, Tooltip, Legend)
- [ ] Recipe with slots
- [ ] useLineChart hook (if needed for complex state)
- [ ] Stories covering: basic, multi-series, with legend, empty, loading, error
- [ ] A11y tests in play functions
- [ ] MDX documentation

---

### Proposal #3: Bar Chart

**Depends on**: Foundation (#0) **Can parallel with**: KPI Card (#1), Line Chart
(#2)

#### Scope

- `BarChart` component with hybrid API
- Visx integration: `@visx/shape` (Bar), `@visx/group`, `@visx/axis`,
  `@visx/scale`
- Features:
  - Vertical and horizontal orientation
  - Grouped bars (multiple series)
  - Stacked bars variant
  - Tooltip on hover
  - Optional legend
- Full a11y (same patterns as Line Chart)
- i18n
- Stories and documentation

#### Deliverables

- [ ] Component with compound parts
- [ ] Orientation variants (vertical, horizontal)
- [ ] Grouping variants (grouped, stacked)
- [ ] Stories covering all variants
- [ ] MDX documentation

---

### Proposal #4: Area Chart

**Depends on**: Foundation (#0) **Recommended**: After Line Chart (#2) - shares
patterns **Can parallel with**: Pie Chart (#5), Funnel Chart (#6)

#### Scope

- `AreaChart` component (similar structure to Line Chart)
- Visx integration: `@visx/shape` (AreaClosed), gradients
- Features:
  - Gradient fills
  - Stacked areas
  - All Line Chart features
- Reuse patterns from Line Chart

#### Deliverables

- [ ] Component with compound parts
- [ ] Gradient support
- [ ] Stacked variant
- [ ] Stories and documentation

---

### Proposal #5: Pie/Donut Chart

**Depends on**: Foundation (#0) **Can parallel with**: Area Chart (#4), Funnel
Chart (#6)

#### Scope

- `PieChart` component
- Visx integration: `@visx/shape` (Pie, Arc)
- Features:
  - Pie and donut variants
  - Segment labels
  - Tooltip on hover/focus
  - Legend
  - Center label (for donut)
- A11y considerations specific to radial charts

#### Deliverables

- [ ] Component with compound parts
- [ ] Pie and donut variants
- [ ] Stories and documentation

---

### Proposal #6: Funnel Chart

**Depends on**: Foundation (#0) **Can parallel with**: Area Chart (#4), Pie
Chart (#5)

#### Scope

- `FunnelChart` component
- Custom Visx implementation (no built-in funnel)
- Features:
  - Horizontal and vertical orientation
  - Stage labels with values and percentages
  - Conversion rate display between stages
  - Tooltip
- E-commerce focus: cart abandonment visualization

#### Deliverables

- [ ] Component with compound parts
- [ ] Orientation variants
- [ ] Conversion rate calculations
- [ ] Stories and documentation

---

## Assignment Matrix

| Proposal        | Dependencies    | Can Start   | Parallelizable With |
| --------------- | --------------- | ----------- | ------------------- |
| #0 Foundation   | None            | Immediately | None (blocks all)   |
| #1 KPI Card     | #0              | After #0    | #2, #3              |
| #2 Line Chart   | #0              | After #0    | #1, #3              |
| #3 Bar Chart    | #0              | After #0    | #1, #2              |
| #4 Area Chart   | #0 (ideally #2) | After #0    | #5, #6              |
| #5 Pie Chart    | #0              | After #0    | #4, #6              |
| #6 Funnel Chart | #0              | After #0    | #4, #5              |

---

## Next Steps

- [ ] Create OpenSpec proposal for Foundation (#0)
- [ ] Review and approve Foundation proposal
- [ ] Implement Foundation
- [ ] Create OpenSpec proposals for Phase 1 components (#1, #2, #3)
- [ ] Assign to team members
- [ ] Begin parallel implementation
- [ ] Create OpenSpec proposals for each work stream
- [ ] Assign to team members
