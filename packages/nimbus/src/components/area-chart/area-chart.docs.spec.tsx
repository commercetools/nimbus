import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { AreaChart, NimbusProvider } from "@commercetools/nimbus";

const data = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
];

const config = {
  desktop: { label: "Desktop", palette: "ctviolet" },
  mobile: { label: "Mobile", palette: "orange" },
} as const;

/**
 * @docs-section legend
 * @docs-title Legend Tests
 * @docs-description Check the series labels in the legend. The drawn marks need a browser, because JSDOM has no layout
 * @docs-order 1
 */
describe("AreaChart - Legend", () => {
  it("shows the label of each series in the legend", () => {
    render(
      <NimbusProvider>
        <AreaChart
          aria-label="Visitors per month"
          data={data}
          xAxisKey="month"
          series={["desktop", "mobile"]}
          config={config}
        />
      </NimbusProvider>
    );

    const legend = screen.getByRole("list");
    expect(within(legend).getAllByRole("listitem")).toHaveLength(2);
    expect(within(legend).getByText("Desktop")).toBeInTheDocument();
    expect(within(legend).getByText("Mobile")).toBeInTheDocument();
  });

  it("hides the legend of a single series unless showLegend is set", () => {
    const { rerender } = render(
      <NimbusProvider>
        <AreaChart
          aria-label="Desktop visitors"
          data={data}
          xAxisKey="month"
          series={["desktop"]}
          config={config}
        />
      </NimbusProvider>
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <AreaChart
          aria-label="Desktop visitors"
          data={data}
          xAxisKey="month"
          series={["desktop"]}
          showLegend
          config={config}
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Desktop")).toBeInTheDocument();
  });
});

/**
 * @docs-section empty-state
 * @docs-title Empty State Tests
 * @docs-description Check the text and the accessible name when there is no data
 * @docs-order 2
 */
describe("AreaChart - Empty state", () => {
  it("shows the empty text for an empty data array", () => {
    render(
      <NimbusProvider>
        <AreaChart
          aria-label="Visitors per month"
          data={[]}
          xAxisKey="month"
          series={["desktop"]}
          config={config}
        />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("group", { name: "Visitors per month" })
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
describe("AreaChart - Loading state", () => {
  it("marks the chart as busy and keeps its accessible name", () => {
    render(
      <NimbusProvider>
        <AreaChart
          aria-label="Visitors per month"
          data={data}
          xAxisKey="month"
          series={["desktop"]}
          config={config}
          isLoading
        />
      </NimbusProvider>
    );

    const chart = screen.getByRole("group", { name: "Visitors per month" });
    expect(chart).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("No data to display")).not.toBeInTheDocument();
  });
});
