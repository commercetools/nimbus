import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { NowLine } from "./now-line";
import { LineChart, type Series } from "../index";
import type { BaseStory } from "../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const fixture: Series[] = [
  {
    id: "actual",
    label: "Actual",
    data: [
      { x: new Date("2026-04-01"), y: 10 },
      { x: new Date("2026-04-08"), y: 14 },
    ],
  },
  {
    id: "forecast",
    label: "Forecast",
    data: [
      { x: new Date("2026-04-08"), y: 14 },
      { x: new Date("2026-04-15"), y: 18 },
      { x: new Date("2026-04-22"), y: 22 },
    ],
  },
];

const meta: Meta = {
  title: "Overlays/NowLine",
  parameters: { layout: "fullscreen" },
};
export default meta;

/**
 * `NowLine` composes as a `children` overlay marking the boundary between
 * actuals and forecast on a timeline -- here a `LineChart` where "Actual"
 * ends and "Forecast" begins on 2026-04-08.
 */
export const OnLineChart: BaseStory = {
  render: () => (
    <LineChart
      width={480}
      height={280}
      series={fixture}
      ariaLabel="Actual vs. forecast over April, with a now-line at the handoff"
    >
      <NowLine at={new Date("2026-04-08")} />
    </LineChart>
  ),
  play: async ({ canvasElement }) => {
    // The one solid (no dasharray), full-height vertical rule.
    const solidVertical = Array.from(
      canvasElement.querySelectorAll<SVGLineElement>("line")
    ).filter(
      (l) =>
        l.getAttribute("y1") === "0" &&
        !l.hasAttribute("stroke-dasharray") &&
        l.getAttribute("x1") === l.getAttribute("x2")
    );
    expect(solidVertical.length).toBe(1);
    expect(canvasElement.textContent).toContain("Now");
  },
};

/** A custom label reads correctly too -- not hardcoded to "Now" in the DOM. */
export const CustomLabel: BaseStory = {
  render: () => (
    <LineChart
      width={480}
      height={280}
      series={fixture}
      ariaLabel="Actual vs. forecast, with a custom cutover label"
    >
      <NowLine at={new Date("2026-04-08")} label="Cutover" />
    </LineChart>
  ),
  play: async ({ canvasElement }) => {
    expect(canvasElement.textContent).toContain("Cutover");
    expect(canvasElement.textContent).not.toContain("Now");
  },
};
