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
              {(segment) =>
                segment.type === "literal" ? (
                  // Literal segments (date separators, the space before AM/PM)
                  // are produced by Intl/ICU, whose whitespace can differ
                  // between the SSR runtime and the browser (e.g. U+202F vs
                  // U+0020), causing a text hydration mismatch. They are
                  // non-interactive, so render them directly with
                  // suppressHydrationWarning and let React ignore the harmless
                  // whitespace difference. React Aria's DateSegment strips
                  // suppressHydrationWarning via filterDOMProps, so it cannot be
                  // used for this.
                  <DateInputSegmentSlot asChild>
                    <span
                      data-type="literal"
                      aria-hidden={true}
                      suppressHydrationWarning
                    >
                      {segment.text}
                    </span>
                  </DateInputSegmentSlot>
                ) : (
                  <DateInputSegmentSlot asChild>
                    <DateSegment segment={segment} />
                  </DateInputSegmentSlot>
                )
              }
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
