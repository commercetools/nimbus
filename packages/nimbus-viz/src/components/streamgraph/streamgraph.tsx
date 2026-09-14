import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AreaStack, Area, stack } from "@visx/shape";
import { AxisBottom } from "@visx/axis";
import { curveBasis } from "@visx/curve";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { bottomTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { nearestIndexByX } from "../../chart/nearest-x";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact, formatDayMonth } from "../../chart/format";
import type { Series } from "../../chart/types";

export interface StreamgraphProps {
  /** Plot width in pixels — supply from `ResponsiveContainer`. */
  width: number;
  /** Plot height in pixels — supply from `ResponsiveContainer`. */
  height: number;
  /** Series stacked around a centered baseline, aligned by index on shared x. */
  series: Series[];
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
}

/** A stack row: an x position (epoch ms) plus one numeric value per series id. */
interface StackDatum {
  x: number;
  [seriesId: string]: number;
}

const toDate = (x: number | Date): Date =>
  x instanceof Date ? x : new Date(x);

/**
 * Composition over time read as flowing shape: the same stacked series as a
 * stacked area, but with a wiggle/silhouette baseline so bands ripple around a
 * centered axis. No emphasized zero baseline and no value axis — a streamgraph
 * communicates relative shape and turnover, not absolute magnitude. Fixed-order
 * categorical fills, a legend, and a per-series hover readout.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function Streamgraph({
  width,
  height,
  series,
  ariaLabel,
  children,
}: StreamgraphProps) {
  const theme = useChartTheme();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const keys = useMemo(() => series.map((s) => s.id), [series]);
  const rows = useMemo<StackDatum[]>(() => {
    const base = series[0]?.data ?? [];
    return base.map((pt, i) => {
      const row: StackDatum = { x: +toDate(pt.x) };
      for (const s of series) row[s.id] = s.data[i]?.y ?? 0;
      return row;
    });
  }, [series]);
  const xDomain = useMemo(
    () => extent(rows, (r) => new Date(r.x)) as [Date, Date],
    [rows]
  );
  const color = useEntityColors(keys);

  if (width <= 0 || height <= 0 || series.length === 0 || rows.length === 0)
    return null;

  const showLegend = series.length >= 2;
  const hoveredX = hoverIndex != null ? rows[hoverIndex]?.x : undefined;
  const table = {
    columns: ["Date", ...series.map((s) => s.label)],
    rows: rows.map((r) => [
      formatDayMonth(new Date(r.x)),
      ...keys.map((k) => r[k]),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 16, bottom: 28, left: 16 }}
      ariaLabel={
        ariaLabel ?? `Streamgraph of ${series.map((s) => s.label).join(", ")}`
      }
      legend={
        showLegend
          ? series.map((s) => ({ label: s.label, color: color(s.id) }))
          : undefined
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleTime({ domain: xDomain, range: [0, innerWidth] });
        // Value y-scale for overlays: wiggle coordinates are scale-independent,
        // so derive the domain (it straddles zero) from the stacks — same stack
        // config as the AreaStack below, so overlays line up with the bands.
        const wiggleStacks = stack<StackDatum, string>({
          keys,
          value: (d, key) => d[key],
          offset: "wiggle",
          order: "insideout",
        })(rows);
        let lo = 0;
        let hi = 0;
        for (const layer of wiggleStacks) {
          for (const p of layer) {
            if (p[0] < lo) lo = p[0];
            if (p[1] > hi) hi = p[1];
          }
        }
        const yScale = scaleLinear({
          domain: [lo, hi],
          range: [innerHeight, 0],
        });

        return (
          <ChartScaleProvider
            value={{ yScale, xScale, xBandwidth: 0, innerWidth, innerHeight }}
          >
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              numTicks={Math.max(2, Math.min(6, Math.floor(innerWidth / 90)))}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => formatDayMonth(v as Date)}
              tickLabelProps={bottomTickLabel(theme)}
            />

            <AreaStack<StackDatum, string>
              data={rows}
              keys={keys}
              value={(d, key) => d[key]}
              offset="wiggle"
              order="insideout"
            >
              {({ stacks }) => (
                <>
                  {stacks.map((layer) => (
                    <Area
                      key={layer.key}
                      data={layer}
                      x={(d) => xScale(new Date(d.data.x))}
                      y0={(d) => yScale(d[0])}
                      y1={(d) => yScale(d[1])}
                      curve={curveBasis}
                      fill={color(layer.key)}
                      fillOpacity={0.85}
                      stroke={theme.surface}
                      strokeWidth={1}
                    />
                  ))}
                </>
              )}
            </AreaStack>

            {hoverIndex != null && hoveredX != null && (
              <line
                x1={xScale(new Date(hoveredX))}
                x2={xScale(new Date(hoveredX))}
                y1={0}
                y2={innerHeight}
                stroke={theme.axis}
                strokeDasharray="3 3"
              />
            )}

            <rect
              x={0}
              y={0}
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              onMouseMove={(e) => {
                const box = e.currentTarget.getBoundingClientRect();
                const mx = e.clientX - box.left;
                const idx = nearestIndexByX(
                  mx,
                  xScale,
                  rows,
                  (r) => new Date(r.x)
                );
                if (idx >= 0) setHoverIndex(idx);
              }}
              onMouseLeave={() => setHoverIndex(null)}
            />

            {hoverIndex != null && hoveredX != null && (
              <SvgTooltip
                x={xScale(new Date(hoveredX))}
                innerWidth={innerWidth}
                lines={[
                  formatDayMonth(new Date(hoveredX)),
                  ...series.map((s) => {
                    const p = s.data[hoverIndex];
                    return `${s.label}: ${
                      p && p.y != null ? formatCompact(p.y) : "—"
                    }`;
                  }),
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
