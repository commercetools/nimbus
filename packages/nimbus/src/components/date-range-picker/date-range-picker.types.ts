import type { DateRangePickerProps as ReactAriaDateRangePickerProps } from "react-aria-components";
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
type DateRangePickerRecipeProps = {
  size?: SlotRecipeProps<"dateRangePicker">["size"];
  variant?: SlotRecipeProps<"dateRangePicker">["variant"];
} & UnstyledProp;

/**
 * Root props interface that extends Chakra's HTML props with our recipe props.
 * This creates a complete set of props for the root element, combining
 * HTML attributes, Chakra's styling system, and our custom recipe props.
 */
export type DateRangePickerRootProps = HTMLChakraProps<
  "div",
  DateRangePickerRecipeProps
>;

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
 *
 * We extend React Aria's DateRangePickerProps and add the size/variant props
 * that we want to pass through to the DateInput components.
 */
export type DateRangePickerProps = Omit<
  DateRangePickerRootProps,
  keyof ReactAriaDateRangePickerProps<DateValue> | ExcludedProps
> &
  Omit<ReactAriaDateRangePickerProps<DateValue>, ExcludedProps> & {
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
     * This prop is forwarded to both the main date inputs and footer time inputs.
     */
    hideTimeZone?: boolean;
  };

/**
 * Props for the DateRangePickerTimeInput component.
 */
export type DateRangePickerTimeInputProps = {
  hideTimeZone?: boolean;
  hourCycle?: 12 | 24;
};
