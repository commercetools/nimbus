import { Area } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";

export interface ConfidenceBandPoint {
  x: number | Date;
  low: number;
  high: number;
}

export interface ConfidenceBandProps {
  points: ConfidenceBandPoint[];
  variant?: OverlayVariant;
}

/**
 * A continuous band between a lower and upper series across x — a forecast
 * range or confidence interval hugging a line. The continuous cousin of
 * `ErrorBars`; low fill opacity so the line it wraps stays legible.
 */
export function ConfidenceBand({
  points,
  variant = "accent",
}: ConfidenceBandProps) {
  const { xScale, yScale } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);

  if (points.length < 2) return null;

  return (
    <g style={{ pointerEvents: "none" }}>
      <Area<ConfidenceBandPoint>
        data={points}
        x={(p) => xScale(p.x instanceof Date ? p.x : Number(p.x))}
        y0={(p) => yScale(p.low)}
        y1={(p) => yScale(p.high)}
        curve={curveMonotoneX}
        fill={color}
        fillOpacity={0.15}
      />
    </g>
  );
}
