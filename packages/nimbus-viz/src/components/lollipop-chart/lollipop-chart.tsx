import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { ChartContainer } from "../../chart/chart-container";
import { bandByIndex, valueDomain } from "../../chart/scales";
import { useChartTheme } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { CategoryDatum } from "../../chart/types";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";

export interface LollipopChartProps extends DatumInteractionProps<CategoryDatum> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Categories to rank. Each row is `CategoryDatum` (`{ category, value }`);
   *  sorted by value descending internally. */
  data: CategoryDatum[];
  /** Accessible label for the SVG; state the takeaway, not every value. */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
}

/**
 * Ranked lollipop — a leaner alternative to the ranked bar for the same
 * question ("where does each item rank?"). A thin stem carries the eye to a dot
 * that marks the value against a common baseline; rows are sorted descending
 * with direct value labels. One accent hue: color carries no meaning here, the
 * category axis does — so hovering an item enlarges its dot (its siblings are
 * never dimmed).
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function LollipopChart({
  width,
  height,
  data,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
}: LollipopChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);

  const rows = useMemo(
    () => [...data].sort((a, b) => b.value - a.value),
    [data]
  );
  const valueRange = useMemo(
    () => valueDomain(rows.map((d) => d.value)),
    [rows]
  );

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
        const band = bandByIndex(
          rows.map((d) => d.category),
          {
            range: [0, innerHeight],
            padding: 0.3,
          }
        );
        const xScale = scaleLinear({
          domain: valueRange,
          range: [0, innerWidth],
          nice: true,
        });
        const bh = band.bandwidth;
        const r = Math.min(6, Math.max(3, bh / 3));
        const zeroX = xScale(0);
        return (
          <>
            {rows.map((d, i) => {
              const y = band.center(i);
              const cx = xScale(d.value);
              // Enlarge the hovered dot; never dim its siblings (the mark
              // here is a stem + a small circle head, not a filled region,
              // so a radius bump reads better than an outline --
              // `chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` doc comment notes
              // this is the equivalent mechanism for a small-point mark,
              // same as `radar-chart.tsx`'s vertex dots).
              const isHovered = hover === i;
              return (
                <g
                  key={`${d.category}-${i}`}
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
                  <line
                    x1={zeroX}
                    x2={cx}
                    y1={y}
                    y2={y}
                    stroke={theme.accent}
                    strokeWidth={2}
                  />
                  <circle
                    cx={cx}
                    cy={y}
                    r={isHovered ? r + 2 : r}
                    fill={theme.accent}
                  />
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
                    {valueFmt(d.value)}
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
