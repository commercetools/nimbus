import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";
import { emText } from "../chart/typography";

export interface ReferenceLineProps {
  /** Data value on the referenced axis (a number on the value axis; a number
   *  or Date on the position axis when `orientation="vertical"`). */
  value: number | Date;
  /**
   * "horizontal" (default) = a level across the VALUE axis (a target,
   * threshold, SLA); "vertical" = a marker on the POSITION axis (e.g. a
   * launch date). These names describe the axis being marked, not the
   * drawn line's screen direction — on a chart whose value axis runs along
   * x instead of y (`ChartScales.orientation === "horizontal"`, e.g.
   * `BarChart`'s ranked orientation), the SAME prop value keeps meaning
   * "value" / "position" and only the rendered line's screen direction
   * flips to match.
   */
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
  const {
    yScale,
    xScale,
    innerWidth,
    innerHeight,
    orientation: chartOrientation = "vertical",
  } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);
  const dash = dashed ? "4 3" : undefined;

  // `orientation` names the AXIS being marked ("horizontal" = value,
  // "vertical" = position); which of xScale/yScale is the value axis
  // depends on the chart's own orientation. A screen-vertical line is drawn
  // exactly when "is this the value axis?" and "is the chart's value axis
  // x?" agree (both true: value axis is x, draw vertical; both false: chart
  // is the default vertical-value shape and this is a position marker on
  // x, today's original behavior).
  const isValueAxis = orientation === "horizontal";
  const chartValueIsX = chartOrientation === "horizontal";
  const drawVertical = isValueAxis === chartValueIsX;

  if (drawVertical) {
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
          fill={theme.mutedInk}
        >
          {label}
        </text>
      )}
    </g>
  );
}
