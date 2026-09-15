import { useChartTheme } from "../theme";
import { emText } from "./typography";

/**
 * A value drawn directly on/next to a mark — a bar's end, a point, an arc's
 * midpoint — mirroring Recharts' `<LabelList>` (the capability behind
 * shadcn's `chart-*-label` variants). Real precedent already exists,
 * independently, in about ten charts (`bar-chart.tsx`'s horizontal branch,
 * `bullet-chart`, `diverging-bar-chart`, `waterfall-chart`, `funnel-chart`,
 * `lollipop-chart`, `dumbbell-chart`, `slope-chart`, `treemap`,
 * `heatmap`/`rfm-grid`/`cohort-triangle`) — all landing on the exact same
 * convention this component extracts: offset a few px from the mark, flip
 * the anchor by side, `dy="0.32em"` to center on the mark's own centerline,
 * `emText(size)` for consistent type. The *positioning* (where the offset
 * point is) stays per-chart — it depends on the mark's own geometry (a
 * bar's end vs. an arc's midpoint vs. a vertex) — only the *rendering* is
 * shared here.
 */
export interface ValueLabelProps {
  /** Anchor x — already offset from the mark's own edge/center by the caller. */
  x: number;
  /** Anchor y — the mark's own centerline; `dy="0.32em"` centers the text on it. */
  y: number;
  /** The formatted value/text to draw. */
  text: string;
  /** Which side of `x` the text grows from. Default `"middle"`. */
  anchor?: "start" | "end" | "middle";
  /** Font size in px. Default `11`, matching every existing hand-rolled site. */
  size?: number;
  /** Text color. Defaults to the theme's `ink` role. */
  color?: string;
}

export function ValueLabel({
  x,
  y,
  text,
  anchor = "middle",
  size = 11,
  color,
}: ValueLabelProps) {
  const theme = useChartTheme();
  return (
    <text
      x={x}
      y={y}
      dy="0.32em"
      textAnchor={anchor}
      style={emText(size)}
      fill={color ?? theme.ink}
    >
      {text}
    </text>
  );
}
