import { describe, expect, it } from "vitest";
import chroma from "chroma-js";
import * as radixColors from "@radix-ui/colors";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import {
  CHART_BACKGROUNDS,
  CHART_MIN_CONTRAST,
  DEFAULT_CHART_PALETTE_ORDER,
  adaptLightness,
  chartPalettes,
  emittedColor,
  generateChartPalettesModule,
  generateChartTokens,
  getAllPaletteSolids,
  serializeChartTokens,
  type ChartMode,
} from "./chart-colors";
import { calculateContrastColor } from "./contrast-color";
// The generated Chakra tokens: the value as it is emitted by the tokens build
// (hex converted to rounded HSL). This is what the browser shows.
import generatedTokens from "../tokens/src/generated/chakra/theme-tokens";
import committedChartTokens from "../tokens/src/base/chart-tokens.json";

const MODES: ChartMode[] = ["light", "dark"];

/** Palettes that have a black contrast color (see design.md, "Facts checked"). */
const BLACK_CONTRAST_PALETTES = [
  "amber",
  "lime",
  "mint",
  "sky",
  "yellow",
  "ctyellow",
  "ctteal",
];

type EmittedChartTokens = Record<
  string,
  { DEFAULT: { value: { _light: string; _dark: string } } }
>;

const emittedChart = ((
  generatedTokens as unknown as { color: { chart?: EmittedChartTokens } }
).color.chart ?? {}) as EmittedChartTokens;

type CommittedChartTokens = Record<
  string,
  Record<ChartMode, { DEFAULT: { $value: string } }>
>;
const committedChart = (
  committedChartTokens as unknown as { color: { chart: CommittedChartTokens } }
).color.chart;

const solidOf = (name: string, mode: ChartMode): string => {
  const palette = getAllPaletteSolids().find((p) => p.name === name);
  if (!palette) throw new Error(`Unknown palette ${name}`);
  return palette[mode];
};

