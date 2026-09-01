import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { extent, max } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { nearestIndexByX } from "../../chart/nearest-x";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatDayMonth } from "../../chart/format";
import { useChartFormatters } from "../../chart/format-locale";
import type { Series, SeriesPoint } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";

export interface LineChartProps {
  width: number;
  height: number;
  series: Series[];
  variant?: "line" | "area";
  ariaLabel?: string;
  /** Layer-2 overlays (ReferenceLine, ThresholdBand, BenchmarkSeries…) drawn
   *  in the plot's coordinate space, on top of the series. */
  /** Format a value-axis number (tick labels + tooltip values). Overrides the
   *  locale/currency formatter from any surrounding ChartLocaleProvider. */
  valueFormat?: (n: number) => string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<SeriesPoint>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<SeriesPoint>;
  children?: ReactNode;
}

const toDate = (x: number | Date): Date =>
  x instanceof Date ? x : new Date(x);

/**
 * Time-series line (or filled area) for one or more series. Single y-axis
 * always. Legend present for ≥2 series. Crosshair + point markers + a value
 * readout on hover.
 */
export function LineChart({
  width,
  height,
  series,
  variant = "line",
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  children,
}: LineChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = useMemo(() => series.flatMap((s) => s.data), [series]);
  const xDomain = useMemo(
    () => extent(points, (p) => toDate(p.x)) as [Date, Date],
    [points]
  );
  const yMax = useMemo(() => max(points, (p) => p.y ?? 0) ?? 0, [points]);
  const color = useEntityColors(
    useMemo(() => series.map((s) => s.id), [series])
  );

  if (width <= 0 || height <= 0 || series.length === 0) return null;

  const colorFor = (i: number) => color(series[i].id);
  const showLegend = series.length >= 2;
  const table = {
    columns: ["Date", ...series.map((s) => s.label)],
    rows: series[0].data.map((pt, i) => [
      formatDayMonth(toDate(pt.x)),
      ...series.map((s) => s.data[i]?.y ?? ""),
    ]),
    summary: `Line chart, ${series.length} series over ${series[0].data.length} points.`,
  };
  const hoveredX =
    hoverIndex != null ? series[0].data[hoverIndex]?.x : undefined;

  return (
    <ChartContainer
      width={width}
      height={height}
      ariaLabel={
        ariaLabel ?? `Line chart of ${series.map((s) => s.label).join(", ")}`
      }
      legend={
        showLegend
          ? series.map((s, i) => ({ label: s.label, color: colorFor(i) }))
          : undefined
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleTime({ domain: xDomain, range: [0, innerWidth] });
        const yScale = scaleLinear({
          domain: [0, yMax],
          range: [innerHeight, 0],
          nice: true,
        });

        return (
          <ChartScaleProvider
            value={{
              yScale: (v) => yScale(v),
              xScale: (v) => xScale(v instanceof Date ? v : new Date(v)),
              xBandwidth: 0,
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
              scale={xScale}
              top={innerHeight}
              numTicks={Math.max(2, Math.min(6, Math.floor(innerWidth / 90)))}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => formatDayMonth(v as Date)}
              tickLabelProps={bottomTickLabel(theme)}
            />

            {series.map((s, i) => {
              const color = colorFor(i);
              return variant === "area" ? (
                <AreaClosed<SeriesPoint>
                  key={s.id}
                  data={s.data}
                  x={(p) => xScale(toDate(p.x))}
                  y={(p) => yScale(p.y ?? 0)}
                  yScale={yScale}
                  curve={curveMonotoneX}
                  defined={(p) => p.y != null}
                  fill={color}
                  fillOpacity={0.16}
                  stroke={color}
                  strokeWidth={2}
                />
              ) : (
                <LinePath<SeriesPoint>
                  key={s.id}
                  data={s.data}
                  x={(p) => xScale(toDate(p.x))}
                  y={(p) => yScale(p.y ?? 0)}
                  curve={curveMonotoneX}
                  defined={(p) => p.y != null}
                  stroke={color}
                  strokeWidth={2}
                />
              );
            })}

            {children}

            {hoverIndex != null && hoveredX != null && (
              <>
                <line
                  x1={xScale(toDate(hoveredX))}
                  x2={xScale(toDate(hoveredX))}
                  y1={0}
                  y2={innerHeight}
                  stroke={theme.axis}
                  strokeDasharray="3 3"
                />
                {series.map((s, i) => {
                  const p = s.data[hoverIndex];
                  if (!p || p.y == null) return null;
                  return (
                    <circle
                      key={s.id}
                      cx={xScale(toDate(p.x))}
                      cy={yScale(p.y)}
                      r={4}
                      fill={colorFor(i)}
                      stroke={theme.surface}
                      strokeWidth={2}
                    />
                  );
                })}
              </>
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
                const idx = nearestIndexByX(mx, xScale, series[0].data, (p) =>
                  toDate(p.x)
                );
                if (idx >= 0) {
                  setHoverIndex(idx);
                  // Multi-series: the hover model tracks a single x-index across
                  // all series, so we report the FIRST series's point at that
                  // index (matching the tooltip's lead line + readout).
                  onDatumHover?.({
                    datum: series[0].data[idx],
                    index: idx,
                    seriesId: series[0].id,
                  });
                }
              }}
              onMouseLeave={() => {
                setHoverIndex(null);
                onDatumHover?.(null);
              }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mx = e.clientX - rect.left;
                const idx = nearestIndexByX(mx, xScale, series[0].data, (p) =>
                  toDate(p.x)
                );
                // Click mirrors hover: report the FIRST series's point at the
                // resolved x-index.
                if (idx >= 0)
                  onDatumClick?.({
                    datum: series[0].data[idx],
                    index: idx,
                    seriesId: series[0].id,
                  });
              }}
            />

            {hoverIndex != null && hoveredX != null && (
              <SvgTooltip
                x={xScale(toDate(hoveredX))}
                innerWidth={innerWidth}
                lines={[
                  formatDayMonth(toDate(hoveredX)),
                  ...series.map((s) => {
                    const p = s.data[hoverIndex];
                    return `${s.label}: ${
                      p && p.y != null ? valueFmt(p.y) : "—"
                    }`;
                  }),
                ]}
              />
            )}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
