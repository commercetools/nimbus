import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import { type InputProps as RaInputProps } from "react-aria-components";
import type {
  AriaButtonProps as RaButtonProps,
  AriaNumberFieldProps as RaNumberFieldProps,
} from "react-aria";

// ============================================================
// RECIPE PROPS
// ============================================================

export type NumberInputRecipeProps = {
  size?: SlotRecipeProps<"numberInput">["size"];
  variant?: SlotRecipeProps<"numberInput">["variant"];
} & UnstyledProp;

// ============================================================
// SLOT PROPS
// ============================================================

export type NumberInputRootSlotProps = HTMLChakraProps<
  "div",
  NumberInputRecipeProps
> & {
  name?: string;
};

export type NumberInputLeadingElementSlotProps = HTMLChakraProps<
  "div",
  NumberInputRecipeProps
>;

export type NumberInputTrailingElementSlotProps = HTMLChakraProps<
  "div",
  NumberInputRecipeProps
>;

export type NumberInputInputSlotProps = HTMLChakraProps<
  "input",
  NumberInputRecipeProps
> &
  RaInputProps;

export type NumberInputIncrementButtonSlotProps = HTMLChakraProps<
  "button",
  NumberInputRecipeProps
> &
  RaButtonProps;

export type NumberInputDecrementButtonSlotProps = HTMLChakraProps<
  "button",
  NumberInputRecipeProps
> &
  RaButtonProps;

// ============================================================
// HELPER TYPES
// ============================================================

export type ExcludedNumberInputProps = "asChild" | "onChange";

// ============================================================
// MAIN PROPS
// ============================================================

export type NumberInputProps = Omit<
  NumberInputRootSlotProps,
  keyof RaNumberFieldProps | ExcludedNumberInputProps
> &
  RaNumberFieldProps & {
    ref?: React.Ref<HTMLInputElement>;
    leadingElement?: React.ReactNode;
    trailingElement?: React.ReactNode;
  };
