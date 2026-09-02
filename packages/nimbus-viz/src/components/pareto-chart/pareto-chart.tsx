import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { BarRounded, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { sum } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import {
  GridRows,
  bottomTickLabel,
  fitBandLabel,
  leftTickLabel,
} from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact, formatPercent } from "../../chart/format";
import type { CategoryDatum } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface ParetoChartProps {
  width: number;
  height: number;
  data: CategoryDatum[];
  ariaLabel?: string;
}

interface ParetoRow {
  category: string;
  value: number;
  /** Running cumulative total, in the same absolute units as `value`. */
  cumulative: number;
  /** Cumulative as a fraction of the grand total (for the tooltip / annotation
   *  text only — never a second axis). */
  cumulativeFraction: number;
}

/**
 * A Pareto chart: categories ranked by magnitude, with a running cumulative
 * total, used to surface the "vital few" categories that drive most of the
 * whole. Per-bar hover dims the rest and reads out the cumulative share.
 */
export function ParetoChart({
  width,
  height,
  data,
  ariaLabel,
}: ParetoChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const rows = useMemo<ParetoRow[]>(() => {
    const sorted = [...data].sort((a, b) => b.value - a.value);
    const total = sum(sorted, (d) => d.value);
    let running = 0;
    return sorted.map((d) => {
      running += d.value;
      return {
        category: d.category,
        value: d.value,
        cumulative: running,
        cumulativeFraction: total > 0 ? running / total : 0,
      };
    });
  }, [data]);

  const grandTotal = useMemo(
    () => (rows.length > 0 ? rows[rows.length - 1].cumulative : 0),
    [rows]
  );

  if (width <= 0 || height <= 0 || rows.length === 0) return null;

  const label = ariaLabel ?? `Pareto chart of ${rows.length} categories`;
  const table = {
    columns: ["Category", "Value", "Cumulative %"],
    rows: rows.map((d) => [
      d.category,
      d.value,
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
        const xScale = scaleBand({
          domain: rows.map((d) => d.category),
          range: [0, innerWidth],
          padding: 0.2,
        });
        // SINGLE absolute-unit value axis: its top is the grand total, so both
        // the bars (per-category magnitude) AND the cumulative running total
        // read off the same scale. Pareto's classic dual-axis — bars on the
        // left, a cumulative-PERCENT line on a right-hand axis — is DELIBERATELY
        // avoided here per the dataviz single-axis rule: one value scale only,
        // with the 80% "vital few" cutoff drawn as a reference line rather than
        // a second (percentage) axis.
        const yScale = scaleLinear({
          domain: [0, grandTotal],
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = xScale.bandwidth();
        const cx = (d: ParetoRow) => (xScale(d.category) ?? 0) + bw / 2;
        const eightyY = yScale(0.8 * grandTotal);
        const last = rows[rows.length - 1];

        return (
          <>
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
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => fitBandLabel(xScale.step())(String(v))}
              tickLabelProps={bottomTickLabel(theme)}
            />

            {rows.map((d, i) => {
              const x = xScale(d.category) ?? 0;
              const barH = Math.max(0, innerHeight - yScale(d.value));
              const active = hover == null || hover === i;
              return (
                <BarRounded
                  key={d.category}
                  x={x}
                  y={yScale(d.value)}
                  width={bw}
                  height={barH}
                  radius={4}
                  top
                  fill={theme.accent}
                  opacity={active ? 1 : 0.4}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
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
              x={cx}
              y={(d) => yScale(d.cumulative)}
              stroke={theme.categorical[1]}
              strokeWidth={2}
            />
            {rows.map((d) => (
              <circle
                key={d.category}
                cx={cx(d)}
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
              x={cx(last)}
              y={yScale(grandTotal) - 8}
              textAnchor="end"
              style={emText(10)}
              fill={theme.mutedInk}
            >
              {formatPercent(last.cumulativeFraction)}
            </text>

            {hover != null && rows[hover] && (
              <SvgTooltip
                x={cx(rows[hover])}
                innerWidth={innerWidth}
                lines={[
                  rows[hover].category,
                  formatCompact(rows[hover].value),
                  `Cumulative: ${formatPercent(rows[hover].cumulativeFraction)}`,
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
