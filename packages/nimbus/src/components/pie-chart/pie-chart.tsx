import { Cell, Pie, PieChart as RechartsPieChart, Tooltip } from "recharts";
import { ChartContainer } from "@/components/chart/chart-container";
import { useChartContext } from "@/components/chart/chart.context";
import {
  getCategories,
  getCategory,
} from "@/components/chart/utils/chart-categories";
import { ChartTooltip } from "@/components/chart/components/chart-tooltip";
import type { PieChartProps } from "./pie-chart.types";

type PieChartPlotProps = Pick<PieChartProps, "data" | "nameKey" | "valueKey">;

/**
 * The Recharts chart. It reads the resolved categories, the animation setting
 * and the accessible name from the surrounding `ChartContainer`.
 */
const PieChartPlot = ({ data, nameKey, valueKey }: PieChartPlotProps) => {
  const { series, isAnimationActive, showTooltip, ariaLabel } =
    useChartContext();

  // Rows whose category is not in `config` are not drawn
  const slices = data.flatMap((row) => {
    const item = series.find((s) => s.key === getCategory(row, nameKey));
    return item ? [{ row, item }] : [];
  });

  return (
    <RechartsPieChart aria-label={ariaLabel}>
      {showTooltip && <Tooltip content={<ChartTooltip nameKey={nameKey} />} />}
      <Pie
        data={slices.map(({ row }) => row)}
        dataKey={valueKey}
        nameKey={nameKey}
        isAnimationActive={isAnimationActive}
      >
        {slices.map(({ item }, index) => (
          <Cell
            key={`${item.key}-${index}`}
            fill={item.color}
            stroke="var(--nimbus-colors-bg)"
            strokeWidth={2}
          />
        ))}
      </Pie>
    </RechartsPieChart>
  );
};

/**
 * # PieChart
 *
 * Shows how a total is split into categories, with one slice per row of
 * `data`. Name the field that holds the category with `nameKey` and the field
 * that holds its value with `valueKey`. Each category takes its label and color
 * from the `config` entry with the same name. Slices are separated by a 2 px
 * stroke in the background color. The legend is shown for two or more
 * categories.
 *
 * @example
 * ```tsx
 * <PieChart
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
export const PieChart = (props: PieChartProps) => {
  const { nameKey, valueKey, ...rest } = props;
  // Each distinct value of `nameKey` is a category, in data order
  const categories = getCategories(rest.data, nameKey);

  return (
    <ChartContainer {...rest} seriesKeys={categories}>
      <PieChartPlot data={rest.data} nameKey={nameKey} valueKey={valueKey} />
    </ChartContainer>
  );
};

PieChart.displayName = "PieChart";
