import { useCallback, useMemo, useState } from "react";
import type { ReactElement } from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { ChartContainer } from "../../chart/chart-container";
import { useChartTheme, useEntityColors } from "../../theme";
import { formatPercent } from "../../chart/format";
import { useChartFormatters } from "../../chart/format-locale";
import type { CategoryDatum } from "../../chart/types";
import { emText } from "../../chart/typography";
import type { DatumInteractionProps } from "../../chart/interaction";

export interface DonutChartProps<
  T = CategoryDatum,
> extends DatumInteractionProps<T> {
  /** Rendered width in pixels — normally supplied by `ResponsiveContainer`. */
  width: number;
  /** Rendered height in pixels — normally supplied by `ResponsiveContainer`. */
  height: number;
  /** One row per slice; slice order follows the array. Each row is a
   *  `CategoryDatum` (`{ category, value }`) unless you pass `category`/
   *  `value` accessors for a custom row type. */
  data: T[];
  /** Category-label accessor. Defaults to `d.category` (the CategoryDatum
   *  shape). Required when `data` is a custom row type. */
  category?: (d: T) => string;
  /** Value accessor. Defaults to `d.value`. Required for a custom row type. */
  value?: (d: T) => number;
  /** Accessible label for the chart (its SVG is exposed as `role="img"`). */
  ariaLabel?: string;
  /** Formats value displays (axis ticks, tooltip values). Defaults to a compact formatter (e.g. `4.2k`); overrides any surrounding `ChartLocaleProvider`. */
  valueFormat?: (n: number) => string;
}

/**
 * Part-to-whole as a donut. Color is identity here (one hue per slice, fixed
 * order) — legitimate, unlike magnitude bars. The hole shows the total, or the
 * hovered slice's share.
 *
 * Generic over the row type `T`: pass `category`/`value` accessors to feed
 * your own domain rows directly; both default to the built-in `CategoryDatum`
 * shape.
 *
 * @experimental Prototype-stage; API may change before it is marked stable.
 */
export function DonutChart(
  props: DonutChartProps<CategoryDatum>
): ReactElement | null;
export function DonutChart<T>(
  props: DonutChartProps<T> &
    Required<Pick<DonutChartProps<T>, "category" | "value">>
): ReactElement | null;
export function DonutChart<T = CategoryDatum>({
  width,
  height,
  data,
  category,
  value,
  ariaLabel,
  valueFormat,
  onDatumClick,
  onDatumHover,
}: DonutChartProps<T>) {
  const theme = useChartTheme();
  const formatters = useChartFormatters();
  const valueFmt = valueFormat ?? formatters.compact;
  const [hover, setHover] = useState<string | null>(null);

  const getCat = useCallback(
    (d: T): string => (category ? category(d) : (d as CategoryDatum).category),
    [category]
  );
  const getVal = useCallback(
    (d: T): number => (value ? value(d) : (d as CategoryDatum).value),
    [value]
  );

  const total = useMemo(
    () => data.reduce((s, d) => s + getVal(d), 0),
    [data, getVal]
  );
  const color = useEntityColors(
    useMemo(() => data.map((d) => getCat(d)), [data, getCat])
  );

  if (width <= 0 || height <= 0 || data.length === 0) return null;

  const colorFor = (i: number) => color(getCat(data[i]));
  const active = hover ? data.find((d) => getCat(d) === hover) : null;
  const table = {
    columns: ["Category", "Value", "Share"],
    rows: data.map((d) => [
      getCat(d),
      getVal(d),
      formatPercent(total ? getVal(d) / total : 0),
    ]),
  };

  return (
    <ChartContainer
      width={width}
      height={height}
      margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      ariaLabel={ariaLabel ?? `Donut chart of ${data.length} categories`}
      legend={data.map((d, i) => ({ label: getCat(d), color: colorFor(i) }))}
      table={table}
    >
      {({ innerWidth, innerHeight }) => {
        const radius = Math.max(0, Math.min(innerWidth, innerHeight) / 2);
        const inner = radius * 0.62;
        return (
          <Group top={innerHeight / 2} left={innerWidth / 2}>
            <Pie<T>
              data={data}
              pieValue={(d) => getVal(d)}
              outerRadius={radius}
              innerRadius={inner}
              padAngle={0.02}
              cornerRadius={3}
            >
              {(pie) =>
                pie.arcs.map((arc) => {
                  const i = data.indexOf(arc.data);
                  const cat = getCat(arc.data);
                  const dimmed = hover != null && hover !== cat;
                  return (
                    <path
                      key={cat}
                      d={pie.path(arc) ?? ""}
                      fill={colorFor(i)}
                      opacity={dimmed ? 0.4 : 1}
                      onMouseEnter={() => {
                        setHover(cat);
                        onDatumHover?.({ datum: arc.data, index: i });
                      }}
                      onMouseLeave={() => {
                        setHover(null);
                        onDatumHover?.(null);
                      }}
                      onClick={() =>
                        onDatumClick?.({ datum: arc.data, index: i })
                      }
                    />
                  );
                })
              }
            </Pie>
            <text
              textAnchor="middle"
              dy={-2}
              style={emText(20)}
              fontWeight={700}
              fill={theme.ink}
            >
              {active ? formatPercent(getVal(active) / total) : valueFmt(total)}
            </text>
            <text
              textAnchor="middle"
              dy={16}
              style={emText(11)}
              fill={theme.mutedInk}
            >
              {active ? getCat(active) : "Total"}
            </text>
          </Group>
        );
      }}
    </ChartContainer>
  );
}
