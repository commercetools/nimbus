import { Component, type ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Box, Chart } from "@commercetools/nimbus";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { findSvg, tooltipText } from "./chart.test-utils";
import type { ChartConfig } from "./chart.types";

const data = [
  { month: "Jan", orders: 186, trend: 150, other: 80, extra: 60 },
  { month: "Feb", orders: 305, trend: 220, other: 200, extra: 90 },
  { month: "Mar", orders: 237, trend: 260, other: 120, extra: 110 },
];

const config: ChartConfig = {
  orders: { label: "Orders", palette: "ctviolet" },
  trend: { label: "Trend", palette: "orange" },
};

/**
 * The `Chart` parts are the only way, besides the six charts, to draw a chart.
 * These stories use no Recharts import: that is part of what they test.
 */
const meta: Meta<typeof Chart.Root> = {
  title: "Components/Chart/Composition",
  component: Chart.Root,
};

export default meta;

type Story = StoryObj<typeof Chart.Root>;

const bars = (root: HTMLElement) =>
  root.querySelectorAll(".recharts-bar-rectangle");
const lines = (root: HTMLElement) =>
  Array.from(root.querySelectorAll("path.recharts-line-curve"));

/** Bars and a line in one chart, which none of the six charts can draw */
export const MixedBarAndLine: Story = {
  tags: ["vrt"],
  parameters: { chromatic: { disableSnapshot: false } },
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders and trend per month"
        data={data}
        config={config}
        series={["orders", "trend"]}
        isAnimationActive={false}
      >
        <Chart.Plot>
          <Chart.Grid />
          <Chart.XAxis dataKey="month" />
          <Chart.Tooltip />
          <Chart.Bar dataKey="orders" />
          <Chart.Line dataKey="trend" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await findSvg(canvasElement);

    await step("Draws the bars and the line in one chart", async () => {
      await waitFor(() => expect(bars(canvasElement)).toHaveLength(3));
      await expect(lines(canvasElement)).toHaveLength(1);
    });

    await step("The legend lists both series", async () => {
      const items = await canvas.findAllByRole("listitem");
      await expect(items).toHaveLength(2);
      await expect(items[0]).toHaveTextContent("Orders");
      await expect(items[1]).toHaveTextContent("Trend");
    });

    await step("Series colors come from the config palettes", async () => {
      const bar = canvasElement.querySelector(".recharts-bar-rectangle path")!;
      await expect(bar.getAttribute("fill")).toBe(
        "var(--nimbus-colors-chart-ctviolet)"
      );
      await expect(lines(canvasElement)[0].getAttribute("stroke")).toBe(
        "var(--nimbus-colors-chart-orange)"
      );
    });

    await step("The tooltip of a point lists both series", async () => {
      await userEvent.tab();
      const tooltip = await waitFor(() => {
        const el = tooltipText(canvasElement);
        if (!el) throw new Error("tooltip not shown yet");
        return el;
      });
      await expect(tooltip).toHaveTextContent("Jan");
      await expect(tooltip).toHaveTextContent("Orders");
      await expect(tooltip).toHaveTextContent("186");
      await expect(tooltip).toHaveTextContent("Trend");
      await expect(tooltip).toHaveTextContent("150");
    });

    await step("Keeps the Recharts role and the accessible name", async () => {
      const svg = await findSvg(canvasElement);
      await expect(svg).toHaveAttribute("role", "application");
      await expect(svg).toHaveAttribute(
        "aria-label",
        "Orders and trend per month"
      );
    });
  },
};

/** Without `series`, the keys of `config` are the series, in order */
export const DefaultSeriesFromConfig: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders and trend per month"
        data={data}
        config={config}
        isAnimationActive={false}
      >
        <Chart.Plot>
          <Chart.XAxis dataKey="month" />
          <Chart.Bar dataKey="orders" />
          <Chart.Bar dataKey="trend" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const items = await canvas.findAllByRole("listitem");
    await expect(items).toHaveLength(2);
    await expect(items[0]).toHaveTextContent("Orders");
    await expect(items[1]).toHaveTextContent("Trend");
    await waitFor(() => expect(bars(canvasElement)).toHaveLength(6));
  },
};

/** A `dataKey` that is not in `series` draws nothing */
export const UnknownDataKeyDrawsNothing: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders per month"
        data={data}
        config={config}
        series={["orders"]}
        isAnimationActive={false}
      >
        <Chart.Plot>
          <Chart.XAxis dataKey="month" />
          <Chart.Bar dataKey="orders" />
          <Chart.Bar dataKey="other" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(bars(canvasElement)).toHaveLength(3));
    await expect(canvasElement.querySelectorAll(".recharts-bar")).toHaveLength(
      1
    );
  },
};

/** Without `Chart.Grid` there are no grid lines; `showTooltip={false}` hides the tooltip */
export const WithoutGridAndTooltip: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders per month"
        data={data}
        config={config}
        series={["orders"]}
        showTooltip={false}
        isAnimationActive={false}
      >
        <Chart.Plot>
          <Chart.XAxis dataKey="month" />
          <Chart.Tooltip />
          <Chart.Bar dataKey="orders" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(bars(canvasElement)).toHaveLength(3));
    await expect(
      canvasElement.querySelector(".recharts-cartesian-grid")
    ).toBeNull();
    await userEvent.tab();
    await expect(tooltipText(canvasElement)).toBeNull();
  },
};

