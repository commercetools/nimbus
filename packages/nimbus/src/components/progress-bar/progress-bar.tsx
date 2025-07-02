import { useRef } from "react";
import {
  ProgressBar as RaProgressBar,
  Label as RaLabel,
} from "react-aria-components";
import { useNumberFormatter, useObjectRef } from "react-aria";
import { mergeRefs, useSlotRecipe } from "@chakra-ui/react";
import { Flex, Box } from "@commercetools/nimbus";
import {
  ProgressBarRootSlot,
  ProgressBarTrackSlot,
  ProgressBarFillSlot,
  ProgressBarTextSlot,
  ProgressBarLabelSlot,
  ProgressBarValueSlot,
} from "./progress-bar.slots";
import type { ProgressBarProps } from "./progress-bar.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * ProgressBar
 * ============================================================
 * Displays progress towards completion of a task or process
 *
 * Features:
 *
 * - Supports both determinate (with value) and indeterminate (loading) states
 * - Two visual variants: solid (gradient) and contrast (monochromatic)
 * - Three text display layouts: plain, inline, and stacked
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
    variant = "solid",
    layout = "stacked",
    colorPalette = "primary",
    ...rest
  } = props;

  const recipe = useSlotRecipe({ key: "progressBar" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <ProgressBarRootSlot
      {...recipeProps}
      {...styleProps}
      {...recipeProps}
      asChild
    >
      <RaProgressBar
        ref={ref}
        value={value}
        minValue={minValue}
        maxValue={maxValue}
        isIndeterminate={isIndeterminate}
        aria-label={label}
        {...rest}
      >
        {({ percentage, valueText }) => (
          <>
            {layout === "stacked" && (
              <Flex>
                {label && (
                  <Box>
                    <ProgressBarLabelSlot asChild>
                      <RaLabel>{label}</RaLabel>
                    </ProgressBarLabelSlot>
                  </Box>
                )}
                <Box flexGrow="1" />
                {value && (
                  <Box>
                    <ProgressBarValueSlot>{valueText}</ProgressBarValueSlot>
                  </Box>
                )}
              </Flex>
            )}

            {layout === "inline" && label && (
              <Box>
                <ProgressBarLabelSlot asChild>
                  <RaLabel>{label}</RaLabel>
                </ProgressBarLabelSlot>
              </Box>
            )}

            <ProgressBarTrackSlot>
              <ProgressBarFillSlot
                style={{ width: isIndeterminate ? "40%" : `${percentage}%` }}
                data-indeterminate={isIndeterminate}
                data-complete={
                  !isIndeterminate &&
                  percentage !== undefined &&
                  percentage >= 100
                }
              />
            </ProgressBarTrackSlot>

            {layout === "inline" && value && (
              <Box>
                <ProgressBarValueSlot>{valueText}</ProgressBarValueSlot>
              </Box>
            )}
          </>
        )}
      </RaProgressBar>
    </ProgressBarRootSlot>
  );
};

ProgressBar.displayName = "ProgressBar";
