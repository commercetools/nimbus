import type { MultilineTextInputRootSlotProps } from "./multiline-text-input.slots";
import type { TextFieldProps } from "react-aria-components";

type MultilineTextInputRecipeVariantProps = {
  /**
   * Size variant
   * @default "md"
   */
  size?: "sm" | "md";
  /**
   * Variant variant
   * @default "solid"
   */
  variant?: "solid" | "ghost";
};

export type MultilineTextInputProps = MultilineTextInputRecipeVariantProps &
  TextFieldProps &
  Omit<
    MultilineTextInputRootSlotProps,
    keyof TextFieldProps | "as" | "asChild"
  > & {
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
