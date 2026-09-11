import { describe, it, expect } from "vitest";
import { chartStability, STABLE_CHARTS } from "./stability";

describe("chartStability", () => {
  it("marks the core commerce charts stable", () => {
    expect(chartStability("line")).toBe("stable");
    expect(chartStability("stacked-bar")).toBe("stable");
    expect(chartStability("funnel")).toBe("stable");
  });

  it("marks the exotic tail experimental", () => {
    expect(chartStability("chord")).toBe("experimental");
    expect(chartStability("marimekko")).toBe("experimental");
    expect(chartStability("parallel-coordinates")).toBe("experimental");
  });

  it("keeps the stable set small (depth over breadth)", () => {
    expect(STABLE_CHARTS.size).toBeLessThanOrEqual(12);
  });
});
