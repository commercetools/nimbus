import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";

export interface TrendLinePoint {
  x: number;
  y: number;
}

export interface TrendLineProps {
  /** The points to fit. Typically the same points as the scatter it overlays. */
  points: TrendLinePoint[];
  variant?: OverlayVariant;
  dashed?: boolean;
}

/**
 * A least-squares regression line across the x-extent of the given points —
 * the "is there a relationship?" summary for a scatter. Fitting happens in data
 * space; only the endpoints are mapped through the chart's scales.
 */
export function TrendLine({
  points,
  variant = "accent",
  dashed = false,
}: TrendLineProps) {
  const { xScale, yScale } = useChartScales();
  const theme = useChartTheme();

  const n = points.length;
  if (n < 2) return null;

  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  let xMin = Infinity;
  let xMax = -Infinity;
  for (const p of points) {
    sx += p.x;
    sy += p.y;
    sxx += p.x * p.x;
    sxy += p.x * p.y;
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
  }
  const denom = n * sxx - sx * sx;
  if (denom === 0) return null; // vertical / degenerate — no single-valued fit
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;

  const x1 = xScale(xMin);
  const x2 = xScale(xMax);
  const y1 = yScale(slope * xMin + intercept);
  const y2 = yScale(slope * xMax + intercept);

  return (
    <g style={{ pointerEvents: "none" }}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={overlayColor(theme, variant)}
        strokeWidth={2}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
    </g>
  );
}
