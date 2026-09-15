import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@testing-library/react";
import { ChartThemeProvider } from "../theme";
import { DonutChart } from "../components/donut-chart/donut-chart";
import { StackedBarChart } from "../components/stacked-bar-chart/stacked-bar-chart";
import { StackedAreaChart } from "../components/stacked-area-chart/stacked-area-chart";

/**
 * `D3`: a chart-level integration check that `useForcedColors()` actually
 * changes what a chart draws — not just that the hook itself reports the
 * right boolean (`use-forced-colors.spec.ts` already covers that in
 * isolation). Conventionally chart *components* get a `.stories.tsx`, not a
 * `.spec.tsx` (`writing-chart-stories`); this lives under `chart/` instead,
 * matching `registry-invariants.spec.tsx`'s precedent for a cross-cutting
 * concern that happens to render real chart components. It has to be a
 * jsdom spec, not a Storybook story: simulating `forced-colors: active`
 * needs `vi.stubGlobal("matchMedia", …)`, and `storybook/test` doesn't
 * re-export `vi`.
 */
function stubForcedColors() {
  vi.stubGlobal("matchMedia", () => ({
    matches: true,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("forced-colors mode (D3)", () => {
  it("DonutChart switches to CanvasText + pattern fills without an explicit texture prop", () => {
    stubForcedColors();
    const { container } = render(
      <ChartThemeProvider>
        <DonutChart
          width={200}
          height={200}
          data={[
            { category: "A", value: 5 },
            { category: "B", value: 3 },
          ]}
        />
      </ChartThemeProvider>
    );
    const patterns = container.querySelectorAll("defs > pattern");
    expect(patterns.length).toBe(2);
    const slices = Array.from(container.querySelectorAll("path")).filter((p) =>
      p.getAttribute("fill")?.startsWith("url(#")
    );
    expect(slices.length).toBe(2);
  });

  it("StackedBarChart switches to CanvasText + pattern fills without an explicit texture prop", () => {
    stubForcedColors();
    const { container } = render(
      <ChartThemeProvider>
        <StackedBarChart
          width={200}
          height={200}
          data={[
            {
              category: "Q1",
              segments: [
                { key: "New", value: 10 },
                { key: "Returning", value: 5 },
              ],
            },
          ]}
        />
      </ChartThemeProvider>
    );
    const patterns = container.querySelectorAll("defs > pattern");
    expect(patterns.length).toBe(2);
    const marks = Array.from(
      container.querySelectorAll("rect, path.visx-bar-rounded")
    ).filter((el) => el.getAttribute("fill")?.startsWith("url(#"));
    expect(marks.length).toBe(2);
  });

  it("StackedAreaChart switches to CanvasText + pattern fills without an explicit texture prop", () => {
    stubForcedColors();
    const { container } = render(
      <ChartThemeProvider>
        <StackedAreaChart
          width={200}
          height={200}
          series={[
            {
              id: "north",
              label: "North",
              data: [
                { x: new Date("2026-01-01"), y: 5 },
                { x: new Date("2026-01-02"), y: 6 },
              ],
            },
            {
              id: "south",
              label: "South",
              data: [
                { x: new Date("2026-01-01"), y: 3 },
                { x: new Date("2026-01-02"), y: 4 },
              ],
            },
          ]}
        />
      </ChartThemeProvider>
    );
    const patterns = container.querySelectorAll("defs > pattern");
    expect(patterns.length).toBe(2);
    const layers = Array.from(container.querySelectorAll("path")).filter((p) =>
      p.getAttribute("fill")?.startsWith("url(#")
    );
    expect(layers.length).toBe(2);
  });

  it("without forced-colors, the same charts draw flat colors (no <defs>/patterns)", () => {
    const { container } = render(
      <ChartThemeProvider>
        <DonutChart
          width={200}
          height={200}
          data={[
            { category: "A", value: 5 },
            { category: "B", value: 3 },
          ]}
        />
      </ChartThemeProvider>
    );
    expect(container.querySelectorAll("defs > pattern")).toHaveLength(0);
    const slices = Array.from(container.querySelectorAll("path"));
    expect(slices.length).toBeGreaterThan(0);
    for (const p of slices) {
      expect(p.getAttribute("fill")).not.toMatch(/^url\(#/);
    }
  });
});
