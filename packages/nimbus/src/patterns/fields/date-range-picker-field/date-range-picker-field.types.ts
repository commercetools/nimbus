import type { ReactNode } from "react";
import type { DateRangePickerProps } from "@/components/date-range-picker/date-range-picker.types";
import type { FieldErrorsData } from "@/components";
import type { FormFieldProps } from "@/components/form-field";

/**
 * Props for the DateRangePickerField component.
 *
 * Combines DateRangePicker functionality with form field features like labels,
 * descriptions, error handling, and validation feedback.
 */
export type DateRangePickerFieldProps = Omit<
  DateRangePickerProps,
  "label" | "description" | "errorMessage"
> &
  Pick<
    FormFieldProps,
    "isRequired" | "isInvalid" | "isDisabled" | "isReadOnly" | "id"
  > & {
    /**
     * Used as HTML name of the input component.
     */
    name?: string;

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

    /**
     * Error object - only truthy values will be rendered
     * Compatible with UI-Kit FieldErrors format
     */
    errors?: FieldErrorsData;

    /**
     * Custom error renderer function
     */
    renderError?: (errorKey: string) => ReactNode;

    /**
     * Indicates whether the field was touched. Errors will only be shown when the field was touched.
     */
    touched?: boolean;

    /**
     * Direction of the form field layout
     * @default "column"
     */
    direction?: "row" | "column";

    /**
     * Size of the date range picker input
     * @default "md"
     */
    size?: "sm" | "md";
  };
