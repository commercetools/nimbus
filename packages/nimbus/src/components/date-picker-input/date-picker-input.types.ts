import type { DateInputProps } from "@/components/date-input";
import type { DatePickerStateOptions } from "react-stately";
import type { DateValue } from "react-aria";

/**
 * Properties from DatePickerStateOptions that would conflict with similarly named
 * properties in DateInputProps. We use this to prevent TypeScript interface
 * merging conflicts by prioritizing the DatePickerStateOptions implementation.
 */
type ConflictingPickerStateProps = keyof DatePickerStateOptions<DateValue>;

/**
 * Additional properties we want to exclude from the DatePickerInput component.
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
 * Main props interface for the DatePickerInput component.
 *
 * We use Omit to remove:
 * 1. Conflicting props from DateInputProps to avoid TypeScript errors
 * 2. Explicitly excluded props that we don't want users to access
 */
export interface DatePickerInputProps
  extends Omit<DateInputProps, ConflictingPickerStateProps | ExcludedProps>,
    Omit<DatePickerStateOptions<DateValue>, ExcludedProps> {
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
