import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear, scaleSqrt } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { extent, max } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import { emText } from "../../chart/typography";

/** A point with a third magnitude encoded as bubble area. */
export type BubblePoint = {
  x: number;
  y: number;
  size: number;
  group?: string;
  label?: string;
};

export interface BubbleChartProps {
  width: number;
  height: number;
  points: BubblePoint[];
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
}

const R_MIN = 4;
const R_MAX = 28;

/**
 * Two-variable relationship with a third magnitude on bubble AREA (a sqrt
 * size-scale, so area — not radius — is proportional to `size`). Optional color
 * by group in fixed categorical order; ungrouped bubbles use the accent. A
 * size legend of reference circles decodes the area channel.
 */
export function BubbleChart({
  width,
  height,
  points,
  ariaLabel,
  children,
}: BubbleChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

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
  const maxSize = useMemo(() => max(points, (p) => p.size) ?? 0, [points]);
  // Largest first so smaller bubbles stay hoverable on top.
  const ordered = useMemo(
    () => points.map((p, i) => ({ p, i })).sort((a, b) => b.p.size - a.p.size),
    [points]
  );
  const groupColor = useEntityColors(groups);

  if (width <= 0 || height <= 0 || points.length === 0) return null;

  const showLegend = groups.length >= 2;
  const colorFor = (p: BubblePoint) =>
    p.group ? groupColor(p.group) : theme.accent;
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
        const sizeScale = scaleSqrt({
          domain: [0, maxSize],
          range: [R_MIN, R_MAX],
        });
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
              tickFormat={(v) => formatCompact(v as number)}
              tickLabelProps={leftTickLabel(theme)}
            />
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              numTicks={5}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => formatCompact(v as number)}
              tickLabelProps={bottomTickLabel(theme)}
            />

            {ordered.map(({ p, i }) => (
              <circle
                key={p.label ?? i}
                cx={xScale(p.x)}
                cy={yScale(p.y)}
                r={sizeScale(p.size)}
                fill={colorFor(p)}
                fillOpacity={hover == null || hover === i ? 0.6 : 0.25}
                stroke={theme.surface}
                strokeWidth={1}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            ))}

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
                    {formatCompact(ref)}
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
                  `x: ${formatCompact(hp.x)}`,
                  `y: ${formatCompact(hp.y)}`,
                  `size: ${formatCompact(hp.size)}`,
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
