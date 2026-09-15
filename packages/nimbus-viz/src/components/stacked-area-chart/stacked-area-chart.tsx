import { useCallback, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaStack } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "@visx/curve";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { valueDomain } from "../../chart/scales";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { nearestIndexByX } from "../../chart/nearest-x";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import { ChartPatternDefs, patternFill } from "../../chart/patterns";
import { useForcedColors } from "../../chart/use-forced-colors";
import { lttb } from "../../chart/decimate";
import type { Series, SeriesPoint } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";
import { ValueLabel } from "../../chart/value-labels";

export interface StackedAreaChartProps<T = SeriesPoint> {
  /** Plot width in pixels — supply from `ResponsiveContainer`. */
  width: number;
  /** Plot height in pixels — supply from `ResponsiveContainer`. */
  height: number;
  /** Series stacked bottom-to-top, aligned by index and sharing x positions.
   *  Each point is a `SeriesPoint` (`{ x, y }`) unless you pass `x`/`y`
   *  accessors for a custom point row type. */
  series: Series<T>[];
  /** x accessor. Defaults to `d.x` (the SeriesPoint shape). Required for a custom point row type. */
  x?: (d: T) => number | Date;
  /** y accessor. Defaults to `d.y`. Required for a custom point row type. */
  y?: (d: T) => number | null | undefined;
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Format a value-axis number (tick labels + tooltip values). Overrides the
   *  locale/currency formatter from any surrounding ChartLocaleProvider. */
  valueFormat?: (n: number) => string;
  /** Fired when a datum (the full stacked row at that x) is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<StackDatum>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<StackDatum>;
  /** Overlays (ReferenceLine, TrendLine, Annotation, …) rendered in plot space. */
  children?: ReactNode;
  /** Formats date displays (axis ticks, tooltip dates). Defaults to a locale-aware short month+day formatter (e.g. `Aug 28`); overrides any surrounding `ChartLocaleProvider`. */
  dateFormat?: (d: Date) => string;
  /**
   * Fill each series' area with a per-series SVG texture (`chart/patterns.tsx`)
   * in addition to its color, so layers stay distinguishable by shape alone
   * — monochrome print, a photocopy, or `forced-colors` mode. Default
   * `false` (color only, unchanged). Turned on automatically (regardless
   * of this prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
  /**
   * Downsample the DRAWN stack once it exceeds this many rows, via LTTB
   * (`chart/decimate.ts`) run against each row's stacked total (the
   * visually dominant curve — the top of the stack). Keeps the visually
   * significant rows (peaks, troughs, inflections) so the shape doesn't
   * visibly change. The axis domain, hover readout, and data table still
   * read every row regardless — only the `AreaStack`'s own `data` is
   * thinned. Omit for no decimation (today's default: every row drawn).
   */
  decimateThreshold?: number;
  /**
   * Label each band with its OWN value (not the stacked position) at the
   * chart's right edge — one `chart/value-labels.tsx` `ValueLabel` per
   * series, centered on that series' own band at the LAST x position, with
   * the text growing rightward past the plot (widens the right margin to
   * fit it). A continuous stacked curve has no obvious label point along its
   * length the way a bar's end or a point's marker does, but the right edge
   * — the most recent x — is the one place every band's vertical extent is
   * deterministic and non-overlapping: `offset="diverging"` (see `series`
   * above) keeps series in the SAME fixed stacking order at every x, so nothing
   * here reorders layers the way `Streamgraph`'s wiggle/insideout stacking
   * does. The one residual edge case is the same one every other `showValues`
   * chart already has and doesn't guard against either: a series whose raw
   * value is exactly (or near) 0 at that last x collapses to a sliver, and its
   * label sits on the seam with its neighbor. Default `false` — omitting it
   * renders exactly as before this existed.
   */
  showValues?: boolean;
}

/** A stack row: an x position (epoch ms) plus one numeric value per series id. */
export interface StackDatum {
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
 *
 * Generic over the point row type `T`: pass `x`/`y` accessors to feed your own
 * domain rows directly; both default to the built-in `SeriesPoint` shape. The
 * interaction payload (`StackDatum`, the whole stacked row) is unaffected by
 * `T` — it's derived internally, not the raw input row.
 */
export function StackedAreaChart(
  props: StackedAreaChartProps<SeriesPoint>
): ReactElement | null;
export function StackedAreaChart<T>(
  props: StackedAreaChartProps<T> &
    Required<Pick<StackedAreaChartProps<T>, "x" | "y">>
): ReactElement | null;
export function StackedAreaChart<T = SeriesPoint>({
  width,
  height,
  series,
  x,
  y,
  ariaLabel,
  dateFormat,
  valueFormat,
  onDatumClick,
  onDatumHover,
  children,
  texture,
  decimateThreshold,
  showValues,
}: StackedAreaChartProps<T>) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const dateFmt = dateFormat ?? formatters.dayMonth;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;

  const getX = useCallback(
    (d: T): number | Date => (x ? x(d) : (d as SeriesPoint).x),
    [x]
  );
  const getY = useCallback(
    (d: T): number | null | undefined => (y ? y(d) : (d as SeriesPoint).y),
    [y]
  );

