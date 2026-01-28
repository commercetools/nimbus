import type {
  HTMLChakraProps,
  UnstyledProp,
  ConditionalValue,
} from "@chakra-ui/react";
import type { DateValue } from "react-aria";
import type { DateRangePickerProps as RaDateRangePickerProps } from "react-aria-components";
import type {
  DateRangePickerSize,
  DateRangePickerVariant,
} from "./date-range-picker.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

type DateRangePickerRecipeProps = {
  /**
   * Size variant of the date range picker
   * @default "md"
   */
  size?: ConditionalValue<DateRangePickerSize | undefined>;
  /**
   * Visual style variant of the date range picker
   * @default "solid"
   */
  variant?: ConditionalValue<DateRangePickerVariant | undefined>;
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type DateRangePickerRootSlotProps = HTMLChakraProps<
  "div",
  DateRangePickerRecipeProps
>;

// ============================================================
// HELPER TYPES
// ============================================================

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
  | "asChild";

// ============================================================
// MAIN PROPS
// ============================================================

export type DateRangePickerProps = Omit<
  DateRangePickerRootSlotProps,
  keyof RaDateRangePickerProps<DateValue> | ExcludedProps
> &
  Omit<RaDateRangePickerProps<DateValue>, ExcludedProps> & {
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
