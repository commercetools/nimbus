import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";

// ============================================================
// RECIPE PROPS
// ============================================================

type FormFieldRecipeProps = {
  size?: SlotRecipeProps<"formField">["size"];
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
