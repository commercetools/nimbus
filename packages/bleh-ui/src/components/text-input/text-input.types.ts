import type { TextInputRootProps } from "./text-input.slots";
import type { TextFieldProps } from "react-aria-components";

// Helper type to merge props and resolve conflicts
export interface TextInputProps
  extends TextFieldProps,
    Omit<TextInputRootProps, keyof TextFieldProps | "as" | "asChild"> {}
