import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { max } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { useChartTheme } from "../../theme";
import { formatSignedCompact } from "../../chart/format";
import type { CategoryDatum } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface DivergingBarChartProps {
  width: number;
  height: number;
  /** Signed magnitudes — positive bars grow right, negative grow left. */
  data: CategoryDatum[];
  ariaLabel?: string;
}

/**
 * Deviation as a diverging bar — signed values against a central zero baseline,
 * sorted from most positive to most negative. Length reads on a common baseline
 * (the zero line) and the sign is carried by BOTH side (left/right) and the
 * signed value label, never by color alone; the positive/negative hues are a
 * redundant valence cue. The go-to for variance-to-plan, sentiment, or
 * year-over-year change across categories.
 */
export function DivergingBarChart({
  width,
  height,
  data,
  ariaLabel,
}: DivergingBarChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const rows = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  );
  const absMax = useMemo(
    () => max(rows, (d) => Math.abs(d.value)) ?? 0,
    [rows]
  );

  if (width <= 0 || height <= 0 || rows.length === 0) return null;

  const label = ariaLabel ?? `Diverging bar chart of ${rows.length} categories`;
  const table = {
    columns: ["Category", "Value"],
    rows: rows.map((d) => [d.category, d.value]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 52, bottom: 12, left: 100 }}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const yScale = scaleBand({
          domain: rows.map((d) => d.category),
          range: [0, innerHeight],
          padding: 0.25,
        });
        const xScale = scaleLinear({
          domain: [-absMax, absMax],
          range: [0, innerWidth],
          nice: true,
        });
        const zero = xScale(0);
        const bh = yScale.bandwidth();
        return (
          <>
            <line
              x1={zero}
              x2={zero}
              y1={0}
              y2={innerHeight}
              stroke={theme.axis}
            />
            {rows.map((d, i) => {
              const y = yScale(d.category) ?? 0;
              const positive = d.value >= 0;
              const end = xScale(d.value);
              const x = Math.min(zero, end);
              const w = Math.abs(end - zero);
              const active = hover == null || hover === i;
              return (
                <g
                  key={d.category}
                  opacity={active ? 1 : 0.4}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <BarRounded
                    x={x}
                    y={y}
                    width={Math.max(0, w)}
                    height={bh}
                    radius={4}
                    right={positive}
                    left={!positive}
                    fill={positive ? theme.positive : theme.negative}
                  />
                  <text
                    x={-8}
                    y={y + bh / 2}
                    dy="0.32em"
                    textAnchor="end"
                    style={emText(11)}
                    fill={theme.mutedInk}
                  >
                    {d.category}
                  </text>
                  <text
                    x={positive ? end + 6 : end - 6}
                    y={y + bh / 2}
                    dy="0.32em"
                    textAnchor={positive ? "start" : "end"}
                    style={emText(11)}
                    fill={theme.ink}
                  >
                    {formatSignedCompact(d.value)}
                  </text>
                </g>
              );
            })}
          </>
        );
      }}
    </ChartContainer>
  );
}
