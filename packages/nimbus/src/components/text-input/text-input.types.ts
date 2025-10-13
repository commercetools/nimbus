import type { HTMLChakraProps, SlotRecipeProps } from "@chakra-ui/react";
import type { TextFieldProps } from "react-aria-components";

type TextInputRecipeProps = {
  size?: SlotRecipeProps<"textInput">["size"];
  variant?: SlotRecipeProps<"textInput">["variant"];
};

export type TextInputRootProps = HTMLChakraProps<"div", TextInputRecipeProps>;

export type TextInputLeadingElementProps = HTMLChakraProps<"div">;

export type TextInputInputProps = HTMLChakraProps<"input">;

export type TextInputTrailingElementProps = HTMLChakraProps<"div">;

export type TextInputProps = Omit<
  TextInputRootProps,
  keyof TextFieldProps | "as" | "asChild"
> &
  Omit<TextFieldProps, "ref"> & {
    /**
     * React ref to be forwarded to the input element
     */
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
    placeholder?: string;
  };
