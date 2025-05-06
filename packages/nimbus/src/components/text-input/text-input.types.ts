import type { ChangeEvent } from "react";
import type { TextInputRootSlotProps } from "./text-input.slots";
import type { TextFieldProps } from "react-aria-components";

export interface TextInputProps
  extends TextFieldProps,
    Omit<TextInputRootSlotProps, keyof TextFieldProps | "as" | "asChild"> {
  /**
   * Callback with the original, synthetic react input-onChange event
   */
  onNativeChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
