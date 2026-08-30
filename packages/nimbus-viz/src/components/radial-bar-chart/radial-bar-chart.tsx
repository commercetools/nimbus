import { useMemo, useState } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max } from "d3-array";
import { ChartFrame } from "../../chart/chart-frame";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { CategoryDatum } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface RadialBarChartProps {
  width: number;
  height: number;
  data: CategoryDatum[];
  ariaLabel?: string;
}

/** Point on a circle for an angle measured clockwise from 12 o'clock. */
function polar(r: number, angle: number): [number, number] {
  return [r * Math.sin(angle), -r * Math.cos(angle)];
}

/** SVG path for an annular sector (a radial bar) centered on the origin. */
function sectorPath(r0: number, r1: number, a0: number, a1: number): string {
  const largeArc = a1 - a0 > Math.PI ? 1 : 0;
  const [x0o, y0o] = polar(r1, a0);
  const [x1o, y1o] = polar(r1, a1);
  const [x1i, y1i] = polar(r0, a1);
  const [x0i, y0i] = polar(r0, a0);
  return [
    `M${x0o},${y0o}`,
    `A${r1},${r1} 0 ${largeArc} 1 ${x1o},${y1o}`,
    `L${x1i},${y1i}`,
    `A${r0},${r0} 0 ${largeArc} 0 ${x0i},${y0i}`,
    "Z",
  ].join(" ");
}

/**
 * Radial (polar) bar chart — bars grow outward from a common inner radius, one
 * angular slot per category. Length still lives on a common baseline (the inner
 * ring), so it reads as magnitude; the circular layout is the trade for a
 * compact, distinctive form. One accent hue (identity is the angular position),
 * hover highlights a bar and shows its value.
 */
export function RadialBarChart({
  width,
  height,
  data,
  ariaLabel,
}: RadialBarChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);
  const valueMax = useMemo(() => max(data, (d) => d.value) ?? 0, [data]);

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const label = ariaLabel ?? `Radial bar chart of ${data.length} categories`;

  return (
    <ChartFrame
      width={width}
      height={height}
      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      ariaLabel={label}
    >
      {({ innerWidth, innerHeight }) => {
        const cx = innerWidth / 2;
        const cy = innerHeight / 2;
        // Reserve a rim for category labels.
        const outer = Math.max(0, Math.min(innerWidth, innerHeight) / 2 - 18);
        const inner = outer * 0.3;
        const angle = scaleBand({
          domain: data.map((d) => d.category),
          range: [0, Math.PI * 2],
          padding: 0.25,
        });
        const radius = scaleLinear({
          domain: [0, valueMax],
          range: [inner, outer],
        });
        const bw = angle.bandwidth();
        const hovered = hover != null ? data[hover] : null;
        return (
          <>
            <Group top={cy} left={cx}>
              {data.map((d, i) => {
                const a0 = (angle(d.category) ?? 0) + bw * 0.05;
                const a1 = a0 + bw * 0.9;
                const aMid = (a0 + a1) / 2;
                const r1 = Math.max(inner, radius(d.value));
                const active = hover == null || hover === i;
                const [lx, ly] = polar(outer + 10, aMid);
                const flip = aMid > Math.PI;
                return (
                  <g
                    key={d.category}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                  >
                    <path
                      d={sectorPath(inner, r1, a0, a1)}
                      fill={theme.accent}
                      opacity={active ? 1 : 0.35}
                    />
                    <text
                      x={lx}
                      y={ly}
                      dy="0.32em"
                      textAnchor={flip ? "end" : "start"}
                      style={emText(10)}
                      fill={theme.mutedInk}
                    >
                      {d.category}
                    </text>
                  </g>
                );
              })}
            </Group>
            {hovered && (
              <SvgTooltip
                x={cx}
                innerWidth={innerWidth}
                top={4}
                lines={[hovered.category, formatCompact(hovered.value)]}
              />
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
