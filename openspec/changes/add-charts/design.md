## Context

Nimbus has no chart components. A product team needs a dashboard by the end of
this week with Area, Bar, Line, Pie, Radar and Radial charts. The reference is
the shadcn charts page (https://ui.shadcn.com/charts). The requester confirmed
that shadcn wraps Recharts.

Facts checked while preparing this design:

- Recharts 3.11.0 is the latest version on npm. Its peer range allows React
  `^19.0.0` and it needs `react-is`. `@commercetools/nimbus` has the peer
  dependency `"react": "19.x"` (`packages/nimbus/package.json`).
- Recharts documentation: "Starting with Recharts 3.0, accessibility support is
  enabled by default for all charts." The chart gets `tabIndex={0}`,
  ArrowLeft and ArrowRight move between data points, and the default tooltip is
  a live region
  (https://github.com/recharts/recharts/blob/main/storybook/stories/API/Accessibility.mdx).
- Recharts accepts CSS variables in `stroke` and `fill`, for example
  `stroke="var(--color-text-1)"`
  (https://github.com/recharts/recharts/blob/main/www/src/utils/SuccessIcon.tsx).
- Nimbus has no chart color tokens. Palettes are 12-step scales in
  `packages/color-tokens` (brand scales in `brand-colors.ts`, the rest from
  `@radix-ui/colors`). `chroma-js` is already a dependency of `color-tokens`.
  `@commercetools/nimbus` has no color library.
- The solid color of a palette is `DEFAULT`, which equals step 9
  (`packages/color-tokens/index.ts:143`). Its `contrast` color is white when
  white on the solid has a ratio above 2.9, and black otherwise
  (`index.ts:132-138`).
- Computed with that rule: the palettes with a black contrast color are
  `amber`, `lime`, `mint`, `sky`, `yellow`, `ctyellow` (white-on-solid
  1.51) and `ctteal` (2.28). The 23 other palettes have a white contrast color,
  with white-on-solid ratios from 2.97 (`orange`) to 6.17 (`ctviolet`). For
  those palettes the solid needs little or no darkening on a white background.
  On a dark background the darkest solids (for example `ctviolet`) may need a
  small lightening. These are estimates from the ratio against white. The real
  adjustment depends on the actual background color of each mode.
- Nimbus already has `useColorMode` and `useColorModeValue` in
  `packages/nimbus/src/hooks/`.

## Goals / Non-Goals

**Goals:**

- Charts look like the shadcn charts, in Nimbus colors. The exact visual traits
  (grid, axes, bar radius, tooltip, legend) are taken from reference screenshots
  of https://ui.shadcn.com/charts in task 1.5.
- Series colors come from Nimbus palettes, switch with light and dark mode
  without JavaScript, and always have at least 3:1 contrast (WCAG 1.4.11).
- Keyboard and screen reader support from the Recharts accessibility layer,
  checked by Storybook tests.
- Ship the first charts early. Radar and Radial can move to a later change.

**Non-Goals:**

- Arbitrary solid colors for a series (planned for a later change; see
  Decisions).
- A children-based API that exposes Recharts parts.
- Brush, zoom, export, animation settings, or custom shapes.
- Replacing the Recharts accessibility layer with a custom one.

## Decisions

### 1. Wrap Recharts instead of building on visx, d3 or plain SVG

Recharts gives all six chart types and an accessibility layer. visx and d3 give
more control but need much more code for six charts. Plain SVG has no
dependency but is the largest effort. Only the Recharts option fits one week.

Cost: a new dependency. Imports stay narrow. Bundle size is not measured, so
`pnpm check:bundle-size` runs after the first prototype and the baseline update,
if needed, is reviewed on purpose.

### 2. Prop-based API, no exported Recharts parts

Each chart takes `data`, `config`, `xAxisKey`, `series` and a few switches.
`PieChart` and `RadialChart` use `nameKey` and `valueKey`. `aria-label` is
required by the types. This keeps the API small and lets us change the library
later. shadcn lets users compose Recharts children. That gives more power but
makes Recharts' API the Nimbus API. A children-based escape hatch can be added
in a later change.

### 3. `ChartConfig` maps a data key to `{ label, palette }`

`palette` is a palette name only. The config is an object of per-key objects, so
a `color` field can be added later without a breaking change.

### 4. Adapt the palette's solid color at build time and expose it as a CSS variable

A chart color is the palette's solid color (`DEFAULT`), adapted for each color
mode. The script uses `chroma-js` and changes only the lightness (in a
perceptual color space such as OKLCH), keeping hue and chroma as far as
possible. It makes the color darker or lighter by the smallest amount that gives
at least 3:1 contrast against the current background of that mode. If the solid
already has 3:1, it stays unchanged. The result is written as chart tokens, so
`--nimbus-chart-<palette>` has one value for light mode and one for dark mode.
At run time the chart only writes `var(--nimbus-chart-<palette>)` into
`stroke` and `fill`.

The script can also generate intermediate colors between the adapted solid and
the background (for example for area fills or a second series in the same
palette). The full-strength adapted solid is always drawn as the line, bar edge
or slice, so shapes that carry meaning keep 3:1. How many intermediate colors
exist, and how they are named, is decided after the reference screenshots in task
1.5.

Only palettes with a white contrast color are chart palettes. The list is read
from the generated `contrast` token, not written by hand, so a new palette
follows the rule automatically. This removes the hard case of very light solids
(yellow, lime, mint, sky, amber, `ctyellow`, `ctteal`) and keeps the
calculation small.

"Current background" means the background token of the color mode (for example
the page or surface background). The build uses one background per mode. A chart
that sits on a different surface color (for example inside a card) is not
checked against that surface. This is an open question (see below).

Alternative considered: compute colors in the browser. It adds a color library
to the bundle, needs mode handling in JavaScript, and can give a different color
on first render. It is kept for the later "arbitrary color" change, where it will
use `useColorMode` and hand-written math. It would also solve the "different
surface" case.

How the output enters `packages/tokens`: the existing `color-tokens` spec
requires a manual copy of generated colors into
`packages/tokens/src/base/tokens.json`. The chart tokens must follow the same
route, or the first task must replace it with something simpler. This is an open
question (see below).

### 5. Color is not the only signal

Adjacent bars and slices get a gap or outline. The legend always shows labels.
Line charts get a second signal (dash style or marker) when there are more than
a few series. The exact threshold is decided in the Line chart task and written
into the spec.

### 6. States are explicit

Empty data shows an empty state. `isLoading` shows the Nimbus skeleton. An
unknown series key warns in development and is skipped. An invalid palette warns
in development and falls back to the first palette in production. The container
has a default aspect ratio so Recharts never gets a zero-height parent.

### 7. Data flow

`ChartContainer` receives `config`, turns each palette name into a CSS variable
reference, and renders Recharts. `ChartTooltip` and `ChartLegend` read the same
`config`, so labels and colors always match the drawing.

## Risks / Trade-offs

- [Palette variables and the lightness-adaptation script are new tooling in the
  tokens build] → Build this first, with its unit test, before any chart.
- [Bundle size is unknown] → Measure after the first prototype. If the increase
  is large, import only the Recharts parts that are used and report the number
  in the pull request.
- [Six chart types, docs and stories in one week] → Task order puts Radar and
  Radial last so they can move to a later change without blocking the team.
- [Charts with many series need many distinguishable palettes] → Use palette
  order from a fixed list and add the second signal from Decision 5. The number
  of palettes that are distinguishable is an open question.
- [Recharts internals can change] → The public API hides Recharts, so a later
  library change would not be breaking for consumers.

## Migration Plan

New feature, no migration. Roll back by reverting the change. No existing
component changes.

## Open Questions

- Which Nimbus token is the "current background" for light and dark mode? The
  3:1 check needs one fixed background per mode. Is it enough to use the page
  background, or must charts on cards and other surfaces also reach 3:1?
- How are chart tokens added to `tokens.json`: through the existing manual copy
  workflow, or by a small committed mapping file that `tokens.json` references?
  Check the structure of `tokens.json` in the first task.
- `ctteal` is a brand palette and has a black contrast color, so it is not a
  chart palette. Is that acceptable for the product team?
- How many palettes are distinguishable enough for charts with many series, and
  in which fixed order should charts use them by default? After excluding seven
  palettes, 23 remain.
- Does the Recharts import style work with the strict bundler check
  (`pnpm check:bundler-compat`)?
