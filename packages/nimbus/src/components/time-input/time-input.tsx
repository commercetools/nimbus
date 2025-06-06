import {
  TimeInputRootSlot,
  TimeInputSegmentGroupSlot,
  TimeInputSegmentSlot,
} from "./time-input.slots";

import { TimeField, DateInput, DateSegment } from "react-aria-components";
import { useRecipe } from "@chakra-ui/react";
import { timeInputRecipe } from "./time-input.recipe";
import type { TimeInputProps } from "./time-input.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * TimeInput
 * ============================================================
 * allows entering a time in the currently selected locale
 */
export const TimeInput = (props: TimeInputProps) => {
  const recipe = useRecipe({ recipe: timeInputRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  return (
    <TimeInputRootSlot asChild {...recipeProps} {...styleProps}>
      <TimeField {...otherProps}>
        <TimeInputSegmentGroupSlot asChild>
          <DateInput>
            {(segment) => (
              <TimeInputSegmentSlot asChild>
                <DateSegment segment={segment} />
              </TimeInputSegmentSlot>
            )}
          </DateInput>
        </TimeInputSegmentGroupSlot>
      </TimeField>
    </TimeInputRootSlot>
  );
};

TimeInput.displayName = "TimeInput";
