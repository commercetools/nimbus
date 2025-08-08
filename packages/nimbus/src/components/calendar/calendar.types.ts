import type { DateValue } from "@internationalized/date";
import type { CalendarProps as AriaCalendarProps } from "react-aria-components";
import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import type { calendarSlotRecipe } from "./calendar.recipe";
import type { CalendarRootSlotProps } from "./calendar.slots";

/**
 * Additional properties we want to exclude from the TimeInput component.
 * These are either deprecated or not intended for use in this component.
 */
type ExcludedProps = "as" | "asChild" | "style" | "createCalendar";

export interface CalendarProps<T extends DateValue>
  extends Omit<
      CalendarRootSlotProps,
      keyof AriaCalendarProps<DateValue> | ExcludedProps
    >,
    Omit<AriaCalendarProps<T>, ExcludedProps>,
    RecipeVariantProps<typeof calendarSlotRecipe> {}