  const keys = useMemo(() => series.map((s) => s.id), [series]);
  const rows = useMemo<StackDatum[]>(() => {
    const base = series[0]?.data ?? [];
    return base.map((pt, i) => {
      const row: StackDatum = { x: +toDate(getX(pt)) };
      for (const s of series) row[s.id] = getY(s.data[i]) ?? 0;
      return row;
    });
  }, [series, getX, getY]);
  // Downsample only the drawn path (LTTB against each row's stacked total --
  // the top of the stack, the visually dominant curve); the domain, hover,
  // and table above/below all keep reading the full `rows`.
  const drawRows = useMemo(() => {
    if (!decimateThreshold || rows.length <= decimateThreshold) return rows;
    const wrapped = rows.map((r) => ({
      x: r.x,
      y: keys.reduce((sum, k) => sum + r[k], 0),
      original: r,
    }));
    return lttb(wrapped, decimateThreshold).map((w) => w.original);
  }, [rows, keys, decimateThreshold]);
  const xDomain = useMemo(
    () => extent(rows, (r) => new Date(r.x)) as [Date, Date],
    [rows]
  );
  // Diverging stack offset (@visx/shape's offset="diverging", wrapping d3's
  // stackOffsetDiverging): positive series values accumulate upward from 0,
  // negative values accumulate downward from 0 -- so a negative series value
  // (a return, a write-off) is drawn on the correct side of the baseline
  // instead of being clamped to 0. The value axis has to span each row's full
  // positive and negative extent, not just its net total (which can be
  // smaller in magnitude than either side); valueDomain() also widens a
  // degenerate all-zero/all-equal domain (BC-3).
  const totalDomain = useMemo(
    () =>
      valueDomain(
        rows.flatMap((r) => {
          let pos = 0;
          let neg = 0;
          for (const k of keys) {
            const v = r[k];
            if (v >= 0) pos += v;
            else neg += v;
          }
          return [pos, neg];
        })
      ),
    [rows, keys]
  );
  const rawColor = useEntityColors(keys);
  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // -- one system foreground color for every series, with the per-series
  // pattern kind (below) as the only identity carrier.
  const color = (k: string) => (forcedColors ? "CanvasText" : rawColor(k));

  if (width <= 0 || height <= 0 || series.length === 0 || rows.length === 0)
    return null;

  const showLegend = series.length >= 2;
  const hoveredX = hoverIndex != null ? rows[hoverIndex]?.x : undefined;
  const table = {
    columns: ["Date", ...series.map((s) => s.label)],
    rows: rows.map((r) => [dateFmt(new Date(r.x)), ...keys.map((k) => r[k])]),
  };

  // Unchanged (16px, ChartFrame's own DEFAULT_MARGIN) unless `showValues`
  // needs room for the end labels growing past the right edge — same
  // reservation `dumbbell-chart.tsx`/`lollipop-chart.tsx` make for the same
  // "one value label past a mark's end" shape.
  const MARGIN = { top: 12, right: showValues ? 48 : 16, bottom: 28, left: 44 };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={MARGIN}
      ariaLabel={
        ariaLabel ??
        `Stacked area chart of ${series.map((s) => s.label).join(", ")}`
      }
      legend={
        showLegend
          ? series.map((s) => ({ label: s.label, color: color(s.id) }))
          : undefined
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleTime({ domain: xDomain, range: [0, innerWidth] });
        const yScale = scaleLinear({
          domain: totalDomain,
          range: [innerHeight, 0],
          nice: true,
        });

        return (
          <ChartScaleProvider
            value={{ yScale, xScale, xBandwidth: 0, innerWidth, innerHeight }}
          >
            {effectiveTexture && (
              <ChartPatternDefs colors={keys.map((k) => color(k))} />
            )}
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

            <AreaStack<StackDatum, string>
              data={drawRows}
              keys={keys}
              offset="diverging"
              value={(d, key) => d[key]}
              x={(d) => xScale(new Date(d.data.x))}
              y0={(d) => yScale(d[0])}
              y1={(d) => yScale(d[1])}
              curve={curveMonotoneX}
            >
              {({ stacks, path }) => (
                <>
                  {stacks.map((stack) => (
                    <path
                      key={stack.key}
                      d={path(stack) || ""}
                      fill={
                        effectiveTexture
                          ? patternFill(keys.indexOf(stack.key))
                          : color(stack.key)
                      }
                      fillOpacity={0.85}
                      stroke={theme.surface}
                      strokeWidth={1}
                    />
                  ))}
                  {showValues &&
                    stacks.map((stack) => {
                      // Last point of THIS stack (drawRows' last row) --
                      // `lttb` always preserves the first/last raw points,
                      // so this is the same right edge the path itself ends
                      // at, decimated or not.
                      const last = stack[stack.length - 1];
                      if (!last) return null;
                      return (
                        <ValueLabel
                          key={`value-${stack.key}`}
                          x={xScale(new Date(last.data.x)) + 6}
                          y={(yScale(last[0]) + yScale(last[1])) / 2}
                          text={valueFmt(last.data[stack.key])}
                          anchor="start"
                        />
                      );
                    })}
                </>
              )}
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
                const idx = nearestIndexByX(
                  mx,
                  xScale,
                  rows,
                  (r) => new Date(r.x)
                );
                if (idx >= 0) {
                  setHoverIndex(idx);
                  onDatumHover?.({ datum: rows[idx], index: idx });
                }
              }}
              onMouseLeave={() => {
                setHoverIndex(null);
                onDatumHover?.(null);
              }}
              onClick={(e) => {
                const box = e.currentTarget.getBoundingClientRect();
                const mx = e.clientX - box.left;
                const idx = nearestIndexByX(
                  mx,
                  xScale,
                  rows,
                  (r) => new Date(r.x)
                );
                if (idx >= 0) onDatumClick?.({ datum: rows[idx], index: idx });
              }}
            />

            {hoverIndex != null && hoveredX != null && (
              <SvgTooltip
                x={xScale(new Date(hoveredX))}
                innerWidth={innerWidth}
                lines={[
                  dateFmt(new Date(hoveredX)),
                  ...series.map((s) => {
                    const p = s.data[hoverIndex];
                    const py = p != null ? getY(p) : undefined;
                    return `${s.label}: ${py != null ? valueFmt(py) : "—"}`;
                  }),
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
