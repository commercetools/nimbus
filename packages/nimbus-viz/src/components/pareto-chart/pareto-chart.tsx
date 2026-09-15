import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { BarRounded, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { sum } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { bandByIndex, valueDomain } from "../../chart/scales";
import { devWarn } from "../../chart/dev-warn";
import {
  GridRows,
  bottomTickLabel,
  fitBandLabel,
  leftTickLabel,
} from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatPercent } from "../../chart/format";
import { useChartFormatters } from "../../chart/format-locale";
import type { CategoryDatum } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";
import { emText } from "../../chart/typography";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";

export interface ParetoChartProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Categories to rank. Sorted by value descending internally; the cumulative
   *  running total is derived from them. */
  data: CategoryDatum[];
  /** Accessible label for the SVG; state the takeaway, not every value. */
  ariaLabel?: string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<CategoryDatum>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<CategoryDatum>;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
}

interface ParetoRow {
  category: string;
  /** Clamped to non-negative — this is what the bar height and the cumulative
   *  running total are computed from (a rank/share chart can't encode a
   *  negative magnitude). */
  value: number;
  /** The original, unclamped input value — shown in the tooltip and table. */
  rawValue: number;
  /** Running cumulative total, in the same absolute units as `value`. */
  cumulative: number;
  /** Cumulative as a fraction of the grand total (for the tooltip / annotation
   *  text only — never a second axis). */
  cumulativeFraction: number;
  /** The raw input datum this row was ranked from (for interaction callbacks). */
  datum: CategoryDatum;
}

