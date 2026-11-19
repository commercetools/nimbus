import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box } from "@commercetools/nimbus";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  DarkMode,
  findSvg,
  legendRed,
  tooltipText,
} from "../chart/chart.test-utils";
import { RadarChart } from "./radar-chart";
import type { RadarChartProps } from "./radar-chart.types";

const data = [
  { skill: "Speed", alpha: 120, beta: 80 },
  { skill: "Power", alpha: 98, beta: 130 },
  { skill: "Range", alpha: 86, beta: 100 },
  { skill: "Focus", alpha: 99, beta: 60 },
  { skill: "Skill", alpha: 85, beta: 110 },
  { skill: "Luck", alpha: 65, beta: 90 },
];

const config = {
  alpha: { label: "Alpha", palette: "ctviolet" },
  beta: { label: "Beta", palette: "orange" },
} as const;

const SampleChart = (props: Partial<RadarChartProps>) => (
  <Box width="600px">
    <RadarChart
      data={data}
      config={config}
      xAxisKey="skill"
      series={["alpha", "beta"]}
      aria-label="Skills by player"
      isAnimationActive={false}
      data-testid="chart"
      {...props}
    />
  </Box>
);

// VRT: the chart paints the polar grid, spoke labels, translucent filled
// polygons with full-color outlines, the legend and the tooltip (the shared
// parts are baselined in chart.stories.tsx). Snapshotted: Base (hexagonal grid,
// two polygons, legend) and Focused (the active spoke and tooltip that Recharts
// paints for a radar). No Dark: series colors are the variables that Dark in
// BarChart and chart.stories.tsx already baseline, and the Dark story here asserts
// them in the DOM. Empty is snapshotted once, in chart.stories.tsx. Loading is a
// Skeleton, covered by its own stories. Not applicable: stacked.
const meta: Meta<typeof SampleChart> = {
  title: "Components/RadarChart",
  component: SampleChart,
};

export default meta;

type Story = StoryObj<typeof SampleChart>;

/** The filled polygons, in series order */
const polygons = (root: HTMLElement) =>
  Array.from(
    root.querySelectorAll<SVGPathElement>(".recharts-radar-polygon path")
  );

/** One polygon per series, translucent fill with a full-color outline */
export const Base: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart />,
  play: async ({ canvasElement, step }) => {
    await findSvg(canvasElement);

    await step("Draws one polygon per series", async () => {
      await expect(polygons(canvasElement)).toHaveLength(2);
    });

    await step("Shows the polar grid and the spoke labels", async () => {
      await expect(
        canvasElement.querySelector(".recharts-polar-grid")
      ).not.toBeNull();
      await expect(
        canvasElement.querySelectorAll(".recharts-polar-angle-axis-tick-value")
      ).toHaveLength(data.length);
    });

    await step("Has no radius axis labels", async () => {
      await expect(
        canvasElement.querySelector(".recharts-polar-radius-axis")
      ).toBeNull();
    });
  },
};

/** The fill is low-opacity, the line on top uses the full series color */
export const FillAndLine: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    const [first, second] = polygons(canvasElement);
    await expect(first).toHaveAttribute(
      "fill",
      "var(--nimbus-colors-ctviolet-9)"
    );
    await expect(first).toHaveAttribute(
      "stroke",
      "var(--nimbus-colors-ctviolet-9)"
    );
    await expect(second).toHaveAttribute(
      "stroke",
      "var(--nimbus-colors-orange-9)"
    );
    await expect(first).toHaveAttribute("stroke-width", "2");
    const opacity = Number(first.getAttribute("fill-opacity"));
    await expect(opacity).toBeGreaterThan(0.1);
    await expect(opacity).toBeLessThan(0.5);
  },
};

/** `showGrid={false}` removes the polar grid */
export const NoGrid: Story = {
  render: () => <SampleChart showGrid={false} />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await expect(
      canvasElement.querySelector(".recharts-polar-grid")
    ).toBeNull();
    await expect(polygons(canvasElement)).toHaveLength(2);
  },
};

/** Series that are not in the config are skipped */
export const UnknownSeriesSkipped: Story = {
  render: () => <SampleChart series={["alpha", "gamma"]} />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await expect(polygons(canvasElement)).toHaveLength(1);
  },
};

/** Two or more series: the legend lists each with its label and color */
export const LegendForSeveral: Story = {
  render: () => <SampleChart showLegend={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = await canvas.findAllByRole("listitem");
    await expect(items).toHaveLength(2);
    await expect(items[0]).toHaveTextContent("Alpha");
    await expect(items[1]).toHaveTextContent("Beta");
    const swatch = canvasElement.querySelector<HTMLElement>(
      ".nimbus-chart__legendSwatch"
    )!;
    await expect(swatch.style.color).toBe("var(--nimbus-colors-ctviolet-9)");
  },
};

/** One series: no legend, unless `showLegend` is set */
export const SingleNoLegend: Story = {
  render: () => <SampleChart series={["alpha"]} />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await expect(canvasElement.querySelector("ul")).toBeNull();
  },
};

export const SingleWithLegend: Story = {
  render: () => <SampleChart series={["alpha"]} showLegend />,
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
    await expect(svg).toHaveAttribute("aria-label", "Skills by player");
  },
};

/** Tab reaches the chart and the tooltip shows the first item */
export const TabFocus: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    const svg = await findSvg(canvasElement);
    await userEvent.tab();
    await expect(svg).toHaveFocus();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Speed")
    );
  },
};

/** The tooltip is a live region with the label, swatch and value */
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
    await expect(tooltip).toHaveAttribute("aria-live", "assertive");
    await expect(tooltip).toHaveTextContent("Speed");
    await expect(tooltip).toHaveTextContent("Alpha");
    await expect(tooltip).toHaveTextContent("120");
    await expect(tooltip).toHaveTextContent("Beta");
    await expect(tooltip).toHaveTextContent("80");
    const swatch = tooltip.querySelector<HTMLElement>(
      ".nimbus-chart__legendSwatch"
    )!;
    await expect(swatch.style.color).toBe("var(--nimbus-colors-ctviolet-9)");
  },
};

/** ArrowRight and ArrowLeft move the active item and the tooltip text */
export const KeyboardNavigation: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Speed")
    );
    await userEvent.keyboard("{ArrowRight}");
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Power")
    );
    await expect(tooltipText(canvasElement)).not.toHaveTextContent("Speed");
    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Speed")
    );
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

/** The tab stop shows the focus ring and the active item with its tooltip */
export const Focused: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await findSvg(canvasElement);
    await userEvent.tab();
    await waitFor(() =>
      expect(tooltipText(canvasElement)).toHaveTextContent("Speed")
    );
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
  render: () => (
    <DarkMode>
      <SampleChart />
    </DarkMode>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByRole("listitem")).toHaveLength(2);
    await waitFor(() => expect(legendRed(canvasElement)).toBeGreaterThan(128));
    await expect(
      polygons(canvasElement)[0].getAttribute("fill") ===
        "var(--nimbus-colors-ctviolet-9)"
    ).toBe(true);
  },
};
