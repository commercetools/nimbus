import { useCallback, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaClosed, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { extent, max, min } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { nearestIndexByX } from "../../chart/nearest-x";
import { lttb } from "../../chart/decimate";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { Series, SeriesPoint } from "../../chart/types";
import type { DatumInteractionProps } from "../../chart/interaction";

export interface LineChartProps<
  T = SeriesPoint,
> extends DatumInteractionProps<T> {
  /** Plot width in pixels — supply from `ResponsiveContainer`. */
  width: number;
  /** Plot height in pixels — supply from `ResponsiveContainer`. */
  height: number;
  /** One or more labelled series drawn on a single shared value axis. Each
   *  point is a `SeriesPoint` (`{ x, y }`) unless you pass `x`/`y` accessors
   *  for a custom point row type. */
  series: Series<T>[];
  /** x accessor. Defaults to `d.x` (the SeriesPoint shape). Required for a custom point row type. */
  x?: (d: T) => number | Date;
  /** y accessor. Defaults to `d.y`. Required for a custom point row type. */
  y?: (d: T) => number | null | undefined;
  /** Draw each series as a stroked line (default) or a filled area. */
  variant?: "line" | "area";
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /** Layer-2 overlays (ReferenceLine, ThresholdBand, BenchmarkSeries…) drawn
   *  in the plot's coordinate space, on top of the series. */
  children?: ReactNode;
  /** Formats date displays (axis ticks, tooltip dates). Defaults to a locale-aware short month+day formatter (e.g. `Aug 28`); overrides any surrounding `ChartLocaleProvider`. */
  dateFormat?: (d: Date) => string;
  /**
   * When a series has more points than this, the DRAWN line/area (only —
   * axes, hover, tooltip, and the data table still read every point) is
   * downsampled via LTTB (`chart/decimate.ts`) to about this many points,
   * keeping the visually significant ones (peaks, troughs, inflections) so
   * the shape doesn't visibly change. Omit for no decimation — every point
   * is drawn (today's default, unchanged).
   */
  decimateThreshold?: number;
}

const toDate = (x: number | Date): Date =>
  x instanceof Date ? x : new Date(x);

/**
 * Time-series line (or filled area) for one or more series. Single y-axis
 * always. Legend present for ≥2 series. Crosshair + point markers + a value
 * readout on hover.
 *
 * Generic over the point row type `T`: pass `x`/`y` accessors to feed your own
 * domain rows directly; both default to the built-in `SeriesPoint` shape.
 */
export function LineChart(
  props: LineChartProps<SeriesPoint>
): ReactElement | null;
export function LineChart<T>(
  props: LineChartProps<T> & Required<Pick<LineChartProps<T>, "x" | "y">>
): ReactElement | null;
export function LineChart<T = SeriesPoint>({
  width,
  height,
  series,
  x,
  y,
  variant = "line",
  ariaLabel,
  dateFormat,
  valueFormat,
  onDatumClick,
  onDatumHover,
  children,
  decimateThreshold,
}: LineChartProps<T>) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const dateFmt = dateFormat ?? formatters.dayMonth;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const getX = useCallback(
    (d: T): number | Date => (x ? x(d) : (d as SeriesPoint).x),
    [x]
  );
  const getY = useCallback(
    (d: T): number | null | undefined => (y ? y(d) : (d as SeriesPoint).y),
    [y]
  );

  const points = useMemo(() => series.flatMap((s) => s.data), [series]);
  const xDomain = useMemo(
    () => extent(points, (p) => toDate(getX(p))) as [Date, Date],
    [points, getX]
  );
  const yMax = useMemo(
    () => max(points, (p) => getY(p) ?? 0) ?? 0,
    [points, getY]
  );
  const yMin = useMemo(
    () => min(points, (p) => getY(p) ?? 0) ?? 0,
    [points, getY]
  );
  const color = useEntityColors(
    useMemo(() => series.map((s) => s.id), [series])
  );
  // Decimation only trims the DRAWN path -- the domain above, the hover
  // overlay, and the table below all still read every point of `series`.
  const drawData = useMemo(() => {
    if (decimateThreshold == null) return series.map((s) => s.data);
    return series.map((s) => {
      if (s.data.length <= decimateThreshold) return s.data;
      const wrapped = s.data.map((p) => ({
        x: +toDate(getX(p)),
        y: getY(p) ?? 0,
        original: p,
      }));
      return lttb(wrapped, decimateThreshold).map((w) => w.original);
    });
  }, [series, decimateThreshold, getX, getY]);

  if (width <= 0 || height <= 0 || series.length === 0) return null;

  const colorFor = (i: number) => color(series[i].id);
  const showLegend = series.length >= 2;
  const table = {
    columns: ["Date", ...series.map((s) => s.label)],
    rows: series[0].data.map((pt, i) => [
      dateFmt(toDate(getX(pt))),
      ...series.map((s) => {
        const v = s.data[i] != null ? getY(s.data[i]) : undefined;
        return v ?? "";
      }),
    ]),
    summary: `Line chart, ${series.length} series over ${series[0].data.length} points.`,
  };
  const hoveredX = hoverIndex != null ? series[0].data[hoverIndex] : undefined;

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
          domain: [Math.min(0, yMin), Math.max(0, yMax)],
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
              tickFormat={(v) => dateFmt(v as Date)}
              tickLabelProps={bottomTickLabel(theme)}
            />

            {series.map((s, i) => {
              const color = colorFor(i);
              return variant === "area" ? (
                <AreaClosed<T>
                  key={s.id}
                  data={drawData[i]}
                  x={(p) => xScale(toDate(getX(p)))}
                  y={(p) => yScale(getY(p) ?? 0)}
                  y0={() => yScale(0)}
                  yScale={yScale}
                  curve={curveMonotoneX}
                  defined={(p) => getY(p) != null}
                  fill={color}
                  fillOpacity={0.16}
                  stroke={color}
                  strokeWidth={2}
                />
              ) : (
                <LinePath<T>
                  key={s.id}
                  data={drawData[i]}
                  x={(p) => xScale(toDate(getX(p)))}
                  y={(p) => yScale(getY(p) ?? 0)}
                  curve={curveMonotoneX}
                  defined={(p) => getY(p) != null}
                  stroke={color}
                  strokeWidth={2}
                />
              );
            })}

            {children}

            {hoverIndex != null && hoveredX != null && (
              <>
                <line
                  x1={xScale(toDate(getX(hoveredX)))}
                  x2={xScale(toDate(getX(hoveredX)))}
                  y1={0}
                  y2={innerHeight}
                  stroke={theme.axis}
                  strokeDasharray="3 3"
                />
                {series.map((s, i) => {
                  const p = s.data[hoverIndex];
                  const py = p != null ? getY(p) : undefined;
                  if (!p || py == null) return null;
                  return (
                    <circle
                      key={s.id}
                      cx={xScale(toDate(getX(p)))}
                      cy={yScale(py)}
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
                  toDate(getX(p))
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
                  toDate(getX(p))
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
                x={xScale(toDate(getX(hoveredX)))}
                innerWidth={innerWidth}
                lines={[
                  dateFmt(toDate(getX(hoveredX))),
                  ...series.map((s) => {
                    const p = s.data[hoverIndex];
                    const py = p != null ? getY(p) : undefined;
                    return `${s.label}: ${py != null ? valueFmt(py) : "—"}`;
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
