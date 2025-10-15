import type { DateValue } from "@internationalized/date";
import type { CalendarProps as RaCalendarProps } from "react-aria-components";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type CalendarRecipeProps = SlotRecipeProps<"calendar">;

// ============================================================
// SLOT PROPS
// ============================================================

export type CalendarRootSlotProps = HTMLChakraProps<"div", CalendarRecipeProps>;

export type CalendarHeaderSlotProps = HTMLChakraProps<"div">;
export type CalendarGridsSlotProps = HTMLChakraProps<"div">;
export type CalendarMonthTitleSlotProps = HTMLChakraProps<"div">;
export type CalendarGridSlotProps = HTMLChakraProps<"table">;
export type CalendarGridHeaderSlotProps = HTMLChakraProps<"thead">;
export type CalendarHeaderCellSlotProps = HTMLChakraProps<"th">;
export type CalendarGridBodySlotProps = HTMLChakraProps<"tbody">;
export type CalendarCellSlotProps = HTMLChakraProps<"td">;

// ============================================================
// HELPER TYPES
// ============================================================

type ExcludedProps = "as" | "asChild" | "style" | "createCalendar";

// ============================================================
// MAIN PROPS
// ============================================================

export type CalendarProps<T extends DateValue> = Omit<
  CalendarRootSlotProps,
  keyof RaCalendarProps<DateValue> | ExcludedProps
> &
  Omit<RaCalendarProps<T>, ExcludedProps>;
