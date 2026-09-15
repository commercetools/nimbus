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
import type { LegendItem } from "../../chart/legend";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";
import { clamp, plotPointerPosition } from "../../chart/pointer";

export interface GroupedBarChartProps<T = StackRow> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Same shape as the stacked bar — a category with keyed segments. All rows
   *  must share the same segment `key` set (the first row defines the
   *  series). Each row is a `StackRow` (`{ category, segments }`) unless you
   *  pass `category`/`segments` accessors for a custom row type. */
  data: T[];
  /** Category-label accessor. Defaults to `d.category` (the StackRow shape). Required for a custom row type. */
  category?: (d: T) => string;
  /** Segments accessor. Defaults to `d.segments`. Required for a custom row type. */
  segments?: (d: T) => StackSegment[];
  /** Accessible label for the SVG; state the takeaway, not every value. */
  ariaLabel?: string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<StackSegment>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<StackSegment>;
  /** Overlays (ReferenceLine, ThresholdBand, TargetMarker, …) in plot space. */
  children?: ReactNode;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /**
   * Escape hatch for a fully custom hover tooltip (rich formatting, an extra
   * metric, a "view orders" affordance) instead of the default two-line
   * `lines` readout. Called with the hovered bar's segment and its row
   * index; return the SVG content to draw inside the tooltip box. See
   * `renderTooltipSize` to size the box for your content.
   */
  renderTooltip?: (datum: StackSegment, index: number) => ReactNode;
  /** Box size reserved for `renderTooltip`'s content. Default `{ width: 160, height: 40 }`. */
  renderTooltipSize?: { width: number; height: number };
  /**
   * Escape hatch for a custom render of each legend item (a different marker
   * shape, a value beside the label, a click-to-toggle affordance) — see
   * `Legend`'s own `renderItem`. The default swatch + series key is used
   * when omitted.
   */
  renderLegendItem?: (item: LegendItem, index: number) => ReactNode;
  /**
   * Fill each series' bar with a per-key SVG texture (`chart/patterns.tsx`)
   * in addition to its color, so series stay distinguishable by shape alone
   * — monochrome print, a photocopy, or `forced-colors` mode. Default
   * `false` (color only, unchanged). Turned on automatically (regardless of
   * this prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
}

/**
 * Multi-series categorical comparison: series bars sit side by side within each
 * category. Colors come from the shared entity→color scale keyed by series id,
 * so a series keeps its color here, in the stacked bar, and in a line chart.
 * Hovering a series highlights it across every category.
 *
 * Generic over the row type `T`: pass `category`/`segments` accessors to feed
 * your own domain rows directly; both default to the built-in `StackRow`
 * shape. The interaction payload (`StackSegment`, the individual bar) is
 * unaffected by `T`.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function GroupedBarChart(
  props: GroupedBarChartProps<StackRow>
): ReactElement | null;
export function GroupedBarChart<T>(
  props: GroupedBarChartProps<T> &
    Required<Pick<GroupedBarChartProps<T>, "category" | "segments">>
): ReactElement | null;
export function GroupedBarChart<T = StackRow>({
  width,
  height,
  data,
  category,
  segments,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  children,
  valueFormat,
  renderTooltip,
  renderTooltipSize = { width: 160, height: 40 },
  renderLegendItem,
  texture,
}: GroupedBarChartProps<T>) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<{ i: number; key: string } | null>(null);
  // Live pointer y (plot-local), while a bar is being hovered by the mouse --
  // null once the pointer leaves, so the tooltip falls back to the hovered
  // segment's own value-derived position rather than a stale coordinate.
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
  const values = useMemo(
    () => data.flatMap((r) => getSeg(r).map((s) => s.value)),
    [data, getSeg]
  );
  const valueRange = useMemo(() => valueDomain(values), [values]);
  const hasNegative = useMemo(() => values.some((v) => v < 0), [values]);

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
      ariaLabel={ariaLabel ?? `Grouped bar chart, ${keys.length} series`}
      legend={keys.map((k) => ({ label: k, color: colorForKey(k) }))}
      legendRenderItem={renderLegendItem}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const x0 = bandByIndex(
          data.map((d) => getCat(d)),
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
          domain: valueRange,
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = x1.bandwidth;
        const zeroY = y(0);
        const hoverRow = hover != null ? data[hover.i] : undefined;
        const hb =
          hover != null && hoverRow != null
            ? getSeg(hoverRow).find((s) => s.key === hover.key)
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
            {effectiveTexture && (
              <ChartPatternDefs colors={keys.map((k) => colorForKey(k))} />
            )}
            <GridRows ticks={y.ticks(4)} y={(t) => y(t)} width={innerWidth} />
            <AxisLeft
              scale={y}
              numTicks={4}
              hideAxisLine
              hideTicks
              tickFormat={(v) => valueFmt(v as number)}
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
                  {getSeg(row).map((seg) => {
                    const bx = gx + x1.pos(keys.indexOf(seg.key));
                    const yVal = y(seg.value);
                    const barTop = Math.min(zeroY, yVal);
                    const bh = Math.max(1, Math.abs(zeroY - yVal));
                    const positive = seg.value >= 0;
                    // Outline every bar sharing the hovered series' key
                    // (this chart's hover highlights the whole series
                    // across categories, not just the one bar under the
                    // pointer -- see the doc comment above); never dim the
                    // other series' bars (`chart/marks.ts`'s
                    // `ACTIVE_STROKE_WIDTH` -- the one shared convention,
                    // replacing a per-chart "dim everyone else" opacity
                    // ternary).
                    const isHovered = hover != null && hover.key === seg.key;
                    return (
                      <BarRounded
                        key={seg.key}
                        x={bx}
                        y={barTop}
                        width={bw}
                        height={bh}
                        radius={3}
                        top={!hasNegative || positive}
                        bottom={hasNegative && !positive}
                        fill={
                          effectiveTexture
                            ? patternFill(keys.indexOf(seg.key))
                            : colorForKey(seg.key)
                        }
                        stroke={isHovered ? theme.ink : "none"}
                        strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
                        onMouseEnter={(e) => {
                          setHover({ i, key: seg.key });
                          const p = plotPointerPosition(e, MARGIN);
                          if (p) setPointerY(p.y);
                          // index = the category index; datum = the raw segment.
                          onDatumHover?.({
                            datum: seg,
                            index: i,
                            seriesId: seg.key,
                          });
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
                top={
                  // Live pointer y while the mouse is the hover source;
                  // falls back to the hovered segment's own value-derived
                  // position otherwise.
                  pointerY != null
                    ? clamp(pointerY, innerHeight)
                    : Math.max(0, y(hb.value) - 4)
                }
                {...(renderTooltip
                  ? {
                      content: renderTooltip(hb, hover.i),
                      contentWidth: renderTooltipSize.width,
                      contentHeight: renderTooltipSize.height,
                    }
                  : {
                      lines: [
                        hoverRow != null ? getCat(hoverRow) : "",
                        `${hb.key}: ${valueFmt(hb.value)}`,
                      ],
                    })}
              />
            )}
            {children}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
