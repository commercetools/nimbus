import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { extent } from "d3-array";
import { ChartFrame } from "../../chart/chart-frame";
import { GridRows, bottomTickLabel, leftTickLabel } from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { ScatterPoint } from "../../chart/types";
import { chartScale, emText } from "../../chart/typography";

export interface ConnectedScatterplotProps {
  width: number;
  height: number;
  /** Points in sequence — connected in the given order (often chronological). */
  points: ScatterPoint[];
  ariaLabel?: string;
}

/**
 * Connected scatterplot — two variables against each other, with the points
 * joined in sequence to trace the path the pair took (typically over time). It
 * shows the relationship AND its trajectory at once; the first and last points
 * are labelled to orient the reader. Hovering a point shows its coordinates.
 */
export function ConnectedScatterplot({
  width,
  height,
  points,
  ariaLabel,
}: ConnectedScatterplotProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const xDomain = useMemo(
    () => extent(points, (p) => p.x) as [number, number],
    [points]
  );
  const yDomain = useMemo(
    () => extent(points, (p) => p.y) as [number, number],
    [points]
  );

  if (width <= 0 || height <= 0 || points.length === 0) return null;

  const label = ariaLabel ?? `Connected scatterplot of ${points.length} points`;
  const r = Math.max(2.5, 3 * chartScale(width, height));
  const lastIndex = points.length - 1;

  return (
    <ChartFrame
      width={width}
      height={height}
      margin={{ top: 16, right: 20, bottom: 28, left: 44 }}
      ariaLabel={label}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleLinear({
          domain: xDomain,
          range: [0, innerWidth],
          nice: true,
        });
        const yScale = scaleLinear({
          domain: yDomain,
          range: [innerHeight, 0],
          nice: true,
        });
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
              numTicks={5}
              tickFormat={(v) => formatCompact(v as number)}
              tickLabelProps={bottomTickLabel(theme)}
            />
            <LinePath<ScatterPoint>
              data={points}
              x={(d) => xScale(d.x)}
              y={(d) => yScale(d.y)}
              stroke={theme.accent}
              strokeWidth={2}
              strokeOpacity={0.7}
            />
            {points.map((p, i) => {
              const endpoint = i === 0 || i === lastIndex;
              const active = hover == null || hover === i;
              return (
                <circle
                  key={i}
                  cx={xScale(p.x)}
                  cy={yScale(p.y)}
                  r={endpoint ? r + 1 : r}
                  fill={endpoint ? theme.accent : theme.surface}
                  stroke={theme.accent}
                  strokeWidth={1.5}
                  opacity={active ? 1 : 0.4}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })}
            {points[0]?.label && (
              <text
                x={xScale(points[0].x) + 6}
                y={yScale(points[0].y) - 6}
                style={emText(10)}
                fill={theme.mutedInk}
              >
                {points[0].label}
              </text>
            )}
            {points[lastIndex]?.label && (
              <text
                x={xScale(points[lastIndex].x) + 6}
                y={yScale(points[lastIndex].y) - 6}
                style={emText(10)}
                fontWeight={600}
                fill={theme.ink}
              >
                {points[lastIndex].label}
              </text>
            )}
            {hover != null && points[hover] && (
              <SvgTooltip
                x={xScale(points[hover].x)}
                innerWidth={innerWidth}
                top={Math.max(0, yScale(points[hover].y) - 4)}
                lines={[
                  points[hover].label ?? `Point ${hover + 1}`,
                  `x: ${formatCompact(points[hover].x)}`,
                  `y: ${formatCompact(points[hover].y)}`,
                ]}
              />
            )}
          </>
        );
      }}
    </ChartFrame>
  );
}
