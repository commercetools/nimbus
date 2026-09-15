import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { ChartScaleProvider } from "../chart/scale-context";
import type { ChartScales } from "../chart/scale-context";
import { ChartThemeProvider } from "../theme";
import { ErrorBars } from "./error-bars";

// The identity yScale makes every assertion below an exact-value check: the
// rendered y coordinate IS the data value, no scale math to replicate.
const scales: ChartScales = {
  yScale: (v) => v,
  xScale: (v) => (typeof v === "number" ? v : 50),
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

describe("ErrorBars", () => {
  it("draws a whisker + two caps per precomputed point", () => {
    const { container } = wrap(
      <ErrorBars points={[{ x: 10, low: 5, high: 15 }]} />
    );
    const lines = container.querySelectorAll("line");
    expect(lines).toHaveLength(3); // whisker + high cap + low cap
    const whisker = lines[0];
    expect(Number(whisker.getAttribute("y1"))).toBe(5);
    expect(Number(whisker.getAttribute("y2"))).toBe(15);
  });

  // #17-rest: raw samples [10, 12, 14, 16, 18] -- mean 14, sample stddev
  // sqrt(10), SE = sqrt(10)/sqrt(5) = sqrt(2), half-width at the default 95%
  // confidence = 1.96 * sqrt(2) ≈ 2.7718586. Hand-computed here (not reusing
  // the module's own zForConfidence) so a bug in the overlay's own wiring of
  // it would still be caught.
  it("derives mean ± 95% CI from raw samples", () => {
    const samples = [10, 12, 14, 16, 18];
    const { container } = wrap(<ErrorBars points={[{ x: 10, samples }]} />);
    const lines = container.querySelectorAll("line");
    const whisker = lines[0];
    const expectedHalf = 1.96 * Math.sqrt(2);
    expect(Number(whisker.getAttribute("y1"))).toBeCloseTo(
      14 - expectedHalf,
      6
    ); // low
    expect(Number(whisker.getAttribute("y2"))).toBeCloseTo(
      14 + expectedHalf,
      6
    ); // high
  });

  it("respects a custom confidence level", () => {
    const samples = [10, 12, 14, 16, 18];
    const { container } = wrap(
      <ErrorBars points={[{ x: 10, samples, confidence: 0.99 }]} />
    );
    const whisker = container.querySelectorAll("line")[0];
    const expectedHalf = 2.576 * Math.sqrt(2);
    expect(Number(whisker.getAttribute("y1"))).toBeCloseTo(
      14 - expectedHalf,
      6
    );
    expect(Number(whisker.getAttribute("y2"))).toBeCloseTo(
      14 + expectedHalf,
      6
    );
  });

  it("collapses to the mean for a single sample (no spread)", () => {
    const { container } = wrap(
      <ErrorBars points={[{ x: 10, samples: [42] }]} />
    );
    const whisker = container.querySelectorAll("line")[0];
    expect(Number(whisker.getAttribute("y1"))).toBe(42);
    expect(Number(whisker.getAttribute("y2"))).toBe(42);
  });

  it("mixes precomputed and raw-samples points in one overlay", () => {
    const { container } = wrap(
      <ErrorBars
        points={[
          { x: 5, low: 1, high: 2 },
          { x: 10, samples: [10, 12, 14, 16, 18] },
        ]}
      />
    );
    expect(container.querySelectorAll("line")).toHaveLength(6); // 2 points × 3 lines
  });
});
