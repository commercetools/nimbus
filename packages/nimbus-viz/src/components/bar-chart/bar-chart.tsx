import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { max } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import {
  GridRows,
  bottomTickLabel,
  fitBandLabel,
  leftTickLabel,
} from "../../chart/axes";
import { SvgTooltip } from "../../chart/svg-tooltip";
import { useChartTheme } from "../../theme";
import { useChartFormatters } from "../../chart/format-locale";
import type { CategoryDatum } from "../../chart/types";
import type {
  DatumClickHandler,
  DatumHoverHandler,
} from "../../chart/interaction";
import { emText } from "../../chart/typography";

export interface BarChartProps {
  width: number;
  height: number;
  data: CategoryDatum[];
  /** "horizontal" = ranked bars (sorted desc, direct value labels). */
  orientation?: "vertical" | "horizontal";
  ariaLabel?: string;
  /** Layer-2 overlays (ReferenceLine, TargetMarker…) on the value axis. Wired
   *  for the vertical orientation, where the value axis is y; the ranked
   *  (horizontal) orientation transposes the value axis and is not yet a
   *  supported overlay surface (see docs/09). */
  /** Format a value-axis number (tick labels + tooltip values). Overrides the
   *  locale/currency formatter from any surrounding ChartLocaleProvider. */
  valueFormat?: (n: number) => string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<CategoryDatum>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<CategoryDatum>;
  children?: ReactNode;
}

/**
 * Categorical magnitudes. One hue (accent) — color carries no meaning here, the
 * category axis does; hovering dims the others. Horizontal is the ranked form:
 * sorted descending, with direct value labels at each bar end.
 */
export function BarChart({
  width,
  height,
  data,
  orientation = "vertical",
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  children,
}: BarChartProps) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);

  const rows = useMemo(
    () =>
      orientation === "horizontal"
        ? [...data].sort((a, b) => b.value - a.value)
        : data,
    [data, orientation]
  );
  const valueMax = useMemo(() => max(rows, (d) => d.value) ?? 0, [rows]);

  if (width <= 0 || height <= 0 || rows.length === 0) return null;

  const label = ariaLabel ?? `Bar chart of ${rows.length} categories`;
  const table = {
    columns: ["Category", "Value"],
    rows: rows.map((d) => [d.category, d.value]),
  };

  if (orientation === "horizontal") {
    return (
      <ChartContainer
        width={width}
        height={height}
        margin={{ top: 8, right: 48, bottom: 12, left: 100 }}
        ariaLabel={label}
        table={table}
      >
        {({ innerWidth, innerHeight }) => {
          const yScale = scaleBand({
            domain: rows.map((d) => d.category),
            range: [0, innerHeight],
            padding: 0.25,
          });
          const xScale = scaleLinear({
            domain: [0, valueMax],
            range: [0, innerWidth],
            nice: true,
          });
          const bh = yScale.bandwidth();
          return (
            <>
              {rows.map((d, i) => {
                const y = yScale(d.category) ?? 0;
                const w = Math.max(0, xScale(d.value));
                const active = hover == null || hover === i;
                return (
                  <g
                    key={d.category}
                    onMouseEnter={() => {
                      setHover(i);
                      onDatumHover?.({ datum: d, index: i });
                    }}
                    onMouseLeave={() => {
                      setHover(null);
                      onDatumHover?.(null);
                    }}
                    onClick={() => onDatumClick?.({ datum: d, index: i })}
                  >
                    <BarRounded
                      x={0}
                      y={y}
                      width={w}
                      height={bh}
                      radius={4}
                      right
                      fill={theme.accent}
                      opacity={active ? 1 : 0.4}
                    />
                    <text
                      x={-8}
                      y={y + bh / 2}
                      dy="0.32em"
                      textAnchor="end"
                      style={emText(11)}
                      fill={theme.mutedInk}
                    >
                      {d.category}
                    </text>
                    <text
                      x={w + 6}
                      y={y + bh / 2}
                      dy="0.32em"
                      style={emText(11)}
                      fill={theme.ink}
                    >
                      {valueFmt(d.value)}
                    </text>
                  </g>
                );
              })}
            </>
          );
        }}
      </ChartContainer>
    );
  }

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 12, right: 12, bottom: 28, left: 40 }}
      ariaLabel={label}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const xScale = scaleBand({
          domain: rows.map((d) => d.category),
          range: [0, innerWidth],
          padding: 0.2,
        });
        const yScale = scaleLinear({
          domain: [0, valueMax],
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = xScale.bandwidth();
        return (
          <ChartScaleProvider
            value={{
              yScale: (v) => yScale(v),
              xScale: (v) => {
                const cat = rows[Math.round(Number(v))]?.category;
                return cat != null ? (xScale(cat) ?? 0) + bw / 2 : 0;
              },
              xBandwidth: bw,
              innerWidth,
              innerHeight,
            }}
          >
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
              tickFormat={(v) => valueFmt(v as number)}
              tickLabelProps={leftTickLabel(theme)}
            />
            <AxisBottom
              scale={xScale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) => fitBandLabel(xScale.step())(String(v))}
              tickLabelProps={bottomTickLabel(theme)}
            />
            {rows.map((d, i) => {
              const x = xScale(d.category) ?? 0;
              const barH = Math.max(0, innerHeight - yScale(d.value));
              const active = hover == null || hover === i;
              return (
                <BarRounded
                  key={d.category}
                  x={x}
                  y={yScale(d.value)}
                  width={bw}
                  height={barH}
                  radius={4}
                  top
                  fill={theme.accent}
                  opacity={active ? 1 : 0.4}
                  onMouseEnter={() => {
                    setHover(i);
                    onDatumHover?.({ datum: d, index: i });
                  }}
                  onMouseLeave={() => {
                    setHover(null);
                    onDatumHover?.(null);
                  }}
                  onClick={() => onDatumClick?.({ datum: d, index: i })}
                />
              );
            })}
            {children}
            {hover != null && rows[hover] && (
              <SvgTooltip
                x={(xScale(rows[hover].category) ?? 0) + bw / 2}
                innerWidth={innerWidth}
                top={Math.max(0, yScale(rows[hover].value) - 4)}
                lines={[rows[hover].category, valueFmt(rows[hover].value)]}
              />
            )}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
