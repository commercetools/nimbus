import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { extent } from "d3-array";
import { useChartTheme } from "../../theme";
import type { SeriesPoint } from "../../chart/types";

export interface SparklineProps {
  width: number;
  height: number;
  data: SeriesPoint[];
  /** Draw an accent dot at the last point. */
  showEndDot?: boolean;
  ariaLabel?: string;
}

const PAD = 4;

/** Point paired with its original index, keeping only non-null y. */
interface Defined {
  i: number;
  y: number;
}

/**
 * A micro line for inline placement (table cell, KPI tile): no axes, no
 * gridlines, no tick labels — just a single accent stroke, faint min/max
 * markers, and an optional end dot. Points are evenly spaced by index.
 */
export function Sparkline({
  width,
  height,
  data,
  showEndDot = true,
  ariaLabel,
}: SparklineProps) {
  const theme = useChartTheme();

  const defined = useMemo(
    () =>
      data
        .map((p, i) => ({ i, y: p.y }))
        .filter((d): d is Defined => d.y != null),
    [data]
  );
  const yDomain = useMemo(
    () => extent(defined, (d) => d.y) as [number, number],
    [defined]
  );
  const extrema = useMemo(() => {
    if (defined.length === 0) return null;
    let lo = defined[0];
    let hi = defined[0];
    for (const d of defined) {
      if (d.y < lo.y) lo = d;
      if (d.y > hi.y) hi = d;
    }
    return { lo, hi };
  }, [defined]);

  if (width <= 0 || height <= 0 || defined.length === 0) return null;

  const innerW = Math.max(0, width - 2 * PAD);
  const innerH = Math.max(0, height - 2 * PAD);
  const xScale = scaleLinear({
    domain: [0, Math.max(1, data.length - 1)],
    range: [0, innerW],
  });
  const yScale = scaleLinear({
    domain: yDomain,
    range: [innerH, 0],
    nice: true,
  });
  const last = defined[defined.length - 1];

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label={ariaLabel ?? "Sparkline"}
    >
      <Group left={PAD} top={PAD}>
        <LinePath<Defined>
          data={defined}
          x={(d) => xScale(d.i)}
          y={(d) => yScale(d.y)}
          curve={curveMonotoneX}
          stroke={theme.accent}
          strokeWidth={1.5}
          fill="none"
        />
        {extrema && (
          <>
            <circle
              cx={xScale(extrema.hi.i)}
              cy={yScale(extrema.hi.y)}
              r={2}
              fill={theme.mutedInk}
              fillOpacity={0.6}
            />
            <circle
              cx={xScale(extrema.lo.i)}
              cy={yScale(extrema.lo.y)}
              r={2}
              fill={theme.mutedInk}
              fillOpacity={0.6}
            />
          </>
        )}
        {showEndDot && (
          <circle
            cx={xScale(last.i)}
            cy={yScale(last.y)}
            r={2.5}
            fill={theme.accent}
            stroke={theme.surface}
            strokeWidth={1}
          />
        )}
      </Group>
    </svg>
  );
}
