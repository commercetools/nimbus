import type { PasswordInputProps } from "@/components/password-input/password-input.types";
import type { FormFieldProps } from "@/components/form-field/form-field.types";
import type { ReactNode } from "react";
import type { FieldErrorsData } from "@/components/field-errors/field-errors.types";

/**
 * Props for the PasswordInputField component.
 *
 * Combines PasswordInput functionality with form field features like labels,
 * descriptions, error handling, and validation feedback.
 *
 * Style props (margin, padding, width, etc.) are applied to the input element.
 * Functional props (aria-*, data-*, id, isRequired, etc.) are applied to the form field wrapper.
 */
export type PasswordInputFieldProps = PasswordInputProps &
  Pick<
    FormFieldProps,
    "isRequired" | "isInvalid" | "isDisabled" | "isReadOnly" | "id"
  > & {
    /**
     * Label text for the input field (required for accessibility)
     */
    label: ReactNode;

    /**
     * Description text that appears below the input
     */
    description?: ReactNode;

    /**
     * Info content that appears in a popover when the info button is clicked.
     * Info button will only be visible when this prop is passed.
     */
    info?: ReactNode;
    /**
     * Indicates whether the field was touched. Errors will only be shown when the field was touched.
     */
    touched?: boolean;
    /**
     * Error object - only truthy values will be rendered
     * Compatible with FieldErrors format
     */
    errors?: FieldErrorsData;
    renderError?: (errorKey: string) => ReactNode;
    /**
     * Size of the text input
     * @default "md"
     */
    size?: "sm" | "md";
  };
