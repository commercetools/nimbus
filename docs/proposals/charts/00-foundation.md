# Proposal #0: Foundation

> **Status**: Not Started **Blocks**: All other chart proposals **Parent Plan**:
> [nimbus-charts-plan.md](../nimbus-charts-plan.md)

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

- Add semantic tokens to `packages/tokens`:
  - `chart.1` through `chart.5` (categorical colors)
  - `chart.grid`, `chart.axis`, `chart.label` (structural)
  - `chart.1.contrast` through `chart.5.contrast`
- Rebuild tokens package
- Verify dark mode works automatically

### 0.3 Shared Infrastructure

**Hooks:**

- `useChartA11y` - Keyboard navigation (arrow keys), focus management (React
  Aria), screen reader announcements
- `useChartTheme` - Token resolution, color mode awareness
- `useChartFormatters` - Default value/label formatting utilities

**Primitives:**

- `ChartContainer` - Responsive wrapper, aspect ratio handling
- `ChartGrid` - Grid lines primitive (wraps Visx)
- `ChartEmptyState` - "No data available" with i18n
- `ChartErrorState` - Error display with retry action
- `ChartLoading` - Skeleton loader matching chart dimensions

**Base Types:**

- `ChartConfig` interface
- `BaseChartProps<T>` generic interface
- Shared prop types (size, formatters, events)

**i18n:**

- Shared messages for empty/error/loading states
- A11y announcement templates

## Deliverables

- [ ] Buildable package with `pnpm --filter @commercetools/nimbus-charts build`
- [ ] Tokens available and documented
- [ ] All hooks with unit tests
- [ ] All primitives with stories
- [ ] Base types exported

## Key Decisions (from brainstorm)

- **Library**: Visx for rendering
- **A11y approach**: Hybrid - React Aria for focus management, custom
  announcements
- **Token strategy**: Semantic aliases to existing `colors.{color}.{step}`
- **i18n**: Static text in `.i18n.ts`, data formatting via props

## Starting a Session

```
I'm working on Proposal #0 (Foundation) for nimbus-charts.
See docs/proposals/charts/00-foundation.md for scope.

Let's brainstorm the package structure and shared infrastructure.
```

Then use `/brainstorm` to explore specifics, followed by `/openspec:proposal`
when ready to formalize.
