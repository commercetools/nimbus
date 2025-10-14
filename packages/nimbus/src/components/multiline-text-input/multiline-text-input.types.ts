import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { TextFieldProps as RaTextFieldProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

export type MultilineTextInputRecipeProps = {
  size?: SlotRecipeProps<"multilineTextInput">["size"];
  variant?: SlotRecipeProps<"multilineTextInput">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type MultilineTextInputRootSlotProps = HTMLChakraProps<
  "div",
  MultilineTextInputRecipeProps
>;

export type MultilineTextInputLeadingElementSlotProps = HTMLChakraProps<
  "div",
  MultilineTextInputRecipeProps
>;

export type MultilineTextInputTextAreaSlotProps = HTMLChakraProps<
  "textarea",
  MultilineTextInputRecipeProps
>;

// ============================================================
// MAIN PROPS
// ============================================================

export type MultilineTextInputProps = Omit<
  MultilineTextInputRootSlotProps,
  keyof RaTextFieldProps | "as" | "asChild"
> &
  RaTextFieldProps & {
    ref?: React.Ref<HTMLTextAreaElement>;
    autoGrow?: boolean;
    rows?: number;
    leadingElement?: React.ReactNode;
    placeholder?: string;
  };
