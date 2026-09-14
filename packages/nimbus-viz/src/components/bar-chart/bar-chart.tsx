import { useCallback, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import { scaleLinear } from "@visx/scale";
import { BarRounded } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { max, min } from "d3-array";
import { ChartContainer } from "../../chart/chart-container";
import { ChartScaleProvider } from "../../chart/scale-context";
import { bandByIndex } from "../../chart/scales";
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

export interface BarChartProps<T = CategoryDatum> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** Categories to plot. Each row is a `CategoryDatum` (`{ category, value }`)
   *  unless you pass `category`/`value` accessors for a custom row type. */
  data: T[];
  /** Category-label accessor. Defaults to `d.category` (the CategoryDatum shape).
   *  Required when `data` is a custom row type. */
  category?: (d: T) => string;
  /** Value accessor. Defaults to `d.value`. Required for a custom row type. */
  value?: (d: T) => number;
  /** "horizontal" = ranked bars (sorted desc, direct value labels). */
  orientation?: "vertical" | "horizontal";
  /** Accessible label for the SVG; state the takeaway, not every value. */
  ariaLabel?: string;
  /** Format a value-axis number (tick labels + tooltip values). Overrides the
   *  locale/currency formatter from any surrounding ChartLocaleProvider. */
  valueFormat?: (n: number) => string;
  /** Fired when a datum is clicked (drill-down). */
  onDatumClick?: DatumClickHandler<T>;
  /** Fired when the hovered datum changes; null when the pointer leaves. */
  onDatumHover?: DatumHoverHandler<T>;
  /** Layer-2 overlays (ReferenceLine, TargetMarker…) on the value axis. Wired
   *  for the vertical orientation, where the value axis is y; the ranked
   *  (horizontal) orientation transposes the value axis and is not yet a
   *  supported overlay surface (see docs/09). */
  children?: ReactNode;
}

/**
 * Categorical magnitudes. One hue (accent) — color carries no meaning here, the
 * category axis does; hovering dims the others. Horizontal is the ranked form:
 * sorted descending, with direct value labels at each bar end.
 *
 * Generic over the row type `T`: pass `category`/`value` accessors to feed your
 * own domain rows directly; both default to the built-in `CategoryDatum` shape.
 */
export function BarChart(
  props: BarChartProps<CategoryDatum>
): ReactElement | null;
export function BarChart<T>(
  props: BarChartProps<T> &
    Required<Pick<BarChartProps<T>, "category" | "value">>
): ReactElement | null;
export function BarChart<T = CategoryDatum>({
  width,
  height,
  data,
  category,
  value,
  orientation = "vertical",
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
  children,
}: BarChartProps<T>) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<number | null>(null);

  const getCat = useCallback(
    (d: T): string => (category ? category(d) : (d as CategoryDatum).category),
    [category]
  );
  const getVal = useCallback(
    (d: T): number => (value ? value(d) : (d as CategoryDatum).value),
    [value]
  );

  const rows = useMemo(
    () =>
      orientation === "horizontal"
        ? [...data].sort((a, b) => getVal(b) - getVal(a))
        : data,
    [data, orientation, getVal]
  );
  const valueMax = useMemo(
    () => max(rows, (d) => getVal(d)) ?? 0,
    [rows, getVal]
  );
  const valueMin = useMemo(
    () => min(rows, (d) => getVal(d)) ?? 0,
    [rows, getVal]
  );
  const hasNegative = rows.some((d) => getVal(d) < 0);

  if (width <= 0 || height <= 0 || rows.length === 0) return null;

  const label = ariaLabel ?? `Bar chart of ${rows.length} categories`;
  const table = {
    columns: ["Category", "Value"],
    rows: rows.map((d) => [getCat(d), getVal(d)]),
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
          const band = bandByIndex(
            rows.map((d) => getCat(d)),
            {
              range: [0, innerHeight],
              padding: 0.25,
            }
          );
          const xScale = scaleLinear({
            domain: [Math.min(0, valueMin), Math.max(0, valueMax)],
            range: [0, innerWidth],
            nice: true,
          });
          const bh = band.bandwidth;
          const zeroX = xScale(0);
          return (
            <>
              {rows.map((d, i) => {
                const y = band.pos(i);
                const xVal = xScale(getVal(d));
                const barLeft = Math.min(zeroX, xVal);
                const barW = Math.max(1, Math.abs(zeroX - xVal));
                const positive = getVal(d) >= 0;
                const active = hover == null || hover === i;
                return (
                  <g
                    key={`${getCat(d)}-${i}`}
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
                      x={barLeft}
                      y={y}
                      width={barW}
                      height={bh}
                      radius={4}
                      right={!hasNegative || positive}
                      left={hasNegative && !positive}
                      fill={
                        hasNegative
                          ? positive
                            ? theme.positive
                            : theme.negative
                          : theme.accent
                      }
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
                      {getCat(d)}
                    </text>
                    <text
                      x={positive ? barLeft + barW + 6 : barLeft - 6}
                      y={y + bh / 2}
                      dy="0.32em"
                      textAnchor={positive ? "start" : "end"}
                      style={emText(11)}
                      fill={theme.ink}
                    >
                      {valueFmt(getVal(d))}
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
        const band = bandByIndex(
          rows.map((d) => getCat(d)),
          {
            range: [0, innerWidth],
            padding: 0.2,
          }
        );
        const yScale = scaleLinear({
          domain: [Math.min(0, valueMin), Math.max(0, valueMax)],
          range: [innerHeight, 0],
          nice: true,
        });
        const bw = band.bandwidth;
        const zeroY = yScale(0);
        return (
          <ChartScaleProvider
            value={{
              yScale: (v) => yScale(v),
              xScale: (v) => {
                const idx = Math.round(Number(v));
                return rows[idx] != null ? band.center(idx) : 0;
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
              scale={band.scale}
              top={innerHeight}
              stroke={theme.axis}
              hideTicks
              tickFormat={(v) =>
                fitBandLabel(band.step)(band.tickFormat(String(v)))
              }
              tickLabelProps={bottomTickLabel(theme)}
            />
            {rows.map((d, i) => {
              const x = band.pos(i);
              const yVal = yScale(getVal(d));
              const barTop = Math.min(zeroY, yVal);
              const barH = Math.max(1, Math.abs(zeroY - yVal));
              const positive = getVal(d) >= 0;
              const active = hover == null || hover === i;
              return (
                <BarRounded
                  key={`${getCat(d)}-${i}`}
                  x={x}
                  y={barTop}
                  width={bw}
                  height={barH}
                  radius={4}
                  top={!hasNegative || positive}
                  bottom={hasNegative && !positive}
                  fill={
                    hasNegative
                      ? positive
                        ? theme.positive
                        : theme.negative
                      : theme.accent
                  }
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
                x={band.center(hover)}
                innerWidth={innerWidth}
                top={Math.max(0, yScale(getVal(rows[hover])) - 4)}
                lines={[getCat(rows[hover]), valueFmt(getVal(rows[hover]))]}
              />
            )}
          </ChartScaleProvider>
        );
      }}
    </ChartContainer>
  );
}
