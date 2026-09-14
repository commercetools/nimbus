import type { Meta } from "@storybook/react-vite";
import { userEvent, within, expect, waitFor, fn } from "storybook/test";
import { BubbleChart, ResponsiveContainer } from "../../";
import type { BubblePoint } from "./bubble-chart";
import type { BaseStory } from "../../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const points: BubblePoint[] = [
  { x: 10, y: 20, size: 30, group: "Sedan", label: "Alpha" },
  { x: 15, y: 35, size: 60, group: "Sedan", label: "Beta" },
  { x: 22, y: 18, size: 45, group: "SUV", label: "Gamma" },
  { x: 28, y: 42, size: 80, group: "SUV", label: "Delta" },
  { x: 35, y: 25, size: 20, group: "Sedan", label: "Epsilon" },
  { x: 40, y: 50, size: 55, group: "SUV", label: "Zeta" },
];

const meta: Meta = {
  title: "Charts/BubbleChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <BubbleChart width={width} height={height} points={points} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * Proves the two accessibility features `bubble-chart.mdx` claims:
 * `role="img"` + a real `aria-label`, and the keyboard-reachable data-table
 * fallback (WCAG 1.1.1) that `ChartContainer` renders whenever `table` is
 * wired (always, for `BubbleChart`).
 */
export const Accessibility: BaseStory = {
  render: () => (
    <BubbleChart
      width={480}
      height={320}
      points={points}
      ariaLabel="Bubble chart of two measures sized by a third, six points"
    />
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("SVG carries an accessible label", async () => {
      const svg = canvasElement.querySelector("svg");
      expect(svg).toHaveAttribute("role", "img");
      expect(svg).toHaveAttribute("aria-label");
      expect(svg?.getAttribute("aria-label")).not.toBe("");
    });

    await step("Data table is reachable by keyboard", async () => {
      await userEvent.tab();
      const toggle = canvas.getByRole("button", {
        name: /view data as table/i,
      });
      expect(toggle).toHaveFocus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => {
        expect(
          canvas.getByRole("region", { name: /data table/i })
        ).toBeInTheDocument();
      });
    });
  },
};

/**
 * `onDatumClick`/`onDatumHover` fire `{ datum, index, seriesId }` — the
 * whole `BubblePoint`, its array index, and `group` as `seriesId`.
 */
const handleDatumClick = fn();
const handleDatumHover = fn();

export const Interaction: BaseStory = {
  render: () => (
    <BubbleChart
      width={480}
      height={320}
      points={points}
      onDatumClick={handleDatumClick}
      onDatumHover={handleDatumHover}
    />
  ),
  play: async ({ canvasElement, step }) => {
    // Bubbles are drawn largest-first, so the *last* <circle> in document
    // order is the smallest bubble ("Epsilon", size 20) -- but the first
    // point in `points` ("Alpha") is not guaranteed to be first in the DOM.
    // Query by the real datum instead of assuming document order.
    const circles = () =>
      Array.from(canvasElement.querySelectorAll<SVGCircleElement>("circle"));

    await step(
      "Hovering a bubble reports its point, index, and group",
      async () => {
        await userEvent.hover(circles()[0]);
        await waitFor(() => expect(handleDatumHover).toHaveBeenCalled());
        const call = handleDatumHover.mock.calls.at(-1)![0];
        expect(points).toContainEqual(call?.datum);
        expect(call?.seriesId).toBe(call?.datum?.group);
      }
    );

    await step(
      "Clicking a bubble fires onDatumClick with a matching payload",
      async () => {
        await userEvent.click(circles()[0]);
        await waitFor(() => expect(handleDatumClick).toHaveBeenCalled());
        const call = handleDatumClick.mock.calls.at(-1)![0];
        expect(points).toContainEqual(call?.datum);
      }
    );
  },
};

/** `bubble-chart.mdx` "API reference": renders `null` for empty `points`. */
export const EdgeCaseEmpty: BaseStory = {
  render: () => <BubbleChart width={200} height={200} points={[]} />,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("svg")).not.toBeInTheDocument();
  },
};

/**
 * Found while introspecting this chart: `sizeScale`'s degenerate `[0, 0]`
 * domain (every point's `size` is `0` — a valid, in-contract input, not a
 * violation of "non-negative") used to map every input to `scaleSqrt`'s
 * *range midpoint* rather than `R_MIN` — every bubble rendered at a fixed
 * mid-radius, with no legend (which already correctly collapses to
 * nothing), looking like real varying magnitude when there was none. Fixed
 * with a guard matching the legend's own "nothing to show" behavior.
 */
export const EdgeCaseAllZeroSize: BaseStory = {
  render: () => (
    <BubbleChart
      width={300}
      height={240}
      points={[
        { x: 10, y: 10, size: 0 },
        { x: 20, y: 30, size: 0 },
        { x: 30, y: 15, size: 0 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const circles = canvasElement.querySelectorAll<SVGCircleElement>("circle");
    expect(circles.length).toBe(3);
    for (const c of Array.from(circles)) {
      expect(Number(c.getAttribute("r"))).toBe(4); // R_MIN, not the range midpoint
    }
  },
};

/**
 * Negative `size` is outside the documented, non-negative contract (a
 * magnitude, like `FunnelChart`'s counts, isn't naturally signed) — but the
 * actual failure mode has two regimes, not one. A small-magnitude negative
 * value still extrapolates to a small *positive* radius (a quiet,
 * plausible-looking mis-render); only a large enough negative value crosses
 * zero into an invisible (r<0) bubble. Both are asserted here rather than
 * just the loud case, since the quiet one is the one a story could
 * otherwise miss entirely.
 */
export const EdgeCaseNegativeSize: BaseStory = {
  render: () => (
    <BubbleChart
      width={300}
      height={240}
      points={[
        { x: 10, y: 10, size: 900 }, // sets maxSize; a real, large bubble
        { x: 20, y: 30, size: -1 }, // small-magnitude: quiet mis-render
        { x: 30, y: 15, size: -100 }, // large-magnitude: loud (invisible)
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    // All 3 points still get a <circle> in the DOM -- an invalid (negative)
    // `r` doesn't remove the element, it just leaves it unpainted. The size
    // legend also renders reference <circle>s (fill="none"); bubbles have a
    // real fill, so filter those out. Bubbles draw largest-first (so
    // smaller ones stay hoverable on top), and descending-by-value sorts -1
    // above -100, giving DOM order [900, -1, -100].
    const circles = Array.from(
      canvasElement.querySelectorAll<SVGCircleElement>("circle")
    ).filter((c) => c.getAttribute("fill") !== "none");
    expect(circles.length).toBe(3);
    const [large, smallNegative, largeNegative] = circles.map((c) =>
      Number(c.getAttribute("r"))
    );
    expect(large).toBe(28); // R_MAX -- the real, largest bubble
    expect(smallNegative).toBeGreaterThan(0); // quiet: still a real, visible radius
    expect(smallNegative).toBeLessThan(28);
    expect(largeNegative).toBeLessThan(0); // loud: crosses zero, unpaintable
  },
};

export const Responsive: BaseStory = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <ResponsiveContainer height={320}>
        {(width, height) => (
          <BubbleChart width={width} height={height} points={points} />
        )}
      </ResponsiveContainer>
    </div>
  ),
};
