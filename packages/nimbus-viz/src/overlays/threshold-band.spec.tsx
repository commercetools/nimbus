import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { ChartScaleProvider } from "../chart/scale-context";
import type { ChartScales } from "../chart/scale-context";
import { ChartThemeProvider } from "../theme";
import { ThresholdBand } from "./threshold-band";

const verticalScales: ChartScales = {
  yScale: (v) => 100 - v,
  xScale: (v) => (typeof v === "number" ? v : 0),
  xBandwidth: 0,
  innerWidth: 200,
  innerHeight: 100,
};

const horizontalScales: ChartScales = {
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

describe("ThresholdBand", () => {
  it("on a vertical chart, a value band (default orientation) spans the full width", () => {
    const { container } = wrap(
      <ThresholdBand from={20} to={40} />,
      verticalScales
    );
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("x")).toBe("0");
    expect(rect.getAttribute("width")).toBe("200"); // innerWidth
    // y spans yScale(40)..yScale(20) = 60..80
    expect(rect.getAttribute("y")).toBe("60");
    expect(rect.getAttribute("height")).toBe("20");
  });

  it("on a horizontal (value-on-x) chart, the SAME default orientation now spans the full height", () => {
    const { container } = wrap(
      <ThresholdBand from={20} to={40} />,
      horizontalScales
    );
    const rect = container.querySelector("rect")!;
    expect(rect.getAttribute("y")).toBe("0");
    expect(rect.getAttribute("height")).toBe("100"); // innerHeight
    expect(rect.getAttribute("x")).toBe("20");
    expect(rect.getAttribute("width")).toBe("20");
  });
});
