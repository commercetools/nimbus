import { describe, it, expect } from "vitest";
import { makeValueScale } from "./scales";

describe("makeValueScale", () => {
  it("linear maps the domain across the range proportionally", () => {
    const s = makeValueScale("linear", {
      domain: [0, 100],
      range: [0, 200],
      nice: false,
    });
    expect(s(0)).toBe(0);
    expect(s(50)).toBe(100);
    expect(s(100)).toBe(200);
  });

  it("log spaces decades evenly and clamps a non-positive lower bound", () => {
    // domain [0, 1000] → lower bound clamped to 1 → 3 decades over 300px.
    const s = makeValueScale("log", {
      domain: [0, 1000],
      range: [0, 300],
      nice: false,
    });
    const a = s(1);
    const b = s(10);
    const c = s(100);
    const d = s(1000);
    for (const v of [a, b, c, d]) expect(Number.isFinite(v)).toBe(true);
    expect(a).toBeLessThan(b);
    expect(b).toBeLessThan(c);
    expect(c).toBeLessThan(d);
    // Decades are evenly spaced on a log axis.
    expect(Math.abs(b - a - (c - b))).toBeLessThan(1);
  });

  it("symlog tolerates zero and negative values", () => {
    const s = makeValueScale("symlog", {
      domain: [-100, 100],
      range: [0, 200],
    });
    for (const v of [s(-100), s(0), s(100)])
      expect(Number.isFinite(v)).toBe(true);
    expect(s(-100)).toBeLessThan(s(0));
    expect(s(0)).toBeLessThan(s(100));
  });
});
