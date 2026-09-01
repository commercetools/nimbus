import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveStepAfter } from "@visx/curve";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact, formatPercent } from "../../chart/format";
import { chartScale } from "../../chart/typography";

export interface CumulativeCurveProps {
  width: number;
  height: number;
  /** Raw samples; the empirical CDF F(v) = share of samples ≤ v is drawn. */
  values: number[];
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
}

interface CdfPoint {
  v: number;
  f: number;
}

/**
 * Cumulative curve (empirical CDF / ogive) — sorts the samples and plots, for
 * each value, the share of the data at or below it. Reads off "what fraction is
 * under X?" and percentiles directly; the step form is honest about the
 * discrete jumps. A 50% guide marks the median. Dots (small n) expose each
 * sample's value and percentile on hover.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function CumulativeCurve({
  width,
  height,
  values,
  ariaLabel,
  children,
}: CumulativeCurveProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const points = useMemo<CdfPoint[]>(() => {
    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;
    return sorted.map((v, i) => ({ v, f: (i + 1) / n }));
  }, [values]);
  const domain = useMemo(() => extent(values) as [number, number], [values]);

  if (width <= 0 || height <= 0 || values.length === 0) return null;

  const label = ariaLabel ?? `Cumulative curve of ${values.length} samples`;
  const showDots = values.length <= 60;
  const r = Math.max(2, 2.5 * chartScale(width, height));
  const table = {
    columns: ["Value", "Cumulative %"],
    rows: points.map((p) => [p.v, formatPercent(p.f)]),
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
        const xScale = scaleLinear({
          domain,
          range: [0, innerWidth],
          nice: true,
        });
        const yScale = scaleLinear({
          domain: [0, 1],
          range: [innerHeight, 0],
        });
        const leadingPoint: CdfPoint = { v: domain[0], f: 0 };
        const path = [leadingPoint, ...points];
        return (
          <ChartScaleProvider
            value={{ yScale, xScale, xBandwidth: 0, innerWidth, innerHeight }}
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
              tickFormat={(v) => formatPercent(v as number)}
              tickLabelProps={leftTickLabel(theme)}
            />
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              numTicks={5}
              tickFormat={(v) => formatCompact(v as number)}
              tickLabelProps={bottomTickLabel(theme)}
            />
            <line
              x1={0}
              x2={innerWidth}
              y1={yScale(0.5)}
              y2={yScale(0.5)}
              stroke={theme.grid}
              strokeDasharray="4 3"
            />
            <LinePath<CdfPoint>
              data={path}
              x={(d) => xScale(d.v)}
              y={(d) => yScale(d.f)}
              stroke={theme.accent}
              strokeWidth={2}
              curve={curveStepAfter}
            />
            {showDots &&
              points.map((d, i) => {
                const active = hover == null || hover === i;
                return (
                  <circle
                    key={i}
                    cx={xScale(d.v)}
                    cy={yScale(d.f)}
                    r={r}
                    fill={theme.accent}
                    opacity={active ? 1 : 0.4}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })}
            {hover != null && points[hover] && (
              <SvgTooltip
                x={xScale(points[hover].v)}
                innerWidth={innerWidth}
                top={Math.max(0, yScale(points[hover].f) - 4)}
                lines={[
                  formatCompact(points[hover].v),
                  `${formatPercent(points[hover].f)} ≤ this`,
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
