import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  SlotRecipeProps,
  UnstyledProp,
} from "@chakra-ui/react/styled-system";
import type { TextFieldProps as RaTextFieldProps } from "react-aria-components";

// ============================================================
// RECIPE PROPS
// ============================================================

export type MultilineTextInputRecipeProps = {
  /**
   * Size variant of the multiline text input
   * @default "md"
   */
  size?: SlotRecipeProps<"nimbusMultilineTextInput">["size"];
  /**
   * Visual style variant of the multiline text input
   * @default "solid"
   */
  variant?: SlotRecipeProps<"nimbusMultilineTextInput">["variant"];
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

export type MultilineTextInputProps = OmitInternalProps<
  MultilineTextInputRootSlotProps,
  keyof RaTextFieldProps
> &
  RaTextFieldProps & {
    /**
     * Ref forwarding to the textarea element
     */
    ref?: React.Ref<HTMLTextAreaElement>;
    /**
     * Whether the textarea should automatically adjust its height based on content
     * @default false
     */
    autoGrow?: boolean;
    /**
     * Number of visible text rows
     * @default 1
     */
    rows?: number;
    /**
     * Optional element to display at the start of the textarea
     * Respects text direction (left in LTR, right in RTL)
     */
    leadingElement?: React.ReactNode;
    /**
     * Placeholder text for the textarea
     */
    placeholder?: string;
  };
