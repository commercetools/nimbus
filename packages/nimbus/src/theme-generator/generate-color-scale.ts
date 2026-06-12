import { parse, oklch, formatHex, clampChroma } from "culori";
import { calculateContrastColor } from "./contrast";
import type { ColorPalette, ColorPaletteWithModes } from "./types";

const LIGHT_LIGHTNESS_TARGETS = [
  0.99, // step 1: app background
  0.97, // step 2: subtle background
  0.94, // step 3: UI element background
  0.91, // step 4: hovered UI element
  0.88, // step 5: active/selected UI element
  0.82, // step 6: subtle border
  0.74, // step 7: border
  0.64, // step 8: strong border / focus ring
  null, // step 9: solid background (base color)
  null, // step 10: hovered solid background
  0.45, // step 11: low-contrast text
  0.27, // step 12: high-contrast text
];

const DARK_LIGHTNESS_TARGETS = [
  0.15, // step 1: app background
  0.18, // step 2: subtle background
  0.22, // step 3: UI element background
  0.26, // step 4: hovered UI element
  0.3, // step 5: active/selected UI element
  0.36, // step 6: subtle border
  0.43, // step 7: border
  0.52, // step 8: strong border / focus ring
  null, // step 9: solid background (base color)
  null, // step 10: hovered solid background
  0.82, // step 11: low-contrast text
  0.93, // step 12: high-contrast text
];

function generateScale(
  baseColor: string,
  lightnessTargets: (number | null)[],
  isDark: boolean
): ColorPalette {
  const baseOklch = oklch(parse(baseColor));
  if (!baseOklch) throw new Error(`Invalid color: ${baseColor}`);

  const baseL = baseOklch.l ?? 0.5;
  const baseC = baseOklch.c ?? 0;
  const baseH = baseOklch.h ?? 0;

  const steps: Record<string, string> = {};

  for (let i = 0; i < 12; i++) {
    const step = String(i + 1);
    const targetL = lightnessTargets[i];

    if (targetL === null) {
      if (i === 8) {
        // step 9: use base color as-is
        const clamped = clampChroma(
          { mode: "oklch", l: baseL, c: baseC, h: baseH },
          "oklch"
        );
        steps[step] = formatHex(clamped)!;
      } else {
        // step 10: slightly adjust from base
        const delta = isDark ? 0.04 : -0.04;
        const clamped = clampChroma(
          { mode: "oklch", l: baseL + delta, c: baseC, h: baseH },
          "oklch"
        );
        steps[step] = formatHex(clamped)!;
      }
    } else {
      const distance = Math.abs(targetL - baseL);
      const chromaScale = distance > 0.3 ? 0.3 : distance > 0.15 ? 0.6 : 0.85;
      const chroma = baseC * chromaScale;
      const clamped = clampChroma(
        { mode: "oklch", l: targetL, c: chroma, h: baseH },
        "oklch"
      );
      steps[step] = formatHex(clamped)!;
    }
  }

  const contrast = calculateContrastColor(steps["9"]);

  return {
    ...steps,
    DEFAULT: steps["9"],
    contrast,
  } as ColorPalette;
}

export function generateColorScale(baseColor: string): ColorPaletteWithModes {
  return {
    light: generateScale(baseColor, LIGHT_LIGHTNESS_TARGETS, false),
    dark: generateScale(baseColor, DARK_LIGHTNESS_TARGETS, true),
  };
}
