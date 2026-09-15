import type { ReactNode } from "react";
import { ChartThemeProvider, ColorScaleProvider } from "../theme";
import type { ChartThemeName, ColorMode } from "../theme";

export interface RevenueOverviewKitProps {
  title?: ReactNode;
  /** Sub-label under the title, e.g. "This quarter vs. last quarter". */
  period?: ReactNode;
  mode?: ColorMode;
  theme?: ChartThemeName | (string & {});
  /** Shared entity domain (e.g. regions/channels) so a segment keeps one
   *  color across `trend` and `breakdown` (a `ColorScaleProvider`). */
  colorDomain?: readonly string[];
  /** The single big number — usually a `StatCard` for the period's revenue. */
  headline?: ReactNode;
  /** Secondary KPI row beside the headline (e.g. MRR, ARPU, churn — more
   *  `StatCard`s). */
  comparison?: ReactNode;
  /** Primary panel — revenue over time (`LineChart`/`StackedAreaChart`). */
  trend?: ReactNode;
  /** Secondary panel — revenue by segment (`BarChart`/`DonutChart`). */
  breakdown?: ReactNode;
  children?: ReactNode;
}

/**
 * "Headline number + trend + segment breakdown" — the shape of a revenue (or
 * any single-metric) overview page. `headline` leads, `comparison` sits
 * beside it as supporting context, then `trend` and `breakdown` split the
 * row below. Slot-based (not hard-coded to specific charts): drop in whatever
 * chart fits each slot.
 */
export function RevenueOverviewKit({
  title,
  period,
  mode = "light",
  theme = "nimbus",
  colorDomain,
  headline,
  comparison,
  trend,
  breakdown,
  children,
}: RevenueOverviewKitProps) {
  const body = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {(title != null || period != null) && (
        <div>
          {title != null && (
            <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
          )}
          {period != null && (
            <div style={{ fontSize: 13, opacity: 0.7 }}>{period}</div>
          )}
        </div>
      )}
      {(headline != null || comparison != null) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              headline != null && comparison != null ? "1fr 2fr" : "1fr",
            gap: 12,
            alignItems: "start",
          }}
        >
          {headline != null && <div style={{ minWidth: 0 }}>{headline}</div>}
          {comparison != null && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: 12,
              }}
            >
              {comparison}
            </div>
          )}
        </div>
      )}
      {(trend != null || breakdown != null) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              trend != null && breakdown != null ? "2fr 1fr" : "1fr",
            gap: 16,
          }}
        >
          {trend != null && <div style={{ minWidth: 0 }}>{trend}</div>}
          {breakdown != null && <div style={{ minWidth: 0 }}>{breakdown}</div>}
        </div>
      )}
      {children}
    </div>
  );

  const withColors =
    colorDomain != null ? (
      <ColorScaleProvider domain={colorDomain}>{body}</ColorScaleProvider>
    ) : (
      body
    );

  return (
    <ChartThemeProvider mode={mode} theme={theme}>
      {withColors}
    </ChartThemeProvider>
  );
}
