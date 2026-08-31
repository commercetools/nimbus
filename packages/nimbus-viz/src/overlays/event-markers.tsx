import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";
import { emText } from "../chart/typography";

export interface EventMarkerDatum {
  /** Position on the x axis (number or Date). */
  x: number | Date;
  /** Optional flag label. */
  label?: string;
}

export interface EventMarkersProps {
  events: readonly EventMarkerDatum[];
  variant?: OverlayVariant;
}

/**
 * Vertical event flags on a timeline (deploys, campaigns, incidents). One dashed
 * rule per event with an optional label at the top. Non-interactive.
 */
export function EventMarkers({
  events,
  variant = "neutral",
}: EventMarkersProps) {
  const { xScale, innerHeight } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);
  return (
    <g style={{ pointerEvents: "none" }}>
      {events.map((e, i) => {
        const x = xScale(e.x instanceof Date ? e.x : Number(e.x));
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1={0}
              y2={innerHeight}
              stroke={color}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            {e.label != null && (
              <text
                x={x + 3}
                y={10}
                textAnchor="start"
                style={emText(10)}
                fill={theme.mutedInk}
              >
                {e.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}
