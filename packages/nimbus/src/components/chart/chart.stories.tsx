import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";
import { Box } from "@commercetools/nimbus";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { ChartContainer } from "./chart-container";
import { useChartContext } from "./chart.context";
import { ChartTooltip } from "./components/chart-tooltip";
import { DarkMode, legendRed } from "./chart.test-utils";
import type { ChartBaseProps, ChartConfig } from "./chart.types";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
];

const twoSeries: ChartConfig = {
  desktop: { label: "Desktop", palette: "ctviolet" },
  mobile: { label: "Mobile", palette: "orange" },
};

const oneSeries: ChartConfig = {
  desktop: { label: "Desktop", palette: "ctviolet" },
};

/**
 * The shared parts need a real chart to be tested. This is a minimal
 * Recharts bar chart that reads series and animation from the container.
 * The six charts are built the same way.
 */
const InnerBars = ({ keys }: { keys: string[] }) => {
  const { series, isAnimationActive, showTooltip, ariaLabel } =
    useChartContext();
  return (
    <BarChart data={data} aria-label={ariaLabel}>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="month" />
      <YAxis />
      {showTooltip && <Tooltip content={<ChartTooltip />} />}
      {keys.map((key) => {
        const item = series.find((s) => s.key === key);
        return item ? (
          <Bar
            key={key}
            dataKey={key}
            fill={item.color}
            isAnimationActive={isAnimationActive}
          />
        ) : null;
      })}
    </BarChart>
  );
};

type SampleProps = Partial<ChartBaseProps> & { keys?: string[] };

const SampleChart = ({
  keys = ["desktop", "mobile"],
  config = twoSeries,
  ...props
}: SampleProps) => (
  <Box width="600px">
    <ChartContainer
      data={data}
      config={config}
      aria-label="Visitors per month"
      isAnimationActive={false}
      seriesKeys={keys}
      data-testid="chart"
      {...props}
    >
      <InnerBars keys={keys} />
    </ChartContainer>
  </Box>
);

// VRT: the recipe paints the grid, tick text, legend swatches, tooltip, focus
// ring and empty state. Snapshotted: Base (grid, ticks, two-series legend), Dark,
// SingleSeriesWithLegend (single-series legend), Empty, and Focused (the shared
// focus ring plus the tooltip of the first point, which the tab stop opens).
// Loading is a skeleton from Skeleton, whose recipe is covered by its own
// stories. RTL is not snapshotted: only the tooltip value margin is logical, and
// the layout is otherwise symmetric.
const meta: Meta<typeof SampleChart> = {
  title: "Components/Chart/Shared",
  component: SampleChart,
};

export default meta;

type Story = StoryObj<typeof SampleChart>;

/** Two series: the legend is always shown, with the config colors */
export const Base: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart />,
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step("Legend lists each series with its label", async () => {
      const items = await canvas.findAllByRole("listitem");
      await expect(items).toHaveLength(2);
      await expect(items[0]).toHaveTextContent("Desktop");
      await expect(items[1]).toHaveTextContent("Mobile");
    });

    await step("Swatches use the palette CSS variable", async () => {
      const swatch = canvasElement.querySelector<HTMLElement>(
        ".nimbus-chart__legendSwatch"
      )!;
      await expect(swatch.style.color).toBe(
        "var(--nimbus-colors-chart-ctviolet)"
      );
    });

    await step("Keeps the Recharts role and tab stop", async () => {
      const svg = canvasElement.querySelector("svg.recharts-surface")!;
      await expect(svg).toHaveAttribute("role", "application");
      await expect(svg).toHaveAttribute("tabindex", "0");
    });

    await step("The aria-label reaches the chart", async () => {
      const svg = canvasElement.querySelector("svg.recharts-surface")!;
      await expect(svg).toHaveAttribute("aria-label", "Visitors per month");
    });

    await step("Legend text is a dark gray in light mode", async () => {
      await expect(legendRed(canvasElement)).toBeLessThan(128);
    });
  },
};

/** The tab stop shows the shared focus ring and the tooltip of the first point */
export const Focused: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    const svg = canvasElement.querySelector("svg.recharts-surface")!;
    await expect(svg).toHaveFocus();
  },
};

