import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { ChartScaleProvider } from "../chart/scale-context";
import type { ChartScales } from "../chart/scale-context";
import { ChartThemeProvider } from "../theme";
import { ReferenceLine } from "./reference-line";

const verticalScales: ChartScales = {
  yScale: (v) => 100 - v, // value axis, top-origin
  xScale: (v) => (typeof v === "number" ? v : 50),
  xBandwidth: 0,
  innerWidth: 200,
  innerHeight: 100,
  // orientation omitted -- the default, "vertical", every existing chart.
};

const horizontalScales: ChartScales = {
  // Horizontal orientation: xScale is the VALUE axis, yScale is position.
  xScale: (v) => (typeof v === "number" ? v : 0),
  yScale: (v) => v,
  xBandwidth: 0,
  innerWidth: 200,
  innerHeight: 100,
  orientation: "horizontal",
};

function wrap(node: ReactNode, scales: ChartScales) {
  return render(
    <ChartThemeProvider mode="light">
      <svg>
        <ChartScaleProvider value={scales}>{node}</ChartScaleProvider>
      </svg>
    </ChartThemeProvider>
  );
}

describe("ReferenceLine", () => {
  it("on a vertical chart, a value line (default orientation) is drawn horizontal via yScale", () => {
    const { container } = wrap(<ReferenceLine value={40} />, verticalScales);
    const line = container.querySelector("line")!;
    expect(line.getAttribute("y1")).toBe(line.getAttribute("y2"));
    expect(line.getAttribute("y1")).toBe(String(100 - 40));
    expect(line.getAttribute("x1")).toBe("0");
    expect(line.getAttribute("x2")).toBe("200"); // spans innerWidth
  });

  it("on a vertical chart, a position marker (orientation='vertical') is drawn vertical via xScale", () => {
    const { container } = wrap(
      <ReferenceLine value={30} orientation="vertical" />,
      verticalScales
    );
    const line = container.querySelector("line")!;
    expect(line.getAttribute("x1")).toBe(line.getAttribute("x2"));
    expect(line.getAttribute("x1")).toBe("30");
    expect(line.getAttribute("y1")).toBe("0");
    expect(line.getAttribute("y2")).toBe("100"); // spans innerHeight
  });

  it("on a horizontal (value-on-x) chart, the SAME default orientation ('horizontal' = value) now draws vertical via xScale", () => {
    // This is the A1b fix: the prop's meaning ("value axis") stays the same
    // across chart orientations; only the drawn direction flips, following
    // the chart's own ChartScales.orientation instead of hardcoding y=value.
    const { container } = wrap(<ReferenceLine value={75} />, horizontalScales);
    const line = container.querySelector("line")!;
    expect(line.getAttribute("x1")).toBe(line.getAttribute("x2"));
    expect(line.getAttribute("x1")).toBe("75");
    expect(line.getAttribute("y1")).toBe("0");
    expect(line.getAttribute("y2")).toBe("100");
  });

  it("on a horizontal chart, orientation='vertical' (position marker) now draws horizontal via yScale", () => {
    const { container } = wrap(
      <ReferenceLine value={60} orientation="vertical" />,
      horizontalScales
    );
    const line = container.querySelector("line")!;
    expect(line.getAttribute("y1")).toBe(line.getAttribute("y2"));
    expect(line.getAttribute("y1")).toBe("60");
    expect(line.getAttribute("x1")).toBe("0");
    expect(line.getAttribute("x2")).toBe("200");
  });
});
