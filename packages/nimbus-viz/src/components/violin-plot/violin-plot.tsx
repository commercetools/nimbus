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
import { useChartFormatters } from "../../chart/format-locale";
import { gaussianKde, median } from "../../stats";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";
import type { DatumInteractionProps } from "../../chart/interaction";

/** One group's raw samples; the density is estimated here, not supplied. */
export interface SampleGroup {
  label: string;
  samples: number[];
}

export interface ViolinPlotProps extends DatumInteractionProps<SampleGroup> {
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
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
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
  valueFormat,
  onDatumClick,
  onDatumHover,
}: ViolinPlotProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
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
      valueFmt(stats[i].median),
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
              tickFormat={(v) => valueFmt(v as number)}
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
            {groups.map((g, i) => {
              const cx = band.center(i);
              const s = stats[i];
              // Outline the hovered/focused group's violin path more
              // prominently; never dim its siblings (`chart/marks.ts`'s
              // `ACTIVE_STROKE_WIDTH` -- the shared convention, replacing a
              // per-chart "dim everyone else" opacity ternary). The violin
              // `<path>` is the real "mark" a viewer's eye lands on; the
              // median line stays as-is.
              const isHovered = hover === i;
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
                  onMouseEnter={() => {
                    setHover(i);
                    onDatumHover?.({ datum: g, index: i });
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => onDatumClick?.({ datum: g, index: i })}
                >
                  <path
                    d={d}
                    fill={theme.accent}
                    fillOpacity={0.28}
                    stroke={theme.ink}
                    strokeWidth={
                      isHovered ? ACTIVE_STROKE_WIDTH * 2 : ACTIVE_STROKE_WIDTH
                    }
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
                  `median: ${valueFmt(stats[hover].median)}`,
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
