import {
  ChartLegendItemSlot,
  ChartLegendSlot,
  ChartLegendSwatchSlot,
} from "../chart.slots";
import { useChartContext } from "../chart.context";
import type { ChartLegendSlotProps } from "../chart.types";

/**
 * # ChartLegend
 *
 * HTML list with a color swatch and a text label for each series, read from
 * the resolved chart config. Text labels make color not the only signal.
 *
 * @supportsStyleProps
 */
export const ChartLegend = (props: ChartLegendSlotProps) => {
  const { series } = useChartContext();

  if (series.length === 0) return null;

  return (
    <ChartLegendSlot role="list" {...props}>
      {series.map((item) => (
        <ChartLegendItemSlot key={item.key}>
          <ChartLegendSwatchSlot
            aria-hidden="true"
            style={{ color: item.color }}
          />
          <span>{item.label}</span>
        </ChartLegendItemSlot>
      ))}
    </ChartLegendSlot>
  );
};

ChartLegend.displayName = "ChartLegend";
