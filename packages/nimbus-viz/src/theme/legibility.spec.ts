import { describe, it, expect } from "vitest";
import { THEMES } from "./roles";
import type { ColorMode } from "./roles";
import {
  chroma,
  contrastRatio,
  cvdDeltaE,
  deltaE,
  isMonotonic,
  lightness,
} from "./legibility";

/**
 * The palette-legibility gate: every theme in the catalog must clear the
 * data-viz accessibility floors in BOTH modes, so a new/edited theme can't
 * regress. This is a regression guard using a self-contained Machado-1.0 CVD
 * model, whose absolute ΔE scale differs from the data-viz skill's
 * `validate_palette.js` (the authoritative grader, which passes this palette at
 * worst-adjacent CVD ΔE ~9). Floors are therefore calibrated to THIS model so
 * the validated `nimbus` palette passes with margin; the negative control at the
 * bottom (two near-identical hues) proves the gate still bites. Chart series
 * also always ship a legend/labels (secondary encoding), the relief the skill
 * allows in the 6–8 band.
 */
const NORMAL_FLOOR = 12; // adjacent separation for normal vision
const CVD_FLOOR = 5; // adjacent separation under dichromacy (this model; nimbus worst ≈5.8)
const CHROMA_FLOOR = 0.04; // below this a series color reads as gray
const L_MIN = 0.35;
const L_MAX = 0.88;

const MODES: ColorMode[] = ["light", "dark"];

describe("palette legibility gate", () => {
  for (const [name, theme] of Object.entries(THEMES)) {
    for (const mode of MODES) {
      const roles = theme[mode];
      describe(`${name} / ${mode}`, () => {
        it("has 8 distinct categorical colors", () => {
          expect(roles.categorical).toHaveLength(8);
          expect(new Set(roles.categorical).size).toBe(8);
        });

        it("adjacent categorical are separable for normal vision", () => {
          for (let i = 1; i < roles.categorical.length; i++) {
            const d = deltaE(roles.categorical[i - 1], roles.categorical[i]);
            expect(
              d,
              `${roles.categorical[i - 1]}↔${roles.categorical[i]} ΔE ${d.toFixed(1)}`
            ).toBeGreaterThanOrEqual(NORMAL_FLOOR);
          }
        });

        it("adjacent categorical survive color-vision deficiency", () => {
          for (let i = 1; i < roles.categorical.length; i++) {
            const d = cvdDeltaE(roles.categorical[i - 1], roles.categorical[i]);
            expect(
              d,
              `${roles.categorical[i - 1]}↔${roles.categorical[i]} CVD ΔE ${d.toFixed(1)}`
            ).toBeGreaterThanOrEqual(CVD_FLOOR);
          }
        });

        it("categorical sit inside the lightness band", () => {
          for (const c of roles.categorical) {
            const L = lightness(c);
            expect(L, `${c} L ${L.toFixed(2)}`).toBeGreaterThan(L_MIN);
            expect(L, `${c} L ${L.toFixed(2)}`).toBeLessThan(L_MAX);
          }
        });

        it("categorical clear the chroma floor (not gray)", () => {
          for (const c of roles.categorical) {
            expect(chroma(c), `${c}`).toBeGreaterThanOrEqual(CHROMA_FLOOR);
          }
        });

        it("ink and mutedInk meet contrast on the surface", () => {
          expect(
            contrastRatio(roles.ink, roles.surface)
          ).toBeGreaterThanOrEqual(4.5);
          expect(
            contrastRatio(roles.mutedInk, roles.surface)
          ).toBeGreaterThanOrEqual(3);
        });

        it("every ramp is lightness-monotonic", () => {
          for (const [key, stops] of Object.entries(roles.ramps)) {
            expect(isMonotonic(stops.map(lightness)), `ramp ${key}`).toBe(true);
          }
        });
      });
    }
  }

  it("rejects a non-separable palette (negative control)", () => {
    // Two near-identical hues must fail the CVD floor — proving the gate bites.
    expect(cvdDeltaE("#2a78d6", "#2c79d7")).toBeLessThan(CVD_FLOOR);
  });
});
