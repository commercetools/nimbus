import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { EventMarkers } from "./event-markers";
import { LineChart, type Series } from "../index";
import type { BaseStory } from "../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const fixture: Series[] = [
  {
    id: "s1",
    label: "Error rate",
    data: [
      { x: new Date("2026-03-01"), y: 2 },
      { x: new Date("2026-03-08"), y: 3 },
      { x: new Date("2026-03-15"), y: 9 },
      { x: new Date("2026-03-22"), y: 4 },
      { x: new Date("2026-03-29"), y: 2 },
    ],
  },
];

const meta: Meta = {
  title: "Overlays/EventMarkers",
  parameters: { layout: "fullscreen" },
};
export default meta;

/**
 * `EventMarkers` composes as a `children` overlay -- here a `LineChart` of an
 * error rate, flagging a deploy and an incident. One dashed rule per event;
 * only the labeled one draws a text flag.
 */
export const OnLineChart: BaseStory = {
  render: () => (
    <LineChart
      width={480}
      height={280}
      series={fixture}
      ariaLabel="Error rate over March, with deploy and incident markers"
    >
      <EventMarkers
        events={[
          { x: new Date("2026-03-08"), label: "Deploy" },
          { x: new Date("2026-03-15"), label: "Incident" },
        ]}
      />
    </LineChart>
  ),
  play: async ({ canvasElement }) => {
    const dashed = Array.from(
      canvasElement.querySelectorAll<SVGLineElement>("line")
    ).filter((l) => l.getAttribute("stroke-dasharray") === "3 3");
    expect(dashed.length).toBe(2);
    // Both events are vertical (y1=0, y2=innerHeight) and at distinct x.
    for (const l of dashed) {
      expect(l.getAttribute("y1")).toBe("0");
      expect(Number(l.getAttribute("y2"))).toBeGreaterThan(0);
    }
    expect(dashed[0].getAttribute("x1")).not.toBe(dashed[1].getAttribute("x1"));
    expect(canvasElement.textContent).toContain("Deploy");
    expect(canvasElement.textContent).toContain("Incident");
  },
};