describe("chart background", () => {
  it("uses #fff in light mode and the dark neutral.1 (Radix gray dark 1) in dark mode", () => {
    expect(CHART_BACKGROUNDS.light.toLowerCase()).toBe("#ffffff");
    expect(CHART_BACKGROUNDS.dark.toLowerCase()).toBe(
      radixColors.grayDark.gray1.toLowerCase()
    );
  });

  it("matches the bg semantic token of the nimbus theme", () => {
    const source = readFileSync(
      fileURLToPath(
        new URL(
          "../nimbus/src/theme/semantic-tokens/colors.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(source).toMatch(
      /bg:\s*\{\s*DEFAULT:\s*\{\s*value:\s*\{\s*_light:\s*"#fff",\s*_dark:\s*"\{colors\.neutral\.1\}"/
    );
  });
});

describe("chart palette selection", () => {
  it("includes only palettes whose contrast color is white in both modes", () => {
    expect(chartPalettes.length).toBeGreaterThan(0);
    for (const palette of chartPalettes) {
      for (const mode of MODES) {
        expect(
          calculateContrastColor(palette[mode]),
          `${palette.name} ${mode}`
        ).toBe("#ffffff");
      }
    }
  });

  it("leaves out every palette that has a black contrast color", () => {
    const included = new Set(chartPalettes.map((p) => p.name));
    const excluded = getAllPaletteSolids()
      .filter((p) => !included.has(p.name))
      .map((p) => p.name)
      .sort();
    expect(excluded).toEqual([...BLACK_CONTRAST_PALETTES].sort());
    for (const name of excluded) {
      const palette = getAllPaletteSolids().find((p) => p.name === name)!;
      const blackInSomeMode = MODES.some(
        (mode) => calculateContrastColor(palette[mode]) === "#000000"
      );
      expect(blackInSomeMode, name).toBe(true);
    }
  });

  it("has 23 chart palettes", () => {
    expect(chartPalettes).toHaveLength(23);
  });
});

describe("chart color tokens, contrast on the emitted value", () => {
  it("has a generated chart token for every chart palette", () => {
    for (const palette of chartPalettes) {
      expect(
        emittedChart[palette.name],
        `generated token for ${palette.name}`
      ).toBeDefined();
    }
  });

  it.each(MODES)(
    "has at least 3:1 contrast against the %s background for every chart palette",
    (mode) => {
      const key = mode === "light" ? "_light" : "_dark";
      for (const palette of chartPalettes) {
        const emitted = emittedChart[palette.name]?.DEFAULT.value[key];
        expect(emitted, `${palette.name} ${mode} emitted value`).toBeTypeOf(
          "string"
        );
        const ratio = chroma.contrast(emitted, CHART_BACKGROUNDS[mode]);
        expect(
          ratio,
          `${palette.name} ${mode} (${emitted}) = ${ratio.toFixed(3)}`
        ).toBeGreaterThanOrEqual(CHART_MIN_CONTRAST);
      }
    }
  );
});

describe("chart color tokens, adaptation of the solid color", () => {
  it("keeps a solid that already has 3:1 unchanged", () => {
    for (const palette of chartPalettes) {
      for (const mode of MODES) {
        const solid = palette[mode];
        if (
          chroma.contrast(emittedColor(solid), CHART_BACKGROUNDS[mode]) >=
          CHART_MIN_CONTRAST
        ) {
          expect(
            committedChart[palette.name]?.[mode].DEFAULT.$value.toLowerCase(),
            `${palette.name} ${mode}`
          ).toBe(solid.toLowerCase());
        }
      }
    }
  });

  it("changes only the lightness: at most 3.2:1 and hue within 3 degrees for chromatic colors", () => {
    for (const palette of chartPalettes) {
      for (const mode of MODES) {
        const solid = palette[mode];
        const token = committedChart[palette.name]?.[mode].DEFAULT.$value;
        expect(token, `${palette.name} ${mode}`).toBeTypeOf("string");
        if (token.toLowerCase() === solid.toLowerCase()) continue;
        const ratio = chroma.contrast(
          emittedColor(token),
          CHART_BACKGROUNDS[mode]
        );
        expect(
          ratio,
          `${palette.name} ${mode} upper bound`
        ).toBeLessThanOrEqual(3.2);
        const [, chromaSolid, hueSolid] = chroma(solid).oklch();
        if (chromaSolid >= 0.02) {
          const [, , hueToken] = chroma(token).oklch();
          const diff = Math.abs(((hueToken - hueSolid + 540) % 360) - 180);
          expect(diff, `${palette.name} ${mode} hue shift`).toBeLessThanOrEqual(
            3
          );
        }
      }
    }
  });

  it("changes orange in light mode (fixture: 2.97:1 before)", () => {
    const solid = solidOf("orange", "light");
    expect(chroma.contrast(solid, CHART_BACKGROUNDS.light)).toBeLessThan(
      CHART_MIN_CONTRAST
    );
    const token = committedChart.orange.light.DEFAULT.$value;
    expect(token.toLowerCase()).not.toBe(solid.toLowerCase());
    // Measured on the emitted value (rounded HSL), which is what ships.
    expect(
      chroma.contrast(emittedColor(token), CHART_BACKGROUNDS.light)
    ).toBeGreaterThanOrEqual(CHART_MIN_CONTRAST);
  });

  it("lightens a synthetic dark solid #484848 on #111111 (fixture: 2.06:1 before)", () => {
    const solid = "#484848";
    expect(chroma.contrast(solid, CHART_BACKGROUNDS.dark)).toBeLessThan(2.1);
    const adapted = adaptLightness(solid, CHART_BACKGROUNDS.dark);
    expect(adapted.toLowerCase()).not.toBe(solid);
    expect(chroma(adapted).luminance()).toBeGreaterThan(
      chroma(solid).luminance()
    );
    expect(
      chroma.contrast(adapted, CHART_BACKGROUNDS.dark)
    ).toBeGreaterThanOrEqual(CHART_MIN_CONTRAST);
    expect(
      chroma.contrast(adapted, CHART_BACKGROUNDS.dark)
    ).toBeLessThanOrEqual(3.2);
  });

  it("darkens a light solid on a light background and keeps the hue", () => {
    const solid = "#f76b15"; // Radix orange 9
    const adapted = adaptLightness(solid, "#ffffff");
    expect(chroma(adapted).luminance()).toBeLessThan(chroma(solid).luminance());
    const [, , h1] = chroma(solid).oklch();
    const [, , h2] = chroma(adapted).oklch();
    expect(Math.abs(h1 - h2)).toBeLessThanOrEqual(3);
  });

  it("returns a solid that already has enough contrast unchanged", () => {
    expect(adaptLightness("#4E4ED8", "#ffffff")).toBe("#4E4ED8");
  });
});

describe("chart tokens file", () => {
  it("matches the generator output (run `pnpm generate:chart-tokens` in packages/color-tokens after changing palettes, then rebuild the tokens)", () => {
    const committed = readFileSync(
      fileURLToPath(
        new URL("../tokens/src/base/chart-tokens.json", import.meta.url)
      ),
      "utf8"
    );
    expect(committed).toBe(serializeChartTokens(generateChartTokens()));
  });
});

describe("default chart palette order", () => {
  it("lists 11 different chart palettes", () => {
    expect(DEFAULT_CHART_PALETTE_ORDER).toHaveLength(11);
    expect(new Set(DEFAULT_CHART_PALETTE_ORDER).size).toBe(11);
    const chartNames = new Set(chartPalettes.map((p) => p.name));
    for (const name of DEFAULT_CHART_PALETTE_ORDER) {
      expect(chartNames.has(name), name).toBe(true);
    }
  });

  it("starts with the Nimbus brand violet", () => {
    expect(DEFAULT_CHART_PALETTE_ORDER[0]).toBe("ctviolet");
  });

  it.each(MODES)(
    "has a deltaE2000 of at least 15 between every pair, in %s mode",
    (mode) => {
      const colors = DEFAULT_CHART_PALETTE_ORDER.map((name) => ({
        name,
        color: emittedColor(committedChart[name][mode].DEFAULT.$value),
      }));
      for (let i = 0; i < colors.length; i += 1) {
        for (let j = i + 1; j < colors.length; j += 1) {
          const distance = chroma.deltaE(colors[i].color, colors[j].color);
          expect(
            distance,
            `${colors[i].name} / ${colors[j].name} (${mode}) = ${distance.toFixed(2)}`
          ).toBeGreaterThanOrEqual(15);
        }
      }
    }
  );

  it("is exported with the ChartPalette type from the generated chart.palettes.ts (no drift)", () => {
    const committed = readFileSync(
      fileURLToPath(
        new URL(
          "../nimbus/src/components/chart/chart.palettes.ts",
          import.meta.url
        )
      ),
      "utf8"
    );
    expect(committed).toBe(generateChartPalettesModule());
  });
});
