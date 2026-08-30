import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";
import { emText } from "../chart/typography";

export interface ThresholdBandProps {
  /** One edge of the band, in data units. */
  from: number | Date;
  /** The other edge of the band, in data units. */
  to: number | Date;
  /** "horizontal" = a value-axis band (a healthy range); "vertical" = a
   *  position-axis band (a highlighted time window). */
  orientation?: "horizontal" | "vertical";
  variant?: OverlayVariant;
  label?: string;
}

const FILL_OPACITY = 0.12;

/**
 * A shaded region between two levels — a healthy range, an SLA window, a
 * forecast horizon. Low fill opacity so it reads as context behind the data
 * even when composed on top. Non-interactive.
 */
export function ThresholdBand({
  from,
  to,
  orientation = "horizontal",
  variant = "neutral",
  label,
}: ThresholdBandProps) {
  const { yScale, xScale, innerWidth, innerHeight } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);

  if (orientation === "vertical") {
    const x1 = xScale(from instanceof Date ? from : Number(from));
    const x2 = xScale(to instanceof Date ? to : Number(to));
    const left = Math.min(x1, x2);
    const w = Math.abs(x2 - x1);
    return (
      <g style={{ pointerEvents: "none" }}>
        <rect
          x={left}
          y={0}
          width={w}
          height={innerHeight}
          fill={color}
          fillOpacity={FILL_OPACITY}
        />
        {label != null && (
          <text
            x={left + 4}
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

  const y1 = yScale(Number(from));
  const y2 = yScale(Number(to));
  const top = Math.min(y1, y2);
  const h = Math.abs(y2 - y1);
  return (
    <g style={{ pointerEvents: "none" }}>
      <rect
        x={0}
        y={top}
        width={innerWidth}
        height={h}
        fill={color}
        fillOpacity={FILL_OPACITY}
      />
      {label != null && (
        <text
          x={innerWidth - 4}
          y={top + 12}
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
