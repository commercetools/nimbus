import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  ChartLocaleProvider,
  createFormatters,
  useChartFormatters,
} from "./format-locale";

describe("createFormatters", () => {
  it("groups numbers per locale (en-US vs de-DE differ)", () => {
    const en = createFormatters({ locale: "en-US" });
    const de = createFormatters({ locale: "de-DE" });
    expect(en.number(1234.5)).not.toBe(de.number(1234.5));
    expect(en.number(1234.5)).toContain(","); // 1,234.5
    expect(de.number(1234.5)).toContain("."); // 1.234,5
  });

  it("renders the requested currency symbol", () => {
    const eur = createFormatters({ locale: "de-DE", currency: "EUR" });
    expect(eur.currency(1200)).toContain("€");
  });

  it("formats a 0–1 ratio as a percent", () => {
    expect(createFormatters({ locale: "en-US" }).percent(0.25)).toContain("25");
  });
});

describe("ChartLocaleProvider / useChartFormatters", () => {
  function Probe() {
    const f = useChartFormatters();
    return <span data-v={f.number(1234.5)} />;
  }

  it("supplies locale-aware formatters through context", () => {
    const { container } = render(
      <ChartLocaleProvider locale="de-DE">
        <Probe />
      </ChartLocaleProvider>
    );
    expect(container.querySelector("span")?.getAttribute("data-v")).toContain(
      "."
    );
  });

  it("falls back to a default when no provider is present", () => {
    const { container } = render(<Probe />);
    // Some grouped output is produced without a provider (no throw).
    expect(
      container.querySelector("span")?.getAttribute("data-v")?.length
    ).toBeGreaterThan(0);
  });
});
