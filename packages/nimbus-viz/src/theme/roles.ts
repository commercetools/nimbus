import type { ColorMode } from "./tokens";
import { systemStep } from "./tokens";

/**
 * The semantic color roles a chart draws from. Charts never name a hue or a
 * token step — they ask for a role, and the theme resolves it from Nimbus
 * tokens for the active mode.
 */
export interface ChartRoles {
  mode: ColorMode;
  /** Primary emphasis (single-series accent, focused element). */
  accent: string;
  /** Valence — up/good. Carried WITH a non-color cue, never color alone. */
  positive: string;
  /** Valence — down/bad. Carried WITH a non-color cue, never color alone. */
  negative: string;
  /** Ordered categorical series colors. Assigned in order, never cycled. */
  categorical: string[];
  /** Strong text/ink (titles, values). */
  ink: string;
  /** Secondary text (axis labels, legends, captions). */
  mutedInk: string;
  /** Gridlines. */
  grid: string;
  /** Axis lines / ticks. */
  axis: string;
  /** Raised surface — a card or the chart's own background. */
  surface: string;
  /** Recessed app/page background, one step behind `surface`. */
  surfacePage: string;
}

/**
 * Categorical sequence validated for color-vision-deficiency separation in
 * Phase 0 (Spike 2), expressed as [hue, step] pairs against Nimbus system
 * palettes. Light snaps amber to step 11 (step 9 is too light for the
 * perceptual lightness band); dark uses the saturated step 9 across the board —
 * the documented Radix caveat is that no dark amber/orange step clears both the
 * lightness band and the chroma floor, so we take the brighter in-gamut solid
 * (still CVD-safe, ≥3:1 contrast).
 */
const CATEGORICAL: Record<ColorMode, Array<[string, number]>> = {
  light: [
    ["blue", 9],
    ["orange", 9],
    ["teal", 9],
    ["amber", 11],
    ["pink", 9],
    ["grass", 9],
    ["violet", 9],
    ["tomato", 9],
  ],
  dark: [
    ["blue", 9],
    ["orange", 9],
    ["teal", 9],
    ["amber", 9],
    ["pink", 9],
    ["grass", 9],
    ["violet", 9],
    ["tomato", 9],
  ],
};

export function resolveRoles(mode: ColorMode): ChartRoles {
  return {
    mode,
    accent: systemStep("blue", 9, mode),
    positive: systemStep("grass", 11, mode),
    negative: systemStep("red", 11, mode),
    categorical: CATEGORICAL[mode].map(([hue, step]) =>
      systemStep(hue, step, mode)
    ),
    ink: systemStep("gray", 12, mode),
    mutedInk: systemStep("gray", 11, mode),
    grid: systemStep("gray", 6, mode),
    axis: systemStep("gray", 8, mode),
    // Elevation inverts in dark: a raised surface is lighter than the page.
    surface: systemStep("gray", mode === "dark" ? 3 : 1, mode),
    surfacePage: systemStep("gray", mode === "dark" ? 1 : 2, mode),
  };
}
