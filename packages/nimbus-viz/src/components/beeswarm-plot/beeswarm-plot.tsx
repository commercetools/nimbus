import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { bottomTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import { chartScale, emText } from "../../chart/typography";

export interface BeeswarmPlotProps {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Raw samples; each becomes one dot placed along the value axis. */
  values: number[];
  /** Accessible label for the SVG; defaults to a generated summary. */
  ariaLabel?: string;
}

interface Placed {
  v: number;
  x: number;
  y: number;
}

/**
 * Greedy beeswarm placement: dots sit at their value on the x axis and are
 * nudged off the centre line only as far as needed to avoid overlapping a dot
 * already placed. Deterministic (samples are processed in value order), so the
 * same data always yields the same swarm.
 */
function placeDots(
  values: number[],
  xOf: (v: number) => number,
  r: number
): Placed[] {
  const step = 2 * r + 1;
  const placed: Placed[] = [];
  for (const v of [...values].sort((a, b) => a - b)) {
    const x = xOf(v);
    let y = 0;
    let k = 0;
    // Expand outward (0, +1, -1, +2, -2, …) until the slot is clear.
    while (
      placed.some((p) => Math.abs(p.x - x) < step && Math.abs(p.y - y) < step)
    ) {
      k += 1;
      y = (k % 2 === 1 ? 1 : -1) * Math.ceil(k / 2) * step;
    }
    placed.push({ v, x, y });
  }
  return placed;
}

/**
 * Beeswarm — a one-dimensional distribution that keeps every individual sample
 * visible (unlike a histogram's bins or a box plot's summary). Dots are packed
 * without overlap around the value axis; density shows as thickness. One accent
 * hue; hovering a dot reveals its value.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function BeeswarmPlot({
  width,
  height,
  values,
  ariaLabel,
}: BeeswarmPlotProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);
  const domain = useMemo(() => extent(values) as [number, number], [values]);

  if (width <= 0 || height <= 0 || values.length === 0) return null;

  const label = ariaLabel ?? `Beeswarm plot of ${values.length} samples`;
  const r = Math.max(2, 3 * chartScale(width, height));
  const table = {
    columns: ["#", "Value"],
    rows: values.map((v, i) => [i + 1, v]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 16, bottom: 28, left: 16 }}
      table={table}
      ariaLabel={label}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleLinear({
          domain,
          range: [0, innerWidth],
          nice: true,
        });
        const cy = innerHeight / 2;
        const dots = placeDots(values, (v) => xScale(v), r);
        const maxOffset = innerHeight / 2 - r;
        return (
          <>
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              numTicks={5}
              tickFormat={(v) => formatCompact(v as number)}
              tickLabelProps={bottomTickLabel(theme)}
            />
            {dots.map((d, i) => {
              const y = cy + Math.max(-maxOffset, Math.min(maxOffset, d.y));
              const active = hover == null || hover === i;
              return (
                <circle
                  key={i}
                  cx={d.x}
                  cy={y}
                  r={r}
                  fill={theme.accent}
                  opacity={active ? 0.85 : 0.3}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
            {hover != null && dots[hover] && (
              <SvgTooltip
                x={dots[hover].x}
                innerWidth={innerWidth}
                top={4}
                lines={[formatCompact(dots[hover].v)]}
              />
            )}
            <text x={0} y={-2} style={emText(10)} fill={theme.mutedInk}>
              n = {values.length}
            </text>
          </>
        );
      }}
    </ChartContainer>
  );
}
