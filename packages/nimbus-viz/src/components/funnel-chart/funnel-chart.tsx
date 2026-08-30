import { BarRounded } from "@visx/shape";
import { ChartFrame } from "../../chart/chart-frame";
import { useChartTheme } from "../../theme";
import { formatCompact, formatPercent } from "../../chart/format";
import type { FunnelStage } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface FunnelChartProps {
  width: number;
  height: number;
  data: FunnelStage[];
  ariaLabel?: string;
}

/**
 * A FLOW specialist: ordered stages of a single process, each bar's width the
 * share of the first stage. One hue (accent) — this is magnitude through one
 * funnel, so color carries no extra meaning.
 */
export function FunnelChart({
  width,
  height,
  data,
  ariaLabel,
}: FunnelChartProps) {
  const theme = useChartTheme();
  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const top = data[0].value || 1;

  return (
    <ChartFrame
      width={width}
      height={height}
      margin={{ top: 10, right: 16, bottom: 8, left: 16 }}
      ariaLabel={ariaLabel ?? `Funnel of ${data.length} stages`}
    >
      {({ innerWidth, innerHeight }) => {
        const bandH = innerHeight / data.length;
        const barH = Math.min(40, bandH * 0.58);
        return (
          <>
            {data.map((stage, i) => {
              const w = Math.max(2, (stage.value / top) * innerWidth);
              const x = (innerWidth - w) / 2;
              const y = i * bandH + (bandH - barH) / 2;
              return (
                <g key={stage.stage}>
                  <text
                    x={innerWidth / 2}
                    y={y - 3}
                    textAnchor="middle"
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {stage.stage}
                    {i > 0 ? ` · ${formatPercent(stage.value / top)}` : ""}
                  </text>
                  <BarRounded
                    x={x}
                    y={y}
                    width={w}
                    height={barH}
                    radius={4}
                    all
                    fill={theme.accent}
                  />
                  <text
                    x={innerWidth / 2}
                    y={y + barH / 2}
                    dy="0.32em"
                    textAnchor="middle"
                    style={emText(12)}
                    fontWeight={600}
                    fill={theme.surface}
                  >
                    {formatCompact(stage.value)}
                  </text>
                </g>
              );
            })}
          </>
        );
      }}
    </ChartFrame>
  );
}
