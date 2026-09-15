import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { BoxPlot as VisxBoxPlot } from "@visx/stats";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { bandByIndex } from "../../chart/scales";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { DatumInteractionProps } from "../../chart/interaction";
import { fiveNumberSummary } from "../../stats";

/** Precomputed five-number summary for one group's distribution. */
export interface BoxPlotGroupStats {
  label: string;
  min: number;
  firstQuartile: number;
  median: number;
  thirdQuartile: number;
  max: number;
  /** Individual points outside the whiskers, drawn as dots. */
  outliers?: number[];
}

/**
 * One group's raw samples — the alternative to `BoxPlotGroupStats` for a
 * caller that hasn't precomputed quartiles. `fiveNumberSummary` (Tukey,
 * 1.5·IQR outlier fences) derives min/quartiles/median/max/outliers from
 * `samples` internally.
 */
export interface BoxPlotGroupSamples {
  label: string;
  samples: number[];
}

export type BoxPlotGroup = BoxPlotGroupStats | BoxPlotGroupSamples;

function isSamples(g: BoxPlotGroup): g is BoxPlotGroupSamples {
  return "samples" in g;
}

/** Resolves either group shape to a five-number summary, computing nothing
 *  extra for a group that's already precomputed. */
function summaryOf(g: BoxPlotGroup): BoxPlotGroupStats {
  if (!isSamples(g)) return g;
  const s = fiveNumberSummary(g.samples);
  return {
    label: g.label,
    min: s.min,
    firstQuartile: s.q1,
    median: s.median,
    thirdQuartile: s.q3,
    max: s.max,
    outliers: s.outliers,
  };
}

export interface BoxPlotProps extends DatumInteractionProps<BoxPlotGroup> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** One entry per category — either a precomputed `BoxPlotGroupStats`
   *  five-number summary, or raw `BoxPlotGroupSamples` (`{ label, samples }`),
   *  which `fiveNumberSummary` (Tukey, 1.5·IQR fences) reduces to one. Mixing
   *  both shapes across groups in one chart is fine. */
  groups: BoxPlotGroup[];
  /** Accessible label for the SVG; defaults to a generated summary. */
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
}

/**
 * Grouped box-and-whisker across categories. The x axis already carries
 * category identity, so — like the categorical bar chart — every box uses one
 * accent fill; ink is reserved for the box stroke, whiskers, and median line.
 * Accepts either precomputed summary stats or raw samples per group (see
 * `BoxPlotGroup`).
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function BoxPlot({
  width,
  height,
  groups,
  ariaLabel,
  children,
  valueFormat,
  onDatumClick,
  onDatumHover,
}: BoxPlotProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);

  const summaries = useMemo(() => groups.map(summaryOf), [groups]);
  const yDomain = useMemo(() => {
    const values = summaries.flatMap((g) => [
      g.min,
      g.max,
      ...(g.outliers ?? []),
    ]);
    return extent(values) as [number, number];
  }, [summaries]);

  if (width <= 0 || height <= 0 || groups.length === 0) return null;

  const label = ariaLabel ?? `Box plot of ${groups.length} groups`;
  const hoverGroup = hover != null ? summaries[hover] : null;
  const table = {
    columns: ["Group", "Min", "Q1", "Median", "Q3", "Max"],
    rows: summaries.map((g) => [
      g.label,
      g.min,
      g.firstQuartile,
      g.median,
      g.thirdQuartile,
      g.max,
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
        const boxWidth = band.bandwidth * 0.6;
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
              const s = summaries[i];
              const bandStart = band.pos(i);
              const left = bandStart + (band.bandwidth - boxWidth) / 2;
              const active = hover == null || hover === i;
              return (
                <VisxBoxPlot
                  key={i}
                  left={left}
                  boxWidth={boxWidth}
                  valueScale={yScale}
                  min={s.min}
                  firstQuartile={s.firstQuartile}
                  median={s.median}
                  thirdQuartile={s.thirdQuartile}
                  max={s.max}
                  outliers={s.outliers}
                  rx={4}
                  ry={4}
                  fill={theme.accent}
                  fillOpacity={active ? 0.25 : 0.1}
                  stroke={theme.ink}
                  strokeWidth={1.5}
                  medianProps={{ stroke: theme.ink, strokeWidth: 2 }}
                  minProps={{ stroke: theme.ink }}
                  maxProps={{ stroke: theme.ink }}
                  outlierProps={{
                    fill: theme.accent,
                    stroke: theme.ink,
                    fillOpacity: active ? 0.7 : 0.25,
                  }}
                  container
                  containerProps={{
                    fillOpacity: 0,
                    onMouseEnter: () => {
                      setHover(i);
                      onDatumHover?.({ datum: g, index: i });
                    },
                    onMouseLeave: () => {
                      setHover(null);
                      onDatumHover?.(null);
                    },
                    onClick: () => onDatumClick?.({ datum: g, index: i }),
                  }}
                />
              );
            })}
            {hoverGroup && (
              <SvgTooltip
                x={band.center(hover ?? 0)}
                innerWidth={innerWidth}
                lines={[
                  hoverGroup.label,
                  `max: ${valueFmt(hoverGroup.max)}`,
                  `Q3: ${valueFmt(hoverGroup.thirdQuartile)}`,
                  `median: ${valueFmt(hoverGroup.median)}`,
                  `Q1: ${valueFmt(hoverGroup.firstQuartile)}`,
                  `min: ${valueFmt(hoverGroup.min)}`,
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
