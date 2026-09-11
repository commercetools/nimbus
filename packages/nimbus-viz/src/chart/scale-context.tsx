import { createContext, useContext } from "react";
import type { ReactNode } from "react";

/**
 * The coordinate contract a base chart publishes so overlay components
 * (reference lines, bands, trend lines, error bars…) can draw in the same
 * inner-plot space without knowing the chart's native scale type.
 *
 * Each chart adapts its own scales (time / linear / band) to these uniform
 * accessors — an assembly finding worth ratifying in the RFC: the base chart
 * owns the scale-shape adaptation, so overlays stay scale-agnostic and one
 * overlay component works across every chart that provides the contract.
 *
 * Coordinates are the margin-inset plot space (0,0 at the top-left of the plot,
 * y increasing downward) — i.e. exactly what `ChartFrame`'s render-prop hands
 * the marks, so overlays composed as children line up with the data.
 */
export interface ChartScales {
  /** Value axis: data value → pixel (linear, top-origin SVG space). */
  yScale: (value: number) => number;
  /** Position axis: data x → pixel. Time / linear / band, adapted per chart. */
  xScale: (value: number | Date) => number;
  /** Category slot width for band x-scales; 0 for a continuous x-axis. */
  xBandwidth: number;
  innerWidth: number;
  innerHeight: number;
}

const ChartScaleContext = createContext<ChartScales | null>(null);

export interface ChartScaleProviderProps {
  value: ChartScales;
  children: ReactNode;
}

/** Published by a base chart inside its plot; consumed by overlay children. */
export function ChartScaleProvider({
  value,
  children,
}: ChartScaleProviderProps) {
  return (
    <ChartScaleContext.Provider value={value}>
      {children}
    </ChartScaleContext.Provider>
  );
}

/** Read the enclosing chart's scale contract. Throws if used outside a chart. */
export function useChartScales(): ChartScales {
  const ctx = useContext(ChartScaleContext);
  if (!ctx) {
    throw new Error(
      "nimbus-viz overlay used outside a chart: no ChartScaleProvider in " +
        "context. Render overlays as children of a base chart, e.g. " +
        "<LineChart …><ReferenceLine value={90} /></LineChart>."
    );
  }
  return ctx;
}
