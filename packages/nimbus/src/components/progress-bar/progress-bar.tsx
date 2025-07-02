import { useRef } from "react";
import {
  ProgressBar as AriaProgressBar,
  Label as AriaLabel,
} from "react-aria-components";
import { useNumberFormatter, useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import {
  ProgressBarRootSlot,
  ProgressBarTrackSlot,
  ProgressBarFillSlot,
  ProgressBarTextSlot,
  ProgressBarLabelSlot,
  ProgressBarValueSlot,
} from "./progress-bar.slots";
import type { ProgressBarProps } from "./progress-bar.types";

/**
 * ProgressBar
 * ============================================================
 * Displays progress towards completion of a task or process
 *
 * Features:
 *
 * - Supports both determinate (with value) and indeterminate (loading) states
 * - Three text display variants: hidden, inline, and stacked
 * - Configurable value formatting with internationalization support
 * - Full accessibility support with ARIA attributes
 * - Allows forwarding refs to the underlying DOM element
 * - Accepts all native HTML div attributes
 * - Supports variants, sizes, etc. configured in the recipe
 * - Allows overriding styles by using style-props
 */
export const ProgressBar = (props: ProgressBarProps) => {
  const {
    ref: forwardedRef,
    value,
    minValue = 0,
    maxValue = 100,
    isIndeterminate,
    label,
    formatOptions = { style: "percent" },
    variant = "stacked",
    colorPalette = "primary",
    ...rest
  } = props;

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  // Format the value for display
  const formatter = useNumberFormatter(formatOptions);

  const renderTextContent = (
    percentage: number = 0,
    valueText: string = ""
  ) => {
    if (variant === "hidden") return null;

    // Use our custom formatter if formatOptions were provided, otherwise use valueText
    const displayValue =
      formatOptions && value !== undefined
        ? formatter.format((value - minValue) / (maxValue - minValue))
        : valueText;

    return (
      <ProgressBarTextSlot>
        {label && <ProgressBarLabelSlot>{label}</ProgressBarLabelSlot>}
        {value !== undefined && (
          <ProgressBarValueSlot>{displayValue}</ProgressBarValueSlot>
        )}
      </ProgressBarTextSlot>
    );
  };

  return (
    <AriaProgressBar
      value={value}
      minValue={minValue}
      maxValue={maxValue}
      isIndeterminate={isIndeterminate}
      aria-label={label}
      {...rest}
    >
      {({ percentage, valueText }) => (
        <ProgressBarRootSlot
          ref={ref}
          colorPalette={colorPalette}
          variant={variant}
        >
          {variant === "stacked" && renderTextContent(percentage, valueText)}

          {variant === "inline" && renderTextContent(percentage, valueText)}

          <ProgressBarTrackSlot>
            <ProgressBarFillSlot
              style={{ width: isIndeterminate ? "40%" : `${percentage}%` }}
              data-indeterminate={isIndeterminate}
            />
          </ProgressBarTrackSlot>

          {variant === "hidden" && renderTextContent(percentage, valueText)}
        </ProgressBarRootSlot>
      )}
    </AriaProgressBar>
  );
};

ProgressBar.displayName = "ProgressBar";
