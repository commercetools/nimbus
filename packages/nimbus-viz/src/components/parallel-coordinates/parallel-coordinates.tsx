import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { strokeDasharrayFor } from "../../chart/stroke-styles";
import { useForcedColors } from "../../chart/use-forced-colors";
import { useChartTheme, useEntityColors } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";

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

export interface ParallelCoordinatesProps extends DatumInteractionProps<ParallelRow> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Vertical axes, left to right; each gets its own independent linear scale. */
  dimensions: ParallelDimension[];
  /** One polyline per row; `values` is keyed by each dimension's `key`. */
  data: ParallelRow[];
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
  /**
   * Distinguish groups by a `strokeDasharray` rhythm (`chart/stroke-styles.ts`),
   * in addition to color, so groups stay distinguishable without color alone —
   * monochrome print, a photocopy, or `forced-colors` mode. A fill
   * `patternFill` (`chart/patterns.tsx`) is not used here: a polyline has no
   * fill area at all, so the stroke's dash rhythm is the one non-color
   * channel. Dash only carries meaning when color does too (2+ groups) -- an
   * ungrouped row, or the only group present, keeps a solid stroke. Default
   * `false` (color only, unchanged). Turned on automatically (regardless of
   * this prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
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
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function ParallelCoordinates({
  width,
  height,
  dimensions,
  data,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  texture,
}: ParallelCoordinatesProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;

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
  // In forced-colors context, real hues aren't preserved by the OS anyway --
  // one system foreground color for every row, with the per-group dash
  // rhythm (below) as the only identity carrier.
  const colorFor = (r: ParallelRow) => {
    if (forcedColors) return "CanvasText";
    return r.group ? groupColor(r.group) : theme.accent;
  };
  // Dash only carries meaning when color does too (2+ groups) -- an
  // ungrouped row, or the only group present, has nothing to encode. Keyed
  // by GROUP index (like `groupColor`), not row index: several rows commonly
  // share one group and must keep the same dash they share a color with.
  const dashFor = (r: ParallelRow) =>
    effectiveTexture && r.group && showLegend
      ? strokeDasharrayFor(groups.indexOf(r.group))
      : undefined;
  const table = {
    columns: ["Row", ...dimensions.map((d) => d.label), "Group"],
    rows: data.map((r) => [
      r.id,
      ...dimensions.map((d) => r.values[d.key] ?? ""),
      r.group ?? "",
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={MARGIN}
      legend={
        showLegend
          ? groups.map((g) => ({ label: g, color: groupColor(g) }))
          : undefined
      }
      table={table}
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
                  strokeDasharray={dashFor(r)}
                  strokeOpacity={active ? (hover === i ? 1 : 0.5) : 0.12}
                  onMouseEnter={() => {
                    setHover(i);
                    onDatumHover?.({ datum: r, index: i, seriesId: r.group });
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() =>
                    onDatumClick?.({ datum: r, index: i, seriesId: r.group })
                  }
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
                    style={emText(11)}
                    fill={theme.mutedInk}
                  >
                    {d.label}
                  </text>
                  <text
                    x={-6}
                    y={4}
                    textAnchor="end"
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {valueFmt(hi)}
                  </text>
                  <text
                    x={-6}
                    y={innerHeight}
                    textAnchor="end"
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {valueFmt(lo)}
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
                    (d) => `${d.label}: ${valueFmt(hoveredRow.values[d.key])}`
                  ),
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
