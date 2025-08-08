import {
  type HTMLChakraProps,
  type RecipeProps,
  type UnstyledProp,
  createSlotRecipeContext,
} from "@chakra-ui/react/styled-system";

import { datePickerSlotRecipe } from "./date-picker.recipe";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
interface DatePickerRecipeProps extends RecipeProps<"div">, UnstyledProp {}

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DatePickerRootProps
  extends HTMLChakraProps<"div", DatePickerRecipeProps> {}

// Correctly destructure from createSlotRecipeContext based on project examples
const { withProvider, withContext } = createSlotRecipeContext({
  recipe: datePickerSlotRecipe,
});

/**
 * Root component that provides the styling context for the DatePicker component.
 * Uses Chakra UI's recipe context system for consistent styling across instances.
 */
export const DatePickerRootSlot = withProvider<
  HTMLDivElement,
  DatePickerRootProps
>("div", "root");

/**
 * Slot component for the input group containing the DateInput and trigger button.
 */
export const DatePickerGroupSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "group");

/**
 * Slot component for the trigger button that opens the calendar popover.
 */
export const DatePickerTriggerSlot = withContext<
  HTMLDivElement,
  HTMLChakraProps<"div">
>("div", "trigger");

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
