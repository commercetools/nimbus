import {
  Cell,
  RadialBar,
  RadialBarChart as RechartsRadialBarChart,
  Tooltip,
} from "recharts";
import { ChartContainer } from "@/components/chart/chart-container";
import { useChartContext } from "@/components/chart/chart.context";
import {
  getCategories,
  getCategory,
} from "@/components/chart/utils/chart-categories";
import { ChartTooltip } from "@/components/chart/components/chart-tooltip";
import type { RadialChartProps } from "./radial-chart.types";

type RadialChartPlotProps = Pick<
  RadialChartProps,
  "data" | "nameKey" | "valueKey"
>;

/**
 * The Recharts chart. It reads the resolved categories, the animation setting
 * and the accessible name from the surrounding `ChartContainer`.
 */
const RadialChartPlot = ({ data, nameKey, valueKey }: RadialChartPlotProps) => {
  const { series, isAnimationActive, showTooltip, ariaLabel } =
    useChartContext();

  // Rows whose category is not in `config` are not drawn
  const rings = data.flatMap((row) => {
    const item = series.find((s) => s.key === getCategory(row, nameKey));
    return item ? [{ row, item }] : [];
  });

  return (
    <RechartsRadialBarChart
      data={rings.map(({ row }) => row)}
      innerRadius="20%"
      outerRadius="100%"
      // Recharts measures angles counterclockwise from 3 o'clock. 90 to -270
      // starts at the top and grows clockwise.
      startAngle={90}
      endAngle={-270}
      aria-label={ariaLabel}
    >
      {showTooltip && <Tooltip content={<ChartTooltip nameKey={nameKey} />} />}
      <RadialBar
        dataKey={valueKey}
        background={{ fill: "var(--nimbus-colors-neutral-4)" }}
        isAnimationActive={isAnimationActive}
      >
        {rings.map(({ item }, index) => (
          <Cell
            key={`${item.key}-${index}`}
            fill={item.color}
            stroke="var(--nimbus-colors-bg)"
            strokeWidth={2}
          />
        ))}
      </RadialBar>
    </RechartsRadialBarChart>
  );
};

/**
 * # RadialChart
 *
 * Compares categories with concentric arcs, one ring per row of `data`, each
 * on a light gray track. Name the field that holds the category with `nameKey` and the field
 * that holds its value with `valueKey`. Each category takes its label and color
 * from the `config` entry with the same name. Rings are separated by a 2 px
 * stroke in the background color. The legend is shown for two or more
 * categories.
 *
 * @example
 * ```tsx
 * <RadialChart
 *   aria-label="Visitors by browser"
 *   data={[
 *     { browser: "chrome", visitors: 275 },
 *     { browser: "safari", visitors: 200 },
 *   ]}
 *   nameKey="browser"
 *   valueKey="visitors"
 *   config={{
 *     chrome: { label: "Chrome", palette: "ctviolet" },
 *     safari: { label: "Safari", palette: "orange" },
 *   }}
 * />
 * ```
 *
 * @supportsStyleProps
 *
 * @experimental This component is experimental and may change or be removed in future versions.
 */
export const RadialChart = (props: RadialChartProps) => {
  const { nameKey, valueKey, ...rest } = props;
  // Each distinct value of `nameKey` is a category, in data order
  const categories = getCategories(rest.data, nameKey);

  return (
    <ChartContainer {...rest} seriesKeys={categories}>
      <RadialChartPlot data={rest.data} nameKey={nameKey} valueKey={valueKey} />
    </ChartContainer>
  );
};

RadialChart.displayName = "RadialChart";
