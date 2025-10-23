import {
  DateInputLeadingElementSlot,
  DateInputRootSlot,
  DateInputSegmentGroupSlot,
  DateInputSegmentSlot,
  DateInputTrailingElementSlot,
} from "./date-input.slots";

import {
  DateField,
  DateInput as DateInputField,
  DateSegment,
} from "react-aria-components";
import { useRecipe } from "@chakra-ui/react/styled-system";
import { dateInputSlotRecipe } from "./date-input.recipe";
import type { DateInputProps } from "./date-input.types";
import { extractStyleProps } from "@/utils";

/**
 * # DateInput
 *
 * allows entering a date
 *
 * @see {@link https://nimbus-documentation.vercel.app/components/inputs/dateinput}
 */
export const DateInput = (props: DateInputProps) => {
  const recipe = useRecipe({ recipe: dateInputSlotRecipe });
  const { leadingElement, trailingElement, ...rest } = props;
  const [recipeProps, recipeFreeProps] = recipe.splitVariantProps({ ...rest });
  const [styleProps, functionalProps] = extractStyleProps(recipeFreeProps);

  return (
    <DateInputRootSlot {...recipeProps} {...styleProps} asChild>
      <DateField {...functionalProps}>
        <>
          {leadingElement && (
            <DateInputLeadingElementSlot>
              {leadingElement}
            </DateInputLeadingElementSlot>
          )}
          <DateInputSegmentGroupSlot asChild>
            <DateInputField>
              {(segment) => (
                <DateInputSegmentSlot asChild>
                  <DateSegment segment={segment} />
                </DateInputSegmentSlot>
              )}
            </DateInputField>
          </DateInputSegmentGroupSlot>
          {trailingElement && (
            <DateInputTrailingElementSlot>
              {trailingElement}
            </DateInputTrailingElementSlot>
          )}
        </>
      </DateField>
    </DateInputRootSlot>
  );
};

DateInput.displayName = "DateInput";
