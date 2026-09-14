import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { bandByIndex } from "../../chart/scales";
import { stackKeys } from "../../chart/stack";
import {
  GridRows,
  bottomTickLabel,
  fitBandLabel,
  leftTickLabel,
} from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { StackRow, StackSegment } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";

export interface GroupedBarChartProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Same shape as the stacked bar — a category with keyed segments. All rows
   *  must share the same segment `key` set (the first row defines the series). */
  data: StackRow[];
  /** Accessible label for the SVG; state the takeaway, not every value. */
  ariaLabel?: string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<StackSegment>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<StackSegment>;
  /** Overlays (ReferenceLine, ThresholdBand, TargetMarker, …) in plot space. */
  children?: ReactNode;
}

/**
 * Multi-series categorical comparison: series bars sit side by side within each
 * category. Colors come from the shared entity→color scale keyed by series id,
 * so a series keeps its color here, in the stacked bar, and in a line chart.
 * Hovering a series highlights it across every category.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function GroupedBarChart({
  width,
  height,
  data,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  children,
}: GroupedBarChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{ i: number; key: string } | null>(null);
  const keys = useMemo(() => stackKeys(data), [data]);
  const colorForKey = useEntityColors(keys);
  const valueMax = useMemo(
    () => Math.max(0, ...data.flatMap((r) => r.segments.map((s) => s.value))),
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const table = {
    columns: ["Category", ...keys],
    rows: data.map((r) => [
      r.category,
      ...keys.map((k) => r.segments.find((s) => s.key === k)?.value ?? 0),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 12, bottom: 28, left: 44 }}
      ariaLabel={ariaLabel ?? `Grouped bar chart, ${keys.length} series`}
      legend={keys.map((k) => ({ label: k, color: colorForKey(k) }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const x0 = bandByIndex(
          data.map((d) => d.category),
          {
            range: [0, innerWidth],
            padding: 0.2,
          }
        );
        const x1 = bandByIndex(keys, {
          range: [0, x0.bandwidth],
          padding: 0.15,
        });
        const y = scaleLinear({
          domain: [0, valueMax],
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = x1.bandwidth;
        const hb = hover
          ? data[hover.i]?.segments.find((s) => s.key === hover.key)
          : null;
        return (
          <ChartScaleProvider
            value={{
              yScale: y,
              xScale: (v) => x0.pos(Number(v)),
              xBandwidth: x0.bandwidth,
              innerWidth,
              innerHeight,
            }}
          >
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
              scale={x0.scale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) =>
                fitBandLabel(x0.step)(x0.tickFormat(String(v)))
              }
              tickLabelProps={bottomTickLabel(theme)}
            />
            {data.map((row, i) => {
              const gx = x0.pos(i);
              return (
                <g key={i}>
                  {row.segments.map((seg) => {
                    const bx = gx + x1.pos(keys.indexOf(seg.key));
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
                        onMouseEnter={() => {
                          setHover({ i, key: seg.key });
                          // index = the category index; datum = the raw segment.
                          onDatumHover?.({
                            datum: seg,
                            index: i,
                            seriesId: seg.key,
                          });
                        }}
                        onMouseLeave={() => {
                          setHover(null);
                          onDatumHover?.(null);
                        }}
                        onClick={() =>
                          onDatumClick?.({
                            datum: seg,
                            index: i,
                            seriesId: seg.key,
                          })
                        }
                      />
                    );
                  })}
                </g>
              );
            })}
            {hover && hb && (
              <SvgTooltip
                x={x0.pos(hover.i) + x1.pos(keys.indexOf(hover.key)) + bw / 2}
                innerWidth={innerWidth}
                top={Math.max(0, y(hb.value) - 4)}
                lines={[
                  data[hover.i]?.category ?? "",
                  `${hb.key}: ${formatCompact(hb.value)}`,
                ]}
              />
            )}
            {children}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
