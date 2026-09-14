import { Area } from "@visx/shape";
import { curveLinear } from "@visx/curve";
import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";
import { linearRegression, regressionBand } from "../stats";
import type { RegressionBandPoint } from "../stats";

export interface TrendLinePoint {
  x: number;
  y: number;
}

export interface TrendLineProps {
  /** The points to fit. Typically the same points as the scatter it overlays. */
  points: TrendLinePoint[];
  variant?: OverlayVariant;
  dashed?: boolean;
  /**
   * Draw a confidence band for the mean response around the fit. `true` uses a
   * 95% interval; pass a number in (0,1) to choose the level. Needs n ≥ 3.
   */
  band?: boolean | number;
}

/**
 * A least-squares regression line across the x-extent of the given points —
 * the "is there a relationship?" summary for a scatter. The fit is computed in
 * data space by the shared `stats` module (so it's the same math the analytics
 * helpers use and is unit-tested); only endpoints and the optional band are
 * mapped through the chart's scales.
 */
export function TrendLine({
  points,
  variant = "accent",
  dashed = false,
  band = false,
}: TrendLineProps) {
  const { xScale, yScale } = useChartScales();
  const theme = useChartTheme();

  if (points.length < 2) return null;

  const fit = linearRegression(points);

  let xMin = Infinity;
  let xMax = -Infinity;
  for (const p of points) {
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
  }
  if (xMin === xMax) return null; // vertical / degenerate — no single-valued fit

  const color = overlayColor(theme, variant);
  const confidence = band === true ? 0.95 : typeof band === "number" ? band : 0;
  const bandPoints: RegressionBandPoint[] =
    confidence > 0 ? regressionBand(points, { confidence }) : [];

  return (
    <g style={{ pointerEvents: "none" }}>
      {bandPoints.length >= 2 && (
        <Area<RegressionBandPoint>
          data={bandPoints}
          x={(p) => xScale(p.x)}
          y0={(p) => yScale(p.low)}
          y1={(p) => yScale(p.high)}
          curve={curveLinear}
          fill={color}
          fillOpacity={0.15}
        />
      )}
      <line
        x1={xScale(xMin)}
        y1={yScale(fit.slope * xMin + fit.intercept)}
        x2={xScale(xMax)}
        y2={yScale(fit.slope * xMax + fit.intercept)}
        stroke={color}
        strokeWidth={2}
        strokeDasharray={dashed ? "4 3" : undefined}
      />
    </g>
  );
}
