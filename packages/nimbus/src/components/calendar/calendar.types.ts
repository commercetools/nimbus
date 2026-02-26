import type { DateValue } from "@internationalized/date";
import type { CalendarProps as RaCalendarProps } from "react-aria-components";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

/**
 * Recipe props for Calendar styling variants
 */
type CalendarRecipeProps = SlotRecipeProps<"nimbusCalendar">;

// ============================================================
// SLOT PROPS
// ============================================================

/**
 * Slot props for the Calendar root container element
 */
export type CalendarRootSlotProps = HTMLChakraProps<"div", CalendarRecipeProps>;

/**
 * Slot props for the Calendar header element containing navigation controls
 */
export type CalendarHeaderSlotProps = HTMLChakraProps<"div">;

/**
 * Slot props for the container holding calendar grid(s)
 */
export type CalendarGridsSlotProps = HTMLChakraProps<"div">;

/**
 * Slot props for month title display above each grid
 */
export type CalendarMonthTitleSlotProps = HTMLChakraProps<"div">;

/**
 * Slot props for a single calendar grid table element
 */
export type CalendarGridSlotProps = HTMLChakraProps<"table">;

/**
 * Slot props for calendar grid header (weekday row)
 */
export type CalendarGridHeaderSlotProps = HTMLChakraProps<"thead">;

/**
 * Slot props for individual header cells (weekday labels)
 */
export type CalendarHeaderCellSlotProps = HTMLChakraProps<"th">;

/**
 * Slot props for calendar grid body containing date cells
 */
export type CalendarGridBodySlotProps = HTMLChakraProps<"tbody">;

/**
 * Slot props for individual date cells in the calendar grid
 */
export type CalendarCellSlotProps = HTMLChakraProps<"td">;

// ============================================================
// HELPER TYPES
// ============================================================

/**
 * Props excluded from the Calendar component API
 */
type ExcludedProps = "style" | "createCalendar";

// ============================================================
// MAIN PROPS
// ============================================================

/**
 * Props for the Calendar component.
 * Combines Calendar root slot props with React Aria Calendar props.
 *
 * @template T - Date value type from @internationalized/date
 */
export type CalendarProps<T extends DateValue> = OmitInternalProps<
  CalendarRootSlotProps,
  keyof RaCalendarProps<DateValue> | ExcludedProps
> &
  Omit<RaCalendarProps<T>, ExcludedProps>;
