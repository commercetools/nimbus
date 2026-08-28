import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ChartFrame } from "../../chart/chart-frame";
import { Legend } from "../../chart/legend";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { StackRow } from "../../chart/types";

export interface StackedBarChartProps {
  width: number;
  height: number;
  data: StackRow[];
  ariaLabel?: string;
}

/**
 * Part-to-whole (or composition-over-time). Segments stack per category, each
 * key a categorical color in fixed order, with a 2px surface gap between fills
 * and a rounded top on the topmost segment.
 */
export function StackedBarChart({
  width,
  height,
  data,
  ariaLabel,
}: StackedBarChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<string | null>(null);

  const keys = useMemo(() => data[0]?.segments.map((s) => s.key) ?? [], [data]);
  const colorForKey = useEntityColors(keys);
  const maxTotal = useMemo(
    () =>
      Math.max(
        0,
        ...data.map((r) => r.segments.reduce((s, seg) => s + seg.value, 0))
      ),
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const legendHeight = 26;
  const chartHeight = height - legendHeight;

  return (
    <div style={{ width, height }}>
      <ChartFrame
        width={width}
        height={chartHeight}
        margin={{ top: 12, right: 12, bottom: 28, left: 44 }}
        ariaLabel={
          ariaLabel ?? `Stacked bar chart of ${data.length} categories`
        }
      >
        {({ innerWidth, innerHeight }) => {
          const xScale = scaleBand({
            domain: data.map((d) => d.category),
            range: [0, innerWidth],
            padding: 0.25,
          });
          const yScale = scaleLinear({
            domain: [0, maxTotal],
            range: [innerHeight, 0],
            nice: true,
          });
          const bw = xScale.bandwidth();
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
                stroke={theme.axis}
                hideTicks
                tickLabelProps={bottomTickLabel(theme)}
              />
              {data.map((row) => {
                const x = xScale(row.category) ?? 0;
                const dimmed = hover != null && hover !== row.category;
                const lastIdx = row.segments.length - 1;
                let cumulative = 0;
                return (
                  <g
                    key={row.category}
                    opacity={dimmed ? 0.5 : 1}
                    onMouseEnter={() => setHover(row.category)}
                    onMouseLeave={() => setHover(null)}
                  >
                    {row.segments.map((seg, si) => {
                      const y0 = yScale(cumulative);
                      cumulative += seg.value;
                      const y1 = yScale(cumulative);
                      const h = Math.max(0, y0 - y1 - 2);
                      const color = colorForKey(seg.key);
                      return si === lastIdx ? (
                        <BarRounded
                          key={seg.key}
                          x={x}
                          y={y1}
                          width={bw}
                          height={h}
                          radius={4}
                          top
                          fill={color}
                        />
                      ) : (
                        <rect
                          key={seg.key}
                          x={x}
                          y={y1}
                          width={bw}
                          height={h}
                          fill={color}
                        />
                      );
                    })}
                  </g>
                );
              })}
            </>
          );
        }}
      </ChartFrame>
      <div style={{ paddingTop: 6 }}>
        <Legend
          items={keys.map((k) => ({ label: k, color: colorForKey(k) }))}
        />
      </div>
    </div>
  );
}
