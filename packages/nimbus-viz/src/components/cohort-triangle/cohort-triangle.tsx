import { useMemo, useState } from "react";
import { scaleBand } from "@visx/scale";
import { Group } from "@visx/group";
import { ChartFrame } from "../../chart/chart-frame";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { sequentialColor, useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { HeatRow } from "../../chart/types";

export interface CohortTriangleProps {
  width: number;
  height: number;
  /** One row per cohort; `values` are indexed by AGE (period-0 first). */
  rows: HeatRow[];
  /** Calendar-period labels indexed by COLUMN (cohort 0's acquisition = col 0). */
  periodLabels?: string[];
  /** Nimbus hue for the sequential ramp. */
  hue?: string;
  ariaLabel?: string;
}

interface Hover {
  cohort: string;
  age: number;
  col: number;
  value: number;
}

/**
 * Cohort triangle — the calendar-aligned cousin of the cohort Heatmap. Each
 * cohort row is shifted right by its index, so age-0 (acquisition) sits on the
 * diagonal (outlined) and columns are calendar periods. Reading DOWN a column
 * shows different-aged cohorts in the same calendar month, surfacing seasonality
 * the period-aligned heatmap flattens. Magnitude → one sequential hue.
 */
export function CohortTriangle({
  width,
  height,
  rows,
  periodLabels,
  hue = "teal",
  ariaLabel,
}: CohortTriangleProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<Hover | null>(null);

  // Calendar columns: cohort i's oldest age lands at column i + values.length - 1.
  const numCols = useMemo(
    () => Math.max(0, ...rows.map((r, i) => i + r.values.length)),
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
  const legendHeight = 24;

  return (
    <div style={{ width, height }}>
      <ChartFrame
        width={width}
        height={height - legendHeight}
        margin={{ top: 20, right: 8, bottom: 8, left: 76 }}
        ariaLabel={ariaLabel ?? `Cohort triangle, ${rows.length} cohorts`}
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
                  fontSize={10}
                  fontFamily="system-ui, sans-serif"
                  fill={theme.mutedInk}
                >
                  {periodLabels?.[c] ?? c}
                </text>
              ))}
              {rows.map((row, i) => {
                const y = yScale(row.label) ?? 0;
                return (
                  <Group key={row.label}>
                    <text
                      x={-8}
                      y={y + ch / 2}
                      dy="0.32em"
                      textAnchor="end"
                      fontSize={10}
                      fontFamily="system-ui, sans-serif"
                      fill={theme.mutedInk}
                    >
                      {row.label}
                    </text>
                    {row.values.map((v, age) => {
                      if (v == null) return null;
                      const col = i + age; // calendar-aligned
                      const x = xScale(String(col)) ?? 0;
                      const t = maxVal > 0 ? v / maxVal : 0;
                      const isAcquisition = age === 0; // M0 sits on the diagonal
                      return (
                        <g
                          key={age}
                          onMouseEnter={() =>
                            setHover({ cohort: row.label, age, col, value: v })
                          }
                          onMouseLeave={() => setHover(null)}
                        >
                          <rect
                            x={x}
                            y={y}
                            width={cw}
                            height={ch}
                            rx={3}
                            fill={color(t)}
                            stroke={isAcquisition ? theme.accent : "none"}
                            strokeWidth={isAcquisition ? 1.5 : 0}
                          />
                          {cw > 26 && ch > 16 && (
                            <text
                              x={x + cw / 2}
                              y={y + ch / 2}
                              dy="0.32em"
                              textAnchor="middle"
                              fontSize={9}
                              fontFamily="system-ui, sans-serif"
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
              {hover && (
                <SvgTooltip
                  x={(xScale(String(hover.col)) ?? 0) + cw / 2}
                  innerWidth={innerWidth}
                  top={(yScale(hover.cohort) ?? 0) - 4}
                  lines={[
                    `${hover.cohort} cohort`,
                    `Age: M${hover.age}${hover.age === 0 ? " (acquired)" : ""}`,
                    `Value: ${formatCompact(hover.value)}`,
                  ]}
                />
              )}
            </>
          );
        }}
      </ChartFrame>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          paddingTop: 6,
          paddingLeft: 76,
          fontSize: 10,
          color: theme.mutedInk,
        }}
      >
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <span
            key={t}
            style={{
              width: 16,
              height: 10,
              background: color(t),
              borderRadius: 2,
              display: "inline-block",
            }}
          />
        ))}
        <span>More</span>
        <span style={{ marginLeft: 10 }}>◻ outlined = acquisition (M0)</span>
      </div>
    </div>
  );
}
