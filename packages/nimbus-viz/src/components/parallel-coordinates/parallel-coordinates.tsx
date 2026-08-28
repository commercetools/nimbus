import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { extent } from "d3-array";
import { ChartFrame } from "../../chart/chart-frame";
import { Legend } from "../../chart/legend";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";

/** One vertical axis: `key` selects the field on each row's `values`. */
export interface ParallelDimension {
  key: string;
  label: string;
}

/** One polyline: `values` is keyed by dimension `key`; `group` colors it. */
export interface ParallelRow {
  id: string;
  group?: string;
  values: Record<string, number>;
}

export interface ParallelCoordinatesProps {
  width: number;
  height: number;
  dimensions: ParallelDimension[];
  data: ParallelRow[];
  ariaLabel?: string;
}

interface Vertex {
  x: number;
  y: number;
}

const MARGIN = { top: 30, right: 32, bottom: 26, left: 44 };

/**
 * Multivariate relationship: N equally-spaced VERTICAL axes, each with its OWN
 * linear scale over that dimension's extent (the accepted exception to a shared
 * axis — parallel axes are independently scaled and labeled). A polyline per
 * row threads its per-dimension values across the axes; hovering one raises its
 * opacity and reads its values out. Color by `group` in fixed categorical
 * order; ungrouped rows use the accent.
 */
export function ParallelCoordinates({
  width,
  height,
  dimensions,
  data,
  ariaLabel,
}: ParallelCoordinatesProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const groups = useMemo(
    () =>
      Array.from(
        new Set(data.map((r) => r.group).filter((g): g is string => !!g))
      ),
    [data]
  );
  const groupColor = useEntityColors(groups);

  if (width <= 0 || height <= 0 || data.length === 0 || dimensions.length === 0)
    return null;

  const showLegend = groups.length >= 2;
  const legendHeight = showLegend ? 26 : 0;
  const chartHeight = height - legendHeight;
  const colorFor = (r: ParallelRow) =>
    r.group ? groupColor(r.group) : theme.accent;

  return (
    <div style={{ width, height }}>
      <ChartFrame
        width={width}
        height={chartHeight}
        margin={MARGIN}
        ariaLabel={
          ariaLabel ??
          `Parallel coordinates of ${data.length} rows across ${dimensions
            .map((d) => d.label)
            .join(", ")}`
        }
      >
        {({ innerWidth, innerHeight }) => {
          // Equally-spaced axis x positions (single axis → centered).
          const xFor = (j: number) =>
            dimensions.length > 1
              ? (j / (dimensions.length - 1)) * innerWidth
              : innerWidth / 2;

          // One independent scale per dimension over its own extent.
          const scales = dimensions.map((d) => {
            const domain = extent(data, (r) => r.values[d.key]) as [
              number,
              number,
            ];
            return scaleLinear({
              domain,
              range: [innerHeight, 0],
              nice: true,
            });
          });

          const pointsFor = (r: ParallelRow): Vertex[] =>
            dimensions.map((d, j) => ({
              x: xFor(j),
              y: scales[j](r.values[d.key]),
            }));

          const hoveredRow = hover != null ? data[hover] : null;

          return (
            <>
              {/* Row polylines */}
              {data.map((r, i) => {
                const active = hover === null || hover === i;
                const c = colorFor(r);
                return (
                  <LinePath<Vertex>
                    key={r.id}
                    data={pointsFor(r)}
                    x={(p) => p.x}
                    y={(p) => p.y}
                    fill="none"
                    stroke={c}
                    strokeWidth={hover === i ? 2.5 : 1.5}
                    strokeOpacity={active ? (hover === i ? 1 : 0.5) : 0.12}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}

              {/* Vertical axes: spine, dimension label, min/max ticks */}
              {dimensions.map((d, j) => {
                const scale = scales[j];
                const [lo, hi] = scale.domain() as [number, number];
                return (
                  <Group key={d.key} left={xFor(j)}>
                    <line
                      x1={0}
                      y1={0}
                      x2={0}
                      y2={innerHeight}
                      stroke={theme.axis}
                      strokeWidth={1}
                    />
                    <text
                      x={0}
                      y={-12}
                      textAnchor="middle"
                      fontSize={11}
                      fontFamily="system-ui, sans-serif"
                      fill={theme.mutedInk}
                    >
                      {d.label}
                    </text>
                    <text
                      x={-6}
                      y={4}
                      textAnchor="end"
                      fontSize={10}
                      fontFamily="system-ui, sans-serif"
                      fill={theme.mutedInk}
                    >
                      {formatCompact(hi)}
                    </text>
                    <text
                      x={-6}
                      y={innerHeight}
                      textAnchor="end"
                      fontSize={10}
                      fontFamily="system-ui, sans-serif"
                      fill={theme.mutedInk}
                    >
                      {formatCompact(lo)}
                    </text>
                  </Group>
                );
              })}

              {hoveredRow && (
                <SvgTooltip
                  x={xFor(0)}
                  innerWidth={innerWidth}
                  lines={[
                    hoveredRow.group
                      ? `${hoveredRow.id} · ${hoveredRow.group}`
                      : hoveredRow.id,
                    ...dimensions.map(
                      (d) =>
                        `${d.label}: ${formatCompact(hoveredRow.values[d.key])}`
                    ),
                  ]}
                />
              )}
            </>
          );
        }}
      </ChartFrame>

      {showLegend && (
        <div style={{ paddingTop: 6 }}>
          <Legend
            items={groups.map((g) => ({ label: g, color: groupColor(g) }))}
          />
        </div>
      )}
    </div>
  );
}
