import { makeOklabRamp } from "./oklab";

/**
 * A single-hue sequential color scale from a theme's ramp anchor stops,
 * interpolated in OKLab (perceptually even, monotonic lightness, no banding).
 * `t` ∈ [0,1] (clamped; non-finite → 0). Sequential = one hue, never a rainbow.
 *
 * The caller passes the ramp it wants from the resolved theme, e.g.
 * `sequentialColor(theme.ramps.blue)` — the stops are already ordered for the
 * active mode (light→dark in light, dark→bright in dark), so `t=1` is always the
 * strongest reading.
 */
export function sequentialColor(stops: string[]): (t: number) => string {
  return makeOklabRamp(stops);
}

/**
 * A diverging color scale: `t=0` → negative pole, `t=0.5` → neutral midpoint,
 * `t=1` → positive pole, each arm interpolated in OKLab. Two hues meeting at a
 * neutral gray, so polarity reads from hue as well as position.
 */
export function divergingColor(pair: {
  negative: string;
  neutral: string;
  positive: string;
}): (t: number) => string {
  const negArm = makeOklabRamp([pair.neutral, pair.negative]);
  const posArm = makeOklabRamp([pair.neutral, pair.positive]);
  return (t: number): string => {
    const u = t < 0 ? 0 : t > 1 ? 1 : Number.isFinite(t) ? t : 0.5;
    return u <= 0.5 ? negArm((0.5 - u) / 0.5) : posArm((u - 0.5) / 0.5);
  };
}
