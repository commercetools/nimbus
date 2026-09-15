import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear, scaleSqrt } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { extent, max } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { devWarn } from "../../chart/dev-warn";
import { PointMark, pointShapeFor } from "../../chart/point-shapes";
import { useForcedColors } from "../../chart/use-forced-colors";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import { emText } from "../../chart/typography";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";

/** A point with a third magnitude encoded as bubble area. */
export type BubblePoint = {
  x: number;
  y: number;
  size: number;
  group?: string;
  label?: string;
};

export interface BubbleChartProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Points to plot; each is a `BubblePoint` (`{ x, y, size, group?, label? }`),
   *  with `size` mapped to bubble area (not radius). */
  points: BubblePoint[];
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<BubblePoint>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<BubblePoint>;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /**
   * Distinguish groups by marker SHAPE (`chart/point-shapes.tsx`) in
   * addition to color, so groups stay distinguishable without color alone
   * — monochrome print, a photocopy, or `forced-colors` mode. A fill
   * *texture* (`chart/patterns.tsx`) is not used here: a bubble's radius
   * can be as small as `R_MIN`, under one texture tile, where a pattern
   * reads as noise rather than a shape — shape has no such floor. Default
   * `false` (color only, unchanged). Turned on automatically (regardless
   * of this prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
}

const R_MIN = 4;
const R_MAX = 28;

/**
 * Two-variable relationship with a third magnitude on bubble AREA (a sqrt
 * size-scale, so area — not radius — is proportional to `size`). Optional color
 * by group in fixed categorical order; ungrouped bubbles use the accent. A
 * size legend of reference circles decodes the area channel.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function BubbleChart({
  width,
  height,
  points,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  children,
  valueFormat,
  texture,
}: BubbleChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;

  const groups = useMemo(
    () =>
      Array.from(
        new Set(points.map((p) => p.group).filter((g): g is string => !!g))
      ),
    [points]
  );
  const xDomain = useMemo(
    () => extent(points, (p) => p.x) as [number, number],
    [points]
  );
  const yDomain = useMemo(
    () => extent(points, (p) => p.y) as [number, number],
    [points]
  );
  // Clamped: a negative `size` cannot encode a magnitude, so it must not set
  // (or widen) the domain the honest values are scaled against.
  const maxSize = useMemo(
    () => max(points, (p) => Math.max(0, p.size)) ?? 0,
    [points]
  );
  // Largest first so smaller bubbles stay hoverable on top.
  const ordered = useMemo(
    () => points.map((p, i) => ({ p, i })).sort((a, b) => b.p.size - a.p.size),
    [points]
  );
  const groupColor = useEntityColors(groups);

  if (width <= 0 || height <= 0 || points.length === 0) return null;

  // BC-2 (docs/bug-classes.md): a negative `size` extrapolates through
  // `scaleSqrt` to either a small positive radius (plausible-looking) or an
  // invisible `r < 0` — neither is an honest picture of "cannot be negative".
  if (points.some((p) => p.size < 0)) {
    devWarn(
      "bubble-chart:negative-size",
      "BubbleChart: negative size values are drawn at the minimum radius (area cannot encode a negative magnitude)."
    );
  }

  const showLegend = groups.length >= 2;
  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // -- one system foreground color for every point, with per-group marker
  // shape (below) as the only identity carrier.
  const colorFor = (p: BubblePoint) =>
    forcedColors ? "CanvasText" : p.group ? groupColor(p.group) : theme.accent;
  // Shape only carries meaning when color does too (2+ groups) -- an
  // ungrouped bubble, or the only group present, has nothing to encode.
  const shapeFor = (p: BubblePoint) =>
    effectiveTexture && p.group && showLegend
      ? pointShapeFor(groups.indexOf(p.group))
      : "circle";
  const table = {
    columns: ["Label", "x", "y", "Size", "Group"],
    rows: points.map((p) => [p.label ?? "", p.x, p.y, p.size, p.group ?? ""]),
  };

  const refSizes = Array.from(
    new Set(
      [maxSize, Math.round(maxSize / 3)].filter((v) => v > 0).map(Math.round)
    )
  ).sort((a, b) => b - a);

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 16, bottom: 28, left: 44 }}
      ariaLabel={ariaLabel ?? `Bubble chart of ${points.length} points`}
      legend={
        showLegend
          ? groups.map((g) => ({ label: g, color: groupColor(g) }))
          : undefined
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleLinear({
          domain: xDomain,
          range: [0, innerWidth],
          nice: true,
        });
        const yScale = scaleLinear({
          domain: yDomain,
          range: [innerHeight, 0],
          nice: true,
        });
        // A degenerate [0, 0] domain (every point's size is 0 — a valid,
        // in-contract input, not a violation of "non-negative") maps every
        // input to the *range midpoint* under scaleSqrt's extrapolation, not
        // R_MIN — every bubble would render at a fixed mid-size with no
        // legend (refSizes already collapses to [] for this case), looking
        // like real, varying magnitude data when there is none. Guard it to
        // match refSizes' own "nothing to show" behavior.
        const sizeScale =
          maxSize > 0
            ? scaleSqrt({ domain: [0, maxSize], range: [R_MIN, R_MAX] })
            : () => R_MIN;
        const hp = hover != null ? points[hover] : null;

        const legendBaseX = innerWidth - R_MAX - 4;
        const legendBaseY = innerHeight - 4;

        return (
          <ChartScaleProvider
            value={{
              yScale: (v) => yScale(v),
              xScale: (v) => xScale(v instanceof Date ? +v : v),
              xBandwidth: 0,
              innerWidth,
              innerHeight,
            }}
          >
            <GridRows
              ticks={yScale.ticks(4)}
              y={(t) => yScale(t)}
              width={innerWidth}
            />
            <AxisLeft
              scale={yScale}
              numTicks={4}
              hideAxisLine
              hideTicks
              tickFormat={(v) => valueFmt(v as number)}
              tickLabelProps={leftTickLabel(theme)}
            />
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              numTicks={5}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => valueFmt(v as number)}
              tickLabelProps={bottomTickLabel(theme)}
            />

            {ordered.map(({ p, i }) => {
              // A negative size can't be encoded by area: clamp at the point
              // the radius is computed so it draws at R_MIN instead of
              // extrapolating to a small positive (plausible-wrong) or
              // negative (invisible) radius.
              const r = sizeScale(Math.max(0, p.size));
              return (
                <PointMark
                  key={i}
                  shape={shapeFor(p)}
                  cx={xScale(p.x)}
                  cy={yScale(p.y)}
                  r={r}
                  fill={colorFor(p)}
                  fillOpacity={hover == null || hover === i ? 0.6 : 0.25}
                  stroke={theme.surface}
                  strokeWidth={1}
                  onMouseEnter={() => {
                    setHover(i);
                    onDatumHover?.({ datum: p, index: i, seriesId: p.group });
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() =>
                    onDatumClick?.({ datum: p, index: i, seriesId: p.group })
                  }
                />
              );
            })}

            {/* Size legend: reference circles sharing a bottom baseline. */}
            {refSizes.map((ref) => {
              const r = sizeScale(ref);
              return (
                <g key={ref}>
                  <circle
                    cx={legendBaseX}
                    cy={legendBaseY - r}
                    r={r}
                    fill="none"
                    stroke={theme.mutedInk}
                    strokeOpacity={0.5}
                  />
                  <text
                    x={legendBaseX - R_MAX - 6}
                    y={legendBaseY - 2 * r}
                    dy={4}
                    style={emText(10)}
                    textAnchor="end"
                    fill={theme.mutedInk}
                  >
                    {valueFmt(ref)}
                  </text>
                </g>
              );
            })}

            {hp && (
              <SvgTooltip
                x={xScale(hp.x)}
                innerWidth={innerWidth}
                lines={[
                  hp.label ?? "Bubble",
                  `x: ${valueFmt(hp.x)}`,
                  `y: ${valueFmt(hp.y)}`,
                  `size: ${valueFmt(hp.size)}`,
                ]}
              />
            )}
            {children}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
