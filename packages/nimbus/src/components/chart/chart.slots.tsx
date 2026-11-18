import { createSlotRecipeContext } from "@chakra-ui/react/styled-system";
import type { SlotComponent } from "@/type-utils";
import type {
  ChartRootSlotProps,
  ChartLegendSlotProps,
  ChartLegendItemSlotProps,
  ChartLegendSwatchSlotProps,
  ChartTooltipSlotProps,
  ChartTooltipLabelSlotProps,
  ChartTooltipItemSlotProps,
  ChartTooltipValueSlotProps,
  ChartEmptySlotProps,
  ChartPlotSlotProps,
} from "./chart.types";

const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusChart",
});

// Chart Root - Sizing box around the chart, legend and states
export const ChartRootSlot: SlotComponent<HTMLDivElement, ChartRootSlotProps> =
  withProvider<HTMLDivElement, ChartRootSlotProps>("div", "root");

// Chart Plot - Box with the default aspect ratio around chart, skeleton or empty state
export const ChartPlotSlot: SlotComponent<HTMLDivElement, ChartPlotSlotProps> =
  withContext<HTMLDivElement, ChartPlotSlotProps>("div", "plot");

// Chart Empty - Text shown when there is no data
export const ChartEmptySlot: SlotComponent<
  HTMLDivElement,
  ChartEmptySlotProps
> = withContext<HTMLDivElement, ChartEmptySlotProps>("div", "empty");

// Chart Legend - List of the series
export const ChartLegendSlot: SlotComponent<
  HTMLUListElement,
  ChartLegendSlotProps
> = withContext<HTMLUListElement, ChartLegendSlotProps>("ul", "legend");

// Chart Legend Item - One entry of the legend
export const ChartLegendItemSlot: SlotComponent<
  HTMLLIElement,
  ChartLegendItemSlotProps
> = withContext<HTMLLIElement, ChartLegendItemSlotProps>("li", "legendItem");

// Chart Legend Swatch - Color sample of a series
export const ChartLegendSwatchSlot: SlotComponent<
  HTMLSpanElement,
  ChartLegendSwatchSlotProps
> = withContext<HTMLSpanElement, ChartLegendSwatchSlotProps>(
  "span",
  "legendSwatch"
);

// Chart Tooltip - Live region with the values of the active data point
export const ChartTooltipSlot: SlotComponent<
  HTMLDivElement,
  ChartTooltipSlotProps
> = withContext<HTMLDivElement, ChartTooltipSlotProps>("div", "tooltip");

// Chart Tooltip Label - Heading of the tooltip (the x value or category)
export const ChartTooltipLabelSlot: SlotComponent<
  HTMLDivElement,
  ChartTooltipLabelSlotProps
> = withContext<HTMLDivElement, ChartTooltipLabelSlotProps>(
  "div",
  "tooltipLabel"
);

// Chart Tooltip Item - Swatch, label and value of one series
export const ChartTooltipItemSlot: SlotComponent<
  HTMLDivElement,
  ChartTooltipItemSlotProps
> = withContext<HTMLDivElement, ChartTooltipItemSlotProps>(
  "div",
  "tooltipItem"
);

// Chart Tooltip Value - The value of one series
export const ChartTooltipValueSlot: SlotComponent<
  HTMLSpanElement,
  ChartTooltipValueSlotProps
> = withContext<HTMLSpanElement, ChartTooltipValueSlotProps>(
  "span",
  "tooltipValue"
);
