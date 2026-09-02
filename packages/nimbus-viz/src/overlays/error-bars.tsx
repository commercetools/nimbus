import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";

export interface ErrorBarPoint {
  x: number | Date;
  low: number;
  high: number;
}

export interface ErrorBarsProps {
  points: ErrorBarPoint[];
  variant?: OverlayVariant;
  /** Half-width of the end caps, in pixels. */
  capWidth?: number;
}

/**
 * Discrete uncertainty whiskers — a vertical line from `low` to `high` with end
 * caps at each x. Pairs with a line or bar to show the confidence interval /
 * spread behind each plotted value.
 */
export function ErrorBars({
  points,
  variant = "neutral",
  capWidth = 4,
}: ErrorBarsProps) {
  const { xScale, yScale } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);

  return (
    <g style={{ pointerEvents: "none" }}>
      {points.map((p, i) => {
        const x = xScale(p.x instanceof Date ? p.x : Number(p.x));
        const yLow = yScale(p.low);
        const yHigh = yScale(p.high);
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={yLow}
              y2={yHigh}
              stroke={color}
              strokeWidth={1.5}
            />
            <line
              x1={x - capWidth}
              x2={x + capWidth}
              y1={yHigh}
              y2={yHigh}
              stroke={color}
              strokeWidth={1.5}
            />
            <line
              x1={x - capWidth}
              x2={x + capWidth}
              y1={yLow}
              y2={yLow}
              stroke={color}
              strokeWidth={1.5}
            />
          </g>
        );
      })}
    </g>
  );
}
