import type { TextInputProps } from "@/components/text-input";
import type { FormFieldProps } from "@/components/form-field";
import type { ReactNode } from "react";
import type { FieldErrorsData } from "@/components/field-errors";

/**
 * Props for the TextInputField component.
 *
 * Combines TextInput functionality with form field features like labels,
 * descriptions, error handling, and validation feedback.
 *
 * Style props (margin, padding, width, etc.) are applied to the input element.
 * Functional props (aria-*, data-*, id, isRequired, etc.) are applied to the form field wrapper.
 */
export type TextInputFieldProps = Omit<TextInputProps, "type"> &
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
     * @see {@link https://github.com/commercetools/nimbus/blob/main/packages/nimbus/src/components/field-errors/field-errors.types.ts#L8}
     */
    errors?: FieldErrorsData;
    renderError?: (errorKey: string) => ReactNode;
  };
