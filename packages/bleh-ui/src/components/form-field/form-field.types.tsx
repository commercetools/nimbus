import type { FormFieldRootSlotProps } from "./form-field.slots";

/**
 * Combines the root props with Chakra UI's recipe variant props.
 * This allows the component to accept both structural props from Root
 * and styling variants from the recipe.
 */
type FormFieldVariantProps = FormFieldRootSlotProps;

/**
 * Main props interface for the FormField component.
 * Extends FormFieldVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export interface FormFieldProps extends FormFieldVariantProps {
  children?: React.ReactNode;
  /** the value of the form field */
  value?: unknown;
  /** true if the field is a required field */
  isRequired?: boolean;
  /** callback, called when the field value was changed */
  onChange?: (value: unknown) => void;
  /** callback, called when the input is blurred */
  onBlur?: () => void;
  /** true if the field is invalid */
  isInvalid?: boolean;
  /** true if the field is disabled */
  isDisabled?: boolean;
}
