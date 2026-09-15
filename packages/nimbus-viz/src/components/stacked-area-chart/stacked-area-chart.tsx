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
import type { Series, SeriesPoint } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";

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
}: StackedAreaChartProps<T>) {
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

  const keys = useMemo(() => series.map((s) => s.id), [series]);
  const rows = useMemo<StackDatum[]>(() => {
    const base = series[0]?.data ?? [];
    return base.map((pt, i) => {
      const row: StackDatum = { x: +toDate(getX(pt)) };
      for (const s of series) row[s.id] = getY(s.data[i]) ?? 0;
      return row;
    });
  }, [series, getX, getY]);
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
  const color = useEntityColors(keys);

  if (width <= 0 || height <= 0 || series.length === 0 || rows.length === 0)
    return null;

  const showLegend = series.length >= 2;
  const hoveredX = hoverIndex != null ? rows[hoverIndex]?.x : undefined;
  const table = {
    columns: ["Date", ...series.map((s) => s.label)],
    rows: rows.map((r) => [dateFmt(new Date(r.x)), ...keys.map((k) => r[k])]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
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
              data={rows}
              keys={keys}
              offset="diverging"
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
