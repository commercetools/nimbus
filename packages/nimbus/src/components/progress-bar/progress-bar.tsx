import { useRef } from "react";
import {
  ProgressBar as RaProgressBar,
  Label as RaLabel,
} from "react-aria-components";
import { useObjectRef } from "react-aria";
import { mergeRefs } from "@chakra-ui/react";
import { useSlotRecipe } from "@chakra-ui/react/styled-system";
import { Flex, Box } from "@/components";
import {
  ProgressBarRootSlot,
  ProgressBarTrackSlot,
  ProgressBarFillSlot,
  ProgressBarLabelSlot,
  ProgressBarValueSlot,
} from "./progress-bar.slots";
import type { ProgressBarProps } from "./progress-bar.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * Displays progress towards completion of a task or process.
 */
export const ProgressBar = (props: ProgressBarProps) => {
  const {
    ref: forwardedRef,
    value,
    minValue = 0,
    maxValue = 100,
    isDynamic = true,
    isIndeterminate,
    label,
    formatOptions = { style: "percent" },
    variant = "solid",
    layout = "stacked",
    colorPalette = "primary",
    ...rest
  } = props;

  const recipe = useSlotRecipe({ key: "progressBar" });
  const [recipeProps, remainingProps] = recipe.splitVariantProps({
    variant,
    colorPalette,
    ...props,
  });
  const [styleProps] = extractStyleProps(remainingProps);

  const localRef = useRef<HTMLDivElement>(null);
  const ref = useObjectRef(mergeRefs(localRef, forwardedRef));

  return (
    <ProgressBarRootSlot
      {...recipeProps}
      {...styleProps}
      {...recipeProps}
      isDynamic={isDynamic}
      isIndeterminate={isIndeterminate}
      asChild
    >
      <RaProgressBar
        ref={ref}
        value={value}
        minValue={minValue}
        maxValue={maxValue}
        isIndeterminate={isIndeterminate}
        formatOptions={formatOptions}
        {...rest}
      >
        {({ percentage, valueText }) => (
          <>
            {layout === "stacked" && (
              <Flex>
                {label && (
                  <ProgressBarLabelSlot asChild>
                    <RaLabel>{label}</RaLabel>
                  </ProgressBarLabelSlot>
                )}
                <Box flexGrow="1" />
                {label && value && (
                  <ProgressBarValueSlot>{valueText}</ProgressBarValueSlot>
                )}
              </Flex>
            )}

            {layout === "inline" && label && (
              <ProgressBarLabelSlot lineHeight="1" asChild>
                <RaLabel>{label}</RaLabel>
              </ProgressBarLabelSlot>
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
              <ProgressBarValueSlot lineHeight="1">
                {valueText}
              </ProgressBarValueSlot>
            )}
          </>
        )}
      </RaProgressBar>
    </ProgressBarRootSlot>
  );
};

ProgressBar.displayName = "ProgressBar";
