import { describe, expect, it } from "vitest";
import { resolveIsAnimationActive } from "./chart-animation";

describe("resolveIsAnimationActive", () => {
  it("animates when nothing is set and the user has no motion preference", () => {
    expect(resolveIsAnimationActive(undefined, false)).toBe(true);
  });

  it("does not animate when nothing is set and the user prefers reduced motion", () => {
    expect(resolveIsAnimationActive(undefined, true)).toBe(false);
  });

  it("lets an explicit true win over reduced motion", () => {
    expect(resolveIsAnimationActive(true, true)).toBe(true);
    expect(resolveIsAnimationActive(true, false)).toBe(true);
  });

  it("lets an explicit false win without a motion preference", () => {
    expect(resolveIsAnimationActive(false, false)).toBe(false);
    expect(resolveIsAnimationActive(false, true)).toBe(false);
  });
});
