import type { Meta } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { ErrorBars } from "./error-bars";
import { LineChart, type Series } from "../index";
import type { BaseStory } from "../stories/base-story";

// .storybook/preview.tsx already wraps every story in ChartThemeProvider
// (following the dark-mode toggle) and enables addon-a11y in `test: "error"`
// mode, so neither is repeated per story here.
const fixture: Series[] = [
  {
    id: "mean",
    label: "Mean response time (ms)",
    data: [
      { x: new Date("2026-05-01"), y: 120 },
      { x: new Date("2026-05-08"), y: 135 },
      { x: new Date("2026-05-15"), y: 150 },
      { x: new Date("2026-05-22"), y: 128 },
    ],
  },
];

const meta: Meta = {
  title: "Overlays/ErrorBars",
  parameters: { layout: "fullscreen" },
};
export default meta;

/**
 * `ErrorBars` composes as a `children` overlay -- here a `LineChart` of a
 * weekly mean, with a raw-samples point at 2026-05-15 (`#17-rest`): the
 * whisker is derived as mean ± 95% CI, not supplied pre-computed.
 */
export const RawSamplesOnLineChart: BaseStory = {
  render: () => (
    <LineChart
      width={480}
      height={280}
      series={fixture}
      ariaLabel="Mean response time over May, with a confidence interval on one week"
    >
      <ErrorBars
        points={[
          {
            x: new Date("2026-05-15"),
            samples: [140, 148, 152, 156, 154],
          },
        ]}
      />
    </LineChart>
  ),
  play: async ({ canvasElement }) => {
    // whisker + 2 caps for the one point.
    const lines = Array.from(
      canvasElement.querySelectorAll<SVGLineElement>("line")
    );
    const whiskers = lines.filter(
      (l) => l.getAttribute("x1") === l.getAttribute("x2")
    );
    expect(whiskers.length).toBeGreaterThanOrEqual(1);
    for (const l of whiskers) {
      const y1 = Number(l.getAttribute("y1"));
      const y2 = Number(l.getAttribute("y2"));
      expect(Number.isNaN(y1)).toBe(false);
      expect(Number.isNaN(y2)).toBe(false);
      expect(y1).not.toBe(y2); // a real interval, not a collapsed point
    }
  },
};
