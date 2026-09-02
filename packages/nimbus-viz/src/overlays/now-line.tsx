import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";
import { emText } from "../chart/typography";

export interface NowLineProps {
  /** The "now" position; defaults to the current time. */
  at?: number | Date;
  label?: string;
  variant?: OverlayVariant;
}

/**
 * A vertical "you are here" rule at the current time (or a given position) —
 * the boundary between actuals and forecast on a timeline. Non-interactive.
 */
export function NowLine({
  at = new Date(),
  label = "Now",
  variant = "accent",
}: NowLineProps) {
  const { xScale, innerHeight } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);
  const x = xScale(at instanceof Date ? at : Number(at));
  return (
    <g style={{ pointerEvents: "none" }}>
      <line
        x1={x}
        x2={x}
        y1={0}
        y2={innerHeight}
        stroke={color}
        strokeWidth={1.5}
      />
      {label != null && (
        <text
          x={x + 4}
          y={innerHeight - 4}
          textAnchor="start"
          style={emText(10)}
          fill={color}
        >
          {label}
        </text>
      )}
    </g>
  );
}
