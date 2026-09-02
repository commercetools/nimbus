import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { Brush, orderRange } from "./brush";
import { ChartScaleProvider } from "./scale-context";
import type { ChartScales } from "./scale-context";
import { ChartThemeProvider } from "../theme";

describe("orderRange", () => {
  it("orders low→high regardless of drag direction", () => {
    expect(orderRange(80, 20, 0, 200)).toEqual([20, 80]);
    expect(orderRange(20, 80, 0, 200)).toEqual([20, 80]);
  });

  it("clamps to the bounds", () => {
    expect(orderRange(-30, 250, 0, 200)).toEqual([0, 200]);
  });
});

const scales: ChartScales = {
  yScale: (v) => v,
  xScale: (v) => (typeof v === "number" ? v : 0),
  xBandwidth: 0,
  innerWidth: 200,
  innerHeight: 100,
};

function wrap(node: ReactNode) {
  return render(
    <ChartThemeProvider mode="light">
      <svg>
        <ChartScaleProvider value={scales}>{node}</ChartScaleProvider>
      </svg>
    </ChartThemeProvider>
  );
}

describe("Brush", () => {
  it("renders a full-plot capture rect", () => {
    const { container } = wrap(<Brush />);
    const rect = container.querySelector("rect");
    expect(rect).not.toBeNull();
    expect(rect?.getAttribute("width")).toBe("200");
    expect(rect?.getAttribute("height")).toBe("100");
  });
});
