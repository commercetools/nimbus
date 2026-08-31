/**
 * Test-only color-legibility math for the palette gate (`legibility.spec.ts`).
 *
 * Not exported from the package barrel and imported only by the spec, so it
 * never ships in the tsup bundle. It reuses `oklab.ts` so the gate speaks the
 * same color math as the runtime ramps, and adds ΔE, a Machado (2009) CVD
 * simulation, and WCAG contrast. It is a *regression guard* calibrated so the
 * validated `nimbus` palette passes with margin — the authoritative check
 * remains the data-viz skill's `validate_palette.js`.
 */
import { hexToRgb, rgbToOklab } from "./oklab";
import type { Oklab } from "./oklab";

const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const srgbToLinear = (c: number): number =>
  c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
const linearToSrgb = (c: number): number =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;

const oklab = (hex: string): Oklab => rgbToOklab(hexToRgb(hex));

/** OKLab lightness L (0..1). */
export const lightness = (hex: string): number => oklab(hex).L;

/** OKLab chroma √(a²+b²). ~0 reads as gray. */
export const chroma = (hex: string): number => {
  const { a, b } = oklab(hex);
  return Math.hypot(a, b);
};

const dist = (x: Oklab, y: Oklab): number =>
  Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b) * 100;

/** Perceptual distance between two colors (OKLab ΔE ×100). */
export const deltaE = (a: string, b: string): number =>
  dist(oklab(a), oklab(b));

// Machado et al. (2009) dichromacy matrices at severity 1.0, applied in linear RGB.
const CVD: Record<string, number[]> = {
  protan: [
    0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882,
    -0.048116, 1.051998,
  ],
  deutan: [
    0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182,
    0.04294, 0.968881,
  ],
  tritan: [
    1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733,
    0.691367, 0.3039,
  ],
};

function simulate(hex: string, m: number[]): Oklab {
  const [r, g, b] = hexToRgb(hex);
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const nr = clamp01(m[0] * lr + m[1] * lg + m[2] * lb);
  const ng = clamp01(m[3] * lr + m[4] * lg + m[5] * lb);
  const nb = clamp01(m[6] * lr + m[7] * lg + m[8] * lb);
  return rgbToOklab([linearToSrgb(nr), linearToSrgb(ng), linearToSrgb(nb)]);
}

/** Worst-case perceptual distance across the three dichromacies (OKLab ΔE ×100). */
export function cvdDeltaE(a: string, b: string): number {
  let worst = Infinity;
  for (const m of Object.values(CVD)) {
    worst = Math.min(worst, dist(simulate(a, m), simulate(b, m)));
  }
  return worst;
}

const relativeLuminance = (hex: string): number => {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * srgbToLinear(r) +
    0.7152 * srgbToLinear(g) +
    0.0722 * srgbToLinear(b)
  );
};

/** WCAG 2.1 contrast ratio (1..21). */
export function contrastRatio(a: string, b: string): number {
  const l1 = relativeLuminance(a);
  const l2 = relativeLuminance(b);
  const hi = Math.max(l1, l2);
  const lo = Math.min(l1, l2);
  return (hi + 0.05) / (lo + 0.05);
}

/** True if the numbers are strictly monotonic (all increasing OR all decreasing). */
export function isMonotonic(values: number[]): boolean {
  if (values.length < 2) return true;
  const up = values.every((v, i) => i === 0 || v > values[i - 1]);
  const down = values.every((v, i) => i === 0 || v < values[i - 1]);
  return up || down;
}
