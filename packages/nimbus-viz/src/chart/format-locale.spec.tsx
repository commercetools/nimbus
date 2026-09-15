import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  ChartLocaleProvider,
  createFormatters,
  useChartFormatters,
} from "./format-locale";
import { formatDayMonth, formatMonth } from "./format";

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

  it("formats day+month and month per locale (en-US vs de-DE differ)", () => {
    const d = new Date("2026-08-28T00:00:00Z");
    const en = createFormatters({ locale: "en-US" });
    const de = createFormatters({ locale: "de-DE" });
    expect(en.dayMonth(d)).toContain("Aug");
    expect(en.dayMonth(d)).toContain("28");
    expect(en.dayMonth(d)).not.toBe(de.dayMonth(d)); // "Aug 28" vs "28. Aug."
    // August's short form happens to coincide in en-US/de-DE ("Aug"); December
    // ("Dec" / "Dez") is a month whose abbreviation actually differs, so it's
    // the one that proves `month` is locale-threaded, not `dayMonth`'s day
    // digit doing all the work above.
    const dec = new Date("2026-12-15T00:00:00Z");
    expect(en.month(dec)).toBe("Dec");
    expect(de.month(dec)).toBe("Dez");
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

  it("the no-provider default's dayMonth/month is byte-identical to the raw d3 helpers", () => {
    function DateProbe() {
      const f = useChartFormatters();
      const d = new Date("2026-08-28T00:00:00Z");
      return <span data-day={f.dayMonth(d)} data-month={f.month(d)} />;
    }
    const { container } = render(<DateProbe />);
    const span = container.querySelector("span");
    expect(span?.getAttribute("data-day")).toBe(
      formatDayMonth(new Date("2026-08-28T00:00:00Z"))
    );
    expect(span?.getAttribute("data-month")).toBe(
      formatMonth(new Date("2026-08-28T00:00:00Z"))
    );
  });
});