/**
 * A Pareto chart: categories ranked by magnitude, with a running cumulative
 * total, used to surface the "vital few" categories that drive most of the
 * whole. Hovering a bar outlines that one bar (its siblings are never
 * dimmed) and reads out the cumulative share.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function ParetoChart({
  width,
  height,
  data,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  children,
  valueFormat,
}: ParetoChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);

  // A rank/cumulative-share chart can't encode a negative magnitude: clamp
  // before it enters the sort/cumulative math (BC-2), same floor as the other
  // magnitude-only charts. The raw value stays visible in the tooltip/table.
  const hasNegative = data.some((d) => d.value < 0);
  if (hasNegative) {
    devWarn(
      "pareto-chart:negative",
      "ParetoChart: negative values are drawn as 0 (a rank/cumulative-share chart can't encode a negative magnitude)."
    );
  }

  const rows = useMemo<ParetoRow[]>(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const clamped = sorted.map((d) => Math.max(0, d.value));
    const total = sum(clamped);
    let running = 0;
    return sorted.map((d, i) => {
      const value = clamped[i];
      running += value;
      return {
        category: d.category,
        value,
        rawValue: d.value,
        cumulative: running,
        cumulativeFraction: total > 0 ? running / total : 0,
        datum: d,
      };
    });
  }, [data]);

  const grandTotal = useMemo(
    () => (rows.length > 0 ? rows[rows.length - 1].cumulative : 0),
    [rows]
  );
  // valueDomain also widens the degenerate [0, 0] domain (BC-3) — every row
  // clamped to 0 — to a real span, instead of collapsing every bar to the
  // range midpoint.
  const valueRange = useMemo(() => valueDomain([grandTotal]), [grandTotal]);

  if (width <= 0 || height <= 0 || rows.length === 0) return null;

  const label = ariaLabel ?? `Pareto chart of ${rows.length} categories`;
  const table = {
    columns: ["Category", "Value", "Cumulative %"],
    rows: rows.map((d) => [
      d.category,
      d.rawValue,
      formatPercent(d.cumulativeFraction),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 16, right: 44, bottom: 28, left: 44 }}
      ariaLabel={label}
      legend={[
        { label: "Value", color: theme.accent },
        { label: "Cumulative", color: theme.categorical[1] },
      ]}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const band = bandByIndex(
          rows.map((d) => d.category),
          {
            range: [0, innerWidth],
            padding: 0.2,
          }
        );
        // SINGLE absolute-unit value axis: its top is the grand total, so both
        // the bars (per-category magnitude) AND the cumulative running total
        // read off the same scale. Pareto's classic dual-axis — bars on the
        // left, a cumulative-PERCENT line on a right-hand axis — is DELIBERATELY
        // avoided here per the dataviz single-axis rule: one value scale only,
        // with the 80% "vital few" cutoff drawn as a reference line rather than
        // a second (percentage) axis.
        const yScale = scaleLinear({
          domain: valueRange,
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = band.bandwidth;
        const eightyY = yScale(0.8 * grandTotal);
        const last = rows[rows.length - 1];
        const lastIndex = rows.length - 1;

        return (
          <ChartScaleProvider
            value={{
              yScale,
              xScale: (v) => band.center(Math.round(Number(v))),
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
              scale={band.scale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) =>
                fitBandLabel(band.step)(band.tickFormat(String(v)))
              }
              tickLabelProps={bottomTickLabel(theme)}
            />

            {rows.map((d, i) => {
              const x = band.pos(i);
              const barH = Math.max(0, innerHeight - yScale(d.value));
              // Outline the hovered bar; never dim its siblings
              // (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` -- the one shared
              // convention, replacing a per-chart "dim everyone else"
              // opacity ternary).
              const isHovered = hover === i;
              return (
                <BarRounded
                  key={`${d.category}-${i}`}
                  x={x}
                  y={yScale(d.value)}
                  width={bw}
                  height={barH}
                  radius={4}
                  top
                  fill={theme.accent}
                  stroke={isHovered ? theme.ink : "none"}
                  strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
                  onMouseEnter={() => {
                    setHover(i);
                    // datum is the raw input element; index is its rank in the
                    // sorted (ranked) display order — the same convention as the
                    // horizontal (ranked) bar chart.
                    onDatumHover?.({ datum: d.datum, index: i });
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => onDatumClick?.({ datum: d.datum, index: i })}
                />
              );
            })}

            {/* 80% "vital few" cutoff — a reference line at 80% of the grand
                total on the SAME absolute axis, NOT a second percentage scale.
                Label text stays in mutedInk. */}
            <line
              x1={0}
              x2={innerWidth}
              y1={eightyY}
              y2={eightyY}
              stroke={theme.axis}
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={innerWidth}
              y={eightyY - 4}
              textAnchor="end"
              style={emText(10)}
              fill={theme.mutedInk}
            >
              80%
            </text>

            {/* Cumulative running total, drawn in ABSOLUTE units on the SAME
                y-axis (climbing from the first bar's value to the grand total).
                Its distinct hue (categorical[1]) separates it from the accent
                bars. */}
            <LinePath<ParetoRow>
              data={rows}
              x={(_, i) => band.center(i)}
              y={(d) => yScale(d.cumulative)}
              stroke={theme.categorical[1]}
              strokeWidth={2}
            />
            {rows.map((d, i) => (
              <circle
                key={`${d.category}-${i}`}
                cx={band.center(i)}
                cy={yScale(d.cumulative)}
                r={3}
                fill={theme.categorical[1]}
                stroke={theme.surface}
                strokeWidth={1}
              />
            ))}

            {/* Text-only annotation of the cumulative line's right end (the full
                100% of the grand total), in mutedInk — never a second axis. */}
            <text
              x={band.center(lastIndex)}
              y={yScale(grandTotal) - 8}
              textAnchor="end"
              style={emText(10)}
              fill={theme.mutedInk}
            >
              {formatPercent(last.cumulativeFraction)}
            </text>

            {hover != null && rows[hover] && (
              <SvgTooltip
                x={band.center(hover)}
                innerWidth={innerWidth}
                lines={[
                  rows[hover].category,
                  valueFmt(rows[hover].rawValue),
                  `Cumulative: ${formatPercent(rows[hover].cumulativeFraction)}`,
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
