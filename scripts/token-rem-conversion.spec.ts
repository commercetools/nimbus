import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const GENERATED_CSS = resolve(
  import.meta.dirname,
  "../packages/tokens/css/design-tokens.css"
);

const GENERATED_TS = resolve(
  import.meta.dirname,
  "../packages/tokens/src/generated/ts/design-tokens.ts"
);

function readFile(path: string): string {
  return readFileSync(path, "utf-8");
}

describe("token rem conversion", () => {
  describe("CSS custom properties", () => {
    it("fontSize tokens use rem units", () => {
      const css = readFile(GENERATED_CSS);
      const fontSizeLines = css
        .split("\n")
        .filter((line) => line.includes("--font-size-"));

      expect(fontSizeLines.length).toBeGreaterThan(0);

      for (const line of fontSizeLines) {
        expect(line).toMatch(/:\s*[\d.]+rem/);
        expect(line).not.toMatch(/:\s*[\d.]+px/);
      }
    });

    it("lineHeight tokens use rem units", () => {
      const css = readFile(GENERATED_CSS);
      const lineHeightLines = css
        .split("\n")
        .filter((line) => line.includes("--line-height-"));

      expect(lineHeightLines.length).toBeGreaterThan(0);

      for (const line of lineHeightLines) {
        expect(line).toMatch(/:\s*[\d.]+rem/);
        expect(line).not.toMatch(/:\s*[\d.]+px/);
      }
    });

    it("spacing tokens still use px units", () => {
      const css = readFile(GENERATED_CSS);
      const spacingLines = css
        .split("\n")
        .filter((line) => line.includes("--spacing-"));

      expect(spacingLines.length).toBeGreaterThan(0);

      for (const line of spacingLines) {
        expect(line).toMatch(/:\s*[\d.]+px/);
      }
    });
  });

  describe("TypeScript generated tokens", () => {
    it("fontSize values use rem", () => {
      const ts = readFile(GENERATED_TS);
      const fontSizeBlock = ts.match(/fontSize:\s*\{([^}]+)\}/s);
      expect(fontSizeBlock).not.toBeNull();

      const valueMatches = fontSizeBlock![1].match(/:\s*"([^"]+)"/g) ?? [];

      expect(valueMatches.length).toBeGreaterThan(0);

      for (const match of valueMatches) {
        const val = match.replace(/^:\s*"/, "").replace(/"$/, "");
        expect(val).toMatch(/rem$/);
        expect(val).not.toMatch(/px/);
      }
    });

    it("lineHeight values use rem", () => {
      const ts = readFile(GENERATED_TS);
      const lineHeightBlock = ts.match(/lineHeight:\s*\{([^}]+)\}/s);
      expect(lineHeightBlock).not.toBeNull();

      const valueMatches = lineHeightBlock![1].match(/:\s*"([^"]+)"/g) ?? [];

      expect(valueMatches.length).toBeGreaterThan(0);

      for (const match of valueMatches) {
        const val = match.replace(/^:\s*"/, "").replace(/"$/, "");
        expect(val).toMatch(/rem$/);
        expect(val).not.toMatch(/px/);
      }
    });
  });

  describe("rem value correctness", () => {
    it("fontSize.400 (16px) equals 1rem", () => {
      const css = readFile(GENERATED_CSS);
      expect(css).toContain("--font-size-400: 1rem");
    });

    it("fontSize.350 (14px) equals 0.875rem", () => {
      const css = readFile(GENERATED_CSS);
      expect(css).toContain("--font-size-350: 0.875rem");
    });

    it("lineHeight.550 (22px) equals 1.375rem", () => {
      const css = readFile(GENERATED_CSS);
      expect(css).toContain("--line-height-550: 1.375rem");
    });
  });
});
