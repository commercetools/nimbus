import { useCallback, useMemo, useState } from "react";
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

export interface ScatterPlotProps<T = ScatterPoint> {
  width: number;
  height: number;
  points: T[];
  /** x accessor. Defaults to `d.x` (the ScatterPoint shape). Required for a custom row type. */
  x?: (d: T) => number;
  /** y accessor. Defaults to `d.y`. Required for a custom row type. */
  y?: (d: T) => number;
  /** Optional group accessor (fixed categorical color). Defaults to `d.group`. */
  group?: (d: T) => string | undefined;
  /** Optional point-label accessor (tooltip title). Defaults to `d.label`. */
  label?: (d: T) => string | undefined;
  ariaLabel?: string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<T>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<T>;
  /** Layer-2 overlays (TrendLine, ReferenceLine…) drawn on top of the points. */
  children?: ReactNode;
}

/**
 * Two-variable relationship. Points optionally colored by group (fixed
 * categorical order); a single-group scatter uses the accent. Per-point hover
 * with an SVG readout.
 *
 * Generic over the row type `T`: pass `x`/`y` (and optionally `group`/`label`)
 * accessors to feed your own rows; all default to the built-in `ScatterPoint`.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function ScatterPlot<T = ScatterPoint>({
  width,
  height,
  points,
  x,
  y,
  group,
  label,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  children,
}: ScatterPlotProps<T>) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const getX = useCallback(
    (d: T): number => (x ? x(d) : (d as ScatterPoint).x),
    [x]
  );
  const getY = useCallback(
    (d: T): number => (y ? y(d) : (d as ScatterPoint).y),
    [y]
  );
  const getGroup = useCallback(
    (d: T): string | undefined =>
      group ? group(d) : (d as ScatterPoint).group,
    [group]
  );
  const getLabel = useCallback(
    (d: T): string | undefined =>
      label ? label(d) : (d as ScatterPoint).label,
    [label]
  );

  const groups = useMemo(
    () =>
      Array.from(
        new Set(points.map((p) => getGroup(p)).filter((g): g is string => !!g))
      ),
    [points, getGroup]
  );
  const xDomain = useMemo(
    () => extent(points, (p) => getX(p)) as [number, number],
    [points, getX]
  );
  const yDomain = useMemo(
    () => extent(points, (p) => getY(p)) as [number, number],
    [points, getY]
  );
  const groupColor = useEntityColors(groups);

  if (width <= 0 || height <= 0 || points.length === 0) return null;

  const showLegend = groups.length >= 2;
  const colorFor = (p: T) => {
    const g = getGroup(p);
    return g ? groupColor(g) : theme.accent;
  };
  const table = {
    columns: ["Label", "x", "y", "Group"],
    rows: points.map((p) => [
      getLabel(p) ?? "",
      getX(p),
      getY(p),
      getGroup(p) ?? "",
    ]),
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
                key={getLabel(p) ?? i}
                cx={xScale(getX(p))}
                cy={yScale(getY(p))}
                r={hover === i ? 6 : 5}
                fill={colorFor(p)}
                fillOpacity={hover == null || hover === i ? 0.85 : 0.35}
                stroke={theme.surface}
                strokeWidth={1}
                onMouseEnter={() => {
                  setHover(i);
                  onDatumHover?.({ datum: p, index: i, seriesId: getGroup(p) });
                }}
                onMouseLeave={() => {
                  setHover(null);
                  onDatumHover?.(null);
                }}
                onClick={() =>
                  onDatumClick?.({ datum: p, index: i, seriesId: getGroup(p) })
                }
              />
            ))}
            {children}
            {hp && (
              <SvgTooltip
                x={xScale(getX(hp))}
                innerWidth={innerWidth}
                lines={[
                  getLabel(hp) ?? "Point",
                  `x: ${formatCompact(getX(hp))}`,
                  `y: ${formatCompact(getY(hp))}`,
                ]}
              />
            )}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
