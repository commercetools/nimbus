import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type FormFieldRecipeProps = {
  /**
   * Size variant of the form field
   * @default "md"
   */
  size?: SlotRecipeProps<"formField">["size"];
  /**
   * Layout direction for label and input positioning
   * @default "column"
   */
  direction?: SlotRecipeProps<"formField">["direction"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type FormFieldRootSlotProps = HTMLChakraProps<
  "div",
  FormFieldRecipeProps & UnstyledProp
>;

export type FormFieldLabelSlotProps = HTMLChakraProps<"div">;

export type FormFieldInputSlotProps = HTMLChakraProps<"div">;

export type FormFieldDescriptionSlotProps = HTMLChakraProps<"div">;

export type FormFieldErrorSlotProps = HTMLChakraProps<"div">;

export type FormFieldPopoverSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

export type FormFieldProps = FormFieldRootSlotProps & {
  /**
   * Form field content (label, input, description, error)
   */
  children?: React.ReactNode;
  /**
   * Whether the field is required for form submission
   * @default false
   */
  isRequired?: boolean;
  /**
   * Whether the field has a validation error
   * @default false
   */
  isInvalid?: boolean;
  /**
   * Whether the field is disabled
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Whether the field is read-only
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * Unique identifier for the input element
   */
  id?: string;
  /**
   * Ref forwarding to the root element
   */
  ref?: React.Ref<HTMLDivElement>;
};
