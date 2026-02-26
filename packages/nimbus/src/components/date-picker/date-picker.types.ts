import type { DateInputProps } from "../date-input/date-input.types";
import type { DatePickerStateOptions } from "react-stately";
import type { DateValue } from "react-aria";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { OmitInternalProps } from "../../type-utils/omit-props";

// ============================================================
// RECIPE PROPS
// ============================================================

type DatePickerRecipeProps = {
  /**
   * Size variant of the date picker
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusDatePicker">["size"];
  /** Visual style variant of the date picker */
  variant?: SlotRecipeProps<"nimbusDatePicker">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type DatePickerRootSlotProps = Omit<
  HTMLChakraProps<"div", DatePickerRecipeProps>,
  "onChange" | "value" | "defaultValue"
>;

// ============================================================
// HELPER TYPES
// ============================================================

type ConflictingPickerStateProps = keyof DatePickerStateOptions<DateValue>;

type ExcludedProps =
  | "validationState"
  | "label"
  | "description"
  | "errorMessage"
  | "css"
  | "colorScheme"
  | "unstyled"
  | "recipe"
  | "as"
  | "asChild"
  | "variant";

// ============================================================
// MAIN PROPS
// ============================================================

export type DatePickerProps = OmitInternalProps<DatePickerRootSlotProps> &
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
