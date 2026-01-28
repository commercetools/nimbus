# Proposal #0: Foundation

> **Status**: Ready for Implementation **Blocks**: All other chart proposals
> **Parent Plan**: [nimbus-charts-plan.md](../nimbus-charts-plan.md) **Last
> Updated**: 2026-01-27 (brainstorm complete)

## Overview

Set up the `@commercetools/nimbus-charts` package with shared infrastructure
that all chart components will depend on.

## Scope

### 0.1 Package Scaffolding

- Create `packages/nimbus-charts/` directory structure
- Configure `package.json` with dependencies (Visx, peer deps)
- Configure `tsconfig.json` extending workspace config
- Set up build configuration (matching nimbus package patterns)
- Create `CLAUDE.md` with package-specific guidelines
- Add to workspace `pnpm-workspace.yaml`

### 0.2 Chart Tokens

**7 categorical colors** (based on Miller's Law — 7 ± 2 cognitive limit):

| Token     | Maps To    | Contrast Token                         |
| --------- | ---------- | -------------------------------------- |
| `chart.1` | `blue.9`   | `chart.1.contrast` → `blue.contrast`   |
| `chart.2` | `teal.9`   | `chart.2.contrast` → `teal.contrast`   |
| `chart.3` | `amber.9`  | `chart.3.contrast` → `amber.contrast`  |
| `chart.4` | `purple.9` | `chart.4.contrast` → `purple.contrast` |
| `chart.5` | `pink.9`   | `chart.5.contrast` → `pink.contrast`   |
| `chart.6` | `cyan.9`   | `chart.6.contrast` → `cyan.contrast`   |
| `chart.7` | `orange.9` | `chart.7.contrast` → `orange.contrast` |

**Structural tokens**:

| Token         | Maps To   | Purpose              |
| ------------- | --------- | -------------------- |
| `chart.grid`  | `gray.6`  | Grid lines           |
| `chart.axis`  | `gray.11` | Axis lines           |
| `chart.label` | `gray.12` | Axis labels, legends |

Dark mode works automatically via existing `_light`/`_dark` conditions in the
Radix color steps.

### Color Overflow Behavior (8+ Categories)

When data exceeds 7 categories, colors cycle with a development warning:

```typescript
const getSeriesColor = (index: number, totalSeries: number): string => {
  const colorIndex = (index % 7) + 1; // 1-indexed tokens

  if (
    process.env.NODE_ENV === "development" &&
    totalSeries > 7 &&
    index === 7 // Warn once when first overflow occurs
  ) {
    console.warn(
      `[nimbus-charts] ${totalSeries} series exceeds recommended maximum of 7. ` +
        `Colors will cycle, which may reduce distinguishability. ` +
        `Consider: (1) aggregating smaller categories, (2) using custom colors via config, ` +
        `or (3) splitting into multiple charts.`
    );
  }

  return `chart.${colorIndex}`;
};
```

**Consumer override for custom colors**:

```tsx
<LineChart
  data={data}
  index="date"
  categories={["a", "b", "c", "d", "e", "f", "g", "h", "i"]}
  config={{
    // First 7 use defaults, override 8th and 9th
    h: { label: "Series H", color: "violet.9" },
    i: { label: "Series I", color: "lime.9" },
  }}
/>
```

Config colors take precedence over cycling defaults.

> **TODO**: The 7-color limit is arbitrary—we have 20+ color scales available.
> Before implementation, we need to determine the optimal color sequence to
> maximize accessibility (sufficient contrast between adjacent colors, works for
> common forms of color blindness). This requires design input.

### 0.3 Shared Infrastructure

#### Hooks

| Hook           | Responsibility                                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `useChartA11y` | Keyboard navigation with configurable modes (linear/circular/vertical), focus management via React Aria, `aria-live` announcements |

**Eliminated hooks** (YAGNI):

- ~~`useChartTheme`~~ — Use Chakra's `useToken` directly
- ~~`useChartFormatters`~~ — Consumer responsibility via
  `valueFormatter`/`labelFormatter` props

#### Primitives

**Public exports**:

| Primitive        | Responsibility                                                                                                                    |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `ChartContainer` | Responsive wrapper using Visx `ParentSize`. Supports `aspectRatio` OR explicit `width`/`height`. Optional `maxHeight` constraint. |
| `ChartGrid`      | Grid lines primitive wrapping `@visx/grid` for consistent styling                                                                 |

**Internal only** (not exported):

- Default renderer for `renderEmptyState` prop
- Default renderer for `renderErrorState` prop
- Default renderer for `renderLoading` prop

These follow the DataTable pattern — render props with sensible defaults.

#### Base Types

```typescript
interface ChartConfig {
  [key: string]: {
    label: string;
    color: string; // Semantic token, e.g., "chart.1"
    icon?: React.ComponentType;
  };
}

interface BaseChartProps<T extends Record<string, unknown>> {
  data: T[];
  index: keyof T | string;
  categories: (keyof T | string)[];
  config: ChartConfig;

  // Sizing (aspectRatio OR width/height)
  aspectRatio?: number;
  width?: number;
  height?: number;
  maxHeight?: number;

  // Display options
  showTooltip?: boolean; // default: true
  showLegend?: boolean; // default: false
  showGrid?: boolean; // default: true

  // Formatters (consumer provides, no defaults)
  valueFormatter?: (value: number) => string;
  labelFormatter?: (label: string) => string;

  // State render props (with internal defaults)
  renderEmptyState?: () => ReactNode;
  renderErrorState?: (error: Error, retry: () => void) => ReactNode;
  renderLoading?: () => ReactNode;

  // Events
  onValueChange?: (value: T | null) => void;
}
```

#### i18n

**Minimal shared messages** (chart-specific announcements defined per-chart):

```typescript
// src/i18n/charts.i18n.ts
export const sharedChartMessages = defineMessages({
  emptyState: {
    id: "nimbus-charts.shared.empty",
    defaultMessage: "No data available",
  },
  errorState: {
    id: "nimbus-charts.shared.error",
    defaultMessage: "Failed to load chart",
  },
  errorRetry: {
    id: "nimbus-charts.shared.error-retry",
    defaultMessage: "Retry",
  },
  loadingState: {
    id: "nimbus-charts.shared.loading",
    defaultMessage: "Loading chart",
  },
});
```

### 0.4 Out of Scope

| Item               | Deferred To | Rationale                          |
| ------------------ | ----------- | ---------------------------------- |
| Complex animations | Phase 2     | Entrance/exit animations, morphing |
| Export (PNG/CSV)   | TBD         | Evaluate need after Phase 1        |
| Zoom/pan           | TBD         | Evaluate need after Phase 1        |

### Motion Preferences (Phase 1 Requirement)

All transition properties in recipes MUST respect `prefers-reduced-motion`:

```typescript
// In each chart recipe, wrap transitions:
const transition = {
  base: "opacity 0.15s ease-out, transform 0.15s ease-out",
  reduced: "none",
};

// Recipe usage:
bar: {
  transition: "var(--nimbus-chart-transition)",
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
}
```

**Foundation provides a CSS custom property**:

```css
:root {
  --nimbus-chart-transition: opacity 0.15s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --nimbus-chart-transition: none;
  }
}
```

**All recipes must use this variable** instead of hardcoded transitions.

## Deliverables

- [ ] Buildable package: `pnpm --filter @commercetools/nimbus-charts build`
- [ ] Tokens added to `packages/tokens` and documented
- [ ] `useChartA11y` hook with unit tests covering all navigation modes
- [ ] `ChartContainer` primitive with stories (aspect ratio + fixed sizing)
- [ ] `ChartGrid` primitive with stories
- [ ] Base types exported from package index
- [ ] Minimal shared i18n messages

## Key Decisions

| Aspect               | Decision                            | Rationale                                                         |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| **Library**          | Visx                                | Best CSS-in-JS integration, tree-shakeable, full control          |
| **Color palette**    | 7 categorical colors                | Miller's Law (7 ± 2 cognitive limit)                              |
| **Animations**       | Deferred to Phase 2                 | Foundation focuses on structure, not polish                       |
| **Theme hook**       | Use `useToken` directly             | No abstraction needed over Chakra's existing hook                 |
| **Formatters**       | Consumer responsibility             | Consumers have their own `intl` setup and locale                  |
| **A11y hook**        | Full-featured with navigation modes | Centralizes a11y logic, handles linear/circular/vertical patterns |
| **State primitives** | Render props with defaults          | Matches DataTable pattern, allows customization                   |
| **Sizing**           | Both aspectRatio and fixed          | Flexibility for responsive and fixed-size use cases               |
| **i18n**             | Minimal shared messages             | Chart-specific announcements defined per-chart                    |

### Legend Interaction Patterns

Legend click behavior intentionally differs by chart type:

| Chart Type | Legend Click | Rationale                                    |
| ---------- | ------------ | -------------------------------------------- |
| Line       | Toggle       | Series are independent; hiding one is valid  |
| Bar        | Toggle       | Series are independent; hiding one is valid  |
| Area       | Toggle       | Series are independent; hiding one is valid  |
| Pie        | Highlight    | Segments are parts of whole; hiding breaks % |
| Funnel     | N/A          | No legend (sequential stages)                |

**Why Pie uses Highlight instead of Toggle**:

Pie charts represent parts of a whole (100%). "Hiding" a segment creates
ambiguity:

- Does the pie now show 100% of remaining data? (misleading—totals changed)
- Does it show a gap? (visually confusing)
- Do percentages recalculate? (unexpected data transformation)

Highlighting (dimming others) preserves the whole-to-part relationship while
allowing focus on a specific segment. This matches user expectations from tools
like Google Analytics and Tableau.

If consumers need toggle behavior for categorical data, they should use a Bar or
Area chart instead.

## Implementation Notes

### useChartA11y Hook Design

```typescript
type NavigationMode = "linear" | "circular" | "vertical";

interface UseChartA11yOptions {
  navigationMode: NavigationMode;
  dataPoints: Array<{ label: string; value: number }>;
  onFocusChange?: (index: number) => void;
}

interface UseChartA11yReturn {
  // Keyboard event handlers
  getContainerProps: () => React.HTMLAttributes<HTMLDivElement>;
  getDataPointProps: (index: number) => React.HTMLAttributes<SVGElement>;

  // Announcement helpers
  announce: (message: string) => void;

  // Focus state
  focusedIndex: number | null;
  setFocusedIndex: (index: number | null) => void;
}
```

Navigation modes:

- **linear**: Arrow left/right for Line, Bar, Area charts
- **circular**: Arrow left/right wraps around for Pie/Donut charts
- **vertical**: Arrow up/down for Funnel charts

### ChartContainer Sizing Priority

1. If `width` AND `height` provided → use fixed dimensions
2. If `aspectRatio` provided → derive height from measured width
3. If only `width` provided → use width, height defaults to 400px
4. If nothing provided → 100% width, 16:9 aspect ratio

### ARIA Structure Pattern

All SVG-based charts MUST use the following accessible structure:

```tsx
// ✅ Correct: figure role allows semantic children
<div
  role="figure"
  aria-labelledby={labelId}
  aria-describedby={descriptionId}
  tabIndex={0}
  onKeyDown={handleKeyDown}
>
  {/* Hidden accessible description */}
  <VisuallyHidden id={labelId}>{chartTitle}</VisuallyHidden>
  <VisuallyHidden id={descriptionId}>{chartDescription}</VisuallyHidden>

  {/* SVG is presentational - semantics come from the wrapper */}
  <svg role="presentation" aria-hidden="true">
    {/* Visual elements have no ARIA roles */}
    {dataPoints.map((point) => (
      <circle key={point.id} /* no role */ />
    ))}
  </svg>

  {/* Screen reader data table (hidden visually) */}
  <VisuallyHidden>
    <table>
      <caption>{chartTitle}</caption>
      <thead>
        <tr>
          <th>{indexLabel}</th>
          {categories.map((cat) => (
            <th key={cat}>{config[cat].label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row[index]}>
            <td>{row[index]}</td>
            {categories.map((cat) => (
              <td key={cat}>{valueFormatter(row[cat])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </VisuallyHidden>
</div>

// ❌ Invalid: role="img" with semantic children
<div role="img" aria-label="...">
  <svg role="presentation">
    <element role="listitem" /> {/* ARIA violation! */}
  </svg>
</div>
```

**Rationale**:

- `role="figure"` is a grouping role that supports `aria-labelledby` and allows
  child content
- SVG elements are `aria-hidden` — all semantics come from the hidden data table
- Data table provides screen reader users with full data access in familiar
  format
- Focus management and keyboard nav operate on the figure container, not SVG
  elements

## Starting a Session

```
I'm implementing Proposal #0 (Foundation) for nimbus-charts.
See docs/proposals/charts/00-foundation.md for the finalized scope.

Let's start with [package scaffolding | tokens | useChartA11y | primitives].
```
