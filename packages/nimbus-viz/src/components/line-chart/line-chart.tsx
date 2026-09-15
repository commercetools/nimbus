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
import { strokeDasharrayFor } from "../../chart/stroke-styles";
import { useForcedColors } from "../../chart/use-forced-colors";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { Series, SeriesPoint } from "../../chart/types";
import { useControlledSelection } from "../../chart/interaction";
import type { InteractionProps } from "../../chart/interaction";
import { ValueLabel } from "../../chart/value-labels";

export interface LineChartProps<T = SeriesPoint> extends InteractionProps<T> {
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
  /**
   * Distinguish series by a `strokeDasharray` rhythm
   * (`chart/stroke-styles.ts`), in addition to color, so series stay
   * distinguishable without color alone — monochrome print, a photocopy,
   * or `forced-colors` mode. A fill `patternFill` (`chart/patterns.tsx`)
   * is not used here: `"line"` has no fill area at all, and `"area"`'s
   * fill is a light 16%-opacity wash under the stroke — too faint for a
   * texture to read — so the stroke's dash rhythm is the one non-color
   * channel for both variants. Default `false` (color only, unchanged).
   * Turned on automatically (regardless of this prop) when the OS is
   * already in a forced-colors context — see `useForcedColors`.
   */
  texture?: boolean;
  /**
   * Draw each series' formatted value directly past the end of its line --
   * `chart/value-labels.tsx`'s `ValueLabel`. Only the LAST point of each
   * series is labeled, not every point -- a label at every point of every
   * series would clutter badly for a chart whose whole point is a dense
   * trend line, so this follows `bump-chart.tsx`'s existing
   * end-of-series-label convention (there it labels series identity; here
   * it labels the series' latest value instead). A series is skipped when
   * its last point's `y` is `null` (a trailing gap) or when it's hidden by
   * the legend/`selection` filter. Turning this on also widens the chart's
   * right margin to leave room for the label text. Default `false` (no
   * change from today's rendering).
   */
  showValues?: boolean;
}

const toDate = (x: number | Date): Date =>
  x instanceof Date ? x : new Date(x);

// Same shape as `chart-frame.tsx`'s own `DEFAULT_MARGIN`, just with `right`
// widened to leave room for each series' end-of-line value label -- applied
// only when `showValues` is on, so the default (omitted) render keeps using
// `ChartFrame`'s own default margin untouched.
const SHOW_VALUES_MARGIN = { top: 12, right: 48, bottom: 28, left: 44 };

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
  selection,
  onSelectionChange,
  children,
  decimateThreshold,
  texture,
  showValues,
}: LineChartProps<T>) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const dateFmt = dateFormat ?? formatters.dayMonth;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;
  // Crossfilter-style semantics, matching `SelectionProps`'s own "linked
  // views / crossfilter" contract: an EMPTY selection means no filter --
  // every series shown (today's unchanged default). Clicking a legend item
  // toggles that series' id in/out of the selection; once non-empty, only
  // the series IN the selection are shown (so the first click filters down
  // to just that one; a second click on another item adds it; clicking a
  // selected item again removes it, shrinking back toward "empty = all").
  // Shift-click isolates -- jumps straight to a single-series selection
  // regardless of what was already selected. This is on by default (no prop
  // required); `selection`/`onSelectionChange` only make the set controlled.
  const [activeSelection, toggleSeries, isolateSeries] = useControlledSelection(
    selection,
    onSelectionChange
  );
  const isFiltering = activeSelection.size > 0;

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

  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // -- one system foreground color for every series, with the per-series
  // dash rhythm / pattern fill (below) as the only identity carrier.
  const colorFor = (i: number) =>
    forcedColors ? "CanvasText" : color(series[i].id);
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
      margin={showValues ? SHOW_VALUES_MARGIN : undefined}
      ariaLabel={
        ariaLabel ?? `Line chart of ${series.map((s) => s.label).join(", ")}`
      }
      legend={
        showLegend
          ? series.map((s, i) => ({ label: s.label, color: colorFor(i) }))
          : undefined
      }
      legendRenderItem={
        showLegend
          ? (item, i) => {
              const id = series[i].id;
              const visible = !isFiltering || activeSelection.has(id);
              return (
                <button
                  type="button"
                  onClick={(e) => {
                    if (e.shiftKey) isolateSeries(id);
                    else toggleSeries(id);
                  }}
                  aria-pressed={activeSelection.has(id)}
                  title="Click to show/hide -- shift-click to isolate"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: 0,
                    margin: 0,
                    border: "none",
                    background: "none",
                    font: "inherit",
                    color: "inherit",
                    cursor: "pointer",
                    // Dimming the whole button (text included) via `opacity`
                    // drops the label below WCAG contrast -- dim only the
                    // decorative swatch (below) and strike the label text
                    // instead, so "hidden" stays a real ≥4.5:1 contrast.
                    textDecoration: visible ? "none" : "line-through",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: item.color,
                      display: "inline-block",
                      opacity: visible ? 1 : 0.35,
                    }}
                  />
                  {item.label}
                </button>
              );
            }
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
              const visible = !isFiltering || activeSelection.has(s.id);
              const dash = effectiveTexture ? strokeDasharrayFor(i) : undefined;
              const lastPoint = s.data[s.data.length - 1];
              const lastY = lastPoint != null ? getY(lastPoint) : undefined;
              return (
                <g key={s.id}>
                  {variant === "area" ? (
                    <AreaClosed<T>
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
                      strokeDasharray={dash}
                      opacity={visible ? 1 : 0}
                    />
                  ) : (
                    <LinePath<T>
                      data={drawData[i]}
                      x={(p) => xScale(toDate(getX(p)))}
                      y={(p) => yScale(getY(p) ?? 0)}
                      opacity={visible ? 1 : 0}
                      curve={curveMonotoneX}
                      defined={(p) => getY(p) != null}
                      stroke={color}
                      strokeWidth={2}
                      strokeDasharray={dash}
                    />
                  )}
                  {showValues &&
                    visible &&
                    lastPoint != null &&
                    lastY != null && (
                      <ValueLabel
                        x={xScale(toDate(getX(lastPoint))) + 8}
                        y={yScale(lastY)}
                        text={valueFmt(lastY)}
                        anchor="start"
                      />
                    )}
                </g>
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
                  if (isFiltering && !activeSelection.has(s.id)) return null;
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
