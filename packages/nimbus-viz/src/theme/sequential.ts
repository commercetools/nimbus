import type { ColorMode } from "./tokens";
import { systemStep } from "./tokens";

// Steps spanning a single hue for a sequential (magnitude) ramp. Read against
// the active mode, the perceptual direction is correct in both: higher = darker
// in light mode, higher = brighter in dark mode.
const RAMP_STEPS = [3, 5, 7, 9, 11];

/**
 * A single-hue sequential color ramp. Returns a function mapping t∈[0,1] to a
 * Nimbus token value. Sequential = one hue, never a rainbow (dataviz rule).
 */
export function sequentialColor(
  hue: string,
  mode: ColorMode
): (t: number) => string {
  return (t: number) => {
    const clamped = Math.max(0, Math.min(1, Number.isFinite(t) ? t : 0));
    const idx = Math.round(clamped * (RAMP_STEPS.length - 1));
    return systemStep(hue, RAMP_STEPS[idx], mode);
  };
}
