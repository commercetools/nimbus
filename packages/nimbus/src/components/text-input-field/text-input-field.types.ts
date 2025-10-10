import type { TextInputProps } from "../text-input";
import type { FormFieldProps } from "../form-field/form-field.types";
import type { ReactNode } from "react";

/**
 * Props for the TextInputField component.
 *
 * Combines TextInput functionality with form field features like labels,
 * descriptions, error handling, and validation feedback.
 */
export interface TextInputFieldProps
  extends Omit<TextInputProps, "type">,
    Pick<
      FormFieldProps,
      "isRequired" | "isInvalid" | "isDisabled" | "isReadOnly" | "id"
    > {
  /**
   * Label text for the input field
   */
  label?: ReactNode;

  /**
   * Description text that appears below the input
   */
  description?: ReactNode;

  /**
   * Info content that appears in a popover when the info button is clicked.
   * Info button will only be visible when this prop is passed.
   */
  infoBox?: ReactNode;

  /**
   * Array of error messages to display
   */
  errors?: string[];
}
