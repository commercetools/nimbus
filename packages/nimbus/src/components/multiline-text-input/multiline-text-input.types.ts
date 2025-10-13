import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react";
import type { TextFieldProps } from "react-aria-components";

export type MultilineTextInputRecipeProps = {
  size?: SlotRecipeProps<"multilineTextInput">["size"];
  variant?: SlotRecipeProps<"multilineTextInput">["variant"];
} & UnstyledProp;

export type MultilineTextInputRootSlotProps = HTMLChakraProps<
  "div",
  MultilineTextInputRecipeProps
>;

export type MultilineTextInputLeadingElementProps = HTMLChakraProps<
  "div",
  MultilineTextInputRecipeProps
>;

export type MultilineTextInputTextAreaSlotProps = HTMLChakraProps<
  "textarea",
  MultilineTextInputRecipeProps
>;

export type MultilineTextInputProps = Omit<
  MultilineTextInputRootSlotProps,
  keyof TextFieldProps | "as" | "asChild"
> &
  TextFieldProps & {
    ref?: React.Ref<HTMLTextAreaElement>;
    /**
     * When true, the textarea will automatically grow in height to fit its content.
     * This works in addition to the default draggable resize behavior.
     */
    autoGrow?: boolean;
    /**
     * Number of visible text lines for the control.
     * @default 1
     */
    rows?: number;
    /**
     * Optional element to display at the start of the input
     * Will respect text direction (left in LTR, right in RTL)
     */
    leadingElement?: React.ReactNode;
    placeholder?: string;
  };
