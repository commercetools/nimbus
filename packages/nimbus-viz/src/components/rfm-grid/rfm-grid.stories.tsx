import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { RfmGrid, ResponsiveContainer } from "../../";
import type { BaseStory } from "../../stories/base-story";

const data = [
  { recency: 1, frequency: 1, count: 120 },
  { recency: 1, frequency: 2, count: 80 },
  { recency: 1, frequency: 3, count: 55 },
  { recency: 2, frequency: 1, count: 95 },
  { recency: 2, frequency: 2, count: 60 },
  { recency: 2, frequency: 3, count: 35 },
  { recency: 3, frequency: 1, count: 40 },
  { recency: 3, frequency: 3, count: 25 },
];

const meta: Meta = {
  title: "Charts/RfmGrid",
  render: () => (
    <ResponsiveContainer height={320}>
      {(width, height) => <RfmGrid width={width} height={height} data={data} />}
    </ResponsiveContainer>
  ),
  parameters: { layout: "fullscreen" },
};
export default meta;

export const Base: BaseStory = {};

/**
 * By default the ramp spans the actual data range, not `[0, max]` — so a
 * narrow-range dataset (counts clustered close together) still spreads
 * across the full ramp. `domain` overrides that: pinning the same data to a
 * wider fixed range washes it back out, proving the prop actually changes
 * the color mapping (not just accepted and ignored).
 */
const narrowRangeData = [
  { recency: 1, frequency: 1, count: 40 },
  { recency: 1, frequency: 2, count: 44 },
  { recency: 2, frequency: 1, count: 48 },
];

export const CustomDomain: BaseStory = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      <RfmGrid
        width={220}
        height={200}
        data={narrowRangeData}
        ariaLabel="RFM grid with default (auto) domain"
      />
      <RfmGrid
        width={220}
        height={200}
        data={narrowRangeData}
        domain={[0, 150]}
        ariaLabel="RFM grid with fixed [0, 150] domain"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const svgs = canvasElement.querySelectorAll<SVGSVGElement>("svg");
    expect(svgs.length).toBe(2);
    // Skip empty-segment placeholder rects and grab the first real data
    // cell's fill.
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
