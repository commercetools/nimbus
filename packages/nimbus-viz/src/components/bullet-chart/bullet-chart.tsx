import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { sequentialColor, useChartTheme } from "../../theme";
import { formatSignedCompact } from "../../chart/format";
import { useChartFormatters } from "../../chart/format-locale";
import { emText } from "../../chart/typography";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";
import { clamp, plotPointerPosition } from "../../chart/pointer";

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
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<BulletDatum>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<BulletDatum>;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
}

/**
 * TARGET/RANGE: a compact horizontal measure-vs-target readout, one row per
 * bullet. Graded qualitative background bands (poor/satisfactory/good, etc.)
 * use a muted single-hue gray ramp — they carry magnitude context, not entity
 * identity, so a categorical hue would be wrong here. A single accent bar is
 * the measure; the target is always a tick mark, never implied by color
 * alone. Hovering a row outlines its measure bar (its siblings are never
 * dimmed) and the tooltip's horizontal position tracks the pointer while it
 * stays inside that row.
 */
export function BulletChart({
  width,
  height,
  data,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  valueFormat,
}: BulletChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);
  // Live pointer x (plot-local), while a row is being hovered by mouse --
  // null once the pointer leaves, so the tooltip falls back to the row's
  // own value-derived position rather than a stale coordinate from a
  // previous hover.
  const [pointerX, setPointerX] = useState<number | null>(null);
  const grayRamp = sequentialColor(theme.ramps.gray);

  const domainMax = useMemo(
    () =>
      Math.max(
        1,
        ...data.flatMap((d) => [d.measure, d.target, ...(d.ranges ?? [])])
      ),
    [data]
  );
  const domainMin = useMemo(
    () =>
      Math.min(
        0,
        ...data.flatMap((d) => [d.measure, d.target, ...(d.ranges ?? [])])
      ),
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  // Full-precision values here (not formatCompact) are deliberate: the table
  // is the assistive-tech fallback, where exact numbers read better than the
  // compact labels/tooltip used in the visual canvas.
  const table = {
    columns: ["Measure", "Value", "Target", "Δ vs target"],
    rows: data.map((d) => [
      d.label,
      d.measure,
      d.target,
      formatSignedCompact(d.measure - d.target),
    ]),
  };

  // Named so the pointer math below (which needs the same left/top offset
  // xScale is drawn relative to) can never drift from what's actually
  // passed to ChartContainer.
  const MARGIN = { top: 8, right: 44, bottom: 8, left: 100 };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={MARGIN}
      ariaLabel={ariaLabel ?? `Bullet chart of ${data.length} measures`}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleLinear({
          domain: [domainMin, domainMax],
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
              // Outline the hovered row's measure bar; never dim its
              // siblings (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` -- the
              // one shared convention, replacing a per-chart "dim everyone
              // else" opacity ternary).
              const isHovered = hover === i;
              return (
                <g
                  key={`${d.label}-${i}`}
                  onMouseEnter={(e) => {
                    setHover(i);
                    const p = plotPointerPosition(e, MARGIN);
                    if (p) setPointerX(p.x);
                    onDatumHover?.({ datum: d, index: i });
                  }}
                  onMouseMove={(e) => {
                    const p = plotPointerPosition(e, MARGIN);
                    if (p) setPointerX(p.x);
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    setPointerX(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => onDatumClick?.({ datum: d, index: i })}
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
                        key={`${b}-${bi}`}
                        x={x0}
                        y={cy - rowH * 0.36}
                        width={Math.max(0, x1 - x0)}
                        height={rowH * 0.72}
                        fill={grayRamp(t)}
                      />
                    );
                  })}
                  <rect
                    x={Math.min(xScale(0), xScale(d.measure))}
                    y={cy - barH / 2}
                    width={Math.abs(xScale(d.measure) - xScale(0))}
                    height={barH}
                    fill={theme.accent}
                    stroke={isHovered ? theme.ink : "none"}
                    strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
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
                    x={xScale(d.measure) + (d.measure < 0 ? -6 : 6)}
                    y={cy}
                    dy="0.32em"
                    textAnchor={d.measure < 0 ? "end" : "start"}
                    style={emText(10)}
                    fill={theme.ink}
                  >
                    {valueFmt(d.measure)}
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
                    x={
                      // Live pointer x while the mouse is the hover source;
                      // falls back to the row's own value-derived position
                      // otherwise (there is no keyboard focus path here).
                      pointerX != null
                        ? clamp(pointerX, innerWidth)
                        : xScale(d.measure)
                    }
                    innerWidth={innerWidth}
                    top={Math.max(0, cy - rowH * 0.36 - 4)}
                    lines={[
                      d.label,
                      `Measure: ${valueFmt(d.measure)}`,
                      `Target: ${valueFmt(d.target)}`,
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
