/**
 * Minimal, dependency-free sRGB ⇄ OKLab conversion + interpolation.
 *
 * OKLab (Björn Ottosson, 2020) is perceptually near-uniform, so linear
 * interpolation in it yields smooth ramps with monotonic lightness — no banding,
 * and CVD-friendly. Used at runtime by the chart ramps (`sequential.ts`) and, in
 * tests, by the palette-legibility gate, so both speak the same color math.
 */

export interface Oklab {
  L: number;
  a: number;
  b: number;
}

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);

/** Parse a `#rgb` / `#rrggbb` hex string to sRGB channels in [0, 1]. */
export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const int = parseInt(h, 16);
  return [
    ((int >> 16) & 255) / 255,
    ((int >> 8) & 255) / 255,
    (int & 255) / 255,
  ];
}

const toLinear = (c: number): number =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const toGamma = (c: number): number =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

export function rgbToOklab([r, g, b]: [number, number, number]): Oklab {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

export function oklabToRgb({ L, a, b }: Oklab): [number, number, number] {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [clamp01(toGamma(lr)), clamp01(toGamma(lg)), clamp01(toGamma(lb))];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  const h = (v: number): string =>
    Math.round(clamp01(v) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export const hexToOklab = (hex: string): Oklab => rgbToOklab(hexToRgb(hex));
export const oklabToHex = (lab: Oklab): string => rgbToHex(oklabToRgb(lab));

/** Linear interpolation between two OKLab colors. */
export function lerpOklab(x: Oklab, y: Oklab, t: number): Oklab {
  return {
    L: x.L + (y.L - x.L) * t,
    a: x.a + (y.a - x.a) * t,
    b: x.b + (y.b - x.b) * t,
  };
}

/**
 * Build a continuous color function from N hex anchor stops. `t` ∈ [0, 1]
 * (clamped; non-finite → 0) maps evenly across the anchors, interpolating each
 * segment in OKLab. One stop → constant; zero stops → black (defensive).
 */
export function makeOklabRamp(stops: string[]): (t: number) => string {
  if (stops.length === 0) return () => "#000000";
  if (stops.length === 1) return () => stops[0];
  const labs = stops.map(hexToOklab);
  return (t: number): string => {
    const u = clamp01(Number.isFinite(t) ? t : 0);
    const seg = u * (labs.length - 1);
    const i = Math.min(labs.length - 2, Math.floor(seg));
    return oklabToHex(lerpOklab(labs[i], labs[i + 1], seg - i));
  };
}
