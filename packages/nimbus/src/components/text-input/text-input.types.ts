import type { TextInputRootSlotProps } from "./text-input.slots";
import type { TextFieldProps } from "react-aria-components";

export interface TextInputProps
  extends TextFieldProps,
    Omit<TextInputRootSlotProps, keyof TextFieldProps | "as" | "asChild"> {
  ref?: React.Ref<HTMLInputElement>;
}
