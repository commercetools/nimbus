import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { extent } from "d3-array";
import { quadtree } from "d3-quadtree";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { PointMark, pointShapeFor } from "../../chart/point-shapes";
import { useForcedColors } from "../../chart/use-forced-colors";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { ScatterPoint } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";

export interface ScatterPlotProps<T = ScatterPoint> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Points to plot; one dot each. Defaults to the `ScatterPoint` shape
   *  (`{ x, y, label?, group? }`). Pass `x`/`y` accessors for a custom row type. */
  points: T[];
  /** x accessor. Defaults to `d.x` (the ScatterPoint shape). Required for a custom row type. */
  x?: (d: T) => number;
  /** y accessor. Defaults to `d.y`. Required for a custom row type. */
  y?: (d: T) => number;
  /** Optional group accessor (fixed categorical color). Defaults to `d.group`. */
  group?: (d: T) => string | undefined;
  /** Optional point-label accessor (tooltip title). Defaults to `d.label`. */
  label?: (d: T) => string | undefined;
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<T>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<T>;
  /** Layer-2 overlays (TrendLine, ReferenceLine…) drawn on top of the points. */
  children?: ReactNode;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /**
   * When set, hover/click are resolved via a `d3-quadtree` nearest-point
   * lookup on one plot-wide overlay instead of each point's own listener —
   * one DOM listener regardless of point count, and the nearest point wins
   * even where dots overlap (whichever is on top of the DOM stack would
   * otherwise always win). The value is the search radius in pixels; a
   * pointer farther than this from every point reports no hover. Omit for
   * today's default: each point keeps its own `onMouseEnter`/`onClick`.
   */
  quadtreeHitRadius?: number;
  /**
   * Distinguish groups by marker SHAPE, in addition to color, so groups stay
   * distinguishable without color alone — monochrome print, a photocopy, or
   * `forced-colors` mode. A fill *texture* (`chart/patterns.tsx`) is not used
   * here: a scatter point's radius is fixed at 5px (6px on hover), under one
   * texture tile, where a fill pattern would read as noise, not a shape —
   * shape has no such floor. Default `false` (color only, unchanged). Turned
   * on automatically (regardless of this prop) when the OS is already in a
   * forced-colors context — see `useForcedColors`.
   */
  texture?: boolean;
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
  valueFormat,
  quadtreeHitRadius,
  texture,
}: ScatterPlotProps<T>) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;

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
  // In forced-colors context, real hues aren't preserved by the OS anyway --
  // one system foreground color for every point, with the per-group marker
  // shape (below) as the only identity carrier.
  const colorFor = (p: T) => {
    if (forcedColors) return "CanvasText";
    const g = getGroup(p);
    return g ? groupColor(g) : theme.accent;
  };
  // Shape only carries meaning when color does too (2+ groups) -- an
  // ungrouped point, or the only group present, has nothing to encode.
  const shapeFor = (p: T) => {
    const g = getGroup(p);
    return effectiveTexture && g && showLegend
      ? pointShapeFor(groups.indexOf(g))
      : "circle";
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
        // Built in pixel space so `find(mx, my, radius)` compares directly
        // against pointer coordinates -- only when quadtreeHitRadius opts in
        // (see the prop doc); otherwise each circle keeps its own listener.
        const qt =
          quadtreeHitRadius != null
            ? quadtree<{ i: number; x: number; y: number }>()
                .x((n) => n.x)
                .y((n) => n.y)
                .addAll(
                  points.map((p, i) => ({
                    i,
                    x: xScale(getX(p)),
                    y: yScale(getY(p)),
                  }))
                )
            : null;
        const resolveNearest = (mx: number, my: number) =>
          qt?.find(mx, my, quadtreeHitRadius)?.i;
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
            {points.map((p, i) => (
              <PointMark
                key={getLabel(p) ?? i}
                shape={shapeFor(p)}
                cx={xScale(getX(p))}
                cy={yScale(getY(p))}
                // Bold the hovered point by growing it (5px -> 6px); never
                // dim its siblings -- the existing bump mechanism this chart
                // already used, unchanged. A stroke outline would be
                // redundant here on top of the size bump.
                r={hover === i ? 6 : 5}
                fill={colorFor(p)}
                fillOpacity={0.85}
                stroke={theme.surface}
                strokeWidth={1}
                {...(qt
                  ? {}
                  : {
                      onMouseEnter: () => {
                        setHover(i);
                        onDatumHover?.({
                          datum: p,
                          index: i,
                          seriesId: getGroup(p),
                        });
                      },
                      onMouseLeave: () => {
                        setHover(null);
                        onDatumHover?.(null);
                      },
                      onClick: () =>
                        onDatumClick?.({
                          datum: p,
                          index: i,
                          seriesId: getGroup(p),
                        }),
                    })}
              />
            ))}
            {qt && (
              <rect
                x={0}
                y={0}
                width={innerWidth}
                height={innerHeight}
                fill="transparent"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const i = resolveNearest(
                    e.clientX - rect.left,
                    e.clientY - rect.top
                  );
                  if (i != null) {
                    setHover(i);
                    onDatumHover?.({
                      datum: points[i],
                      index: i,
                      seriesId: getGroup(points[i]),
                    });
                  } else {
                    setHover(null);
                    onDatumHover?.(null);
                  }
                }}
                onMouseLeave={() => {
                  setHover(null);
                  onDatumHover?.(null);
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const i = resolveNearest(
                    e.clientX - rect.left,
                    e.clientY - rect.top
                  );
                  if (i != null) {
                    onDatumClick?.({
                      datum: points[i],
                      index: i,
                      seriesId: getGroup(points[i]),
                    });
                  }
                }}
              />
            )}
            {children}
            {hp && (
              <SvgTooltip
                x={xScale(getX(hp))}
                innerWidth={innerWidth}
                lines={[
                  getLabel(hp) ?? "Point",
                  `x: ${valueFmt(getX(hp))}`,
                  `y: ${valueFmt(getY(hp))}`,
                ]}
              />
            )}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
