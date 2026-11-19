import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@commercetools/nimbus";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  DarkMode,
  findSvg,
  legendRed,
  tooltipText,
  xAxisLabels,
} from "../chart/chart.test-utils";
import { BarChart } from "./bar-chart";
import type { BarChartProps } from "./bar-chart.types";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
];

const config = {
  desktop: { label: "Desktop", palette: "ctviolet" },
  mobile: { label: "Mobile", palette: "orange" },
} as const;

const SampleChart = (props: Partial<BarChartProps>) => (
  <Box width="600px">
    <BarChart
      data={data}
      config={config}
      xAxisKey="month"
      series={["desktop", "mobile"]}
      aria-label="Visitors per month"
      isAnimationActive={false}
      data-testid="chart"
      {...props}
    />
  </Box>
);

// VRT: the chart paints bars with a 2 px stroke in the bg color, the grid, tick
// text, the legend and the tooltip (the shared parts are baselined in
// chart.stories.tsx). Snapshotted: Base (grouped bars, grid, ticks, two-series
// legend), Stacked (stackId layout) and Dark (colors from variables). Empty is
// snapshotted once, in chart.stories.tsx, because it is shared. Loading is a
// Skeleton, covered by its own stories. Legend rules, tooltip and keyboard
// behavior are DOM assertions, not pixels.
const meta: Meta<typeof SampleChart> = {
  title: "Components/BarChart",
  component: SampleChart,
};

export default meta;

type Story = StoryObj<typeof SampleChart>;

/** Bars of one series, in x order */
const barsOf = (root: HTMLElement, seriesIndex: number) =>
  Array.from(
    root
      .querySelectorAll(".recharts-bar")
      [seriesIndex].querySelectorAll(".recharts-bar-rectangle")
  );

/** One bar per data row and series, in the config colors, with a grid */
export const Base: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart />,
  play: async ({ canvasElement, step }) => {
    await findSvg(canvasElement);

    await step("Draws one bar group per series", async () => {
      await expect(
        canvasElement.querySelectorAll(".recharts-bar")
      ).toHaveLength(2);
      await expect(barsOf(canvasElement, 0)).toHaveLength(data.length);
      await expect(barsOf(canvasElement, 1)).toHaveLength(data.length);
    });

    await step("Bars use the palette CSS variables", async () => {
      const first = barsOf(canvasElement, 0)[0].querySelector("path")!;
      const second = barsOf(canvasElement, 1)[0].querySelector("path")!;
      await expect(first).toHaveAttribute(
        "fill",
        "var(--nimbus-colors-ctviolet-9)"
      );
      await expect(second).toHaveAttribute(
        "fill",
        "var(--nimbus-colors-orange-9)"
      );
    });

    await step("Shows horizontal grid lines only", async () => {
      await expect(
        canvasElement.querySelectorAll(
          ".recharts-cartesian-grid-horizontal line"
        ).length
      ).toBeGreaterThan(0);
      await expect(
        canvasElement.querySelector(".recharts-cartesian-grid-vertical line")
      ).toBeNull();
    });

    await step("Has an x axis and no y axis", async () => {
      await expect(
        canvasElement.querySelector(".recharts-xAxis")
      ).not.toBeNull();
      await expect(canvasElement.querySelector(".recharts-yAxis")).toBeNull();
    });
  },
};

/** `showGrid={false}` removes the grid lines */
export const NoGrid: Story = {
  render: () => <SampleChart showGrid={false} />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await expect(
      canvasElement.querySelector(".recharts-cartesian-grid")
    ).toBeNull();
  },
};

/** Adjacent bars are separated by a 2 px stroke in the bg color */
export const BarStroke: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    const bars = [...barsOf(canvasElement, 0), ...barsOf(canvasElement, 1)];
    await expect(bars.length).toBe(data.length * 2);
    for (const bar of bars) {
      const path = bar.querySelector("path")!;
      await expect(path).toHaveAttribute("stroke", "var(--nimbus-colors-bg)");
      await expect(path).toHaveAttribute("stroke-width", "2");
      // Proves var() works as an SVG presentation attribute: light-mode bg
      await expect(getComputedStyle(path).stroke).toBe("rgb(255, 255, 255)");
    }
  },
};

