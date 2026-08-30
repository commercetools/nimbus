import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ChartFrame } from "../../chart/chart-frame";
import { Legend } from "../../chart/legend";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { StackRow } from "../../chart/types";

export interface GroupedBarChartProps {
  width: number;
  height: number;
  /** Same shape as the stacked bar — a category with keyed segments. */
  data: StackRow[];
  ariaLabel?: string;
}

/**
 * Multi-series categorical comparison: series bars sit side by side within each
 * category. Colors come from the shared entity→color scale keyed by series id,
 * so a series keeps its color here, in the stacked bar, and in a line chart.
 * Hovering a series highlights it across every category.
 */
export function GroupedBarChart({
  width,
  height,
  data,
  ariaLabel,
}: GroupedBarChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{ cat: string; key: string } | null>(null);
  const keys = useMemo(() => data[0]?.segments.map((s) => s.key) ?? [], [data]);
  const colorForKey = useEntityColors(keys);
  const valueMax = useMemo(
    () => Math.max(0, ...data.flatMap((r) => r.segments.map((s) => s.value))),
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
        ariaLabel={ariaLabel ?? `Grouped bar chart, ${keys.length} series`}
      >
        {({ innerWidth, innerHeight }) => {
          const x0 = scaleBand({
            domain: data.map((d) => d.category),
            range: [0, innerWidth],
            padding: 0.2,
          });
          const x1 = scaleBand({
            domain: keys,
            range: [0, x0.bandwidth()],
            padding: 0.15,
          });
          const y = scaleLinear({
            domain: [0, valueMax],
            range: [innerHeight, 0],
            nice: true,
          });
          const bw = x1.bandwidth();
          const hb = hover
            ? data
                .find((d) => d.category === hover.cat)
                ?.segments.find((s) => s.key === hover.key)
            : null;
          return (
            <>
              <GridRows ticks={y.ticks(4)} y={(t) => y(t)} width={innerWidth} />
              <AxisLeft
                scale={y}
                numTicks={4}
                hideAxisLine
                hideTicks
                tickFormat={(v) => formatCompact(v as number)}
                tickLabelProps={leftTickLabel(theme)}
              />
              <AxisBottom
                scale={x0}
                top={innerHeight}
                stroke={theme.axis}
                hideTicks
                tickLabelProps={bottomTickLabel(theme)}
              />
              {data.map((row) => {
                const gx = x0(row.category) ?? 0;
                return (
                  <g key={row.category}>
                    {row.segments.map((seg) => {
                      const bx = gx + (x1(seg.key) ?? 0);
                      const bh = Math.max(0, innerHeight - y(seg.value));
                      const active = hover == null || hover.key === seg.key;
                      return (
                        <BarRounded
                          key={seg.key}
                          x={bx}
                          y={y(seg.value)}
                          width={bw}
                          height={bh}
                          radius={3}
                          top
                          fill={colorForKey(seg.key)}
                          opacity={active ? 1 : 0.35}
                          onMouseEnter={() =>
                            setHover({ cat: row.category, key: seg.key })
                          }
                          onMouseLeave={() => setHover(null)}
                        />
                      );
                    })}
                  </g>
                );
              })}
              {hover && hb && (
                <SvgTooltip
                  x={(x0(hover.cat) ?? 0) + (x1(hover.key) ?? 0) + bw / 2}
                  innerWidth={innerWidth}
                  top={Math.max(0, y(hb.value) - 4)}
                  lines={[hover.cat, `${hb.key}: ${formatCompact(hb.value)}`]}
                />
              )}
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
