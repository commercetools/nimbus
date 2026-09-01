import { useMemo, useState } from "react";
import { extent } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { GRADIENT_LEGEND_HEIGHT } from "../../chart/marks";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { sequentialColor, useChartTheme } from "../../theme";
import { formatCompact } from "../../chart/format";
import { emText, CHART_FONT_STACK, LABEL_PX } from "../../chart/typography";

/** One region placed on a hand-laid grid, shaded by its value. */
export interface RegionTile {
  id: string;
  label?: string;
  row: number;
  col: number;
  value: number;
}

export interface TileGridMapProps {
  width: number;
  height: number;
  data: RegionTile[];
  /** Sequential hue for the value ramp (default the accent's blue). */
  hue?: string;
  ariaLabel?: string;
}

/**
 * Tile-grid map (hex/grid cartogram) — the spatial form that needs no map
 * geometry: each region is an equal-size cell on a hand-laid grid, shaded by its
 * value on a single-hue sequential ramp. Every region reads equally regardless
 * of geographic size (the point of a cartogram). A compact ramp legend shows the
 * scale; hovering a tile reveals its value.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function TileGridMap({
  width,
  height,
  data,
  hue = "blue",
  ariaLabel,
}: TileGridMapProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<number | null>(null);

  const cols = useMemo(
    () => Math.max(0, ...data.map((d) => d.col)) + 1,
    [data]
  );
  const rows = useMemo(
    () => Math.max(0, ...data.map((d) => d.row)) + 1,
    [data]
  );
  const domain = useMemo(
    () => extent(data, (d) => d.value) as [number, number],
    [data]
  );
  const ramp = useMemo(
    () => sequentialColor(theme.ramps[hue] ?? theme.ramps.blue),
    [hue, theme.ramps]
  );
  const tOf = (v: number) =>
    domain[1] === domain[0] ? 0.5 : (v - domain[0]) / (domain[1] - domain[0]);

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const label = ariaLabel ?? `Tile-grid map of ${data.length} regions`;
  const table = {
    columns: ["Region", "Value"],
    rows: data.map((d) => [d.label ?? d.id, d.value]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 6, right: 6, bottom: 6, left: 6 }}
      ariaLabel={label}
      legendHeight={GRADIENT_LEGEND_HEIGHT}
      legendSlot={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: LABEL_PX,
            lineHeight: 1.2,
            fontFamily: CHART_FONT_STACK,
            color: theme.mutedInk,
          }}
        >
          <span>{formatCompact(domain[0])}</span>
          <span
            aria-hidden
            style={{
              flex: 1,
              height: 8,
              borderRadius: 4,
              background: `linear-gradient(to right, ${ramp(0)}, ${ramp(0.5)}, ${ramp(1)})`,
            }}
          />
          <span>{formatCompact(domain[1])}</span>
        </div>
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const side = Math.max(
          0,
          Math.min(innerWidth / cols, innerHeight / rows)
        );
        const gap = Math.min(3, side * 0.08);
        const gridW = side * cols;
        const gridH = side * rows;
        const offsetX = (innerWidth - gridW) / 2;
        const offsetY = (innerHeight - gridH) / 2;
        const hovered = hover != null ? data[hover] : null;
        return (
          <>
            {data.map((d, i) => {
              const x = offsetX + d.col * side;
              const y = offsetY + d.row * side;
              const active = hover == null || hover === i;
              return (
                <g
                  key={d.id}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                >
                  <rect
                    x={x + gap / 2}
                    y={y + gap / 2}
                    width={Math.max(0, side - gap)}
                    height={Math.max(0, side - gap)}
                    rx={3}
                    fill={ramp(tOf(d.value))}
                    opacity={active ? 1 : 0.5}
                    stroke={hover === i ? theme.ink : "none"}
                  />
                  {side > 22 && (
                    <text
                      x={x + side / 2}
                      y={y + side / 2}
                      dy="0.32em"
                      textAnchor="middle"
                      style={emText(9)}
                      fill={theme.ink}
                      stroke={theme.surface}
                      strokeWidth={2}
                      paintOrder="stroke"
                    >
                      {d.id}
                    </text>
                  )}
                </g>
              );
            })}
            {hovered && (
              <SvgTooltip
                x={offsetX + hovered.col * side + side / 2}
                innerWidth={innerWidth}
                top={Math.max(0, offsetY + hovered.row * side - 4)}
                lines={[
                  hovered.label ?? hovered.id,
                  formatCompact(hovered.value),
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
  );
}
