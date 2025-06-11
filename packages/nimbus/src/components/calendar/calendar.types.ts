import type { DateValue } from "@internationalized/date";
import type { CalendarProps as AriaCalendarProps } from "react-aria-components";
import type { RecipeVariantProps } from "@chakra-ui/react";
import type { calendarSlotRecipe } from "./calendar.styles";

export interface CalendarProps<T extends DateValue>
  extends AriaCalendarProps<T>,
    RecipeVariantProps<typeof calendarSlotRecipe> {}
