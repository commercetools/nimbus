import { useMemo, useState } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ChartContainer } from "../../chart/chart-container";
import { bandByIndex, valueDomain } from "../../chart/scales";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { devWarn } from "../../chart/dev-warn";
import { useChartTheme, readableTextColor } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { CategoryDatum } from "../../chart/types";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";
import { ValueLabel } from "../../chart/value-labels";

export interface RadialBarChartProps extends DatumInteractionProps<CategoryDatum> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Categories to plot. Each row is `CategoryDatum` (`{ category, value }`);
   *  drawn in the given order, one angular slot per row. */
  data: CategoryDatum[];
  /** Accessible label for the SVG; state the takeaway, not every value. */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /**
   * Draw each bar's formatted value centered inside its own sector, at its
   * mid-radius and mid-angle (`chart/value-labels.tsx`'s `ValueLabel`), with
   * a WCAG-contrast-aware ink/surface pick (`readableTextColor` -- the same
   * "on-mark" convention `Heatmap`/`RFMGrid`/`CohortTriangle`/`Treemap`
   * already use for their own cell labels). This chart's rim just outside
   * `outer` is already claimed by the always-on category label, so unlike
   * `DonutChart`/`SunburstChart`'s outer-radius placement, the value sits
   * *inside* the bar instead -- reaching for the rim here would either
   * collide with the category label or grow onto the bar's own fill with
   * no contrast-aware color. A sector thinner than `MIN_LABEL_THICKNESS` or
   * narrower than `MIN_LABEL_ARC_WIDTH` at its mid-radius skips its label --
   * the same minimum-cell-size gating idea `Heatmap` uses. Default `false`
   * (no change from today's unlabeled bars).
   */
  showValues?: boolean;
  /**
   * Angular sweep the categories are laid out across, in radians, using
   * the same clockwise-from-12-o'clock convention `polar()` (below) and
   * `gauge.tsx`'s own `START_ANGLE`/`END_ANGLE` already use — so a partial
   * sweep (e.g. `startAngle={-Math.PI / 2}`, `endAngle={Math.PI / 2}` for
   * the same upper-semicircle `Gauge` uses) is a direct, gauge-style
   * option instead of always the full circle. A muted track sector spans
   * `startAngle`..`endAngle` at the same radii as the value sectors,
   * drawn once behind them — the same "track then value arc(s)" shape
   * `Gauge` uses, generalized from one arc to N per-category ones.
   * Defaults to the full circle (today's rendering, unchanged).
   */
  startAngle?: number;
  endAngle?: number;
  /**
   * Show the data's total (or, while a sector is hovered/focused, that
   * sector's own value and category) centered in the chart — the same
   * two-line "big number, small caption" convention `donut-chart.tsx`
   * already uses for its center label, reused here rather than
   * reinvented. Unlike `DonutChart`'s hover state (a *share* of the
   * total, since a donut is inherently part-to-whole), this always shows
   * a plain magnitude — `RadialBarChart`'s bars are not guaranteed to sum
   * to a meaningful whole, so a percentage here would imply a
   * part-to-whole relationship the chart doesn't actually promise.
   * Default `false` (no change from today's rendering).
   */
  showTotal?: boolean;
}

/** Point on a circle for an angle measured clockwise from 12 o'clock. */
function polar(r: number, angle: number): [number, number] {
  return [r * Math.sin(angle), -r * Math.cos(angle)];
}

/**
 * Minimum sector size (px) before a value label is drawn inside it -- same
 * thresholds `Heatmap` uses for its own in-cell labels (`cw > 26 && ch >
 * 16`), applied here to a sector's arc width and radial thickness.
 */
const MIN_LABEL_ARC_WIDTH = 26;
const MIN_LABEL_THICKNESS = 16;

/** SVG path for an annular sector (a radial bar) centered on the origin. */
function sectorPath(r0: number, r1: number, a0: number, a1: number): string {
  const largeArc = a1 - a0 > Math.PI ? 1 : 0;
  const [x0o, y0o] = polar(r1, a0);
  const [x1o, y1o] = polar(r1, a1);
  const [x1i, y1i] = polar(r0, a1);
  const [x0i, y0i] = polar(r0, a0);
  return [
    `M${x0o},${y0o}`,
    `A${r1},${r1} 0 ${largeArc} 1 ${x1o},${y1o}`,
    `L${x1i},${y1i}`,
    `A${r0},${r0} 0 ${largeArc} 0 ${x0i},${y0i}`,
    "Z",
  ].join(" ");
}

