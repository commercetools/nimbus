import { forwardRef } from "react";
import { useSlotRecipe } from "@chakra-ui/react";
import { Calendar as RaCalendar } from "react-aria-components";

import { calendarSlotRecipe } from "../calendar.styles";
import { CalendarRootSlot } from "../calendar.slots";
import type { CalendarProps } from "../calendar.types";
import { extractStyleProps } from "@/utils/extractStyleProps";
import type { DateValue } from "@internationalized/date";

export const CalendarRoot = forwardRef<
  HTMLDivElement,
  CalendarProps<DateValue>
>(({ children, ...props }, ref) => {
  const recipe = useSlotRecipe({ recipe: calendarSlotRecipe });
  const [recipeProps, restRecipeProps] = recipe.splitVariantProps(props);
  const [styleProps, restProps] = extractStyleProps(restRecipeProps);

  return (
    <CalendarRootSlot asChild ref={ref} {...recipeProps} {...styleProps}>
      <RaCalendar {...restProps}>{children}</RaCalendar>
    </CalendarRootSlot>
  );
});

CalendarRoot.displayName = "Calendar.Root";
