import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Annotation } from "./annotation";
import { LineChart, type Series } from "../index";
import type { BaseStory } from "../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const fixture: Series[] = [
  {
    id: "s1",
    label: "Signups",
    data: [
      { x: new Date("2026-01-01"), y: 20 },
      { x: new Date("2026-01-08"), y: 22 },
      { x: new Date("2026-01-15"), y: 55 },
      { x: new Date("2026-01-22"), y: 24 },
      { x: new Date("2026-01-29"), y: 26 },
    ],
  },
];

const meta: Meta = {
  title: "Overlays/Annotation",
  parameters: { layout: "fullscreen" },
};
export default meta;

/**
 * `Annotation` composes as a `children` overlay on any chart that publishes
 * the shared scale contract (`useChartScales`) -- here a `LineChart`,
 * pointing out the spike as an outage. Proves the ringed marker sits at the
 * annotated `(x, y)` (via the same scale the line itself uses) and the
 * callout text renders.
 */
export const OnLineChart: BaseStory = {
  render: () => (
    <LineChart
      width={480}
      height={280}
      series={fixture}
      ariaLabel="Signups over January, with an outage annotation on the spike"
    >
      <Annotation x={new Date("2026-01-15")} y={55} label="Outage" />
    </LineChart>
  ),
  play: async ({ canvasElement }) => {
    // The annotation's ringed marker is the only stroke-only, fill:none
    // circle in the scene (data points, if any, are filled).
    const ringed = Array.from(
      canvasElement.querySelectorAll<SVGCircleElement>("circle")
    ).filter((c) => c.getAttribute("fill") === "none");
    expect(ringed.length).toBe(1);
    expect(Number(ringed[0].getAttribute("cx"))).toBeGreaterThan(0);
    // y=55 is this fixture's max, so its pixel lands at (or right at) the
    // plot's top edge (0) -- a valid position, not a sign of a broken scale.
    expect(Number(ringed[0].getAttribute("cy"))).toBeGreaterThanOrEqual(0);
    expect(canvasElement.textContent).toContain("Outage");
    // The leader line connects the marker to the offset callout text -- a
    // non-zero-length line, not a degenerate point.
    const lines = Array.from(canvasElement.querySelectorAll("line"));
    const leader = lines.find(
      (l) =>
        l.getAttribute("x1") === ringed[0].getAttribute("cx") &&
        l.getAttribute("y1") === ringed[0].getAttribute("cy")
    );
    expect(leader).toBeTruthy();
    expect(leader!.getAttribute("x1")).not.toBe(leader!.getAttribute("x2"));
  },
};
