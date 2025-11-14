import type { ReactNode } from "react";
import type { MoneyInputProps } from "@/components/money-input/money-input.types";
import type { FieldErrorsData } from "@/components";
import type { FormFieldProps } from "@/components/form-field";

/**
 * Props for the MoneyInputField component.
 *
 * Combines MoneyInput functionality with form field features like labels,
 * descriptions, error handling, and validation feedback.
 *
 * Contains two focusable inputs: currency selector and amount input.
 * Style props (margin, padding, width, etc.) are applied to the root container.
 * Functional props (aria-*, data-*, id, isRequired, etc.) are applied to the form field wrapper.
 */
export type MoneyInputFieldProps = Omit<
  MoneyInputProps,
  "isInvalid" | "id" | "onChange"
> &
  Pick<
    FormFieldProps,
    "isRequired" | "isInvalid" | "isDisabled" | "isReadOnly" | "id"
  > & {
    /**
     * Used as HTML name of the input component.
     * Creates ${name}.amount and ${name}.currencyCode for the two inputs.
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
     * List of possible currencies (required for field pattern).
     * Creates a currency dropdown for selection.
     */
    currencies: string[];

    /**
     * Error object - only truthy values will be rendered
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
     * Size of the money input
     * @default "md"
     */
    size?: "sm" | "md";
  };
