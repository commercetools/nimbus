import { useEffect, useMemo } from "react";
import { Meter as RaMeter, Label as RaLabel } from "react-aria-components";
import { useLocale, useNumberFormatter, useObjectRef } from "react-aria";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { extractStyleProps } from "@/utils";
import {
  MeterRootSlot,
  MeterHeaderSlot,
  MeterLabelSlot,
  MeterValueSlot,
  MeterTrackSlot,
  MeterSegmentSlot,
  MeterLegendSlot,
  MeterLegendItemSlot,
  MeterLegendSwatchSlot,
} from "./meter.slots";
import { METER_SEGMENT_PALETTES } from "./constants";
import { getMeterSegments } from "./utils";
import type { MeterProps, MeterSegment } from "./meter.types";

/**
 * Meter
 * ============================================================
 * Displays a measured value within a known range, such as storage used or
 * a quota consumed. Use ProgressBar instead to show progress of a task.
 *
 * Features:
 *
 * - Single value, or several segments of one total inside one track
 * - Automatic legend for segments
 * - One `role="meter"` with a generated, localized summary for assistive tech
 * - Three layouts: minimal, inline, and stacked
 * - Configurable value formatting with internationalization support
 * - Allows forwarding refs to the underlying DOM element
 * - Supports variants, sizes, etc. configured in the recipe
 * - Allows overriding styles by using style-props
 * @supportsStyleProps
 */
export const Meter = (props: MeterProps) => {
  const {
    ref: forwardedRef,
    value = 0,
    segments,
    minValue = 0,
    maxValue = 100,
    label,
    formatOptions = { style: "percent" },
    valueLabel,
    colorPalette = "primary",
    layout = "stacked",
    ...rest
  } = props;

  const recipe = useSlotRecipe({ key: "nimbusMeter" });
  const [recipeProps, restWithoutRecipeProps] = recipe.splitVariantProps({
    layout,
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
  // A single value is drawn as one segment, so there is one render path
  const source: MeterSegment[] = isSegmented
    ? segments
    : [{ id: "value", label: "", value: value - minValue }];
  const { items, total, hasOverflow, hasNegative } = getMeterSegments(
    source,
    minValue,
    maxValue
  );
  const meterValue = minValue + total;

  const range = maxValue - minValue;
  const isPercent = formatOptions.style === "percent";
  /** Formats an amount counted from `minValue` */
  const formatAmount = (amount: number) =>
    formatter.format(isPercent ? (range > 0 ? amount / range : 0) : amount);

  const totalText =
    valueLabel ??
    (isPercent ? formatAmount(total) : formatter.format(meterValue));
  const valueText =
    isSegmented && items.length > 0
      ? `${totalText} (${listFormatter.format(
          items.map((item) => `${item.label}: ${formatAmount(item.value)}`)
        )})`
      : totalText;

  useEffect(() => {
    if (process.env.NODE_ENV === "production" || !isSegmented) return;
    if (hasOverflow) {
      console.warn(
        `Meter: the sum of segment values exceeds the range (${minValue} to ${maxValue}). Segments are cut at maxValue.`
      );
    }
    if (hasNegative) {
      console.warn(
        "Meter: segment values must not be negative. Negative values are treated as 0."
      );
    }
  }, [isSegmented, hasOverflow, hasNegative, minValue, maxValue]);

  const paletteOf = (segment: MeterSegment, index: number) =>
    isSegmented
      ? (segment.colorPalette ??
        METER_SEGMENT_PALETTES[index % METER_SEGMENT_PALETTES.length])
      : undefined;

  const labelElement = label ? (
    <MeterLabelSlot asChild>
      <RaLabel>{label}</RaLabel>
    </MeterLabelSlot>
  ) : null;
  const valueElement = <MeterValueSlot>{totalText}</MeterValueSlot>;

  return (
    <MeterRootSlot
      {...recipeProps}
      {...styleProps}
      colorPalette={colorPalette}
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
        {layout === "inline" ? (
          labelElement
        ) : (
          <MeterHeaderSlot>
            {labelElement}
            {valueElement}
          </MeterHeaderSlot>
        )}

        <MeterTrackSlot>
          {items.map((item, index) =>
            item.widthPercent > 0 ? (
              <MeterSegmentSlot
                key={item.id}
                colorPalette={paletteOf(item, index)}
                style={{ width: `${item.widthPercent}%` }}
              />
            ) : null
          )}
        </MeterTrackSlot>

        {layout === "inline" && valueElement}

        {isSegmented && items.length > 0 && (
          // Hidden from assistive tech: the meter's aria-valuetext already
          // announces the same information
          <MeterLegendSlot aria-hidden="true">
            {items.map((item, index) => (
              <MeterLegendItemSlot key={item.id}>
                <MeterLegendSwatchSlot colorPalette={paletteOf(item, index)} />
                <span>{item.label}</span>
                <span>{formatAmount(item.value)}</span>
              </MeterLegendItemSlot>
            ))}
          </MeterLegendSlot>
        )}
      </RaMeter>
    </MeterRootSlot>
  );
};

Meter.displayName = "Meter";
