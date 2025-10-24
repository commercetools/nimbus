import type { ReactNode } from "react";
import type { DateRangePickerProps } from "@/components/date-range-picker";
import type { FieldErrorsData } from "@/components";

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
  errors?: FieldErrorsData;
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