/** The legend is hidden for a single series */
export const SingleSeries: Story = {
  render: () => <SampleChart keys={["desktop"]} config={oneSeries} />,
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector(".recharts-bar")).not.toBeNull()
    );
    await expect(canvasElement.querySelector("ul")).toBeNull();
  },
};

/** `showLegend` shows the legend of a single series */
export const SingleSeriesWithLegend: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <SampleChart keys={["desktop"]} config={oneSeries} showLegend />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByRole("listitem")).toHaveLength(1);
  },
};

/** `showLegend={false}` does not hide the legend of two series */
export const LegendAlwaysForTwoSeries: Story = {
  render: () => <SampleChart showLegend={false} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findAllByRole("listitem")).toHaveLength(2);
  },
};

/** Entries without a palette get the default order at their position */
export const DefaultPaletteOrder: Story = {
  render: () => (
    <SampleChart
      config={{ desktop: { label: "Desktop" }, mobile: { label: "Mobile" } }}
    />
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelectorAll(".nimbus-chart__legendSwatch")
      ).toHaveLength(2)
    );
    const swatches = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(".nimbus-chart__legendSwatch")
    );
    await expect(swatches.map((s) => s.style.color)).toEqual([
      "var(--nimbus-colors-chart-ctviolet)",
      "var(--nimbus-colors-chart-orange)",
    ]);
  },
};

/** The tooltip is a live region with label, swatch and value of each series */
export const TooltipContent: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement, step }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector("svg.recharts-surface")).not.toBeNull()
    );

    await step("Focusing the chart shows the first data point", async () => {
      await userEvent.tab();
      const tooltip = await waitFor(() => {
        const el = canvasElement.querySelector<HTMLElement>(
          ".nimbus-chart__tooltip"
        );
        if (!el) throw new Error("tooltip not shown yet");
        return el;
      });
      await expect(tooltip).toHaveAttribute("role", "status");
      await expect(tooltip).toHaveAttribute("aria-live", "assertive");
      await expect(tooltip).toHaveTextContent("Jan");
      await expect(tooltip).toHaveTextContent("Desktop");
      await expect(tooltip).toHaveTextContent("186");
      await expect(tooltip).toHaveTextContent("Mobile");
    });

    await step("ArrowRight moves to the next data point", async () => {
      await userEvent.keyboard("{ArrowRight}");
      await waitFor(() =>
        expect(
          canvasElement.querySelector(".nimbus-chart__tooltip")
        ).toHaveTextContent("Feb")
      );
    });
  },
};

/** `showTooltip={false}` renders no tooltip */
export const TooltipOff: Story = {
  render: () => <SampleChart showTooltip={false} />,
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(canvasElement.querySelector("svg.recharts-surface")).not.toBeNull()
    );
    await userEvent.tab();
    await expect(
      canvasElement.querySelector(".nimbus-chart__tooltip")
    ).toBeNull();
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

/** Empty data shows a translated empty state instead of a blank area */
export const Empty: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => <SampleChart data={[]} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const status = await canvas.findByRole("status");
    await expect(status).toHaveTextContent("No data to display");
    await expect(
      canvasElement.querySelector("svg.recharts-surface")
    ).toBeNull();
  },
};

/** Without a fixed parent height the root keeps its aspect ratio */
export const DefaultAspectRatio: Story = {
  render: () => <SampleChart />,
  play: async ({ canvasElement }) => {
    const plot = canvasElement.querySelector<HTMLElement>(
      ".nimbus-chart__plot"
    )!;
    await waitFor(() => expect(plot.offsetHeight).toBeGreaterThan(100));
    // `wide` is 16:9; the legend adds height below the plot
    await expect(plot.offsetWidth / plot.offsetHeight).toBeCloseTo(16 / 9, 1);
  },
};

/** Colors come from variables that switch with the color mode */
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
    // fg.subtle is a dark gray in light mode (see Base) and a light gray here
    await waitFor(() => expect(legendRed(canvasElement)).toBeGreaterThan(128));
  },
};
