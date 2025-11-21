import type { ReactNode } from "react";
import type { NumberInputProps } from "@/components/number-input/number-input.types";
import type { FieldErrorsData } from "@/components";
import type { FormFieldProps } from "@/components/form-field";

/**
 * Props for the NumberInputField component.
 *
 * Combines NumberInput functionality with form field features like labels,
 * descriptions, error handling, and validation feedback.
 *
 * Style props (margin, padding, width, etc.) are applied to the input element.
 * Functional props (aria-*, data-*, id, isRequired, etc.) are applied to the form field wrapper.
 */
export type NumberInputFieldProps = Omit<NumberInputProps, "isInvalid" | "id"> &
  Pick<
    FormFieldProps,
    "isRequired" | "isInvalid" | "isDisabled" | "isReadOnly" | "id"
  > & {
    /**
     * Used as HTML name of the input component.
     */
    name?: string;

    /**
     * Label text for the input field (required for accessibility)
     */
    label: string | ReactNode;

    /**
     * Description text that appears below the input
     */
    description?: string | ReactNode;

    /**
     * Info content that appears in a popover when the info button is clicked.
     * Info button will only be visible when this prop is passed.
     */
    info?: ReactNode;

    /**
     * Error object - only truthy values will be rendered
     * Compatible with FieldErrors format
     * TODO: update this link to point to the FieldErrors docs once they are implemented
     * @see {@link https://github.com/commercetools/nimbus/blob/main/packages/nimbus/src/components/field-errors/field-errors.types.ts#L8}
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
     * Size of the number input
     * @default "md"
     */
    size?: "sm" | "md";
  };
