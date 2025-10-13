import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import { type InputProps as RaInputProps } from "react-aria-components";
import type { AriaButtonProps, AriaNumberFieldProps } from "react-aria";

export type NumberInputRecipeProps = {
  size?: SlotRecipeProps<"numberInput">["size"];
  variant?: SlotRecipeProps<"numberInput">["variant"];
} & UnstyledProp;

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
  AriaButtonProps;

export type NumberInputDecrementButtonSlotProps = HTMLChakraProps<
  "button",
  NumberInputRecipeProps
> &
  AriaButtonProps;

export type ExcludedNumberInputProps = "asChild" | "onChange";

export type NumberInputProps = Omit<
  NumberInputRootSlotProps,
  keyof AriaNumberFieldProps | ExcludedNumberInputProps
> &
  AriaNumberFieldProps & {
    ref?: React.Ref<HTMLInputElement>;
    /**
     * Optional element to display at the start of the input
     * Will respect text direction (left in LTR, right in RTL)
     */
    leadingElement?: React.ReactNode;

    /**
     * Optional element to display at the end of the input
     * Will respect text direction (right in LTR, left in RTL)
     */
    trailingElement?: React.ReactNode;
  };