/** The grid part draws horizontal lines only, like the six charts */
export const GridIsHorizontal: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders per month"
        data={data}
        config={config}
        series={["orders"]}
        isAnimationActive={false}
      >
        <Chart.Plot>
          <Chart.Grid />
          <Chart.XAxis dataKey="month" />
          <Chart.Bar dataKey="orders" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() =>
      expect(
        canvasElement.querySelector(".recharts-cartesian-grid-horizontal")
      ).not.toBeNull()
    );
    await expect(
      canvasElement.querySelector(".recharts-cartesian-grid-vertical line")
    ).toBeNull();
  },
};

/** The empty state of `Chart.Root` replaces the plot */
export const Empty: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders per month"
        data={[]}
        config={config}
        series={["orders"]}
      >
        <Chart.Plot>
          <Chart.Bar dataKey="orders" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
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

/** `isLoading` shows the skeleton instead of the plot */
export const Loading: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders per month"
        data={data}
        config={config}
        series={["orders"]}
        isLoading
        data-testid="chart"
      >
        <Chart.Plot>
          <Chart.Bar dataKey="orders" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const root = canvasElement.querySelector("[data-testid='chart']")!;
    await expect(root).toHaveAttribute("aria-busy", "true");
    await expect(root.querySelector("svg.recharts-surface")).toBeNull();
  },
};

const fourSeriesConfig: ChartConfig = {
  orders: { label: "Orders" },
  trend: { label: "Trend" },
  other: { label: "Other" },
  extra: { label: "Extra" },
};

/** With more than 3 series, lines get dash patterns, as in `LineChart` */
export const LinesGetDashPatternsWithManySeries: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Four series"
        data={data}
        config={fourSeriesConfig}
        isAnimationActive={false}
      >
        <Chart.Plot>
          <Chart.XAxis dataKey="month" />
          <Chart.Line dataKey="orders" />
          <Chart.Line dataKey="trend" />
          <Chart.Line dataKey="other" />
          <Chart.Line dataKey="extra" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(lines(canvasElement)).toHaveLength(4));
    const patterns = lines(canvasElement).map(
      (line) => line.getAttribute("stroke-dasharray") ?? ""
    );
    await expect(patterns[0]).toBe("");
    await expect(patterns[1]).not.toBe("");
    await expect(new Set(patterns).size).toBe(4);
  },
};

/** `stacked` puts the bars of a column on top of each other */
export const StackedBars: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders and trend per month"
        data={data}
        config={config}
        isAnimationActive={false}
      >
        <Chart.Plot>
          <Chart.XAxis dataKey="month" />
          <Chart.Bar dataKey="orders" stacked />
          <Chart.Bar dataKey="trend" stacked />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(bars(canvasElement)).toHaveLength(6));
    const rect = (series: number) =>
      canvasElement
        .querySelectorAll(".recharts-bar")
        [series].querySelector(".recharts-bar-rectangle path")!;
    await expect(rect(0).getAttribute("x")).toBe(rect(1).getAttribute("x"));
  },
};

/** Without `stacked`, the bars of a column sit side by side */
export const GroupedBars: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders and trend per month"
        data={data}
        config={config}
        isAnimationActive={false}
      >
        <Chart.Plot>
          <Chart.XAxis dataKey="month" />
          <Chart.Bar dataKey="orders" />
          <Chart.Bar dataKey="trend" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(bars(canvasElement)).toHaveLength(6));
    const rect = (series: number) =>
      canvasElement
        .querySelectorAll(".recharts-bar")
        [series].querySelector(".recharts-bar-rectangle path")!;
    await expect(rect(0).getAttribute("x")).not.toBe(rect(1).getAttribute("x"));
  },
};

/** An area fills with a gradient whose definition is in the document */
export const AreaUsesGradient: Story = {
  render: () => (
    <Box width="600px">
      <Chart.Root
        aria-label="Orders per month"
        data={data}
        config={config}
        series={["orders"]}
        isAnimationActive={false}
      >
        <Chart.Plot>
          <Chart.XAxis dataKey="month" />
          <Chart.Area dataKey="orders" />
        </Chart.Plot>
      </Chart.Root>
    </Box>
  ),
  play: async ({ canvasElement }) => {
    const area = await waitFor(() => {
      const el = canvasElement.querySelector("path.recharts-area-area");
      if (!el) throw new Error("area not drawn yet");
      return el;
    });
    const fill = area.getAttribute("fill") ?? "";
    await expect(fill).toMatch(/^url\(#.+\)$/);
    const id = fill.slice(5, -1);
    await expect(canvasElement.ownerDocument.getElementById(id)).not.toBeNull();
    const curve = canvasElement.querySelector("path.recharts-area-curve")!;
    await expect(curve.getAttribute("stroke")).toBe(
      "var(--nimbus-colors-chart-ctviolet)"
    );
  },
};

class CatchError extends Component<
  { children: ReactNode },
  { message: string | null }
> {
  state = { message: null as string | null };
  static getDerivedStateFromError(error: Error) {
    return { message: error.message };
  }
  render() {
    return this.state.message === null ? (
      this.props.children
    ) : (
      <p data-testid="error">{this.state.message}</p>
    );
  }
}

/** A part outside `Chart.Root` throws an error that names `Chart.Root` */
export const PartOutsideRootThrows: Story = {
  render: () => (
    <CatchError>
      <Chart.Bar dataKey="orders" />
    </CatchError>
  ),
  play: async ({ canvasElement }) => {
    const error = await within(canvasElement).findByTestId("error");
    await expect(error).toHaveTextContent("Chart.Root");
  },
};
