import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ChartFrame } from "../../chart/chart-frame";
import {
  GridRows,
  bottomTickLabel,
  fitBandLabel,
  leftTickLabel,
} from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import { emText } from "../../chart/typography";

/** One ordered step in a waterfall: a signed contribution, or an explicit total. */
export interface WaterfallStep {
  /** Category label shown on the x-axis. */
  label: string;
  /** Signed contribution. For a total/subtotal step this is the absolute value, not an addend. */
  value: number;
  /** Renders as an absolute bar anchored at zero (a checkpoint total) instead of floating from the running cumulative; also resets the running cumulative to `value`. */
  isTotal?: boolean;
}

export interface WaterfallChartProps {
  width: number;
  height: number;
  data: WaterfallStep[];
  ariaLabel?: string;
}

interface Bar {
  step: WaterfallStep;
  from: number;
  to: number;
}

/**
 * A DELTA/FLOW specialist: ordered signed contributions floating from a
 * running cumulative total, plus optional absolute "total" checkpoints
 * anchored at zero. Positive/negative deltas take their valence role, but the
 * sign is always repeated in the value label too — color alone never carries
 * it (a dataviz non-negotiable). Thin dashed connectors bridge each bar's
 * ending level to the next bar's starting level.
 */
export function WaterfallChart({
  width,
  height,
  data,
  ariaLabel,
}: WaterfallChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const bars = useMemo<Bar[]>(() => {
    let running = 0;
    return data.map((step) => {
      if (step.isTotal) {
        running = step.value;
        return { step, from: 0, to: step.value };
      }
      const from = running;
      running += step.value;
      return { step, from, to: running };
    });
  }, [data]);

  const [yMin, yMax] = useMemo(() => {
    const values = bars.flatMap((b) => [b.from, b.to]);
    return [Math.min(0, ...values), Math.max(0, ...values)];
  }, [bars]);

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const label = ariaLabel ?? `Waterfall of ${data.length} steps`;

  return (
    <ChartFrame
      width={width}
      height={height}
      margin={{ top: 20, right: 12, bottom: 28, left: 44 }}
      ariaLabel={label}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleBand({
          domain: bars.map((b) => b.step.label),
          range: [0, innerWidth],
          padding: 0.3,
        });
        const yScale = scaleLinear({
          domain: [yMin, yMax],
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = xScale.bandwidth();
        const hb = hover != null ? bars[hover] : null;

        return (
          <>
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
              tickFormat={(v) => fitBandLabel(xScale.step())(String(v))}
              tickLabelProps={bottomTickLabel(theme)}
            />
            {bars.map((bar, i) => {
              const x = xScale(bar.step.label) ?? 0;
              const yFrom = yScale(bar.from);
              const yTo = yScale(bar.to);
              const barTop = Math.min(yFrom, yTo);
              const barH = Math.max(1, Math.abs(yFrom - yTo));
              const active = hover == null || hover === i;
              const color = bar.step.isTotal
                ? theme.accent
                : bar.step.value >= 0
                  ? theme.positive
                  : theme.negative;
              const valueLabel = bar.step.isTotal
                ? formatCompact(bar.step.value)
                : bar.step.value >= 0
                  ? `+${formatCompact(bar.step.value)}`
                  : formatCompact(bar.step.value);
              const next = bars[i + 1];
              const nextX = next ? (xScale(next.step.label) ?? 0) : 0;
              return (
                <g
                  key={bar.step.label}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {next && (
                    <line
                      x1={x + bw}
                      x2={nextX}
                      y1={yTo}
                      y2={yTo}
                      stroke={theme.grid}
                      strokeDasharray="2,2"
                    />
                  )}
                  <BarRounded
                    x={x}
                    y={barTop}
                    width={bw}
                    height={barH}
                    radius={3}
                    all
                    fill={color}
                    opacity={active ? 1 : 0.4}
                  />
                  <text
                    x={x + bw / 2}
                    y={barTop - 4}
                    textAnchor="middle"
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {valueLabel}
                  </text>
                </g>
              );
            })}
            {hb && (
              <SvgTooltip
                x={(xScale(hb.step.label) ?? 0) + bw / 2}
                innerWidth={innerWidth}
                top={Math.max(0, Math.min(yScale(hb.from), yScale(hb.to)) - 4)}
                lines={
                  hb.step.isTotal
                    ? [hb.step.label, `Total: ${formatCompact(hb.step.value)}`]
                    : [
                        hb.step.label,
                        `Change: ${
                          hb.step.value >= 0 ? "+" : ""
                        }${formatCompact(hb.step.value)}`,
                        `Running total: ${formatCompact(hb.to)}`,
                      ]
                }
              />
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
