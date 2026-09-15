import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChartThemeProvider } from "../theme";
import { ChartFrame } from "./chart-frame";

describe("ChartFrame", () => {
  it("sizes the svg and insets children by the margin", () => {
    const { container } = render(
      <ChartThemeProvider>
        <ChartFrame width={300} height={200} ariaLabel="Test">
          {({ innerWidth, innerHeight }) => (
            <rect data-testid="probe" width={innerWidth} height={innerHeight} />
          )}
        </ChartFrame>
      </ChartThemeProvider>
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "300");
    expect(svg).toHaveAttribute("height", "200");
    // Default margin { top: 12, right: 16, bottom: 28, left: 44 }.
    expect(container.querySelector('[data-testid="probe"]')).toHaveAttribute(
      "width",
      "240" // 300 - 44 - 16
    );
  });

  // D3: chart paint is inline SVG fill/stroke set from JS, which a
  // forced-colors context does not override the way it does CSS -- the
  // root svg must opt out of the browser's own UA-level override so a
  // chart's useForcedColors() response (system colors + textures) isn't
  // fought or masked by it.
  it("opts the root svg out of the browser's forced-colors override", () => {
    const { container } = render(
      <ChartThemeProvider>
        <ChartFrame width={300} height={200}>
          {() => <rect />}
        </ChartFrame>
      </ChartThemeProvider>
    );
    const svg = container.querySelector("svg");
    expect(svg?.style.forcedColorAdjust).toBe("none");
  });
});
