import type { DateValue } from "@internationalized/date";
import type { RangeCalendarProps as RaRangeCalendarProps } from "react-aria-components";
import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type RangeCalendarRecipeProps = SlotRecipeProps<"rangeCalendar">;

// ============================================================
// SLOT PROPS
// ============================================================

export type RangeCalendarRootSlotProps = HTMLChakraProps<
  "div",
  RangeCalendarRecipeProps & RaRangeCalendarProps<DateValue>
>;

export type RangeCalendarHeaderSlotProps = HTMLChakraProps<"div">;

export type RangeCalendarGridsSlotProps = HTMLChakraProps<"div">;

export type RangeCalendarMonthTitleSlotProps = HTMLChakraProps<"div">;

export type RangeCalendarGridSlotProps = HTMLChakraProps<"table">;

export type RangeCalendarGridHeaderSlotProps = HTMLChakraProps<"thead">;

export type RangeCalendarHeaderCellSlotProps = HTMLChakraProps<"th">;

export type RangeCalendarGridBodySlotProps = HTMLChakraProps<"tbody">;

export type RangeCalendarCellSlotProps = HTMLChakraProps<"td">;

// ============================================================
// HELPER TYPES
// ============================================================

export type RangeValue<T> = {
  start: T;
  end: T;
};

type ExcludedProps = "as" | "style" | "createCalendar";

// ============================================================
// MAIN PROPS
// ============================================================

export type RangeCalendarProps<T extends DateValue> = Omit<
  RangeCalendarRootSlotProps,
  keyof RaRangeCalendarProps<DateValue> | ExcludedProps
> &
  Omit<RaRangeCalendarProps<T>, ExcludedProps> &
  SlotRecipeProps<"rangeCalendar">;
