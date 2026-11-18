import chroma from "chroma-js";
import * as radixColors from "@radix-ui/colors";
import { brandColors } from "./brand-colors";
import { calculateContrastColor } from "./contrast-color";

export type ChartMode = "light" | "dark";

/** Minimum contrast of a chart color against the background (WCAG 1.4.11). */
export const CHART_MIN_CONTRAST = 3;

/**
 * The current background of each color mode: the `bg` semantic token of the
 * Nimbus theme (`packages/nimbus/src/theme/semantic-tokens/colors.ts`), which is
 * `#fff` in light mode and `neutral.1` in dark mode. `neutral.1` resolves to the
 * dark Radix gray step 1. A test checks that this stays in sync with the theme.
 */
export const CHART_BACKGROUNDS: Record<ChartMode, string> = {
  light: "#ffffff",
  dark: radixColors.grayDark.gray1,
};

/** Palette names that are not part of the Nimbus palettes (same list as `index.ts`). */
const IGNORED_RADIX_PALETTES = [
  "mauve",
  "sage",
  "olive",
  "sand",
  "P3",
  "default",
  // Added by Node 23+ when a CommonJS package is imported with `import * as`.
  "module.exports",
];

/** The solid color (step 9, `DEFAULT`) of a palette in light and dark mode. */
export type PaletteSolids = {
  name: string;
  light: string;
  dark: string;
};

type RadixPalette = Record<string, string>;

const radixPalette = (key: string): RadixPalette =>
  (radixColors as unknown as Record<string, RadixPalette>)[key];

/**
 * The solid color of every system palette (Radix) and brand palette
 * (`ctyellow`, `ctviolet`, `ctteal`), in the same selection as `index.ts`.
 */
