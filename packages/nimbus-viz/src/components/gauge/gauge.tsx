import { useMemo } from "react";
import { Arc } from "@visx/shape";
import { Group } from "@visx/group";
import { ChartContainer } from "../../chart/chart-container";
import { useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import { emText } from "../../chart/typography";

export interface GaugeProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** The current value, in the same units as `min`/`max`. */
  value: number;
  /** Lower bound of the arc's range. Defaults to `0`. */
  min?: number;
  /** Upper bound of the arc's range. Defaults to `100`. */
  max?: number;
  /** Optional target/threshold value, rendered as a tick mark on the arc. */
  threshold?: number;
  /** Formats the centered value label. Defaults to `formatCompact`. */
  valueFormat?: (value: number) => string;
  /** Caption below the value label (e.g. a unit or metric name). */
  label?: string;
  /** Accessible label for the SVG. Defaults to `Gauge: {value} of {max}`. */
  ariaLabel?: string;
}

// d3-shape arc angle convention: 0 at -y (12 o'clock), positive clockwise.
// A -90deg..+90deg sweep traces the *upper* half of the circle — the classic
// dome-shaped semicircle gauge, flat side down.
const START_ANGLE = -Math.PI / 2;
const END_ANGLE = Math.PI / 2;

/**
 * TARGET/RANGE as a radial dial: a muted track arc spans the full min..max
 * range, an accent value arc sweeps the fraction reached, and an optional
 * threshold tick marks a target point on the arc. The value label sits at
 * center in ink — the arc's color never has to be read to know the number.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function Gauge({
  width,
  height,
  value,
  min = 0,
  max = 100,
  threshold,
  valueFormat = formatCompact,
  label,
  ariaLabel,
}: GaugeProps) {
  const theme = useChartTheme();

  const fraction = useMemo(() => {
    const span = max - min;
    if (span <= 0) return 0;
    return Math.max(0, Math.min(1, (value - min) / span));
  }, [value, min, max]);

  const thresholdAngle = useMemo(() => {
    if (threshold == null || max <= min) return null;
    const t = Math.max(0, Math.min(1, (threshold - min) / (max - min)));
    return START_ANGLE + t * (END_ANGLE - START_ANGLE);
  }, [threshold, min, max]);

  if (width <= 0 || height <= 0) return null;

  const valueAngle = START_ANGLE + fraction * (END_ANGLE - START_ANGLE);
  const table = {
    columns: ["Metric", "Value", "Min", "Max", "Target"],
    rows: [[label ?? "Value", value, min, max, threshold ?? "—"]],
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      ariaLabel={
        ariaLabel ?? `Gauge: ${valueFormat(value)} of ${valueFormat(max)}`
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const radius = Math.max(0, Math.min(innerWidth / 2, innerHeight));
        const outerRadius = radius;
        const innerRadius = radius * 0.68;
        return (
          <Group top={innerHeight} left={innerWidth / 2}>
            <Arc<unknown>
              startAngle={START_ANGLE}
              endAngle={END_ANGLE}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              fill={theme.grid}
            />
            <Arc<unknown>
              startAngle={START_ANGLE}
              endAngle={valueAngle}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              cornerRadius={2}
              fill={theme.accent}
            />
            {thresholdAngle != null && (
              <line
                x1={Math.sin(thresholdAngle) * (innerRadius - 4)}
                y1={-Math.cos(thresholdAngle) * (innerRadius - 4)}
                x2={Math.sin(thresholdAngle) * (outerRadius + 4)}
                y2={-Math.cos(thresholdAngle) * (outerRadius + 4)}
                stroke={theme.ink}
                strokeWidth={2}
              />
            )}
            <text
              textAnchor="middle"
              y={-innerRadius * 0.35}
              style={{ fontSize: Math.max(14, radius * 0.28) }}
              fontWeight={700}
              fill={theme.ink}
            >
              {valueFormat(value)}
            </text>
            {label && (
              <text
                textAnchor="middle"
                y={-innerRadius * 0.35 + 16}
                style={emText(11)}
                fill={theme.mutedInk}
              >
                {label}
              </text>
            )}
          </Group>
        );
      }}
    </ChartContainer>
  );
}
