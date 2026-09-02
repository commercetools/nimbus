import { useState } from "react";
import type { MouseEvent } from "react";
import { useChartScales } from "./scale-context";
import { useChartTheme } from "../theme";

/** Order two pixel positions into a `[lo, hi]` range clamped to `[min, max]`. */
export function orderRange(
  a: number,
  b: number,
  min: number,
  max: number
): [number, number] {
  const lo = Math.max(min, Math.min(a, b));
  const hi = Math.min(max, Math.max(a, b));
  return [lo, hi];
}

export interface BrushProps {
  /**
   * Fires on drag end with the selected **pixel** range, or `null` when cleared
   * (a click with no drag). Map it to a data domain with your own scale —
   * `xScale.invert(range[0])` — since the shared scale context exposes only
   * forward accessors.
   */
  onBrushEnd?: (range: [number, number] | null) => void;
  /** Fires continuously during the drag. */
  onBrush?: (range: [number, number] | null) => void;
  /** Minimum drag distance (px) to count as a selection rather than a click. */
  minPixels?: number;
}

/**
 * An overview+detail brush: drag across the plot to select an x-range. Composes
 * as a child of any chart that publishes the scale contract. Emits pixel ranges;
 * the consumer inverts them to a domain and re-renders the focused view.
 */
export function Brush({ onBrushEnd, onBrush, minPixels = 4 }: BrushProps) {
  const { innerWidth, innerHeight } = useChartScales();
  const theme = useChartTheme();
  const [start, setStart] = useState<number | null>(null);
  const [current, setCurrent] = useState<number | null>(null);

  const px = (e: MouseEvent<SVGRectElement>): number => {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientX - rect.left;
  };

  const range =
    start != null && current != null
      ? orderRange(start, current, 0, innerWidth)
      : null;
  const wide = range != null && range[1] - range[0] >= minPixels;

  return (
    <g>
      <rect
        x={0}
        y={0}
        width={innerWidth}
        height={innerHeight}
        fill="transparent"
        style={{ cursor: "crosshair" }}
        onMouseDown={(e) => {
          const x = px(e);
          setStart(x);
          setCurrent(x);
        }}
        onMouseMove={(e) => {
          if (start == null) return;
          const x = px(e);
          setCurrent(x);
          onBrush?.(orderRange(start, x, 0, innerWidth));
        }}
        onMouseUp={() => {
          onBrushEnd?.(wide ? range : null);
          setStart(null);
          setCurrent(null);
        }}
        onMouseLeave={() => {
          setStart(null);
          setCurrent(null);
        }}
      />
      {wide && range && (
        <rect
          x={range[0]}
          y={0}
          width={range[1] - range[0]}
          height={innerHeight}
          fill={theme.accent}
          fillOpacity={0.12}
          stroke={theme.accent}
          strokeOpacity={0.4}
          pointerEvents="none"
        />
      )}
    </g>
  );
}
