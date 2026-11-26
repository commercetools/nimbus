import { describe, expect, it } from "vitest";
import { themeTokens } from "@commercetools/nimbus-tokens";
import { colors } from "@/theme/semantic-tokens/colors";

type Mode = "light" | "dark";
type TokenValue = string | { _light: string; _dark: string };

const neutral = themeTokens.color["semantic-palettes"].neutral as Record<
  string,
  { value: { _light: string; _dark: string } }
>;

/** Resolves `{colors.neutral.N}` references and literal colors for a mode. */
const resolve = (value: TokenValue, mode: Mode): string => {
  const raw = typeof value === "string" ? value : value[`_${mode}`];
  const ref = /^\{colors\.neutral\.(\w+)\}$/.exec(raw);
  if (!ref) return raw;
  return neutral[ref[1]].value[`_${mode}`];
};

/** Converts `#rgb`, `#rrggbb` or `hsl(h, s%, l%)` to [r, g, b] in 0-255. */
const toRgb = (color: string): [number, number, number] => {
  const hsl = /^hsl\(\s*([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\s*\)$/.exec(color);
  if (hsl) {
    const [h, s, l] = [
      Number(hsl[1]),
      Number(hsl[2]) / 100,
      Number(hsl[3]) / 100,
    ];
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    };
    return [f(0) * 255, f(8) * 255, f(4) * 255];
  }
  let hex = color.replace("#", "");
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [
    number,
    number,
    number,
  ];
};

const luminance = (color: string): number => {
  const [r, g, b] = toRgb(color).map((channel) => {
    const c = Math.round(channel) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string): number => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

describe("chart text contrast", () => {
  const modes: Mode[] = ["light", "dark"];
  const textTokens = {
    fg: colors.fg.DEFAULT.value as TokenValue,
    "fg.subtle": colors.fg.subtle.value as TokenValue,
  };

  for (const mode of modes) {
    const bg = resolve(colors.bg.DEFAULT.value as TokenValue, mode);

    for (const [name, token] of Object.entries(textTokens)) {
      it(`${name} has at least 4.5:1 contrast against bg in ${mode} mode`, () => {
        expect(contrast(resolve(token, mode), bg)).toBeGreaterThanOrEqual(4.5);
      });
    }
  }

  it("matches the documented fg.subtle ratios (5.92:1 light, 9.11:1 dark)", () => {
    const subtle = textTokens["fg.subtle"];
    const bgToken = colors.bg.DEFAULT.value as TokenValue;
    expect(
      contrast(resolve(subtle, "light"), resolve(bgToken, "light"))
    ).toBeCloseTo(5.92, 0);
    expect(
      contrast(resolve(subtle, "dark"), resolve(bgToken, "dark"))
    ).toBeCloseTo(9.11, 0);
  });
});
