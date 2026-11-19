import {
  chartPaletteNames,
  defaultChartPaletteOrder,
  type ChartPalette,
} from "../chart.palettes";
import type { ChartConfig } from "../chart.types";

/**
 * A series or category of a chart with its color resolved to a CSS value.
 */
export type ResolvedChartSeries = {
  /** Data key of the series or name of the category */
  key: string;
  /** Human-readable name from the config */
  label: string;
  /** CSS color, a `var(--nimbus-colors-<palette>-9)` reference */
  color: string;
};

const isDevelopment = () => process.env.NODE_ENV !== "production";

/** Whether a value is the name of a chart palette (also for untyped data). */
const isChartPalette = (value: unknown): value is ChartPalette =>
  typeof value === "string" &&
  (chartPaletteNames as readonly string[]).includes(value);

/**
 * Returns the CSS color of a chart palette. The variable has a light and a
 * dark value, so the color follows the color mode without JavaScript.
 *
 * @param palette - Name of a chart palette
 * @returns `var(--nimbus-colors-<palette>-9)`
 */
export const getChartPaletteColor = (palette: ChartPalette): string =>
  `var(--nimbus-colors-${palette}-9)`;

/**
 * Resolves label and color of each series from the chart config.
 *
 * - A key that is not in `config` is skipped (warns in development).
 * - An entry without `palette` gets the default-order palette at the position
 *   of its key in `seriesKeys`. The order is reused after the last palette.
 * - A palette that is not a chart palette falls back to the first palette of
 *   the default order (warns in development).
 *
 * @param config - Label and palette by data key
 * @param seriesKeys - Keys of the series or categories, in drawing order
 * @returns The resolved series, in the order of `seriesKeys`
 */
export const resolveChartConfig = (
  config: ChartConfig,
  seriesKeys: readonly string[]
): ResolvedChartSeries[] => {
  const dev = isDevelopment();
  const order = defaultChartPaletteOrder;

  if (dev && seriesKeys.length > order.length) {
    console.warn(
      `[Nimbus] Chart: ${seriesKeys.length} series, but only ${order.length} colors are tell-apart safe. Colors are reused from the start of the default order. Show fewer series.`
    );
  }

  const resolved: ResolvedChartSeries[] = [];
  seriesKeys.forEach((key, index) => {
    const entry = Object.hasOwn(config, key) ? config[key] : undefined;
    if (!entry) {
      if (dev) {
        console.warn(
          `[Nimbus] Chart: series "${key}" is not in \`config\` and is skipped.`
        );
      }
      return;
    }

    let palette: ChartPalette;
    if (entry.palette === undefined) {
      // `index` is the position in `seriesKeys`, including skipped keys, so a
      // series keeps its default color when an earlier key is skipped or added.
      palette = order[index % order.length];
    } else if (isChartPalette(entry.palette)) {
      palette = entry.palette;
    } else {
      if (dev) {
        console.warn(
          `[Nimbus] Chart: "${String(entry.palette)}" in \`config.${key}.palette\` is not a chart palette. The first palette of the default order is used.`
        );
      }
      palette = order[0];
    }

    resolved.push({
      key,
      label: entry.label,
      color: getChartPaletteColor(palette),
    });
  });

  return resolved;
};
