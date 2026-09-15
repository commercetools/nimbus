import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ConversionFunnelKit } from "./conversion-funnel-kit";
import { useChartTheme } from "../theme";

function Probe() {
  const t = useChartTheme();
  return <span data-c0={t.categorical[0]} />;
}

describe("ConversionFunnelKit", () => {
  it("lays out the slots inside the theme provider", () => {
    const { getByText, container } = render(
      <ConversionFunnelKit
        title="Signup funnel"
        mode="dark"
        colorDomain={["organic", "paid"]}
        funnel={<div>FUNNEL</div>}
        metrics={<div>METRICS</div>}
        breakdown={<div>BREAKDOWN</div>}
      >
        <Probe />
      </ConversionFunnelKit>
    );
    expect(getByText("Signup funnel")).toBeTruthy();
    expect(getByText("FUNNEL")).toBeTruthy();
    expect(getByText("METRICS")).toBeTruthy();
    expect(getByText("BREAKDOWN")).toBeTruthy();
    expect(container.querySelector("span")?.getAttribute("data-c0")).toBe(
      "#3987e5"
    );
  });

  it("renders without a color domain (no ColorScaleProvider required)", () => {
    const { getByText } = render(
      <ConversionFunnelKit funnel={<div>ONLY FUNNEL</div>} />
    );
    expect(getByText("ONLY FUNNEL")).toBeTruthy();
  });
});
