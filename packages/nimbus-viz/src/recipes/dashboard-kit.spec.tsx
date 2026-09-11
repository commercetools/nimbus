import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { DashboardKit } from "./dashboard-kit";
import { useChartTheme } from "../theme";

// Proves the kit established a ChartThemeProvider (useChartTheme would throw
// otherwise) and, with colorDomain, a ColorScaleProvider around the slots.
function Probe() {
  const t = useChartTheme();
  return <span data-c0={t.categorical[0]} />;
}

describe("DashboardKit", () => {
  it("lays out the slots inside the theme provider", () => {
    const { getByText, container } = render(
      <DashboardKit
        title="Revenue overview"
        mode="dark"
        colorDomain={["eu", "us"]}
        kpis={<div>KPI ROW</div>}
        trend={<div>TREND</div>}
        breakdown={<div>BREAKDOWN</div>}
      >
        <Probe />
      </DashboardKit>
    );
    expect(getByText("Revenue overview")).toBeTruthy();
    expect(getByText("KPI ROW")).toBeTruthy();
    expect(getByText("TREND")).toBeTruthy();
    expect(getByText("BREAKDOWN")).toBeTruthy();
    // dark theme resolved through the provider the kit created
    expect(container.querySelector("span")?.getAttribute("data-c0")).toBe(
      "#3987e5"
    );
  });

  it("renders without color domain (no ColorScaleProvider required)", () => {
    const { getByText } = render(
      <DashboardKit trend={<div>ONLY TREND</div>} />
    );
    expect(getByText("ONLY TREND")).toBeTruthy();
  });
});
