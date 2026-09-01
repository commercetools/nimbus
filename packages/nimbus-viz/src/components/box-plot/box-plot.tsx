import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { BoxPlot as VisxBoxPlot } from "@visx/stats";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";

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

export interface BoxPlotProps {
  width: number;
  height: number;
  /** One five-number summary per category. Nothing is computed here. */
  groups: BoxPlotGroupStats[];
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
}

/**
 * Grouped box-and-whisker across categories. The x axis already carries
 * category identity, so — like the categorical bar chart — every box uses one
 * accent fill; ink is reserved for the box stroke, whiskers, and median line.
 * Summary stats are accepted as-is (min/quartiles/median/max/outliers); this
 * component computes nothing from raw samples.
 */
export function BoxPlot({
  width,
  height,
  groups,
  ariaLabel,
  children,
}: BoxPlotProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const yDomain = useMemo(() => {
    const values = groups.flatMap((g) => [g.min, g.max, ...(g.outliers ?? [])]);
    return extent(values) as [number, number];
  }, [groups]);

  if (width <= 0 || height <= 0 || groups.length === 0) return null;

  const label = ariaLabel ?? `Box plot of ${groups.length} groups`;
  const hoverGroup = hover != null ? groups[hover] : null;
  const table = {
    columns: ["Group", "Min", "Q1", "Median", "Q3", "Max"],
    rows: groups.map((g) => [
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
        const xScale = scaleBand({
          domain: groups.map((g) => g.label),
          range: [0, innerWidth],
          padding: 0.3,
        });
        const yScale = scaleLinear({
          domain: yDomain,
          range: [innerHeight, 0],
          nice: true,
        });
        const boxWidth = xScale.bandwidth() * 0.6;
        return (
          <ChartScaleProvider
            value={{
              yScale,
              xScale: (v) => xScale(String(v)) ?? 0,
              xBandwidth: xScale.bandwidth(),
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
              stroke={theme.axis}
              hideTicks
              tickLabelProps={bottomTickLabel(theme)}
            />
            {groups.map((g, i) => {
              const bandStart = xScale(g.label) ?? 0;
              const left = bandStart + (xScale.bandwidth() - boxWidth) / 2;
              const active = hover == null || hover === i;
              return (
                <VisxBoxPlot
                  key={g.label}
                  left={left}
                  boxWidth={boxWidth}
                  valueScale={yScale}
                  min={g.min}
                  firstQuartile={g.firstQuartile}
                  median={g.median}
                  thirdQuartile={g.thirdQuartile}
                  max={g.max}
                  outliers={g.outliers}
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
                    onMouseEnter: () => setHover(i),
                    onMouseLeave: () => setHover(null),
                  }}
                />
              );
            })}
            {hoverGroup && (
              <SvgTooltip
                x={(xScale(hoverGroup.label) ?? 0) + xScale.bandwidth() / 2}
                innerWidth={innerWidth}
                lines={[
                  hoverGroup.label,
                  `max: ${formatCompact(hoverGroup.max)}`,
                  `Q3: ${formatCompact(hoverGroup.thirdQuartile)}`,
                  `median: ${formatCompact(hoverGroup.median)}`,
                  `Q1: ${formatCompact(hoverGroup.firstQuartile)}`,
                  `min: ${formatCompact(hoverGroup.min)}`,
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
