## Context

Nimbus has no chart components. A product team needs a dashboard by the end of
this week with Area, Bar, Line, Pie, Radar and Radial charts. The reference is
the shadcn charts page (https://ui.shadcn.com/charts). The requester confirmed
that shadcn wraps Recharts.

Facts checked while preparing this design (file and line, URL, or a computed
number):

- **Recharts version.** Latest on npm is 3.11.0, published 2026-11-17 at 16:54
  UTC. The repository requires packages to be at least 24 hours old
  (`pnpm-workspace.yaml:35` `minimumReleaseAge: 1440`, and `:43`
  `minimumReleaseAgeStrict: true`). 3.10.1 (published 2026-07-25) is the newest
  version that passes today. Peer range of Recharts: React `^19.0.0`, `react-is`.
  `@commercetools/nimbus` has the peer dependency `"react": "19.x"`.
- **Accessibility.** Recharts documentation: "Starting with Recharts 3.0,
  accessibility support is enabled by default for all charts." The chart gets
  `role="application"` and `tabIndex={0}` (both can be overridden),
  ArrowLeft and ArrowRight move between data points, and the default tooltip is a
  live region
  (https://github.com/recharts/recharts/blob/main/storybook/stories/API/Accessibility.mdx).
  Task 1.6 checked this in Chromium (Recharts 3.10.1) with a throwaway story on
  `BarChart`, `PieChart` and `RadialBarChart`: the `<svg>` element (not the wrapper
  div) gets `role="application"` and `tabindex="0"`. Tab focuses it and the tooltip
  shows the first item at once. ArrowRight moves to the next item (A, B, C). Enter
  hides the tooltip. The default tooltip has `role="status"`. Pie and Radial behave
  like Bar. Radar is covered by the `RadarChart` stories (task 6.1). Every chart type has the `isAnimationActive` prop
  (`boolean | 'auto'`) to turn animation off.
- **CSS variables.** Recharts accepts CSS variables in `stroke` and `fill`, for
  example `stroke="var(--color-text-1)"`
  (https://github.com/recharts/recharts/blob/main/www/src/utils/SuccessIcon.tsx).
- **Palettes.** Nimbus has no chart color tokens. Palettes are 12-step scales in
  `packages/color-tokens` (brand scales in `brand-colors.ts`, the rest from
  `@radix-ui/colors`). `chroma-js` is already a dependency of `color-tokens`.
  `@commercetools/nimbus` has no color library.
- **Solid and contrast color.** The solid color is `DEFAULT`, which equals step 9
  (`packages/color-tokens/index.ts`). Its `contrast` color is white when white on
  the solid has a ratio above 2.9, and black otherwise (`calculateContrastColor`
  in `packages/color-tokens/contrast-color.ts`, shared with `index.ts`).
  With that rule, 7 of 30 palettes have a black contrast color (`amber`, `lime`,
  `mint`, `sky`, `yellow`, `ctyellow`, `ctteal`) and 23 have white. Light and
  dark mode agree.
- **Backgrounds.** `bg.DEFAULT` is `#fff` in light mode and `neutral.1` in dark
  mode (`packages/nimbus/src/theme/semantic-tokens/colors.ts:7`). `neutral.1`
  dark resolves to Radix `grayDark.gray1`, which is `#111111`. `Card` uses `bg`
  (`card.recipe.ts:77-98`). Other surfaces are not checked.
- **Adaptation results** (OKLCH lightness-only search against 3:1, computed with
  chroma-js 3.1.2 and `@radix-ui/colors` 3.0.0):
  - Light mode on `#fff`: only `orange` changes (`#f76b15`, 2.97:1, becomes
    `#f66a14`, 3.004:1). The other 22 white-contrast palettes already pass
    (lowest: `cyan` 3.003:1).
  - Dark mode on `#111111`: none of the 23 changes (lowest: `ctviolet`, 3.06:1).
  - The 7 excluded palettes can reach 3:1, but need an OKLCH lightness change
    of about -0.08 (`ctteal`, to `#00a5a6`) to -0.25 (`yellow`), and `ctyellow`
    shifts hue by 6.2 degrees.
  - Neighbor problem: adapted `iris` and `violet` are 1.00:1 apart (deltaE2000
    4.0). `jade` and `teal` are 1.03:1. `green` and `jade` are 1.00:1. `gray` and
    `slate` are 1.01:1.
- **Text.** `neutral.11` (`fg.subtle`) is 5.92:1 on `#fff` and 9.11:1 on
  `#111111`.
- **CSS variable names.** `cssVarsPrefix` is `nimbus`
  (`packages/nimbus/src/theme/index.ts:17`). Chakra adds the token category, so
  existing variables look like `--nimbus-colors-primary-1`
  (`apps/docs/src/components/top-bar/color-theme-menu.tsx:74`). A chart token
  `chart.violet` therefore becomes `--nimbus-colors-chart-violet`.
- **Tokens pipeline.** `packages/color-tokens/index.ts` writes only to a
  git-ignored `dist/`, and the root build does not run it. Style Dictionary reads
  only `src/base/tokens.json` (`packages/tokens/src/style-dictionary.config.js:81`).
  The manual copy has already drifted: `ctviolet.light.11` is `#4F52D0` in the
  generator and `#4042B0` in `tokens.json`.
- **Bundling.** `packages/nimbus/vite.config.ts` lists the externals (React,
  Chakra, Slate, and now Recharts). At the start Recharts was not in the list and
  would have been bundled with its dependencies. `check-bundle-size.mjs` fails
  above 5% (`.github/actions/bundle-size/check-bundle-size.mjs:62`). The
  require-helper scan is in `scripts/check-bundler-compat.mjs`. Both were measured
  in task 1.4 (see Decision 1).
- Nimbus already has `useColorMode` and `useColorModeValue` in
  `packages/nimbus/src/hooks/`.

## Reference look (task 1.5)

Observed on https://ui.shadcn.com/charts (screenshots of the Area, Bar, Line, Pie,
Radar and Radial pages, taken 2026-11-18; the page text says "built with Recharts").
Pixel values were not measured.

- **Cartesian charts (Area, Bar, Line):** horizontal grid lines only, very light
  gray. No axis lines and no y-axis labels. Small gray x-axis labels. Smooth curves
  for Area and Line. Line is a thin line without dots. Bars are flat, with no
  outline and narrow gaps.
- **Area:** the fill fades from the series color at the line to transparent at the
  baseline (a gradient, not a flat opacity). The line on top is the full color.
- **Legend:** centered below the chart, small square swatches with gray labels.
- **Pie:** flat slices with a thin white separator between slices (the page also
  shows a "Separator None" variant). Optional value labels with leader lines.
- **Radar:** hexagonal polar grid in light gray, fill at low opacity, optional dots
  on the points, and a "lines only" variant.
- **Radial:** concentric arcs on a light gray track, optional labels along the arcs,
  and a "grid" variant.
- **Around the chart:** the demos sit inside cards with a title, a description and
  a footer. That belongs to the page, not to the chart component.
- **Colors:** the demos use shades of one blue hue (light to dark) for all series.
  Nimbus uses a different palette for each series, which is easier to tell apart
  (WCAG 1.4.1). The one-hue look is not available in this version, because
  intermediate colors were removed from the scope.
- **Separator width:** the Nimbus stroke between bars and slices is 2 px in the
  `bg` color. This is our value; shadcn's width was not measured.

## Goals / Non-Goals

**Goals:**

- Charts look like the shadcn charts, in Nimbus colors. The visual traits (grid,
  axes, bar radius, tooltip, legend, area opacity) are taken from reference
  screenshots of https://ui.shadcn.com/charts in task 1.5.
- Series colors come from Nimbus palettes, switch with light and dark mode
  without JavaScript, and have at least 3:1 contrast (WCAG 1.4.11).
- Chart text has at least 4.5:1 contrast (WCAG 1.4.3). Color is never the only
  signal (WCAG 1.4.1).
- Keyboard and screen reader support from the Recharts accessibility layer,
  checked by Storybook tests.
- Ship the first charts early. Radar and Radial can move to a later change.

**Non-Goals:**

- Arbitrary solid colors for a series (planned for a later change).
- Intermediate colors between the solid and the background. The area fill uses
  opacity instead. Intermediate colors can be added later if a design needs them.
- A children-based API that exposes Recharts parts.
- Brush, zoom, export, animation settings, or custom shapes.
- Replacing the Recharts accessibility layer with a custom one.

## Decisions

### 1. Wrap Recharts instead of building on visx, d3 or plain SVG

Recharts gives all six chart types and an accessibility layer. visx and d3 give
more control but need much more code for six charts. Plain SVG has no
dependency but is the largest effort. Only the Recharts option fits one week.

Recharts and `react-is` were added to `packages/nimbus` (task 1.3) through a new
`charts` catalog in `pnpm-workspace.yaml`. Recharts 3.10.1 is installed. It passes
the release-age rule, and no `minimumReleaseAgeExclude` entry was added.

**Decision: Recharts is an external, required peer dependency** (like Slate), and a
dev dependency of `packages/nimbus`, with `react-is` as a dev dependency. Task 1.4
measured both options with a throwaway `BarChart` (named imports from
`recharts`; the package has `sideEffects: false` and no `exports` map):

- **Bundled (rejected).** `pnpm check:bundle-size` fails: the
  `@commercetools/nimbus` dist grows from 21,720 KB to 26,882 KB (+23.8%, the limit
  is 5%). About 4.2 MB of that is sourcemaps, because the check sums every file in
  `dist`. The JS added is 545 KB (ESM) and 399 KB (CJS) in one separate chunk.
  `pnpm check:bundler-compat` also fails: the ESM chunk imports Rolldown's
  `require` helper, because Recharts depends on `react-redux`, which depends on
  `use-sync-external-store`. That package is CommonJS only and calls
  `require("react")`, and React is an external of the Nimbus build. Bundling would
  need an alias workaround and the `bundle-size-approved` label.
- **External peer dependency (chosen).** `recharts` is in `external` in
  `vite.config.ts`. Measured: the dist grows by 2.9 KB (+0.0%) and
  `pnpm check:bundler-compat` passes. Consumers who use charts install
  `recharts` and `react-is`. This follows the Slate precedent: a required peer in
  `package.json` and an "(Optional)" install section in
  `packages/nimbus/src/docs/home-installation.mdx` (added). The peer range is
  `^3.10.1`, the lowest version tested. An optional peer was not chosen, because a
  consumer without Recharts could fail to build if their bundler resolves the chart
  chunk (not tested).

### 2. Prop-based API, no exported Recharts parts

Each chart takes `data`, `config`, `xAxisKey`, `series` and a few switches.
`PieChart` and `RadialChart` use `nameKey` and `valueKey`. `isAnimationActive`
turns the draw animation on or off; it is off by default when the user prefers
reduced motion, and the Chromatic stories turn it off. `aria-label` is required by
the types. This keeps the API small and lets us change the library
later. shadcn lets users compose Recharts children. That gives more power but
makes Recharts' API the Nimbus API. A children-based escape hatch can be added
in a later change.

### 3. `ChartConfig` maps a data key to `{ label, palette }`

`palette` is a union of the chart palette names (generated from the token file).
The config is an object of per-key objects, so a `color` field can be added later
without a breaking change.

### 4. Adapt the palette's solid color at build time, write a committed token file

A chart color is the palette's solid color (`DEFAULT`), adapted for each color
mode. The script uses `chroma-js` and changes only the lightness (OKLCH), keeping
hue and chroma, by the smallest amount that gives at least 3:1 contrast against
the current background of that mode. If the solid already has 3:1, it stays
unchanged. The adapted color must have a contrast of at most 3.2:1 (a proposed
tolerance, so "smallest" is testable) unless it is unchanged, and, for chromatic colors (OKLCH chroma of at least 0.02), its hue must
stay within 3 degrees of the solid. Achromatic colors such as grays are checked
for lightness and contrast only. The chroma value 0.02 is a proposed threshold.

Only palettes with a white contrast color are chart palettes. The list is computed
with the function that generates the `contrast` token (`calculateContrastColor`),
not written by hand, so a new palette follows the rule automatically. The seven excluded palettes can reach 3:1, but
only with a large lightness change, so they would no longer look like their
palette. `ctteal` is the smallest change of the seven (about -0.08) and is an open
question.

"Current background" is `bg` in each mode (`#fff` and `#111111`). Cards use the
same token. Other surfaces are not checked (open question).

The script writes `packages/tokens/src/base/chart-tokens.json`. It is committed,
and `style-dictionary.config.js` adds it to `source`. `tokens.json` is not edited.
The file uses `color.chart.<palette>` with the shape
`{ light: { DEFAULT: { $value } }, dark: { DEFAULT: { $value } } }`, like the existing
palettes. `dtcg-to-chakra.js` combines a pair only when it has exactly the keys
`light` and `dark`, and a leaf directly inside a pair would produce an invalid Chakra
token, so the value sits under `DEFAULT`. Chakra drops `DEFAULT` from the variable
name. Task 1.1 confirmed this with a spike: Style Dictionary merged the second source
file and produced `chart.violet.DEFAULT.value` with `_light` and `_dark`. The nimbus
theme must register it with `chart: themeTokens.color.chart` in
`packages/nimbus/src/theme/semantic-tokens/colors.ts`. The tokens build converts hex
to rounded HSL (`#6e56cf` becomes `hsl(252, 56%, 57%)`), so the contrast check runs
on the value as emitted. Computed with chroma-js for the 23 palettes in both modes,
rounding keeps every adapted color at 3:1 or more (lowest: `cyan` 3.003, adapted
`orange` 3.004), but this is not guaranteed in general. A drift check (or running
the script inside `build:tokens`) makes sure the file matches the palettes. The
existing manual copy workflow stays for the system palettes. Chakra emits `--nimbus-colors-chart-<palette>`, with a light value and
a dark value. At run time the chart writes `var(--nimbus-colors-chart-<palette>)`
into `stroke` and `fill`.

Alternative considered: compute colors in the browser. It adds a color library
to the bundle, needs mode handling in JavaScript, and can give a different color
on first render. It is kept for the later "arbitrary color" change, where it will
use `useColorMode` and hand-written math, and it would also solve the "different
surface" case.

### 5. Color is not the only signal

- The legend is shown whenever a chart has two or more series or categories.
  `showLegend` applies only to single-series charts.
- Adjacent bars and slices are separated by a stroke in the background color
  (`bg`), 2 px wide (a proposed value, confirmed in task 1.5).
- Line charts with more than 3 series also draw each line with a dash pattern
  from a list of six different patterns. With more than 6 series the patterns
  repeat.
- The default palette order has 11 palettes, in this order: `ctviolet`, `orange`,
  `teal`, `crimson`, `blue`, `grass`, `plum`, `bronze`, `cyan`, `red`, `slate`. Each
  pair differs by a deltaE2000 of at least 15 in light and dark mode (minimum
  15.34, measured on the emitted colors in task 2.5). An exact search (task 2.5) shows
  that 11 is the largest set of chart palettes with that property (28 such sets), so
  a default order of all 23 palettes is not possible. Four of the 28 sets contain
  `ctviolet`, the Nimbus brand violet. `indigo`, `iris` and `violet` are too close to
  it (`indigo` is 6.6 away) to be in the same set. The order therefore starts with
  `ctviolet`, which replaces `indigo` in the first candidate list. This threshold is
  our own, not a WCAG value. A chart with more than 11 series reuses palettes in
  the same order and warns in development. Consumers can still pick any other chart
  palette by name.
- Chart text (axes, legend, tooltip, empty state) uses `fg` or `fg.subtle`.
  Grid lines are decorative and are exempt from 3:1.

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

An area is drawn with a vertical gradient of the series color, from about 0.8 opacity
at the line to about 0.1 opacity at the baseline (nearly transparent, as on the
shadcn reference, task 1.5). The line on top uses the full series color and carries the
3:1 contrast. No extra token is needed, so "one chart token per palette" holds.

### 8a. Curves are monotone

Line and Area use `type="monotone"`. The shadcn demos use `natural`, but natural
interpolation can draw below the data minimum (even below zero) and so shows values
that are not in the data. Monotone interpolation never overshoots and looks almost
the same.

### 9. Keep the Recharts default `role="application"`

The chart keeps the Recharts default role and `tabIndex={0}` (both on the `<svg>`).
A story test checks them. Keyboard behavior is tested for every chart type in its
stories (task 1.6 verified Bar, Pie and Radial; Radar is checked in task 6.1). Enter
toggles the tooltip, which the docs describe.

## Risks / Trade-offs

- [Recharts 3.11.0 cannot be installed for about a day (24-hour rule)] → Use
  `^3.10.1`. Do not add a release-age exclude.
- [Consumers who use charts must install `recharts` and `react-is`] → New
  "Charts (Optional)" section in the installation docs, and the charts docs say it
  in the first lines. The peer range is `^3.10.1`.
- [Palette tokens and the adaptation script are new tooling in the tokens build]
  → Build this first, with its unit test, before any chart. Use failing fixtures
  (`orange` in light mode, a synthetic `#484848` on `#111111`), because most real
  palettes need no adaptation.
- [Neighboring series can look the same] → Stroke between shapes, a tested default
  palette order, and a legend for two or more series.
- [Six chart types, docs and stories in one week] → Task order puts Radar and
  Radial last so they can move to a later change without blocking the team.
- [Recharts internals can change] → The public API hides Recharts, so a later
  library change would not be breaking for consumers.

## Migration Plan

New feature, no migration. Roll back by reverting the change. No existing
component changes.

## Open Questions

- Charts on surfaces other than `bg` are not checked against 3:1 (decided: the
  adaptation uses `bg` only). Measured with the adapted colors: on `neutral.1`
  (`#fcfcfc` in light mode) 4 of 23 palettes fall just below 3:1 (`cyan` 2.93,
  `grass` 2.95, `orange` 2.93, `teal` 2.99), and on `neutral.3` (`#f0f0f0`) 9 do.
  In dark mode only `ctviolet` is a problem, and only on lighter surfaces (2.58 on
  `#222222`). The charts docs say that colors are checked against `bg`, so teams
  place charts on `bg`. Revisit if a team needs charts on other surfaces.
- `ctteal` is a brand palette with a black contrast color, so it is not a chart
  palette, although it reaches 3:1 with the smallest change (`#0bbfbf` to
  `#00a5a6`). Decided: it stays excluded in this version. Including it later
  means adapting palettes whose contrast color is black as well.
- Figma Code Connect: 45 of 98 component folders have a `.figma.tsx`, and the
  newest component (Meter) has none, so it is not required. A mapping needs Figma
  design nodes for the charts, which this change does not have. Follow-up when
  designers publish chart components. The MCP data is generated from the docs
  build, so no entry is needed (checked in task 7.5).
