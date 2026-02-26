import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";

// ============================================================
// RECIPE PROPS
// ============================================================

type FormFieldRecipeProps = {
  /**
   * Size variant of the form field
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusFormField">["size"];
  /**
   * Layout direction for label and input positioning
   * @default "column"
   */
  direction?: SlotRecipeProps<"nimbusFormField">["direction"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type FormFieldRootSlotProps = HTMLChakraProps<
  "div",
  FormFieldRecipeProps & UnstyledProp
>;

export type FormFieldLabelSlotProps = OmitInternalProps<HTMLChakraProps<"div">>;

export type FormFieldInputSlotProps = OmitInternalProps<HTMLChakraProps<"div">>;

export type FormFieldDescriptionSlotProps = OmitInternalProps<
  HTMLChakraProps<"div">
>;

export type FormFieldErrorSlotProps = OmitInternalProps<HTMLChakraProps<"div">>;

export type FormFieldPopoverSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

export type FormFieldProps = OmitInternalProps<FormFieldRootSlotProps> & {
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