/**
 * Radial (polar) bar chart — bars grow outward from a common inner radius, one
 * angular slot per category. Length still lives on a common baseline (the inner
 * ring), so it reads as magnitude; the circular layout is the trade for a
 * compact, distinctive form. One accent hue (identity is the angular position),
 * hover highlights a bar and shows its value. `startAngle`/`endAngle` swap the
 * default full circle for a partial (gauge-style) sweep; `showTotal` centers
 * the data's grand total.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function RadialBarChart({
  width,
  height,
  data,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  showValues,
  startAngle = 0,
  endAngle = Math.PI * 2,
  showTotal,
}: RadialBarChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);
  // BC-2/BC-3 (docs/bug-classes.md): an un-guarded `[0, max]` domain both
  // extrapolates a negative value past the outer ring when `max` is also
  // negative (BC-2) and, when every value is <= 0, degenerates to `[0, 0]`,
  // which `scaleLinear` maps to the *range midpoint* for any input rather
  // than the inner ring (BC-3). `valueDomain` over clamped values avoids
  // both.
  const radiusDomain = useMemo(
    () => valueDomain(data.map((d) => Math.max(0, d.value))),
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  if (data.some((d) => d.value < 0)) {
    devWarn(
      "radial-bar-chart:negative",
      "RadialBarChart: negative values are drawn as 0 (an arc length cannot encode a negative magnitude)."
    );
  }

  const label = ariaLabel ?? `Radial bar chart of ${data.length} categories`;
  const table = {
    columns: ["Category", "Value"],
    rows: data.map((d) => [d.category, d.value]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const cx = innerWidth / 2;
        const cy = innerHeight / 2;
        // Reserve a rim for category labels.
        const outer = Math.max(0, Math.min(innerWidth, innerHeight) / 2 - 18);
        const inner = outer * 0.3;
        const angle = bandByIndex(
          data.map((d) => d.category),
          {
            range: [startAngle, endAngle],
            padding: 0.25,
          }
        );
        const radius = scaleLinear({
          domain: radiusDomain,
          range: [inner, outer],
        });
        const bw = angle.bandwidth;
        const hovered = hover != null ? data[hover] : null;
        // Every bar shares the same fill, so the contrast-aware pick is the
        // same for all of them -- compute it once rather than per sector.
        const valueLabelColor = readableTextColor(
          theme.accent,
          theme.ink,
          theme.surface
        );
        // Grand total across every category -- the plain magnitude
        // `showTotal`'s center label shows when nothing is hovered.
        const total = data.reduce((s, d) => s + Math.max(0, d.value), 0);
        // The track ring only earns its keep once the sweep is genuinely
        // partial -- a full circle has no "where does this stop" boundary
        // to mark, so drawing it unconditionally would be a visual change
        // at the *default* sweep too, not just an opt-in one.
        const isPartialSweep = startAngle !== 0 || endAngle !== Math.PI * 2;
        return (
          <>
            <Group top={cy} left={cx}>
              {isPartialSweep && (
                // Muted track: the full startAngle..endAngle sweep at the
                // same radii the value sectors use, drawn once behind them
                // -- the same "track then value arc" shape `gauge.tsx` uses
                // for its one arc, generalized to N per-category ones.
                <path
                  d={sectorPath(inner, outer, startAngle, endAngle)}
                  fill={theme.grid}
                />
              )}
              {data.map((d, i) => {
                const a0 = angle.pos(i) + bw * 0.05;
                const a1 = a0 + bw * 0.9;
                const aMid = (a0 + a1) / 2;
                // Clamp at the render call too: a negative value must draw
                // at the inner ring (0 length), not extrapolate past it.
                const r1 = Math.max(inner, radius(Math.max(0, d.value)));
                // Outline the hovered sector only; never dim its siblings
                // (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` -- the shared
                // convention, replacing a per-chart "dim everyone else"
                // opacity ternary).
                const isHovered = hover === i;
                const [lx, ly] = polar(outer + 10, aMid);
                const flip = aMid > Math.PI;
                const midR = (inner + r1) / 2;
                const arcWidth = midR * (a1 - a0);
                const canLabel =
                  r1 - inner >= MIN_LABEL_THICKNESS &&
                  arcWidth >= MIN_LABEL_ARC_WIDTH;
                const [vx, vy] = polar(midR, aMid);
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
                    <path
                      d={sectorPath(inner, r1, a0, a1)}
                      fill={theme.accent}
                      stroke={isHovered ? theme.ink : "none"}
                      strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
                    />
                    <text
                      x={lx}
                      y={ly}
                      dy="0.32em"
                      textAnchor={flip ? "end" : "start"}
                      style={emText(10)}
                      fill={theme.mutedInk}
                    >
                      {d.category}
                    </text>
                    {showValues && canLabel && (
                      <ValueLabel
                        x={vx}
                        y={vy}
                        text={valueFmt(d.value)}
                        color={valueLabelColor}
                      />
                    )}
                  </g>
                );
              })}
              {showTotal && (
                <>
                  <text
                    textAnchor="middle"
                    dy={-2}
                    style={emText(20)}
                    fontWeight={700}
                    fill={theme.ink}
                  >
                    {hovered ? valueFmt(hovered.value) : valueFmt(total)}
                  </text>
                  <text
                    textAnchor="middle"
                    dy={16}
                    style={emText(11)}
                    fill={theme.mutedInk}
                  >
                    {hovered ? hovered.category : "Total"}
                  </text>
                </>
              )}
            </Group>
            {hovered && (
              <SvgTooltip
                x={cx}
                innerWidth={innerWidth}
                top={4}
                lines={[hovered.category, valueFmt(hovered.value)]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
