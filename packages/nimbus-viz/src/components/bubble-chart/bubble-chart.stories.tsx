import type { Meta } from "@storybook/react-vite";
import {
  userEvent,
  fireEvent,
  within,
  expect,
  waitFor,
  fn,
} from "storybook/test";
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

/**
 * Hover/tooltip UX convergence with `bar-chart.tsx`: hovering a bubble
 * outlines that ONE bubble (real `stroke`/`stroke-width`) rather than
 * dimming every other bubble's `fill-opacity` (the old mechanism). Unlike a
 * fixed-radius scatter point, bubbles vary in size — the largest bubble here
 * ("Delta", size 80, radius `R_MAX`) has real room to move the pointer
 * within it, so the tooltip tracks that live position instead of sitting
 * pinned to the bubble's own `(x, y)`.
 */
export const HoverEmphasis: BaseStory = {
  render: () => <BubbleChart width={480} height={320} points={points} />,
  play: async ({ canvasElement }) => {
    // The size legend also renders reference <circle>s (fill="none"); real
    // bubble marks always have a real fill, so filter those out. Bubbles
    // draw largest-first, so markCircles()[0] is "Delta" (size 80, R_MAX).
    const markCircles = () =>
      Array.from(
        canvasElement.querySelectorAll<SVGCircleElement>("circle")
      ).filter((c) => c.getAttribute("fill") !== "none");
    const tooltipGroup = () =>
      canvasElement.querySelector<SVGGElement>('g[pointer-events="none"]');
    const tooltipTransform = () => tooltipGroup()?.getAttribute("transform");

    const largest = markCircles()[0];
    await userEvent.hover(largest);
    await waitFor(() => expect(tooltipGroup()).not.toBeNull());

    // No dimming: every bubble keeps its base fill-opacity -- none is
    // reduced because a sibling is hovered (the old mechanism this
    // replaces).
    for (const c of markCircles()) {
      expect(c).toHaveAttribute("fill-opacity", "0.6");
    }
    // Emphasis instead: only the hovered bubble gets a real outline.
    expect(largest).toHaveAttribute("stroke-width", "1.5");
    expect(markCircles()[1]).toHaveAttribute("stroke-width", "1");

    // Tooltip follows the pointer: two mousemoves at different positions
    // within the SAME (large) bubble move the tooltip to two different
    // positions.
    const rect = largest.getBoundingClientRect();
    fireEvent.mouseMove(largest, {
      clientX: rect.left + rect.width * 0.25,
      clientY: rect.top + rect.height * 0.25,
    });
    const firstTransform = await waitFor(() => {
      const t = tooltipTransform();
      expect(t).not.toBeNull();
      return t;
    });
    fireEvent.mouseMove(largest, {
      clientX: rect.left + rect.width * 0.75,
      clientY: rect.top + rect.height * 0.75,
    });
    await waitFor(() => expect(tooltipTransform()).not.toBe(firstTransform));
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
 * BC-2 (`docs/bug-classes.md`): negative `size` is outside the documented,
 * non-negative contract (a magnitude, like `FunnelChart`'s counts, isn't
 * naturally signed), and extrapolating it through `scaleSqrt` used to have
 * two silent-wrong regimes -- a small-magnitude negative value landed at a
 * small *positive* radius (a quiet, plausible-looking mis-render), while a
 * large enough one crossed zero into an invisible (`r < 0`) bubble. Both are
 * now clamped at the point the radius is computed (`sizeScale(Math.max(0,
 * p.size))`), so every negative size -- regardless of magnitude -- draws at
 * `R_MIN` instead of either extrapolation.
 */
export const EdgeCaseNegativeSize: BaseStory = {
  render: () => (
    <BubbleChart
      width={300}
      height={240}
      points={[
        { x: 10, y: 10, size: 900 }, // sets maxSize; a real, large bubble
        { x: 20, y: 30, size: -1 }, // small-magnitude negative
        { x: 30, y: 15, size: -100 }, // large-magnitude negative
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    // All 3 points get a <circle> in the DOM. The size legend also renders
    // reference <circle>s (fill="none"); bubbles have a real fill, so filter
    // those out.
    const circles = Array.from(
      canvasElement.querySelectorAll<SVGCircleElement>("circle")
    ).filter((c) => c.getAttribute("fill") !== "none");
    expect(circles.length).toBe(3);
    const radii = circles.map((c) => Number(c.getAttribute("r")));
    expect(radii.filter((r) => r === 28)).toHaveLength(1); // R_MAX -- the real, largest bubble
    expect(radii.filter((r) => r === 4)).toHaveLength(2); // R_MIN -- both negatives, same magnitude or not
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

/**
 * `D2/D3-rest`: `texture` distinguishes groups by marker SHAPE (in addition
 * to color) so groups stay distinguishable without color alone. Not a fill
 * *pattern* like `StackedBarChart`'s `Texture` story — a bubble's radius can
 * be as small as `R_MIN` (4px), under one texture tile, where a fill
 * pattern would read as noise rather than a shape. Proven directly: the
 * first group (`Sedan`) stays a `<circle>`, the second (`SUV`) becomes a
 * `<polygon>` (a square) — a shape swap, not just a color change.
 */
export const Texture: BaseStory = {
  render: () => (
    <BubbleChart
      width={360}
      height={280}
      points={points}
      texture
      ariaLabel="Bubble chart with per-group marker shapes"
    />
  ),
  play: async ({ canvasElement }) => {
    const sedanCount = points.filter((p) => p.group === "Sedan").length;
    const suvCount = points.filter((p) => p.group === "SUV").length;
    // The size legend also renders reference <circle>s (fill="none"); real
    // bubble marks always have a real fill, so filter those out.
    const markCircles = Array.from(
      canvasElement.querySelectorAll<SVGCircleElement>("circle")
    ).filter((c) => c.getAttribute("fill") !== "none");
    const polygons = canvasElement.querySelectorAll("polygon");
    expect(markCircles.length).toBe(sedanCount); // first group: unchanged circle
    expect(polygons.length).toBe(suvCount); // second group: shape-encoded
  },
};
