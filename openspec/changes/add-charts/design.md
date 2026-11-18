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
  The keyboard code contains the comment "TODO this is lacking index for charts
  that do not support numeric indexes" (`src/state/keyboardEventsMiddleware.ts`
  in the Recharts repository), so keyboard behavior for Pie and Radial is not
  verified.
- **CSS variables.** Recharts accepts CSS variables in `stroke` and `fill`, for
  example `stroke="var(--color-text-1)"`
  (https://github.com/recharts/recharts/blob/main/www/src/utils/SuccessIcon.tsx).
- **Palettes.** Nimbus has no chart color tokens. Palettes are 12-step scales in
  `packages/color-tokens` (brand scales in `brand-colors.ts`, the rest from
  `@radix-ui/colors`). `chroma-js` is already a dependency of `color-tokens`.
  `@commercetools/nimbus` has no color library.
- **Solid and contrast color.** The solid color is `DEFAULT`, which equals step 9
  (`packages/color-tokens/index.ts:143`). Its `contrast` color is white when white
  on the solid has a ratio above 2.9, and black otherwise (`index.ts:132-138`).
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
- **Bundling.** `packages/nimbus/vite.config.ts:88-110` lists the externals
  (React, Chakra, Slate). Recharts is not in the list, so it is bundled with its
  dependencies. `check-bundle-size.mjs` fails above 5%
  (`.github/actions/bundle-size/check-bundle-size.mjs:62`). The require-helper
  scan is in `scripts/check-bundler-compat.mjs`. Size and scan result are not
  measured yet.
- Nimbus already has `useColorMode` and `useColorModeValue` in
  `packages/nimbus/src/hooks/`.

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

**How Recharts ships is not decided yet.** Task 1.4 measured two options with a
throwaway `BarChart` (named imports from `recharts`; the package has
`sideEffects: false` and no `exports` map):

- **Option A, bundle it** (the first draft of this design). `pnpm check:bundle-size`
  fails: the `@commercetools/nimbus` dist grows from 21,720 KB to 26,882 KB
  (+23.8%, the limit is 5%). About 4.2 MB of that is sourcemaps, because the check
  sums every file in `dist`. The JS added is 545 KB (ESM) and 399 KB (CJS) in one
  separate chunk that only chart users load. `pnpm check:bundler-compat` also fails:
  the ESM chunk imports Rolldown's `require` helper, because Recharts depends on
  `react-redux`, which depends on `use-sync-external-store`. That package is
  CommonJS only and calls `require("react")`, and React is an external of the
  Nimbus build. Option A needs a workaround for that package (an alias to an ESM
  version of `use-sync-external-store/with-selector`, not tried yet) and the
  `bundle-size-approved` label.
- **Option B, externalize it.** Add `recharts` to `external` in `vite.config.ts`
  and declare it as a peer dependency (and a dev dependency, as the comment in
  `vite.config.ts` requires). Measured: the dist grows by 2.9 KB (+0.0%) and
  `pnpm check:bundler-compat` passes. Cost: consumers that use charts must install
  `recharts`. A required peer dependency makes every Nimbus consumer install it. An
  optional peer dependency may break a consumer that has no Recharts, if their
  bundler resolves the chart chunk (not tested).

### 2. Prop-based API### 2. Prop-based API, no exported Recharts parts

Each chart takes `data`, `config`, `xAxisKey`, `series` and a few switches.
`PieChart` and `RadialChart` use `nameKey` and `valueKey`. `aria-label` is
required by the types. This keeps the API small and lets us change the library
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

Only palettes with a white contrast color are chart palettes. The list is read
from the generated `contrast` token, not written by hand, so a new palette
follows the rule automatically. The seven excluded palettes can reach 3:1, but
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
- Line charts with more than 3 series (proposed threshold) also use a different
  dash style or marker for each line.
- The default palette order has 11 palettes: `blue`, `bronze`, `crimson`,
  `cyan`, `grass`, `indigo`, `orange`, `plum`, `red`, `slate`, `teal`. Each
  pair differs by a deltaE2000 of at least 15 in light and dark mode (minimum
  15.28, between `crimson` and `red`, checked by two reviewers). An exact search
  shows that 11 is the largest set of palettes with that property, so a default
  order of all 23 palettes is not possible. This threshold is our own, not a WCAG
  value. A chart with more than 11 series reuses palettes in the same order and
  warns in development. Consumers can still pick any other chart palette by name.
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

### 8. Area fill uses opacity

An area is drawn with the series color at reduced opacity (value from the shadcn
reference, task 1.5). The line on top uses the full series color and carries the
3:1 contrast. No extra token is needed, so "one chart token per palette" holds.

### 9. Keep the Recharts default `role="application"`

The chart keeps the Recharts default role and `tabIndex={0}`. A story test checks
them. Keyboard behavior is tested for Bar, Line, Area and Radar. For Pie and
Radial it is unverified, so task 1.6 checks it before tasks 5.1 and 6.3. If arrow keys do
not move between slices, the chart records the gap in its docs and the legend
lists each category with its value so the data stays reachable.

## Risks / Trade-offs

- [Recharts 3.11.0 cannot be installed for about a day (24-hour rule)] → Use
  `^3.10.1`. Do not add a release-age exclude.
- [Bundling Recharts breaks the 5% size limit and the require-helper scan] →
  Measured in task 1.4 (see Decision 1). Choose option A or B before group 3.
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
- [Pie and Radial keyboard support is unverified] → Checked in task 1.6, before tasks 5.1 and 6.3, with a documented fallback.

## Migration Plan

New feature, no migration. Roll back by reverting the change. No existing
component changes.

## Open Questions

- Bundle Recharts (option A) or make it an external peer dependency (option B)?
  See Decision 1 for the measured results. This blocks group 3.
- Surface data from task 1.2: recipes use `bg`, `neutral.1`, `neutral.3` and tinted
  surfaces. In light mode `neutral.1` is `#fcfcfc`. Measured with the adapted
  colors: on `neutral.1` (`#fcfcfc`) 4 of 23 palettes fall just below 3:1 (`cyan`
  2.93, `grass` 2.95, `orange` 2.93, `teal` 2.99). On `neutral.3` (`#f0f0f0`) 9 fall
  below. In dark mode only `ctviolet` is a problem, and only on lighter surfaces
  (2.58 on `#222222`). Adapting against `neutral.1` instead of `bg` would cost only
  slight changes to those 4 palettes and would cover both surfaces. Which background
  does the adaptation use?
- Charts on surfaces other than `bg` (for example a colored panel) are not checked
  against 3:1. Is that acceptable for week one?
- `ctteal` is a brand palette with a black contrast color, so it is not a chart
  palette, although it reaches 3:1 with the smallest change (`#0bbfbf` to
  `#00a5a6`). Should it be included?
- Does Style Dictionary merge a second `source` file without problems? Check in
  task 1.1.
- Is the dark-mode selector that Chakra uses for semantic tokens the same one the
  docs and Storybook use? Check in task 1.1 with the generated variable.
- Which of the six charts does the product team really need this week? The task
  order assumes all six, with Radar and Radial last.
- Is a Figma Code Connect file or MCP data entry required for new components?
  Check in task 7.5.
