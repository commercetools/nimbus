import { useMemo, useState } from "react";
import { scaleBand } from "@visx/scale";
import { Group } from "@visx/group";
import { ChartFrame } from "../../chart/chart-frame";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { sequentialColor, useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { HeatRow } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface HeatmapProps {
  width: number;
  height: number;
  rows: HeatRow[];
  /** Nimbus hue for the sequential ramp. */
  hue?: string;
  columnLabels?: string[];
  ariaLabel?: string;
}

/**
 * Matrix / cohort heatmap. Magnitude → a single-hue sequential ramp (never a
 * rainbow). Ragged rows are honored — `null` cells are simply absent. This is
 * the base for the cohort-retention specialist.
 */
export function Heatmap({
  width,
  height,
  rows,
  hue = "blue",
  columnLabels,
  ariaLabel,
}: HeatmapProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  const numCols = useMemo(
    () => Math.max(0, ...rows.map((r) => r.values.length)),
    [rows]
  );
  const maxVal = useMemo(
    () =>
      Math.max(
        0,
        ...rows.flatMap((r) => r.values.filter((v): v is number => v != null))
      ),
    [rows]
  );

  if (width <= 0 || height <= 0 || rows.length === 0 || numCols === 0) {
    return null;
  }

  const color = sequentialColor(hue, theme.mode);

  return (
    <ChartFrame
      width={width}
      height={height}
      margin={{ top: 20, right: 8, bottom: 8, left: 76 }}
      ariaLabel={
        ariaLabel ?? `Heatmap, ${rows.length} rows by ${numCols} columns`
      }
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleBand({
          domain: Array.from({ length: numCols }, (_, i) => String(i)),
          range: [0, innerWidth],
          padding: 0.08,
        });
        const yScale = scaleBand({
          domain: rows.map((r) => r.label),
          range: [0, innerHeight],
          padding: 0.08,
        });
        const cw = xScale.bandwidth();
        const ch = yScale.bandwidth();
        return (
          <>
            {Array.from({ length: numCols }).map((_, c) => (
              <text
                key={c}
                x={(xScale(String(c)) ?? 0) + cw / 2}
                y={-8}
                textAnchor="middle"
                style={emText(10)}
                fill={theme.mutedInk}
              >
                {columnLabels?.[c] ?? c}
              </text>
            ))}
            {rows.map((row, ri) => {
              const y = yScale(row.label) ?? 0;
              return (
                <Group key={row.label}>
                  <text
                    x={-8}
                    y={y + ch / 2}
                    dy="0.32em"
                    textAnchor="end"
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {row.label}
                  </text>
                  {row.values.map((v, c) => {
                    if (v == null) return null;
                    const x = xScale(String(c)) ?? 0;
                    const t = maxVal > 0 ? v / maxVal : 0;
                    const isHover = hover?.r === ri && hover?.c === c;
                    return (
                      <g
                        key={c}
                        onMouseEnter={() => setHover({ r: ri, c })}
                        onMouseLeave={() => setHover(null)}
                      >
                        <rect
                          x={x}
                          y={y}
                          width={cw}
                          height={ch}
                          rx={3}
                          fill={color(t)}
                          stroke={isHover ? theme.ink : "none"}
                          strokeWidth={isHover ? 1.5 : 0}
                        />
                        {cw > 26 && ch > 16 && (
                          <text
                            x={x + cw / 2}
                            y={y + ch / 2}
                            dy="0.32em"
                            textAnchor="middle"
                            style={emText(9)}
                            fill={t > 0.55 ? theme.surface : theme.ink}
                          >
                            {formatCompact(v)}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </Group>
              );
            })}
            {hover &&
              rows[hover.r]?.values[hover.c] != null &&
              (() => {
                const row = rows[hover.r];
                const value = row.values[hover.c] as number;
                return (
                  <SvgTooltip
                    x={(xScale(String(hover.c)) ?? 0) + cw / 2}
                    innerWidth={innerWidth}
                    top={Math.max(0, (yScale(row.label) ?? 0) - 4)}
                    lines={[
                      row.label,
                      `${columnLabels?.[hover.c] ?? hover.c}: ${formatCompact(
                        value
                      )}`,
                    ]}
                  />
                );
              })()}
          </>
        );
      }}
    </ChartFrame>
  );
}
