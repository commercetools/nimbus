import { useMemo, useState } from "react";
import { scaleBand } from "@visx/scale";
import { max } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { GRADIENT_LEGEND_HEIGHT } from "../../chart/marks";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { sequentialColor, useChartTheme, readableTextColor } from "../../theme";
import { formatCompact, formatInteger } from "../../chart/format";
import { emText, CHART_FONT_STACK, LABEL_PX } from "../../chart/typography";

/** One segment of an RFM matrix. `recency` & `frequency` are 1..N bucket indices. */
export interface RfmCell {
  recency: number;
  frequency: number;
  count: number;
  value?: number;
}

export interface RfmGridProps {
  width: number;
  height: number;
  data: RfmCell[];
  ariaLabel?: string;
}

/**
 * RFM segmentation matrix: recency on the x-axis (buckets), frequency on the
 * y-axis (buckets). Each segment is colored by a single-hue sequential ramp
 * over its customer `count` (magnitude → one hue), with the count printed in
 * the cell. Empty segments render as an empty grid cell. Part-whole /
 * distribution segmentation.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function RfmGrid({ width, height, data, ariaLabel }: RfmGridProps) {
  const theme = useChartTheme();
  const [hover, setHover] = useState<string | null>(null);

  const numRecency = useMemo(() => max(data, (d) => d.recency) ?? 0, [data]);
  const numFrequency = useMemo(
    () => max(data, (d) => d.frequency) ?? 0,
    [data]
  );
  const maxCount = useMemo(() => max(data, (d) => d.count) ?? 0, [data]);

  const byCell = useMemo(() => {
    const m = new Map<string, RfmCell>();
    for (const d of data) m.set(`${d.recency}:${d.frequency}`, d);
    return m;
  }, [data]);

  if (
    width <= 0 ||
    height <= 0 ||
    data.length === 0 ||
    numRecency === 0 ||
    numFrequency === 0
  ) {
    return null;
  }

  const color = sequentialColor(theme.ramps.blue);
  const table = {
    columns: ["Recency", "Frequency", "Count", "Value"],
    rows: data.map((d) => [d.recency, d.frequency, d.count, d.value ?? ""]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 10, right: 12, bottom: 40, left: 44 }}
      ariaLabel={
        ariaLabel ??
        `RFM grid, ${numRecency} recency by ${numFrequency} frequency buckets`
      }
      legendHeight={GRADIENT_LEGEND_HEIGHT}
      legendSlot={
        <GradientLegend
          color={color}
          lowLabel="Fewer"
          highLabel="More"
          mutedInk={theme.mutedInk}
        />
      }
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleBand({
          // recency 1..N, low → high left → right
          domain: Array.from({ length: numRecency }, (_, i) => String(i + 1)),
          range: [0, innerWidth],
          padding: 0.06,
        });
        // frequency high (top) → low (bottom) so the arrow reads upward
        const yScale = scaleBand({
          domain: Array.from({ length: numFrequency }, (_, i) =>
            String(numFrequency - i)
          ),
          range: [0, innerHeight],
          padding: 0.06,
        });
        const bw = xScale.bandwidth();
        const bh = yScale.bandwidth();
        const hovered = hover ? byCell.get(hover) : null;

        return (
          <>
            {/* Cells */}
            {Array.from({ length: numRecency }).map((_, ri) => {
              const r = ri + 1;
              const x = xScale(String(r)) ?? 0;
              return Array.from({ length: numFrequency }).map((__, fi) => {
                const f = fi + 1;
                const y = yScale(String(f)) ?? 0;
                const key = `${r}:${f}`;
                const cellData = byCell.get(key);
                if (!cellData) {
                  return (
                    <rect
                      key={key}
                      x={x}
                      y={y}
                      width={bw}
                      height={bh}
                      rx={3}
                      fill={theme.grid}
                      fillOpacity={0.3}
                      stroke={theme.surface}
                      strokeWidth={1}
                    />
                  );
                }
                const t = maxCount > 0 ? cellData.count / maxCount : 0;
                return (
                  <g key={key}>
                    <rect
                      x={x}
                      y={y}
                      width={bw}
                      height={bh}
                      rx={3}
                      fill={color(t)}
                      stroke={theme.surface}
                      strokeWidth={1}
                      onMouseEnter={() => setHover(key)}
                      onMouseLeave={() => setHover(null)}
                    />
                    {bw > 24 && bh > 16 && (
                      <text
                        x={x + bw / 2}
                        y={y + bh / 2}
                        dy="0.32em"
                        textAnchor="middle"
                        style={emText(11)}
                        fontWeight={600}
                        fill={readableTextColor(
                          color(t),
                          theme.ink,
                          theme.surface
                        )}
                        pointerEvents="none"
                      >
                        {formatCompact(cellData.count)}
                      </text>
                    )}
                  </g>
                );
              });
            })}
            {/* Recency bucket numbers (x) */}
            {Array.from({ length: numRecency }).map((_, ri) => {
              const r = ri + 1;
              return (
                <text
                  key={`rx-${r}`}
                  x={(xScale(String(r)) ?? 0) + bw / 2}
                  y={innerHeight + 12}
                  textAnchor="middle"
                  style={emText(10)}
                  fill={theme.mutedInk}
                >
                  {r}
                </text>
              );
            })}
            {/* Frequency bucket numbers (y) */}
            {Array.from({ length: numFrequency }).map((_, fi) => {
              const f = fi + 1;
              return (
                <text
                  key={`fy-${f}`}
                  x={-8}
                  y={(yScale(String(f)) ?? 0) + bh / 2}
                  dy="0.32em"
                  textAnchor="end"
                  style={emText(10)}
                  fill={theme.mutedInk}
                >
                  {f}
                </text>
              );
            })}
            {/* Axis titles */}
            <text
              x={innerWidth / 2}
              y={innerHeight + 30}
              textAnchor="middle"
              style={emText(11)}
              fontWeight={600}
              fill={theme.mutedInk}
            >
              Recency →
            </text>
            <text
              transform={`translate(${-34}, ${innerHeight / 2}) rotate(-90)`}
              textAnchor="middle"
              style={emText(11)}
              fontWeight={600}
              fill={theme.mutedInk}
            >
              Frequency →
            </text>
            {hovered && (
              <SvgTooltip
                x={(xScale(String(hovered.recency)) ?? 0) + bw / 2}
                top={Math.max(0, yScale(String(hovered.frequency)) ?? 0)}
                innerWidth={innerWidth}
                lines={[
                  `R${hovered.recency} · F${hovered.frequency}`,
                  `Customers: ${formatInteger(hovered.count)}`,
                  ...(hovered.value != null
                    ? [`Value: ${formatCompact(hovered.value)}`]
                    : []),
                ]}
              />
            )}
          </>
        );
      }}
    </ChartContainer>
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
