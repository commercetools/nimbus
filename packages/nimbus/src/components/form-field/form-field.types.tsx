import type { FormFieldRootSlotProps } from "./form-field.slots";

type FormFieldRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "md" | "sm";
  /**
   * Direction variant
   * @default "column"
   */
  direction?: "column" | "row";
};

/**
 * Main props interface for the FormField component.
 * Extends FormFieldVariantProps to include both root props and variant props,
 * while adding support for React children.
 */
export type FormFieldProps = FormFieldRecipeVariantProps &
  FormFieldRootSlotProps & {
    children?: React.ReactNode;
    /** true if the field is a required field */
    isRequired?: boolean;
    /** true if the field is invalid */
    isInvalid?: boolean;
    /** true if the field is disabled */
    isDisabled?: boolean;
    /** true, if the field is read only  */
    isReadOnly?: boolean;
    /** id passed to the field's input component*/
    id?: string;
    /**
     * React ref to be forwarded to the root element
     */
    ref?: React.Ref<HTMLDivElement>;
  };
