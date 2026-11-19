import { useMemo } from "react";
import { ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/skeleton/skeleton";
import { useLocalizedStringFormatter } from "@/hooks";
import { ChartContext } from "./chart.context";
import { chartMessagesStrings } from "./chart.messages";
import { ChartEmptySlot, ChartPlotSlot, ChartRootSlot } from "./chart.slots";
import type { ChartContainerProps } from "./chart.types";
import { ChartLegend } from "./components/chart-legend";
import { usePrefersReducedMotion } from "./hooks";
import { resolveChartConfig, resolveIsAnimationActive } from "./utils";

/**
 * # ChartContainer
 *
 * Shared root of all charts (internal). Sizes the chart with a default aspect
 * ratio, shows the loading skeleton or the empty state, resolves the series
 * colors once and shares them, with the animation setting, through context.
 * The legend is shown for two or more series, or for one series with
 * `showLegend`.
 *
 * @supportsStyleProps
 */
export const ChartContainer = (props: ChartContainerProps) => {
  const {
    ref,
    data,
    config,
    "aria-label": ariaLabel,
    isLoading = false,
    showTooltip = true,
    showLegend = false,
    isAnimationActive,
    seriesKeys,
    children,
    ...rest
  } = props;
  const msg = useLocalizedStringFormatter(chartMessagesStrings);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Charts pass a new array on every render. Memoizing on the joined keys
  // resolves (and warns) only when the keys or the config change.
  const keysId = JSON.stringify(seriesKeys);
  const stableKeys = useMemo(() => JSON.parse(keysId) as string[], [keysId]);
  // An inline `config={{ ... }}` is a new object on every render. Keying on its
  // serialized form keeps the series (and the development warnings) from being
  // recomputed on every render.
  const configKey = JSON.stringify(config);
  const series = useMemo(
    () => resolveChartConfig(config, stableKeys),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `configKey` stands for `config`
    [configKey, stableKeys]
  );

  const contextValue = useMemo(
    () => ({
      data,
      series,
      isAnimationActive: resolveIsAnimationActive(
        isAnimationActive,
        prefersReducedMotion
      ),
      showTooltip,
      ariaLabel,
    }),
    [
      data,
      series,
      isAnimationActive,
      prefersReducedMotion,
      showTooltip,
      ariaLabel,
    ]
  );

  const isEmpty = data.length === 0;
  const isLegendShown =
    series.length >= 2 || (series.length === 1 && showLegend);

  if (isLoading) {
    return (
      <ChartRootSlot
        ref={ref}
        role="group"
        aria-label={ariaLabel}
        {...rest}
        aria-busy="true"
      >
        <ChartPlotSlot>
          <Skeleton width="100%" height="100%" />
        </ChartPlotSlot>
      </ChartRootSlot>
    );
  }

  if (isEmpty) {
    return (
      <ChartRootSlot ref={ref} role="group" aria-label={ariaLabel} {...rest}>
        <ChartPlotSlot>
          <ChartEmptySlot role="status">{msg.format("empty")}</ChartEmptySlot>
        </ChartPlotSlot>
      </ChartRootSlot>
    );
  }

  return (
    <ChartContext.Provider value={contextValue}>
      <ChartRootSlot ref={ref} {...rest}>
        <ChartPlotSlot>
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </ChartPlotSlot>
        {isLegendShown && <ChartLegend />}
      </ChartRootSlot>
    </ChartContext.Provider>
  );
};

ChartContainer.displayName = "ChartContainer";
