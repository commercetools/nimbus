import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scalePoint } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact, formatDayMonth } from "../../chart/format";
import type { Series } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface BumpChartProps {
  width: number;
  height: number;
  series: Series[];
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
}

/** One series' rank at a single x-index (rank 1 = highest y). */
interface RankPoint {
  i: number;
  rank: number;
}

const fmtX = (x: number | Date): string =>
  x instanceof Date ? formatDayMonth(x) : formatCompact(x);

/**
 * Rank-over-time. At each x the series are ranked by their y value (1 = best);
 * the y-axis plots rank inverted (rank 1 at top), so lines that rise are
 * climbing the ranking. One smooth line per series (fixed-order categorical
 * hue), a dot at each rank, and a direct ink label at each series' last point —
 * so identity never rides on color alone and no legend is needed.
 */
export function BumpChart({
  width,
  height,
  series,
  ariaLabel,
  children,
}: BumpChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{ si: number; i: number } | null>(null);
  const color = useEntityColors(
    useMemo(() => series.map((s) => s.id), [series])
  );

  const n = useMemo(
    () => series.reduce((m, s) => Math.max(m, s.data.length), 0),
    [series]
  );

  const ranked = useMemo(() => {
    const perSeries = series.map((s) => ({
      id: s.id,
      label: s.label,
      points: [] as RankPoint[],
    }));
    for (let i = 0; i < n; i++) {
      const column = series
        .map((s, si) => ({ si, y: s.data[i]?.y }))
        .filter((d): d is { si: number; y: number } => d.y != null)
        .sort((a, b) => b.y - a.y);
      column.forEach((d, rankIdx) => {
        perSeries[d.si].points.push({ i, rank: rankIdx + 1 });
      });
    }
    return perSeries;
  }, [series, n]);

  if (width <= 0 || height <= 0 || series.length === 0) return null;

  const table = {
    columns: ["Series", "Latest value", "Latest rank"],
    rows: ranked.map((s, si) => [
      s.label,
      series[si].data[series[si].data.length - 1]?.y ?? "",
      s.points[s.points.length - 1]?.rank ?? "",
    ]),
  };

  const ranks = Array.from({ length: series.length }, (_, k) => k + 1);
  const indices = Array.from({ length: n }, (_, k) => k);
  const step = Math.max(1, Math.ceil(n / 6));
  const tickIndices = indices.filter((k) => k % step === 0);

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 96, bottom: 28, left: 32 }}
      ariaLabel={
        ariaLabel ??
        `Bump chart ranking ${series.map((s) => s.label).join(", ")} over time`
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scalePoint<number>({
          domain: indices,
          range: [0, innerWidth],
          padding: 0.5,
        });
        const yScale = scalePoint<number>({
          domain: ranks,
          range: [0, innerHeight],
          padding: 0.5,
        });
        const px = (i: number) => xScale(i) ?? 0;
        const py = (rank: number) => yScale(rank) ?? 0;

        return (
          <ChartScaleProvider
            value={{
              yScale: (v) => yScale(v) ?? 0,
              xScale: (v) => xScale(Number(v)) ?? 0,
              xBandwidth: 0,
              innerWidth,
              innerHeight,
            }}
          >
            <GridRows ticks={ranks} y={py} width={innerWidth} />
            <AxisLeft
              scale={yScale}
              hideAxisLine
              hideTicks
              tickFormat={(v) => `#${Number(v)}`}
              tickLabelProps={leftTickLabel(theme)}
            />
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              tickValues={tickIndices}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => {
                const x = series[0]?.data[Number(v)]?.x;
                return x != null ? fmtX(x) : `${Number(v)}`;
              }}
              tickLabelProps={bottomTickLabel(theme)}
            />

            {ranked.map((s, si) => {
              const stroke = color(s.id);
              const last = s.points[s.points.length - 1];
              const dimmed = hover != null && hover.si !== si;
              return (
                <g key={s.id} opacity={dimmed ? 0.3 : 1}>
                  <LinePath<RankPoint>
                    data={s.points}
                    x={(d) => px(d.i)}
                    y={(d) => py(d.rank)}
                    curve={curveMonotoneX}
                    stroke={stroke}
                    strokeWidth={hover?.si === si ? 3 : 2}
                    fill="none"
                  />
                  {s.points.map((d) => (
                    <circle
                      key={d.i}
                      cx={px(d.i)}
                      cy={py(d.rank)}
                      r={hover?.si === si && hover?.i === d.i ? 6 : 4}
                      fill={stroke}
                      stroke={theme.surface}
                      strokeWidth={1.5}
                      onMouseEnter={() => setHover({ si, i: d.i })}
                      onMouseLeave={() => setHover(null)}
                    />
                  ))}
                  {last && (
                    <text
                      x={px(last.i) + 10}
                      y={py(last.rank)}
                      dy={4}
                      style={emText(11)}
                      fill={theme.ink}
                    >
                      {s.label}
                    </text>
                  )}
                </g>
              );
            })}
            {hover &&
              (() => {
                const rp = ranked[hover.si]?.points.find(
                  (p) => p.i === hover.i
                );
                const datum = series[hover.si]?.data[hover.i];
                if (!rp || !datum || datum.y == null) return null;
                return (
                  <SvgTooltip
                    x={px(hover.i)}
                    innerWidth={innerWidth}
                    top={Math.max(0, py(rp.rank) - 8)}
                    lines={[
                      series[hover.si].label,
                      `Rank #${rp.rank}`,
                      `${fmtX(datum.x)}: ${formatCompact(datum.y)}`,
                    ]}
                  />
                );
              })()}
            {children}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
