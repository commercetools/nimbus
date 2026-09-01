import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { ScatterPoint } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";

export interface ScatterPlotProps {
  width: number;
  height: number;
  points: ScatterPoint[];
  ariaLabel?: string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<ScatterPoint>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<ScatterPoint>;
  /** Layer-2 overlays (TrendLine, ReferenceLine…) drawn on top of the points. */
  children?: ReactNode;
}

/**
 * Two-variable relationship. Points optionally colored by group (fixed
 * categorical order); a single-group scatter uses the accent. Per-point hover
 * with an SVG readout.
 */
export function ScatterPlot({
  width,
  height,
  points,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  children,
}: ScatterPlotProps) {
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
  const groupColor = useEntityColors(groups);

  if (width <= 0 || height <= 0 || points.length === 0) return null;

  const showLegend = groups.length >= 2;
  const colorFor = (p: ScatterPoint) =>
    p.group ? groupColor(p.group) : theme.accent;
  const table = {
    columns: ["Label", "x", "y", "Group"],
    rows: points.map((p) => [p.label ?? "", p.x, p.y, p.group ?? ""]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 16, bottom: 28, left: 44 }}
      ariaLabel={ariaLabel ?? `Scatter plot of ${points.length} points`}
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
        const hp = hover != null ? points[hover] : null;
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
            {points.map((p, i) => (
              <circle
                key={p.label ?? i}
                cx={xScale(p.x)}
                cy={yScale(p.y)}
                r={hover === i ? 6 : 5}
                fill={colorFor(p)}
                fillOpacity={hover == null || hover === i ? 0.85 : 0.35}
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
            ))}
            {children}
            {hp && (
              <SvgTooltip
                x={xScale(hp.x)}
                innerWidth={innerWidth}
                lines={[
                  hp.label ?? "Point",
                  `x: ${formatCompact(hp.x)}`,
                  `y: ${formatCompact(hp.y)}`,
                ]}
              />
            )}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
