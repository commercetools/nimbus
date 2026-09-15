import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ChartContainer } from "../../chart/chart-container";
import { bandByIndex, valueDomain } from "../../chart/scales";
import { ChartScaleProvider } from "../../chart/scale-context";
import {
  GridRows,
  bottomTickLabel,
  fitBandLabel,
  leftTickLabel,
} from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";
import { clamp, plotPointerPosition } from "../../chart/pointer";

/** One ordered step in a waterfall: a signed contribution, or an explicit total. */
export interface WaterfallStep {
  /** Category label shown on the x-axis. */
  label: string;
  /** Signed contribution. For a total/subtotal step this is the absolute value, not an addend. */
  value: number;
  /** Renders as an absolute bar anchored at zero (a checkpoint total) instead of floating from the running cumulative; also resets the running cumulative to `value`. */
  isTotal?: boolean;
}

export interface WaterfallChartProps extends DatumInteractionProps<WaterfallStep> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Ordered `WaterfallStep` rows (`{ label, value, isTotal? }`). */
  data: WaterfallStep[];
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Overlays (ReferenceLine, ThresholdBand, TrendLine, …) in plot space. */
  children?: ReactNode;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
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
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function WaterfallChart({
  width,
  height,
  data,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  children,
  valueFormat,
}: WaterfallChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);
  // Live pointer y (plot-local), while a bar is being hovered by the mouse
  // -- null once the pointer leaves, so the tooltip falls back to the
  // hovered bar's own value-derived position rather than a stale
  // coordinate from a previous hover.
  const [pointerY, setPointerY] = useState<number | null>(null);

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

  // valueDomain() includes zero (same as the hand-rolled min/max(0, ...) this
  // replaces) and additionally widens a degenerate domain -- every bar at 0,
  // e.g. a period with no change at all -- instead of collapsing to [0, 0].
  const yRange = useMemo(
    () => valueDomain(bars.flatMap((b) => [b.from, b.to])),
    [bars]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const label = ariaLabel ?? `Waterfall of ${data.length} steps`;
  const table = {
    columns: ["Step", "Value", "Running total"],
    rows: bars.map((b) => [b.step.label, b.step.value, b.to]),
  };

  // Named so the pointer math below (which needs the same left/top offset
  // xScale/yScale are drawn relative to) can never drift from what's
  // actually passed to ChartContainer.
  const MARGIN = { top: 20, right: 12, bottom: 28, left: 44 };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={MARGIN}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const band = bandByIndex(
          bars.map((b) => b.step.label),
          {
            range: [0, innerWidth],
            padding: 0.3,
          }
        );
        const yScale = scaleLinear({
          domain: yRange,
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = band.bandwidth;
        const hb = hover != null ? bars[hover] : null;

        return (
          <ChartScaleProvider
            value={{
              yScale,
              xScale: (v) => band.scale(String(v)) ?? 0,
              xBandwidth: bw,
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
              tickFormat={(v) => fitBandLabel(band.step)(band.tickFormat(v))}
              tickLabelProps={bottomTickLabel(theme)}
            />
            {bars.map((bar, i) => {
              const x = band.pos(i);
              const yFrom = yScale(bar.from);
              const yTo = yScale(bar.to);
              const barTop = Math.min(yFrom, yTo);
              const barH = Math.max(1, Math.abs(yFrom - yTo));
              // Outline the hovered/focused bar; never dim its siblings
              // (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` -- the one
              // shared convention, replacing a per-chart "dim everyone
              // else" opacity ternary).
              const isHovered = hover === i;
              const color = bar.step.isTotal
                ? theme.accent
                : bar.step.value >= 0
                  ? theme.positive
                  : theme.negative;
              const valueLabel = bar.step.isTotal
                ? valueFmt(bar.step.value)
                : bar.step.value >= 0
                  ? `+${valueFmt(bar.step.value)}`
                  : valueFmt(bar.step.value);
              const next = bars[i + 1];
              const nextX = next ? band.pos(i + 1) : 0;
              return (
                <g
                  key={i}
                  onMouseEnter={(e) => {
                    setHover(i);
                    const p = plotPointerPosition(e, MARGIN);
                    if (p) setPointerY(p.y);
                    // datum is the raw input step, not the internal Bar.
                    onDatumHover?.({ datum: bar.step, index: i });
                  }}
                  onMouseMove={(e) => {
                    const p = plotPointerPosition(e, MARGIN);
                    if (p) setPointerY(p.y);
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    setPointerY(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => onDatumClick?.({ datum: bar.step, index: i })}
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
                    stroke={isHovered ? theme.ink : "none"}
                    strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
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
                x={band.center(hover ?? 0)}
                innerWidth={innerWidth}
                top={
                  // Live pointer y while the mouse is the hover source;
                  // falls back to the bar's own value-derived position
                  // otherwise.
                  pointerY != null
                    ? clamp(pointerY, innerHeight)
                    : Math.max(0, Math.min(yScale(hb.from), yScale(hb.to)) - 4)
                }
                lines={
                  hb.step.isTotal
                    ? [hb.step.label, `Total: ${valueFmt(hb.step.value)}`]
                    : [
                        hb.step.label,
                        `Change: ${
                          hb.step.value >= 0 ? "+" : ""
                        }${valueFmt(hb.step.value)}`,
                        `Running total: ${valueFmt(hb.to)}`,
                      ]
                }
              />
            )}
            {children}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
