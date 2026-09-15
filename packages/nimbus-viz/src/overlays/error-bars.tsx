import { useChartScales } from "../chart/scale-context";
import { useChartTheme } from "../theme";
import { overlayColor } from "./variant";
import type { OverlayVariant } from "./variant";
import { mean, stddev, zForConfidence } from "../stats";

export interface ErrorBarPoint {
  x: number | Date;
  low: number;
  high: number;
}

/**
 * One point's raw samples instead of a precomputed `[low, high]` — the
 * interval is derived as mean ± `zForConfidence(confidence) · SE`
 * (SE = sample stddev / √n), the same z-approximation `regressionBand` uses.
 * A single sample (or none) has no meaningful spread, so both ends collapse
 * to the mean (or 0 for an empty sample).
 */
export interface ErrorBarSamplesPoint {
  x: number | Date;
  samples: number[];
  /** Confidence level for the mean's interval. Default 0.95. */
  confidence?: number;
}

export type ErrorBarInput = ErrorBarPoint | ErrorBarSamplesPoint;

function isSamplesPoint(p: ErrorBarInput): p is ErrorBarSamplesPoint {
  return "samples" in p;
}

/** Resolves either point shape to a `[low, high]` pair. */
function boundsOf(p: ErrorBarInput): ErrorBarPoint {
  if (!isSamplesPoint(p)) return p;
  const n = p.samples.length;
  const m = mean(p.samples) ?? 0;
  if (n < 2) return { x: p.x, low: m, high: m };
  const se = (stddev(p.samples) ?? 0) / Math.sqrt(n);
  const half = zForConfidence(p.confidence) * se;
  return { x: p.x, low: m - half, high: m + half };
}

export interface ErrorBarsProps {
  /** One entry per point — either a precomputed `[low, high]` pair, or raw
   *  `ErrorBarSamplesPoint` samples, from which a mean ± confidence-interval
   *  is derived. Mixing both shapes across points is fine. */
  points: ErrorBarInput[];
  variant?: OverlayVariant;
  /** Half-width of the end caps, in pixels. */
  capWidth?: number;
}

/**
 * Discrete uncertainty whiskers — a vertical line from `low` to `high` with end
 * caps at each x. Pairs with a line or bar to show the confidence interval /
 * spread behind each plotted value. Accepts either precomputed bounds or raw
 * samples per point (see `ErrorBarInput`).
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
      {points.map((raw, i) => {
        const p = boundsOf(raw);
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
