import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react";

import { dateRangePickerSlotRecipe } from "./date-range-picker.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface DateRangePickerRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DateRangePickerRootProps
  extends HTMLChakraProps<"div", DateRangePickerRecipeProps> {}

// Correctly destructure from createSlotRecipeContext based on project examples
const { withProvider, withContext } = createSlotRecipeContext({
  recipe: dateRangePickerSlotRecipe,
});

/**
 * Root component that provides the styling context for the DateRangePicker component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const DateRangePickerRootSlot = withProvider<
  HTMLDivElement,
  DateRangePickerRootProps
>("div", "root");

/**
 * Slot component for the input group containing the DateInput and trigger button.
 */
export const DateRangePickerGroupSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "group");

/**
 * Slot component for the trigger button that opens the calendar popover.
 */
export const DateRangePickerTriggerSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "trigger");

/**
 * Slot component for the popover container.
 */
export const DateRangePickerPopoverSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "popover");

/**
 * Slot component for the calendar container within the popover.
 */
export const DateRangePickerCalendarSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "calendar");

/**
 * Slot component for the calendar header.
 */
export const DateRangePickerCalendarHeaderSlot = withContext<
  HTMLElement,
  HTMLChakraProps<"header">
>("header", "calendarHeader");

/**
 * Slot component for the calendar grid.
 */
export const DateRangePickerCalendarGridSlot = withContext<
  HTMLTableElement,
  HTMLChakraProps<"table">
>("table", "calendarGrid");

/**
 * Slot component for individual calendar cells.
 */
export const DateRangePickerCalendarCellSlot = withContext<
  HTMLTableCellElement,
  HTMLChakraProps<"td">
>("td", "calendarCell");
