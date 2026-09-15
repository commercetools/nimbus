import { useCallback, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { bandByIndex, valueDomain } from "../../chart/scales";
import { stackKeys } from "../../chart/stack";
import {
  GridRows,
  bottomTickLabel,
  fitBandLabel,
  leftTickLabel,
} from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import { ChartPatternDefs, patternFill } from "../../chart/patterns";
import { useForcedColors } from "../../chart/use-forced-colors";
import type { StackRow, StackSegment } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";
import { clamp, plotPointerPosition } from "../../chart/pointer";
import { ValueLabel } from "../../chart/value-labels";

export interface StackedBarChartProps<T = StackRow> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** One row per category; every row should carry the same segment keys, in
   *  the same order. Each row is a `StackRow` (`{ category, segments: {
   *  key, value }[] }`) unless you pass `category`/`segments` accessors for
   *  a custom row type. */
  data: T[];
  /** Category-label accessor. Defaults to `d.category` (the StackRow shape). Required for a custom row type. */
  category?: (d: T) => string;
  /** Segments accessor. Defaults to `d.segments`. Required for a custom row type. */
  segments?: (d: T) => StackSegment[];
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<T>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<T>;
  /** Overlays (ReferenceLine, ThresholdBand, TargetMarker, …) in plot space. */
  children?: ReactNode;
  /**
   * Fill each segment with a per-key SVG texture (`chart/patterns.tsx`) in
   * addition to its color, so segments stay distinguishable by shape alone
   * — monochrome print, a photocopy, or `forced-colors` mode. Default
   * `false` (color only, unchanged). Turned on automatically (regardless
   * of this prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
  /**
   * Draw each stack's net total directly above the top of the whole
   * bar (above its topmost segment, not per-segment — a label on every
   * segment of a tall stack would clutter it) — `chart/value-labels.tsx`'s
   * `ValueLabel`, same convention `bar-chart.tsx` uses at a single bar's
   * end. Default `false` (no change from today's rendering).
   */
  showValues?: boolean;
  /**
   * `"expand"` normalizes every row to its own total (a 100%-stacked /
   * percent chart) instead of the shared value axis every row draws
   * against today — each row's segments are divided by that row's own
   * total absolute magnitude before the diverging stack offset runs, so
   * the same "positive segments up from 0, negative segments down from 0"
   * geometry still applies, just on fractions instead of raw values. The
   * value axis becomes a fixed `[0, 1]` domain (or `[-1, 1]` if any row
   * has a negative segment), formatted as a percentage, rather than a
   * domain derived from the data's magnitudes. The legend, tooltip, table,
   * and `showValues` labels still show real, un-normalized values — only
   * the bar geometry and axis change. Default `"none"` (today's rendering,
   * unchanged).
   */
  offset?: "none" | "expand";
}

/**
 * Part-to-whole (or composition-over-time). Segments stack per category, each
 * key a categorical color in fixed order, with a 2px surface gap between fills
 * and a rounded top on the topmost segment.
 *
 * Generic over the row type `T`: pass `category`/`segments` accessors to feed
 * your own domain rows directly; both default to the built-in `StackRow`
 * shape.
 */
