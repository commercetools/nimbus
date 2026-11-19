import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { RadialChart, NimbusProvider } from "@commercetools/nimbus";

/**
 * @docs-section legend
 * @docs-title Legend Tests
 * @docs-description Check the category labels in the legend. The drawn marks need a browser, because JSDOM has no layout
 * @docs-order 1
 */
describe("RadialChart - Legend", () => {
  const data = [
    { browser: "chrome", visitors: 275 },
    { browser: "safari", visitors: 200 },
    { browser: "firefox", visitors: 187 },
  ];

  const config = {
    chrome: { label: "Chrome", palette: "ctviolet" },
    safari: { label: "Safari", palette: "orange" },
    firefox: { label: "Firefox", palette: "teal" },
  } as const;

  it("shows the label of each category in the legend", () => {
    render(
      <NimbusProvider>
        <RadialChart
          aria-label="Visitors by browser"
          data={data}
          nameKey="browser"
          valueKey="visitors"
          config={config}
        />
      </NimbusProvider>
    );

    const legend = screen.getByRole("list");
    expect(within(legend).getAllByRole("listitem")).toHaveLength(3);
    expect(within(legend).getByText("Chrome")).toBeInTheDocument();
    expect(within(legend).getByText("Safari")).toBeInTheDocument();
  });

  it("hides the legend of a single category unless showLegend is set", () => {
    const { rerender } = render(
      <NimbusProvider>
        <RadialChart
          aria-label="One category"
          data={data.slice(0, 1)}
          nameKey="browser"
          valueKey="visitors"
          config={config}
        />
      </NimbusProvider>
    );

    expect(screen.queryByRole("list")).not.toBeInTheDocument();

    rerender(
      <NimbusProvider>
        <RadialChart
          aria-label="One category"
          data={data.slice(0, 1)}
          nameKey="browser"
          valueKey="visitors"
          showLegend
          config={config}
        />
      </NimbusProvider>
    );

    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("Chrome")).toBeInTheDocument();
  });
});

/**
 * @docs-section empty-state
 * @docs-title Empty State Tests
 * @docs-description Check the text and the accessible name when there is no data
 * @docs-order 2
 */
describe("RadialChart - Empty state", () => {
  const config = {
    chrome: { label: "Chrome", palette: "ctviolet" },
    safari: { label: "Safari", palette: "orange" },
    firefox: { label: "Firefox", palette: "teal" },
  } as const;

  it("shows the empty text for an empty data array", () => {
    render(
      <NimbusProvider>
        <RadialChart
          aria-label="Visitors by browser"
          data={[]}
          nameKey="browser"
          valueKey="visitors"
          config={config}
        />
      </NimbusProvider>
    );

    expect(
      screen.getByRole("group", { name: "Visitors by browser" })
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
describe("RadialChart - Loading state", () => {
  const data = [
    { browser: "chrome", visitors: 275 },
    { browser: "safari", visitors: 200 },
    { browser: "firefox", visitors: 187 },
  ];

  const config = {
    chrome: { label: "Chrome", palette: "ctviolet" },
    safari: { label: "Safari", palette: "orange" },
    firefox: { label: "Firefox", palette: "teal" },
  } as const;

  it("marks the chart as busy and keeps its accessible name", () => {
    render(
      <NimbusProvider>
        <RadialChart
          aria-label="Visitors by browser"
          data={data}
          nameKey="browser"
          valueKey="visitors"
          config={config}
          isLoading
        />
      </NimbusProvider>
    );

    const chart = screen.getByRole("group", { name: "Visitors by browser" });
    expect(chart).toHaveAttribute("aria-busy", "true");
    expect(screen.queryByText("No data to display")).not.toBeInTheDocument();
  });
});

/**
 * @docs-section config
 * @docs-title Config Tests
 * @docs-description Check that a category that is missing in config is not listed
 * @docs-order 4
 */
describe("RadialChart - Config", () => {
  const data = [
    { browser: "chrome", visitors: 275 },
    { browser: "safari", visitors: 200 },
    { browser: "firefox", visitors: 187 },
  ];

  const config = {
    chrome: { label: "Chrome", palette: "ctviolet" },
    safari: { label: "Safari", palette: "orange" },
    firefox: { label: "Firefox", palette: "teal" },
  } as const;

  it("skips a category that is missing in config", () => {
    render(
      <NimbusProvider>
        <RadialChart
          aria-label="Visitors by browser"
          data={data}
          nameKey="browser"
          valueKey="visitors"
          config={{
            chrome: config.chrome,
            safari: config.safari,
          }}
        />
      </NimbusProvider>
    );

    const legend = screen.getByRole("list");
    expect(within(legend).getAllByRole("listitem")).toHaveLength(2);
    expect(within(legend).queryByText("Firefox")).not.toBeInTheDocument();
  });
});
