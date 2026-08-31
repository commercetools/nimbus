import { describe, it, expect, vi } from "vitest";
import { THEMES, resolveRoles, resolveTheme } from "./roles";
import type { ChartRoles } from "./roles";
import { divergingColor, sequentialColor } from "./sequential";
import { deltaE, isMonotonic, lightness } from "./legibility";

const REQUIRED_FIELDS: (keyof ChartRoles)[] = [
  "accent",
  "positive",
  "negative",
  "ink",
  "mutedInk",
  "grid",
  "axis",
  "surface",
  "surfacePage",
];

describe("theme registry / resolveTheme", () => {
  it("resolves each mode to its own role set", () => {
    expect(resolveTheme("nimbus", "light").mode).toBe("light");
    expect(resolveTheme("nimbus", "dark").mode).toBe("dark");
  });

  it("resolveRoles shims the default theme", () => {
    expect(resolveRoles("light")).toBe(resolveTheme("nimbus", "light"));
    expect(resolveRoles("dark")).toBe(resolveTheme("nimbus", "dark"));
  });

  it("falls back to the default theme on an unknown name (never throws)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    // @ts-expect-error — intentionally invalid theme name
    expect(resolveTheme("does-not-exist", "light")).toBe(
      resolveTheme("nimbus", "light")
    );
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });

  it("every theme × mode is complete and well-formed", () => {
    const hex = /^#[0-9a-f]{6}$/i;
    for (const theme of Object.values(THEMES)) {
      for (const roles of [theme.light, theme.dark]) {
        for (const field of REQUIRED_FIELDS) {
          expect(roles[field], field).toMatch(hex);
        }
        expect(roles.categorical).toHaveLength(8);
        roles.categorical.forEach((c) => expect(c).toMatch(hex));
        for (const key of ["blue", "teal", "gray"] as const) {
          expect(roles.ramps[key].length).toBeGreaterThanOrEqual(2);
          roles.ramps[key].forEach((c) => expect(c).toMatch(hex));
        }
        for (const pole of ["negative", "neutral", "positive"] as const) {
          expect(roles.diverging[pole]).toMatch(hex);
        }
      }
    }
  });

  it("theme role sets are deeply frozen", () => {
    const roles = resolveTheme("nimbus", "light");
    expect(Object.isFrozen(roles)).toBe(true);
    expect(Object.isFrozen(roles.categorical)).toBe(true);
    expect(Object.isFrozen(roles.ramps)).toBe(true);
    expect(() => {
      (roles.categorical as string[]).push("#000000");
    }).toThrow();
  });
});

describe("sequentialColor (OKLab ramp)", () => {
  const stops = resolveTheme("nimbus", "light").ramps.blue;
  const scale = sequentialColor(stops);

  it("returns the endpoints at t=0 and t=1 (within round-trip tolerance)", () => {
    expect(deltaE(scale(0), stops[0])).toBeLessThan(1.5);
    expect(deltaE(scale(1), stops[stops.length - 1])).toBeLessThan(1.5);
  });

  it("clamps out-of-range t and tolerates NaN", () => {
    expect(scale(-1)).toBe(scale(0));
    expect(scale(2)).toBe(scale(1));
    expect(scale(NaN)).toBe(scale(0));
  });

  it("is lightness-monotonic across t", () => {
    const samples = Array.from({ length: 11 }, (_, i) =>
      lightness(scale(i / 10))
    );
    expect(isMonotonic(samples)).toBe(true);
  });
});

describe("divergingColor", () => {
  const d = resolveTheme("nimbus", "light").diverging;
  const scale = divergingColor(d);

  it("hits the negative pole, neutral, and positive pole", () => {
    expect(deltaE(scale(0), d.negative)).toBeLessThan(1.5);
    expect(deltaE(scale(0.5), d.neutral)).toBeLessThan(1.5);
    expect(deltaE(scale(1), d.positive)).toBeLessThan(1.5);
  });

  it("clamps out-of-range t and tolerates NaN (→ neutral)", () => {
    expect(scale(-1)).toBe(scale(0));
    expect(scale(2)).toBe(scale(1));
    expect(deltaE(scale(NaN), d.neutral)).toBeLessThan(1.5);
  });
});
