import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { ChartContainer } from "./chart-container";
import type { InnerDims } from "./chart-frame";
import { ChartThemeProvider } from "../theme";

function renderInTheme(ui: ReactNode) {
  return render(<ChartThemeProvider mode="light">{ui}</ChartThemeProvider>);
}

const plot = () => <rect data-testid="plot" width={10} height={10} />;

describe("ChartContainer", () => {
  it("renders the plot inside an accessible SVG frame", () => {
    const { container } = renderInTheme(
      <ChartContainer width={400} height={300} ariaLabel="Test chart">
        {plot}
      </ChartContainer>
    );
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("role")).toBe("img");
    expect(svg?.getAttribute("aria-label")).toBe("Test chart");
    expect(container.querySelector('[data-testid="plot"]')).not.toBeNull();
  });

  it("renders a visible title/subtitle in a figcaption", () => {
    const { container, getByText } = renderInTheme(
      <ChartContainer
        width={400}
        height={300}
        title="Revenue"
        subtitle="by month"
      >
        {plot}
      </ChartContainer>
    );
    expect(container.querySelector("figure")).not.toBeNull();
    expect(container.querySelector("figcaption")).not.toBeNull();
    expect(getByText("Revenue")).toBeTruthy();
    expect(getByText("by month")).toBeTruthy();
  });

  it("renders the shared legend when items are given", () => {
    const { getByText } = renderInTheme(
      <ChartContainer
        width={400}
        height={300}
        legend={[
          { label: "EU", color: "#111111" },
          { label: "US", color: "#222222" },
        ]}
      >
        {plot}
      </ChartContainer>
    );
    expect(getByText("EU")).toBeTruthy();
    expect(getByText("US")).toBeTruthy();
  });

  it("shows the empty state instead of the plot", () => {
    const { container, getByText } = renderInTheme(
      <ChartContainer
        width={400}
        height={300}
        isEmpty
        emptyMessage="Nothing here"
      >
        {plot}
      </ChartContainer>
    );
    expect(getByText("Nothing here")).toBeTruthy();
    expect(container.querySelector("svg")).toBeNull(); // no frame when empty
  });

  it("exposes a non-visual data-equivalent table when given `table`", () => {
    const { container } = renderInTheme(
      <ChartContainer
        width={400}
        height={300}
        ariaLabel="Sales"
        table={{
          columns: ["Month", "Sales"],
          rows: [
            ["Jan", 10],
            ["Feb", 20],
          ],
          summary: "Two months of sales.",
        }}
      >
        {plot}
      </ChartContainer>
    );
    const tbl = container.querySelector("table");
    expect(tbl).not.toBeNull();
    expect(tbl?.textContent).toContain("Jan");
    expect(tbl?.textContent).toContain("20");
  });

  it("shows a loading skeleton (role=status) ahead of data", () => {
    const { container, queryByText } = renderInTheme(
      <ChartContainer
        width={400}
        height={300}
        loading
        isEmpty
        emptyMessage="No data"
      >
        {plot}
      </ChartContainer>
    );
    expect(container.querySelector('[role="status"]')).not.toBeNull();
    expect(container.querySelector("svg")).toBeNull();
    expect(queryByText("No data")).toBeNull(); // loading wins over empty
  });

  it("shows an error surface (role=alert) at highest precedence", () => {
    const { container, getByText } = renderInTheme(
      <ChartContainer
        width={400}
        height={300}
        error="Failed to load"
        loading
        isEmpty
      >
        {plot}
      </ChartContainer>
    );
    expect(container.querySelector('[role="alert"]')).not.toBeNull();
    expect(getByText("Failed to load")).toBeTruthy();
    expect(container.querySelector('[role="status"]')).toBeNull(); // error wins
  });

  it("passes positive inset dims to the plot render-prop", () => {
    let dims: InnerDims | undefined;
    renderInTheme(
      <ChartContainer width={400} height={300}>
        {(d) => {
          dims = d;
          return <rect />;
        }}
      </ChartContainer>
    );
    expect(dims?.innerWidth).toBeGreaterThan(0);
    expect(dims?.innerHeight).toBeGreaterThan(0);
  });
});
