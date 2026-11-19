## Why

Nimbus has no chart components. A product team needs a dashboard by the end of
this week and needs Area, Bar, Line, Pie, Radar and Radial charts that look and
behave like the rest of Nimbus. Without them, each team picks its own chart
library and colors, and the charts do not follow Nimbus themes, light and dark
mode, or the Nimbus contrast rules.

## What Changes

- Add six chart components to `@commercetools/nimbus`: `AreaChart`, `BarChart`,
  `LineChart`, `PieChart`, `RadarChart` and `RadialChart`. Each is a thin Nimbus
  layer over Recharts 3.x. Recharts is also the library behind the shadcn charts
  that the team referenced (confirmed by the requester).
- Add shared internal parts used by all six charts: `ChartContainer` (size,
  empty and loading states, series colors through context), `ChartTooltip` (with
  an optional `nameKey`) and `ChartLegend`. Only the `ChartConfig` type and its
  related types are exported.
- Use a prop-based API: `data`, `config`, `xAxisKey`, `series`, `stacked`,
  `showGrid`, `showTooltip`, `showLegend`, `isLoading`, `isAnimationActive`.
  `PieChart` and `RadialChart` take `nameKey` and `valueKey` instead of
  `xAxisKey` and `series`. Recharts parts are not exported.
- Add a `Chart` namespace for charts that the six components cannot draw, for
  example bars and a line in one chart. It holds Nimbus parts: `Chart.Root`,
  `Chart.Plot`, `Chart.Bar`, `Chart.Line`, `Chart.Area`, `Chart.XAxis`,
  `Chart.Grid` and `Chart.Tooltip`. Each part is a Nimbus component that wraps
  one Recharts part, takes its color, label and animation from `config`, and
  exposes only a few documented props. Consumers never import from `recharts`.
  `BarChart`, `LineChart` and `AreaChart` are built from the same parts.
  Composition covers the cartesian charts (bar, line, area). `PieChart`,
  `RadarChart` and `RadialChart` stay prop-based.
- Show the legend whenever a chart has two or more series (or categories), so
  color is never the only signal. `showLegend` only applies to charts with a
  single series.
- `ChartConfig` maps each data key to `{ label, palette }`. `palette` is
  optional: a key without a palette gets the next palette of the default order.
  In this version a series color is a **palette name only** (for example
  `"violet"` or `"teal"`), typed as a union of the chart palette names.
  Arbitrary solid colors are deferred to a later change. The `config` shape
  allows adding a `color` field later without a breaking change.
- A series color is the palette solid (`colors.<palette>.9`, step 9), unchanged:
  `var(--nimbus-colors-<palette>-9)`. This is the token that every Nimbus
  component already uses through `colorPalette.9`, so charts add no color tokens
  and change no token package. Nimbus checks its colors with APCA, and the
  solids count as verified. If a chart ever needs a derived color, it adapts the
  solid at run time with CSS `color-mix()`.
- Chart palettes are the palettes that have a white contrast color (23
  palettes). Palettes with a black contrast color (`amber`, `lime`, `mint`,
  `sky`, `yellow`, `ctyellow` and `ctteal`) are not chart palettes, because
  their solids are too light for a line or a bar on the page background.
- Keep the chart look close to the shadcn charts (https://ui.shadcn.com/charts)
  in Nimbus colors. An area is drawn with a gradient of the series color, and
  the line on top uses the full series color.
- Make `aria-label` required in the chart types. Use the Recharts 3
  accessibility layer for keyboard and screen reader support. Separate adjacent
  bars and slices with a stroke in the background color. Chart text (axes,
  legend, tooltip, empty state) uses Nimbus text tokens with at least 4.5:1
  contrast (WCAG 1.4.3).
- Handle empty data (empty state), `isLoading` (skeleton), unknown series keys
  (development warning, series skipped) and invalid palettes (development
  warning, fallback to the first palette in production).
- Add `recharts` as a required peer dependency of `@commercetools/nimbus`, like
  Slate: it is external in the library build and a dev dependency. `react-is` (a
  peer dependency of Recharts) is a dev dependency. Consumers who use charts
  install `recharts` and `react-is` (a new "Charts (Optional)" section in the
  installation docs). Bundling Recharts was measured and rejected (see
  `design.md`). The version stays within the repository's 24-hour release-age
  rule.
- Add one changeset for `@commercetools/nimbus` (the charts and the new peer
  dependency). There are no breaking changes, but package managers warn about
  the new peer dependency `recharts` when it is missing, also for consumers who
  do not use charts.

Order of work, in case time runs out: foundation and palette colors first, then
Bar, Line and Area, then Pie, then Radar and Radial. Radar and Radial are the
first to move to a later change.

## Capabilities

### New Capabilities

- `nimbus-charts`: Shared chart foundation (container, tooltip, legend, config,
  palette colors, states, accessibility) and the six chart types built on it.

## Impact

- New directories under `packages/nimbus/src/components/` for the shared chart
  parts and for each chart (component, types, recipe, slots, i18n, stories,
  designer and developer docs, docs spec, `index.ts`).
- `packages/nimbus/package.json`: `recharts` as a peer dependency and, with
  `react-is`, as dev dependencies (through the new `charts` catalog in
  `pnpm-workspace.yaml`). The newest Recharts version that passes the 24-hour
  release-age rule today is 3.10.1 (3.11.0 was published on 2026-11-17 at 16:54
  UTC). Its peer range allows React 19.
- `packages/nimbus/vite.config.ts`: `recharts` is added to the externals.
  Measured with a throwaway chart: the dist grows by 2.9 KB and both
  `pnpm check:bundle-size` and `pnpm check:bundler-compat` pass. Bundled, it
  grew the dist by 23.8% and failed the strict bundler check.
- `packages/nimbus/src/docs/home-installation.mdx`: new "Charts (Optional)"
  section.
- `packages/nimbus/src/theme/slot-recipes/index.ts`: new recipe registrations;
  theme typings regenerated. `packages/nimbus/src/components/index.ts`: new
  exports.
- Docs: designer and developer MDX for each chart.
- Also changed: `packages/i18n/data/*.json` (new message `Nimbus.Chart.empty`)
  and `apps/docs/package.json`.
- No change in `packages/color-tokens`, `packages/tokens` or
  `packages/design-token-ts-plugin`.
- `ctteal` stays excluded in this version (see `design.md`).
