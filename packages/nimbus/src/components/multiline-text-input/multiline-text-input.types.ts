import type { OmitInternalProps } from "../../type-utils/omit-props";
import type {
  HTMLChakraProps,
  UnstyledProp,
  ConditionalValue,
} from "@chakra-ui/react";
import type { TextFieldProps as RaTextFieldProps } from "react-aria-components";
import type {
  MultilineTextInputSize,
  MultilineTextInputVariant,
} from "./multiline-text-input.recipe";

// ============================================================
// RECIPE PROPS
// ============================================================

export type MultilineTextInputRecipeProps = {
  /**
   * Size variant of the multiline text input
   * @default "md"
   */
  size?: ConditionalValue<MultilineTextInputSize | undefined>;
  /**
   * Visual style variant of the multiline text input
   * @default "solid"
   */
  variant?: ConditionalValue<MultilineTextInputVariant | undefined>;
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
