import { useMemo, useState } from "react";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { fitBandLabel } from "../../chart/axes";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatPercent } from "../../chart/format";
import { useChartFormatters } from "../../chart/format-locale";
import { ChartPatternDefs, patternFill } from "../../chart/patterns";
import { useForcedColors } from "../../chart/use-forced-colors";
import type { StackRow } from "../../chart/types";
import { emText } from "../../chart/typography";
import { stackKeys } from "../../chart/stack";
import type { DatumInteractionProps } from "../../chart/interaction";

export interface MarimekkoChartProps extends DatumInteractionProps<StackRow> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** One `StackRow` per category; column WIDTH encodes the column's total and
   *  each segment's height its share within the column. Rows should share the
   *  same segment keys, in the same order. */
  data: StackRow[];
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /**
   * Fill each segment with a per-key SVG texture (`chart/patterns.tsx`) in
   * addition to its color, so segments stay distinguishable by shape alone
   * — monochrome print, a photocopy, or `forced-colors` mode. Default
   * `false` (color only, unchanged). Turned on automatically (regardless
   * of this prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
}

/** Pixel gap between columns and between stacked segments. */
const GAP = 2;

/**
 * Marimekko (mekko) — a 100%-stacked column chart whose column WIDTHS encode
 * each category's total. So it reads two magnitudes at once: column width =
 * share of the grand total, segment height = share within the column. Every
 * cell's area is proportional to its value. Color is segment identity (fixed
 * order, shared scale), so a legend is always present; hovering a cell shows its
 * value and its share of the column.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function MarimekkoChart({
  width,
  height,
  data,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  texture,
}: MarimekkoChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<{ c: number; s: number } | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;

  const keys = useMemo(() => stackKeys(data), [data]);
  const color = useEntityColors(keys);
  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // -- one system foreground color for every key, with the per-key pattern
  // kind (below) as the only identity carrier.
  const colorForKey = (k: string) => (forcedColors ? "CanvasText" : color(k));
  const totals = useMemo(
    () =>
      data.map((d) =>
        d.segments.reduce((s, seg) => s + Math.max(0, seg.value), 0)
      ),
    [data]
  );
  const grand = useMemo(() => totals.reduce((s, v) => s + v, 0), [totals]);

  if (width <= 0 || height <= 0 || data.length === 0 || grand <= 0) return null;

  const label = ariaLabel ?? `Marimekko chart of ${data.length} categories`;
  const table = {
    columns: ["Column", ...keys],
    rows: data.map((d) => [
      d.category,
      ...keys.map((k) => d.segments.find((s) => s.key === k)?.value ?? 0),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 8, bottom: 24, left: 8 }}
      ariaLabel={label}
      legend={keys.map((k) => ({ label: k, color: colorForKey(k) }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const totalGap = GAP * Math.max(0, data.length - 1);
        const usable = Math.max(0, innerWidth - totalGap);
        const truncate = (colWidth: number) => fitBandLabel(colWidth);
        let x = 0;
        const columns = data.map((row, c) => {
          const colWidth = (usable * totals[c]) / grand;
          const x0 = x;
          x += colWidth + GAP;
          return { row, c, x0, colWidth };
        });
        const hovered = hover != null ? data[hover.c]?.segments[hover.s] : null;
        return (
          <>
            {effectiveTexture && (
              <ChartPatternDefs colors={keys.map((k) => colorForKey(k))} />
            )}
            {columns.map(({ row, c, x0, colWidth }) => {
              let y = 0;
              return (
                <g key={row.category}>
                  {row.segments.map((seg, s) => {
                    const frac = totals[c] > 0 ? seg.value / totals[c] : 0;
                    const h = frac * innerHeight;
                    const rectY = y;
                    y += h;
                    const active =
                      hover == null || (hover.c === c && hover.s === s);
                    return (
                      <rect
                        key={seg.key}
                        x={x0}
                        y={rectY}
                        width={Math.max(0, colWidth)}
                        height={Math.max(0, h - GAP)}
                        fill={
                          effectiveTexture
                            ? patternFill(keys.indexOf(seg.key))
                            : colorForKey(seg.key)
                        }
                        opacity={active ? 1 : 0.4}
                        onMouseEnter={() => {
                          setHover({ c, s });
                          onDatumHover?.({
                            datum: row,
                            index: c,
                            seriesId: seg.key,
                          });
                        }}
                        onMouseLeave={() => {
                          setHover(null);
                          onDatumHover?.(null);
                        }}
                        onClick={() =>
                          onDatumClick?.({
                            datum: row,
                            index: c,
                            seriesId: seg.key,
                          })
                        }
                      />
                    );
                  })}
                  <text
                    x={x0 + colWidth / 2}
                    y={innerHeight + 14}
                    textAnchor="middle"
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {truncate(colWidth)(row.category)}
                  </text>
                </g>
              );
            })}
            {hovered && hover && (
              <SvgTooltip
                x={columns[hover.c].x0 + columns[hover.c].colWidth / 2}
                innerWidth={innerWidth}
                top={4}
                lines={[
                  `${data[hover.c].category} · ${hovered.key}`,
                  valueFmt(hovered.value),
                  `${formatPercent(totals[hover.c] > 0 ? hovered.value / totals[hover.c] : 0)} of column`,
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
