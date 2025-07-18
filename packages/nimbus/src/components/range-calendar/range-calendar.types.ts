import type { DateValue } from "@internationalized/date";
import type { RangeCalendarProps as AriaRangeCalendarProps } from "react-aria-components";
import type { RecipeVariantProps } from "@chakra-ui/react";
import type { rangeCalendarSlotRecipe } from "./range-calendar.recipe";
import type { RangeCalendarRootSlotProps } from "./range-calendar.slots";

/**
 * Range value type for date ranges
 */
export type RangeValue<T> = {
  start: T;
  end: T;
};

/**
 * Additional properties we want to exclude from the RangeCalendar component.
 * These are either deprecated or not intended for use in this component.
 */
type ExcludedProps = "as" | "style" | "createCalendar";

export interface RangeCalendarProps<T extends DateValue>
  extends Omit<
      RangeCalendarRootSlotProps,
      keyof AriaRangeCalendarProps<DateValue> | ExcludedProps
    >,
    Omit<AriaRangeCalendarProps<T>, ExcludedProps>,
    RecipeVariantProps<typeof rangeCalendarSlotRecipe> {}
