import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

/**
 * Locale- and currency-aware chart formatting. The base `format.ts` d3
 * formatters are hardcoded to en-US; this adds an `Intl`-backed set (no bundled
 * locale data required) plus a provider, so a Merchant-Center chart can render
 * `€1.2M` and de-DE `1.234,5`. Additive — existing charts keep working; they
 * opt in by reading `useChartFormatters()` or taking a `valueFormat` prop.
 */
export interface ChartFormatOptions {
  /** BCP-47 locale (e.g. "de-DE"); defaults to the runtime locale. */
  locale?: string;
  /** ISO 4217 currency (e.g. "EUR"); defaults to "USD". */
  currency?: string;
}

export interface ChartFormatters {
  /** Grouped integer/decimal, e.g. 1,234.5 / 1.234,5. */
  number: (n: number) => string;
  /** Compact, e.g. 1.2M / 1,2 Mio. */
  compact: (n: number) => string;
  /** Currency, e.g. €1.2K. */
  currency: (n: number) => string;
  /** Percent of a 0–1 ratio, e.g. 25%. */
  percent: (n: number) => string;
}

export function createFormatters(
  opts: ChartFormatOptions = {}
): ChartFormatters {
  const { locale, currency = "USD" } = opts;
  const num = new Intl.NumberFormat(locale);
  const comp = new Intl.NumberFormat(locale, {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const cur = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 1,
  });
  const pct = new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 0,
  });
  return {
    number: (n) => num.format(n),
    compact: (n) => comp.format(n),
    currency: (n) => cur.format(n),
    percent: (n) => pct.format(n),
  };
}

const DEFAULT_FORMATTERS = createFormatters();

const FormatContext = createContext<ChartFormatters | null>(null);

export interface ChartLocaleProviderProps extends ChartFormatOptions {
  children: ReactNode;
}

/** Provide a locale/currency for every chart beneath it. */
export function ChartLocaleProvider({
  locale,
  currency,
  children,
}: ChartLocaleProviderProps) {
  const value = useMemo(
    () => createFormatters({ locale, currency }),
    [locale, currency]
  );
  return (
    <FormatContext.Provider value={value}>{children}</FormatContext.Provider>
  );
}

/** The active formatters — from a surrounding provider, else the runtime default. */
export function useChartFormatters(): ChartFormatters {
  return useContext(FormatContext) ?? DEFAULT_FORMATTERS;
}
