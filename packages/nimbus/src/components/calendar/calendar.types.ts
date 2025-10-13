import type { DateValue } from "@internationalized/date";
import type { CalendarProps as AriaCalendarProps } from "react-aria-components";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

type CalendarRecipeProps = SlotRecipeProps<"calendar">;

export type CalendarRootSlotProps = HTMLChakraProps<"div", CalendarRecipeProps>;

export type CalendarHeaderSlotProps = HTMLChakraProps<"div">;
export type CalendarGridsSlotProps = HTMLChakraProps<"div">;
export type CalendarMonthTitleSlotProps = HTMLChakraProps<"div">;
export type CalendarGridSlotProps = HTMLChakraProps<"table">;
export type CalendarGridHeaderSlotProps = HTMLChakraProps<"thead">;
export type CalendarHeaderCellSlotProps = HTMLChakraProps<"th">;
export type CalendarGridBodySlotProps = HTMLChakraProps<"tbody">;
export type CalendarCellSlotProps = HTMLChakraProps<"td">;

/**
 * Additional properties we want to exclude from the TimeInput component.
 * These are either deprecated or not intended for use in this component.
 */
type ExcludedProps = "as" | "asChild" | "style" | "createCalendar";

export type CalendarProps<T extends DateValue> = Omit<
  CalendarRootSlotProps,
  keyof AriaCalendarProps<DateValue> | ExcludedProps
> &
  Omit<AriaCalendarProps<T>, ExcludedProps>;
