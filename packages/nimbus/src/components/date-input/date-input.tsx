import {
  DateInputRootSlot,
  DateInputSegmentGroupSlot,
  DateInputSegmentSlot,
} from "./date-input.slots";

import {
  DateField,
  DateInput as DateInputField,
  DateSegment,
} from "react-aria-components";
import { useRecipe } from "@chakra-ui/react";
import { dateInputRecipe } from "./date-input.recipe";
import type { DateInputProps } from "./date-input.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * DateInput
 * ============================================================
 * allows entering a date in the currently selected locale
 */
export const DateInput = (props: DateInputProps) => {
  const recipe = useRecipe({ recipe: dateInputRecipe });
  const [recipeProps, remainingProps] = recipe.splitVariantProps(props);
  const [styleProps, otherProps] = extractStyleProps(remainingProps);

  return (
    <DateInputRootSlot asChild {...recipeProps} {...styleProps}>
      <DateField {...otherProps}>
        <DateInputSegmentGroupSlot asChild>
          <DateInputField>
            {(segment) => (
              <DateInputSegmentSlot asChild>
                <DateSegment segment={segment} />
              </DateInputSegmentSlot>
            )}
          </DateInputField>
        </DateInputSegmentGroupSlot>
      </DateField>
    </DateInputRootSlot>
  );
};

DateInput.displayName = "DateInput";