export function StackedBarChart(
  props: StackedBarChartProps<StackRow>
): ReactElement | null;
export function StackedBarChart<T>(
  props: StackedBarChartProps<T> &
    Required<Pick<StackedBarChartProps<T>, "category" | "segments">>
): ReactElement | null;
export function StackedBarChart<T = StackRow>({
  width,
  height,
  data,
  category,
  segments,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  children,
  texture,
  showValues,
  offset = "none",
}: StackedBarChartProps<T>) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);
  // Live pointer y (plot-local), while a stack is being hovered by the
  // mouse -- null once the pointer leaves, so the tooltip falls back to
  // the hovered stack's own value-derived position rather than a stale
  // coordinate from a previous hover.
  const [pointerY, setPointerY] = useState<number | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;

  const getCat = useCallback(
    (d: T): string => (category ? category(d) : (d as StackRow).category),
    [category]
  );
  const getSeg = useCallback(
    (d: T): StackSegment[] =>
      segments ? segments(d) : (d as StackRow).segments,
    [segments]
  );

  const keys = useMemo(() => stackKeys(data, getSeg), [data, getSeg]);
  const color = useEntityColors(keys);
  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // -- one system foreground color for every key, with the per-key pattern
  // kind (below) as the only identity carrier.
  const colorForKey = (k: string) => (forcedColors ? "CanvasText" : color(k));
  const isExpand = offset === "expand";
  // Each row's own total absolute magnitude -- the "100%" a percent-stacked
  // row normalizes against. `|| 1` guards an all-zero row from dividing by
  // zero (matches `posTotal`/the accumulator below, which would otherwise
  // draw NaN geometry for that one row). Always `1` outside "expand" mode,
  // so every call site below is a no-op division when `offset` is omitted.
  const rowMagnitude = (row: T): number => {
    if (!isExpand) return 1;
    return getSeg(row).reduce((s, seg) => s + Math.abs(seg.value), 0) || 1;
  };
  // Diverging stack offset: positive segments accumulate upward from 0,
  // negative segments accumulate downward from 0, each in the order given —
  // so a negative segment (a return, a write-off) is drawn on the correct
  // side of the baseline instead of being clamped to 0. The value axis has to
  // span each row's full positive and negative extent, not just its net
  // total (which can be smaller in magnitude than either side); valueDomain()
  // also widens a degenerate all-zero/all-equal domain (BC-3).
  //
  // "expand" mode normalizes each row by its own magnitude BEFORE this same
  // accumulation, so every row's positive/negative extent always lands
  // inside a fixed [0, 1] / [-1, 1] shape -- bypass valueDomain() (which
  // derives a domain FROM the data's magnitudes) for that fixed shape
  // instead; only its polarity (does any row have a negative segment) is a
  // real one-bit inspection of the data, not a magnitude.
  const hasNegativeAnywhere = useMemo(
    () => data.some((r) => getSeg(r).some((seg) => seg.value < 0)),
    [data, getSeg]
  );
  const totalDomain = useMemo((): [number, number] => {
    if (isExpand) return hasNegativeAnywhere ? [-1, 1] : [0, 1];
    return valueDomain(
      data.flatMap((r) => {
        let pos = 0;
        let neg = 0;
        for (const seg of getSeg(r)) {
          if (seg.value >= 0) pos += seg.value;
          else neg += seg.value;
        }
        return [pos, neg];
      })
    );
  }, [data, getSeg, isExpand, hasNegativeAnywhere]);

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const table = {
    columns: ["Category", ...keys],
    rows: data.map((r) => [
      getCat(r),
      ...keys.map((k) => getSeg(r).find((s) => s.key === k)?.value ?? 0),
    ]),
  };

  // Named so the pointer math below (which needs the same left/top offset
  // xScale/yScale are drawn relative to) can never drift from what's
  // actually passed to ChartContainer.
  const MARGIN = { top: 12, right: 12, bottom: 28, left: 44 };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={MARGIN}
      ariaLabel={ariaLabel ?? `Stacked bar chart of ${data.length} categories`}
      legend={keys.map((k) => ({ label: k, color: colorForKey(k) }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = bandByIndex(
          data.map((d) => getCat(d)),
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
          ? getSeg(hr).reduce((s, seg) => s + seg.value, 0)
          : 0;
        // Positive segments' running sum -- the top of the visual bar, which
        // for a mixed-sign row is not the same point as the net total. In
        // "expand" mode this is the top of the NORMALIZED bar (a fraction),
        // matching what's actually drawn, not the row's raw positive sum.
        const posTotal = (row: T) =>
          getSeg(row).reduce((s, seg) => s + Math.max(0, seg.value), 0) /
          rowMagnitude(row);
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
            {effectiveTexture && (
              <ChartPatternDefs colors={keys.map((k) => colorForKey(k))} />
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
              tickFormat={(v) =>
                isExpand
                  ? formatters.percent(v as number)
                  : valueFmt(v as number)
              }
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
              // Outline every segment of the hovered stack; never dim the
              // other stacks (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` --
              // the one shared convention, replacing a per-chart "dim
              // everyone else" opacity ternary).
              const isHovered = hover === i;
              const segs = getSeg(row);
              // "expand" mode normalizes every segment by this row's own
              // magnitude before the same diverging accumulation below runs
              // -- a no-op division (mag === 1) outside that mode.
              const mag = rowMagnitude(row);
              // Diverging stack offset: positive segments accumulate upward
              // from 0, negative segments accumulate downward from 0, each in
              // the order given -- a negative segment (a return, a
              // write-off) lands on the correct side of the baseline instead
              // of being clamped to 0. Track which segment ends up at each
              // visual extreme so only that one gets a rounded corner.
              let posAcc = 0;
              let negAcc = 0;
              let topIdx = -1;
              let bottomIdx = -1;
              const bars = segs.map((seg, si) => {
                let lo: number;
                let hi: number;
                const v = seg.value / mag;
                const positive = seg.value >= 0;
                if (positive) {
                  lo = posAcc;
                  posAcc += v;
                  hi = posAcc;
                  topIdx = si;
                } else {
                  hi = negAcc;
                  negAcc += v;
                  lo = negAcc;
                  bottomIdx = si;
                }
                return { seg, lo, hi, positive };
              });
              return (
                <g
                  key={i}
                  onMouseEnter={(e) => {
                    setHover(i);
                    const p = plotPointerPosition(e, MARGIN);
                    if (p) setPointerY(p.y);
                    onDatumHover?.({ datum: row, index: i });
                  }}
                  onMouseMove={(e) => {
                    const p = plotPointerPosition(e, MARGIN);
                    if (p) setPointerY(p.y);
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    setPointerY(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => onDatumClick?.({ datum: row, index: i })}
                >
                  {bars.map(({ seg, lo, hi, positive }, si) => {
                    const y0 = yScale(lo);
                    const y1 = yScale(hi);
                    const h = Math.max(0, y0 - y1 - 2);
                    // The 2px cosmetic gap always sits at the edge nearest
                    // zero (the previous segment, or the baseline itself):
                    // for a positive segment that is the bottom edge, so the
                    // rect is unchanged; for a negative segment it is the
                    // TOP edge (y1, which sits at or just past zero), so the
                    // rect starts 2px lower instead of shrinking from y1.
                    const barY = positive ? y1 : y1 + 2;
                    const fillColor = effectiveTexture
                      ? patternFill(keys.indexOf(seg.key))
                      : colorForKey(seg.key);
                    const rounded = si === topIdx || si === bottomIdx;
                    return rounded ? (
                      <BarRounded
                        key={seg.key}
                        x={x}
                        y={barY}
                        width={bw}
                        height={h}
                        radius={4}
                        top={si === topIdx}
                        bottom={si === bottomIdx}
                        fill={fillColor}
                        stroke={isHovered ? theme.ink : "none"}
                        strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
                      />
                    ) : (
                      <rect
                        key={seg.key}
                        x={x}
                        y={barY}
                        width={bw}
                        height={h}
                        fill={fillColor}
                        stroke={isHovered ? theme.ink : "none"}
                        strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
                      />
                    );
                  })}
                  {showValues && (
                    <ValueLabel
                      x={x + bw / 2}
                      y={yScale(posTotal(row)) - 6}
                      text={valueFmt(segs.reduce((s, seg) => s + seg.value, 0))}
                    />
                  )}
                </g>
              );
            })}
            {hr && hover != null && (
              <SvgTooltip
                x={xScale.pos(hover) + bw / 2}
                innerWidth={innerWidth}
                top={
                  // Live pointer y while the mouse is the hover source;
                  // falls back to the stack's own top-of-bar position
                  // otherwise.
                  pointerY != null
                    ? clamp(pointerY, innerHeight)
                    : Math.max(0, yScale(posTotal(hr)) - 4)
                }
                lines={[
                  getCat(hr),
                  `Total: ${valueFmt(hrTotal)}`,
                  // Each segment's row carries a dot matching its own key's
                  // color -- ties the tooltip row back to the segment
                  // without cross-referencing the legend (`chart/svg-tooltip.tsx`'s
                  // `SvgTooltipLine`).
                  ...getSeg(hr).map((seg) => ({
                    text: `${seg.key}: ${valueFmt(seg.value)}`,
                    color: colorForKey(seg.key),
                  })),
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
