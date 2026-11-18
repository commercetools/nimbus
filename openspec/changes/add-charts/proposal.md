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
  `showLegend`, `showGrid`, `showTooltip`, `isLoading`. `PieChart` and
  `RadialChart` take `nameKey` and `valueKey` instead of `xAxisKey` and
  `series`. Recharts parts are not exported and there is no children-based
  escape hatch in this version.
- `ChartConfig` maps each data key to `{ label, palette }`. In this version a
  series color is a **palette name only** (for example `"violet"` or `"teal"`).
  Arbitrary solid colors are deferred to a later change. The `config` shape
  allows adding a `color` field later without a breaking change.
- Add chart palette CSS variables (for example `--nimbus-chart-violet`),
  generated at build time. For each palette and each color mode, the build takes
  the palette's solid color (the `DEFAULT`, which is step 9) and adapts only its
  lightness, so that it has at least 3:1 contrast against the current background
  of that mode (WCAG 1.4.11). The result is the closest possible version of the
  solid color: darker or lighter only as far as needed. The build can also
  generate intermediate colors between the adapted solid and the background (for
  example for area fills). A test fails the build if any chart color misses 3:1.
- Chart palettes are the palettes that have a white contrast color. Palettes with
  a black contrast color (`amber`, `lime`, `mint`, `sky`, `yellow`,
  `ctyellow` and `ctteal`) are not chart palettes. Their solid colors are too
  light on a light background, so excluding them keeps the color calculation
  simple.
- Charts follow the look of the shadcn charts (https://ui.shadcn.com/charts) in
  Nimbus colors.
- Make `aria-label` required in the chart types. Use the Recharts 3
  accessibility layer for keyboard and screen reader support. Add gaps or
  outlines between adjacent bars and slices, and always show legend labels, so
  color is not the only signal (WCAG 1.4.1).
- Handle empty data (empty state), `isLoading` (skeleton), unknown series keys
  (development warning, series skipped) and invalid palettes (development
  warning, fallback to the first palette in production).
- Add `recharts` and `react-is` as dependencies of `@commercetools/nimbus`.
- Add a changeset. No breaking changes.

Order of work, in case time runs out: foundation and palette variables first,
then Bar, Line and Area, then Pie, then Radar and Radial. Radar and Radial are
the first to move to a later change.

## Capabilities

### New Capabilities

- `nimbus-charts`: Shared chart foundation (container, tooltip, legend, config,
  palette colors, states, accessibility) and the six chart types built on it.

### Modified Capabilities

- `color-tokens`: Adds the requirement to generate contrast-checked chart
  palette CSS variables for each palette and color mode.

## Impact

- New directories under `packages/nimbus/src/components/` for the charts and the
  shared chart parts (component, types, recipe, slots, stories, docs, docs spec
  for each).
- `packages/color-tokens` (build script, uses the `chroma-js` dependency it
  already has) and `packages/tokens` (generated chart variables).
- `packages/nimbus/package.json`: new dependencies `recharts` (latest is 3.11.0;
  its peer range allows React 19) and `react-is`.
- `packages/nimbus/src/theme/slot-recipes/index.ts`: new recipe registrations;
  theme typings regenerated. `packages/nimbus/src/components/index.ts`: new
  exports.
- Bundle size is not measured yet. `pnpm check:bundle-size` must pass, and the
  baseline may need an explicit, reviewed update.
- Open questions to settle in `design.md`: which Nimbus token is the "current
  background" of each color mode, and how many distinguishable palettes are
  available for charts with many series.
