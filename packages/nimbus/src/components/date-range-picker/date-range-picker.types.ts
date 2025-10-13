import type { ReactNode } from "react";
import type { DateRangePickerRootProps } from "./date-range-picker.slots";
import type { RecipeVariantProps } from "@chakra-ui/react/styled-system";
import { dateRangePickerSlotRecipe } from "./date-range-picker.recipe";
import type { DateRangePickerProps as ReactAriaDateRangePickerProps } from "react-aria-components";
import type { DateValue } from "react-aria";

import type { TFieldErrors } from "../field-errors";

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
export interface DateRangePickerProps
  extends Omit<ReactAriaDateRangePickerProps<DateValue>, ExcludedProps>,
    Omit<
      DateRangePickerRootProps,
      keyof ReactAriaDateRangePickerProps<DateValue> | ExcludedProps
    >,
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

  /**
   * Whether to hide the time zone information when using ZonedDateTime values.
   * This prop is forwarded to both the main date inputs and footer time inputs.
   */
  hideTimeZone?: boolean;
}

/**
 * Props for the DateRangePickerTimeInput component.
 */
export interface DateRangePickerTimeInputProps {
  hideTimeZone?: boolean;
  hourCycle?: 12 | 24;
}

/**
 * Props for the DateRangePickerField component.
 *
 * Combines DateRangePicker functionality with form field features like labels,
 * descriptions, error handling, and validation feedback.
 */
export type DateRangePickerFieldProps = DateRangePickerProps & {
  // Field identification
  /**
   * Used as HTML id property. An id is auto-generated when it is not specified.
   */
  id?: string;
  /**
   * Used as HTML name of the input component.
   */
  name?: string;

  // Form field structure
  /**
   * Title of the label
   */
  label: string | ReactNode;

  /**
   * Provides a description for the field.
   * Appears below the input to provide additional context or instructions.
   */
  description?: string | ReactNode;

  /**
   * Info content that appears in a popover when the info button is clicked.
   * Info button will only be visible when this prop is passed.
   */
  info?: ReactNode;

  // Validation and errors
  /**
   * Error object - only truthy values will be rendered
   * Compatible with UI-Kit FieldErrors format
   */
  errors?: TFieldErrors;
  renderError?: (errorKey: string) => ReactNode;
  /**
   * Indicates whether the field was touched. Errors will only be shown when the field was touched.
   */
  touched?: boolean;

  // Field state
  /**
   * Indicates if the value is required. Shows the "required asterisk" if so.
   */
  isRequired?: boolean;

  /**
   * Indicates that the input cannot be modified (e.g not authorized, or changes currently saving).
   */
  isDisabled?: boolean;

  /**
   * Indicates that the field is displaying read-only content
   */
  isReadOnly?: boolean;
};
