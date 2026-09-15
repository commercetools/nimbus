import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { bandByIndex, valueDomain } from "../../chart/scales";
import { stackKeys } from "../../chart/stack";
import { devWarn } from "../../chart/dev-warn";
import {
  GridRows,
  bottomTickLabel,
  fitBandLabel,
  leftTickLabel,
} from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { StackRow } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";

export interface StackedBarChartProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** One `StackRow` per category (`{ category, segments: { key, value }[] }`);
   *  every row should carry the same segment keys, in the same order. */
  data: StackRow[];
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Format a value-axis number (tick labels + tooltip values). Overrides the
   *  locale/currency formatter from any surrounding ChartLocaleProvider. */
  valueFormat?: (n: number) => string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<StackRow>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<StackRow>;
  /** Overlays (ReferenceLine, ThresholdBand, TargetMarker, …) in plot space. */
  children?: ReactNode;
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
  valueFormat,
  onDatumClick,
  onDatumHover,
  children,
}: StackedBarChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);

  const keys = useMemo(() => stackKeys(data), [data]);
  const colorForKey = useEntityColors(keys);
  // A stack cannot encode a negative part: clamp every segment to 0 before it
  // enters the height/domain math (BC-2). Tooltip and data table below keep
  // reading the raw `data`, so a negative input is still visible there.
  const clampedData = useMemo(
    () =>
      data.map((r) => ({
        ...r,
        segments: r.segments.map((s) => ({
          ...s,
          value: Math.max(0, s.value),
        })),
      })),
    [data]
  );
  const hasNegative = data.some((r) => r.segments.some((s) => s.value < 0));
  if (hasNegative) {
    devWarn(
      "stacked-bar-chart:negative",
      "StackedBarChart: negative segment values are drawn as 0 (a stack cannot encode a negative part)."
    );
  }
  // The axis shows row TOTALS after clamping; valueDomain also widens a
  // degenerate all-zero/all-equal domain (BC-3) instead of collapsing to a
  // single point.
  const totalDomain = useMemo(
    () =>
      valueDomain(
        clampedData.map((r) => r.segments.reduce((s, seg) => s + seg.value, 0))
      ),
    [clampedData]
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
      ariaLabel={ariaLabel ?? `Stacked bar chart of ${data.length} categories`}
      legend={keys.map((k) => ({ label: k, color: colorForKey(k) }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = bandByIndex(
          data.map((d) => d.category),
          {
            range: [0, innerWidth],
            padding: 0.25,
          }
        );
        const yScale = scaleLinear({
          domain: totalDomain,
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = xScale.bandwidth;
        const hr = hover != null ? data[hover] : null;
        const hrTotal = hr
          ? hr.segments.reduce((s, seg) => s + seg.value, 0)
          : 0;
        return (
          <ChartScaleProvider
            value={{
              yScale,
              xScale: (v) => xScale.pos(Number(v)),
              xBandwidth: bw,
              innerWidth,
              innerHeight,
            }}
          >
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
              tickFormat={(v) => valueFmt(v as number)}
              tickLabelProps={leftTickLabel(theme)}
            />
            <AxisBottom
              scale={xScale.scale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) =>
                fitBandLabel(xScale.step)(xScale.tickFormat(String(v)))
              }
              tickLabelProps={bottomTickLabel(theme)}
            />
            {data.map((row, i) => {
              const x = xScale.pos(i);
              const dimmed = hover != null && hover !== i;
              const segments = clampedData[i].segments;
              const lastIdx = segments.length - 1;
              let cumulative = 0;
              return (
                <g
                  key={i}
                  opacity={dimmed ? 0.5 : 1}
                  onMouseEnter={() => {
                    setHover(i);
                    onDatumHover?.({ datum: row, index: i });
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => onDatumClick?.({ datum: row, index: i })}
                >
                  {segments.map((seg, si) => {
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
            {hr && hover != null && (
              <SvgTooltip
                x={xScale.pos(hover) + bw / 2}
                innerWidth={innerWidth}
                top={Math.max(0, yScale(hrTotal) - 4)}
                lines={[
                  hr.category,
                  `Total: ${valueFmt(hrTotal)}`,
                  ...hr.segments.map(
                    (seg) => `${seg.key}: ${valueFmt(seg.value)}`
                  ),
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