export function getAllPaletteSolids(): PaletteSolids[] {
  const systemNames = Object.keys(radixColors).filter(
    (key) =>
      key !== "__esModule" &&
      !IGNORED_RADIX_PALETTES.some((ignored) => key.includes(ignored)) &&
      !key.includes("Dark") &&
      !key.includes("A")
  );

  const system = systemNames.map((name) => ({
    name,
    light: radixPalette(name)[`${name}9`],
    dark: radixPalette(`${name}Dark`)[`${name}9`],
  }));

  const brand: PaletteSolids[] = [
    {
      name: "ctyellow",
      light: brandColors.ctyellow.ctyellow9,
      dark: brandColors.ctyellowDark.ctyellowDark9,
    },
    {
      name: "ctviolet",
      light: brandColors.ctviolet.ctviolet9,
      dark: brandColors.ctvioletDark.ctvioletDark9,
    },
    {
      name: "ctteal",
      light: brandColors.ctteal.ctteal9,
      dark: brandColors.cttealDark.cttealDark9,
    },
  ];

  return [...system, ...brand].sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Chart palettes: the palettes whose contrast color is white in both modes.
 * The contrast color is computed with the same rule as the palette generator.
 */
export const chartPalettes: PaletteSolids[] = getAllPaletteSolids().filter(
  (palette) =>
    calculateContrastColor(palette.light) === "#ffffff" &&
    calculateContrastColor(palette.dark) === "#ffffff"
);

/**
 * The color as the browser shows it after the tokens build. Style Dictionary
 * converts hex to rounded HSL (`#6e56cf` becomes `hsl(252, 56%, 57%)`), which
 * can change the color slightly. Contrast is always checked on this value.
 */
export function emittedColor(hex: string): string {
  const [h, s, l] = chroma(hex).hsl();
  const hue = Number.isNaN(h) ? 0 : h;
  return chroma(
    `hsl(${Math.round(hue)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
  ).hex();
}

const LIGHTNESS_STEP = 0.0005;
const MAX_STEPS = 2000;

/**
 * Adapts only the OKLCH lightness of `solid`, by the smallest amount that gives
 * at least `minContrast` against `background`. Hue and chroma are kept. A solid
 * that already has enough contrast is returned unchanged. The contrast is
 * measured on the emitted value (see `emittedColor`).
 */
export function adaptLightness(
  solid: string,
  background: string,
  minContrast: number = CHART_MIN_CONTRAST
): string {
  const passes = (hex: string) =>
    chroma.contrast(emittedColor(hex), background) >= minContrast;

  if (passes(solid)) return solid;

  const [lightness, chromaValue, hue] = chroma(solid).oklch();
  const safeHue = Number.isNaN(hue) ? 0 : hue;
  const direction =
    chroma(background).luminance() > chroma(solid).luminance() ? -1 : 1;

  for (let step = 1; step <= MAX_STEPS; step += 1) {
    const candidateLightness = lightness + direction * step * LIGHTNESS_STEP;
    if (candidateLightness < 0 || candidateLightness > 1) break;
    const candidate = chroma
      .oklch(candidateLightness, chromaValue, safeHue)
      .hex();
    if (passes(candidate)) return candidate;
  }

  throw new Error(
    `Cannot reach ${minContrast}:1 contrast for ${solid} on ${background} by changing only the lightness`
  );
}

type ChartTokenValue = { $value: string };
type ChartTokenPair = Record<ChartMode, { DEFAULT: ChartTokenValue }>;
export type ChartTokensFile = {
  color: { chart: Record<string, ChartTokenPair> };
};

/**
 * The chart color tokens (DTCG): for every chart palette and mode, the solid
 * color adapted in lightness so it has at least 3:1 contrast against the
 * current background. Shape `color.chart.<palette>.{light,dark}.DEFAULT`, like
 * the existing palettes, so the Chakra converter produces
 * `{ DEFAULT: { value: { _light, _dark } } }`.
 */
export function generateChartTokens(): ChartTokensFile {
  const chart: Record<string, ChartTokenPair> = {};
  for (const palette of chartPalettes) {
    chart[palette.name] = {
      light: {
        DEFAULT: {
          $value: adaptLightness(palette.light, CHART_BACKGROUNDS.light),
        },
      },
      dark: {
        DEFAULT: {
          $value: adaptLightness(palette.dark, CHART_BACKGROUNDS.dark),
        },
      },
    };
  }
  return { color: { chart } };
}

/** The exact text of `packages/tokens/src/base/chart-tokens.json`. */
export function serializeChartTokens(tokens: ChartTokensFile): string {
  return `${JSON.stringify(tokens, null, 2)}\n`;
}

/**
 * The order in which charts assign palettes to series by default. These are 11
 * chart palettes that differ pairwise by a deltaE2000 of at least 15 in light and
 * dark mode. 11 is the largest set with that property (exact search over all
 * chart palettes). It starts with the Nimbus brand violet (`ctviolet`; `indigo`,
 * `iris` and `violet` are too close to it to be in the same set). A test checks
 * the distances. A chart with more series than palettes reuses the order.
 */
export const DEFAULT_CHART_PALETTE_ORDER = [
  "ctviolet",
  "orange",
  "teal",
  "crimson",
  "blue",
  "grass",
  "plum",
  "bronze",
  "cyan",
  "red",
  "slate",
] as const;

const quoteList = (names: readonly string[]): string =>
  names.map((name) => `  "${name}",\n`).join("");

/**
 * The text of `packages/nimbus/src/components/chart/chart.palettes.ts`: the
 * `ChartPalette` type (all chart palettes) and the default palette order.
 */
export function generateChartPalettesModule(): string {
  return `/**
 * Do not edit directly, this file is generated by \`pnpm generate:chart-tokens\`
 * in packages/color-tokens.
 */

/** The palettes that can be used as chart colors (palettes with a white contrast color). */
export const chartPaletteNames = [
${quoteList(chartPalettes.map((palette) => palette.name))}] as const;

/** The name of a chart palette. */
export type ChartPalette = (typeof chartPaletteNames)[number];

/**
 * The order in which charts assign palettes to series by default. Palettes next
 * to each other, and any two palettes in this list, are easy to tell apart.
 */
export const defaultChartPaletteOrder = [
${quoteList(DEFAULT_CHART_PALETTE_ORDER)}] as const satisfies readonly ChartPalette[];
`;
}
