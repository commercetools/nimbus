import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { chartPaletteNames, defaultChartPaletteOrder } from "../chart.palettes";
import type { ChartConfig } from "../chart.types";
import { getChartPaletteColor, resolveChartConfig } from "./chart-config";

const colorOf = (palette: string) => `var(--nimbus-colors-chart-${palette})`;

describe("chart config utilities", () => {
  let warn: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    vi.unstubAllEnvs();
  });

  describe("getChartPaletteColor", () => {
    it("turns a palette name into its CSS variable reference", () => {
      expect(getChartPaletteColor("violet")).toBe(
        "var(--nimbus-colors-chart-violet)"
      );
    });

    it("works for every chart palette", () => {
      for (const palette of chartPaletteNames) {
        expect(getChartPaletteColor(palette)).toBe(colorOf(palette));
      }
    });
  });

  describe("resolveChartConfig", () => {
    it("resolves label and color of each series in order", () => {
      const config: ChartConfig = {
        a: { label: "A", palette: "violet" },
        b: { label: "B", palette: "teal" },
      };
      expect(resolveChartConfig(config, ["a", "b"])).toEqual([
        { key: "a", label: "A", color: colorOf("violet") },
        { key: "b", label: "B", color: colorOf("teal") },
      ]);
      expect(warn).not.toHaveBeenCalled();
    });

    it("gives entries without palette the default order color at their position", () => {
      const config: ChartConfig = {
        a: { label: "A" },
        b: { label: "B", palette: "violet" },
        c: { label: "C" },
      };
      const result = resolveChartConfig(config, ["a", "b", "c"]);
      expect(result.map((s) => s.color)).toEqual([
        colorOf(defaultChartPaletteOrder[0]),
        colorOf("violet"),
        colorOf(defaultChartPaletteOrder[2]),
      ]);
    });

    it("skips a series key that is not in config and warns in development", () => {
      const config: ChartConfig = { a: { label: "A" } };
      const result = resolveChartConfig(config, ["a", "missing"]);
      expect(result.map((s) => s.key)).toEqual(["a"]);
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain("missing");
    });

    it("does not warn about an unknown series key in production", () => {
      vi.stubEnv("NODE_ENV", "production");
      const result = resolveChartConfig({ a: { label: "A" } }, ["a", "x"]);
      expect(result).toHaveLength(1);
      expect(warn).not.toHaveBeenCalled();
    });

    it("warns about an invalid palette in development and falls back to the first default palette", () => {
      const config = {
        a: { label: "A", palette: "yellow" },
      } as unknown as ChartConfig;
      const result = resolveChartConfig(config, ["a"]);
      expect(result[0].color).toBe(colorOf(defaultChartPaletteOrder[0]));
      expect(warn).toHaveBeenCalledTimes(1);
      expect(warn.mock.calls[0][0]).toContain("yellow");
    });

    it("falls back silently to the first default palette in production", () => {
      vi.stubEnv("NODE_ENV", "production");
      const config = {
        a: { label: "A" },
        b: { label: "B", palette: "yellow" },
      } as unknown as ChartConfig;
      const result = resolveChartConfig(config, ["a", "b"]);
      expect(result[1].color).toBe(colorOf(defaultChartPaletteOrder[0]));
      expect(warn).not.toHaveBeenCalled();
    });

    it("warns about more than 11 series and reuses the default order", () => {
      const keys = Array.from({ length: 13 }, (_, i) => `s${i}`);
      const config: ChartConfig = Object.fromEntries(
        keys.map((key) => [key, { label: key }])
      );
      const result = resolveChartConfig(config, keys);
      expect(result).toHaveLength(13);
      expect(result[11].color).toBe(colorOf(defaultChartPaletteOrder[0]));
      expect(result[12].color).toBe(colorOf(defaultChartPaletteOrder[1]));
      expect(warn).toHaveBeenCalledTimes(1);
    });

    it("does not warn for exactly 11 series", () => {
      const keys = Array.from({ length: 11 }, (_, i) => `s${i}`);
      const config: ChartConfig = Object.fromEntries(
        keys.map((key) => [key, { label: key }])
      );
      resolveChartConfig(config, keys);
      expect(warn).not.toHaveBeenCalled();
    });

    it("returns an empty list for no series", () => {
      expect(resolveChartConfig({}, [])).toEqual([]);
    });
  });
});
