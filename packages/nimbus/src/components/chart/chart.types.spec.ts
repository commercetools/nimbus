import { describe, expect, it } from "vitest";
import type { BarChartProps } from "@/components/bar-chart/bar-chart.types";
import type { PieChartProps } from "@/components/pie-chart/pie-chart.types";
import type { ChartConfig, ChartRootProps } from "./chart.types";
import type { ChartBarProps } from "./components/chart-bar";
import type { ReactElement } from "react";

/**
 * Type-level tests. An unused `@ts-expect-error` is a compile error, so these
 * fail `typecheck` when the types get looser. Run with `typecheck:dev`.
 */

const data = [{ month: "Jan", desktop: 1 }];
const config: ChartConfig = { desktop: { label: "Desktop" } };

describe("chart types", () => {
  it("accepts a chart palette and rejects one with a black contrast color", () => {
    const valid: ChartConfig = {
      desktop: { label: "Desktop", palette: "ctviolet" },
    };
    const invalid: ChartConfig = {
      // @ts-expect-error "yellow" has a black contrast color, so it is not a chart palette
      desktop: { label: "Desktop", palette: "yellow" },
    };
    expect(valid.desktop.palette).toBe("ctviolet");
    expect(invalid).toBeDefined();
  });

  it("requires aria-label on BarChart", () => {
    const valid: BarChartProps = {
      data,
      config,
      xAxisKey: "month",
      series: ["desktop"],
      "aria-label": "Visitors",
    };
    // @ts-expect-error aria-label is required
    const missing: BarChartProps = {
      data,
      config,
      xAxisKey: "month",
      series: ["desktop"],
    };
    expect(valid["aria-label"]).toBe("Visitors");
    expect(missing).toBeDefined();
  });

  it("accepts aria-labelledby instead of aria-label, but not both", () => {
    const labelledBy: BarChartProps = {
      data,
      config,
      xAxisKey: "month",
      series: ["desktop"],
      "aria-labelledby": "visitors-heading",
    };
    // @ts-expect-error aria-label and aria-labelledby are alternatives
    const both: BarChartProps = {
      data,
      config,
      xAxisKey: "month",
      series: ["desktop"],
      "aria-label": "Visitors",
      "aria-labelledby": "visitors-heading",
    };
    expect(labelledBy["aria-labelledby"]).toBe("visitors-heading");
    expect(both).toBeDefined();
  });

  it("gives PieChart nameKey and valueKey instead of xAxisKey and series", () => {
    const valid: PieChartProps = {
      data,
      config,
      nameKey: "month",
      valueKey: "desktop",
      "aria-label": "Visitors",
    };
    const withXAxisKey: PieChartProps = {
      data,
      config,
      nameKey: "month",
      valueKey: "desktop",
      "aria-label": "Visitors",
      // @ts-expect-error PieChart has no xAxisKey
      xAxisKey: "month",
    };
    const withSeries: PieChartProps = {
      data,
      config,
      nameKey: "month",
      valueKey: "desktop",
      "aria-label": "Visitors",
      // @ts-expect-error PieChart has no series
      series: ["desktop"],
    };
    // @ts-expect-error nameKey and valueKey are required
    const missingKeys: PieChartProps = {
      data,
      config,
      "aria-label": "Visitors",
    };
    expect(valid.nameKey).toBe("month");
    expect(withXAxisKey).toBeDefined();
    expect(withSeries).toBeDefined();
    expect(missingKeys).toBeDefined();
  });

  it("requires aria-label, config and one child on Chart.Root", () => {
    const child = null as unknown as ReactElement;
    const valid: ChartRootProps = {
      data,
      config,
      "aria-label": "Visitors",
      children: child,
    };
    // @ts-expect-error aria-label is required
    const missingLabel: ChartRootProps = { data, config, children: child };
    const withRechartsProp: ChartRootProps = {
      data,
      config,
      "aria-label": "Visitors",
      children: child,
      // @ts-expect-error a Recharts prop is not accepted
      stackOffset: "expand",
    };
    expect(valid.series).toBeUndefined();
    expect(missingLabel).toBeDefined();
    expect(withRechartsProp).toBeDefined();
  });

  it("gives series parts a required dataKey and no Recharts props", () => {
    const valid: ChartBarProps = { dataKey: "desktop", stacked: true };
    // @ts-expect-error dataKey is required
    const missing: ChartBarProps = { stacked: true };
    const withFill: ChartBarProps = {
      dataKey: "desktop",
      // @ts-expect-error fill comes from the config palette
      fill: "red",
    };
    expect(valid.dataKey).toBe("desktop");
    expect(missing).toBeDefined();
    expect(withFill).toBeDefined();
  });
});
