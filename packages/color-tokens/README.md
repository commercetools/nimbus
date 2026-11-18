# color-tokens

I wasn't able to bring the huge amount of color-tokens into the required shape
within the `tokens/src/base/tokens.json` file in a reasonable amount of time.

As a workaround, I created this package which takes the colors from radix and
bring them - as well as our custom ct-colors - in a shape that the token-file
understands. However, applying those colors is a manual step, so here is what
you need to do:

## Any color change needed?

1. Do the change needed in the `packages/color-tokens/index.ts` and/or the
   `packages/color-tokens/brand-colors.ts`.
2. Navigate to `packages/color-tokens` directory and run `pnpm tsx ./index.ts`
3. The colors end up in `dist/color-tokens.json`
4. Replace the existing `colors` object in the token-package's
   `src/base/tokens.json` file, with the object from `dist/color-tokens.json`

## Chart colors

The chart components use one color for each palette. It is the palette's solid
color (`DEFAULT`, step 9), adapted in lightness so that it has at least 3:1
contrast against the `bg` color of the color mode (WCAG 1.4.11). These colors
are generated, not copied by hand:

1. In `packages/color-tokens`, run `pnpm generate:chart-tokens`.
2. It writes two committed files:
   - `packages/tokens/src/base/chart-tokens.json`: the color tokens
     (`color.chart.<palette>`, with `light.DEFAULT` and `dark.DEFAULT`). The
     tokens package reads it as a second Style Dictionary `source`.
   - `packages/nimbus/src/components/chart/chart.palettes.ts`: the
     `ChartPalette` type and the default palette order.
3. Run `pnpm build:tokens`. Chakra turns the tokens into the CSS variables
   `--nimbus-colors-chart-<palette>`.

How the colors are chosen (`chart-colors.ts`):

- Chart palettes are the palettes whose `contrast` color is white. The seven
  palettes with a black contrast color (`amber`, `lime`, `mint`, `sky`,
  `yellow`, `ctyellow`, `ctteal`) are not chart palettes. The rule is shared
  with `index.ts` through `contrast-color.ts`.
- The background is `#fff` in light mode and the dark `neutral.1` (Radix gray
  dark step 1) in dark mode. A test checks that this matches the `bg` token of
  the Nimbus theme.
- A solid that already has 3:1 stays unchanged. Otherwise only the OKLCH
  lightness changes, by the smallest step that gives 3:1.
- Contrast is measured on the value as the tokens build emits it (rounded HSL),
  because that is the color the browser shows.

`pnpm --filter color-tokens test` checks the palette selection, the contrast of
the generated tokens in both modes, the adaptation (with failing fixtures), the
default palette order, and that both generated files match the generator.
