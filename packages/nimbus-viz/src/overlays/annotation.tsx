import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";
import { emText } from "../chart/typography";
import { MIN_MARKER } from "../chart/marks";

export interface AnnotationProps {
  /** Anchor x in data space (number on a linear/log axis, Date on a time axis). */
  x: number | Date;
  /** Anchor y on the value axis. */
  y: number;
  /** Callout text. */
  label: string;
  variant?: OverlayVariant;
  /** Callout offset from the anchor, in px. Sign of `dx` sets the text side. */
  dx?: number;
  dy?: number;
}

/**
 * A point annotation: a ringed marker at a specific `(x, y)` with a leader line
 * to an offset text callout ("this spike = outage"). Composes as a child of any
 * chart publishing the scale contract; non-interactive.
 */
export function Annotation({
  x,
  y,
  label,
  variant = "accent",
  dx = 12,
  dy = -18,
}: AnnotationProps) {
  const { xScale, yScale } = useChartScales();
  const theme = useChartTheme();
  const color = overlayColor(theme, variant);
  const px = xScale(x instanceof Date ? x : Number(x));
  const py = yScale(y);
  const tx = px + dx;
  const ty = py + dy;
  const side = dx >= 0 ? "start" : "end";
  return (
    <g style={{ pointerEvents: "none" }}>
      <line x1={px} y1={py} x2={tx} y2={ty} stroke={color} strokeWidth={1} />
      <circle
        cx={px}
        cy={py}
        r={MIN_MARKER / 2}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={tx + (dx >= 0 ? 2 : -2)}
        y={ty}
        textAnchor={side}
        dominantBaseline="middle"
        style={emText(10)}
        fill={theme.ink}
      >
        {label}
      </text>
    </g>
  );
}
