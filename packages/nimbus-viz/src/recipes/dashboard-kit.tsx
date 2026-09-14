import type { ReactNode } from "react";
import { ChartThemeProvider, ColorScaleProvider } from "../theme";
import type { ChartThemeName, ColorMode } from "../theme";

export interface DashboardKitProps {
  title?: ReactNode;
  mode?: ColorMode;
  theme?: ChartThemeName | (string & {});
  /**
   * Shared entity domain — sets up a `ColorScaleProvider` so an entity keeps one
   * color across every panel (a KPI, the trend line, and the breakdown all agree
   * on "EU = blue").
   */
  colorDomain?: readonly string[];
  /** KPI tiles — a responsive row (e.g. `StatCard`s). */
  kpis?: ReactNode;
  /** Primary panel — usually a time series (`LineChart`/`StackedAreaChart`). */
  trend?: ReactNode;
  /** Secondary panel — a part-to-whole or ranked breakdown. */
  breakdown?: ReactNode;
  children?: ReactNode;
}

/**
 * An opinionated "KPI + trend + breakdown" dashboard scaffold, pre-wired to the
 * chart theme and a shared color scale. Drop your charts into the slots and get
 * a coherent, on-brand, consistently-themed layout — the batteries-included
 * starter that makes the theme system + color identity pay off. Slot-based (not
 * hard-coded to specific charts), so it composes any chart in the library.
 */
export function DashboardKit({
  title,
  mode = "light",
  theme = "nimbus",
  colorDomain,
  kpis,
  trend,
  breakdown,
  children,
}: DashboardKitProps) {
  const body = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {title != null && (
        <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
      )}
      {kpis != null && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {kpis}
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
