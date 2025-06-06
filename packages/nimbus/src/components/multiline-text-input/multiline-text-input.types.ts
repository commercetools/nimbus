import type { MultilineTextInputRootSlotProps } from "./multiline-text-input.slots";
import type { TextFieldProps } from "react-aria-components";

export interface MultilineTextInputProps
  extends TextFieldProps,
    Omit<
      MultilineTextInputRootSlotProps,
      keyof TextFieldProps | "as" | "asChild"
    > {
  ref?: React.Ref<HTMLTextAreaElement>;
  /**
   * When true, the textarea will automatically grow in height to fit its content.
   * This works in addition to the default draggable resize behavior.
   */
  autoGrow?: boolean;
}
