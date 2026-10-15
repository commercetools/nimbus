import { useCallback, useEffect, useMemo, useRef } from "react";
import { Meter as RaMeter } from "react-aria-components";
import { useLocale, useNumberFormatter, useObjectRef } from "react-aria";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import { MeterRootSlot } from "../meter.slots";
import { METER_SEGMENT_PALETTES } from "../constants";
import { getMeterSegments, getThresholdPalette } from "../utils";
import type {
  MeterContextValue,
  MeterResolvedSegment,
  MeterRootProps,
  MeterSegment,
} from "../meter.types";
import { MeterContext } from "./meter.context";

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
    valueLabel,
    colorPalette = "primary",
    thresholds,
    layout = "stacked",
    size = "md",
    ...rest
  } = props;

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
      const range = maxValue - minValue;
      /** Formats an amount counted from `minValue` */
      const formatAmount = (amount: number) =>
        formatter.format(isPercent ? (range > 0 ? amount / range : 0) : amount);

      const total =
        valueLabel ??
        (isPercent
          ? formatAmount(geometry.total)
          : formatter.format(minValue + geometry.total));
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
        meterValue: minValue + geometry.total,
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

  // Meter.Legend registers in a layout effect, so the count is final when
  // the effects below run
  const legendCountRef = useRef(0);
  const registerLegend = useCallback(() => {
    legendCountRef.current += 1;
    return () => {
      legendCountRef.current -= 1;
    };
  }, []);

  // Each development warning is logged once per meter, also when StrictMode
  // runs the effects twice or the values change
  const hasWarnedOverflowRef = useRef(false);
  const hasWarnedNegativeRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !isSegmented) return;
    if (hasOverflow && !hasWarnedOverflowRef.current) {
      hasWarnedOverflowRef.current = true;
      console.warn(
        `Meter.Root: the sum of segment values exceeds the range (${minValue} to ${maxValue}). Segments are cut at maxValue.`
      );
    }
    if (hasNegative && !hasWarnedNegativeRef.current) {
      hasWarnedNegativeRef.current = true;
      console.warn(
        "Meter.Root: segment values must not be negative. Negative values are treated as 0."
      );
    }
  }, [isSegmented, hasOverflow, hasNegative, minValue, maxValue]);

  const hasWarnedMissingLegendRef = useRef(false);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (
      !hasSegmentsToShow ||
      legendCountRef.current > 0 ||
      hasWarnedMissingLegendRef.current
    ) {
      return;
    }
    hasWarnedMissingLegendRef.current = true;
    console.warn(
      "Meter.Root: segments are told apart by color only. Add <Meter.Legend> so each segment shows its name and value."
    );
  }, [hasSegmentsToShow]);

  const contextValue: MeterContextValue = useMemo(
    () => ({ isSegmented, items, totalText, registerLegend }),
    [isSegmented, items, totalText, registerLegend]
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
