import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";

export interface BenchmarkPoint {
  x: number | Date;
  y: number;
}

export interface BenchmarkSeriesProps {
  /** The comparison series (last year, plan, industry average…). */
  points: BenchmarkPoint[];
  variant?: OverlayVariant;
  label?: string;
}

/**
 * A dashed comparison line laid over a chart — last year, plan, or an industry
 * benchmark against the actuals. Recessive by default (neutral, dashed) so the
 * primary series stays dominant.
 */
export function BenchmarkSeries({
  points,
  variant = "neutral",
  label,
}: BenchmarkSeriesProps) {
  const { xScale, yScale } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);

  if (points.length < 2) return null;

  const last = points[points.length - 1];
  const lastX = xScale(last.x instanceof Date ? last.x : Number(last.x));
  const lastY = yScale(last.y);

  return (
    <g style={{ pointerEvents: "none" }}>
      <LinePath<BenchmarkPoint>
        data={points}
        x={(p) => xScale(p.x instanceof Date ? p.x : Number(p.x))}
        y={(p) => yScale(p.y)}
        curve={curveMonotoneX}
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />
      {label != null && (
        <text
          x={lastX}
          y={lastY - 6}
          textAnchor="end"
          fontSize={10}
          fontFamily="system-ui, sans-serif"
          fill={theme.mutedInk}
        >
          {label}
        </text>
      )}
    </g>
  );
}
