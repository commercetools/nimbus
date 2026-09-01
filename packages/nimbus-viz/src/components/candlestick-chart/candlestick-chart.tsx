import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { max, min } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { GridRows, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact, formatDayMonth } from "../../chart/format";
import { emText } from "../../chart/typography";

/** One period's open/high/low/close. */
export interface OhlcBar {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface CandlestickChartProps {
  width: number;
  height: number;
  data: OhlcBar[];
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
}

/**
 * Candlestick (stock-price) chart — the four values of each period at once: a
 * thin wick spans low→high and the body spans open→close. An up period (close ≥
 * open) uses the positive hue, a down period the negative hue; direction is also
 * carried by which end of the body is open vs close, never color alone. Hovering
 * a period shows its OHLC.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function CandlestickChart({
  width,
  height,
  data,
  ariaLabel,
  children,
}: CandlestickChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const yDomain = useMemo(
    () =>
      [min(data, (d) => d.low) ?? 0, max(data, (d) => d.high) ?? 0] as [
        number,
        number,
      ],
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const label = ariaLabel ?? `Candlestick chart of ${data.length} periods`;
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));
  const table = {
    columns: ["Date", "Open", "High", "Low", "Close"],
    rows: data.map((d) => [
      formatDayMonth(d.date),
      d.open,
      d.high,
      d.low,
      d.close,
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 12, bottom: 28, left: 44 }}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleBand({
          domain: data.map((_, i) => String(i)),
          range: [0, innerWidth],
          padding: 0.3,
        });
        const yScale = scaleLinear({
          domain: yDomain,
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = xScale.bandwidth();
        const hovered = hover != null ? data[hover] : null;
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
            {data.map((d, i) => {
              const cx = (xScale(String(i)) ?? 0) + bw / 2;
              const up = d.close >= d.open;
              const color = up ? theme.positive : theme.negative;
              const bodyTop = yScale(Math.max(d.open, d.close));
              const bodyBottom = yScale(Math.min(d.open, d.close));
              const active = hover == null || hover === i;
              return (
                <g
                  key={i}
                  opacity={active ? 1 : 0.4}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <line
                    x1={cx}
                    x2={cx}
                    y1={yScale(d.high)}
                    y2={yScale(d.low)}
                    stroke={color}
                    strokeWidth={1.25}
                  />
                  <rect
                    x={cx - bw / 2}
                    y={bodyTop}
                    width={bw}
                    height={Math.max(1, bodyBottom - bodyTop)}
                    rx={1}
                    fill={color}
                  />
                  {i % labelEvery === 0 && (
                    <text
                      x={cx}
                      y={innerHeight + 16}
                      textAnchor="middle"
                      style={emText(10)}
                      fill={theme.mutedInk}
                    >
                      {formatDayMonth(d.date)}
                    </text>
                  )}
                </g>
              );
            })}
            {hovered && (
              <SvgTooltip
                x={(xScale(String(hover)) ?? 0) + bw / 2}
                innerWidth={innerWidth}
                top={Math.max(0, yScale(hovered.high) - 4)}
                lines={[
                  formatDayMonth(hovered.date),
                  `O ${formatCompact(hovered.open)}  H ${formatCompact(hovered.high)}`,
                  `L ${formatCompact(hovered.low)}  C ${formatCompact(hovered.close)}`,
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
