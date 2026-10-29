import { useMemo } from "react";
import { Meter as RaMeter } from "react-aria-components";
import { useLocale, useNumberFormatter, useObjectRef } from "react-aria";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { MeterRootSlot } from "../meter.slots";
import { METER_SEGMENT_PALETTES } from "../constants";
import { useMeterDevWarnings } from "../hooks";
import { clampToRange, getMeterSegments, getThresholdPalette } from "../utils";
import type { MeterRootProps, MeterSegment } from "../meter.types";
import {
  MeterContext,
  type MeterContextValue,
  type MeterResolvedSegment,
} from "./meter.context";

// Module constant, so the number formatter is not rebuilt on every render
const defaultFormatOptions: Intl.NumberFormatOptions = { style: "percent" };

/**
 * # Meter.Root
 *
 * Holds all data of the meter and renders the element with `role="meter"`.
 * Computes the value text and the summary announced to assistive technology,
 * no matter which parts are rendered inside it.
 *
 * @supportsStyleProps
 */
export const MeterRoot = (props: MeterRootProps) => {
  const {
    ref: forwardedRef,
    children,
    value = 0,
    segments,
    minValue = 0,
    maxValue = 100,
    formatOptions = defaultFormatOptions,
    valueLabel: valueLabelProp,
    colorPalette = "primary",
    thresholds,
    layout = "stacked",
    size = "md",
    ...rest
  } = props;

  // An empty valueLabel counts as not set. React Aria ignores it too, so the
  // visible text and the announced text stay the same
  const valueLabel = valueLabelProp === "" ? undefined : valueLabelProp;

  const recipe = useSlotRecipe({ key: "nimbusMeter" });
  const [recipeProps, restWithoutRecipeProps] = recipe.splitVariantProps({
    layout,
    size,
    ...rest,
  });
  const [styleProps, functionalProps] = extractStyleProps(
    restWithoutRecipeProps
  );

  const ref = useObjectRef(forwardedRef);
  const { locale } = useLocale();
  const formatter = useNumberFormatter(formatOptions);
  const listFormatter = useMemo(
    () => new Intl.ListFormat(locale, { type: "unit", style: "short" }),
    [locale]
  );

  const isSegmented = segments !== undefined;
  const isPercent = formatOptions.style === "percent";

  const { items, meterValue, hasOverflow, hasNegative, totalText, valueText } =
    useMemo(() => {
      // A single value is drawn as one segment, so there is one render path
      const source: MeterSegment[] = segments ?? [
        { id: "value", label: "", value: value - minValue },
      ];
      const geometry = getMeterSegments(source, minValue, maxValue);
      // A single value is clamped directly. Rebuilding it from the segment
      // amounts would add rounding errors (0.1 would become
      // 0.09999999999999998) and thresholds would miss their own value
      const meterValue = segments
        ? minValue + geometry.total
        : clampToRange(value, minValue, maxValue);
      const range = maxValue - minValue;
      /** Formats an amount counted from `minValue` */
      const formatAmount = (amount: number) =>
        formatter.format(isPercent ? (range > 0 ? amount / range : 0) : amount);

      const total =
        valueLabel ??
        (isPercent
          ? formatAmount(meterValue - minValue)
          : formatter.format(meterValue));
      // Segments show the drawn (clamped) amount, so the text matches the bar
      const resolved: MeterResolvedSegment[] = geometry.items.map(
        (item, index) => ({
          ...item,
          colorPalette: segments
            ? (item.colorPalette ??
              METER_SEGMENT_PALETTES[index % METER_SEGMENT_PALETTES.length])
            : undefined,
          formattedValue: formatAmount(item.clampedValue),
        })
      );

      return {
        items: resolved,
        meterValue,
        hasOverflow: geometry.hasOverflow,
        hasNegative: geometry.hasNegative,
        totalText: total,
        valueText:
          segments && resolved.length > 0
            ? `${total} (${listFormatter.format(
                resolved.map((item) => `${item.label}: ${item.formattedValue}`)
              )})`
            : total,
      };
    }, [
      segments,
      value,
      minValue,
      maxValue,
      formatter,
      isPercent,
      valueLabel,
      listFormatter,
    ]);
  const hasSegmentsToShow = isSegmented && items.length > 0;
  // The fill of a single value takes the color of the threshold it reaches
  const fillPalette = isSegmented
    ? colorPalette
    : getThresholdPalette(meterValue, thresholds, colorPalette);

  const { registerLegend } = useMeterDevWarnings({
    isSegmented,
    hasSegmentsToShow,
    hasOverflow,
    hasNegative,
    minValue,
    maxValue,
  });

  const hasValueLabel = valueLabel !== undefined;
  const contextValue: MeterContextValue = useMemo(
    () => ({ isSegmented, items, totalText, hasValueLabel, registerLegend }),
    [isSegmented, items, totalText, hasValueLabel, registerLegend]
  );

  return (
    <MeterContext value={contextValue}>
      <MeterRootSlot
        {...recipeProps}
        {...styleProps}
        colorPalette={fillPalette}
        asChild
      >
        <RaMeter
          ref={ref}
          value={meterValue}
          minValue={minValue}
          maxValue={maxValue}
          formatOptions={formatOptions}
          valueLabel={valueText}
          {...functionalProps}
        >
          {children}
        </RaMeter>
      </MeterRootSlot>
    </MeterContext>
  );
};

MeterRoot.displayName = "Meter.Root";
