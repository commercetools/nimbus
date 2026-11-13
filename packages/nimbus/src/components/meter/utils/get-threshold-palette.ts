import type { NimbusColorPalette } from "@/type-utils";
import type { MeterThreshold } from "../meter.types";

/**
 * Picks the fill color of a single-value meter from its thresholds.
 *
 * The threshold with the highest `from` that the value reaches (value greater
 * than or equal to `from`) wins. Below all thresholds, or without thresholds,
 * the fallback palette is used. The order of `thresholds` does not matter.
 *
 * @param value - The clamped value of the meter
 * @param thresholds - Thresholds in any order
 * @param fallback - Palette below all thresholds
 * @returns The palette for the fill
 *
 * @example
 * getThresholdPalette(92, [{ from: 80, colorPalette: "warning" }], "primary");
 * // "warning"
 */
export const getThresholdPalette = (
  value: number,
  thresholds: MeterThreshold[] | undefined,
  fallback: NimbusColorPalette
): NimbusColorPalette => {
  let match: MeterThreshold | undefined;
  for (const threshold of thresholds ?? []) {
    if (value >= threshold.from && (!match || threshold.from > match.from)) {
      match = threshold;
    }
  }
  return match?.colorPalette ?? fallback;
};
