import type { ReactNode } from "react";
import { ChartThemeProvider, ColorScaleProvider } from "../theme";
import type { ChartThemeName, ColorMode } from "../theme";

export interface ConversionFunnelKitProps {
  title?: ReactNode;
  mode?: ColorMode;
  theme?: ChartThemeName | (string & {});
  /** Shared entity domain (e.g. traffic sources) so a segment keeps one color
   *  across `funnel` and `breakdown` (a `ColorScaleProvider`). */
  colorDomain?: readonly string[];
  /** Primary panel — the funnel itself (`FunnelChart`). */
  funnel?: ReactNode;
  /** KPI column beside the funnel — per-stage or overall conversion rate,
   *  drop-off (`StatCard`s), aligned to the funnel's stages. */
  metrics?: ReactNode;
  /** Secondary panel below — the same funnel cut by a segment (a
   *  `GroupedBarChart`/`BarChart` by channel, plan, cohort…). */
  breakdown?: ReactNode;
  children?: ReactNode;
}

/**
 * "Funnel + stage metrics + a segment cut" — the shape of a conversion
 * analysis page. `funnel` and `metrics` sit side by side (the metrics column
 * reads as annotations on the funnel); `breakdown` is a full-width second
 * row. Slot-based: drop in whatever chart fits each slot.
 */
export function ConversionFunnelKit({
  title,
  mode = "light",
  theme = "nimbus",
  colorDomain,
  funnel,
  metrics,
  breakdown,
  children,
}: ConversionFunnelKitProps) {
  const body = (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {title != null && (
        <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
      )}
      {(funnel != null || metrics != null) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              funnel != null && metrics != null ? "2fr 1fr" : "1fr",
            gap: 16,
          }}
        >
          {funnel != null && <div style={{ minWidth: 0 }}>{funnel}</div>}
          {metrics != null && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {metrics}
            </div>
          )}
        </div>
      )}
      {breakdown != null && <div style={{ minWidth: 0 }}>{breakdown}</div>}
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
