import type { ReactElement } from "react";
import type { HTMLChakraProps } from "@chakra-ui/react/styled-system";
import type { ChartPalette } from "./chart.palettes";

// ============================================================
// SLOT PROPS
// ============================================================

export type ChartRootSlotProps = Omit<HTMLChakraProps<"div">, "translate"> & {
  [key: `data-${string}`]: string;
  translate?: "yes" | "no";
};
export type ChartPlotSlotProps = HTMLChakraProps<"div">;
export type ChartLegendSlotProps = HTMLChakraProps<"ul">;
export type ChartLegendItemSlotProps = HTMLChakraProps<"li">;
export type ChartLegendSwatchSlotProps = HTMLChakraProps<"span">;
export type ChartTooltipSlotProps = HTMLChakraProps<"div">;
export type ChartTooltipLabelSlotProps = HTMLChakraProps<"div">;
export type ChartTooltipItemSlotProps = HTMLChakraProps<"div">;
export type ChartTooltipValueSlotProps = HTMLChakraProps<"span">;
export type ChartEmptySlotProps = HTMLChakraProps<"div">;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * Name of a chart color palette. Only palettes whose solid color works with
 * white text are chart palettes. A series uses the palette solid (step 9),
 * which has a light and a dark value.
 */
export type { ChartPalette };

/**
 * Label and color of one series (or category) of a chart.
 */
export type ChartConfigEntry = {
  /**
   * Human-readable name of the series. Shown in the legend and the tooltip.
   */
  label: string;
  /**
   * Color palette of the series. When omitted, the series gets the palette
   * of the default order that matches its position: the first series gets
   * the first palette, the second series the second, and so on. A chart with
   * more than 11 series reuses the order from the start.
   */
  palette?: ChartPalette;
};

/**
 * Maps each data key (a series key, or a category name for pie and radial
 * charts) to its label and color.
 *
 * @example
 * ```ts
 * const config: ChartConfig = {
 *   desktop: { label: "Desktop", palette: "ctviolet" },
 *   mobile: { label: "Mobile" },
 * };
 * ```
 */
export type ChartConfig = Record<string, ChartConfigEntry>;

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props that every chart shares. Chakra style props apply to the root element.
 */
export type ChartBaseProps = Omit<
  ChartRootSlotProps,
  "children" | "aria-label" | "aria-labelledby"
> & {
  /**
   * Ref forwarded to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
  /**
   * The rows to draw, as objects or interface-typed records. An empty array
   * shows the empty state.
   */
  data: readonly object[];
  /**
   * Label and color of each series or category, by data key
   */
  config: ChartConfig;
  /**
   * Accessible name of the chart. Describe what the chart shows,
   * for example "Visitors per month".
   */
  "aria-label": string;
  /**
   * Shows a skeleton instead of the chart
   * @default false
   */
  isLoading?: boolean;
  /**
   * Shows a tooltip with the values of the active data point
   * @default true
   */
  showTooltip?: boolean;
  /**
   * Shows the legend of a chart with a single series. A chart with two or
   * more series or categories always shows its legend, because color must
   * not be the only way to tell series apart.
   * @default false
   */
  showLegend?: boolean;
  /**
   * Turns the draw animation on or off. When not set, the animation is off
   * if the user prefers reduced motion, and on otherwise.
   */
  isAnimationActive?: boolean;
};

/**
 * Props of the internal `ChartContainer`
 */
export type ChartContainerProps = ChartBaseProps & {
  /**
   * Data keys of the series or categories that the chart draws, in drawing
   * order. Keys that are missing in `config` are skipped.
   */
  seriesKeys: readonly string[];
  /**
   * The Recharts chart. It is drawn inside a responsive container.
   */
  children: ReactElement;
};

/**
 * Props of `Chart.Root`, the root of a composed chart. Chakra style props
 * apply to the root element.
 */
export type ChartRootProps = ChartBaseProps & {
  /**
   * Data keys of the series, in drawing order. They are listed in the legend
   * and the tooltip. A series part (`Chart.Bar`, `Chart.Line`, `Chart.Area`)
   * draws only when its `dataKey` is in this list; keys that are missing in
   * `config` are skipped.
   * @default the keys of `config`, in order
   */
  series?: string[];
  /**
   * One `Chart.Plot`
   */
  children: ReactElement;
};
