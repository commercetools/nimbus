import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { TextFieldProps as RaTextFieldProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

type TextInputRecipeProps = {
  size?: SlotRecipeProps<"textInput">["size"];
  variant?: SlotRecipeProps<"textInput">["variant"];
};

// ============================================================
// SLOT PROPS
// ============================================================

export type TextInputRootSlotProps = HTMLChakraProps<
  "div",
  TextInputRecipeProps
>;

export type TextInputLeadingElementSlotProps = HTMLChakraProps<"div">;

export type TextInputInputSlotProps = HTMLChakraProps<"input">;

export type TextInputTrailingElementSlotProps = HTMLChakraProps<"div">;

// ============================================================
// MAIN PROPS
// ============================================================

export type TextInputProps = Omit<
  TextInputRootSlotProps,
  keyof RaTextFieldProps | "as" | "asChild"
> &
  Omit<RaTextFieldProps, "ref"> & {
    ref?: React.Ref<HTMLInputElement>;
    leadingElement?: React.ReactNode;
    trailingElement?: React.ReactNode;
    placeholder?: string;
  };
