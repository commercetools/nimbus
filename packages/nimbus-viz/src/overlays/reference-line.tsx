import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";
import { emText } from "../chart/typography";

export interface ReferenceLineProps {
  /** Data value on the referenced axis (a number on the value axis; a number
   *  or Date on the position axis when `orientation="vertical"`). */
  value: number | Date;
  /** "horizontal" = a level across the value axis; "vertical" = a marker on
   *  the position axis (e.g. a launch date). */
  orientation?: "horizontal" | "vertical";
  variant?: OverlayVariant;
  dashed?: boolean;
  label?: string;
}

/**
 * A single reference level drawn across the plot — a target, threshold, or SLA
 * line. Composes as a child of any chart that publishes the scale contract.
 * Non-interactive (never steals hover from the marks beneath).
 */
export function ReferenceLine({
  value,
  orientation = "horizontal",
  variant = "neutral",
  dashed = true,
  label,
}: ReferenceLineProps) {
  const { yScale, xScale, innerWidth, innerHeight } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);
  const dash = dashed ? "4 3" : undefined;

  if (orientation === "vertical") {
    const x = xScale(value instanceof Date ? value : Number(value));
    return (
      <g style={{ pointerEvents: "none" }}>
        <line
          x1={x}
          x2={x}
          y1={0}
          y2={innerHeight}
          stroke={color}
          strokeWidth={1.5}
          strokeDasharray={dash}
        />
        {label != null && (
          <text
            x={x + 4}
            y={10}
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

  const y = yScale(Number(value));
  return (
    <g style={{ pointerEvents: "none" }}>
      <line
        x1={0}
        x2={innerWidth}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={1.5}
        strokeDasharray={dash}
      />
      {label != null && (
        <text
          x={innerWidth}
          y={y - 4}
          textAnchor="end"
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
