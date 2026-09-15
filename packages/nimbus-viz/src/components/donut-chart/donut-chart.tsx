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
import { ChartPatternDefs, patternFill } from "../../chart/patterns";
import { useForcedColors } from "../../chart/use-forced-colors";
import { ACTIVE_STROKE_WIDTH } from "../../chart/marks";
import { ValueLabel } from "../../chart/value-labels";

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
  /**
   * Fill each slice with a per-category SVG texture (`chart/patterns.tsx`)
   * in addition to its color, so slices stay distinguishable by shape alone
   * — monochrome print, a photocopy, or `forced-colors` mode, where the OS
   * flattens hue and the color-only encoding stops working. Default `false`
   * (color only, unchanged). Turned on automatically (regardless of this
   * prop) when the OS is already in a forced-colors context — see
   * `useForcedColors`.
   */
  texture?: boolean;
  /**
   * Draw each slice's formatted value just outside its outer edge, at its
   * midpoint angle — `chart/value-labels.tsx`'s `ValueLabel`, positioned with
   * the same `polar()`-style math `RadialBarChart` and `SunburstChart` use
   * for their own per-arc placement. Slices narrower than `MIN_LABEL_ANGLE`
   * (20°, about a 5.5% share) are skipped — below that width a label sits
   * too close to its neighbors' to read. Default `false` (no change from
   * today's unlabeled slices).
   */
  showValues?: boolean;
}

/** Point on a circle for an angle measured clockwise from 12 o'clock. */
function polar(r: number, angle: number): [number, number] {
  return [r * Math.sin(angle), -r * Math.cos(angle)];
}

/**
 * Minimum angular sweep (radians) before a slice gets a value label — ~20°,
 * about a 5.5% share. Narrower than this and the label collides with its
 * neighbors' before it can be read.
 */
const MIN_LABEL_ANGLE = Math.PI / 9;

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
  texture,
  showValues,
}: DonutChartProps<T>) {
  const theme = useChartTheme();
  const forcedColors = useForcedColors();
  const effectiveTexture = texture || forcedColors;
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

  // In a forced-colors context, real hues aren't preserved by the OS anyway
  // (it flattens to a tiny fixed system palette) -- one system foreground
  // color for every slice, with the per-slice pattern kind (below) as the
  // only identity carrier.
  const colorFor = (i: number) =>
    forcedColors ? "CanvasText" : color(getCat(data[i]));
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
        // Reserve a rim for the value-label ring when shown (mirrors
        // RadialBarChart's rim reservation for its own rim labels) --
        // untouched when `showValues` is unset, so the default donut is
        // unaffected.
        const radius = Math.max(
          0,
          Math.min(innerWidth, innerHeight) / 2 - (showValues ? 14 : 0)
        );
        const inner = radius * 0.62;
        return (
          <Group top={innerHeight / 2} left={innerWidth / 2}>
            {effectiveTexture && (
              <ChartPatternDefs colors={data.map((_, i) => colorFor(i))} />
            )}
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
                  // Outline the hovered slice only; never dim its siblings
                  // (`chart/marks.ts`'s `ACTIVE_STROKE_WIDTH` -- the shared
                  // convention, replacing a per-chart "dim everyone else"
                  // opacity ternary).
                  const isHovered = hover === cat;
                  const mid = (arc.startAngle + arc.endAngle) / 2;
                  const sweep = arc.endAngle - arc.startAngle;
                  const [lx, ly] = polar(radius + 12, mid);
                  return (
                    <g key={cat}>
                      <path
                        d={pie.path(arc) ?? ""}
                        fill={effectiveTexture ? patternFill(i) : colorFor(i)}
                        stroke={isHovered ? theme.ink : "none"}
                        strokeWidth={isHovered ? ACTIVE_STROKE_WIDTH : 0}
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
                      {showValues && sweep >= MIN_LABEL_ANGLE && (
                        <ValueLabel
                          x={lx}
                          y={ly}
                          text={valueFmt(getVal(arc.data))}
                          anchor={mid > Math.PI ? "end" : "start"}
                        />
                      )}
                    </g>
                  );
                })
              }
            </Pie>
            <text
              textAnchor="middle"
              dy={-2}
              style={emText(20)}
              fontWeight={700}
              fill={forcedColors ? "CanvasText" : theme.ink}
            >
              {active ? formatPercent(getVal(active) / total) : valueFmt(total)}
            </text>
            <text
              textAnchor="middle"
              dy={16}
              style={emText(11)}
              fill={forcedColors ? "CanvasText" : theme.mutedInk}
            >
              {active ? getCat(active) : "Total"}
            </text>
          </Group>
        );
      }}
    </ChartContainer>
  );
}
