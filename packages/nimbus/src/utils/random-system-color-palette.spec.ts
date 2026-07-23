import { describe, it, expect } from "vitest";
import { SYSTEM_COLOR_PALETTES } from "@/constants";
import { randomSystemColorPalette } from "./random-system-color-palette";

describe("randomSystemColorPalette", () => {
  it("returns a valid system color palette", () => {
    expect(SYSTEM_COLOR_PALETTES).toContain(randomSystemColorPalette("hello"));
  });

  it("is deterministic — the same seed always yields the same palette", () => {
    const first = randomSystemColorPalette("user-123");
    for (let i = 0; i < 100; i++) {
      expect(randomSystemColorPalette("user-123")).toBe(first);
    }
  });

  it("handles an empty string as a valid seed", () => {
    const result = randomSystemColorPalette("");
    expect(SYSTEM_COLOR_PALETTES).toContain(result);
    expect(randomSystemColorPalette("")).toBe(result);
  });

  it("only ever returns values from SYSTEM_COLOR_PALETTES", () => {
    for (let i = 0; i < 1000; i++) {
      expect(SYSTEM_COLOR_PALETTES).toContain(
        randomSystemColorPalette(`seed-${i}`)
      );
    }
  });

  it("spreads a range of seeds across most of the available palettes", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      seen.add(randomSystemColorPalette(`seed-${i}`));
    }
    // With 1000 varied seeds over 25 palettes we expect broad coverage;
    // require at least 20 distinct palettes to catch a badly-biased hash.
    expect(seen.size).toBeGreaterThanOrEqual(20);
  });

  it("distinguishes seeds that differ only slightly", () => {
    // Not a guarantee for any single pair, but across these near-identical
    // seeds the mapping should produce more than one palette.
    const seeds = ["a", "b", "c", "aa", "ab", "ba", "abc", "acb"];
    const results = new Set(seeds.map(randomSystemColorPalette));
    expect(results.size).toBeGreaterThan(1);
  });
});
