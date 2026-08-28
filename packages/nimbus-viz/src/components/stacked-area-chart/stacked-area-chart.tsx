import { useMemo, useState } from "react";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaStack } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { extent } from "d3-array";
import { ChartFrame } from "../../chart/chart-frame";
import { Legend } from "../../chart/legend";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact, formatDayMonth } from "../../chart/format";
import type { Series } from "../../chart/types";

export interface StackedAreaChartProps {
  width: number;
  height: number;
  series: Series[];
  ariaLabel?: string;
}

/** A stack row: an x position (epoch ms) plus one numeric value per series id. */
interface StackDatum {
  x: number;
  [seriesId: string]: number;
}

const toDate = (x: number | Date): Date =>
  x instanceof Date ? x : new Date(x);

/**
 * Composition over time: multiple series stacked as filled areas on a single
 * value axis. Fixed-order categorical fills at 0.85 opacity, each banded by a
 * 1px surface stroke so adjacent layers stay legible. Legend for ≥2 series;
 * a vertical crosshair with a per-series value readout on hover.
 */
export function StackedAreaChart({
  width,
  height,
  series,
  ariaLabel,
}: StackedAreaChartProps) {
  const theme = useChartTheme();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const keys = useMemo(() => series.map((s) => s.id), [series]);
  const rows = useMemo<StackDatum[]>(() => {
    const base = series[0]?.data ?? [];
    return base.map((pt, i) => {
      const row: StackDatum = { x: +toDate(pt.x) };
      for (const s of series) row[s.id] = s.data[i]?.y ?? 0;
      return row;
    });
  }, [series]);
  const xDomain = useMemo(
    () => extent(rows, (r) => new Date(r.x)) as [Date, Date],
    [rows]
  );
  const maxTotal = useMemo(
    () =>
      Math.max(0, ...rows.map((r) => keys.reduce((sum, k) => sum + r[k], 0))),
    [rows, keys]
  );
  const color = useEntityColors(keys);

  if (width <= 0 || height <= 0 || series.length === 0 || rows.length === 0)
    return null;

  const showLegend = series.length >= 2;
  const legendHeight = showLegend ? 26 : 0;
  const chartHeight = height - legendHeight;
  const n = rows.length;
  const hoveredX = hoverIndex != null ? rows[hoverIndex]?.x : undefined;

  return (
    <div style={{ width, height }}>
      <ChartFrame
        width={width}
        height={chartHeight}
        ariaLabel={
          ariaLabel ??
          `Stacked area chart of ${series.map((s) => s.label).join(", ")}`
        }
      >
        {({ innerWidth, innerHeight }) => {
          const xScale = scaleTime({ domain: xDomain, range: [0, innerWidth] });
          const yScale = scaleLinear({
            domain: [0, maxTotal],
            range: [innerHeight, 0],
            nice: true,
          });

          return (
            <>
              <GridRows
                ticks={yScale.ticks(4)}
                y={(t) => yScale(t)}
                width={innerWidth}
              />
              <AxisLeft
                scale={yScale}
                numTicks={4}
                hideAxisLine
                hideTicks
                tickFormat={(v) => formatCompact(v as number)}
                tickLabelProps={leftTickLabel(theme)}
              />
              <AxisBottom
                scale={xScale}
                top={innerHeight}
                numTicks={Math.max(2, Math.min(6, Math.floor(innerWidth / 90)))}
                stroke={theme.axis}
                hideTicks
                tickFormat={(v) => formatDayMonth(v as Date)}
                tickLabelProps={bottomTickLabel(theme)}
              />

              <AreaStack<StackDatum, string>
                data={rows}
                keys={keys}
                value={(d, key) => d[key]}
                x={(d) => xScale(new Date(d.data.x))}
                y0={(d) => yScale(d[0])}
                y1={(d) => yScale(d[1])}
                curve={curveMonotoneX}
              >
                {({ stacks, path }) =>
                  stacks.map((stack) => (
                    <path
                      key={stack.key}
                      d={path(stack) || ""}
                      fill={color(stack.key)}
                      fillOpacity={0.85}
                      stroke={theme.surface}
                      strokeWidth={1}
                    />
                  ))
                }
              </AreaStack>

              {hoverIndex != null && hoveredX != null && (
                <line
                  x1={xScale(new Date(hoveredX))}
                  x2={xScale(new Date(hoveredX))}
                  y1={0}
                  y2={innerHeight}
                  stroke={theme.axis}
                  strokeDasharray="3 3"
                />
              )}

              <rect
                x={0}
                y={0}
                width={innerWidth}
                height={innerHeight}
                fill="transparent"
                onMouseMove={(e) => {
                  const box = e.currentTarget.getBoundingClientRect();
                  const mx = e.clientX - box.left;
                  if (n <= 1) {
                    setHoverIndex(0);
                    return;
                  }
                  const idx = Math.round((mx / innerWidth) * (n - 1));
                  setHoverIndex(Math.max(0, Math.min(n - 1, idx)));
                }}
                onMouseLeave={() => setHoverIndex(null)}
              />

              {hoverIndex != null && hoveredX != null && (
                <SvgTooltip
                  x={xScale(new Date(hoveredX))}
                  innerWidth={innerWidth}
                  lines={[
                    formatDayMonth(new Date(hoveredX)),
                    ...series.map((s) => {
                      const p = s.data[hoverIndex];
                      return `${s.label}: ${
                        p && p.y != null ? formatCompact(p.y) : "—"
                      }`;
                    }),
                  ]}
                />
              )}
            </>
          );
        }}
      </ChartFrame>

      {showLegend && (
        <div style={{ paddingTop: 6 }}>
          <Legend
            items={series.map((s) => ({ label: s.label, color: color(s.id) }))}
          />
        </div>
      )}
    </div>
  );
}
