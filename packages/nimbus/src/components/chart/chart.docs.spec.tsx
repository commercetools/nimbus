import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Chart, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section legend
 * @docs-title Legend Tests
 * @docs-description Check the series labels in the legend of a composed chart. The drawn marks need a browser, because JSDOM has no layout
 * @docs-order 1
 */
describe("Chart - Legend", () => {
  const data = [
    { month: "Jan", orders: 186, trend: 150 },
    { month: "Feb", orders: 305, trend: 220 },
  ];

  const config = {
    orders: { label: "Orders", palette: "ctviolet" },
    trend: { label: "Trend", palette: "orange" },
  } as const;

  const MixedChart = (props: { isLoading?: boolean; rows?: typeof data }) => (
    <NimbusProvider>
      <Chart.Root
        aria-label="Orders and trend per month"
        data={props.rows ?? data}
        config={config}
        isLoading={props.isLoading}
      >
        <Chart.Plot>
          <Chart.Grid />
          <Chart.XAxis dataKey="month" />
          <Chart.Tooltip />
          <Chart.Bar dataKey="orders" />
          <Chart.Line dataKey="trend" />
        </Chart.Plot>
      </Chart.Root>
    </NimbusProvider>
  );

  it("lists every series of the chart in the legend", () => {
    render(<MixedChart />);

    const legend = screen.getByRole("list");
    expect(within(legend).getAllByRole("listitem")).toHaveLength(2);
    expect(within(legend).getByText("Orders")).toBeInTheDocument();
    expect(within(legend).getByText("Trend")).toBeInTheDocument();
  });
});

/**
 * @docs-section empty-state
 * @docs-title Empty State Tests
 * @docs-description Check the text and the accessible name when there is no data
 * @docs-order 2
 */
describe("Chart - Empty state", () => {
  const data = [
    { month: "Jan", orders: 186, trend: 150 },
    { month: "Feb", orders: 305, trend: 220 },
  ];

  const config = {
    orders: { label: "Orders", palette: "ctviolet" },
    trend: { label: "Trend", palette: "orange" },
  } as const;

  const MixedChart = (props: { isLoading?: boolean; rows?: typeof data }) => (
    <NimbusProvider>
      <Chart.Root
        aria-label="Orders and trend per month"
        data={props.rows ?? data}
        config={config}
        isLoading={props.isLoading}
      >
        <Chart.Plot>
          <Chart.Grid />
          <Chart.XAxis dataKey="month" />
          <Chart.Tooltip />
          <Chart.Bar dataKey="orders" />
          <Chart.Line dataKey="trend" />
        </Chart.Plot>
      </Chart.Root>
    </NimbusProvider>
  );

  it("shows the empty text for an empty data array", () => {
    render(<MixedChart rows={[]} />);

    expect(
      screen.getByRole("group", { name: "Orders and trend per month" })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("No data to display");
  });
});

/**
 * @docs-section loading-state
 * @docs-title Loading State Tests
 * @docs-description Check that the chart is marked as busy while it loads
 * @docs-order 3
 */
describe("Chart - Loading state", () => {
  const data = [
    { month: "Jan", orders: 186, trend: 150 },
    { month: "Feb", orders: 305, trend: 220 },
  ];

  const config = {
    orders: { label: "Orders", palette: "ctviolet" },
    trend: { label: "Trend", palette: "orange" },
  } as const;

  const MixedChart = (props: { isLoading?: boolean; rows?: typeof data }) => (
    <NimbusProvider>
      <Chart.Root
        aria-label="Orders and trend per month"
        data={props.rows ?? data}
        config={config}
        isLoading={props.isLoading}
      >
        <Chart.Plot>
          <Chart.Grid />
          <Chart.XAxis dataKey="month" />
          <Chart.Tooltip />
          <Chart.Bar dataKey="orders" />
          <Chart.Line dataKey="trend" />
        </Chart.Plot>
      </Chart.Root>
    </NimbusProvider>
  );

  it("marks the chart as busy and keeps its accessible name", () => {
    render(<MixedChart isLoading />);

    const chart = screen.getByRole("group", {
      name: "Orders and trend per month",
    });
    expect(chart).toHaveAttribute("aria-busy", "true");
  });
});
