import type { DateValue } from "@internationalized/date";
import type { CalendarProps as AriaCalendarProps } from "react-aria-components";
import type { RecipeVariantProps } from "@chakra-ui/react";
import type { calendarSlotRecipe } from "./calendar.recipe";

/**
 * Additional properties we want to exclude from the TimeInput component.
 * These are either deprecated or not intended for use in this component.
 */
type ExcludedProps = "as" | "asChild" | "style" | "createCalendar";

export interface CalendarProps<T extends DateValue>
  extends Omit<AriaCalendarProps<T>, ExcludedProps>,
    RecipeVariantProps<typeof calendarSlotRecipe> {}
