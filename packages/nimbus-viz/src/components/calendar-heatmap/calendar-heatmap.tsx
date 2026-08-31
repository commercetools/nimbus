import { useMemo, useState } from "react";
import { max } from "d3-array";
import { ChartFrame } from "../../chart/chart-frame";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { sequentialColor, useChartTheme } from "../../theme";
import { formatDayMonth, formatInteger } from "../../chart/format";
import { emText, CHART_FONT_STACK, LABEL_PX } from "../../chart/typography";

/** One day's magnitude on a calendar activity grid. */
export interface CalendarDatum {
  date: Date | string;
  value: number;
}

export interface CalendarHeatmapProps {
  width: number;
  height: number;
  data: CalendarDatum[];
  /** Nimbus hue for the sequential ramp. */
  hue?: string;
  ariaLabel?: string;
}

const DAY_MS = 86_400_000;
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
// Weekday label rows, Monday-first (Mon=0 … Sun=6).
const WEEKDAY_LABELS: Array<[number, string]> = [
  [0, "M"],
  [2, "W"],
  [4, "F"],
];

/** A stable UTC day-index for a calendar date (tz-agnostic, DST-safe). */
function dayIndexOf(d: Date): number {
  return Math.floor(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY_MS
  );
}
/** Monday-first weekday (0..6) for a day-index; epoch day 0 is a Thursday. */
function mondayWeekday(dayIndex: number): number {
  return ((((dayIndex % 7) + 4) % 7) + 6) % 7;
}

interface DayEntry {
  day: number;
  value: number;
  date: Date;
}

/**
 * GitHub-style activity calendar: weeks as columns, weekday (Mon–Sun) as rows.
 * Each day is a small rounded square colored by a single-hue sequential ramp
 * over the value domain (magnitude → one hue, never a rainbow). Days with no
 * datum render as an empty grid cell. Trend/distribution over dates.
 */
