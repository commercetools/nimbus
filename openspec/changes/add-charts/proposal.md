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
- Add shared parts used by all six charts: `ChartContainer` (size and series
  color variables), `ChartTooltip`, `ChartLegend`, and the `ChartConfig` type.
- Use a prop-based API: `data`, `config`, `xAxisKey`, `series`, `stacked`,
  `showGrid`, `showTooltip`, `showLegend`, `isLoading`. `PieChart` and `RadialChart` take
  `nameKey` and `valueKey` instead of `xAxisKey` and `series`. Recharts parts are
  not exported and there is no children-based escape hatch in this version.
- Show the legend whenever a chart has two or more series (or categories), so
  color is never the only signal. `showLegend` only applies to charts with a
  single series.
- `ChartConfig` maps each data key to `{ label, palette }`. In this version a
  series color is a **palette name only** (for example `"violet"` or `"teal"`),
  typed as a union of the chart palette names. Arbitrary solid colors are
  deferred to a later change. The `config` shape allows adding a `color` field
  later without a breaking change.
- Add chart color tokens, generated at build time into a committed file
  (`packages/tokens/src/base/chart-tokens.json`). Chakra turns them into CSS
  variables such as `--nimbus-colors-chart-violet`. For each palette and each
  color mode, the build takes the palette's solid color (`DEFAULT`, which is step
  9) and adapts only its lightness, by the smallest amount that gives at least
  3:1 contrast against the current background of that mode (WCAG 1.4.11). A solid
  that already has 3:1 stays unchanged. A test fails the build if any chart color
  misses 3:1.
- Chart palettes are the palettes that have a white contrast color (23 palettes).
  Palettes with a black contrast color (`amber`, `lime`, `mint`, `sky`, `yellow`,
  `ctyellow` and `ctteal`) are not chart palettes. Their solids need a large
  lightness change to reach 3:1 (OKLCH lightness change of about -0.08 to -0.25,
  and a hue shift of up to 6.2 degrees for `ctyellow`), so the result would no
  longer look like the palette.
- Keep the chart look close to the shadcn charts (https://ui.shadcn.com/charts) in
  Nimbus colors. An area is drawn with the series color at reduced opacity, and
  the line on top uses the full series color.
- Make `aria-label` required in the chart types. Use the Recharts 3
  accessibility layer for keyboard and screen reader support. Separate adjacent
  bars and slices with a stroke in the background color. Chart text (axes,
  legend, tooltip, empty state) uses Nimbus text tokens with at least 4.5:1
  contrast (WCAG 1.4.3).
- Handle empty data (empty state), `isLoading` (skeleton), unknown series keys
  (development warning, series skipped) and invalid palettes (development
  warning, fallback to the first palette in production).
- Add `recharts` and `react-is` as dependencies of `@commercetools/nimbus`,
  within the repository's 24-hour release-age rule (`pnpm-workspace.yaml`).
  Recharts is bundled into the Nimbus dist.
- Add a changeset. No breaking changes.

Order of work, in case time runs out: foundation and palette tokens first, then
Bar, Line and Area, then Pie, then Radar and Radial. Radar and Radial are the
first to move to a later change.

## Capabilities

### New Capabilities

- `nimbus-charts`: Shared chart foundation (container, tooltip, legend, config,
  palette colors, states, accessibility) and the six chart types built on it.

### Modified Capabilities

- `color-tokens`: Adds the requirement to generate contrast-checked chart color
  tokens for each chart palette and color mode, into a committed token file.

## Impact

- New directories under `packages/nimbus/src/components/` for the shared chart
  parts and for each chart (component, types, recipe, slots, i18n, stories,
  designer and developer docs, docs spec, `index.ts`).
- `packages/color-tokens` (build script, uses the `chroma-js` dependency it
  already has) and `packages/tokens` (new committed `chart-tokens.json`, added to
  the Style Dictionary `source`).
- `packages/nimbus/package.json`: new dependencies `recharts` and `react-is`.
  The newest Recharts version that passes the 24-hour release-age rule today is
  3.10.1 (3.11.0 was published on 2026-11-17 at 16:54 UTC). Its peer range allows
  React 19.
- `packages/nimbus/vite.config.ts` does not externalize Recharts, so Recharts and
  its dependencies are bundled. `pnpm check:bundle-size` (fails above 5%) and
  `pnpm check:bundler-compat` must pass. The size is not measured yet.
- `packages/nimbus/src/theme/slot-recipes/index.ts`: new recipe registrations;
  theme typings regenerated. `packages/nimbus/src/components/index.ts`: new
  exports.
- Docs: `packages/color-tokens/CLAUDE.md`, `packages/tokens` docs, designer and
  developer MDX for each chart.
- Open questions to settle in `design.md`: whether charts on surfaces other than
  `bg` need their own check, whether `ctteal` should be included, and how Pie
  and Radial behave with the keyboard.
