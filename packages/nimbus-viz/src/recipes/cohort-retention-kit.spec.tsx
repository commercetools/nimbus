import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { CohortRetentionKit } from "./cohort-retention-kit";
import { useChartTheme } from "../theme";

function Probe() {
  const t = useChartTheme();
  return <span data-c0={t.categorical[0]} />;
}

describe("CohortRetentionKit", () => {
  it("lays out the slots inside the theme provider", () => {
    const { getByText, container } = render(
      <CohortRetentionKit
        title="Monthly retention"
        mode="dark"
        colorDomain={["2026-01", "2026-02"]}
        grid={<div>GRID</div>}
        curve={<div>CURVE</div>}
        summary={<div>SUMMARY</div>}
      >
        <Probe />
      </CohortRetentionKit>
    );
    expect(getByText("Monthly retention")).toBeTruthy();
    expect(getByText("GRID")).toBeTruthy();
    expect(getByText("CURVE")).toBeTruthy();
    expect(getByText("SUMMARY")).toBeTruthy();
    expect(container.querySelector("span")?.getAttribute("data-c0")).toBe(
      "#3987e5"
    );
  });

  it("renders without a color domain (no ColorScaleProvider required)", () => {
    const { getByText } = render(
      <CohortRetentionKit grid={<div>ONLY GRID</div>} />
    );
    expect(getByText("ONLY GRID")).toBeTruthy();
  });
});