export function CalendarHeatmap({
  width,
  height,
  data,
  hue = "blue",
  ariaLabel,
}: CalendarHeatmapProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const entries = useMemo<DayEntry[]>(
    () =>
      data.map((d) => {
        const date = d.date instanceof Date ? d.date : new Date(d.date);
        return { day: dayIndexOf(date), value: d.value, date };
      }),
    [data]
  );

  const byDay = useMemo(() => {
    const m = new Map<number, DayEntry>();
    for (const e of entries) m.set(e.day, e);
    return m;
  }, [entries]);

  const maxVal = useMemo(() => max(entries, (e) => e.value) ?? 0, [entries]);

  const layout = useMemo(() => {
    if (entries.length === 0) return null;
    const days = entries.map((e) => e.day);
    const minDay = Math.min(...days);
    const maxDay = Math.max(...days);
    const firstMonday = minDay - mondayWeekday(minDay);
    const numWeeks = Math.floor((maxDay - firstMonday) / 7) + 1;
    return { firstMonday, numWeeks };
  }, [entries]);

  if (width <= 0 || height <= 0 || entries.length === 0 || layout === null) {
    return null;
  }

  const { firstMonday, numWeeks } = layout;
  const color = sequentialColor(theme.ramps[hue] ?? theme.ramps.blue);
  const legendHeight = 24;
  const chartHeight = height - legendHeight;

  return (
    <div style={{ width, height }}>
      <ChartFrame
        width={width}
        height={chartHeight}
        margin={{ top: 18, right: 8, bottom: 8, left: 22 }}
        ariaLabel={ariaLabel ?? `Calendar heatmap of ${entries.length} days`}
      >
        {({ innerWidth, innerHeight }) => {
          const step = Math.min(innerWidth / numWeeks, innerHeight / 7);
          const gap = Math.max(1, step * 0.16);
          const cell = Math.max(0, step - gap);
          const hovered = hover != null ? byDay.get(hover) : null;
          const hoveredCol =
            hover != null ? Math.floor((hover - firstMonday) / 7) : 0;
          const hoveredRow = hover != null ? mondayWeekday(hover) : 0;
          return (
            <>
              {/* Month labels along the top */}
              {Array.from({ length: numWeeks }).map((_, col) => {
                const monday = new Date((firstMonday + col * 7) * DAY_MS);
                const m = monday.getUTCMonth();
                const y = monday.getUTCFullYear();
                const prev = new Date((firstMonday + (col - 1) * 7) * DAY_MS);
                const isNew =
                  col === 0 ||
                  m !== prev.getUTCMonth() ||
                  y !== prev.getUTCFullYear();
                if (!isNew) return null;
                return (
                  <text
                    key={`m-${col}`}
                    x={col * step}
                    y={-6}
                    style={emText(10)}
                    fill={theme.mutedInk}
                  >
                    {MONTHS[m]}
                  </text>
                );
              })}
              {/* Weekday labels (M / W / F) at left */}
              {WEEKDAY_LABELS.map(([row, label]) => (
                <text
                  key={label}
                  x={-6}
                  y={row * step + cell / 2}
                  dy="0.32em"
                  textAnchor="end"
                  style={emText(9)}
                  fill={theme.mutedInk}
                >
                  {label}
                </text>
              ))}
              {/* Day cells */}
              {Array.from({ length: numWeeks }).map((_, col) =>
                Array.from({ length: 7 }).map((__, row) => {
                  const day = firstMonday + col * 7 + row;
                  const entry = byDay.get(day);
                  const x = col * step;
                  const y = row * step;
                  if (!entry) {
                    return (
                      <rect
                        key={`${col}-${row}`}
                        x={x}
                        y={y}
                        width={cell}
                        height={cell}
                        rx={2}
                        fill={theme.grid}
                        fillOpacity={0.3}
                        stroke={theme.surface}
                        strokeWidth={1}
                      />
                    );
                  }
                  const t = maxVal > 0 ? entry.value / maxVal : 0;
                  return (
                    <rect
                      key={`${col}-${row}`}
                      x={x}
                      y={y}
                      width={cell}
                      height={cell}
                      rx={2}
                      fill={color(t)}
                      stroke={theme.surface}
                      strokeWidth={1}
                      onMouseEnter={() => setHover(day)}
                      onMouseLeave={() => setHover(null)}
                    />
                  );
                })
              )}
              {hovered && (
                <SvgTooltip
                  x={hoveredCol * step + cell / 2}
                  top={Math.max(0, hoveredRow * step)}
                  innerWidth={innerWidth}
                  lines={[
                    formatDayMonth(hovered.date),
                    `Value: ${formatInteger(hovered.value)}`,
                  ]}
                />
              )}
            </>
          );
        }}
      </ChartFrame>
      <div style={{ paddingTop: 6 }}>
        <GradientLegend
          color={color}
          lowLabel="Less"
          highLabel="More"
          mutedInk={theme.mutedInk}
        />
      </div>
    </div>
  );
}

/** A small low→high gradient legend of discrete ramp swatches. */
function GradientLegend({
  color,
  lowLabel,
  highLabel,
  mutedInk,
}: {
  color: (t: number) => string;
  lowLabel: string;
  highLabel: string;
  mutedInk: string;
}) {
  const stops = [0, 0.25, 0.5, 0.75, 1];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: LABEL_PX,
        lineHeight: 1.4,
        fontFamily: CHART_FONT_STACK,
        color: mutedInk,
      }}
    >
      <span>{lowLabel}</span>
      <span style={{ display: "inline-flex", gap: 2 }} aria-hidden>
        {stops.map((t) => (
          <span
            key={t}
            style={{
              width: 12,
              height: 12,
              borderRadius: 2,
              background: color(t),
              display: "inline-block",
            }}
          />
        ))}
      </span>
      <span>{highLabel}</span>
    </div>
  );
}
