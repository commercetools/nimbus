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
import { extractStyleProps } from "@/utils";
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
            {(segment) =>
              segment.type === "literal" ? (
                // Literal segments (e.g. the separator before AM/PM) are
                // produced by Intl/ICU, whose whitespace can differ between the
                // SSR runtime and the browser (e.g. U+202F vs U+0020), causing a
                // text hydration mismatch. They are non-interactive, so render
                // them directly with suppressHydrationWarning and let React
                // ignore the harmless whitespace difference. React Aria's
                // DateSegment strips suppressHydrationWarning via filterDOMProps,
                // so it cannot be used for this.
                <TimeInputSegmentSlot asChild>
                  <span
                    data-type="literal"
                    aria-hidden={true}
                    suppressHydrationWarning
                  >
                    {segment.text}
                  </span>
                </TimeInputSegmentSlot>
              ) : (
                <TimeInputSegmentSlot asChild>
                  <DateSegment segment={segment} />
                </TimeInputSegmentSlot>
              )
            }
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
