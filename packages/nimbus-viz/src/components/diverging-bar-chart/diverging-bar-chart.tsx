import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { max } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { bandByIndex } from "../../chart/scales";
import { useChartTheme } from "../../theme";
import { formatSignedCompact } from "../../chart/format";
import type { CategoryDatum } from "../../chart/types";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";

export interface DivergingBarChartProps extends DatumInteractionProps<CategoryDatum> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Signed magnitudes — positive bars grow right, negative grow left. */
  data: CategoryDatum[];
  /** Accessible label for the graphic. Defaults to
   *  "Diverging bar chart of N categories". */
  ariaLabel?: string;
}

/**
 * Deviation as a diverging bar — signed values against a central zero baseline,
 * sorted from most positive to most negative. Length reads on a common baseline
 * (the zero line) and the sign is carried by BOTH side (left/right) and the
 * signed value label, never by color alone; the positive/negative hues are a
 * redundant valence cue. The go-to for variance-to-plan, sentiment, or
 * year-over-year change across categories.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function DivergingBarChart({
  width,
  height,
  data,
  ariaLabel,
  onDatumClick,
  onDatumHover,
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
        const band = bandByIndex(
          rows.map((d) => d.category),
          {
            range: [0, innerHeight],
            padding: 0.25,
          }
        );
        const xScale = scaleLinear({
          domain: [-absMax, absMax],
          range: [0, innerWidth],
          nice: true,
        });
        const zero = xScale(0);
        const bh = band.bandwidth;
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
              const y = band.pos(i);
              const positive = d.value >= 0;
              const end = xScale(d.value);
              const x = Math.min(zero, end);
              const w = Math.abs(end - zero);
              // Outline the hovered/focused bar; never dim its siblings
              // (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` -- the one
              // shared convention, replacing a per-chart "dim everyone
              // else" opacity ternary).
              const isHovered = hover === i;
              return (
                <g
                  key={i}
                  onMouseEnter={() => {
                    setHover(i);
                    onDatumHover?.({ datum: d, index: i });
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => onDatumClick?.({ datum: d, index: i })}
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
                    stroke={isHovered ? theme.ink : "none"}
                    strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
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
