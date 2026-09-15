import type { ReactNode } from "react";
import { ChartThemeProvider, ColorScaleProvider } from "../theme";
import type { ChartThemeName, ColorMode } from "../theme";

export interface CohortRetentionKitProps {
  title?: ReactNode;
  mode?: ColorMode;
  theme?: ChartThemeName | (string & {});
  /** Shared entity domain (e.g. cohort labels) so a cohort keeps one color
   *  across `curve` and `summary` (a `ColorScaleProvider`). */
  colorDomain?: readonly string[];
  /** Primary panel — the cohort-by-period grid (`CohortTriangle`/`Heatmap`). */
  grid?: ReactNode;
  /** Secondary panel — retention (or churn) over time, one line per cohort
   *  or overall (`LineChart`). */
  curve?: ReactNode;
  /** KPI row below both — e.g. average retention, best/worst cohort
   *  (`StatCard`s). */
  summary?: ReactNode;
  children?: ReactNode;
}

/**
 * "Cohort grid + retention curve + summary KPIs" — the shape of a retention
 * analysis page. `grid` and `curve` split the main row (the grid usually
 * wants more width); `summary` is a KPI row underneath both. Slot-based:
 * drop in whatever chart fits each slot.
 */
export function CohortRetentionKit({
  title,
  mode = "light",
  theme = "nimbus",
  colorDomain,
  grid,
  curve,
  summary,
  children,
}: CohortRetentionKitProps) {
  const body = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {title != null && (
        <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
      )}
      {(grid != null || curve != null) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              grid != null && curve != null ? "3fr 2fr" : "1fr",
            gap: 16,
          }}
        >
          {grid != null && <div style={{ minWidth: 0 }}>{grid}</div>}
          {curve != null && <div style={{ minWidth: 0 }}>{curve}</div>}
        </div>
      )}
      {summary != null && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 12,
          }}
        >
          {summary}
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
