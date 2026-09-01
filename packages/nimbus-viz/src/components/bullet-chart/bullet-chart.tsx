import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { sequentialColor, useChartTheme } from "../../theme";
import { formatCompact, formatSignedCompact } from "../../chart/format";
import { emText } from "../../chart/typography";

/** One measure-vs-target row in a bullet chart. */
export interface BulletDatum {
  /** Row label. */
  label: string;
  /** The measured value, drawn as the accent bar. */
  measure: number;
  /** The target to hit, drawn as a tick mark. */
  target: number;
  /**
   * Ascending qualitative range breakpoints (e.g. poor/satisfactory/good),
   * in the same units as `measure`/`target`. Defaults to a single band
   * spanning the chart's domain when omitted.
   */
  ranges?: number[];
}

export interface BulletChartProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** One `BulletDatum` (`{ label, measure, target, ranges? }`) per row. */
  data: BulletDatum[];
  ariaLabel?: string;
}

/**
 * TARGET/RANGE: a compact horizontal measure-vs-target readout, one row per
 * bullet. Graded qualitative background bands (poor/satisfactory/good, etc.)
 * use a muted single-hue gray ramp — they carry magnitude context, not entity
 * identity, so a categorical hue would be wrong here. A single accent bar is
 * the measure; the target is always a tick mark, never implied by color
 * alone.
 */
export function BulletChart({
  width,
  height,
  data,
  ariaLabel,
}: BulletChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);
  const grayRamp = sequentialColor(theme.ramps.gray);

  const domainMax = useMemo(
    () =>
      Math.max(
        1,
        ...data.flatMap((d) => [d.measure, d.target, ...(d.ranges ?? [])])
      ),
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const table = {
    columns: ["Measure", "Value", "Target", "Δ vs target"],
    rows: data.map((d) => [
      d.label,
      d.measure,
      d.target,
      formatSignedCompact(d.measure - d.target),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 44, bottom: 8, left: 100 }}
      ariaLabel={ariaLabel ?? `Bullet chart of ${data.length} measures`}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleLinear({
          domain: [0, domainMax],
          range: [0, innerWidth],
          nice: true,
        });
        const rowH = innerHeight / data.length;
        const barH = Math.min(18, rowH * 0.4);
        const tickH = Math.min(28, rowH * 0.7);

        return (
          <>
            {data.map((d, i) => {
              const cy = i * rowH + rowH / 2;
              const bands =
                d.ranges && d.ranges.length > 0 ? d.ranges : [domainMax];
              let prev = 0;
              return (
                <g
                  key={d.label}
                  opacity={hover == null || hover === i ? 1 : 0.5}
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
                    {d.label}
                  </text>
                  {bands.map((b, bi) => {
                    const from = prev;
                    const to = Math.max(from, b);
                    prev = to;
                    const x0 = xScale(from);
                    const x1 = xScale(to);
                    // Keep the qualitative bands in the ramp's light end so
                    // they read as subtle context behind the measure bar rather
                    // than heavy blocks (cap well below the ramp's mid-tone).
                    const t = (bi / Math.max(1, bands.length - 1)) * 0.2;
                    return (
                      <rect
                        key={b}
                        x={x0}
                        y={cy - rowH * 0.36}
                        width={Math.max(0, x1 - x0)}
                        height={rowH * 0.72}
                        fill={grayRamp(t)}
                      />
                    );
                  })}
                  <rect
                    x={0}
                    y={cy - barH / 2}
                    width={Math.max(0, xScale(d.measure))}
                    height={barH}
                    fill={theme.accent}
                  />
                  <line
                    x1={xScale(d.target)}
                    x2={xScale(d.target)}
                    y1={cy - tickH / 2}
                    y2={cy + tickH / 2}
                    stroke={theme.ink}
                    strokeWidth={2}
                  />
                  <text
                    x={xScale(d.measure) + 6}
                    y={cy}
                    dy="0.32em"
                    style={emText(10)}
                    fill={theme.ink}
                  >
                    {formatCompact(d.measure)}
                  </text>
                </g>
              );
            })}
            {hover != null &&
              data[hover] &&
              (() => {
                const d = data[hover];
                const cy = hover * rowH + rowH / 2;
                return (
                  <SvgTooltip
                    x={xScale(d.measure)}
                    innerWidth={innerWidth}
                    top={Math.max(0, cy - rowH * 0.36 - 4)}
                    lines={[
                      d.label,
                      `Measure: ${formatCompact(d.measure)}`,
                      `Target: ${formatCompact(d.target)}`,
                      `vs target: ${formatSignedCompact(d.measure - d.target)}`,
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
