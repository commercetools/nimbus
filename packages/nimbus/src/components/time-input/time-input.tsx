import {
  TimeInputRootSlot,
  TimeInputLeadingElementSlot,
  TimeInputTrailingElementSlot,
  TimeInputSegmentGroupSlot,
  TimeInputSegmentSlot,
} from "./time-input.slots";

import { TimeField, DateInput, DateSegment } from "react-aria-components";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { timeInputRecipe } from "./time-input.recipe";
import type { TimeInputProps } from "./time-input.types";
import { extractStyleProps } from "@/utils/extract-style-props";
/**
 * TimeInput
 * ============================================================
 * allows entering a time in the currently selected locale
 */
export const TimeInput = (props: TimeInputProps) => {
  const recipe = useRecipe({ recipe: timeInputRecipe });
  const { leadingElement, trailingElement, ...rest } = props;
  const [recipeProps, remainingProps] = recipe.splitVariantProps({ ...rest });
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  return (
    <TimeInputRootSlot asChild {...recipeProps} {...styleProps}>
      <TimeField {...otherProps}>
        {leadingElement && (
          <TimeInputLeadingElementSlot>
            {leadingElement}
          </TimeInputLeadingElementSlot>
        )}
        <TimeInputSegmentGroupSlot asChild>
          <DateInput>
            {(segment) => (
              <TimeInputSegmentSlot asChild>
                <DateSegment segment={segment} />
              </TimeInputSegmentSlot>
            )}
          </DateInput>
        </TimeInputSegmentGroupSlot>
        {trailingElement && (
          <TimeInputTrailingElementSlot>
            {trailingElement}
          </TimeInputTrailingElementSlot>
        )}
      </TimeField>
    </TimeInputRootSlot>
  );
};

TimeInput.displayName = "TimeInput";
