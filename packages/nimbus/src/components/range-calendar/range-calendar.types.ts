import type { DateValue } from "@internationalized/date";
import type { RangeCalendarProps as AriaRangeCalendarProps } from "react-aria-components";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

type RangeCalendarRecipeProps = SlotRecipeProps<"rangeCalendar">;

export type RangeCalendarRootSlotProps = HTMLChakraProps<
  "div",
  RangeCalendarRecipeProps & AriaRangeCalendarProps<DateValue>
>;

export type RangeCalendarHeaderSlotProps = HTMLChakraProps<"div">;

export type RangeCalendarGridsSlotProps = HTMLChakraProps<"div">;

export type RangeCalendarMonthTitleSlotProps = HTMLChakraProps<"div">;

export type RangeCalendarGridSlotProps = HTMLChakraProps<"table">;

export type RangeCalendarGridHeaderSlotProps = HTMLChakraProps<"thead">;

export type RangeCalendarHeaderCellSlotProps = HTMLChakraProps<"th">;

export type RangeCalendarGridBodySlotProps = HTMLChakraProps<"tbody">;

export type RangeCalendarCellSlotProps = HTMLChakraProps<"td">;

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

export type RangeCalendarProps<T extends DateValue> = Omit<
  RangeCalendarRootSlotProps,
  keyof AriaRangeCalendarProps<DateValue> | ExcludedProps
> &
  Omit<AriaRangeCalendarProps<T>, ExcludedProps> &
  SlotRecipeProps<"rangeCalendar">;
