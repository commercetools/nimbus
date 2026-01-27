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

| Item             | Deferred To | Rationale                                                                     |
| ---------------- | ----------- | ----------------------------------------------------------------------------- |
| Animations       | Phase 2     | Polish, not core. Need real charts to test `prefers-reduced-motion` handling. |
| Export (PNG/CSV) | TBD         | Evaluate need after Phase 1                                                   |
| Zoom/pan         | TBD         | Evaluate need after Phase 1                                                   |

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

## Starting a Session

```
I'm implementing Proposal #0 (Foundation) for nimbus-charts.
See docs/proposals/charts/00-foundation.md for the finalized scope.

Let's start with [package scaffolding | tokens | useChartA11y | primitives].
```
