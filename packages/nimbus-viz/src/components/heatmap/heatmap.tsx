import { useMemo, useState } from "react";
import { scaleBand } from "@visx/scale";
import { Group } from "@visx/group";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import {
  sequentialColor,
  resolveSequentialDomain,
  normalizeToDomain,
  useChartTheme,
  readableTextColor,
} from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { HeatRow } from "../../chart/types";
import { emText } from "../../chart/typography";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";

export interface HeatmapProps {
  /** Chart width in pixels (supplied by `ResponsiveContainer`). */
  width: number;
  /** Chart height in pixels (supplied by `ResponsiveContainer`). */
  height: number;
  /** Matrix rows, one per y-axis band; each row's `values` are the cells left→right. */
  rows: HeatRow[];
  /** Nimbus hue for the sequential ramp. */
  hue?: string;
  /** Column headers along the top; falls back to the 0-based column index. */
  columnLabels?: string[];
  /**
   * Fixed `[min, max]` bounds for the color ramp. Defaults to the actual
   * range of the cell values (lightest shade = lowest value, fullest shade
   * = highest), so close values stay visually distinct. Pass this to pin
   * the scale instead — e.g. `[0, max]` to anchor at zero for
   * absolute-magnitude comparisons across separately-rendered heatmaps, or
   * to clip outliers.
   */
  domain?: [number, number];
  /** Accessible label for the SVG frame (Cesal alt-text). Defaults to a generated summary. */
  ariaLabel?: string;
  /** Fired when a cell is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<HeatmapCell>;
  /** Fired when the hovered cell changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<HeatmapCell>;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
}

/** A single matrix cell's public interaction payload. */
interface HeatmapCell {
  label: string;
  column: number;
  value: number;
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
  domain,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  valueFormat,
}: HeatmapProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  const numCols = useMemo(
    () => Math.max(0, ...rows.map((r) => r.values.length)),
    [rows]
  );
  const colorDomain = useMemo(
    () =>
      resolveSequentialDomain(
        rows.flatMap((r) => r.values.filter((v): v is number => v != null)),
        domain
      ),
    [rows, domain]
  );

  if (width <= 0 || height <= 0 || rows.length === 0 || numCols === 0) {
    return null;
  }

  const color = sequentialColor(theme.ramps[hue] ?? theme.ramps.blue);
  const table = {
    columns: [
      "Row",
      ...Array.from(
        { length: numCols },
        (_, i) => columnLabels?.[i] ?? String(i)
      ),
    ],
    rows: rows.map((r) => [r.label, ...r.values.map((v) => v ?? "")]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 20, right: 8, bottom: 8, left: 76 }}
      ariaLabel={
        ariaLabel ?? `Heatmap, ${rows.length} rows by ${numCols} columns`
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleBand({
          domain: Array.from({ length: numCols }, (_, i) => String(i)),
          range: [0, innerWidth],
          padding: 0.08,
        });
        const yScale = scaleBand({
          domain: rows.map((_, i) => String(i)),
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
              const y = yScale(String(ri)) ?? 0;
              return (
                <Group key={`${row.label}-${ri}`}>
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
                    const t = normalizeToDomain(v, colorDomain);
                    const isHover = hover?.r === ri && hover?.c === c;
                    return (
                      <g
                        key={c}
                        onMouseEnter={() => {
                          setHover({ r: ri, c });
                          onDatumHover?.({
                            datum: { label: row.label, column: c, value: v },
                            index: ri,
                          });
                        }}
                        onMouseLeave={() => {
                          setHover(null);
                          onDatumHover?.(null);
                        }}
                        onClick={() =>
                          onDatumClick?.({
                            datum: { label: row.label, column: c, value: v },
                            index: ri,
                          })
                        }
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
                            fill={readableTextColor(
                              color(t),
                              theme.ink,
                              theme.surface
                            )}
                          >
                            {valueFmt(v)}
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
                    top={Math.max(0, (yScale(String(hover.r)) ?? 0) - 4)}
                    lines={[
                      row.label,
                      `${columnLabels?.[hover.c] ?? hover.c}: ${valueFmt(
                        value
                      )}`,
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
