import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";
import { emText } from "../chart/typography";

export interface TargetMarkerProps {
  /** The target value on the value axis. */
  value: number;
  variant?: OverlayVariant;
  label?: string;
}

/**
 * A goal indicator anchored to the value axis — a caret pointing at the target
 * level from the left edge, plus a faint guide tick. Distinct from
 * `ReferenceLine`: it marks a point on the axis rather than drawing a full-width
 * line, so it reads as "the goal is here" over bars without occluding them.
 */
export function TargetMarker({
  value,
  variant = "accent",
  label,
}: TargetMarkerProps) {
  const { yScale, innerWidth } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);
  const y = yScale(value);
  const s = 5;

  return (
    <g style={{ pointerEvents: "none" }}>
      {/* Faint full-width guide so the caret's level is readable across bars. */}
      <line
        x1={0}
        x2={innerWidth}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="2 3"
        opacity={0.6}
      />
      {/* Right-pointing caret at the left edge. */}
      <path d={`M 0 ${y - s} L ${s} ${y} L 0 ${y + s} Z`} fill={color} />
      {label != null && (
        <text
          x={s + 4}
          y={y}
          dy="0.32em"
          textAnchor="start"
          style={emText(10)}
          fontFamily="system-ui, sans-serif"
          fill={theme.mutedInk}
        >
          {label}
        </text>
      )}
    </g>
  );
}
