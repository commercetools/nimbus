import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { CategoryDatum } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface LollipopChartProps {
  width: number;
  height: number;
  data: CategoryDatum[];
  ariaLabel?: string;
}

/**
 * Ranked lollipop — a leaner alternative to the ranked bar for the same
 * question ("where does each item rank?"). A thin stem carries the eye to a dot
 * that marks the value against a common baseline; rows are sorted descending
 * with direct value labels. One accent hue: color carries no meaning here, the
 * category axis does — so hovering an item just dims the rest.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function LollipopChart({
  width,
  height,
  data,
  ariaLabel,
}: LollipopChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const rows = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  );
  const valueMax = useMemo(() => max(rows, (d) => d.value) ?? 0, [rows]);

  if (width <= 0 || height <= 0 || rows.length === 0) return null;

  const label = ariaLabel ?? `Lollipop chart of ${rows.length} categories`;
  const table = {
    columns: ["Category", "Value"],
    rows: rows.map((d) => [d.category, d.value]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 48, bottom: 12, left: 100 }}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const yScale = scaleBand({
          domain: rows.map((d) => d.category),
          range: [0, innerHeight],
          padding: 0.3,
        });
        const xScale = scaleLinear({
          domain: [0, valueMax],
          range: [0, innerWidth],
          nice: true,
        });
        const bh = yScale.bandwidth();
        const r = Math.min(6, Math.max(3, bh / 3));
        return (
          <>
            {rows.map((d, i) => {
              const y = (yScale(d.category) ?? 0) + bh / 2;
              const cx = Math.max(0, xScale(d.value));
              const active = hover == null || hover === i;
              return (
                <g
                  key={d.category}
                  opacity={active ? 1 : 0.4}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <line
                    x1={0}
                    x2={cx}
                    y1={y}
                    y2={y}
                    stroke={theme.accent}
                    strokeWidth={2}
                  />
                  <circle cx={cx} cy={y} r={r} fill={theme.accent} />
                  <text
                    x={-8}
                    y={y}
                    dy="0.32em"
                    textAnchor="end"
                    style={emText(11)}
                    fill={theme.mutedInk}
                  >
                    {d.category}
                  </text>
                  <text
                    x={cx + r + 4}
                    y={y}
                    dy="0.32em"
                    style={emText(11)}
                    fill={theme.ink}
                  >
                    {formatCompact(d.value)}
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
