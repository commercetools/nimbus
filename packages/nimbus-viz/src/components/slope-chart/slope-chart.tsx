import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import {
  formatCompact,
  formatSignedCompact,
  formatSignedPercent,
} from "../../chart/format";
import { emText } from "../../chart/typography";

/** One row of a slopegraph: a single entity measured at two moments. */
export interface SlopeRow {
  /** Stable identity (used as the React key). */
  id: string;
  /** Display name, direct-labeled at both ends. */
  label: string;
  /** Value at the left moment. */
  left: number;
  /** Value at the right moment. */
  right: number;
}

export interface SlopeChartProps {
  width: number;
  height: number;
  data: SlopeRow[];
  /** Header for the left column (e.g. "Q1"). */
  leftLabel?: string;
  /** Header for the right column (e.g. "Q2"). */
  rightLabel?: string;
  ariaLabel?: string;
}

/**
 * Greedy vertical de-overlap: nudges each label down just enough to keep `gap`
 * px from the one above it, preserving input order in the returned array. If
 * the stack overflows the bottom it slides back up (clamped at the top). Keeps
 * the direct labels legible without a full label-placement solver.
 */
function spreadLabels(ys: number[], gap: number, max: number): number[] {
  const order = ys.map((y, i) => ({ y, i })).sort((a, b) => a.y - b.y);
  let prev = -Infinity;
  for (const item of order) {
    if (item.y < prev + gap) item.y = prev + gap;
    prev = item.y;
  }
  const last = order[order.length - 1];
  const overflow = last ? last.y - max : 0;
  if (overflow > 0) {
    for (const item of order) item.y = Math.max(0, item.y - overflow);
  }
  const out = new Array<number>(ys.length);
  for (const item of order) out[item.i] = item.y;
  return out;
}

/**
 * A DELTA/COMPARE two-moment slopegraph: one line per row connecting its left
 * value to its right value on a single shared value-scale, with a dot at each
 * end and the name + value direct-labeled at both. The slope's direction is the
 * message, so lines take their valence role — rising = positive, falling =
 * negative, flat = mutedInk — while all text stays in ink (color never carries
 * the reading on its own; the values are right there). No numeric axis: the
 * direct labels are the point of the form.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function SlopeChart({
  width,
  height,
  data,
  leftLabel,
  rightLabel,
  ariaLabel,
}: SlopeChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const domain = useMemo(
    () => extent(data.flatMap((d) => [d.left, d.right])) as [number, number],
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const table = {
    columns: ["Row", leftLabel ?? "Left", rightLabel ?? "Right", "Change"],
    rows: data.map((d) => [
      d.label,
      d.left,
      d.right,
      formatSignedCompact(d.right - d.left),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 30, right: 96, bottom: 12, left: 96 }}
      ariaLabel={ariaLabel ?? `Slope chart of ${data.length} rows`}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const yScale = scaleLinear({
          domain,
          range: [innerHeight, 0],
          nice: true,
        });
        const leftYs = spreadLabels(
          data.map((d) => yScale(d.left)),
          14,
          innerHeight
        );
        const rightYs = spreadLabels(
          data.map((d) => yScale(d.right)),
          14,
          innerHeight
        );

        return (
          <>
            {leftLabel && (
              <text
                x={0}
                y={-12}
                textAnchor="end"
                style={emText(11)}
                fontWeight={600}
                fill={theme.ink}
              >
                {leftLabel}
              </text>
            )}
            {rightLabel && (
              <text
                x={innerWidth}
                y={-12}
                textAnchor="start"
                style={emText(11)}
                fontWeight={600}
                fill={theme.ink}
              >
                {rightLabel}
              </text>
            )}
            {data.map((row, i) => {
              const y1 = yScale(row.left);
              const y2 = yScale(row.right);
              const delta = row.right - row.left;
              const color =
                delta > 0
                  ? theme.positive
                  : delta < 0
                    ? theme.negative
                    : theme.mutedInk;
              const active = hover == null || hover === i;
              return (
                <g
                  key={row.id}
                  opacity={active ? 1 : 0.3}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <line
                    x1={0}
                    y1={y1}
                    x2={innerWidth}
                    y2={y2}
                    stroke={color}
                    strokeWidth={hover === i ? 3 : 2}
                  />
                  <circle
                    cx={0}
                    cy={y1}
                    r={4}
                    fill={color}
                    stroke={theme.surface}
                    strokeWidth={1}
                  />
                  <circle
                    cx={innerWidth}
                    cy={y2}
                    r={4}
                    fill={color}
                    stroke={theme.surface}
                    strokeWidth={1}
                  />
                  <text
                    x={-8}
                    y={leftYs[i]}
                    dy="0.32em"
                    textAnchor="end"
                    style={emText(11)}
                    fill={theme.ink}
                  >
                    {`${row.label}  ${formatCompact(row.left)}`}
                  </text>
                  <text
                    x={innerWidth + 8}
                    y={rightYs[i]}
                    dy="0.32em"
                    textAnchor="start"
                    style={emText(11)}
                    fill={theme.ink}
                  >
                    {`${formatCompact(row.right)}  ${row.label}`}
                  </text>
                </g>
              );
            })}
            {hover != null &&
              data[hover] &&
              (() => {
                const row = data[hover];
                const delta = row.right - row.left;
                return (
                  <SvgTooltip
                    x={innerWidth / 2}
                    innerWidth={innerWidth}
                    top={Math.max(
                      0,
                      (yScale(row.left) + yScale(row.right)) / 2 - 8
                    )}
                    lines={[
                      row.label,
                      `${formatCompact(row.left)} → ${formatCompact(row.right)}`,
                      `Change: ${formatSignedCompact(delta)}${
                        row.left !== 0
                          ? ` (${formatSignedPercent(delta / row.left)})`
                          : ""
                      }`,
                    ]}
                  />
                );
              })()}
          </>
        );
      }}
    </ChartContainer>
  );
}