/** Side by side by default: the bars of two series sit at different x positions */
export const Grouped: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    const a = barsOf(canvasElement, 0)[0].getBoundingClientRect();
    const b = barsOf(canvasElement, 1)[0].getBoundingClientRect();
    await expect(Math.abs(a.left - b.left)).toBeGreaterThan(a.width / 2);
  },
};

/** `stacked` puts the series on top of each other at the same x position */
export const Stacked: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart stacked />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    const a = barsOf(canvasElement, 0)[0].getBoundingClientRect();
    const b = barsOf(canvasElement, 1)[0].getBoundingClientRect();
    await expect(Math.abs(a.left - b.left)).toBeLessThan(1);
    // The second series starts where the first one ends
    await expect(Math.abs(b.bottom - a.top)).toBeLessThan(3);
  },
};

/** Series that are not in the config are skipped */
export const UnknownSeriesSkipped: Story = {
  render: () => <SampleChart series={["desktop", "tablet"]} />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await expect(canvasElement.querySelectorAll(".recharts-bar")).toHaveLength(
      1
    );
  },
};

/** Two series: the legend lists each series with its label and color */
export const LegendForTwoSeries: Story = {
  render: () => <SampleChart showLegend={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = await canvas.findAllByRole("listitem");
    await expect(items).toHaveLength(2);
    await expect(items[0]).toHaveTextContent("Desktop");
    await expect(items[1]).toHaveTextContent("Mobile");
    const swatch = canvasElement.querySelector<HTMLElement>(
      ".nimbus-chart__legendSwatch"
    )!;
    await expect(swatch.style.color).toBe("var(--nimbus-colors-ctviolet-9)");
  },
};

/** One series: no legend, unless `showLegend` is set */
export const SingleSeries: Story = {
  render: () => <SampleChart series={["desktop"]} />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await expect(canvasElement.querySelector("ul")).toBeNull();
  },
};

export const SingleSeriesWithLegend: Story = {
  render: () => <SampleChart series={["desktop"]} showLegend />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByRole("listitem")).toHaveLength(1);
  },
};

/** The svg keeps the Recharts role and tab stop, and carries the aria-label */
export const Accessibility: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    const svg = await findSvg(canvasElement);
    await expect(svg).toHaveAttribute("role", "application");
    await expect(svg).toHaveAttribute("tabindex", "0");
    await expect(svg).toHaveAttribute("aria-label", "Visitors per month");
  },
};

/** Tab reaches the chart and the tooltip shows the first data point */
export const TabFocus: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    const svg = await findSvg(canvasElement);
    await userEvent.tab();
    await expect(svg).toHaveFocus();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Jan")
    );
  },
};

/** The tooltip is a live region with label, swatch and value per series */
export const TooltipContent: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    const tooltip = await waitFor(() => {
      const el = tooltipText(canvasElement);
      if (!el) throw new Error("tooltip not shown yet");
      return el as HTMLElement;
    });
    await expect(tooltip).toHaveAttribute("role", "status");
    await expect(tooltip).toHaveTextContent("Jan");
    await expect(tooltip).toHaveTextContent("Desktop");
    await expect(tooltip).toHaveTextContent("186");
    await expect(tooltip).toHaveTextContent("Mobile");
    await expect(tooltip).toHaveTextContent("80");
    const swatch = tooltip.querySelector<HTMLElement>(
      ".nimbus-chart__legendSwatch"
    )!;
    await expect(swatch.style.color).toBe("var(--nimbus-colors-ctviolet-9)");
  },
};

/** ArrowRight and ArrowLeft move the active point and the tooltip text */
export const KeyboardNavigation: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Jan")
    );
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Feb")
    );
    await expect(tooltipText(canvasElement)).toHaveTextContent("305");
    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Jan")
    );
  },
};

