import { useMemo, useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { max } from "d3-array";
import { ChartFrame } from "../../chart/chart-frame";
import { Legend } from "../../chart/legend";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import type { StackRow } from "../../chart/types";
import { emText } from "../../chart/typography";

export interface PopulationPyramidProps {
  width: number;
  height: number;
  /**
   * One row per band (e.g. an age bracket). The first two segments become the
   * left and right sides; further segments are ignored. Bands are drawn in the
   * given order, top to bottom.
   */
  data: StackRow[];
  ariaLabel?: string;
}

/** Width of the central gutter reserved for band labels, in px. */
const GUTTER = 52;

/**
 * Population pyramid — two series of bars sharing one band axis, drawn back to
 * back around a central gutter that carries the band labels. Both sides share a
 * value scale so the two populations are directly comparable at every band. Two
 * categorical hues with a legend; hovering a bar shows its value.
 */
export function PopulationPyramid({
  width,
  height,
  data,
  ariaLabel,
}: PopulationPyramidProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{ r: number; side: 0 | 1 } | null>(null);

  const keys = useMemo(
    () => [
      data[0]?.segments[0]?.key ?? "Left",
      data[0]?.segments[1]?.key ?? "Right",
    ],
    [data]
  );
  const color = useEntityColors(keys);
  const valueMax = useMemo(
    () =>
      max(data, (d) =>
        Math.max(d.segments[0]?.value ?? 0, d.segments[1]?.value ?? 0)
      ) ?? 0,
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const legendHeight = 26;
  const chartHeight = height - legendHeight;
  const label = ariaLabel ?? `Population pyramid of ${data.length} bands`;

  return (
    <div style={{ width, height }}>
      <ChartFrame
        width={width}
        height={chartHeight}
        margin={{ top: 8, right: 16, bottom: 12, left: 16 }}
        ariaLabel={label}
      >
        {({ innerWidth, innerHeight }) => {
          const half = Math.max(0, (innerWidth - GUTTER) / 2);
          const centerLeft = half;
          const centerRight = half + GUTTER;
          const yScale = scaleBand({
            domain: data.map((d) => d.category),
            range: [0, innerHeight],
            padding: 0.2,
          });
          const wScale = scaleLinear({
            domain: [0, valueMax || 1],
            range: [0, half],
            nice: true,
          });
          const bh = yScale.bandwidth();
          const hovered =
            hover != null ? data[hover.r]?.segments[hover.side] : null;
          const hoveredY =
            hover != null ? (yScale(data[hover.r].category) ?? 0) : 0;
          return (
            <>
              {data.map((row, r) => {
                const y = yScale(row.category) ?? 0;
                const lv = row.segments[0]?.value ?? 0;
                const rv = row.segments[1]?.value ?? 0;
                const lw = wScale(lv);
                const rw = wScale(rv);
                const lActive =
                  hover == null || (hover.r === r && hover.side === 0);
                const rActive =
                  hover == null || (hover.r === r && hover.side === 1);
                return (
                  <g key={row.category}>
                    <rect
                      x={centerLeft - lw}
                      y={y}
                      width={Math.max(0, lw)}
                      height={bh}
                      fill={color(keys[0])}
                      opacity={lActive ? 1 : 0.4}
                      onMouseEnter={() => setHover({ r, side: 0 })}
                      onMouseLeave={() => setHover(null)}
                    />
                    <rect
                      x={centerRight}
                      y={y}
                      width={Math.max(0, rw)}
                      height={bh}
                      fill={color(keys[1])}
                      opacity={rActive ? 1 : 0.4}
                      onMouseEnter={() => setHover({ r, side: 1 })}
                      onMouseLeave={() => setHover(null)}
                    />
                    <text
                      x={centerLeft + GUTTER / 2}
                      y={y + bh / 2}
                      dy="0.32em"
                      textAnchor="middle"
                      style={emText(10)}
                      fill={theme.mutedInk}
                    >
                      {row.category}
                    </text>
                  </g>
                );
              })}
              {hovered && (
                <SvgTooltip
                  x={centerLeft + GUTTER / 2}
                  innerWidth={innerWidth}
                  top={Math.max(0, hoveredY - 4)}
                  lines={[
                    `${data[hover!.r].category} · ${keys[hover!.side]}`,
                    formatCompact(hovered.value),
                  ]}
                />
              )}
            </>
          );
        }}
      </ChartFrame>
      <div style={{ paddingTop: 6 }}>
        <Legend
          items={keys.map((key) => ({ label: key, color: color(key) }))}
        />
      </div>
    </div>
  );
}
