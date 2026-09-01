import { useMemo, useState } from "react";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { fitBandLabel } from "../../chart/axes";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact, formatPercent } from "../../chart/format";
import type { StackRow } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface MarimekkoChartProps {
  width: number;
  height: number;
  /** One column per category; column WIDTH encodes the column's total. */
  data: StackRow[];
  ariaLabel?: string;
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
}: MarimekkoChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{ c: number; s: number } | null>(null);

  const keys = useMemo(() => data[0]?.segments.map((s) => s.key) ?? [], [data]);
  const color = useEntityColors(keys);
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
      legend={keys.map((k) => ({ label: k, color: color(k) }))}
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
                        fill={color(seg.key)}
                        opacity={active ? 1 : 0.4}
                        onMouseEnter={() => setHover({ c, s })}
                        onMouseLeave={() => setHover(null)}
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
                  formatCompact(hovered.value),
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
