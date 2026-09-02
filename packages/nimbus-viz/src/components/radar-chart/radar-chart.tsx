import { useMemo, useState } from "react";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { max } from "d3-array";
import { Legend } from "../../chart/legend";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatCompact } from "../../chart/format";
import { chartRootStyle, emText } from "../../chart/typography";

/** One multivariate profile: `values` aligns index-for-index to `axes`. */
export interface RadarSeries {
  id: string;
  label: string;
  values: number[];
}

export interface RadarChartProps {
  width: number;
  height: number;
  /** Axis names, one spoke each; series values align to this order. */
  axes: string[];
  data: RadarSeries[];
  ariaLabel?: string;
}

interface Vertex {
  x: number;
  y: number;
}

/**
 * Multivariate profile COMPARE on a polar grid: N equally-spaced spokes (one
 * per axis) share a single radial value-scale (0 → max, nice), so a value's
 * distance from center means the same on every spoke. Concentric rings + spoke
 * lines are grid-colored; axis names sit at the spoke ends in muted ink. Each
 * series is a closed polygon in its fixed categorical hue — fill never carries
 * meaning color alone, the legend does.
 */
export function RadarChart({
  width,
  height,
  axes,
  data,
  ariaLabel,
}: RadarChartProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<{ s: number; a: number } | null>(null);

  const ids = useMemo(() => data.map((s) => s.id), [data]);
  const color = useEntityColors(ids);

  const maxValue = useMemo(
    () => max(data.flatMap((s) => s.values)) ?? 0,
    [data]
  );

  if (width <= 0 || height <= 0 || data.length === 0 || axes.length === 0)
    return null;

  const n = axes.length;
  const showLegend = data.length >= 2;
  const legendHeight = showLegend ? 26 : 0;
  const svgHeight = height - legendHeight;

  const cx = width / 2;
  const cy = svgHeight / 2;
  // Reserve a ring for the axis labels outside the plotted radius.
  const radius = Math.max(0, Math.min(width, svgHeight) / 2 - 48);

  const radial = scaleLinear({
    domain: [0, maxValue || 1],
    range: [0, radius],
    nice: true,
  });
  const rings = radial.ticks(4).filter((t) => t > 0);

  // 0 at 12 o'clock, sweeping clockwise as the axis index increases.
  const angleFor = (i: number) => -Math.PI / 2 + (i / n) * 2 * Math.PI;
  const vertex = (i: number, r: number): Vertex => {
    const a = angleFor(i);
    return { x: Math.cos(a) * r, y: Math.sin(a) * r };
  };

  const hovered = hover ? data[hover.s] : null;
  const hoverVertex =
    hover && hovered ? vertex(hover.a, radial(hovered.values[hover.a])) : null;

  return (
    <div style={{ width, height }}>
      <svg
        width={width}
        height={svgHeight}
        role="img"
        aria-label={
          ariaLabel ??
          `Radar chart of ${data.map((s) => s.label).join(", ")} across ${axes.join(", ")}`
        }
        style={chartRootStyle()}
      >
        <Group left={cx} top={cy}>
          {/* Concentric grid rings */}
          {rings.map((t) => (
            <circle
              key={t}
              cx={0}
              cy={0}
              r={radial(t)}
              fill="none"
              stroke={theme.grid}
              strokeWidth={1}
            />
          ))}

          {/* Spokes + axis labels */}
          {axes.map((name, i) => {
            const end = vertex(i, radius);
            const label = vertex(i, radius + 16);
            const cos = Math.cos(angleFor(i));
            const anchor =
              Math.abs(cos) < 0.02 ? "middle" : cos > 0 ? "start" : "end";
            return (
              <g key={name}>
                <line
                  x1={0}
                  y1={0}
                  x2={end.x}
                  y2={end.y}
                  stroke={theme.grid}
                  strokeWidth={1}
                />
                <text
                  x={label.x}
                  y={label.y}
                  dy={4 + Math.sin(angleFor(i)) * 6}
                  textAnchor={anchor}
                  style={emText(11)}
                  fill={theme.mutedInk}
                >
                  {name}
                </text>
              </g>
            );
          })}

          {/* One closed polygon per series */}
          {data.map((s, si) => {
            const pts = axes.map((_, i) => vertex(i, radial(s.values[i])));
            // Close the ring by repeating the first vertex.
            const closed = pts.length > 0 ? [...pts, pts[0]] : pts;
            const c = color(s.id);
            return (
              <g key={s.id}>
                <LinePath<Vertex>
                  data={closed}
                  x={(p) => p.x}
                  y={(p) => p.y}
                  fill={c}
                  fillOpacity={0.12}
                  stroke={c}
                  strokeWidth={2}
                />
                {pts.map((p, i) => (
                  <circle
                    key={axes[i]}
                    cx={p.x}
                    cy={p.y}
                    r={hover && hover.s === si && hover.a === i ? 5 : 3}
                    fill={c}
                    stroke={theme.surface}
                    strokeWidth={1}
                    onMouseEnter={() => setHover({ s: si, a: i })}
                    onMouseLeave={() => setHover(null)}
                  />
                ))}
              </g>
            );
          })}
        </Group>

        {hovered && hoverVertex && hover && (
          <SvgTooltip
            x={cx + hoverVertex.x}
            innerWidth={width}
            top={cy + hoverVertex.y + 8}
            lines={[
              hovered.label,
              `${axes[hover.a]}: ${formatCompact(hovered.values[hover.a])}`,
            ]}
          />
        )}
      </svg>

      {showLegend && (
        <div style={{ paddingTop: 6 }}>
          <Legend
            items={data.map((s) => ({ label: s.label, color: color(s.id) }))}
          />
        </div>
      )}
    </div>
  );
}
