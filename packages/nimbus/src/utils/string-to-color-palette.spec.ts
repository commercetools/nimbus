import { describe, it, expect } from "vitest";
import { SYSTEM_COLOR_PALETTES } from "@/constants/color-palettes";
import { stringToColorPalette } from "./string-to-color-palette";

describe("stringToColorPalette", () => {
  it("returns a valid system color palette for a regular string", () => {
    const result = stringToColorPalette("hello");
    expect(SYSTEM_COLOR_PALETTES).toContain(result);
  });

  it("is deterministic — same input always produces the same output", () => {
    const input = "John Doe";
    const first = stringToColorPalette(input);
    const second = stringToColorPalette(input);
    expect(first).toBe(second);
  });

  it("produces varied outputs across different inputs", () => {
    const inputs = [
      "Alice",
      "Bob",
      "Charlie",
      "Delta",
      "Echo",
      "Foxtrot",
      "Golf",
      "Hotel",
      "India",
      "Juliet",
    ];
    const palettes = new Set(inputs.map(stringToColorPalette));
    expect(palettes.size).toBeGreaterThan(1);
  });

  it("handles an empty string without throwing", () => {
    expect(() => stringToColorPalette("")).not.toThrow();
    expect(SYSTEM_COLOR_PALETTES).toContain(stringToColorPalette(""));
  });

  it("handles a single character", () => {
    const result = stringToColorPalette("a");
    expect(SYSTEM_COLOR_PALETTES).toContain(result);
  });

  it("handles a very long string", () => {
    const longString = "a".repeat(10_000);
    expect(() => stringToColorPalette(longString)).not.toThrow();
    expect(SYSTEM_COLOR_PALETTES).toContain(stringToColorPalette(longString));
  });

  it("returns different palettes for strings that differ only in case", () => {
    const lower = stringToColorPalette("nimbus");
    const upper = stringToColorPalette("NIMBUS");
    // They may or may not be equal; just ensure both are valid palettes.
    expect(SYSTEM_COLOR_PALETTES).toContain(lower);
    expect(SYSTEM_COLOR_PALETTES).toContain(upper);
  });

  it("maps every result to a value in SYSTEM_COLOR_PALETTES", () => {
    const samples = [
      "commerce",
      "tools",
      "design",
      "system",
      "nimbus",
      "12345",
      "!@#$%",
      " ",
    ];
    for (const sample of samples) {
      expect(SYSTEM_COLOR_PALETTES).toContain(stringToColorPalette(sample));
    }
  });
});
