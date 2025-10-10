import type { DateInputProps } from "../date-input";
import type { DatePickerStateOptions } from "react-stately";
import type { DateValue } from "react-aria";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

/**
 * Base recipe props interface that combines Chakra UI's recipe props
 * with the unstyled prop option for the div element.
 */
type DatePickerRecipeProps = SlotRecipeProps<"datePicker"> & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 *
 * We exclude props that conflict with React Aria's DatePickerStateOptions:
 * - onChange: HTML's FormEventHandler vs React Aria's (value: DateValue | null) => void
 * - value/defaultValue: HTML's string[] vs React Aria's DateValue | null
 */
export type DatePickerRootProps = Omit<
  HTMLChakraProps<"div", DatePickerRecipeProps>,
  "onChange" | "value" | "defaultValue"
>;

/**
 * Properties from DatePickerStateOptions that would conflict with similarly named
 * properties in DateInputProps. We use this to prevent TypeScript interface
 * merging conflicts by prioritizing the DatePickerStateOptions implementation.
 */
type ConflictingPickerStateProps = keyof DatePickerStateOptions<DateValue>;

/**
 * Additional properties we want to exclude from the DatePicker component.
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
  | "asChild"
  // exclude variant to avoid conflict with recipe variant
  | "variant";

/**
 * Main props interface for the DatePicker component.
 *
 * We use Omit to remove:
 * 1. Conflicting props from DateInputProps to avoid TypeScript errors
 * 2. Explicitly excluded props that we don't want users to access
 */
export type DatePickerProps = DatePickerRootProps &
  Omit<DateInputProps, ConflictingPickerStateProps | ExcludedProps> &
  Omit<DatePickerStateOptions<DateValue>, ExcludedProps> & {
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

    /**
     * Whether to hide the time zone information when using ZonedDateTime values.
     * This prop is forwarded to both the main date input and footer time input.
     */
    hideTimeZone?: boolean;
  };

/**
 * Props for the DatePickerTimeInput component.
 */
export type DatePickerTimeInputProps = {
  hideTimeZone?: boolean;
  hourCycle?: 12 | 24;
};
