import { useMemo, useState } from "react";
import { scaleBand, scaleTime } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { max, min } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { bottomTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatDayMonth } from "../../chart/format";
import { emText } from "../../chart/typography";

/** A scheduled event: a span [start, end], or a milestone if `end` is absent. */
export interface TimelineEvent {
  label: string;
  start: Date;
  end?: Date;
  /** Optional grouping; colors the bar by category in fixed order. */
  category?: string;
}

export interface GanttChartProps {
  width: number;
  height: number;
  data: TimelineEvent[];
  ariaLabel?: string;
}

/**
 * Timeline / Gantt (Priestley timeline) — events on a shared time axis, one row
 * each: a rounded bar spans start→end, and an event with no end is a milestone
 * diamond. Optional categories color the bars (with a legend); otherwise one
 * accent hue. Hovering shows the dates and duration.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function GanttChart({
  width,
  height,
  data,
  ariaLabel,
}: GanttChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const domain = useMemo(() => {
    const lo = min(data, (d) => d.start.getTime()) ?? 0;
    const hi = max(data, (d) => (d.end ?? d.start).getTime()) ?? lo + 1;
    return [new Date(lo), new Date(hi)] as [Date, Date];
  }, [data]);
  const categories = useMemo(
    () => [
      ...new Set(
        data
          .map((d) => d.category)
          .filter((c): c is string => typeof c === "string")
      ),
    ],
    [data]
  );
  const color = useEntityColors(categories);

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const label = ariaLabel ?? `Timeline of ${data.length} events`;
  const hasLegend = categories.length >= 2;
  const fillFor = (d: TimelineEvent) =>
    d.category ? color(d.category) : theme.accent;
  const table = {
    columns: ["Event", "Start", "End", "Category"],
    rows: data.map((d) => [
      d.label,
      formatDayMonth(d.start),
      d.end ? formatDayMonth(d.end) : "—",
      d.category ?? "",
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 20, bottom: 28, left: 120 }}
      ariaLabel={label}
      legend={
        hasLegend
          ? categories.map((c) => ({ label: c, color: color(c) }))
          : undefined
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleTime({ domain, range: [0, innerWidth] });
        const yScale = scaleBand({
          domain: data.map((d) => d.label),
          range: [0, innerHeight],
          padding: 0.3,
        });
        const bh = yScale.bandwidth();
        const hovered = hover != null ? data[hover] : null;
        return (
          <>
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              numTicks={5}
              tickFormat={(v) => formatDayMonth(v as Date)}
              tickLabelProps={bottomTickLabel(theme)}
            />
            {data.map((d, i) => {
              const y = yScale(d.label) ?? 0;
              const x0 = xScale(d.start);
              const active = hover == null || hover === i;
              const isMilestone = d.end == null;
              return (
                <g
                  key={d.label}
                  opacity={active ? 1 : 0.4}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  {isMilestone ? (
                    <rect
                      x={x0 - bh / 4}
                      y={y + bh / 4}
                      width={bh / 2}
                      height={bh / 2}
                      transform={`rotate(45 ${x0} ${y + bh / 2})`}
                      fill={fillFor(d)}
                    />
                  ) : (
                    <rect
                      x={x0}
                      y={y}
                      width={Math.max(2, xScale(d.end as Date) - x0)}
                      height={bh}
                      rx={4}
                      fill={fillFor(d)}
                    />
                  )}
                  <text
                    x={-8}
                    y={y + bh / 2}
                    dy="0.32em"
                    textAnchor="end"
                    style={emText(11)}
                    fill={theme.mutedInk}
                  >
                    {d.label}
                  </text>
                </g>
              );
            })}
            {hovered && (
              <SvgTooltip
                x={xScale(hovered.start)}
                innerWidth={innerWidth}
                top={Math.max(0, (yScale(hovered.label) ?? 0) - 4)}
                lines={[
                  hovered.label,
                  hovered.end
                    ? `${formatDayMonth(hovered.start)} – ${formatDayMonth(hovered.end)}`
                    : formatDayMonth(hovered.start),
                  hovered.end
                    ? `${Math.round(
                        (hovered.end.getTime() - hovered.start.getTime()) /
                          86_400_000
                      )} days`
                    : "milestone",
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