/** `showTooltip={false}` renders no tooltip */
export const TooltipOff: Story = {
  render: () => <SampleChart showTooltip={false} />,
  play: async ({ canvasElement }) => {
    const svg = await findSvg(canvasElement);
    await userEvent.tab();
    // Positive control: the chart has focus, so a tooltip would be shown now
    await expect(svg).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    // Wait a short fixed time so a wrongly rendered tooltip would have
    // appeared. The on-case is covered by the TooltipContent story.
    await new Promise((r) => setTimeout(r, 300));
    await expect(tooltipText(canvasElement)).toBeNull();
  },
};

/** Enter hides the tooltip and shows it again */
export const EnterTogglesTooltip: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    await waitFor(() => expect(tooltipText(canvasElement)).not.toBeNull());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(tooltipText(canvasElement)).toBeNull());
    await userEvent.keyboard("{Enter}");
    await waitFor(() => expect(tooltipText(canvasElement)).not.toBeNull());
  },
};

/** `isLoading` shows the skeleton instead of the chart */
export const Loading: Story = {
  render: () => <SampleChart isLoading />,
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector<HTMLElement>(
      "[data-testid='chart']"
    )!;
    await expect(root).toHaveAttribute("aria-busy", "true");
    await expect(root.querySelector("svg.recharts-surface")).toBeNull();
    await expect(root.querySelector(".nimbus-skeleton")).not.toBeNull();
  },
};

/** Empty data shows the empty state (its pixels are snapshotted in chart.stories.tsx) */
export const Empty: Story = {
  render: () => <SampleChart data={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByRole("status")).toHaveTextContent(
      "No data to display"
    );
    await expect(
      canvasElement.querySelector("svg.recharts-surface")
    ).toBeNull();
  },
};

/** Light mode: the legend text is a dark gray */
export const Light: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await canvas.findAllByRole("listitem");
    await expect(legendRed(canvasElement)).toBeLessThan(128);
  },
};

/** Dark mode: colors come from variables that switch with the color mode */
export const Dark: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <DarkMode>
      <SampleChart />
    </DarkMode>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByRole("listitem")).toHaveLength(2);
    await waitFor(() => expect(legendRed(canvasElement)).toBeGreaterThan(128));
  },
};

const longLabelData = ["September", "October", "November", "December"].map(
  (month, index) => ({
    month,
    desktop: 100 + index * 40,
    mobile: 80 + index * 10,
  })
);

/** Long first and last x labels are drawn in full, inside the chart */
export const LongXLabelsVisible: Story = {
  render: () => <SampleChart data={longLabelData} />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await waitFor(() => {
      expect(xAxisLabels(canvasElement).labels.map((l) => l.text)).toEqual([
        "September",
        "October",
        "November",
        "December",
      ]);
    });
    const { svgLeft, svgRight, labels } = xAxisLabels(canvasElement);
    for (const label of labels) {
      await expect(label.left).toBeGreaterThanOrEqual(svgLeft);
      await expect(label.right).toBeLessThanOrEqual(svgRight);
    }
  },
};

const dailyData = Array.from({ length: 30 }, (_, index) => ({
  month: `2024-06-${String(index + 1).padStart(2, "0")}`,
  desktop: 100 + ((index * 37) % 90),
  mobile: 60 + ((index * 23) % 70),
}));

/** With many labels the first and last stay inside the chart, and none overlap */
export const ManyXLabels: Story = {
  render: () => <SampleChart data={dailyData} />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await waitFor(() =>
      expect(xAxisLabels(canvasElement).labels.length).toBeGreaterThan(2)
    );
    const { svgLeft, svgRight, labels } = xAxisLabels(canvasElement);
    await expect(labels[0].text).toBe("2024-06-01");
    await expect(labels[labels.length - 1].text).toBe("2024-06-30");
    await expect(labels[0].left).toBeGreaterThanOrEqual(svgLeft);
    await expect(labels[labels.length - 1].right).toBeLessThanOrEqual(svgRight);
    // Labels are in x order, so each one must start after the previous ends
    for (let i = 1; i < labels.length; i++) {
      await expect(labels[i].left).toBeGreaterThanOrEqual(labels[i - 1].right);
    }
  },
};
