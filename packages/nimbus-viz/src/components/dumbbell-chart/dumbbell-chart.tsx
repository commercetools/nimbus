import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { bottomTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact, formatSignedCompact } from "../../chart/format";
import { emText } from "../../chart/typography";

/** One category compared at two points — a start and an end value. */
export interface DumbbellRow {
  /** Category label, shown on the left axis. */
  category: string;
  /** The "before" value — the muted dot. */
  start: number;
  /** The "after" value — the accent dot. */
  end: number;
}

export interface DumbbellChartProps {
  width: number;
  height: number;
  data: DumbbellRow[];
  /** Legend label for the start dots (default "Start"). */
  startLabel?: string;
  /** Legend label for the end dots (default "End"). */
  endLabel?: string;
  ariaLabel?: string;
}

/**
 * A COMPARE (paired) dumbbell: categories down the left, a single value axis
 * along the bottom, and one barbell per row — a connector between a muted
 * "start" dot and an accent "end" dot — so the gap between the two moments is
 * the readable quantity. Each dot's value is direct-labeled, flared to the
 * outer side of the pair so the two never collide. A legend maps the two dot
 * colors to their moments (identity is never carried by color alone).
 */
export function DumbbellChart({
  width,
  height,
  data,
  startLabel = "Start",
  endLabel = "End",
  ariaLabel,
}: DumbbellChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const xDomain = useMemo(
    () => extent(data.flatMap((d) => [d.start, d.end])) as [number, number],
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const table = {
    columns: ["Category", startLabel, endLabel, "Change"],
    rows: data.map((d) => [
      d.category,
      d.start,
      d.end,
      formatSignedCompact(d.end - d.start),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 48, bottom: 28, left: 100 }}
      ariaLabel={ariaLabel ?? `Dumbbell chart of ${data.length} categories`}
      legend={[
        { label: startLabel, color: theme.mutedInk },
        { label: endLabel, color: theme.accent },
      ]}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const [lo, hi] = xDomain;
        const pad = (hi - lo || Math.abs(hi) || 1) * 0.1;
        const xScale = scaleLinear({
          domain: [lo - pad, hi + pad],
          range: [0, innerWidth],
        });
        const yScale = scaleBand({
          domain: data.map((d) => d.category),
          range: [0, innerHeight],
          padding: 0.4,
        });
        const bw = yScale.bandwidth();
        const hr = hover != null ? data[hover] : null;

        return (
          <>
            {xScale.ticks(5).map((t) => (
              <line
                key={t}
                x1={xScale(t)}
                x2={xScale(t)}
                y1={0}
                y2={innerHeight}
                stroke={theme.grid}
                strokeWidth={1}
              />
            ))}
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              numTicks={5}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => formatCompact(v as number)}
              tickLabelProps={bottomTickLabel(theme)}
            />
            {data.map((row, i) => {
              const cy = (yScale(row.category) ?? 0) + bw / 2;
              const xs = xScale(row.start);
              const xe = xScale(row.end);
              const active = hover == null || hover === i;
              const startLeft = row.start <= row.end;
              const startAnchor: "start" | "end" = startLeft ? "end" : "start";
              const endAnchor: "start" | "end" = startLeft ? "start" : "end";
              const startLabelX = startLeft ? xs - 8 : xs + 8;
              const endLabelX = startLeft ? xe + 8 : xe - 8;
              return (
                <g
                  key={row.category}
                  opacity={active ? 1 : 0.35}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <text
                    x={-8}
                    y={cy}
                    dy="0.32em"
                    textAnchor="end"
                    style={emText(11)}
                    fill={theme.mutedInk}
                  >
                    {row.category}
                  </text>
                  <line
                    x1={xs}
                    x2={xe}
                    y1={cy}
                    y2={cy}
                    stroke={theme.axis}
                    strokeWidth={3}
                    strokeLinecap="round"
                  />
                  <circle
                    cx={xs}
                    cy={cy}
                    r={5}
                    fill={theme.mutedInk}
                    stroke={theme.surface}
                    strokeWidth={1}
                  />
                  <circle
                    cx={xe}
                    cy={cy}
                    r={5}
                    fill={theme.accent}
                    stroke={theme.surface}
                    strokeWidth={1}
                  />
                  <text
                    x={startLabelX}
                    y={cy}
                    dy="0.32em"
                    textAnchor={startAnchor}
                    style={emText(10)}
                    fill={theme.ink}
                  >
                    {formatCompact(row.start)}
                  </text>
                  <text
                    x={endLabelX}
                    y={cy}
                    dy="0.32em"
                    textAnchor={endAnchor}
                    style={emText(10)}
                    fill={theme.ink}
                  >
                    {formatCompact(row.end)}
                  </text>
                </g>
              );
            })}
            {hr && (
              <SvgTooltip
                x={(xScale(hr.start) + xScale(hr.end)) / 2}
                innerWidth={innerWidth}
                top={Math.max(0, (yScale(hr.category) ?? 0) + bw / 2 - 30)}
                lines={[
                  hr.category,
                  `${startLabel}: ${formatCompact(hr.start)}`,
                  `${endLabel}: ${formatCompact(hr.end)}`,
                  `Change: ${formatSignedCompact(hr.end - hr.start)}`,
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
