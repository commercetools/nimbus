import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { RadarChart, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section legend
 * @docs-title Legend Tests
 * @docs-description Check the series labels in the legend. The drawn marks need a browser, because JSDOM has no layout
 * @docs-order 1
 */
describe("RadarChart - Legend", () => {
  const data = [
    { skill: "Speed", alpha: 120, beta: 80 },
    { skill: "Power", alpha: 98, beta: 130 },
    { skill: "Range", alpha: 86, beta: 100 },
  ];

  const config = {
    alpha: { label: "Alpha", palette: "ctviolet" },
    beta: { label: "Beta", palette: "orange" },
  } as const;

  it("shows the label of each series in the legend", () => {
    render(
      <NimbusProvider>
        <RadarChart
          aria-label="Skills by player"
          data={data}
          xAxisKey="skill"
          series={["alpha", "beta"]}
          config={config}
        />
      </NimbusProvider>
    );

    const legend = screen.getByRole("list");
    expect(within(legend).getAllByRole("listitem")).toHaveLength(2);
    expect(within(legend).getByText("Alpha")).toBeInTheDocument();
    expect(within(legend).getByText("Beta")).toBeInTheDocument();
  });

  it("hides the legend of a single series unless showLegend is set", () => {
    const { rerender } = render(
      <NimbusProvider>
        <RadarChart
          aria-label="One series"
          data={data}
          xAxisKey="skill"
          series={["alpha"]}
          config={config}
        />
      </NimbusProvider>
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <RadarChart
          aria-label="One series"
          data={data}
          xAxisKey="skill"
          series={["alpha"]}
          showLegend
          config={config}
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Alpha")).toBeInTheDocument();
  });
});

/**
 * @docs-section empty-state
 * @docs-title Empty State Tests
 * @docs-description Check the text and the accessible name when there is no data
 * @docs-order 2
 */
describe("RadarChart - Empty state", () => {
  const config = {
    alpha: { label: "Alpha", palette: "ctviolet" },
    beta: { label: "Beta", palette: "orange" },
  } as const;

  it("shows the empty text for an empty data array", () => {
    render(
      <NimbusProvider>
        <RadarChart
          aria-label="Skills by player"
          data={[]}
          xAxisKey="skill"
          series={["alpha"]}
          config={config}
        />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("group", { name: "Skills by player" })
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
describe("RadarChart - Loading state", () => {
  const data = [
    { skill: "Speed", alpha: 120, beta: 80 },
    { skill: "Power", alpha: 98, beta: 130 },
    { skill: "Range", alpha: 86, beta: 100 },
  ];

  const config = {
    alpha: { label: "Alpha", palette: "ctviolet" },
    beta: { label: "Beta", palette: "orange" },
  } as const;

  it("marks the chart as busy and keeps its accessible name", () => {
    render(
      <NimbusProvider>
        <RadarChart
          aria-label="Skills by player"
          data={data}
          xAxisKey="skill"
          series={["alpha"]}
          config={config}
          isLoading
        />
      </NimbusProvider>
    );

    const chart = screen.getByRole("group", { name: "Skills by player" });
    expect(chart).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("No data to display")).not.toBeInTheDocument();
  });
});
