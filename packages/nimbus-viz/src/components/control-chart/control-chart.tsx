import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear, scaleTime } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { deviation, extent, mean } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { nearestIndexByX } from "../../chart/nearest-x";
import { useChartTheme } from "../../theme";
import { formatCompact, formatDayMonth } from "../../chart/format";
import type { Series, SeriesPoint } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface ControlChartProps {
  /** Plot width in pixels — supply from `ResponsiveContainer`. */
  width: number;
  /** Plot height in pixels — supply from `ResponsiveContainer`. */
  height: number;
  /** The measured process. The FIRST series is used; any others are ignored. */
  series: Series[];
  /** Center line. Defaults to the mean of the measured series. */
  center?: number;
  /** Upper control limit. Defaults to center + 3σ. */
  ucl?: number;
  /** Lower control limit. Defaults to center − 3σ. */
  lcl?: number;
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
}

const toDate = (x: number | Date): Date =>
  x instanceof Date ? x : new Date(x);

/**
 * A statistical process-control (SPC) chart: one measured time-series against a
 * center line and upper/lower control limits. Every reference level shares the
 * SINGLE value axis — a control chart never adds a second scale. Points that
 * breach a control limit are flagged with a larger `negative` marker; the mark
 * color carries the alarm, but the tooltip repeats it in text ("out of
 * control") so it is never color-only.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function ControlChart({
  width,
  height,
  series,
  center,
  ucl,
  lcl,
  ariaLabel,
  children,
}: ControlChartProps) {
  const theme = useChartTheme();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = useMemo<SeriesPoint[]>(() => series[0]?.data ?? [], [series]);
  const values = useMemo(
    () => points.map((p) => p.y).filter((y): y is number => y != null),
    [points]
  );

  const limits = useMemo(() => {
    const centerLine = center ?? mean(values) ?? 0;
    const sd = deviation(values) ?? 0;
    return {
      centerLine,
      upper: ucl ?? centerLine + 3 * sd,
      lower: lcl ?? centerLine - 3 * sd,
    };
  }, [values, center, ucl, lcl]);

  const xDomain = useMemo(
    () => extent(points, (p) => toDate(p.x)) as [Date, Date],
    [points]
  );
  const yDomain = useMemo<[number, number]>(() => {
    const all = [...values, limits.centerLine, limits.upper, limits.lower];
    return [Math.min(...all), Math.max(...all)];
  }, [values, limits]);

  if (width <= 0 || height <= 0 || points.length === 0) return null;

  const label = ariaLabel ?? `Control chart of ${series[0].label}`;
  const table = {
    columns: ["Date", "Value", "Status"],
    rows: points.map((p) => [
      formatDayMonth(toDate(p.x)),
      p.y ?? "",
      p.y != null && (p.y > limits.upper || p.y < limits.lower)
        ? "out of control"
        : "in control",
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 40, bottom: 28, left: 44 }}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleTime({ domain: xDomain, range: [0, innerWidth] });
        const yScale = scaleLinear({
          domain: yDomain,
          range: [innerHeight, 0],
          nice: true,
        });
        const isOut = (y: number) => y > limits.upper || y < limits.lower;
        const hovered = hoverIndex != null ? points[hoverIndex] : undefined;

        return (
          <ChartScaleProvider
            value={{ yScale, xScale, xBandwidth: 0, innerWidth, innerHeight }}
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

            {/* Control limits share the ONE value axis — SPC never adds a
                second. UCL/LCL are dashed (axis); the center line is solid
                (mutedInk). Right-edge labels stay in mutedInk, never a mark
                color. */}
            <line
              x1={0}
              x2={innerWidth}
              y1={yScale(limits.upper)}
              y2={yScale(limits.upper)}
              stroke={theme.axis}
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <line
              x1={0}
              x2={innerWidth}
              y1={yScale(limits.lower)}
              y2={yScale(limits.lower)}
              stroke={theme.axis}
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <line
              x1={0}
              x2={innerWidth}
              y1={yScale(limits.centerLine)}
              y2={yScale(limits.centerLine)}
              stroke={theme.mutedInk}
              strokeWidth={1}
            />
            {(
              [
                ["UCL", limits.upper],
                ["CL", limits.centerLine],
                ["LCL", limits.lower],
              ] as const
            ).map(([text, value]) => (
              <text
                key={text}
                x={innerWidth + 4}
                y={yScale(value)}
                dy="0.32em"
                style={emText(9)}
                fill={theme.mutedInk}
              >
                {text}
              </text>
            ))}

            {/* The measured process, one line on the single value axis. */}
            <LinePath<SeriesPoint>
              data={points}
              x={(p) => xScale(toDate(p.x))}
              y={(p) => yScale(p.y ?? 0)}
              curve={curveMonotoneX}
              defined={(p) => p.y != null}
              stroke={theme.accent}
              strokeWidth={2}
            />

            {points.map((p, i) => {
              if (p.y == null) return null;
              const out = isOut(p.y);
              return (
                <circle
                  key={i}
                  cx={xScale(toDate(p.x))}
                  cy={yScale(p.y)}
                  r={out ? 5 : 3}
                  fill={out ? theme.negative : theme.accent}
                  stroke={theme.surface}
                  strokeWidth={out ? 1.5 : 1}
                />
              );
            })}

            {hovered != null && hovered.y != null && (
              <line
                x1={xScale(toDate(hovered.x))}
                x2={xScale(toDate(hovered.x))}
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
                const rect = e.currentTarget.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const idx = nearestIndexByX(mx, xScale, points, (p) =>
                  toDate(p.x)
                );
                if (idx >= 0) setHoverIndex(idx);
              }}
              onMouseLeave={() => setHoverIndex(null)}
            />

            {hovered != null && hovered.y != null && (
              <SvgTooltip
                x={xScale(toDate(hovered.x))}
                innerWidth={innerWidth}
                lines={[
                  formatDayMonth(toDate(hovered.x)),
                  `${series[0].label}: ${formatCompact(hovered.y)}`,
                  ...(isOut(hovered.y) ? ["Out of control"] : []),
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
