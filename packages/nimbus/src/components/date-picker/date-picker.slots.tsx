import {
  type HTMLChakraProps,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";
import type { DatePickerRootSlotProps } from "./date-picker.types";

// Correctly destructure from createSlotRecipeContext based on project examples
const { withProvider, withContext } = createSlotRecipeContext({
  key: "nimbusDatePicker",
});

/**
 * Root component that provides the styling context for the DatePicker component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const DatePickerRootSlot = withProvider<
  HTMLDivElement,
  DatePickerRootSlotProps
>("div", "root");

/**
 * Slot component for the input group containing the DateInput.
 */
export const DatePickerGroupSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "group");

/**
 * Slot component for the popover container.
 */
export const DatePickerPopoverSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "popover");

/**
 * Slot component for the calendar container within the popover.
 */
export const DatePickerCalendarSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "calendar");

/**
 * Slot component for the calendar header.
 */
export const DatePickerCalendarHeaderSlot = withContext<
  HTMLElement,
  HTMLChakraProps<"header">
>("header", "calendarHeader");

/**
 * Slot component for the calendar grid.
 */
export const DatePickerCalendarGridSlot = withContext<
  HTMLTableElement,
  HTMLChakraProps<"table">
>("table", "calendarGrid");

/**
 * Slot component for individual calendar cells.
 */
export const DatePickerCalendarCellSlot = withContext<
  HTMLTableCellElement,
  HTMLChakraProps<"td">
>("td", "calendarCell");
