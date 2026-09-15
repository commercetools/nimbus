import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { RadarChart, ResponsiveContainer } from "../../";
import type { RadarSeries } from "./radar-chart";
import type { BaseStory } from "../../stories/base-story";

const axes = ["Speed", "Reliability", "Comfort", "Efficiency", "Safety"];

const data = [
  { id: "model-a", label: "Model A", values: [8, 6, 7, 9, 8] },
  { id: "model-b", label: "Model B", values: [6, 9, 8, 5, 7] },
];

const meta: Meta = {
  title: "Charts/RadarChart",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <RadarChart width={width} height={height} axes={axes} data={data} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * BC-2/BC-3 (`docs/bug-classes.md`): the radial scale is a magnitude
 * (distance-from-center) encoding with no honest way to place a negative
 * value. `RadarChart` clamps every value to 0 at the point it enters the
 * radial scale/mark math (and warns once via `devWarn`), so a negative axis
 * draws its vertex at the chart's center instead of extrapolating past it or
 * landing on some other arbitrary point.
 */
const negativeAxes = ["A", "B", "C", "D"];
const negativeFixture: RadarSeries[] = [
  { id: "s1", label: "Series 1", values: [5, -3, 8, 2] },
];

export const EdgeCaseNegativeValues: BaseStory = {
  render: () => (
    <RadarChart
      width={360}
      height={360}
      axes={negativeAxes}
      data={negativeFixture}
      ariaLabel="Radar chart with one negative axis value"
    />
  ),
  play: async ({ canvasElement }) => {
    // Grid rings are `fill="none"`; only the per-vertex point marks carry a
    // real fill, so filtering on that isolates the polygon's own vertices.
    const points = Array.from(
      canvasElement.querySelectorAll<SVGCircleElement>("circle")
    ).filter((c) => c.getAttribute("fill") !== "none");
    expect(points).toHaveLength(negativeFixture[0].values.length);

    // Axis "B" (index 1) is negative and has no honest placement on a
    // magnitude-only scale, so it's clamped to 0 -- drawn at the chart
    // center, i.e. local (0, 0) inside the centered <Group>.
    const negativeVertex = points[1];
    expect(Math.abs(Number(negativeVertex.getAttribute("cx")))).toBeLessThan(
      0.5
    );
    expect(Math.abs(Number(negativeVertex.getAttribute("cy")))).toBeLessThan(
      0.5
    );

    // Every other vertex is a genuine positive value and sits away from
    // the center.
    points.forEach((p, i) => {
      if (i === 1) return;
      const cx = Number(p.getAttribute("cx"));
      const cy = Number(p.getAttribute("cy"));
      expect(Math.hypot(cx, cy)).toBeGreaterThan(1);
    });
  },
};
