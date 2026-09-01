import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { bin, extent, max } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact, formatInteger } from "../../chart/format";

export interface HistogramProps {
  width: number;
  height: number;
  /** Raw samples. Binned internally via d3-array's `bin()`. */
  values: number[];
  /** Approximate bin count (d3 may adjust for nice boundaries). Default 12. */
  thresholds?: number;
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
}

/** Visual gap between adjacent bars, in px. */
const BAR_GAP = 2;

/**
 * Distribution of a single numeric sample set. Bars are one hue (accent) —
 * like the categorical bar chart, color carries no meaning here, the value
 * axis does. Binning uses d3-array's `bin()` over the sample's own value
 * range.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function Histogram({
  width,
  height,
  values,
  thresholds = 12,
  ariaLabel,
  children,
}: HistogramProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const domain = useMemo(() => extent(values) as [number, number], [values]);
  const bins = useMemo(() => {
    if (values.length === 0 || domain[0] === undefined) return [];
    return bin().domain(domain).thresholds(thresholds)(values);
  }, [values, domain, thresholds]);
  const countMax = useMemo(() => max(bins, (b) => b.length) ?? 0, [bins]);

  if (width <= 0 || height <= 0 || bins.length === 0) return null;

  const label =
    ariaLabel ??
    `Histogram of ${values.length} samples across ${bins.length} bins`;
  const table = {
    columns: ["Bin", "Count"],
    rows: bins.map((b) => [
      `${formatCompact(b.x0 ?? domain[0])}–${formatCompact(b.x1 ?? domain[1])}`,
      b.length,
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 16, bottom: 28, left: 40 }}
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
          domain: [0, countMax],
          range: [innerHeight, 0],
          nice: true,
        });
        const hb = hover != null ? bins[hover] : null;
        return (
          <ChartScaleProvider
            value={{
              yScale,
              xScale,
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
              tickFormat={(v) => formatInteger(v as number)}
              tickLabelProps={leftTickLabel(theme)}
            />
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              numTicks={6}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => formatCompact(v as number)}
              tickLabelProps={bottomTickLabel(theme)}
            />
            {bins.map((b, i) => {
              const x0 = xScale(b.x0 ?? domain[0]);
              const x1 = xScale(b.x1 ?? domain[1]);
              const barWidth = Math.max(0, x1 - x0 - BAR_GAP);
              const barHeight = Math.max(0, innerHeight - yScale(b.length));
              const active = hover == null || hover === i;
              return (
                <BarRounded
                  key={`${b.x0}-${b.x1}`}
                  x={x0 + BAR_GAP / 2}
                  y={yScale(b.length)}
                  width={barWidth}
                  height={barHeight}
                  radius={3}
                  top
                  fill={theme.accent}
                  opacity={active ? 1 : 0.4}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
            {hb && (
              <SvgTooltip
                x={
                  (xScale(hb.x0 ?? domain[0]) + xScale(hb.x1 ?? domain[1])) / 2
                }
                innerWidth={innerWidth}
                top={Math.max(0, yScale(hb.length) - 4)}
                lines={[
                  `${formatCompact(hb.x0 ?? domain[0])} – ${formatCompact(
                    hb.x1 ?? domain[1]
                  )}`,
                  `Count: ${formatInteger(hb.length)}`,
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
