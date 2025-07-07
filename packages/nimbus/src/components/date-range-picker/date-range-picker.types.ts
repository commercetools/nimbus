import type { DateRangePickerRootProps } from "./date-range-picker.slots";
import type { RecipeVariantProps } from "@chakra-ui/react";
import { dateRangePickerSlotRecipe } from "./date-range-picker.recipe";
import type { DateRangePickerProps as ReactAriaDateRangePickerProps } from "react-aria-components";
import type { DateValue } from "react-aria";

/**
 * Additional properties we want to exclude from the DateRangePicker component.
 * These are either deprecated or not intended for use in this component.
 */
type ExcludedProps =
  // deprecated
  | "validationState"
  // handled by <FormField> component
  | "label"
  | "description"
  | "errorMessage"
  // chakra-ui props we don't want exposed
  | "css"
  | "colorScheme"
  | "unstyled"
  | "recipe"
  | "as"
  | "asChild";

/**
 * Main props interface for the DateRangePicker component.
 * Extends React Aria DateRangePicker props and adds recipe variants.
 */
export interface DateRangePickerProps
  extends Omit<ReactAriaDateRangePickerProps<DateValue>, ExcludedProps>,
    RecipeVariantProps<typeof dateRangePickerSlotRecipe> {
  /**
   * Whether the calendar popover should be open by default (uncontrolled).
   */
  defaultOpen?: boolean;

  /**
   * Whether the calendar popover is open (controlled).
   */
  isOpen?: boolean;

  /**
   * Handler that is called when the calendar popover's open state changes.
   */
  onOpenChange?: (isOpen: boolean) => void;
}
