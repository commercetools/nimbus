## Context

Nimbus has no chart components. Teams that build dashboards need Area, Bar,
Line, Pie, Radar and Radial charts.

Facts checked while preparing this design (file and line, URL, or a computed
number):

- **Recharts version.** Latest on npm is 3.11.0, published 2026-11-17 at 16:54
  UTC. The repository requires packages to be at least 24 hours old
  (`pnpm-workspace.yaml:35` `minimumReleaseAge: 1440`, and `:43`
  `minimumReleaseAgeStrict: true`). 3.10.1 (published 2026-07-25) is the newest
  version that passes today. Peer range of Recharts: React `^19.0.0`,
  `react-is`. `@commercetools/nimbus` has the peer dependency `"react": "19.x"`.
- **Accessibility.** Recharts documentation: "Starting with Recharts 3.0,
  accessibility support is enabled by default for all charts." The chart gets
  `role="application"` and `tabIndex={0}` (both can be overridden), ArrowLeft
  and ArrowRight move between data points, and the default tooltip is a live
  region
  (https://github.com/recharts/recharts/blob/main/storybook/stories/API/Accessibility.mdx).
  Task 1.6 checked this in Chromium (Recharts 3.10.1) with a throwaway story on
  `BarChart`, `PieChart` and `RadialBarChart`: the `<svg>` element (not the
  wrapper div) gets `role="application"` and `tabindex="0"`. Tab focuses it and
  the tooltip shows the first item at once. ArrowRight moves to the next item
  (A, B, C). Enter hides the tooltip. The default tooltip has `role="status"`.
  Pie and Radial behave like Bar. Radar is covered by the `RadarChart` stories
  (task 6.1). Every chart type has the `isAnimationActive` prop
  (`boolean | 'auto'`) to turn animation off.
- **CSS variables.** Recharts accepts CSS variables in `stroke` and `fill`, for
  example `stroke="var(--color-text-1)"`
  (https://github.com/recharts/recharts/blob/main/www/src/utils/SuccessIcon.tsx).
- **Palettes.** Palettes are 12-step scales in `packages/color-tokens` (brand
  scales in `brand-colors.ts`, the rest from `@radix-ui/colors`). The token
  build turns them into semantic tokens such as `colors.blue.9`, which Chakra
  emits as CSS variables and which switch with light and dark mode.
  `@commercetools/nimbus` has no color library.
- **Solid and contrast color.** The solid color is `DEFAULT`, which equals step
  9. Its `contrast` color is white when white on the solid has a ratio above
  2.9, and black otherwise. With that rule, 7 of 30 palettes have a black
  contrast color (`amber`, `lime`, `mint`, `sky`, `yellow`, `ctyellow`,
  `ctteal`) and 23 have white. Light and dark mode agree.
- **Trusted solids.** Nimbus checks its colors with APCA, so the solids count as
  verified and charts add no contrast check of their own.
- **CSS variable names.** `cssVarsPrefix` is `nimbus`
  (`packages/nimbus/src/theme/index.ts:17`). Chakra adds the token category, so
  the step 9 solid of `blue` is `--nimbus-colors-blue-9`. Components reach the
  same value with `colorPalette.9`.
- **Bundling.** `packages/nimbus/vite.config.ts` lists the externals (React,
  Chakra, Slate, and now Recharts). At the start Recharts was not in the list
  and would have been bundled with its dependencies. `check-bundle-size.mjs`
  fails above 5% (`.github/actions/bundle-size/check-bundle-size.mjs:62`). The
  require-helper scan is in `scripts/check-bundler-compat.mjs`. Both were
  measured in task 1.4 (see Decision 1).
- Nimbus already has `useColorMode` and `useColorModeValue` in
  `packages/nimbus/src/hooks/`.

## Visual traits (task 1.5)

The look of the charts is light and flat. Pixel values were not specified.

- **Cartesian charts (Area, Bar, Line):** horizontal grid lines only, very light
  gray. No axis lines and no y-axis labels. Small gray x-axis labels. Smooth
  curves for Area and Line. Line is a thin line without dots. Bars are flat,
  with no outline and narrow gaps.
- **Area:** the fill fades from the series color at the line to transparent at
  the baseline (a gradient, not a flat opacity). The line on top is the full
  color.
- **Legend:** centered below the chart, small square swatches with gray labels.
- **Pie:** flat slices with a thin separator in the background color.
- **Radar:** hexagonal polar grid in light gray, fill at low opacity.
- **Radial:** concentric arcs on a light gray track.
- **Around the chart:** a chart has no title, description or footer of its own.
  The page provides them.
- **Colors:** Nimbus uses a different palette for each series, which is easier
  to tell apart (WCAG 1.4.1). A one-hue look is not available in this version,
  because intermediate colors were removed from the scope.
- **Separator width:** the Nimbus stroke between bars and slices is 2 px in the
  `bg` color (a proposed value).

## Goals / Non-Goals

**Goals:**

- Charts have a clean, light look in Nimbus colors. The visual traits (grid,
  axes, bar radius, tooltip, legend, area opacity) are listed in "Visual
  traits" (task 1.5).
- Series colors come from Nimbus palettes, switch with light and dark mode
  without JavaScript, and use the palette solid (step 9) that Nimbus verifies
  with APCA.
- Chart text has at least 4.5:1 contrast (WCAG 1.4.3). Color is never the only
  signal (WCAG 1.4.1).
- Keyboard and screen reader support from the Recharts accessibility layer,
  checked by Storybook tests.
- Ship the first charts early. Radar and Radial can move to a later change.

**Non-Goals:**

- Arbitrary solid colors for a series (planned for a later change).
- Intermediate colors between the solid and the background. The area fill uses
  opacity instead. Intermediate colors can be added later if a design needs
  them.
- A children-based API that exposes Recharts parts or Recharts props. The
  `Chart` namespace (decision 2a) wraps Recharts instead.
- Composition of `PieChart`, `RadarChart` and `RadialChart`.
- Brush, zoom, export, animation settings, or custom shapes.
- Replacing the Recharts accessibility layer with a custom one.

## Decisions

### 1. Wrap Recharts instead of building on visx, d3 or plain SVG

Recharts gives all six chart types and an accessibility layer. visx and d3 give
more control but need much more code for six charts. Plain SVG has no dependency
but is the largest effort. Only the Recharts option fits one week.

Recharts and `react-is` were added to `packages/nimbus` (task 1.3) through a new
`charts` catalog in `pnpm-workspace.yaml`. Recharts 3.10.1 is installed. It
passes the release-age rule, and no `minimumReleaseAgeExclude` entry was added.

**Decision: Recharts is an external, regular dependency.** `recharts` and
`react-is` are in `dependencies` of `packages/nimbus`, so consumers get them with
Nimbus.
Task 1.4 measured both options with a throwaway `BarChart` (named imports from
`recharts`; the package has `sideEffects: false` and no `exports` map):

- **Bundled (rejected).** `pnpm check:bundle-size` fails: the
  `@commercetools/nimbus` dist grows from 21,720 KB to 26,882 KB (+23.8%, the
  limit is 5%). About 4.2 MB of that is sourcemaps, because the check sums every
  file in `dist`. The JS added is 545 KB (ESM) and 399 KB (CJS) in one separate
  chunk. `pnpm check:bundler-compat` also fails: the ESM chunk imports
  Rolldown's `require` helper, because Recharts depends on `react-redux`, which
  depends on `use-sync-external-store`. That package is CommonJS only and calls
  `require("react")`, and React is an external of the Nimbus build. Bundling
  would need an alias workaround and the `bundle-size-approved` label.
- **External regular dependency (chosen).** `recharts` is in `external` in
  `vite.config.ts`. Measured: the dist grows by 2.9 KB (+0.0%) and
  `pnpm check:bundler-compat` passes. The first version listed Recharts as a
  required peer dependency (the Slate precedent), but then every consumer must
  install and update it. Consumers never import `recharts`, so nothing needs one
  shared copy, and a regular dependency works without effort for them. The
  range is `^3.10.1`, the lowest version tested. With an incompatible Recharts
  of their own, an app gets a second copy (see the Risks).

### 2. Prop-based API, no exported Recharts parts

Each chart takes `data`, `config`, `xAxisKey`, `series` and a few switches.
`PieChart` and `RadialChart` use `nameKey` and `valueKey`. `isAnimationActive`
turns the draw animation on or off; it is off by default when the user prefers
reduced motion, and the Chromatic stories turn it off. a name is required by the
types: `aria-label`, or `aria-labelledby` for a visible heading. This keeps the API small and lets us change the library later.
Letting users compose Recharts children gives more power but makes Recharts'
API the Nimbus API. A consumer must never need to import from
`recharts`, so the escape hatch is the wrapped `Chart` namespace (2a).

### 2a. `Chart` namespace of wrapped parts, no re-exported Recharts

Considered: (1) `export * as Chart from "recharts"`, which is cheap but makes
the whole Recharts API the Nimbus API (a Recharts major version becomes a Nimbus
breaking change) and gives unstyled parts without palette colors, contrast
guarantee, tooltip or legend. (2) A namespace of Nimbus components, each
wrapping one Recharts part. Chosen: (2). The export follows the compound
component convention (`export const Menu = { Root, Trigger, ... }`).

| Part            | Wraps            | Props                                                                                                                                                                                                               |
| --------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Chart.Root`    | `ChartContainer` | the shared props (`data`, `config`, `aria-label`, `isLoading`, `showTooltip`, `showLegend`, `isAnimationActive`), `series` (data keys for the legend; default: the keys of `config`), `children` (one `Chart.Plot`) |
| `Chart.Plot`    | `ComposedChart`  | `children`. Takes data and `aria-label` from `Chart.Root`; 12 px side margin                                                                                                                                        |
| `Chart.Bar`     | `Bar`            | `dataKey`, `stacked`                                                                                                                                                                                                |
| `Chart.Line`    | `Line`           | `dataKey`                                                                                                                                                                                                           |
| `Chart.Area`    | `Area`           | `dataKey`, `stacked`                                                                                                                                                                                                |
| `Chart.XAxis`   | `XAxis`          | `dataKey`                                                                                                                                                                                                           |
| `Chart.Grid`    | `CartesianGrid`  | none                                                                                                                                                                                                                |
| `Chart.Tooltip` | `Tooltip`        | none; hidden when `showTooltip` is `false`                                                                                                                                                                          |

A series part reads color, animation and its position from the context of
`Chart.Root`, so a series gets the same color as in the legend and tooltip. A `dataKey` that is not in `series` draws
nothing. Area gradients use the position among all series. A `Chart.Line` is
solid unless it gets `strokeDasharray`; `LineChart` sets the dash patterns for
its own lines. `BarChart`, `LineChart` and `AreaChart` use the same series parts, axis,
grid and tooltip (the chart-level container stays Recharts' `BarChart`,
`LineChart` and `AreaChart`, so these charts look as before). The parts need the
Recharts 3 behavior that custom components can be children of a chart (checked
by a story, task 8.1). Polar charts are not composable in this version.

### 3. `ChartConfig` maps a data key to `{ label, palette }`

`palette` is a union of the chart palette names (a hand-written list).
The config is an object of per-key objects, so a `color` field can be added
later without a breaking change.

### 4. Use the palette's solid color (step 9) as is

A chart color is the palette solid, `var(--nimbus-colors-<palette>-9)`. It is
the token that components already use through `colorPalette.9`, so charts add no
color tokens and change no token package. Light and dark mode switch without
JavaScript. Nimbus verifies its solids with APCA, so charts do not repeat a
contrast check.

Only palettes with a white contrast color are chart palettes (23). A black
contrast color means the solid is light, which does not suit a line or a bar on
the page background. The list is written by hand in `chart.palettes.ts`.

If a chart ever needs a derived color (darker or lighter than the solid), it
adapts the solid at run time with CSS `color-mix()` (mix with black or white).
No part needs it today: the area gradient changes opacity, the separators use
`bg`, and text uses `fg`.

Alternatives considered: (a) a build step that adapts the lightness of each
solid to 3:1 and writes a committed token file. It changed the `color-tokens`,
`tokens` and `design-token-ts-plugin` packages for a result that APCA-verified
solids already give, so it was removed. (b) Computing colors in JavaScript with a
color library, which adds weight to the bundle. Arbitrary series colors stay a
later change.

### 5. Color is not the only signal

- The legend is shown whenever a chart has two or more series or categories.
  `showLegend` applies only to single-series charts.
- Adjacent bars and slices are separated by a stroke in the background color
  (`bg`), 2 px wide (a proposed value, confirmed in task 1.5).
- Line charts with more than 3 series also draw each line with a dash pattern
  from a list of six different patterns. With more than 6 series the patterns
  repeat.
- The default palette order has 11 palettes, in this order: `ctviolet`,
  `orange`, `teal`, `crimson`, `blue`, `grass`, `plum`, `bronze`, `cyan`, `red`,
  `slate`. Each pair differs by a deltaE2000 of at least 15 (minimum 15.3, measured on the
  step 9 solids, which are the same in light and dark mode; not enforced by a
  test). An exact search shows that 11 is the largest set of chart palettes with
  that property, so a default order of all 23 palettes is not possible. Four of
  the 28 such sets contain `ctviolet`, the Nimbus brand violet.
  `indigo`, `iris` and `violet` are too close to it (`indigo` is 6.6 away) to be
  in the same set. The order therefore starts with `ctviolet`, which replaces
  `indigo` in the first candidate list. This threshold is our own, not a WCAG
  value. A chart with more than 11 series reuses palettes in the same order and
  warns in development. Consumers can still pick any other chart palette by
  name.
- Chart text (axes, legend, tooltip, empty state) uses `fg` or `fg.subtle`. Grid
  lines are decorative.

### 6. States are explicit

Empty data shows an empty state. `isLoading` shows the Nimbus skeleton. An
unknown series key warns in development and is skipped. An invalid palette warns
in development and falls back to the first palette in production. The container
has a default aspect ratio so Recharts never gets a zero-height parent.

### 7. Data flow

`ChartContainer` receives `config`, turns each palette name into a CSS variable
reference, and renders Recharts. `ChartTooltip` and `ChartLegend` read the same
`config`, so labels and colors always match the drawing.

### 8. Area fill is a gradient of one color

An area is drawn with a vertical gradient of the series color, from about 0.8
opacity at the line to about 0.1 opacity at the baseline (nearly transparent). The line on top uses the full series color
and carries the series color. No extra token is needed.

### 8a. Curves are monotone

Line and Area use `type="monotone"`. `natural` interpolation can draw below the data minimum (even below zero) and so shows
values that are not in the data. Monotone interpolation never overshoots and
looks almost the same.

### 9. Keep the Recharts default `role="application"`

The chart keeps the Recharts default role and `tabIndex={0}` (both on the
`<svg>`). A story test checks them. Keyboard behavior is tested for every chart
type in its stories (task 1.6 verified Bar, Pie and Radial; Radar is checked in
task 6.1). Enter toggles the tooltip, which the docs describe.

## Risks / Trade-offs

- [Recharts 3.11.0 cannot be installed for about a day (24-hour rule)] → Use
  `^3.10.1`. Do not add a release-age exclude.
- [Every install downloads Recharts, and an app with its own incompatible
  Recharts ships two copies when it uses Nimbus charts] → Accepted: consumers do
  nothing extra, bundles stay small when no chart is used (not measured), and
  the range is `^3.10.1`.
- [Neighboring series can look the same] → Stroke between shapes, a tested
  default palette order, and a legend for two or more series.
- [Six chart types, docs and stories in one week] → Task order puts Radar and
  Radial last so they can move to a later change without blocking the team.
- [Recharts internals can change] → The public API hides Recharts, so a later
  library change would not be breaking for consumers.

## Migration Plan

New feature, no migration. Roll back by reverting the change. No existing
component changes.

## Open Questions

- `ctteal` is a brand palette with a black contrast color, so it is not a chart
  palette. Decided: it stays excluded in this version.
- Figma Code Connect: 45 of 98 component folders have a `.figma.tsx`, and the
  newest component (Meter) has none, so it is not required. A mapping needs
  Figma design nodes for the charts, which this change does not have. Follow-up
  when designers publish chart components. The MCP data is generated from the
  docs build, so no entry is needed (checked in task 7.5).

## Known Limits and Follow-ups

- Arbitrary solid colors for a series (adapting any color at run time with
  `useColorMode`) are not part of this version. `config` can take a `color`
  field later without a breaking change.
- The legend and tooltip swatches show color only. The dash patterns of a
  LineChart with more than 3 series are not shown there.
- There is no y axis, and no option to format x axis labels. The first and last
  x label are always kept, and overlapping labels in between are dropped.
- Figma Code Connect mappings need Figma design nodes for the charts.
- `ctteal` and the six other palettes with a black contrast color are not chart
  palettes yet.
- The MCP search matches a query that starts with a whole word of a description
  or tag, also a one-letter word (found while writing the docs; the chart docs
  avoid such words).
- `@commercetools/nimbus-i18n`: the empty-state text is in the translation data
  in English and waits for the Transifex translations.
