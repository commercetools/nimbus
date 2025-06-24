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
import { dateInputSlotRecipe } from "./date-input.recipe";
import type { DateInputProps } from "./date-input.types";
import { extractStyleProps } from "@/utils/extractStyleProps";

/**
 * DateInput
 * ============================================================
 * allows entering a date in the currently selected locale
 */
export const DateInput = (props: DateInputProps) => {
  const recipe = useRecipe({ recipe: dateInputSlotRecipe });
  const [recipeProps, recipeFreeProps] = recipe.splitVariantProps(props);
  const [styleProps, functionalProps] = extractStyleProps(recipeFreeProps);

  return (
    <DateInputRootSlot {...recipeProps} {...styleProps} asChild>
      <DateField {...functionalProps}>
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
