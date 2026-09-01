import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { divergingColor, useChartTheme } from "../../theme";
import { formatCompact, formatPercent } from "../../chart/format";
import type { StackRow } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface DivergingStackedBarProps {
  width: number;
  height: number;
  /**
   * One row per category; segments given in order from most-negative to
   * most-positive (e.g. "Strongly disagree" → "Strongly agree"). The bar is
   * centered on the neutral midpoint of that ordered scale.
   */
  data: StackRow[];
  ariaLabel?: string;
}

/**
 * Diverging stacked bar for ordered-scale / Likert data — the sanctioned form
 * for sentiment and agree↔disagree survey results. Segments are laid out around
 * a shared neutral center: the negative half grows left, the positive half
 * right, and (for an odd count) the neutral segment straddles the axis. Color is
 * a diverging ramp (two hues meeting at a gray midpoint), so polarity is read
 * from both side and hue.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function DivergingStackedBar({
  width,
  height,
  data,
  ariaLabel,
}: DivergingStackedBarProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{ r: number; s: number } | null>(null);

  const keys = useMemo(() => data[0]?.segments.map((s) => s.key) ?? [], [data]);
  const n = keys.length;
  const mid = Math.floor(n / 2);
  const odd = n % 2 === 1;

  const colorFor = useMemo(() => {
    const scale = divergingColor(theme.diverging);
    // Segments run most-negative (i=0) → most-positive (i=n-1); map onto the
    // diverging scale so the neutral midpoint lands on the middle segment.
    return (i: number): string => scale(n <= 1 ? 0.5 : i / (n - 1));
  }, [n, theme.diverging]);

  const { maxLeft, maxRight } = useMemo(() => {
    let l = 0;
    let r = 0;
    for (const row of data) {
      let off = 0;
      let total = 0;
      row.segments.forEach((seg, i) => {
        total += seg.value;
        if (i < mid) off += seg.value;
        else if (odd && i === mid) off += seg.value / 2;
      });
      l = Math.max(l, off);
      r = Math.max(r, total - off);
    }
    return { maxLeft: l, maxRight: r };
  }, [data, mid, odd]);

  if (width <= 0 || height <= 0 || data.length === 0 || n === 0) return null;

  const label =
    ariaLabel ?? `Diverging stacked bar of ${data.length} categories`;
  const table = {
    columns: ["Category", ...keys],
    rows: data.map((row) => [
      row.category,
      ...keys.map((k) => row.segments.find((s) => s.key === k)?.value ?? 0),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 16, bottom: 12, left: 100 }}
      ariaLabel={label}
      legend={keys.map((key, i) => ({ label: key, color: colorFor(i) }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const yScale = scaleBand({
          domain: data.map((d) => d.category),
          range: [0, innerHeight],
          padding: 0.25,
        });
        const xScale = scaleLinear({
          domain: [-(maxLeft || 1), maxRight || 1],
          range: [0, innerWidth],
          nice: true,
        });
        const zero = xScale(0);
        const bh = yScale.bandwidth();
        const hovered = hover != null ? data[hover.r]?.segments[hover.s] : null;
        const hoveredRow = hover != null ? data[hover.r] : null;
        const rowTotal =
          hoveredRow?.segments.reduce((s, seg) => s + seg.value, 0) ?? 0;
        return (
          <>
            <line
              x1={zero}
              x2={zero}
              y1={0}
              y2={innerHeight}
              stroke={theme.axis}
            />
            {data.map((row, r) => {
              const y = yScale(row.category) ?? 0;
              let off = 0;
              row.segments.forEach((seg, i) => {
                if (i < mid) off += seg.value;
                else if (odd && i === mid) off += seg.value / 2;
              });
              let acc = -off;
              return (
                <g key={row.category}>
                  {row.segments.map((seg, s) => {
                    const x0 = xScale(acc);
                    acc += seg.value;
                    const x1 = xScale(acc);
                    const active =
                      hover == null || (hover.r === r && hover.s === s);
                    return (
                      <rect
                        key={seg.key}
                        x={Math.min(x0, x1)}
                        y={y}
                        width={Math.max(0, Math.abs(x1 - x0) - 1)}
                        height={bh}
                        fill={colorFor(s)}
                        opacity={active ? 1 : 0.4}
                        onMouseEnter={() => setHover({ r, s })}
                        onMouseLeave={() => setHover(null)}
                      />
                    );
                  })}
                  <text
                    x={-8}
                    y={y + bh / 2}
                    dy="0.32em"
                    textAnchor="end"
                    style={emText(11)}
                    fill={theme.mutedInk}
                  >
                    {row.category}
                  </text>
                </g>
              );
            })}
            {hovered && hoveredRow && (
              <SvgTooltip
                x={zero}
                innerWidth={innerWidth}
                top={Math.max(0, (yScale(hoveredRow.category) ?? 0) - 4)}
                lines={[
                  `${hoveredRow.category} · ${hovered.key}`,
                  formatCompact(hovered.value),
                  `${formatPercent(rowTotal > 0 ? hovered.value / rowTotal : 0)} of responses`,
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
