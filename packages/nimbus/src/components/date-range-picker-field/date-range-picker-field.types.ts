import type { ReactNode } from "react";
import type { DateRangePickerProps } from "@/components/date-range-picker";
import type { TFieldErrors, TErrorRenderer } from "@/components/field-errors";

/**
 * Props for the DateRangePickerField component.
 *
 * Combines DateRangePicker functionality with form field features like labels,
 * descriptions, error handling, and validation feedback.
 */
export interface DateRangePickerFieldProps extends DateRangePickerProps {
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
   * A map of errors. Error messages for known errors are rendered automatically.
   * Unknown errors will be forwarded to `renderError`
   */
  errors?: TFieldErrors;

  /**
   * Called with custom errors. This function can return a message which will be wrapped in an ErrorMessage.
   * It can also return null to show no error.
   */
  renderError?: TErrorRenderer;

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

  // Layout
  /**
   * Direction of the form field layout
   * @default "column"
   */
  direction?: "row" | "column";

  /**
   * Size of the form field
   * @default "md"
   */
  size?: "sm" | "md";
}
