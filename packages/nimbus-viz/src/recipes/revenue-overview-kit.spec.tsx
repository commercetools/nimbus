import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { RevenueOverviewKit } from "./revenue-overview-kit";
import { useChartTheme } from "../theme";

function Probe() {
  const t = useChartTheme();
  return <span data-c0={t.categorical[0]} />;
}

describe("RevenueOverviewKit", () => {
  it("lays out the slots inside the theme provider", () => {
    const { getByText, container } = render(
      <RevenueOverviewKit
        title="Revenue"
        period="This quarter vs. last quarter"
        mode="dark"
        colorDomain={["eu", "us"]}
        headline={<div>HEADLINE</div>}
        comparison={<div>COMPARISON</div>}
        trend={<div>TREND</div>}
        breakdown={<div>BREAKDOWN</div>}
      >
        <Probe />
      </RevenueOverviewKit>
    );
    expect(getByText("Revenue")).toBeTruthy();
    expect(getByText("This quarter vs. last quarter")).toBeTruthy();
    expect(getByText("HEADLINE")).toBeTruthy();
    expect(getByText("COMPARISON")).toBeTruthy();
    expect(getByText("TREND")).toBeTruthy();
    expect(getByText("BREAKDOWN")).toBeTruthy();
    expect(container.querySelector("span")?.getAttribute("data-c0")).toBe(
      "#3987e5"
    );
  });

  it("renders without a color domain (no ColorScaleProvider required)", () => {
    const { getByText } = render(
      <RevenueOverviewKit trend={<div>ONLY TREND</div>} />
    );
    expect(getByText("ONLY TREND")).toBeTruthy();
  });
});
