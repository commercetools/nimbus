import { describe, it, expect } from "vitest";
import { fitBandLabel } from "./axes";

describe("fitBandLabel", () => {
  it("leaves labels that fit untouched", () => {
    const fit = fitBandLabel(200);
    expect(fit("Marketing")).toBe("Marketing");
  });

  it("truncates a label too wide for its band, with an ellipsis", () => {
    const fit = fitBandLabel(40);
    const out = fit("Misalignment");
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThan("Misalignment".length);
  });

  it("degrades to the first character rather than a bare ellipsis", () => {
    const fit = fitBandLabel(6);
    expect(fit("Discoloration")).toBe("D");
  });

  it("is monotonic — a wider budget never truncates more", () => {
    const wide = fitBandLabel(120)("Wholesale revenue");
    const narrow = fitBandLabel(50)("Wholesale revenue");
    expect(wide.length).toBeGreaterThanOrEqual(narrow.length);
  });
});
