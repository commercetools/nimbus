import { useState } from "react";
import { BarRounded } from "@visx/shape";
import { ChartContainer } from "../../chart/chart-container";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { devWarn } from "../../chart/dev-warn";
import { useChartTheme } from "../../theme";
import { formatPercent } from "../../chart/format";
import { useChartFormatters } from "../../chart/format-locale";
import type { FunnelStage } from "../../chart/types";
import { emText } from "../../chart/typography";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";

export interface FunnelChartProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Ordered `FunnelStage` rows (`{ stage, value }`), given top-to-bottom; the
   *  first stage's value is the 100% reference for every bar's width. */
  data: FunnelStage[];
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Fired when a stage is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<FunnelStage>;
  /** Fired when the hovered stage changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<FunnelStage>;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
}

/**
 * A FLOW specialist: ordered stages of a single process, each bar's width the
 * share of the first stage. One hue (accent) — this is magnitude through one
 * funnel, so color carries no extra meaning. Hovering a stage outlines its
 * bar (its siblings are never dimmed).
 */
export function FunnelChart({
  width,
  height,
  data,
  ariaLabel,
  onDatumClick,
  onDatumHover,
  valueFormat,
}: FunnelChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);
  if (width <= 0 || height <= 0 || data.length === 0) return null;

  // BC-2 (docs/bug-classes.md): a stage is a count, so a negative value
  // cannot be encoded by width -- clamp before it feeds any ratio. `top`
  // itself is clamped too, so a negative first stage can't flip the sign of
  // every other stage's share.
  const top = Math.max(0, data[0].value) || 1;
  if (data.some((s) => s.value < 0)) {
    devWarn(
      "funnel-chart:negative",
      "FunnelChart: a negative stage value is drawn as 0 (a funnel stage is a count)."
    );
  }
  const table = {
    columns: ["Stage", "Value", "% of first"],
    rows: data.map((s) => [
      s.stage,
      s.value,
      formatPercent(Math.max(0, s.value) / top),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 10, right: 16, bottom: 8, left: 16 }}
      ariaLabel={ariaLabel ?? `Funnel of ${data.length} stages`}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const bandH = innerHeight / data.length;
        const barH = Math.min(40, bandH * 0.58);
        return (
          <>
            {data.map((stage, i) => {
              // A negative stage value can't be encoded by width; clamp it
              // to 0 before it feeds the ratio, same as a real, valid 0
              // (which keeps the 2px floor so the stage stays visible).
              const value = Math.max(0, stage.value);
              const w = Math.max(2, (value / top) * innerWidth);
              const x = (innerWidth - w) / 2;
              const y = i * bandH + (bandH - barH) / 2;
              // Outline the hovered stage's bar; never dim its siblings
              // (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` -- the one shared
              // convention, replacing a per-chart "dim everyone else"
              // opacity ternary).
              const isHovered = hover === i;
              const valueLabel = valueFmt(stage.value);
              // ~14px bold ≈ 8.4px/char. Only draw the value inside the bar when
              // it fits; otherwise the stage % above and the hover tooltip carry
              // it, rather than showing a clipped number.
              const valueFits = valueLabel.length * 8.4 <= w - 8;
              return (
                <g
                  key={`${stage.stage}-${i}`}
                  onMouseEnter={() => {
                    setHover(i);
                    onDatumHover?.({ datum: stage, index: i });
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => onDatumClick?.({ datum: stage, index: i })}
                >
                  <text
                    x={innerWidth / 2}
                    y={y - 3}
                    textAnchor="middle"
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {stage.stage}
                    {i > 0 ? ` · ${formatPercent(value / top)}` : ""}
                  </text>
                  <BarRounded
                    x={x}
                    y={y}
                    width={w}
                    height={barH}
                    radius={4}
                    all
                    fill={theme.accent}
                    stroke={isHovered ? theme.ink : "none"}
                    strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
                  />
                  {valueFits && (
                    <text
                      x={innerWidth / 2}
                      y={y + barH / 2}
                      dy="0.32em"
                      textAnchor="middle"
                      style={emText(12)}
                      fontWeight={600}
                      fill={theme.surface}
                    >
                      {valueLabel}
                    </text>
                  )}
                </g>
              );
            })}
            {hover != null &&
              data[hover] &&
              (() => {
                const stage = data[hover];
                const y = hover * bandH + (bandH - barH) / 2;
                const prev = hover > 0 ? data[hover - 1].value : null;
                const value = Math.max(0, stage.value);
                const lines = [
                  stage.stage,
                  `Value: ${valueFmt(stage.value)}`,
                  `${formatPercent(value / top)} of first`,
                ];
                if (prev != null && prev > 0) {
                  lines.push(`${formatPercent(value / prev)} of previous`);
                }
                return (
                  <SvgTooltip
                    x={innerWidth / 2}
                    innerWidth={innerWidth}
                    top={Math.max(0, y - 4)}
                    lines={lines}
                  />
                );
              })()}
          </>
        );
      }}
    </ChartContainer>
  );
}
