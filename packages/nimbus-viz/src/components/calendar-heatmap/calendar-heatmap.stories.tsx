import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { CalendarHeatmap, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const data = [
  { date: "2026-01-05", value: 3 },
  { date: "2026-01-06", value: 5 },
  { date: "2026-01-07", value: 0 },
  { date: "2026-01-08", value: 8 },
  { date: "2026-01-09", value: 2 },
  { date: "2026-01-12", value: 6 },
  { date: "2026-01-13", value: 9 },
  { date: "2026-01-14", value: 4 },
  { date: "2026-01-15", value: 7 },
  { date: "2026-01-16", value: 1 },
];

const meta: Meta = {
  title: "Charts/CalendarHeatmap",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => (
        <CalendarHeatmap width={width} height={height} data={data} />
      )}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * By default the ramp spans the actual data range, not `[0, max]` — so a
 * narrow-range dataset (values clustered close together) still spreads
 * across the full ramp. `domain` overrides that: pinning the same data to a
 * wider fixed range washes it back out, proving the prop actually changes
 * the color mapping (not just accepted and ignored).
 */
const narrowRangeData = [
  { date: "2026-01-05", value: 38 },
  { date: "2026-01-06", value: 40 },
  { date: "2026-01-07", value: 45 },
];

export const CustomDomain: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <CalendarHeatmap
        width={220}
        height={120}
        data={narrowRangeData}
        ariaLabel="Calendar heatmap with default (auto) domain"
      />
      <CalendarHeatmap
        width={220}
        height={120}
        data={narrowRangeData}
        domain={[0, 50]}
        ariaLabel="Calendar heatmap with fixed [0, 50] domain"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll<SVGSVGElement>("svg");
    expect(svgs.length).toBe(2);
    // Skip empty-day placeholder rects and grab the first real data cell's
    // fill (the calendar grid may lead with gap days before the first
    // provided date).
    const dataCellFill = (svg: SVGSVGElement) =>
      Array.from(svg.querySelectorAll<SVGRectElement>("rect"))
        .find((r) => !r.hasAttribute("fill-opacity"))
        ?.getAttribute("fill");

    const autoFill = dataCellFill(svgs[0]);
    const pinnedFill = dataCellFill(svgs[1]);
    expect(autoFill).toBeTruthy();
    expect(pinnedFill).toBeTruthy();
    expect(autoFill).not.toBe(pinnedFill);
  },
};
