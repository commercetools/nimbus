import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { bandByIndex } from "../../chart/scales";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import { gaussianKde, median } from "../../stats";

/** One group's raw samples; the density is estimated here, not supplied. */
export interface SampleGroup {
  label: string;
  samples: number[];
}

export interface ViolinPlotProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** One group of raw samples per violin; the density is estimated here. */
  groups: SampleGroup[];
  /** Accessible label for the SVG; defaults to a generated summary. */
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
}

/** Number of points at which each group's density is evaluated. */
const RESOLUTION = 40;

/**
 * Violin plot — a grouped distribution that shows each group's full shape
 * (kernel-density estimate mirrored around its center), not just a five-number
 * summary. The median is marked with a line inside each violin. Like the box
 * plot, the category axis carries identity, so every violin uses one accent
 * fill; hovering shows the group's median and sample count.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function ViolinPlot({
  width,
  height,
  groups,
  ariaLabel,
  children,
}: ViolinPlotProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const yDomain = useMemo(
    () => extent(groups.flatMap((g) => g.samples)) as [number, number],
    [groups]
  );
  const stats = useMemo(
    () =>
      groups.map((g) => ({
        density: gaussianKde(g.samples, yDomain, RESOLUTION),
        median: median(g.samples) ?? 0,
        n: g.samples.length,
      })),
    [groups, yDomain]
  );
  const densityMax = useMemo(
    () =>
      Math.max(1e-9, ...stats.flatMap((s) => s.density.map((p) => p.density))),
    [stats]
  );

  if (width <= 0 || height <= 0 || groups.length === 0) return null;

  const label = ariaLabel ?? `Violin plot of ${groups.length} groups`;
  const table = {
    columns: ["Group", "n", "Median"],
    rows: groups.map((g, i) => [
      g.label,
      stats[i].n,
      formatCompact(stats[i].median),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 16, bottom: 28, left: 44 }}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const band = bandByIndex(
          groups.map((g) => g.label),
          {
            range: [0, innerWidth],
            padding: 0.3,
          }
        );
        const yScale = scaleLinear({
          domain: yDomain,
          range: [innerHeight, 0],
          nice: true,
        });
        const halfBand = band.bandwidth / 2;
        const wScale = scaleLinear({
          domain: [0, densityMax],
          range: [0, halfBand * 0.95],
        });
        return (
          <ChartScaleProvider
            value={{
              yScale,
              xScale: (v) => band.scale(String(v)) ?? 0,
              xBandwidth: band.bandwidth,
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
              scale={band.scale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              tickFormat={band.tickFormat}
              tickLabelProps={bottomTickLabel(theme)}
            />
            {groups.map((_, i) => {
              const cx = band.center(i);
              const s = stats[i];
              const active = hover == null || hover === i;
              const right = s.density.map(
                (p) => `L${cx + wScale(p.density)},${yScale(p.x)}`
              );
              const leftBack = [...s.density]
                .reverse()
                .map((p) => `L${cx - wScale(p.density)},${yScale(p.x)}`);
              const first = s.density[0];
              const d = [
                `M${cx + wScale(first.density)},${yScale(first.x)}`,
                ...right.slice(1),
                ...leftBack,
                "Z",
              ].join(" ");
              return (
                <g
                  key={i}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <path
                    d={d}
                    fill={theme.accent}
                    fillOpacity={active ? 0.28 : 0.12}
                    stroke={theme.ink}
                    strokeWidth={1.25}
                  />
                  <line
                    x1={cx - halfBand * 0.4}
                    x2={cx + halfBand * 0.4}
                    y1={yScale(s.median)}
                    y2={yScale(s.median)}
                    stroke={theme.ink}
                    strokeWidth={2}
                  />
                </g>
              );
            })}
            {hover != null && groups[hover] && (
              <SvgTooltip
                x={band.center(hover)}
                innerWidth={innerWidth}
                lines={[
                  groups[hover].label,
                  `median: ${formatCompact(stats[hover].median)}`,
                  `n = ${stats[hover].n}`,
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
